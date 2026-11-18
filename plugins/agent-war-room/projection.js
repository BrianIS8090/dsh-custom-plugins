const MAX_ENTRIES = 72;
const MAX_VERSIONS = 6;
const MAX_SOURCES = 120;
const MAX_TEXT = 60000;
const ROLES = new Set(['researcher', 'architect', 'skeptic', 'verifier']);

const finiteTime = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0;

export function textFromContent(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content.map(block => {
    if (typeof block === 'string') return block;
    if (block?.type === 'text' && typeof block.text === 'string') return block.text;
    return '';
  }).filter(Boolean).join('\n').trim();
}

export function extractUrls(text) {
  const urls = [];
  const seen = new Set();
  for (const match of String(text || '').matchAll(/https?:\/\/[^\s<>()\[\]{}"']+/giu)) {
    const url = match[0].replace(/[.,;:!?]+$/u, '');
    if (!url || seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
  }
  return urls;
}

function marker(text) {
  const match = /\[WAR_ROOM run=([^\s\]]+) role=(researcher|architect|skeptic|verifier)\]/u.exec(text);
  return match ? { runId: match[1], role: match[2] } : null;
}

function appendBounded(list, item, limit) {
  return [...list, item].slice(-limit);
}

function markSourcesReviewed(state, text, at) {
  if (state.role !== 'verifier' || !/^##\s+Проверенные источники\s*$/imu.test(text)) return state;
  const section = text.split(/^##\s+Проверенные источники\s*$/imu)[1];
  const urls = extractUrls(section || '');
  if (urls.length === 0) return state;
  const cited = new Set(urls);
  return {
    ...state,
    sources: state.sources.map(source => cited.has(source.url) ? { ...source, reviewed: true, reviewedAt: at } : source),
  };
}

function addSources(state, text, at) {
  const urls = extractUrls(text);
  if (urls.length === 0 || !state.role) return state;
  const sources = [...state.sources];
  let changed = false;
  for (const url of urls) {
    const index = sources.findIndex(source => source.url === url);
    if (index < 0) {
      sources.push({ url, firstSeenAt: at, roles: [state.role], reviewed: false });
      changed = true;
      continue;
    }
    const source = sources[index];
    const roles = source.roles.includes(state.role) ? source.roles : [...source.roles, state.role];
    const reviewed = source.reviewed;
    if (roles !== source.roles || reviewed !== source.reviewed) {
      sources[index] = { ...source, roles, reviewed };
      changed = true;
    }
  }
  return changed ? { ...state, sources: sources.slice(-MAX_SOURCES) } : state;
}

function addRun(state, id, question, at, origin) {
  if (!id || !question) return state;
  const existing = state.runs.find(run => run.id === id);
  if (existing) return state;
  return {
    ...state,
    runs: appendBounded(state.runs, { id, question: question.slice(0, 12000), startedAt: at, origin, status: 'running' }, 8),
  };
}

function updateRootTool(state, event) {
  const callId = event.data.message?.source?.callId ?? event.data.message?.toolCallId;
  if (typeof callId !== 'string') return state;
  const id = `tool-${callId}`;
  const index = state.runs.findIndex(run => run.id === id);
  if (index < 0) return state;
  const runs = [...state.runs];
  runs[index] = {
    ...runs[index],
    status: event.data.error || event.data.message?.isError ? 'error' : 'completed',
  };
  return { ...state, runs };
}

export function createInitialWarRoomState(header, inheritedEventCount = 0) {
  return {
    sessionId: header.id,
    parentSessionId: typeof header.parentSession === 'string' ? header.parentSession : null,
    createdAt: finiteTime(header.createdAt),
    firstOwnSeq: Number.isSafeInteger(inheritedEventCount) && inheritedEventCount >= 0 ? inheritedEventCount : 0,
    role: null,
    runId: null,
    status: 'idle',
    startedAt: null,
    endedAt: null,
    activeTool: null,
    lastText: '',
    model: null,
    runs: [],
    entries: [],
    versions: [],
    sources: [],
    pendingCalls: {},
  };
}

/** Pure projection over ordinary durable Session events; reasoning is never read. */
export function foldWarRoomEvent(state, event) {
  if (typeof event.seq === 'number' && event.seq < state.firstOwnSeq) return state;
  const at = finiteTime(event.time);

  if (state.role === null && event.type === 'command/run' && event.data?.name === 'war-room') {
    return addRun(state, String(event.data.commandId || ''), String(event.data.args || '').trim(), at, 'command');
  }
  if (state.role === null && event.type === 'tool/call' && event.data?.name === 'war_room') {
    let args = event.data.arguments;
    if (typeof args === 'string') {
      try { args = JSON.parse(args); } catch { args = null; }
    }
    return addRun(state, `tool-${String(event.data.callId)}`, String(args?.question || '').trim(), at, 'tool');
  }
  if (state.role === null && event.type === 'tool/result') return updateRootTool(state, event);

  if (event.type === 'user/message' && state.role === null) {
    if (event.data?.source?.kind !== 'user') return state;
    const found = marker(textFromContent(event.data.content));
    if (!found) return state;
    return {
      ...state,
      ...found,
      status: 'running',
      startedAt: at,
      endedAt: null,
    };
  }
  if (state.role === null) return state;

  switch (event.type) {
    case 'turn/start':
      return { ...state, status: 'running', endedAt: null };
    case 'turn/end': {
      const failed = event.data.reason?.kind === 'error' || event.data.reason?.kind === 'aborted';
      return {
        ...state,
        status: failed ? 'error' : 'done',
        endedAt: at,
        activeTool: null,
        pendingCalls: {},
      };
    }
    case 'assistant/message': {
      const text = textFromContent(event.data.message?.content).slice(0, MAX_TEXT);
      if (!text) return state;
      const kind = state.role === 'architect' ? 'draft'
        : state.role === 'skeptic' ? 'objection'
          : state.role === 'verifier' ? 'verification' : 'fact';
      let next = {
        ...state,
        lastText: text,
        activeTool: null,
        entries: appendBounded(state.entries, {
          id: `message-${event.seq}`, time: at, role: state.role, kind, text,
        }, MAX_ENTRIES),
      };
      if (state.role === 'architect') {
        next.versions = appendBounded(state.versions, {
          id: `version-${event.seq}`, time: at, text, number: state.versions.length + 1,
        }, MAX_VERSIONS);
      }
      return markSourcesReviewed(addSources(next, text, at), text, at);
    }
    case 'tool/call': {
      const callId = String(event.data.callId);
      const name = String(event.data.name);
      const args = typeof event.data.arguments === 'string' ? event.data.arguments : JSON.stringify(event.data.arguments || {});
      if (state.entries.some(entry => entry.id === `tool-${callId}`)) return state;
      const entryId = `tool-${callId}`;
      const next = {
        ...state,
        activeTool: name,
        pendingCalls: { ...state.pendingCalls, [callId]: { name, entryId } },
        entries: appendBounded(state.entries, {
          id: entryId, time: at, role: state.role, kind: 'tool', toolName: name,
          text: args.slice(0, 900), status: 'running',
        }, MAX_ENTRIES),
      };
      return next;
    }
    case 'tool/result': {
      const callId = event.data.message?.source?.callId ?? event.data.message?.toolCallId;
      if (typeof callId !== 'string') return state;
      const pending = state.pendingCalls[callId];
      if (!pending) return state;
      const pendingCalls = { ...state.pendingCalls };
      delete pendingCalls[callId];
      const failed = event.data.error !== undefined || event.data.message?.isError === true;
      const entries = state.entries.map(entry => entry.id === pending.entryId
        ? { ...entry, status: failed ? 'error' : 'done' }
        : entry);
      const next = {
        ...state,
        entries,
        pendingCalls,
        activeTool: Object.values(pendingCalls)[0]?.name || null,
      };
      return next;
    }
    case 'request/header': {
      const config = event.data?.header?.config;
      if (typeof config?.provider !== 'string' || typeof config?.model !== 'string') return state;
      return { ...state, model: { provider: config.provider, model: config.model } };
    }
    default:
      return state;
  }
}

export function warRoomView(state) {
  return {
    sessionId: state.sessionId,
    parentSessionId: state.parentSessionId,
    createdAt: state.createdAt,
    role: state.role,
    runId: state.runId,
    status: state.status,
    startedAt: state.startedAt,
    endedAt: state.endedAt,
    activeTool: state.activeTool,
    lastText: state.lastText,
    model: state.model,
    runs: state.runs,
    entries: state.entries,
    versions: state.versions,
    sources: state.sources,
  };
}

export const warRoomInternals = Object.freeze({ ROLES, MAX_TEXT });
