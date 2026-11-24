# Developer Guide

## Project Structure

```
black-friday-tracker/
├── src/
│   ├── extension.ts                 # Main extension entry point
│   ├── providers/
│   │   ├── wishlistProvider.ts      # Wishlist tree view
│   │   ├── priceAlertProvider.ts    # Price alerts tree view
│   │   └── statsProvider.ts         # Statistics tree view
│   └── services/
│       ├── storageManager.ts        # VS Code storage wrapper
│       ├── priceTracker.ts          # Price monitoring logic
│       └── notificationService.ts   # Notifications & alerts
├── media/
│   └── shopping-icon.svg            # Extension icon
├── package.json                     # Extension manifest
├── tsconfig.json                    # TypeScript config
├── build.bat                        # Windows build script
├── scripts/
│   └── release.sh                   # Linux/Mac build script
├── README.md                        # User documentation
├── QUICKSTART.md                    # Quick start guide
├── CONTRIBUTING.md                  # Contribution guidelines
├── CHANGELOG.md                     # Version history
└── LICENSE                          # MIT License
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- VS Code 1.80.0 or later
- Git

### Setup Development Environment

**Windows:**
```bash
npm install
npm run build
```

**Linux/Mac:**
```bash
./scripts/release.sh setup-dev
```

### Common Development Tasks

#### Watch for Changes (Live Reload)
```bash
npm run watch
```

#### Build the Extension
```bash
npm run build
```

#### Lint Code
```bash
npm run lint
```

#### Clean Build Artifacts
```bash
npm run clean
```

## Architecture

### Core Components

#### 1. **StorageManager** (`src/services/storageManager.ts`)
- Manages all persistent data in VS Code globalState
- Handles wishlist items, price records, and alerts
- Provides methods to add/update/delete items
- Exports data to CSV format

**Key Methods:**
```typescript
addItem(item: WishlistItem): void
updateItem(item: WishlistItem): void
deleteItem(itemId: string): void
addPriceRecord(itemId, retailer, price, onSale): void
getAlerts(): PriceAlert[]
exportToCSV(): string
```

#### 2. **PriceTracker** (`src/services/priceTracker.ts`)
- Monitors prices across all retailers
- Runs on a configurable interval
- Handles HTTP requests with rate limiting
- Scrapes prices using cheerio HTML parsing
- Triggers notifications when prices drop

**Key Methods:**
```typescript
startMonitoring(priceAlertProvider, wishlistProvider): void
stopMonitoring(): void
checkAllPrices(): Promise<void>
getPriceForRetailer(itemName, retailer): Promise<number|null>
```

#### 3. **NotificationService** (`src/services/notificationService.ts`)
- Sends VS Code notifications
- Handles SMS notifications via Twilio
- Shows status bar alerts
- Opens shopping links directly

**Key Methods:**
```typescript
sendNotification(item, retailer, price, currentPrice): void
sendSMSNotification(message, item): void
openShoppingLink(item, retailer): void
showStatusBarAlert(message): void
```

#### 4. **Tree Data Providers** (`src/providers/`)
- Display data in VS Code sidebar
- Provide interaction points for user
- Three views: Wishlist, Alerts, Statistics

**Provider Types:**
- `WishlistProvider`: Shows items and prices
- `PriceAlertProvider`: Shows price drop alerts
- `StatsProvider`: Shows savings statistics

### Data Flow

```
User adds item → Extension → StorageManager (store data)
                              ↓
                        PriceTracker (start monitoring)
                              ↓
                        Scheduled check (every hour)
                              ↓
                        Check each retailer (with delays)
                              ↓
                        StorageManager (save prices)
                              ↓
                        Check if meets target → NotificationService
                              ↓
                        UI providers refresh (show latest data)
