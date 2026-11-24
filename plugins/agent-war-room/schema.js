const ROLES = new Set(['researcher', 'architect', 'skeptic', 'verifier']);
const STATUSES = new Set(['idle', 'running', 'done', 'error']);

function fail(path, expectation) {
  throw new TypeError(`Agent War Room schema: ${path} must be ${expectation}`);
}
function object(value, path) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) fail(path, 'an object');
}
function string(value, path, nullable = false) {
  if (nullable && value === null) return;
  if (typeof value !== 'string') fail(path, nullable ? 'a string or null' : 'a string');
}
function time(value, path, nullable = false) {
  if (nullable && value === null) return;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) fail(path, 'a non-negative finite number');
}
function array(value, path) {
  if (!Array.isArray(value)) fail(path, 'an array');
}
function validateView(value) {
  object(value, 'value');
  string(value.sessionId, 'value.sessionId');
  string(value.parentSessionId, 'value.parentSessionId', true);
  time(value.createdAt, 'value.createdAt');
  if (value.role !== null && !ROLES.has(value.role)) fail('value.role', 'a known role or null');
  string(value.runId, 'value.runId', true);
  if (!STATUSES.has(value.status)) fail('value.status', 'a known status');
  time(value.startedAt, 'value.startedAt', true);
  time(value.endedAt, 'value.endedAt', true);
  string(value.activeTool, 'value.activeTool', true);
  string(value.lastText, 'value.lastText');
  if (value.model !== null) {
    object(value.model, 'value.model');
    string(value.model.provider, 'value.model.provider');
    string(value.model.model, 'value.model.model');
  }
  array(value.runs, 'value.runs');
  for (const [index, run] of value.runs.entries()) {
    object(run, `value.runs[${index}]`);
    string(run.id, `value.runs[${index}].id`);
    string(run.question, `value.runs[${index}].question`);
    time(run.startedAt, `value.runs[${index}].startedAt`);
    if (!['command', 'tool'].includes(run.origin)) fail(`value.runs[${index}].origin`, 'command or tool');
    if (!['running', 'completed', 'error'].includes(run.status)) fail(`value.runs[${index}].status`, 'a known run status');
  }
  array(value.entries, 'value.entries');
  for (const [index, entry] of value.entries.entries()) {
    object(entry, `value.entries[${index}]`);
    string(entry.id, `value.entries[${index}].id`);
    time(entry.time, `value.entries[${index}].time`);
    if (!ROLES.has(entry.role)) fail(`value.entries[${index}].role`, 'a known role');
    if (!['fact', 'draft', 'objection', 'verification', 'tool'].includes(entry.kind)) fail(`value.entries[${index}].kind`, 'a known kind');
    string(entry.text, `value.entries[${index}].text`);
  }
  array(value.versions, 'value.versions');
  for (const [index, version] of value.versions.entries()) {
    object(version, `value.versions[${index}]`);
    string(version.id, `value.versions[${index}].id`);
    time(version.time, `value.versions[${index}].time`);
    string(version.text, `value.versions[${index}].text`);
    time(version.number, `value.versions[${index}].number`);
  }
  array(value.sources, 'value.sources');
  for (const [index, source] of value.sources.entries()) {
    object(source, `value.sources[${index}]`);
    string(source.url, `value.sources[${index}].url`);
    time(source.firstSeenAt, `value.sources[${index}].firstSeenAt`);
    array(source.roles, `value.sources[${index}].roles`);
    if (typeof source.reviewed !== 'boolean') fail(`value.sources[${index}].reviewed`, 'a boolean');
  }
  return value;
}

export const viewSchema = Object.freeze({ parse: validateView });
export const stateSchema = Object.freeze({
  parse(value) {
    validateView(value);
    time(value.firstOwnSeq, 'value.firstOwnSeq');
    object(value.pendingCalls, 'value.pendingCalls');
    return value;
  },
});
