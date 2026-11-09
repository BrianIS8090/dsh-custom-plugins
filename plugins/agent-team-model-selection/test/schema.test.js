import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apply } from '../discovery-v3.js';

test('custom delegation tools expose OpenAI-compatible object schemas', () => {
  const definitions = [];
  apply({
    tools: { register(definition) { definitions.push(definition); return () => {}; } },
    llm: {},
    subagents: {}
  });
  assert.deepEqual(definitions.map(d => d.name), [
    'subagent_with_model', 'subagent_fork_with_model', 'list_team_models'
  ]);
  for (const definition of definitions) {
    assert.equal(definition.parameters.type, 'object');
    assert.equal(definition.parameters.additionalProperties, false);
    for (const parameter of Object.values(definition.parameters.properties)) {
      assert.equal(Object.hasOwn(parameter, 'required'), false);
    }
  }
  const fork = definitions.find(d => d.name === 'subagent_fork_with_model');
  assert.deepEqual(fork.parameters.required, ['description', 'prompt']);
});
