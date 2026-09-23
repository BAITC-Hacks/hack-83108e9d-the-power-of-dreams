// Verify the public Context7 MCP endpoint without printing credentials or docs.
import assert from 'node:assert/strict';

const endpoint = 'https://mcp.context7.com/mcp';
let session;
let id = 0;
async function rpc(method, params) {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' };
  if (session) headers['mcp-session-id'] = session;
  const response = await fetch(endpoint, {
    method: 'POST', headers, signal: AbortSignal.timeout(30000),
    body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method, params }),
  });
  assert.equal(response.status, 200, `Context7 HTTP ${response.status}`);
  session = response.headers.get('mcp-session-id') || session;
  const body = await response.text();
  const messages = body.trim().startsWith('{') ? [JSON.parse(body)] :
    body.split('\n').filter(line => line.startsWith('data: ')).map(line => JSON.parse(line.slice(6)));
  const message = messages.find(item => item.id === id);
  assert.ok(message && !message.error, `Invalid MCP response for ${method}`);
  assert.ok(!message.result?.isError, `Context7 tool error for ${method}`);
  return message.result;
}

const init = await rpc('initialize', {
  protocolVersion: '2024-11-05', capabilities: {},
  clientInfo: { name: 'dreams-harness-check', version: '1.0.0' },
});
assert.equal(init.serverInfo.name, 'Context7');
const catalogue = await rpc('tools/list', {});
assert.ok(catalogue.tools.some(tool => tool.name === 'resolve-library-id'));
assert.ok(catalogue.tools.some(tool => tool.name === 'query-docs'));
const resolved = await rpc('tools/call', {
  name: 'resolve-library-id', arguments: { libraryName: 'Next.js', query: 'App Router Route Handlers' },
});
assert.match(JSON.stringify(resolved), /\/vercel\/next\.js/);
const docs = await rpc('tools/call', {
  name: 'query-docs', arguments: { libraryId: '/vercel/next.js', query: 'App Router Route Handlers GET request response' },
});
assert.match(JSON.stringify(docs), /route|Route/);
console.log(`PASS Context7 MCP ${init.serverInfo.version}: initialize, tools/list, resolve-library-id, query-docs`);
