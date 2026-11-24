# Black Friday Price Tracker

A VS Code extension that tracks prices across major retailers for TRUE Black Friday sales. Never get tricked by dynamic pricing again!

## Features

✨ **Track prices across 8 major retailers:**
- Walmart
- Amazon
- Sam's Club
- Best Buy
- Target
- eBay
- Harbor Freight
- Books-A-Million

### Core Features

🛍️ **Wishlist Management**
- Add items with target prices
- Track multiple retailers per item
- View current prices at a glance

📊 **Price Tracking**
- Automatic price monitoring (configurable intervals)
- Price history with charts
- Sale detection and tracking
- Current lowest price highlighting

🔔 **Smart Alerts**
- VS Code notifications when prices drop below target
- SMS text notifications (via Twilio)
- Status bar alerts for significant price drops
- Detailed alert history

💾 **Data & Export**
- Local storage of all data in VS Code
- CSV export for price history
- Savings statistics and analytics

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Black Friday Price Tracker"
4. Click Install

## Setup

### Basic Setup
1. Open VS Code Settings (Ctrl+,)
2. Search for "Black Friday Tracker"
3. Configure your preferences

### SMS Notifications (Optional)

To enable phone notifications:
1. Sign up for a [Twilio account](https://www.twilio.com)
2. Get your Account SID and Auth Token
3. Get a Twilio phone number
4. In VS Code Settings, add:
   - `blackFridayTracker.twilioAccountSid`: Your Twilio Account SID
   - `blackFridayTracker.twilioAuthToken`: Your Twilio Auth Token
   - `blackFridayTracker.twilioPhoneNumber`: Your Twilio phone number
   - `blackFridayTracker.phoneNumber`: Your phone number to receive SMS (+1234567890)
   - `blackFridayTracker.enableSmsNotifications`: true

## Usage

### Add Items to Wishlist

1. Click the **Black Friday Tracker** icon in the activity bar
2. Right-click in the Wishlist panel and select "Add Item to Wishlist"
3. Enter item name (e.g., "LEGO Harry Potter Castle")
4. Set target price (optional)
5. Select retailers to track
6. Done! The extension will start monitoring prices

### View Prices

- **Wishlist View**: See all items and their lowest prices
- **Price Alerts View**: See active price drop alerts
- **Stats View**: Track your total savings

### Manual Price Check

Run the command `Check All Prices Now` to update prices immediately without waiting for the scheduled check.

### Export Data

Run the command `Export Price History to CSV` to download all price tracking data as a spreadsheet.

## Configuration

```json
{
  "blackFridayTracker.checkInterval": 3600,              // Price check interval in seconds (default: 1 hour)
  "blackFridayTracker.enableNotifications": true,        // Enable VS Code notifications
  "blackFridayTracker.enableSmsNotifications": false,    // Enable SMS alerts (requires Twilio)
  "blackFridayTracker.retailers": [
    "walmart",
    "amazon",
    "sams",
    "bestbuy",
    "target",
    "ebay",
    "harborfreight",
    "booksamillion"
  ]
}
```

## Commands

- `Add Item to Wishlist` - Add a new item to track
- `Check All Prices Now` - Manually check all prices
- `Export Price History to CSV` - Export tracking data
- `Open Price Tracker Settings` - Quick access to settings
- `View Price History` - See price trends for an item

## Example Wishlist

Great items to track during Black Friday:

**For Daughter:**
- LEGO Harry Potter Castle
- Bambu 3D P2S Printer
- Harry Potter chapter books (Goblet of Fire, etc.)
- Harry Potter themed toys & collectibles
- Squishies and Fidget Toys (Needohs, etc.)
- Building and creativity sets
- Makeup and skincare
- Clothes and socks
- Jewelry
- Room decor (light blue)
- Minecraft and Roblox items

**For Son:**
- Baby boy winter clothes (6-9 months, 9-12 months)
- Baby boy socks
- Age-appropriate toys
- Forest animal or Paw Patrol room decor

**For Family:**
- Gaming chair (for 6'4" husband) - Black or dark brown
- Electric fence collar system (2 dogs)
- L-shaped leather couch (dark brown/black)
- Woodworking tools for garage
- LVP flooring (500-600 sq ft)

## How It Works

1. **Monitoring**: The extension runs in the background, checking prices at regular intervals (default: hourly)
2. **Scraping**: Uses web scraping to get the latest prices from each retailer
3. **Analysis**: Compares prices across all retailers and identifies deals
4. **Alerts**: Notifies you when prices drop below your target
5. **History**: Tracks all price changes over time for analysis

## Important Notes

⚠️ **Heads Up:**
- Some retailers may block automated price checking. We handle these gracefully.
- Price checks include a 2-second delay between retailer requests to be respectful.
- Always verify prices directly on retailer websites before purchasing.
- Dynamic pricing may show different prices for different users.

## Support & Feedback

Having issues? Want a feature?
- Create an issue on [GitHub Issues](https://github.com/rhizo-script/black-friday-tracker/issues)
- Check our [FAQ](#faq)

## FAQ

**Q: Why isn't it detecting prices?**
A: Some retailers have anti-scraping protections. We're working on improvements. Try:
- Increasing the check interval
- Verifying the item name is specific
- Checking retailer sites directly

**Q: How accurate are the prices?**
A: Prices are as accurate as the retailer's website. Dynamic pricing means prices can change frequently and vary by location/account.

**Q: Can I add more retailers?**
A: Yes! Submit a feature request with the retailer name and we'll add support.

**Q: Is my data safe?**
A: All data is stored locally in VS Code. No data is sent to external servers (except Twilio for SMS, if enabled).

## License

MIT

## Contributing

Contributions welcome! Please see our [Contributing Guide](CONTRIBUTING.md)

---

**Happy Black Friday shopping! 🎁** Make sure to get the best deals for your family!
