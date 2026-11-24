@echo off
REM Development and release workflow for Black Friday Price Tracker (Windows)

setlocal enabledelayedexpansion

set PROJECT_NAME=black-friday-tracker
set GITHUB_REPO=rhizo-script/black-friday-tracker

echo.
echo 🛒 Black Friday Price Tracker - Build Workflow
echo ================================================

if "%1%"=="" (
  call :show_help
  exit /b 0
)

if "%1%"=="install" (
  echo 📦 Installing dependencies...
  call npm install
  echo ✅ Dependencies installed
  exit /b 0
)

if "%1%"=="build" (
  echo 🔨 Building extension...
  call npm run build
  echo ✅ Build complete
  exit /b 0
)

if "%1%"=="lint" (
  echo 🔍 Linting code...
  call npm run lint
  echo ✅ Lint complete
  exit /b 0
)

if "%1%"=="watch" (
  echo 👀 Watching for changes...
  call npm run watch
  exit /b 0
)

if "%1%"=="package" (
  echo 📦 Packaging extension ^(.vsix^)...
  call npm run build
  
  where vsce >nul 2>nul
  if errorlevel 1 (
    echo Installing vsce globally...
    call npm install -g vsce
  )
  
  call vsce package
  echo ✅ Package created
  exit /b 0
)

if "%1%"=="publish" (
  echo 🚀 Publishing to VS Code Marketplace...
  
  if "!VSCE_PAT!"=="" (
    echo ❌ Error: VSCE_PAT environment variable not set
    echo Get your token from: https://dev.azure.com/
    exit /b 1
  )
  
  call npm run build
  
  where vsce >nul 2>nul
  if errorlevel 1 (
    call npm install -g vsce
  )
  
  call vsce publish -p !VSCE_PAT!
  echo ✅ Published to VS Code Marketplace
  exit /b 0
)

if "%1%"=="release" (
  if "%2%"=="" (
    echo ❌ Error: Version required
    echo Usage: build.bat release v1.0.0
    exit /b 1
  )
  
  echo 📝 Creating GitHub release for %2%...
  call npm run build
  
  for /f %%i in ('npm version %2% --no-git-tag-version') do set VERSION=%%i
  
  call git add .
  call git commit -m "Release: %2%"
  call git tag %2%
  call git push origin master --tags
  
  echo ✅ Release %2% created and pushed
  exit /b 0
)

if "%1%"=="update" (
  echo 🔄 Updating dependencies...
  call npm update
  call npm audit fix
  echo ✅ Dependencies updated
  exit /b 0
)

if "%1%"=="clean" (
  echo 🧹 Cleaning build artifacts...
  if exist dist rmdir /s /q dist
  if exist *.vsix del *.vsix
  if exist node_modules rmdir /s /q node_modules
  echo ✅ Cleaned
  exit /b 0
)

if "%1%"=="setup-dev" (
  echo 🛠️  Setting up development environment...
  call npm install
  call npm install -g vsce
  echo ✅ Development environment ready
  echo.
  echo Available commands:
  echo   npm run watch    - Watch for file changes
  echo   npm run build    - Build extension
  echo   npm run lint     - Lint code
  exit /b 0
)

call :show_help
exit /b 0

:show_help
echo Usage: build.bat [command] [args]
echo.
echo Commands:
echo   install      - Install npm dependencies
echo   build        - Build the extension
echo   lint         - Lint TypeScript code
echo   watch        - Watch for file changes (dev mode)
echo   package      - Package extension as .vsix
echo   publish      - Publish to VS Code Marketplace
echo   release VER  - Create GitHub release (e.g., v1.0.0)
echo   update       - Update dependencies
echo   clean        - Remove build artifacts
echo   setup-dev    - Setup development environment
echo   help         - Show this help message
echo.
echo Environment Variables:
echo   VSCE_PAT     - VS Code Marketplace Personal Access Token (for publish)
echo.
exit /b 0
