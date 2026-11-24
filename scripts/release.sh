#!/bin/bash
# Development and release workflow for Black Friday Price Tracker

set -e

PROJECT_NAME="black-friday-tracker"
GITHUB_REPO="rhizo-script/black-friday-tracker"

echo "🛒 Black Friday Price Tracker - Build & Release Script"
echo "=================================================="

# Parse command
COMMAND=${1:-help}

case $COMMAND in
  install)
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    ;;
    
  build)
    echo "🔨 Building extension..."
    npm run build
    echo "✅ Build complete"
    ;;
    
  lint)
    echo "🔍 Linting code..."
    npm run lint
    echo "✅ Lint complete"
    ;;
    
  watch)
    echo "👀 Watching for changes..."
    npm run watch
    ;;
    
  package)
    echo "📦 Packaging extension (.vsix)..."
    npm run build
    
    if ! command -v vsce &> /dev/null; then
      echo "Installing vsce globally..."
      npm install -g vsce
    fi
    
    vsce package
    echo "✅ Package created: $(ls -t *.vsix | head -1)"
    ;;
    
  publish)
    echo "🚀 Publishing to VS Code Marketplace..."
    
    if [ -z "$VSCE_PAT" ]; then
      echo "❌ Error: VSCE_PAT environment variable not set"
      echo "Get your token from: https://dev.azure.com/"
      exit 1
    fi
    
    npm run build
    
    if ! command -v vsce &> /dev/null; then
      npm install -g vsce
    fi
    
    vsce publish -p $VSCE_PAT
    echo "✅ Published to VS Code Marketplace"
    ;;
    
  release)
    echo "📝 Creating GitHub release..."
    
    VERSION=${2:-}
    if [ -z "$VERSION" ]; then
      echo "❌ Error: Version required"
      echo "Usage: ./scripts/release.sh release v1.0.0"
      exit 1
    fi
    
    npm run build
    npm test 2>/dev/null || true
    
    # Update version in package.json
    npm version "$VERSION" --no-git-tag-version
    
    git add .
    git commit -m "Release: $VERSION"
    git tag "$VERSION"
    git push origin master --tags
    
    echo "✅ Release $VERSION created and pushed"
    ;;
    
  update)
    echo "🔄 Updating dependencies..."
    npm update
    npm audit fix
    echo "✅ Dependencies updated"
    ;;
    
  clean)
    echo "🧹 Cleaning build artifacts..."
    rm -rf dist/
    rm -rf *.vsix
    rm -rf node_modules/
    echo "✅ Cleaned"
    ;;
    
  setup-dev)
    echo "🛠️  Setting up development environment..."
    npm install
    npm install -g vsce
    echo "✅ Development environment ready"
    echo ""
    echo "Available commands:"
    echo "  npm run watch    - Watch for file changes"
    echo "  npm run build    - Build extension"
    echo "  npm run lint     - Lint code"
    ;;
    
  *)
    echo "Usage: ./scripts/release.sh [command] [args]"
    echo ""
    echo "Commands:"
    echo "  install      - Install npm dependencies"
    echo "  build        - Build the extension"
    echo "  lint         - Lint TypeScript code"
    echo "  watch        - Watch for file changes (dev mode)"
    echo "  package      - Package extension as .vsix"
    echo "  publish      - Publish to VS Code Marketplace"
    echo "  release VER  - Create GitHub release (e.g., v1.0.0)"
    echo "  update       - Update dependencies"
    echo "  clean        - Remove build artifacts"
    echo "  setup-dev    - Setup development environment"
    echo "  help         - Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  VSCE_PAT     - VS Code Marketplace Personal Access Token (for publish)"
    ;;
esac
