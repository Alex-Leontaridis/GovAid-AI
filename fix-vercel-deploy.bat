@echo off
echo ========================================
echo Fixing Vercel Deployment Issue
echo ========================================
echo.

echo 1. Cleaning previous build...
if exist "dist" rmdir /s /q "dist"

echo.
echo 2. Installing dependencies...
npm install

echo.
echo 3. Building the project...
npm run build

echo.
echo 4. Checking build output...
if exist "dist\index.html" (
    echo ✓ Build successful - index.html found
) else (
    echo ✗ Build failed - index.html not found
    pause
    exit /b 1
)

echo.
echo 5. Deploying to Vercel with fixed configuration...
vercel --prod

echo.
echo ========================================
echo Deployment completed with fixes!
echo ========================================
echo.
echo If you still see the MIME type error:
echo 1. Go to your Vercel dashboard
echo 2. Go to Project Settings > Build & Development Settings
echo 3. Set Build Command to: npm run build
echo 4. Set Output Directory to: dist
echo 5. Redeploy from the dashboard
echo.
pause 