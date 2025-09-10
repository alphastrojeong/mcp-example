import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { URL } from "url";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const main = async (): Promise<void> => {
  const baseUrl = new URL("http://localhost:529/sse");
  const sseTransport = new SSEClientTransport(baseUrl);
  const client = new Client({
    name: 'streamable-http-client',
    version: '1.0.0'
  });
  await client.connect(sseTransport);
  try {
    const tools = await client.listTools();
    console.log("TOOLS");
    console.log(JSON.stringify(tools));

    const gotoRes = await client.callTool({
      name: "browser_navigate",
      arguments: { url: "https://www.naver.com" },
    });
    console.log("goto:", gotoRes);
  } catch (error) {
    console.error("Error during MCP client execution:", error);
  } finally {
  }
};

main().catch(console.error);
