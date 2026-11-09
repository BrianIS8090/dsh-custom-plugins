const ACTION_KINDS = new Set(['thinking', 'tool', 'tool-result', 'message', 'peer-message', 'idle', 'error']);
const VIEW_KEYS = new Set([
  'sessionId', 'createdAt', 'tokens', 'turns', 'steps', 'llmMs', 'toolMs', 'activeMs',
  'openTurnStartedAt', 'activity', 'lastAction', 'messageCount', 'messages', 'teamMembers', 'requestConfig',
]);
const STATE_KEYS = new Set([
  ...VIEW_KEYS, 'firstOwnSeq', 'seenPeerMessageIds', 'peerInbox', 'openTurn', 'openStep', 'pendingCalls',
]);
const TOKEN_KEYS = new Set(['input', 'output', 'total', 'unreportedTotal', 'cacheRead', 'cacheWrite', 'reasoning']);

function fail(path, expectation) {
  throw new TypeError(`Agent Team Monitor schema: ${path} must be ${expectation}`);
}

function object(value, path) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) fail(path, 'an object');
  return value;
}

function exactKeys(value, allowed, path) {
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) fail(path, `free of unknown key ${JSON.stringify(key)}`);
  }
}

function nonNegative(value, path, integer = false) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || (integer && !Number.isInteger(value))) {
    fail(path, integer ? 'a non-negative integer' : 'a non-negative finite number');
  }
}

function string(value, path, nonEmpty = false) {
  if (typeof value !== 'string' || (nonEmpty && value.length === 0)) fail(path, nonEmpty ? 'a non-empty string' : 'a string');
}

function optionalString(value, path) {
  if (value !== undefined) string(value, path);
}

function nullable(value, path, validate) {
  if (value === null) return;
  validate(value, path);
}

function action(value, path) {
  object(value, path);
  exactKeys(value, new Set(['kind', 'at', 'toolName', 'preview']), path);
  if (!ACTION_KINDS.has(value.kind)) fail(`${path}.kind`, 'a known activity kind');
  nonNegative(value.at, `${path}.at`);
  optionalString(value.toolName, `${path}.toolName`);
  optionalString(value.preview, `${path}.preview`);
}

function tokens(value, path) {
  object(value, path);
  exactKeys(value, TOKEN_KEYS, path);
  for (const key of TOKEN_KEYS) nonNegative(value[key], `${path}.${key}`, key === 'unreportedTotal');
}

function message(value, path) {
  object(value, path);
  exactKeys(value, new Set(['id', 'senderId', 'senderName', 'targetId', 'time', 'preview']), path);
  string(value.id, `${path}.id`, true);
  string(value.senderId, `${path}.senderId`, true);
  optionalString(value.senderName, `${path}.senderName`);
  string(value.targetId, `${path}.targetId`, true);
  nonNegative(value.time, `${path}.time`);
  string(value.preview, `${path}.preview`);
}

function teamMember(value, path) {
  object(value, path);
  exactKeys(value, new Set(['id', 'name', 'description', 'provider', 'context', 'phase', 'createdAt', 'updatedAt', 'error']), path);
  string(value.id, `${path}.id`, true);
  string(value.name, `${path}.name`, true);
  string(value.description, `${path}.description`);
  string(value.provider, `${path}.provider`);
  if (!['fresh', 'fork'].includes(value.context)) fail(`${path}.context`, '"fresh" or "fork"');
  if (!['provisioning', 'active', 'failed'].includes(value.phase)) fail(`${path}.phase`, 'a known Team phase');
  nonNegative(value.createdAt, `${path}.createdAt`);
  nonNegative(value.updatedAt, `${path}.updatedAt`);
  optionalString(value.error, `${path}.error`);
}

function requestConfig(value, path) {
  object(value, path);
  exactKeys(value, new Set(['provider', 'model', 'reasoningEffort']), path);
  string(value.provider, `${path}.provider`, true);
  string(value.model, `${path}.model`, true);
  optionalString(value.reasoningEffort, `${path}.reasoningEffort`);
}

function validateView(value, includeStateKeys = false) {
  object(value, 'value');
  exactKeys(value, includeStateKeys ? STATE_KEYS : VIEW_KEYS, 'value');
  string(value.sessionId, 'value.sessionId', true);
  nonNegative(value.createdAt, 'value.createdAt');
  tokens(value.tokens, 'value.tokens');
  nonNegative(value.turns, 'value.turns', true);
  nonNegative(value.steps, 'value.steps', true);
  nonNegative(value.llmMs, 'value.llmMs');
  nonNegative(value.toolMs, 'value.toolMs');
  nonNegative(value.activeMs, 'value.activeMs');
  nullable(value.openTurnStartedAt, 'value.openTurnStartedAt', (item, path) => nonNegative(item, path));
  nullable(value.activity, 'value.activity', action);
  nullable(value.lastAction, 'value.lastAction', action);
  nonNegative(value.messageCount, 'value.messageCount', true);
  if (!Array.isArray(value.messages)) fail('value.messages', 'an array');
  value.messages.forEach((item, index) => message(item, `value.messages[${index}]`));
  if (!Array.isArray(value.teamMembers)) fail('value.teamMembers', 'an array');
  value.teamMembers.forEach((item, index) => teamMember(item, `value.teamMembers[${index}]`));
  nullable(value.requestConfig, 'value.requestConfig', requestConfig);
  return value;
}

function nullableBoundary(value, path, fields) {
  if (value === null) return;
  object(value, path);
  exactKeys(value, new Set([...fields, 'startTime']), path);
  for (const field of fields) nonNegative(value[field], `${path}.${field}`, true);
  nonNegative(value.startTime, `${path}.startTime`);
}

function inbox(value, path) {
  object(value, path);
  exactKeys(value, new Set(['next-turn', 'next-step']), path);
  for (const key of ['next-turn', 'next-step']) {
    if (!Array.isArray(value[key])) fail(`${path}.${key}`, 'an array');
    value[key].forEach((item, index) => {
      if (item !== null) string(item, `${path}.${key}[${index}]`, true);
    });
  }
}

function validateState(value) {
  validateView(value, true);
  exactKeys(value, STATE_KEYS, 'value');
  nonNegative(value.firstOwnSeq, 'value.firstOwnSeq', true);
  if (!Array.isArray(value.seenPeerMessageIds)) fail('value.seenPeerMessageIds', 'an array');
  value.seenPeerMessageIds.forEach((item, index) => string(item, `value.seenPeerMessageIds[${index}]`, true));
  inbox(value.peerInbox, 'value.peerInbox');
  nullableBoundary(value.openTurn, 'value.openTurn', ['turn']);
  nullableBoundary(value.openStep, 'value.openStep', ['turn', 'step']);
  object(value.pendingCalls, 'value.pendingCalls');
  for (const [key, call] of Object.entries(value.pendingCalls)) {
    const path = `value.pendingCalls[${JSON.stringify(key)}]`;
    object(call, path);
    exactKeys(call, new Set(['name', 'startTime']), path);
    string(call.name, `${path}.name`);
    nonNegative(call.startTime, `${path}.startTime`);
  }
  return value;
}

export const viewSchema = Object.freeze({ parse: validateView });
export const stateSchema = Object.freeze({ parse: validateState });
