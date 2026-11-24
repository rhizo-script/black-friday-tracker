# Maintenance & Update Guide

## For Users

### Auto-Updates

VS Code automatically checks for updates:
- ✅ Automatic update checking enabled by default
- ✅ Updates install in background
- ✅ Restart VS Code to apply update

### Manual Update Check

1. Open VS Code
2. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
3. Find "Black Friday Price Tracker"
4. If update available, click **Update**
5. Restart VS Code

### Rollback to Previous Version

If you experience issues after an update:

1. Open Extensions
2. Find "Black Friday Price Tracker"
3. Click the dropdown menu (three dots)
4. Select "Install Another Version"
5. Choose the previous version
6. Restart VS Code

### Reporting Update Issues

Found a bug in a new version?
1. Go to [GitHub Issues](https://github.com/rhizo-script/black-friday-tracker/issues)
2. Create new issue with:
   - Your extension version
   - VS Code version
   - What went wrong
   - Steps to reproduce

---

## For Developers

### Setting Up Development

#### Windows

```cmd
# Clone the repository
git clone https://github.com/rhizo-script/black-friday-tracker.git
cd black-friday-tracker

# Setup development environment
build.bat setup-dev

# Start developing
npm run watch
```

Then press `F5` in VS Code to launch debug instance.

#### Mac/Linux

```bash
# Clone the repository
git clone https://github.com/rhizo-script/black-friday-tracker.git
cd black-friday-tracker

# Setup development environment
./scripts/release.sh setup-dev

# Start developing
npm run watch
```

Then press `F5` in VS Code to launch debug instance.

### Common Workflows

#### Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Watch for changes**
   ```bash
   npm run watch
   ```

3. **Test in debug instance** (F5 in VS Code)

4. **Lint and build**
   ```bash
   npm run lint
   npm run build
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

6. **Push to fork**
   ```bash
   git push origin feature/my-feature
   ```

7. **Create Pull Request** on GitHub

#### Creating a Release

1. **Update version** in `package.json`
   ```json
   {
     "version": "0.2.0"
   }
   ```

2. **Update CHANGELOG.md**
   ```markdown
   ## [0.2.0] - 2024-11-25
   
   ### Added
   - New feature description
   
   ### Fixed
   - Bug fix description
   ```

3. **Build and test**
   ```bash
   npm run build
   npm test  # if tests available
   ```

4. **Create release**
   
   Windows:
   ```cmd
   build.bat release v0.2.0
   ```
   
   Mac/Linux:
   ```bash
   ./scripts/release.sh release v0.2.0
   ```

5. **Publish to Marketplace** (requires PAT)
   ```bash
   set VSCE_PAT=your_token_here  # Windows
   build.bat publish
   ```
   
   Or Mac/Linux:
   ```bash
   export VSCE_PAT=your_token_here
   ./scripts/release.sh publish
   ```

### Dependency Management

#### Check for Updates

```bash
npm update
npm outdated
```

#### Update All Dependencies

```bash
npm update
```

#### Update Specific Package

```bash
npm install lodash@latest
```

#### Security Audit

```bash
npm audit
npm audit fix  # Auto-fix vulnerabilities
```

#### Add New Package

```bash
npm install new-package-name
npm run build  # Test that it compiles
```

**Important:** Always test after adding dependencies!

### Debugging Tips

#### Enable Detailed Logging

Add to `extension.ts`:
```typescript
const DEBUG = true;
function log(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[BlackFridayTracker] ${message}`, data || '');
  }
}
```

#### Check Output Channel

In debug VS Code instance:
1. Click View → Output
2. Select "Black Friday Price Tracker" from dropdown
3. See real-time log messages

#### Breakpoints

1. Set breakpoint by clicking left of line number
2. Run code that triggers breakpoint
3. Use Debug Console to inspect variables

#### Chrome DevTools for Webviews

```typescript
// In extension code
const webviewPanel = vscode.window.createWebviewPanel(...);
webviewPanel.webview.openDevTools(); // Opens DevTools
```

### Code Quality

#### Linting

```bash
npm run lint
npm run lint -- --fix  # Auto-fix issues
```

#### Type Checking

TypeScript automatically checks types during build:
```bash
npm run build
```

#### Code Review Checklist

Before submitting PR, verify:
- [ ] Code follows style guidelines
- [ ] No console errors or warnings
- [ ] No hardcoded credentials
- [ ] Comments explain complex logic
- [ ] Error handling is comprehensive
- [ ] New features have documentation updates

### Testing

#### Run Tests (if applicable)

```bash
npm test
```

#### Manual Testing Checklist

For any change, test:
- [ ] Extension activates on startup
- [ ] Add item to wishlist works
- [ ] Price checking works
- [ ] Notifications display correctly
- [ ] CSV export works
- [ ] Settings can be changed
- [ ] Previous data persists after restart

### Documentation Updates

After making changes:

1. **Update README.md** if user-facing changes
2. **Update DEVELOPER.md** if technical changes
3. **Update CHANGELOG.md** with new features/fixes
4. **Update relevant docs** (QUICKSTART.md, etc.)

### Performance Optimization

#### Before Optimization

Measure performance:
```bash
# Use console.time/console.timeEnd
console.time('priceCheck');
// ... code to measure
console.timeEnd('priceCheck');
```

#### After Optimization

Verify improvement:
```bash
# Compare timing before and after
# Ensure no functionality loss
npm run build  # Verify it still compiles
```

### Security Checklist

- [ ] No secrets hardcoded in code
- [ ] No unvalidated user input
- [ ] All HTTP requests timeout
- [ ] Error messages don't leak information
- [ ] Dependencies are up to date
- [ ] Rate limiting is enforced

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes only

Examples:
- `0.1.0` → `0.2.0`: Added new retailer (minor)
- `0.2.0` → `1.0.0`: Major API change (major)
- `0.2.0` → `0.2.1`: Fixed bug (patch)

### Deployment Timeline

1. **Development** (feature branch)
   - Make changes
   - Commit to branch
   - Create pull request

2. **Code Review** (pull request)
   - Team reviews code
   - Requested changes made
   - Approved

3. **Testing** (before release)
   - Merge to main/master
   - CI runs automated tests
   - Manual testing verification

4. **Release** (tagged version)
   - Tag version (e.g., v0.2.0)
   - CI builds and publishes
   - Update GitHub releases page

5. **Monitoring** (post-release)
   - Monitor GitHub issues
   - Respond to bug reports
   - Plan hotfixes if needed

---

## Troubleshooting Development

### Build Errors

**Error: "Cannot find module 'vscode'"**
```bash
npm install
npm run build
```

**Error: "tsconfig.json not found"**
- Verify you're in project root
- Check tsconfig.json exists

### Runtime Errors

**Extension not activating**
1. Check activation events in package.json
2. Verify onStartupFinished event
3. Check VS Code output panel
4. Restart VS Code

**Changes not showing in debug instance**
1. Rebuild: `npm run build`
2. Reload window: `Ctrl+R` in debug instance
3. Restart debug instance: `Ctrl+Shift+D` → Restart

### Common Issues

| Issue | Solution |
|-------|----------|
| "npm ERR! 404" | Delete node_modules, run `npm install` |
| "Port already in use" | Kill process on that port, restart VS Code |
| "Git credential issues" | Configure git credentials with `git config` |
| "File not found" | Check file path casing (Linux is case-sensitive) |

---

## Support

- 📖 [Developer Guide](DEVELOPER.md)
- 📖 [Contributing Guide](CONTRIBUTING.md)
- 🐛 [Report Issue](https://github.com/rhizo-script/black-friday-tracker/issues)
- 💬 [Discussion](https://github.com/rhizo-script/black-friday-tracker/discussions)

---

**Keep this extension awesome!** 🚀
