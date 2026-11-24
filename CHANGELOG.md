# Changelog

All notable changes to Black Friday Price Tracker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- Browser extension for in-store product page quick lookup
- Mobile app for iOS/Android
- Scheduled deal emails
- Price prediction ML model
- Retail.com and Costco.com support
- Advanced filtering and sorting in wishlist
- Price drop percentage alerts

## [0.1.0] - 2024-11-24

### Added
- Initial release of Black Friday Price Tracker
- Core price tracking for 8 major retailers:
  - Walmart
  - Amazon
  - Sam's Club
  - Best Buy
  - Target
  - eBay
  - Harbor Freight
  - Books-A-Million
- Wishlist management with target price tracking
- Automatic price monitoring with configurable intervals (default: 1 hour)
- Price alert system:
  - VS Code notifications
  - SMS notifications via Twilio
  - Status bar alerts for significant drops
- Price history tracking
- Savings statistics and analytics
- CSV export of price history
- Local data storage in VS Code
- Price trend visualization with Chart.js
- Sidebar panel UI with three views:
  - Wishlist view
  - Price alerts view
  - Savings statistics view

### Technical Details
- Built with TypeScript and VS Code Extension API
- Uses axios for HTTP requests and cheerio for HTML parsing
- Respects rate limiting (2-second delay between retailer checks)
- Graceful error handling for blocked requests

### Known Limitations
- Some retailers have anti-scraping protections
- Dynamic pricing may show different prices for different users
- Requires internet connection for price checking
- SMS notifications require Twilio setup and credits

---

## Version History Notes

### How to Update

1. **Automatic Updates**: VS Code automatically checks for and installs updates
2. **Manual Update**: 
   - Open VS Code
   - Go to Extensions
   - Find "Black Friday Price Tracker"
   - If update available, click "Update"

### Reporting Issues

Found a bug? Please report it on [GitHub Issues](https://github.com/rhizo-script/black-friday-tracker/issues)

Include:
- VS Code version
- Extension version (shown in extensions panel)
- Steps to reproduce
- Expected vs actual behavior

### Feature Requests

Have an idea? Open a [Feature Request](https://github.com/rhizo-script/black-friday-tracker/discussions)

---

## Release Schedule

- **Major versions** (v1.0, v2.0): New features and architecture changes
- **Minor versions** (v1.1, v1.2): New features and improvements
- **Patch versions** (v1.0.1, v1.0.2): Bug fixes only

Typically released on:
- **Weekly**: Bug fixes and small improvements
- **Monthly**: New features and major improvements
- **As needed**: Critical bug fixes

## Support

- 📧 Issues: [GitHub Issues](https://github.com/rhizo-script/black-friday-tracker/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/rhizo-script/black-friday-tracker/discussions)
- 📖 Docs: [README](README.md) and [Quick Start](QUICKSTART.md)
