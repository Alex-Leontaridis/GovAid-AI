@echo off
echo ========================================
echo GovAid-AI Vercel Deployment Script
echo ========================================
echo.

echo 1. Installing Vercel CLI globally...
npm install -g vercel

echo.
echo 2. Building the project...
npm run build

echo.
echo 3. Deploying to Vercel...
vercel --prod

echo.
echo ========================================
echo Deployment completed!
echo ========================================
pause 