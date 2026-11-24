import * as vscode from 'vscode';
import { StorageManager, PriceAlert } from '../services/storageManager';
import { PriceTracker } from '../services/priceTracker';

export class PriceAlertProvider implements vscode.TreeDataProvider<PriceAlert | TreeItemBase> {
  private _onDidChangeTreeData: vscode.EventEmitter<PriceAlert | TreeItemBase | undefined | null | void> =
    new vscode.EventEmitter<PriceAlert | TreeItemBase | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<PriceAlert | TreeItemBase | undefined | null | void> =
    this._onDidChangeTreeData.event;

  constructor(
    private context: vscode.ExtensionContext,
    private storageManager: StorageManager,
    private priceTracker: PriceTracker
  ) {}

  refresh(): void {
    this._onDidChangeTreeData.fire(null);
  }

  getTreeItem(element: PriceAlert | TreeItemBase): vscode.TreeItem {
    if (element instanceof TreeItemBase) {
      return element;
    }

    const alert = element as PriceAlert;
    const treeItem = new vscode.TreeItem(
      alert.itemName,
      vscode.TreeItemCollapsibleState.None
    );

    treeItem.iconPath = new vscode.ThemeIcon('alert');
    treeItem.description = `🎉 $${alert.currentPrice} @ ${alert.retailer} (Save $${alert.savedAmount.toFixed(2)})`;
    treeItem.contextValue = 'priceAlert';

    return treeItem;
  }

  async getChildren(element?: PriceAlert | TreeItemBase): Promise<(PriceAlert | TreeItemBase)[]> {
    if (element) {
      return [];
    }

    const alerts = this.storageManager.getAlerts();
    
    if (alerts.length === 0) {
      return [new TreeItemBase('No active alerts', vscode.TreeItemCollapsibleState.None)];
    }

    // Sort by timestamp (newest first)
    return alerts.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
}

class TreeItemBase extends vscode.TreeItem {
  constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState) {
    super(label, collapsibleState);
  }
}
