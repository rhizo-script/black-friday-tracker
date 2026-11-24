import * as vscode from 'vscode';
import { StorageManager } from '../services/storageManager';

export class StatsProvider implements vscode.TreeDataProvider<TreeItemBase> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeItemBase | undefined | null | void> =
    new vscode.EventEmitter<TreeItemBase | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItemBase | undefined | null | void> =
    this._onDidChangeTreeData.event;

  constructor(
    private context: vscode.ExtensionContext,
    private storageManager: StorageManager
  ) {
    // Refresh stats every 10 seconds
    setInterval(() => this._onDidChangeTreeData.fire(null), 10000);
  }

  getTreeItem(element: TreeItemBase): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: TreeItemBase): Promise<TreeItemBase[]> {
    if (element) {
      return [];
    }

    const stats = this.storageManager.getStatistics();
    const children: TreeItemBase[] = [];

    children.push(
      new TreeItemBase(
        `📊 Total Items: ${stats.totalItems}`,
        vscode.TreeItemCollapsibleState.None
      )
    );

    children.push(
      new TreeItemBase(
        `🎯 Items with Deals: ${stats.itemsWithDeals}`,
        vscode.TreeItemCollapsibleState.None
      )
    );

    children.push(
      new TreeItemBase(
        `💰 Total Savings: $${stats.totalSavings.toFixed(2)}`,
        vscode.TreeItemCollapsibleState.None
      )
    );

    children.push(
      new TreeItemBase(
        `📈 Avg Savings/Item: $${stats.averageSavingsPerItem.toFixed(2)}`,
        vscode.TreeItemCollapsibleState.None
      )
    );

    children.push(
      new TreeItemBase(
        `🔔 Recent Alerts: ${stats.recentAlerts}`,
        vscode.TreeItemCollapsibleState.None
      )
    );

    return children;
  }
}

class TreeItemBase extends vscode.TreeItem {
  constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState) {
    super(label, collapsibleState);
    this.iconPath = new vscode.ThemeIcon('info');
  }
}
