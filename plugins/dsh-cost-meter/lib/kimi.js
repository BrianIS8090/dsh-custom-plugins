/**
 * Kimi Code limits — Host-side helpers.
 *
 * Everything here is plain JavaScript with no imports: an external plugin
 * installed as a local folder has no node_modules of its own, so the Host half
 * must live on `ctx` services and Node globals alone.
 *
 * Endpoint facts (reverse-engineered from the Kimi Code CLI 3.x binary and
 * cross-checked against community clients; the endpoint is not formally
 * documented):
 *   - GET  https://api.kimi.com/coding/v1/usages with `Authorization: Bearer <token>`
 *   - current body: { usages: { limit_5h, limit_7d, limit_month_total,
 *     limit_month_code } } where every window is { used_ratio: 0..1, reset_time }
 *   - legacy body:  { usage: { limit, remaining, resetTime },
 *                     limits: [{ window: { duration, timeUnit },
 *                                detail: { limit, remaining, resetTime } }] }
 *   - OAuth refresh: POST https://auth.kimi.com/api/oauth/token,
 *     form-urlencoded { client_id, grant_type=refresh_token, refresh_token }
 */

/** Credential record key owned by the pi-ai adapter for the Kimi route. */
export const KIMI_RECORD_KEY = "llm-pi-ai/kimi-coding";

/** Kimi Code usage endpoint (same origin as the chat API). */
export const KIMI_USAGE_URL = "https://api.kimi.com/coding/v1/usages";

/** Kimi Code OAuth token endpoint of the default host. */
export const KIMI_TOKEN_URL = "https://auth.kimi.com/api/oauth/token";

/** Public Kimi Code CLI client id, shared by the CLI and pi-ai. */
export const KIMI_OAUTH_CLIENT_ID = "17e5f671-d194-4dfb-9706-5516cb48c098"; // gitleaks:allow — public OAuth client identifier, not a user credential.

/** Default network timeout for one Kimi request. */
const REQUEST_TIMEOUT_MS = 15_000;

/** Clamp a ratio into [0, 1]. */
const clamp01 = (value) => (value < 0 ? 0 : value > 1 ? 1 : value);

/** Turn an unknown thrown value into a short message. */
function messageOf(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}

