import * as vscode from 'vscode';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { StorageManager, WishlistItem, PriceAlert } from './storageManager';
import { NotificationService } from './notificationService';

export class PriceTracker {
  private monitoringInterval: NodeJS.Timeout | null = null;
  private notificationService: NotificationService;
  private lastCheckTime: { [key: string]: number } = {};

  constructor(
    private context: vscode.ExtensionContext,
    private storageManager: StorageManager
  ) {
    this.notificationService = new NotificationService(context, storageManager);
  }

  startMonitoring(priceAlertProvider: any, wishlistProvider: any) {
    const config = vscode.workspace.getConfiguration('blackFridayTracker');
    const interval = (config.get('checkInterval') as number) || 3600;

    console.log(`Price monitoring started (interval: ${interval}s)`);

    // Check immediately
    this.checkAllPrices().catch(e => console.error('Price check failed:', e));

    // Then check at intervals
    this.monitoringInterval = setInterval(() => {
      this.checkAllPrices()
        .then(() => {
          priceAlertProvider.refresh();
          wishlistProvider.refresh();
        })
        .catch(e => console.error('Price check failed:', e));
    }, interval * 1000);
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('Price monitoring stopped');
    }
  }

  async checkAllPrices(): Promise<void> {
    const items = this.storageManager.getItems();

    for (const item of items) {
      for (const retailer of item.retailers) {
        try {
          const price = await this.getPriceForRetailer(item.name, retailer);
          if (price !== null) {
            const previousPrice = item.currentPrices?.[retailer];
            const onSale = previousPrice ? price < previousPrice : false;

            this.storageManager.addPriceRecord(item.id, retailer, price, onSale);

            // Check if price meets target
            if (item.targetPrice && price <= item.targetPrice) {
              const alert: PriceAlert = {
                itemId: item.id,
                itemName: item.name,
                retailer,
                currentPrice: price,
                targetPrice: item.targetPrice,
                savedAmount: item.targetPrice - price,
                timestamp: new Date().toISOString()
              };
              this.storageManager.addAlert(alert);
              await this.notificationService.sendNotification(item, retailer, price, item.targetPrice);
            }

            // Show status bar alert for significant drops
            if (onSale && previousPrice && previousPrice - price >= 10) {
              this.notificationService.showStatusBarAlert(
                `${item.name}: $${price} at ${retailer}!`
              );
            }
          }
        } catch (error) {
          console.error(`Failed to check price for ${item.name} at ${retailer}:`, error);
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  private async getPriceForRetailer(itemName: string, retailer: string): Promise<number | null> {
    const searchQuery = encodeURIComponent(itemName);

    try {
      switch (retailer.toLowerCase()) {
        case 'amazon':
          return await this.checkAmazon(searchQuery);
        case 'walmart':
          return await this.checkWalmart(searchQuery);
        case 'target':
          return await this.checkTarget(searchQuery);
        case 'bestbuy':
          return await this.checkBestBuy(searchQuery);
        case 'ebay':
          return await this.checkEbay(searchQuery);
        case 'sams':
          return await this.checkSamsClub(searchQuery);
        case 'harborfreight':
          return await this.checkHarborFreight(searchQuery);
        case 'booksamillion':
          return await this.checkBooksAMillion(searchQuery);
        default:
          return null;
      }
    } catch (error) {
      console.error(`Price check error for ${retailer}:`, error);
      return null;
    }
  }

  private async checkAmazon(query: string): Promise<number | null> {
    try {
      const response = await axios.get(`https://www.amazon.com/s?k=${query}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 5000
      });
      const $ = cheerio.load(response.data);
      const priceText = $('[data-component-type="s-search-result"] .a-price-whole').first().text();
      const price = parseFloat(priceText.replace(/[$,]/g, ''));
      return isNaN(price) ? null : price;
    } catch (error) {
      return null;
    }
  }

  private async checkWalmart(query: string): Promise<number | null> {
    try {
      const response = await axios.get(`https://www.walmart.com/search?q=${query}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 5000
      });
      const $ = cheerio.load(response.data);
      const priceText = $('[data-testid="list-view-item-price"]').first().text();
      const price = parseFloat(priceText.replace(/[$,]/g, ''));
      return isNaN(price) ? null : price;
    } catch (error) {
      return null;
    }
  }

  private async checkTarget(query: string): Promise<number | null> {
    try {
      const response = await axios.get(`https://www.target.com/s?searchTerm=${query}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 5000
      });
      const $ = cheerio.load(response.data);
      const priceText = $('[data-testid="current-price"]').first().text();
      const price = parseFloat(priceText.replace(/[$,]/g, ''));
      return isNaN(price) ? null : price;
    } catch (error) {
      return null;
    }
  }

  private async checkBestBuy(query: string): Promise<number | null> {
    try {
      const response = await axios.get(`https://www.bestbuy.com/site/searchpage.jsp?st=${query}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 5000
      });
      const $ = cheerio.load(response.data);
      const priceText = $('.priceView').first().text();
      const price = parseFloat(priceText.replace(/[$,]/g, ''));
      return isNaN(price) ? null : price;
    } catch (error) {
      return null;
    }
  }

  private async checkEbay(query: string): Promise<number | null> {
    try {
      const response = await axios.get(`https://www.ebay.com/sch/i.html?_nkw=${query}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 5000
      });
      const $ = cheerio.load(response.data);
      const priceText = $('.s-item__price').first().text();
      const price = parseFloat(priceText.replace(/[$,]/g, ''));
      return isNaN(price) ? null : price;
    } catch (error) {
      return null;
    }
  }

  private async checkSamsClub(query: string): Promise<number | null> {
    try {
      const response = await axios.get(`https://www.samsclub.com/search?query=${query}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 5000
      });
      const $ = cheerio.load(response.data);
      const priceText = $('[data-testid="itemPrice"]').first().text();
      const price = parseFloat(priceText.replace(/[$,]/g, ''));
      return isNaN(price) ? null : price;
    } catch (error) {
      return null;
    }
  }

  private async checkHarborFreight(query: string): Promise<number | null> {
    try {
      const response = await axios.get(`https://www.harborfreight.com/search?q=${query}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 5000
      });
      const $ = cheerio.load(response.data);
      const priceText = $('.price').first().text();
      const price = parseFloat(priceText.replace(/[$,]/g, ''));
      return isNaN(price) ? null : price;
    } catch (error) {
      return null;
    }
  }

  private async checkBooksAMillion(query: string): Promise<number | null> {
    try {
      const response = await axios.get(`https://www.booksamillion.com/search?searchString=${query}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 5000
      });
      const $ = cheerio.load(response.data);
      const priceText = $('.productPrice').first().text();
      const price = parseFloat(priceText.replace(/[$,]/g, ''));
      return isNaN(price) ? null : price;
    } catch (error) {
      return null;
    }
  }
}
