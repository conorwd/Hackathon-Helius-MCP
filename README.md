# Helius MCP Server

A Model Context Protocol (MCP) server implementation that exposes the Helius SDK functionality for AI agents.

## Features

- HTTP+SSE transport for MCP communications
- Integration with Helius SDK to fetch Solana assets
- MCP tools for retrieving NFTs and tokens owned by Solana wallets
- Documentation resources and prompt templates

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm
- Helius API key (get one from [Helius Dashboard](https://dev.helius.xyz/dashboard/app))

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your Helius API key:
   ```
   HELIUS_API_KEY=your_helius_api_key_here
   ```

### Development

To run the server in development mode:

```
npm run dev
```

### Building for Production

To build the project:

```
npm run build
```

To start the production server:

```
npm start
```

## Endpoints

- SSE Endpoint: `http://localhost:3000/sse`
- Messages Endpoint: `http://localhost:3000/messages`
- Health Check: `http://localhost:3000/health`

## Available Features

### Tools

- `helius_getAssetsByOwner`: Get a list of assets (NFTs and tokens) owned by a Solana wallet address.

### Resources

- `helius://info`: Documentation about the Helius SDK and available tools.

### Prompts

- `helius_wallet_analysis`: A prompt template for analyzing the NFTs and tokens in a Solana wallet.

## Helius SDK

This MCP server uses the Helius SDK to interact with the Solana blockchain. The SDK provides access to the Helius API, which offers various endpoints for working with Solana assets, NFTs, and more.

To learn more about the Helius SDK, visit [docs.helius.dev](https://docs.helius.dev).

## Example Usage with AI Agent

An AI agent can use the MCP server to get assets owned by a Solana wallet and analyze them:

1. Connect to the MCP server via the SSE endpoint
2. Call the `helius_getAssetsByOwner` tool with the wallet address
3. Process the returned data to provide insights on the wallet's NFTs and tokens

## Deployment

This server is designed to be compatible with Railway.app for easy deployment.

## License

ISC 