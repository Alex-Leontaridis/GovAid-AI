@echo off
echo ========================================
echo GovAid-AI Vercel Deployment - FIXED
echo ========================================
echo.

echo 1. Cleaning previous builds...
if exist "dist" rmdir /s /q "dist"
if exist ".vercel" rmdir /s /q ".vercel"

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
    echo ✓ Assets directory: dist\assets
) else (
    echo ✗ Build failed - index.html not found
    pause
    exit /b 1
)

echo.
echo 5. Deploying to Vercel...
vercel --prod --yes

echo.
echo ========================================
echo Deployment completed!
echo ========================================
echo.
echo IMPORTANT: Set these environment variables in Vercel dashboard:
echo - OPENROUTER_API_KEY=your_api_key_here
echo - OPENROUTER_BASE_URL=https://openrouter.ai/api/v1/
echo - OPENROUTER_MODEL=openai/gpt-3.5-turbo
echo - NODE_ENV=production
echo.
echo Your API endpoints will be available at:
echo - /api/health
echo - /api/extract-text
echo - /api/summarize
echo - /api/checklist
echo - /api/ask-question
echo.
pause 