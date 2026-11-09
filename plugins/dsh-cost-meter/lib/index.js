/**
 * dsh-cost-meter — Host half.
 *
 * Reads the Kimi Code OAuth grant out of the harness credential store, asks the
 * Kimi Code usage endpoint for the remaining plan limits, caches the answer with
 * a short TTL and serves it to the browser over one exact Fetch route on the
 * `/api` bridge owned by `@deepseek-ai/dsh-client-connection`.
 *
 * The file intentionally imports nothing but its own `./kimi.js`: a plugin
 * installed as a local folder has no node_modules of its own, so it must live on
 * `ctx` services and Node globals alone. The browser half is `lib/client.js`,
 * declared by `dsh.client` in the package manifest.
 *
 * Credential seam facts (verified against dsh-credentials and dsh-llm-pi-ai):
 *   - the pi-ai adapter stores the Kimi provider credential under the record
 *     key `llm-pi-ai/kimi-coding` (scope `llm-pi-ai`, id = provider id);
 *   - an OAuth sign-in is `{ kind: "grant", payload: <pi-ai credential> }` with
 *     the pi-ai Kimi credential `{ type: "oauth", access, refresh, expires }`
 *     (`expires` is a Date.now()-based millisecond timestamp).
 *
 * Tokens are refreshed through `modifyRecord`, the credential store's only write
 * path and the same cross-process lock the pi-ai adapter refreshes under, so a
 * bad token heals without a model call while no read-modify-write can race.
 */
import { KIMI_RECORD_KEY, KIMI_TOKEN_URL, KIMI_USAGE_URL, fetchKimiUsage, refreshKimiToken } from "./kimi.js";

/** Stable Cordis plugin name. */
export const name = "cost-meter";

/** No service is required for the mount itself; both are read lazily. */
export const inject = [];

/** Path of the exact Fetch route; it must stay under `/api`. */
const ROUTE_PATH = "/api/cost-meter/usage";

/** How long a successful snapshot stays fresh. */
const TTL_MS = 60_000;

/** How long a failed snapshot stays fresh before the next attempt. */
const FAIL_TTL_MS = 15_000;

/** Refresh the grant this long before it expires. */
const EXPIRY_SKEW_MS = 60_000;

/** Network timeout of one Kimi request. */
const REQUEST_TIMEOUT_MS = 15_000;

/** pi-ai provider id of the Kimi Code route. */
const PROVIDER = "kimi-coding";

/** Credential references that may hold a plain Kimi API key. */
const API_KEY_REFS = ["KIMI_CODE_API_KEY", "KIMI_CODING_API_KEY", "KIMI_CODING_PRO_API_KEY", "KIMI_API_KEY"];

/** Error code meaning "there is no Kimi sign-in to read". */
const NOT_SIGNED_IN = "not-signed-in";

/** Error code meaning "the stored grant carries no usable OAuth token". */
const TOKEN_EXPIRED = "token-expired";

/** Error code meaning "Kimi refused the stored token". */
const TOKEN_REJECTED = "token-rejected";

/** Error code meaning "the token refresh round trip failed". */
const REFRESH_FAILED = "refresh-failed";

/** Error code for any other usage-endpoint failure. */
const USAGE_UNAVAILABLE = "usage-unavailable";

/** Error code for a missing credential service. */
const NO_CREDENTIAL_STORE = "no-credential-store";

/** Error code for a credential store read failure. */
const CREDENTIAL_READ_FAILED = "credential-read-failed";

/** Error code for a record that holds an API key instead of a grant. */
const API_KEY_RECORD = "api-key-record";

/** Timestamp in ISO form for the response body. */
const iso = (at) => new Date(at).toISOString();

/** Turn an unknown thrown value into a short message. */
function messageOf(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}

/**
 * Resolve the usage endpoint, honouring the same environment override the Kimi
 * Code CLI reads.
 * @returns {string} absolute usage URL.
 */
function usageUrl() {
  const base = typeof process === "object" && process !== null ? process.env.KIMI_CODE_BASE_URL : undefined;
  if (typeof base === "string" && base.length > 0) return `${base.replace(/\/+$/, "")}/usages`;
  return KIMI_USAGE_URL;
}

