const MAX_MESSAGES = 80;

const emptyTokens = () => ({
  input: 0,
  output: 0,
  total: 0,
  unreportedTotal: 0,
  cacheRead: 0,
  cacheWrite: 0,
  reasoning: 0,
});

export function createInitialMonitorState(header, inheritedEventCount = 0) {
  return {
    sessionId: header.id,
    createdAt: Number.isFinite(header.createdAt) && header.createdAt >= 0 ? header.createdAt : 0,
    firstOwnSeq: Number.isSafeInteger(inheritedEventCount) && inheritedEventCount >= 0 ? inheritedEventCount : 0,
    tokens: emptyTokens(),
    turns: 0,
    steps: 0,
    llmMs: 0,
    toolMs: 0,
    activeMs: 0,
    openTurnStartedAt: null,
    activity: null,
    lastAction: null,
    messageCount: 0,
    messages: [],
    teamMembers: [],
    requestConfig: null,
    seenPeerMessageIds: [],
    peerInbox: { 'next-turn': [], 'next-step': [] },
    openTurn: null,
    openStep: null,
    pendingCalls: {},
  };
}

function finiteNonNegative(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : undefined;
}

function addUsage(tokens, usage) {
  if (usage === null || typeof usage !== 'object') return tokens;
  const input = finiteNonNegative(usage.inputTokens);
  const output = finiteNonNegative(usage.outputTokens);
  if (input === undefined || output === undefined) return tokens;
  const reportedTotal = finiteNonNegative(usage.totalTokens);
  return {
    input: tokens.input + input,
    output: tokens.output + output,
    total: tokens.total + (reportedTotal ?? 0),
    unreportedTotal: tokens.unreportedTotal + (reportedTotal === undefined ? 1 : 0),
    cacheRead: tokens.cacheRead + (finiteNonNegative(usage.cacheReadTokens) ?? 0),
    cacheWrite: tokens.cacheWrite + (finiteNonNegative(usage.cacheWriteTokens) ?? 0),
    reasoning: tokens.reasoning + (finiteNonNegative(usage.reasoningTokens) ?? 0),
  };
}

function textPreview(content, peer = false) {
  if (!Array.isArray(content)) return '';
  const parts = [];
  for (const block of content) {
    if (block === null || typeof block !== 'object' || block.type !== 'text' || typeof block.text !== 'string') continue;
    if (peer && parts.length === 0 && /^Team message from .+:$/u.test(block.text.trim())) continue;
    parts.push(block.text);
  }
  return parts.join(' ').replace(/\s+/gu, ' ').trim().slice(0, 280);
}

function peerSenderName(content) {
  if (!Array.isArray(content)) return undefined;
  const first = content[0];
  if (first === null || typeof first !== 'object' || first.type !== 'text' || typeof first.text !== 'string') return undefined;
  const match = /^Team message from (.+):$/u.exec(first.text.trim());
  return match?.[1];
}

function peerRecord(message, at, fallbackId, targetId) {
  if (message?.source?.kind !== 'agent-message' || typeof message.source.senderSessionId !== 'string') return undefined;
  const id = typeof message.id === 'string' && message.id.length > 0 ? message.id : fallbackId;
  const senderName = peerSenderName(message.content);
  return {
    id,
    senderId: message.source.senderSessionId,
    ...(senderName === undefined ? {} : { senderName }),
    targetId,
    time: at,
    preview: textPreview(message.content, true),
  };
}

function appendPeerMessage(state, record) {
  if (state.seenPeerMessageIds.includes(record.id)) return state;
  return {
    ...state,
    messageCount: state.messageCount + 1,
    messages: [...state.messages, record].slice(-MAX_MESSAGES),
    seenPeerMessageIds: [...state.seenPeerMessageIds, record.id],
    lastAction: {
      kind: 'peer-message',
      at: record.time,
      ...(record.preview === '' ? {} : { preview: record.preview }),
    },
  };
}

function withoutKey(record, key) {
  return Object.fromEntries(Object.entries(record).filter(([candidate]) => candidate !== key));
}

function remainingActivity(pendingCalls, at) {
  const first = Object.values(pendingCalls)[0];
  return first === undefined
    ? { kind: 'thinking', at }
    : { kind: 'tool', at: first.startTime, toolName: first.name };
}

/**
 * Pure fold over one member's durable Session log. Unrelated events retain the
 * exact state reference so the projection registry does not publish noise.
 */
