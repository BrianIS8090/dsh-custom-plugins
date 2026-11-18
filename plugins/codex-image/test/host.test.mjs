import test from 'node:test';
import assert from 'node:assert/strict';
import { apply, EDIT_TOOL, GENERATE_TOOL } from '../lib/index.js';

const RELAY = 'https://relay.example.test/v1';
const UNCONFIGURED = /No relay base URL is configured/;

function harness(config) {
  const tools = new Map();
  const routes = new Map();
  const resolvedKeys = [];
  const child = {
    effect: (operation) => operation(),
    connection: { fetch: { register: (route) => routes.set(route.path, route) } },
  };
  apply({
    effect: (operation) => operation(),
    inject: (services, callback) => callback(child),
    tools: { register: (tool) => tools.set(tool.name, tool) },
    attachments: {},
    credentials: { resolve: async (ref) => { resolvedKeys.push(ref); return { value: 'synthetic-test-value' }; } },
  }, config);

  const post = async (path, body) => (await routes.get(path).fetch({
    headers: new Headers({ 'content-type': 'application/json', 'x-codex-image': '1' }),
    text: async () => JSON.stringify(body),
  })).json();
  return { tools, post, resolvedKeys };
}

test('unconfigured host rejects tool, check and preview calls before key lookup or network', async (t) => {
  const fetchMock = t.mock.method(globalThis, 'fetch', () => { throw new Error('unexpected network call'); });
  const { tools, post, resolvedKeys } = harness({});
  for (const name of [GENERATE_TOOL, EDIT_TOOL]) {
    await assert.rejects(tools.get(name).execute({ prompt: 'test' }, {}), UNCONFIGURED);
  }
  for (const path of ['/api/codex-image/check', '/api/codex-image/preview']) {
    const result = await post(path, { baseURL: RELAY, apiKeyEnv: 'OTHER_KEY' });
    assert.equal(result.ok, false);
    assert.equal(result.error, 'unconfigured');
    assert.match(result.message, UNCONFIGURED);
  }
  assert.deepEqual(resolvedKeys, []);
  assert.equal(fetchMock.mock.callCount(), 0);
});

test('connection check only uses the saved relay configuration', async (t) => {
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => Response.json({ data: [{ id: 'gpt-image-fixture' }] }));
  const baseURL = { get: () => RELAY + '/' };
  const { post, resolvedKeys } = harness({ baseURL, model: 'gpt-image-fixture' });
  const check = await post('/api/codex-image/check', { baseURL: 'https://other.example.test/v1', apiKeyEnv: 'OTHER_KEY', model: 'other-model' });
  assert.equal(check.ok, true);
  assert.equal(check.hasModel, true);
  assert.deepEqual(resolvedKeys, ['CODEX_IMAGE_API_KEY']);
  assert.equal(fetchMock.mock.callCount(), 1);
  assert.equal(fetchMock.mock.calls[0].arguments[0], RELAY + '/models');
});