```

## Adding Support for a New Retailer

### Step 1: Add Retailer to Configuration

Edit `package.json` extension contributions:
```json
"blackFridayTracker.retailers": {
  "type": "array",
  "default": ["walmart", "amazon", "sams", "bestbuy", "target", "ebay", "harborfreight", "booksamillion", "newretailer"],
}
```

### Step 2: Implement Price Checker

Add method to `PriceTracker` class:

```typescript
private async checkNewRetailer(query: string): Promise<number | null> {
  try {
    const response = await axios.get(`https://www.newretailer.com/search?q=${query}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 5000
    });
    const $ = cheerio.load(response.data);
    const priceText = $('[selector-for-price]').first().text();
    const price = parseFloat(priceText.replace(/[$,]/g, ''));
    return isNaN(price) ? null : price;
  } catch (error) {
    return null;
  }
}
```

### Step 3: Register in Switch Statement

Update `getPriceForRetailer` method:
```typescript
case 'newretailer':
  return await this.checkNewRetailer(searchQuery);
```

### Step 4: Update Documentation

- Add to README.md retailer list
- Add to CONTRIBUTING.md examples
- Update CHANGELOG.md with feature

## Debugging

### Enable Debug Output

Add to `extension.ts`:
```typescript
const DEBUG = true;
if (DEBUG) console.log('Debug message');
```

### VS Code Debug Mode

1. Press `F5` to launch debug instance
2. VS Code opens new window with extension
3. Set breakpoints in code
4. Use Debug Console for inspection

### Common Issues

**Issue: Prices not updating**
- Check network connection
- Verify retailer websites are accessible
- Check browser console for CORS errors
- Increase check interval in settings

**Issue: SMS not sending**
- Verify Twilio credentials
- Check phone number format (+1234567890)
- Verify Twilio account has credits
- Check error logs

**Issue: Extension crashes on startup**
- Check TypeScript compilation errors
- Verify all imports are correct
- Check VS Code version compatibility

## Testing

### Manual Testing Checklist

- [ ] Add item to wishlist
- [ ] Check prices immediately
- [ ] Verify prices appear for all retailers
- [ ] Set target price and check alerts
- [ ] Export to CSV
- [ ] Restart VS Code and verify data persists
- [ ] Test with SMS notifications enabled
- [ ] Test multiple retailers at once

### Automated Testing

```bash
npm test
```

## Code Style Guidelines

### TypeScript/JavaScript
- Use `const` by default, `let` when needed
- Use meaningful variable names
- Add type annotations for function parameters
- Use arrow functions in callbacks
- Use async/await instead of .then()

### Comments
- Comment WHY, not WHAT
- Keep comments up to date
- Remove commented-out code

### Error Handling
- Always catch promise rejections
- Provide meaningful error messages
- Log errors for debugging

## Deployment

### VS Code Marketplace

1. **Get Personal Access Token (PAT)**
   - Go to https://dev.azure.com/
   - Create new PAT with "Marketplace" scope
   - Save it securely

2. **Publish Extension**
   ```bash
   export VSCE_PAT=your_token_here
   ./scripts/release.sh publish
   ```

   Windows:
   ```cmd
   set VSCE_PAT=your_token_here
   build.bat publish
   ```

3. **Version Update**
   - Edit version in package.json
   - Update CHANGELOG.md
   - Commit and tag release

### GitHub Releases

```bash
./scripts/release.sh release v1.1.0
```

This will:
- Build the extension
- Update version in package.json
- Create Git tag
- Push to GitHub

## Performance Optimization

### Price Checking
- Use configurable intervals (default 1 hour)
- Implement request timeouts (5 seconds)
- Add 2-second delays between retailers
- Cache prices to avoid duplicate requests

### Storage
- Limit price history to last 100 entries per item
- Clear old alerts after 24 hours
- Use efficient data structures

### UI Updates
- Only refresh relevant tree providers
- Avoid unnecessary re-renders
- Debounce status bar updates

## Security Considerations

### Data Privacy
- All data stored locally in VS Code
- No data sent to external servers (except Twilio SMS)
- Credentials stored securely

### Dependencies
- Keep dependencies up to date
- Run `npm audit` regularly
- Review dependency licenses

### Web Scraping
- Respect robots.txt
- Use appropriate User-Agent headers
- Implement delays between requests
- Handle blocking gracefully

## Troubleshooting Guide

### Build Issues

**Error: "tsconfig.json not found"**
- Run `npm install` first
- Verify TypeScript is installed

**Error: "Module not found"**
- Run `npm install`
- Check import paths

### Runtime Issues

**Extension not activating**
- Check activation events in package.json
- Verify onStartupFinished event
- Check console for errors

**Tree providers not showing**
- Verify provider is registered
- Check view ID matches
- Inspect tree data structure

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [cheerio Documentation](https://cheerio.js.org/)
- [axios Documentation](https://axios-http.com/)
- [Twilio SDK](https://www.twilio.com/docs)

---

Happy coding! 🚀