/** Read a finite number from a number or a numeric string. */
function numberOf(value) {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * Normalize one `{ used_ratio, reset_time }` window.
 * @param {unknown} raw - window from `usages`.
 * @returns {{ remaining: number, resetAt?: string } | undefined} remaining share in [0, 1].
 */
function parseRatioWindow(raw) {
  if (raw === null || typeof raw !== "object") return undefined;
  const used = numberOf(raw.used_ratio);
  if (used === undefined) return undefined;
  const resetAt = typeof raw.reset_time === "string" && raw.reset_time.length > 0 ? raw.reset_time : undefined;
  const window = { remaining: clamp01(1 - used) };
  if (resetAt !== undefined) window.resetAt = resetAt;
  return window;
}

/**
 * Normalize one legacy `{ limit, remaining, resetTime }` detail.
 * @param {unknown} raw - detail from the legacy body.
 * @returns {{ remaining: number, resetAt?: string } | undefined} remaining share in [0, 1].
 */
function parseCounterWindow(raw) {
  if (raw === null || typeof raw !== "object") return undefined;
  const limit = numberOf(raw.limit);
  const remaining = numberOf(raw.remaining);
  if (limit === undefined || remaining === undefined || limit <= 0) return undefined;
  const resetAt = typeof raw.resetTime === "string" && raw.resetTime.length > 0 ? raw.resetTime : undefined;
  const window = { remaining: clamp01(remaining / limit) };
  if (resetAt !== undefined) window.resetAt = resetAt;
  return window;
}

/**
 * Parse the current `{ usages: { limit_5h, ... } }` body.
 * @param {Record<string, unknown>} body - parsed response.
 * @returns {Record<string, object>} windows keyed as the plate renders them.
 */
function parseCurrentLimits(body) {
  const raw = body.usages;
  if (raw === null || typeof raw !== "object") return {};
  const limits = {};
  const mapping = [
    ["fiveHour", "limit_5h"],
    ["sevenDay", "limit_7d"],
    ["monthTotal", "limit_month_total"],
    ["monthCode", "limit_month_code"],
  ];
  for (const [key, field] of mapping) {
    const window = parseRatioWindow(raw[field]);
    if (window !== undefined) limits[key] = window;
  }
  return limits;
}

/**
 * Parse the legacy counter-shaped body when the current shape is absent.
 * @param {Record<string, unknown>} body - parsed response.
 * @returns {Record<string, object>} windows keyed as the plate renders them.
 */
function parseLegacyLimits(body) {
  const limits = {};
  if (Array.isArray(body.limits)) {
    for (const entry of body.limits.slice(0, 8)) {
      if (entry === null || typeof entry !== "object") continue;
      const window = entry.window !== null && typeof entry.window === "object" ? entry.window : undefined;
      const duration = numberOf(window?.duration);
      const unit = typeof window?.timeUnit === "string" ? window.timeUnit : "TIME_UNIT_MINUTE";
      if (duration === undefined || unit !== "TIME_UNIT_MINUTE") continue;
      const parsed = parseCounterWindow(entry.detail);
      if (parsed === undefined) continue;
      if (duration === 300) limits.fiveHour = parsed;
      else if (duration === 1440) limits.day = parsed;
      else if (duration === 10080) limits.sevenDay = parsed;
    }
  }
  const usage = parseCounterWindow(body.usage);
  if (usage !== undefined) limits.monthTotal = usage;
  return limits;
}

/**
 * Normalize the membership level the legacy body carries, when present.
 * @param {Record<string, unknown>} body - parsed response.
 * @returns {string | undefined} plan level.
 */
function parseMembership(body) {
  const level = body.user?.membership?.level;
  return typeof level === "string" && level.length > 0 ? level : undefined;
}

/**
 * Turn the Kimi usage body into the small snapshot the plate renders.
 * @param {unknown} body - parsed API response.
 * @returns {{ limits: Record<string, object>, membership?: string }} snapshot.
 */
export function normalizeUsage(body) {
  const source = body !== null && typeof body === "object" ? body : {};
  let limits = parseCurrentLimits(source);
  if (Object.keys(limits).length === 0) limits = parseLegacyLimits(source);
  const snapshot = { limits };
  const membership = parseMembership(source);
  if (membership !== undefined) snapshot.membership = membership;
  return snapshot;
}

/**
 * Ask the Kimi Code usage endpoint for the account's remaining plan limits.
 * @param {string} access - OAuth access token or api key.
 * @param {{ usageUrl?: string, timeoutMs?: number, fetchImpl?: typeof fetch }} [options] - overrides.
 * @returns {Promise<{ status: "ok", snapshot: object } | { status: "unauthorized" } | { status: "error", message: string }>} result.
 */
export async function fetchKimiUsage(access, options = {}) {
  const usageUrl = typeof options.usageUrl === "string" ? options.usageUrl : KIMI_USAGE_URL;
  const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : REQUEST_TIMEOUT_MS;
  const fetchImpl = typeof options.fetchImpl === "function" ? options.fetchImpl : globalThis.fetch;
  let response;
  try {
    response = await fetchImpl(usageUrl, {
      method: "GET",
      headers: { authorization: `Bearer ${access}`, accept: "application/json" },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    return { status: "error", message: `Kimi limits request failed: ${messageOf(error)}` };
  }
  if (response.status === 401 || response.status === 403) return { status: "unauthorized" };
  if (!response.ok) return { status: "error", message: `Kimi limits endpoint answered HTTP ${String(response.status)}.` };
  let body;
  try {
    body = await response.json();
  } catch (error) {
    return { status: "error", message: `Kimi limits endpoint returned a non-JSON body: ${messageOf(error)}` };
  }
  return { status: "ok", snapshot: normalizeUsage(body) };
}

/**
 * Exchange a Kimi Code refresh token for a fresh OAuth grant.
 * @param {string} refreshToken - stored refresh token.
 * @param {{ tokenUrl?: string, timeoutMs?: number, fetchImpl?: typeof fetch }} [options] - overrides.
 * @returns {Promise<{ type: "oauth", access: string, refresh: string, expires: number }>} the pi-ai credential.
 */
export async function refreshKimiToken(refreshToken, options = {}) {
  const tokenUrl = typeof options.tokenUrl === "string" ? options.tokenUrl : KIMI_TOKEN_URL;
  const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : REQUEST_TIMEOUT_MS;
  const fetchImpl = typeof options.fetchImpl === "function" ? options.fetchImpl : globalThis.fetch;
  const response = await fetchImpl(tokenUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body: new URLSearchParams({
      client_id: KIMI_OAUTH_CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`Kimi token refresh answered HTTP ${String(response.status)}.`);
  let body;
  try {
    body = await response.json();
  } catch (error) {
    throw new Error(`Kimi token refresh returned a non-JSON body: ${messageOf(error)}`);
  }
  const access = typeof body.access_token === "string" && body.access_token.length > 0 ? body.access_token : undefined;
  const refresh = typeof body.refresh_token === "string" && body.refresh_token.length > 0 ? body.refresh_token : undefined;
  const expiresIn = numberOf(body.expires_in);
  if (access === undefined || refresh === undefined || expiresIn === undefined || expiresIn <= 0) {
    throw new Error("Kimi token refresh response is incomplete.");
  }
  return { type: "oauth", access, refresh, expires: Date.now() + expiresIn * 1000 };
}
