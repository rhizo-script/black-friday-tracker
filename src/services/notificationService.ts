import * as vscode from 'vscode';
import { StorageManager } from './storageManager';
import { PriceTracker } from './priceTracker';

export class NotificationService {
  constructor(
    private context: vscode.ExtensionContext,
    private storageManager: StorageManager
  ) {}

  async sendNotification(item: any, retailer: string, price: number, currentPrice: number) {
    const message = `🎉 ${item.name} is on sale at ${retailer}! Now $${price} (was $${currentPrice})`;
    
    // VS Code notification
    const action = await vscode.window.showInformationMessage(
      message,
      'View Item',
      'Set New Target'
    );

    if (action === 'View Item') {
      this.openShoppingLink(item, retailer);
    } else if (action === 'Set New Target') {
      this.setNewTarget(item);
    }

    // SMS notification (if configured)
    await this.sendSMSNotification(message, item);
  }

  private async sendSMSNotification(message: string, item: any) {
    const config = vscode.workspace.getConfiguration('blackFridayTracker');
    
    if (!config.get('enableSmsNotifications')) return;

    const accountSid = config.get('twilioAccountSid') as string;
    const authToken = config.get('twilioAuthToken') as string;
    const toNumber = config.get('phoneNumber') as string;
    const fromNumber = config.get('twilioPhoneNumber') as string;

    if (!accountSid || !authToken || !toNumber || !fromNumber) {
      vscode.window.showWarningMessage(
        'SMS notifications not configured. Set Twilio credentials in settings.'
      );
      return;
    }

    try {
      const twilio = require('twilio');
      const client = twilio(accountSid, authToken);
      
      await client.messages.create({
        body: message.substring(0, 160),
        from: fromNumber,
        to: toNumber
      });

      console.log('SMS sent successfully');
    } catch (error) {
      console.error('Failed to send SMS:', error);
      vscode.window.showErrorMessage('Failed to send SMS notification');
    }
  }

  private openShoppingLink(item: any, retailer: string) {
    const baseUrls: { [key: string]: string } = {
      amazon: 'https://www.amazon.com/s?k=',
      walmart: 'https://www.walmart.com/search?q=',
      target: 'https://www.target.com/s?searchTerm=',
      bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=',
      ebay: 'https://www.ebay.com/sch/i.html?_nkw=',
      sams: 'https://www.samsclub.com/search?query=',
      harborfreight: 'https://www.harborfreight.com/search?q=',
      booksamillion: 'https://www.booksamillion.com/search?searchString='
    };

    const url = baseUrls[retailer.toLowerCase()] + encodeURIComponent(item.name);
    vscode.env.openExternal(vscode.Uri.parse(url));
  }

  private async setNewTarget(item: any) {
    const newTarget = await vscode.window.showInputBox({
      prompt: 'Enter new target price',
      value: item.targetPrice?.toString() || ''
    });

    if (newTarget) {
      item.targetPrice = parseFloat(newTarget);
      this.storageManager.updateItem(item);
      vscode.window.showInformationMessage('Target price updated!');
    }
  }

  showStatusBarAlert(message: string) {
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = `💰 ${message}`;
    statusBarItem.tooltip = 'Black Friday Alert';
    statusBarItem.show();

    setTimeout(() => statusBarItem.dispose(), 5000);
  }
}
