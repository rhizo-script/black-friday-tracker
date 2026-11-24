# Quick Reference: Building & Updating the Extension

## 📋 All Documentation Files

| Document | Purpose | For |
|----------|---------|-----|
| [README.md](README.md) | Main documentation & features | Users |
| [QUICKSTART.md](QUICKSTART.md) | 2-minute setup guide | New users |
| [CHANGELOG.md](CHANGELOG.md) | Version history & release notes | Everyone |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute code | Contributors |
| [DEVELOPER.md](DEVELOPER.md) | Architecture & technical details | Developers |
| [MAINTENANCE.md](MAINTENANCE.md) | Build, deploy, & maintenance | Developers |
| [REFERENCE.md](REFERENCE.md) (this file) | Quick reference & commands | Developers & Maintainers |

---

## 🚀 Quick Start for Developers

### Windows

```cmd
# Clone and setup
git clone https://github.com/rhizo-script/black-friday-tracker.git
cd black-friday-tracker
build.bat setup-dev

# Start developing
npm run watch
# Press F5 to debug
```

### Mac/Linux

```bash
# Clone and setup
git clone https://github.com/rhizo-script/black-friday-tracker.git
cd black-friday-tracker
./scripts/release.sh setup-dev

# Start developing
npm run watch
# Press F5 to debug
```

---

## 🔨 Build Commands

### Windows (`build.bat`)

| Command | Purpose |
|---------|---------|
| `build.bat install` | Install npm dependencies |
| `build.bat build` | Build TypeScript |
| `build.bat lint` | Lint code |
| `build.bat watch` | Watch files for changes |
| `build.bat package` | Create .vsix package |
| `build.bat publish` | Publish to VS Code Marketplace |
| `build.bat release v1.0.0` | Create GitHub release |
| `build.bat update` | Update dependencies |
| `build.bat clean` | Remove build artifacts |

### Mac/Linux (`scripts/release.sh`)

```bash
./scripts/release.sh install      # Install dependencies
./scripts/release.sh build        # Build TypeScript
./scripts/release.sh lint         # Lint code
./scripts/release.sh watch        # Watch for changes
./scripts/release.sh package      # Create .vsix
./scripts/release.sh publish      # Publish to Marketplace
./scripts/release.sh release v1.0.0  # Create release
./scripts/release.sh update       # Update dependencies
./scripts/release.sh clean        # Clean artifacts
```

---

## 📦 Publishing & Releasing

### Publish to VS Code Marketplace

**Prerequisites:**
1. Get Personal Access Token (PAT) from https://dev.azure.com/
2. Set environment variable

**Windows:**
```cmd
set VSCE_PAT=your_token_here
build.bat publish
```

**Mac/Linux:**
```bash
export VSCE_PAT=your_token_here
./scripts/release.sh publish
```

### Create GitHub Release

**Prerequisites:**
1. Update version in `package.json`
2. Update `CHANGELOG.md`

**Windows:**
```cmd
build.bat release v1.0.0
```

**Mac/Linux:**
```bash
./scripts/release.sh release v1.0.0
```

This will:
- Build the extension
- Update version
- Create Git commit
- Create Git tag
- Push to GitHub

---

## 🔄 Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/my-feature
```

### 2. Watch for Changes
```bash
npm run watch
```

### 3. Test in Debug (F5 in VS Code)
- Changes auto-recompile
- Reload window (Ctrl+R) in debug instance

### 4. Commit When Ready
```bash
git add .
git commit -m "Description of changes"
```

### 5. Push to Fork
```bash
git push origin feature/my-feature
```

### 6. Create Pull Request
- Go to GitHub
- Create PR from your fork

---

## 🧪 Testing Checklist

Before publishing a new version:

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes (or is acceptable)
- [ ] Add item to wishlist
- [ ] Check prices immediately
- [ ] View price history
- [ ] Export to CSV
- [ ] Restart VS Code
- [ ] Data persists after restart
- [ ] SMS notifications work (if configured)
- [ ] All 8 retailers respond

---

## 📚 Adding a New Retailer

1. **Add to configuration** (package.json)
   ```json
   "default": ["walmart", ..., "newretailer"]
   ```

2. **Implement checker** (src/services/priceTracker.ts)
   ```typescript
   private async checkNewRetailer(query: string): Promise<number | null> {
     // Implementation
   }
   ```

3. **Register in switch** (src/services/priceTracker.ts)
   ```typescript
   case 'newretailer':
     return await this.checkNewRetailer(searchQuery);
   ```

4. **Test thoroughly**
   ```bash
   npm run build
   # Test in debug mode
   ```

5. **Update docs**
   - README.md
   - CHANGELOG.md

---

## 🚨 Emergency Troubleshooting

### Extension Won't Build

```bash
npm run clean    # Remove artifacts
npm install      # Fresh install
npm run build    # Try again
```

### TypeScript Errors

```bash
# Check for type errors
npm run build

