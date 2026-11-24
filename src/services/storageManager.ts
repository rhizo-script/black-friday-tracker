import * as vscode from 'vscode';

export interface WishlistItem {
  id: string;
  name: string;
  targetPrice?: number;
  retailers: string[];
  dateAdded: string;
  priceHistory: PriceRecord[];
  currentPrices?: { [retailer: string]: number };
  lowestPrice?: number;
  lowestRetailer?: string;
  savedAmount?: number;
}

export interface PriceRecord {
  date: string;
  retailer: string;
  price: number;
  onSale: boolean;
}

export interface PriceAlert {
  itemId: string;
  itemName: string;
  retailer: string;
  currentPrice: number;
  targetPrice: number;
  savedAmount: number;
  timestamp: string;
}

export class StorageManager {
  private readonly STORAGE_KEY = 'blackFridayTracker_items';
  private readonly ALERTS_KEY = 'blackFridayTracker_alerts';

  constructor(private context: vscode.ExtensionContext) {}

  addItem(item: WishlistItem): void {
    const items = this.getItems();
    items.push(item);
    this.context.globalState.update(this.STORAGE_KEY, items);
  }

  updateItem(item: WishlistItem): void {
    const items = this.getItems();
    const index = items.findIndex(i => i.id === item.id);
    if (index !== -1) {
      items[index] = item;
      this.context.globalState.update(this.STORAGE_KEY, items);
    }
  }

  deleteItem(itemId: string): void {
    const items = this.getItems().filter(i => i.id !== itemId);
    this.context.globalState.update(this.STORAGE_KEY, items);
  }

  getItems(): WishlistItem[] {
    return this.context.globalState.get(this.STORAGE_KEY, []);
  }

  getItem(itemId: string): WishlistItem | undefined {
    return this.getItems().find(i => i.id === itemId);
  }

  addPriceRecord(itemId: string, retailer: string, price: number, onSale: boolean = false): void {
    const item = this.getItem(itemId);
    if (!item) return;

    if (!item.priceHistory) {
      item.priceHistory = [];
    }

    item.priceHistory.push({
      date: new Date().toISOString(),
      retailer,
      price,
      onSale
    });

    // Keep only last 100 records per item
    if (item.priceHistory.length > 100) {
      item.priceHistory = item.priceHistory.slice(-100);
    }

    // Update current prices
    if (!item.currentPrices) {
      item.currentPrices = {};
    }
    item.currentPrices[retailer] = price;

    // Update lowest price
    const allPrices = Object.values(item.currentPrices);
    if (allPrices.length > 0) {
      item.lowestPrice = Math.min(...allPrices);
      const lowestEntry = Object.entries(item.currentPrices).find(
        ([_, p]) => p === item.lowestPrice
      );
      if (lowestEntry) {
        item.lowestRetailer = lowestEntry[0];
      }
    }

    // Calculate savings
    if (item.targetPrice && item.lowestPrice) {
      item.savedAmount = item.targetPrice - item.lowestPrice;
    }

    this.updateItem(item);
  }

  addAlert(alert: PriceAlert): void {
    const alerts = this.getAlerts();
    alerts.push(alert);
    this.context.globalState.update(this.ALERTS_KEY, alerts);
  }

  getAlerts(): PriceAlert[] {
    return this.context.globalState.get(this.ALERTS_KEY, []);
  }

  clearOldAlerts(hoursOld: number = 24): void {
    const alerts = this.getAlerts();
    const cutoffTime = Date.now() - hoursOld * 60 * 60 * 1000;
    const filtered = alerts.filter(a => new Date(a.timestamp).getTime() > cutoffTime);
    this.context.globalState.update(this.ALERTS_KEY, filtered);
  }

  exportToCSV(): string {
    const items = this.getItems();
    let csv = 'Item,Target Price,Lowest Price,Lowest Retailer,Saved,Retailers,Date Added\n';

    for (const item of items) {
      const retailers = item.retailers.join(';');
      csv += `"${item.name}",${item.targetPrice || ''},${item.lowestPrice || ''},${item.lowestRetailer || ''},${item.savedAmount || ''},"${retailers}",${item.dateAdded}\n`;

      if (item.priceHistory && item.priceHistory.length > 0) {
        csv += '  Date,Retailer,Price,On Sale\n';
        for (const record of item.priceHistory) {
          csv += `  ${record.date},${record.retailer},${record.price},${record.onSale}\n`;
        }
      }
    }

    return csv;
  }

  getStatistics() {
    const items = this.getItems();
    const alerts = this.getAlerts();

    let totalSavings = 0;
    let itemsWithDeals = 0;

    for (const item of items) {
      if (item.savedAmount && item.savedAmount > 0) {
        totalSavings += item.savedAmount;
        itemsWithDeals++;
      }
    }

    return {
      totalItems: items.length,
      itemsWithDeals,
      totalSavings,
      recentAlerts: alerts.length,
      averageSavingsPerItem: itemsWithDeals > 0 ? totalSavings / itemsWithDeals : 0
    };
  }
}