/**
 * Resolve the OAuth token endpoint, honouring the CLI's host overrides.
 * @returns {string} absolute token URL.
 */
function tokenUrl() {
  const env = typeof process === "object" && process !== null ? process.env : undefined;
  const host = env !== undefined && typeof env.KIMI_CODE_OAUTH_HOST === "string" && env.KIMI_CODE_OAUTH_HOST.length > 0
    ? env.KIMI_CODE_OAUTH_HOST
    : env !== undefined && typeof env.KIMI_OAUTH_HOST === "string" && env.KIMI_OAUTH_HOST.length > 0
      ? env.KIMI_OAUTH_HOST
      : undefined;
  if (host === undefined) return KIMI_TOKEN_URL;
  return `${host.replace(/\/+$/, "")}/api/oauth/token`;
}

/**
 * Read the pi-ai OAuth credential out of a credential record.
 * @param {unknown} record - record from the credential store.
 * @returns {{ type: "oauth", access: string, refresh?: string, expires?: number } | undefined} the credential.
 */
function grantOf(record) {
  if (record === null || typeof record !== "object" || record.kind !== "grant") return undefined;
  const payload = record.payload;
  if (payload === null || typeof payload !== "object" || payload.type !== "oauth") return undefined;
  if (typeof payload.access !== "string" || payload.access.length === 0) return undefined;
  return payload;
}

/**
 * Convert a pi-ai OAuth credential into the record the store holds.
 * @param {{ access: string, refresh: string, expires: number }} credential - refreshed grant.
 * @returns {{ kind: "grant", payload: object }} record.
 */
function grantRecord(credential) {
  return {
    kind: "grant",
    payload: { type: "oauth", access: credential.access, refresh: credential.refresh, expires: credential.expires },
  };
}

/**
 * Resolve a plain Kimi API key from the credential references or the process
 * environment. The Models page stores a key as a named credential reference;
 * a deployment may instead export the same name.
 * @param {object} credentials - credential service of the composition.
 * @returns {Promise<string | undefined>} the key, when one is stored.
 */
async function resolveApiKeyReference(credentials) {
  if (typeof credentials.resolve === "function") {
    for (const ref of API_KEY_REFS) {
      try {
        const hit = await credentials.resolve(ref);
        const value = hit !== null && typeof hit === "object" ? hit.value : undefined;
        if (typeof value === "string" && value.length > 0) return value;
      } catch {
        // try the remaining references
      }
    }
  }
  const env = typeof process === "object" && process !== null ? process.env : undefined;
  if (env !== undefined) {
    for (const ref of API_KEY_REFS) {
      const value = env[ref];
      if (typeof value === "string" && value.length > 0) return value;
    }
  }
  return undefined;
}

/**
 * Serve one cached-or-fresh snapshot over the Host Fetch registry.
 * @param {import("@deepseek-ai/cordis").Context} ctx - host plugin context.
 */
