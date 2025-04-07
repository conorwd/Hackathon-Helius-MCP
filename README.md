# Helius MCP Server

A Model Context Protocol (MCP) server that provides access to Helius API for Solana blockchain data.

## Features

- Get assets owned by a Solana wallet address
- Information about Helius SDK integration
- Prompt template for wallet analysis

## Deployment

This project is configured to deploy on Railway.app using Docker.

### Environment Variables

Make sure to set these environment variables in your Railway project:

- `PORT` - The port the server will listen on (defaults to 3000)
- `HELIUS_API_KEY` - Your Helius API key (required for production use)

## Connecting to the Server

Once deployed, you can connect to the server using Supergateway:

### Using Supergateway to Connect (SSE → stdio)

```bash
npx -y supergateway --sse "https://your-railway-app-url"
```

This allows you to use the MCP server from local command-line tools.

### Using Supergateway with Headers (if authentication is needed)

```bash
npx -y supergateway \
    --sse "https://your-railway-app-url" \
    --header "Authorization: Bearer your-token" 
```

### With Claude Desktop

Add this to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "heliusMcpServer": {
      "command": "npx",
      "args": [
        "-y",
        "supergateway",
        "--sse",
        "https://your-railway-app-url"
      ]
    }
  }
}
```

## Available Tools and Resources

### Tools

- `helius_getAssetsByOwner` - Get assets owned by a Solana wallet address

### Resources

- `helius://info` - Information about the Helius SDK integration

### Prompts

- `helius_wallet_analysis` - Template for analyzing a Solana wallet

## Local Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with your Helius API key
4. Run the development server with `npm run dev`
5. Access the server at http://localhost:3000

## Building and Running

- Build: `npm run build`
- Start: `npm start`

The server will be available at:
- SSE endpoint: http://localhost:3000/sse
- Messages endpoint: http://localhost:3000/messages
- Health check: http://localhost:3000/health 