import * as vscode from 'vscode';
import { StorageManager, WishlistItem } from '../services/storageManager';
import { PriceTracker } from '../services/priceTracker';

export class WishlistProvider implements vscode.TreeDataProvider<WishlistItem | TreeItemBase> {
  private _onDidChangeTreeData: vscode.EventEmitter<WishlistItem | TreeItemBase | undefined | null | void> =
    new vscode.EventEmitter<WishlistItem | TreeItemBase | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<WishlistItem | TreeItemBase | undefined | null | void> =
    this._onDidChangeTreeData.event;

  constructor(
    private context: vscode.ExtensionContext,
    private storageManager: StorageManager,
    private priceTracker: PriceTracker
  ) {}

  refresh(): void {
    this._onDidChangeTreeData.fire(null);
  }

  getTreeItem(element: WishlistItem | TreeItemBase): vscode.TreeItem {
    if (element instanceof TreeItemBase) {
      return element;
    }

    const treeItem = new vscode.TreeItem(
      element.name,
      vscode.TreeItemCollapsibleState.Collapsed
    );

    treeItem.iconPath = new vscode.ThemeIcon('package');
    treeItem.contextValue = 'wishlistItem';

    if (element.lowestPrice) {
      treeItem.description = `💰 $${element.lowestPrice} @ ${element.lowestRetailer}`;
      if (element.savedAmount && element.savedAmount > 0) {
        treeItem.tooltip = `Save $${element.savedAmount.toFixed(2)}!`;
      }
    } else if (element.targetPrice) {
      treeItem.description = `Target: $${element.targetPrice}`;
    }

    return treeItem;
  }

  async getChildren(element?: WishlistItem | TreeItemBase): Promise<(WishlistItem | TreeItemBase)[]> {
    if (!element) {
      return this.storageManager.getItems();
    }

    if (element instanceof TreeItemBase) {
      return [];
    }

    const item = element as WishlistItem;
    const children: TreeItemBase[] = [];

    if (item.targetPrice) {
      children.push(
        new TreeItemBase(`📌 Target: $${item.targetPrice}`, vscode.TreeItemCollapsibleState.None)
      );
    }

    if (item.lowestPrice) {
      const savings = item.savedAmount ? `Save $${item.savedAmount.toFixed(2)}` : '';
      children.push(
        new TreeItemBase(
          `✅ Best Deal: $${item.lowestPrice} @ ${item.lowestRetailer} ${savings}`,
          vscode.TreeItemCollapsibleState.None
        )
      );
    }

    if (item.currentPrices) {
      children.push(
        new TreeItemBase('Retailers', vscode.TreeItemCollapsibleState.Collapsed)
      );

      const prices: TreeItemBase[] = Object.entries(item.currentPrices).map(
        ([retailer, price]) => {
          const item = new TreeItemBase(
            `${retailer}: $${price}`,
            vscode.TreeItemCollapsibleState.None
          );
          item.iconPath = new vscode.ThemeIcon('tag');
          return item;
        }
      );

      children.push(...prices);
    }

    return children;
  }

  async deleteItem(itemId: string) {
    this.storageManager.deleteItem(itemId);
    this.refresh();
  }
}

class TreeItemBase extends vscode.TreeItem {
  constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState) {
    super(label, collapsibleState);
  }
}
