import 'dotenv/config';
import express from 'express';
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import { Helius } from 'helius-sdk';

// Ensure Helius API key is available
if (!process.env.HELIUS_API_KEY) {
  console.warn("Warning: HELIUS_API_KEY is not set in environment variables. Set this for production use.");
}

// Create an MCP server instance
const server = new McpServer({
  name: "Helius MCP Server",
  version: "1.0.0"
});

// Add a tool to get assets by owner using Helius SDK
server.tool(
  "helius_getAssetsByOwner",
  { 
    ownerAddress: z.string().describe("Solana wallet address to fetch assets for"),
    page: z.number().optional().describe("Page number for pagination (default: 1)"),
    limit: z.number().optional().describe("Number of results per page (default: 100)"),
    displayOptions: z.object({
      showCollectionMetadata: z.boolean().optional().describe("Whether to include collection metadata"),
      showFungible: z.boolean().optional().describe("Whether to include fungible tokens (default: false)"),
      showNativeBalance: z.boolean().optional().describe("Whether to include native balance")
    }).optional().describe("Display options for the results")
  },
  async ({ ownerAddress, page = 1, limit = 100, displayOptions }) => {
    try {
      // Use the environment variable for the API key
      const helius = new Helius(process.env.HELIUS_API_KEY || 'demo');
      
      const response = await helius.rpc.getAssetsByOwner({
        ownerAddress,
        page,
        limit,
        displayOptions
      });
      
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(response, null, 2) 
        }]
      };
    } catch (error) {
      console.error("Error fetching assets:", error);
      return {
        content: [{ 
          type: "text", 
          text: `Error fetching assets: ${error instanceof Error ? error.message : String(error)}` 
        }],
        isError: true
      };
    }
  }
);

// Add a resource to get information about the Helius SDK
server.resource(
  "helius_info",
  "helius://info",
  async (uri) => ({
    contents: [{
      uri: uri.href,
      text: `
# Helius SDK Integration

The Helius Node.js library provides access to the Helius API from JavaScript/TypeScript.

## Available Tools

### helius_getAssetsByOwner

Get a list of assets owned by an address. This is the fastest way to get all the NFTs and fungible tokens owned by a wallet on Solana.

**Parameters:**
- \`ownerAddress\` (required): The Solana wallet address to fetch assets for
- \`page\` (optional): Page number for pagination (default: 1)
- \`limit\` (optional): Number of results per page (default: 100)
- \`displayOptions\` (optional): Display options for the results
  - \`showCollectionMetadata\` (optional): Whether to include collection metadata
  - \`showFungible\` (optional): Whether to include fungible tokens (default: false)
  - \`showNativeBalance\` (optional): Whether to include native balance

**Usage Example:**
\`\`\`json
{
  "ownerAddress": "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY",
  "page": 1,
  "limit": 10,
  "displayOptions": {
    "showCollectionMetadata": true,
    "showFungible": true
  }
}
\`\`\`


      `
    }]
  })
);

// Add a prompt template for using Helius getAssetsByOwner
server.prompt(
  "helius_wallet_analysis",
  { walletAddress: z.string() },
  ({ walletAddress }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Please analyze the NFTs and tokens in the Solana wallet ${walletAddress}. Use the helius_getAssetsByOwner tool to fetch the data and provide insights on:
1. How many NFTs the wallet holds
2. Which collections these NFTs belong to
3. Any notable or valuable tokens
4. Overall portfolio assessment`
      }
    }]
  })
);

// Set up Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Handle JSON body parsing
app.use(express.json());

// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
const transports: {[sessionId: string]: SSEServerTransport} = {};

// SSE endpoint
app.get("/sse", async (_, res) => {
  const transport = new SSEServerTransport('/messages', res);
  transports[transport.sessionId] = transport;
  
  res.on("close", () => {
    console.log(`Connection closed for session: ${transport.sessionId}`);
    delete transports[transport.sessionId];
  });
  
  console.log(`New connection established: ${transport.sessionId}`);
  await server.connect(transport);
});

// Message handling endpoint
app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports[sessionId];
  
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('No transport found for sessionId');
  }
});

// Basic health check
app.get("/health", (_, res) => {
  res.status(200).send({ status: "ok" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Helius MCP Server running on port ${PORT}`);
  console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
  console.log(`Messages endpoint: http://localhost:${PORT}/messages`);
}); 