export function foldMonitorEvent(state, event) {
  if (typeof event.seq === 'number' && event.seq < state.firstOwnSeq) return state;
  const at = finiteNonNegative(event.time) ?? 0;
  switch (event.type) {
    case 'turn/start': {
      if (state.openTurn !== null) return state;
      const action = { kind: 'thinking', at };
      return {
        ...state,
        turns: state.turns + 1,
        openTurn: { turn: event.data.turn, startTime: at },
        openTurnStartedAt: at,
        activity: action,
        lastAction: action,
      };
    }
    case 'turn/end': {
      const open = state.openTurn;
      const failed = event.data.reason?.kind === 'error';
      const action = { kind: failed ? 'error' : 'idle', at };
      return {
        ...state,
        activeMs: state.activeMs + (open === null ? 0 : Math.max(0, at - open.startTime)),
        openTurn: null,
        openTurnStartedAt: null,
        openStep: null,
        pendingCalls: {},
        activity: null,
        lastAction: action,
      };
    }
    case 'step/start': {
      const action = { kind: 'thinking', at };
      return {
        ...state,
        openStep: {
          turn: event.data.turn,
          step: event.data.step,
          startTime: at,
        },
        activity: action,
        lastAction: action,
      };
    }
    case 'step/end':
      return {
        ...state,
        steps: state.steps + 1,
        openStep: null,
      };
    case 'assistant/message': {
      const open = state.openStep;
      const timed = open !== null && open.turn === event.data.turn && open.step === event.data.step;
      const preview = textPreview(event.data.message?.content);
      const action = {
        kind: 'message',
        at,
        ...(preview === '' ? {} : { preview }),
      };
      return {
        ...state,
        tokens: addUsage(state.tokens, event.data.usage),
        llmMs: state.llmMs + (timed ? Math.max(0, at - open.startTime) : 0),
        openStep: timed ? null : open,
        activity: Object.keys(state.pendingCalls).length === 0
          ? { kind: 'thinking', at }
          : remainingActivity(state.pendingCalls, at),
        lastAction: action,
      };
    }
    case 'tool/call': {
      const callId = String(event.data.callId);
      const name = String(event.data.name);
      return {
        ...state,
        pendingCalls: {
          ...state.pendingCalls,
          [callId]: { name, startTime: at },
        },
        activity: { kind: 'tool', at, toolName: name },
        lastAction: { kind: 'tool', at, toolName: name },
      };
    }
    case 'tool/result': {
      const callId = event.data.message?.source?.callId ?? event.data.message?.toolCallId;
      if (typeof callId !== 'string') return state;
      const pending = Object.hasOwn(state.pendingCalls, callId) ? state.pendingCalls[callId] : undefined;
      if (pending === undefined) return state;
      const pendingCalls = withoutKey(state.pendingCalls, callId);
      const failed = event.data.error !== undefined || event.data.message?.isError === true;
      return {
        ...state,
        toolMs: state.toolMs + Math.max(0, at - pending.startTime),
        pendingCalls,
        activity: remainingActivity(pendingCalls, at),
        lastAction: {
          kind: failed ? 'error' : 'tool-result',
          at,
          toolName: pending.name,
        },
      };
    }
    case 'request/header': {
      const config = event.data?.header?.config;
      if (config === null || typeof config !== 'object' || typeof config.provider !== 'string' || typeof config.model !== 'string') return state;
      return {
        ...state,
        requestConfig: {
          provider: config.provider,
          model: config.model,
          ...(typeof config.reasoningEffort === 'string' ? { reasoningEffort: config.reasoningEffort } : {}),
        },
      };
    }
    case 'team/member': {
      const data = event.data;
      if (data?.teamId !== state.sessionId || data.member === null || typeof data.member !== 'object') return state;
      const member = data.member;
      if (typeof member.id !== 'string' || typeof member.name !== 'string') return state;
      const index = state.teamMembers.findIndex((candidate) => candidate.id === member.id);
      const previous = index < 0 ? undefined : state.teamMembers[index];
      const record = {
        id: member.id,
        name: member.name,
        description: typeof member.description === 'string' ? member.description : '',
        provider: typeof member.provider === 'string' ? member.provider : '',
        context: member.context === 'fork' ? 'fork' : 'fresh',
        phase: member.phase === 'failed' ? 'failed' : member.phase === 'provisioning' ? 'provisioning' : 'active',
        createdAt: previous?.createdAt ?? at,
        updatedAt: at,
        ...(typeof member.error === 'string' ? { error: member.error } : {}),
      };
      const teamMembers = [...state.teamMembers];
      if (index < 0) teamMembers.push(record);
      else teamMembers[index] = record;
      return { ...state, teamMembers };
    }
    case 'user/message': {
      const record = peerRecord(event.data, at, `seq-${String(event.seq)}`, state.sessionId);
      return record === undefined ? state : appendPeerMessage(state, record);
    }
    case 'agent/inbox/spliced': {
      const target = event.data.target;
      if (target !== 'next-turn' && target !== 'next-step') return state;
      const inserted = Array.isArray(event.data.inserted) ? event.data.inserted : [];
      const start = finiteNonNegative(event.data.start) ?? 0;
      const removedCount = finiteNonNegative(event.data.removedCount) ?? 0;
      const removedIds = state.peerInbox[target].slice(start, start + removedCount);
      let next = state;
      const insertedIds = inserted.map((message, index) => {
        const record = peerRecord(message, at, `seq-${String(event.seq)}-${index}`, state.sessionId);
        if (record !== undefined) next = appendPeerMessage(next, record);
        return record?.id ?? null;
      });
      const queue = [...next.peerInbox[target]];
      queue.splice(start, removedCount, ...insertedIds);
      next = {
        ...next,
        peerInbox: { ...next.peerInbox, [target]: queue },
      };
      if (event.data.outcome === 'canceled') {
        const canceled = new Set(removedIds.filter((id) => typeof id === 'string'));
        if (canceled.size > 0) {
          next = {
            ...next,
            messageCount: Math.max(0, next.messageCount - canceled.size),
            messages: next.messages.filter((message) => !canceled.has(message.id)),
            seenPeerMessageIds: next.seenPeerMessageIds.filter((id) => !canceled.has(id)),
          };
        }
      }
      return next;
    }
    default:
      return state;
  }
}

/** Strip in-flight fold internals from the browser-facing value. */
export function monitorView(state) {
  return {
    sessionId: state.sessionId,
    createdAt: state.createdAt,
    tokens: state.tokens,
    turns: state.turns,
    steps: state.steps,
    llmMs: state.llmMs,
    toolMs: state.toolMs,
    activeMs: state.activeMs,
    openTurnStartedAt: state.openTurnStartedAt,
    activity: state.activity,
    lastAction: state.lastAction,
    messageCount: state.messageCount,
    messages: state.messages,
    teamMembers: state.teamMembers,
    requestConfig: state.requestConfig,
  };
}

export const monitorInternals = Object.freeze({
  MAX_MESSAGES,
  addUsage,
  textPreview,
});