# Try fixing auto-fixable issues
npm run lint -- --fix
```

### Git Issues

```bash
# Check status
git status

# Clean up
git add .
git reset HEAD .
git checkout .

# Try again
git add .
git commit -m "..."
```

### Node Modules Issues

```bash
# Remove and reinstall
rm -r node_modules package-lock.json  # Mac/Linux
rmdir /s node_modules package-lock.json  # Windows

npm install
npm run build
```

---

## 🔐 Security Checklist

Before each release:

- [ ] No hardcoded API keys or credentials
- [ ] All dependencies are up to date (`npm audit`)
- [ ] No console.log with sensitive data
- [ ] Error messages don't leak information
- [ ] Rate limiting is enforced (2-second delays)
- [ ] Timeouts are set on HTTP requests (5 seconds)

---

## 📈 Version History Quick Links

- **Latest Release**: [GitHub Releases](https://github.com/rhizo-script/black-friday-tracker/releases)
- **All Versions**: [CHANGELOG.md](CHANGELOG.md)
- **VS Code Marketplace**: [black-friday-tracker](https://marketplace.visualstudio.com/items?itemName=rhizo-script.black-friday-tracker)

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Create pull request
6. Wait for review

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 💡 Tips & Tricks

### Faster Development

```bash
# Keep watch running in one terminal
npm run watch

# In another terminal, make changes and test
npm run lint      # Check style
npm run build     # Manual build
```

### Debugging Issues

```bash
# See real-time logs
# View → Output → "Black Friday Price Tracker"

# Add temporary logging
console.log('DEBUG:', variableName);

# Use breakpoints in VS Code
# Click left of line number in editor
```

### Performance Testing

```bash
# Measure specific operations
console.time('operation');
// ... code
console.timeEnd('operation');
```

---

## 📞 Getting Help

- **Developer Guide**: [DEVELOPER.md](DEVELOPER.md)
- **GitHub Issues**: [Report Bug](https://github.com/rhizo-script/black-friday-tracker/issues)
- **GitHub Discussions**: [Ask Question](https://github.com/rhizo-script/black-friday-tracker/discussions)
- **Code Examples**: Check other .ts files in `src/`

---

## 🎯 Development Priorities

1. **Stability**: Never break existing features
2. **Testing**: Test before committing
3. **Documentation**: Document new features
4. **Performance**: Monitor for slowness
5. **Security**: Never hardcode secrets

---

## 📋 Pre-Release Checklist

- [ ] Update `package.json` version
- [ ] Update `CHANGELOG.md` with changes
- [ ] Run `npm run build` - success?
- [ ] Run `npm run lint` - acceptable?
- [ ] Manual testing of new features
- [ ] Commit and tag release
- [ ] Push to GitHub
- [ ] Publish to VS Code Marketplace
- [ ] Create GitHub release
- [ ] Monitor GitHub issues for problems

---

## 🔄 CI/CD Workflow

GitHub Actions automatically:
- Builds on every push to master/main
- Tests on Node.js 16, 18, 20
- Publishes to Marketplace on tags
- Creates GitHub releases

See `.github/workflows/build.yml` for details.

---

**Last Updated:** 2024-11-24  
**Repository:** https://github.com/rhizo-script/black-friday-tracker  
**Marketplace:** https://marketplace.visualstudio.com/items?itemName=rhizo-script.black-friday-tracker
