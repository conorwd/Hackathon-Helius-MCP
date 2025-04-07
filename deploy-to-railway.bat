@echo off
echo ============================================
echo Deploying Helius MCP Server to Railway
echo ============================================

echo Checking if Railway CLI is installed...
railway version >nul 2>&1
if %errorlevel% neq 0 (
  echo Railway CLI not found. Installing...
  npm install -g @railway/cli
)

echo Setting up deployment...
railway login

echo Linking to Railway project...
railway link

echo Setting environment variables...
railway variables set PORT=3000
echo HELIUS_API_KEY needs to be set manually in the Railway dashboard for security reasons

echo Deploying to Railway...
railway up --detach

echo ============================================
echo Deployment initiated!
echo ============================================
echo Once deployed, you can use Supergateway to connect:
echo npx -y supergateway --sse "https://your-railway-app-url"
echo ============================================ 