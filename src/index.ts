import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
globalThis.fetch = fetch as any; // Polyfill fetch for Node.js

// make sure you did run 
//  npm run build:wasm:release
//  npm install
// to ensure the dependencies are installed and the wasm module is built and the lib folder is created
import init, { factorial } from "./lib/rust-functions-lib/pkg/rust_funcations_lib.js";

// Initialize the wasm module before calling the function
// avoid using the default import to work around 
// TypeError - URL scheme "file" is not supported.
const wasmPath = fileURLToPath(new URL("./lib/rust-functions-lib/pkg/rust_funcations_lib_bg.wasm", import.meta.url));
const wasmBytes = await readFile(wasmPath); // Read the wasm file from the filesystem
await init(wasmBytes); // Initialize the wasm module with the file contents


const TOOL_NAME = "factorial_of_a_number";

await init();

const server = new Server({
  name: "mcp-server",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {}
  }
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: [] };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === TOOL_NAME) {
    return {};
  }
  console.error(ErrorCode.InternalError, "Tool not found");
  throw new McpError(ErrorCode.InternalError, "Tool not found");
});

const transport = new StdioServerTransport();
await server.connect(transport);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [{
      name: TOOL_NAME,
      description: "factorial of a number",
      inputSchema: {
        type: "object",
        properties: {
          a: { type: "number" }
        },
        required: ["a"]
      }
    }]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === TOOL_NAME) {
    const { a } = request.params.arguments as { a: number};
    const result = factorial(BigInt(a));
    return { toolResult: result.toString() };
  }
  console.error(ErrorCode.InternalError, "Tool not found");
  throw new McpError(ErrorCode.InternalError, "Tool not found");
});