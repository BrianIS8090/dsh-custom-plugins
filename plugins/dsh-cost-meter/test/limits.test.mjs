import test from "node:test";
import assert from "node:assert/strict";
import { apply } from "../lib/index.js";

test("reads limits with the KIMI_CODE_API_KEY credential reference used by the kimi-code provider", async () => {
  let route;
  const credentials = {
    async readRecord() {
      return undefined;
    },
    async resolve(ref) {
      if (ref === "KIMI_CODE_API_KEY") return { value: "test-key" };
      throw new Error(`Unknown credential reference: ${ref}`);
    },
  };
  const ctx = {
    logger: { info() {} },
    on() {},
    get(name) {
      if (name === "credentials") return credentials;
      throw new Error(`Unknown service: ${name}`);
    },
    inject(_services, callback) {
      callback({
        effect(fn) {
          fn();
        },
        connection: {
          fetch: {
            register(definition) {
              route = definition;
            },
          },
        },
      });
    },
  };
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_url, init) => {
    if (init?.headers?.authorization !== "Bearer test-key") {
      return Response.json({ error: "unexpected credential" }, { status: 401 });
    }
    return Response.json({
      usages: {
        limit_5h: { used_ratio: 0.25, reset_time: "2026-11-08T18:00:00+05:00" },
        limit_month_total: { used_ratio: 0.08, reset_time: "2026-12-01T00:00:00+05:00" },
      },
    });
  };

  try {
    apply(ctx);
    assert.ok(route, "usage route is registered");
    const response = await route.fetch({ url: "http://127.0.0.1/api/cost-meter/usage" });
    const body = await response.json();
    assert.equal(body.ok, true, body.error?.message);
    assert.equal(body.limits?.fiveHour?.remaining, 0.75);
    assert.equal(body.limits?.monthTotal?.remaining, 0.92);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