export function apply(ctx) {
  const logger = ctx.logger;

  /** Last successful snapshot and its freshness timestamp. */
  const cache = { snapshot: undefined, at: 0, ttl: 0 };

  /** The load currently in flight, if any. */
  let pending;

  /** Drop the cache so the next read reloads. */
  function invalidate() {
    cache.at = 0;
    cache.snapshot = undefined;
  }

  // pi-ai refreshes and rewrites the grant; a new record means a new token.
  ctx.on("credentials/record-updated", (key) => {
    const name = typeof key === "string" ? key : key !== null && typeof key === "object" ? key.key : undefined;
    if (name === KIMI_RECORD_KEY) {
      logger?.info?.("cost-meter: Kimi credential changed, cache invalidated");
      invalidate();
    }
  });

  /**
   * Resolve a usable access token, refreshing an expired grant in place.
   * @param {{ force?: boolean }} [options] - force a refresh even when unexpired.
   * @returns {Promise<{ access: string } | { error: { code: string, message: string } }>} the token or an error.
   */
  async function resolveAccessToken(options = {}) {
    let credentials;
    try {
      credentials = ctx.get("credentials");
    } catch {
      credentials = undefined;
    }
    if (credentials === undefined) {
      return { error: { code: NO_CREDENTIAL_STORE, message: "This composition mounts no credential store, so Kimi limits cannot be read." } };
    }

    // A Kimi route may authenticate either with a stored OAuth grant written by
    // the pi-ai sign-in flow or with a plain API key saved through the Models
    // page (a credential reference, or an environment variable).
    let record;
    let readFailure;
    try {
      record = await credentials.readRecord(KIMI_RECORD_KEY);
    } catch (error) {
      readFailure = error;
      record = undefined;
    }

    if (record !== undefined && record.kind === "api-key") {
      if (typeof record.key === "string" && record.key.length > 0) return { access: record.key };
      const apiKey = await resolveApiKeyReference(credentials);
      if (apiKey !== undefined) return { access: apiKey };
      return {
        error: {
          code: API_KEY_RECORD,
          message: `The ${KIMI_RECORD_KEY} record holds an API key without a readable value; save the key again in Settings → Models.`,
        },
      };
    }

    const payload = grantOf(record);
    if (payload !== undefined) {
      const expires = typeof payload.expires === "number" && Number.isFinite(payload.expires) ? payload.expires : undefined;
      const fresh = expires === undefined || expires - Date.now() > EXPIRY_SKEW_MS;
      if (fresh && options.force !== true) return { access: payload.access };
      if (typeof payload.refresh !== "string" || payload.refresh.length === 0) {
        const apiKey = await resolveApiKeyReference(credentials);
        if (apiKey !== undefined) return { access: apiKey };
        return { error: { code: TOKEN_EXPIRED, message: "The stored Kimi grant is expired and holds no refresh token. Sign in again from Settings → Models." } };
      }
      if (typeof credentials.modifyRecord !== "function") {
        return { error: { code: REFRESH_FAILED, message: "The credential store cannot refresh the Kimi grant in this composition." } };
      }

      // Refresh inside the store's cross-process lock. The mutation re-checks the
      // record because another process may have refreshed it while we waited.
      let refreshed;
      try {
        await credentials.modifyRecord(KIMI_RECORD_KEY, async (current) => {
          const currentPayload = grantOf(current);
          if (currentPayload === undefined) return current;
          if (typeof currentPayload.refresh !== "string" || currentPayload.refresh.length === 0) {
            refreshed = currentPayload;
            return current;
          }
          const currentExpires = typeof currentPayload.expires === "number" && Number.isFinite(currentPayload.expires) ? currentPayload.expires : undefined;
          if (options.force !== true && currentExpires !== undefined && currentExpires - Date.now() > EXPIRY_SKEW_MS) {
            refreshed = currentPayload;
            return current;
          }
          const next = await refreshKimiToken(currentPayload.refresh, { tokenUrl: tokenUrl(), timeoutMs: REQUEST_TIMEOUT_MS });
          refreshed = next;
          return grantRecord(next);
        });
      } catch (error) {
        const apiKey = await resolveApiKeyReference(credentials);
        if (apiKey !== undefined) return { access: apiKey };
        return { error: { code: REFRESH_FAILED, message: `Kimi token refresh failed: ${messageOf(error)}. Sign in again from Settings → Models.` } };
      }
      if (refreshed !== undefined && typeof refreshed.access === "string" && refreshed.access.length > 0) return { access: refreshed.access };
      return { error: { code: REFRESH_FAILED, message: "Kimi token refresh produced no access token. Sign in again from Settings → Models." } };
    }

    const apiKey = await resolveApiKeyReference(credentials);
    if (apiKey !== undefined) return { access: apiKey };
    if (readFailure !== undefined) {
      return { error: { code: CREDENTIAL_READ_FAILED, message: `The credential store could not read ${KIMI_RECORD_KEY}: ${messageOf(readFailure)}` } };
    }
    return {
      error: {
        code: NOT_SIGNED_IN,
        message: "No Kimi credential is stored. Open Settings → Models and either sign in with Kimi Code or save a Kimi API key.",
      },
    };
  }

  /**
   * Read one fresh snapshot from Kimi.
   * @returns {Promise<object>} response body.
   */
  async function load() {
    const fetchedAt = Date.now();
    const token = await resolveAccessToken({});
    if (token.error !== undefined) {
      const body = { ok: false, provider: PROVIDER, fetchedAt: iso(fetchedAt), error: token.error };
      cache.snapshot = body;
      cache.at = fetchedAt;
      cache.ttl = FAIL_TTL_MS;
      return body;
    }
    const result = await fetchKimiUsage(token.access, { usageUrl: usageUrl(), timeoutMs: REQUEST_TIMEOUT_MS });
    if (result.status === "ok") {
      const body = { ok: true, provider: PROVIDER, fetchedAt: iso(Date.now()), ...result.snapshot };
      cache.snapshot = body;
      cache.at = Date.now();
      cache.ttl = TTL_MS;
      return body;
    }
    if (result.status === "unauthorized") {
      // The token was rejected even before its expiry: refresh once, then retry.
      const refreshed = await resolveAccessToken({ force: true });
      if (refreshed.error === undefined) {
        const retry = await fetchKimiUsage(refreshed.access, { usageUrl: usageUrl(), timeoutMs: REQUEST_TIMEOUT_MS });
        if (retry.status === "ok") {
          const body = { ok: true, provider: PROVIDER, fetchedAt: iso(Date.now()), ...retry.snapshot };
          cache.snapshot = body;
          cache.at = Date.now();
          cache.ttl = TTL_MS;
          return body;
        }
      }
      const body = {
        ok: false,
        provider: PROVIDER,
        fetchedAt: iso(fetchedAt),
        error: {
          code: TOKEN_REJECTED,
          message: "Kimi rejected the stored credential. Sign in again with Kimi Code or update the API key in Settings → Models.",
        },
      };
      cache.snapshot = body;
      cache.at = fetchedAt;
      cache.ttl = FAIL_TTL_MS;
      return body;
    }
    const body = { ok: false, provider: PROVIDER, fetchedAt: iso(fetchedAt), error: { code: USAGE_UNAVAILABLE, message: result.message } };
    cache.snapshot = body;
    cache.at = fetchedAt;
    cache.ttl = FAIL_TTL_MS;
    return body;
  }

  /**
   * The snapshot the route serves: a fresh cache hit, an in-flight join, or a
   * fresh load. A stale successful snapshot is served when a reload fails.
   * @param {boolean} force - ignore the TTL.
   * @returns {Promise<object>} response body.
   */
  async function snapshot(force) {
    const fresh = cache.snapshot !== undefined && Date.now() - cache.at < cache.ttl;
    if (fresh && force !== true) return cache.snapshot;
    if (pending !== undefined) return pending;
    pending = load()
      .then((body) => {
        if (body.ok !== true && cache.snapshot !== undefined && cache.snapshot.ok === true) {
          return { ...cache.snapshot, stale: true, error: body.error };
        }
        return body;
      })
      .catch((error) => ({ ok: false, provider: PROVIDER, fetchedAt: iso(Date.now()), error: { code: USAGE_UNAVAILABLE, message: messageOf(error) } }))
      .finally(() => {
        pending = undefined;
      });
    return pending;
  }

  // The browser transport: an exact route registered through the connection
  // service's Fetch registry. `register` is scoped to this plugin context, so
  // the route disappears when the plugin is disposed.
  ctx.inject(["connection"], (child) => {
    child.effect(
      () =>
        child.connection.fetch.register({
          path: ROUTE_PATH,
          methods: ["GET"],
          requestBody: "buffered",
          fetch: async (request) => {
            let body;
            try {
              body = await snapshot(new URL(request.url).searchParams.get("refresh") === "1");
            } catch (error) {
              body = { ok: false, provider: PROVIDER, fetchedAt: iso(Date.now()), error: { code: USAGE_UNAVAILABLE, message: messageOf(error) } };
            }
            return Response.json(body, {
              status: 200,
              headers: { "cache-control": "no-store" },
            });
          },
        }),
      "dsh-cost-meter: /api/cost-meter/usage route",
    );
    logger?.info?.("cost-meter: serving %s", ROUTE_PATH);
  });
}
