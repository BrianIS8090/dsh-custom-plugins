/**
 * dsh-cost-meter — browser half.
 *
 * This is a hand-written client bundle: the module system expects a script that
 * registers one factory under the package name, exactly as the built bundles of
 * shipped plugins do. `require(...)` may only name modules from the shell's
 * frozen platform table; this plugin needs only `react`.
 *
 * The plate renders account-level Kimi Code limits, so it belongs next to the
 * shipped composer-dock pills. It is gated on the selected model: only a Kimi
 * route shows it. Data comes from the Host half's exact Fetch route on the
 * `/api` bridge (`lib/index.js`), polled with a short interval.
 */
window.__ModuleLoader__.load({
  id: "dsh-cost-meter",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    let react = require("react");
    const h = react.createElement;

    /** Dictionary namespace owned by this plugin. */
    const NS = "cost-meter";
    /** Host route registered by `lib/index.js` (document-relative, like shipped plugins). */
    const USAGE_PATH = "api/cost-meter/usage";
    /** Poll interval while a Kimi model is selected; the Host keeps its own cache. */
    const POLL_MS = 60_000;
    /** Marker attribute of the injected stylesheet. */
    const CSS_TAG = "dsh-cost-meter/plate.css";

    /** Styles reuse the shared --dsw-* aliases so the plate follows the theme. */
    const CSS = [
      ".dshcm-anchor{min-width:0;font-size:calc(var(--dsh-content-font-size-secondary,13px) - 1px);",
      "line-height:calc(20px + var(--dsh-content-font-delta-secondary,0px));display:inline-flex}",
      ".dshcm-pill{box-sizing:border-box;border-radius:var(--dsw-radius-sm);max-width:100%;",
      "color:var(--dsw-alias-label-tertiary);font:inherit;font-variant-numeric:tabular-nums;",
      "line-height:inherit;white-space:nowrap;background:0 0;border:none;align-items:center;gap:6px;",
      "padding:1px 8px;display:inline-flex;cursor:pointer;font-family:inherit}",
      ".dshcm-pill:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}",
      ".dshcm-pill:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,currentColor);outline-offset:2px}",
      ".dshcm-name{font-weight:600;color:var(--dsw-alias-label-secondary)}",
      ".dshcm-label{text-overflow:ellipsis;min-width:0;overflow:hidden}",
      ".dshcm-anchor[data-phase=failed] .dshcm-pill{color:var(--dsw-alias-label-quaternary,var(--dsw-alias-label-tertiary))}",
      ".dshcm-anchor[data-stale=true] .dshcm-pill{opacity:.6}",
    ].join("");

    /** Install the plugin stylesheet once per page, the way shipped bundles do. */
    function installStyles() {
      if (typeof document === "undefined") return;
      if (document.querySelector('style[data-plugin-css="' + CSS_TAG + '"]') !== null) return;
      const tag = document.createElement("style");
      tag.dataset.plugin = "dsh-cost-meter";
      tag.dataset.pluginCss = CSS_TAG;
      tag.textContent = CSS;
      document.head.append(tag);
    }

    /** English copy. */
    const en = {
      "unit.fiveHour": "5h",
      "unit.month": "mo",
      "value.percent": "{{percent}}%",
      "value.none": "—",
      "plate.loading": "…",
      "title.plate": "Kimi Code remaining plan limits",
      "title.fiveHour": "5-hour limit: {{percent}}% left",
      "title.month": "Monthly limit: {{percent}}% left",
      "title.sevenDay": "7-day limit: {{percent}}% left",
      "title.resets": "resets {{time}}",
      "title.plan": "Plan: {{level}}",
      "title.stale": "Showing the last known limits: the last refresh failed.",
      "title.hint": "Click to refresh now",
      "error.not-signed-in": "Not signed in to Kimi Code. Open Settings → Models and sign in with Kimi Code.",
      "error.token-expired": "The Kimi sign-in has expired. Sign in again from Settings → Models.",
      "error.token-rejected": "Kimi rejected the stored sign-in. Sign in again from Settings → Models.",
      "error.refresh-failed": "Kimi sign-in could not be refreshed. Sign in again from Settings → Models.",
      "error.no-credential-store": "This build mounts no credential store, so Kimi limits cannot be read.",
      "error.api-key-record": "The Kimi route stores an API key, not a Kimi Code sign-in; remaining limits need the sign-in.",
      "error.usage-unavailable": "Kimi limits are unavailable: {{message}}",
      "error.generic": "Kimi limits are unavailable.",
    };

    /** Simplified Chinese copy. */
    const zh = {
      "unit.fiveHour": "5小时",
      "unit.month": "月",
      "value.percent": "{{percent}}%",
      "value.none": "—",
      "plate.loading": "…",
      "title.plate": "Kimi Code 剩余套餐额度",
      "title.fiveHour": "5 小时额度：剩余 {{percent}}%",
      "title.month": "月度额度：剩余 {{percent}}%",
      "title.sevenDay": "7 天额度：剩余 {{percent}}%",
      "title.resets": "重置 {{time}}",
      "title.plan": "套餐：{{level}}",
      "title.stale": "显示上次已知额度：最近一次刷新失败。",
      "title.hint": "点击立即刷新",
      "error.not-signed-in": "尚未登录 Kimi Code。请打开 设置 → 模型 并使用 Kimi Code 登录。",
      "error.token-expired": "Kimi 登录已过期，请在 设置 → 模型 中重新登录。",
      "error.token-rejected": "Kimi 拒绝了已保存的登录，请在 设置 → 模型 中重新登录。",
      "error.refresh-failed": "无法刷新 Kimi 登录，请在 设置 → 模型 中重新登录。",
      "error.no-credential-store": "此版本未挂载凭据存储，无法读取 Kimi 额度。",
      "error.api-key-record": "Kimi 路由保存的是 API 密钥而非 Kimi Code 登录；剩余额度需要登录。",
      "error.usage-unavailable": "Kimi 额度不可用：{{message}}",
      "error.generic": "Kimi 额度不可用。",
    };

    /**
     * Fill `{{name}}` placeholders of one dictionary string.
     * @param {string} text - dictionary value.
     * @param {Record<string, unknown>} values - replacements.
     * @returns the rendered text.
     */
    function format(text, values) {
      return text.replace(/\{\{(\w+)\}\}/g, (match, key) => (Object.hasOwn(values, key) ? String(values[key]) : match));
    }

    /**
     * Render one remaining share as an integer percentage.
     * @param {{ remaining?: number } | undefined} window - window snapshot.
     * @returns the percentage text, or an em dash.
     */
    function percentOf(window) {
      if (window === undefined || window === null || typeof window.remaining !== "number" || !Number.isFinite(window.remaining)) return undefined;
      return Math.round(Math.max(0, Math.min(1, window.remaining)) * 100);
    }

    /**
     * Render one ISO reset timestamp in the reader's local time.
     * @param {string | undefined} iso - reset time from the Host.
     * @returns the text, or an empty string.
     */
    function resetTime(iso) {
      if (typeof iso !== "string" || iso.length === 0) return "";
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return "";
      const time = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
      const today = new Date();
      const sameDay = date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
      return sameDay ? time : date.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " " + time;
    }

    /**
     * Localize one Host failure code.
     * @param {(key: string) => string} t - dictionary lookup.
     * @param {{ code?: string, message?: string } | undefined} error - Host error.
     * @returns {string} one human sentence.
     */
    function describeError(t, error) {
      const code = error !== undefined && error !== null ? error.code : undefined;
      const known = typeof code === "string" && ["not-signed-in", "token-expired", "token-rejected", "refresh-failed", "no-credential-store", "api-key-record"].includes(code);
      if (known) return t("error." + code);
      if (code === "usage-unavailable" || code === "credential-read-failed") {
        const message = error !== undefined && error !== null && typeof error.message === "string" ? error.message : "";
        return format(t("error.usage-unavailable"), { message: message === "" ? t("error.generic") : message });
      }
      return t("error.generic");
    }

    /**
     * Build the tooltip lines for one snapshot.
     * @param {(key: string) => string} t - dictionary lookup.
     * @param {object | undefined} data - Host response body.
     * @returns {string} multi-line tooltip.
     */
    function describe(t, data) {
      const lines = [t("title.plate")];
      if (data === undefined || data === null) {
        lines.push(t("title.hint"));
        return lines.join("\n");
      }
      if (data.ok === true) {
        const limits = data.limits !== null && typeof data.limits === "object" ? data.limits : {};
        const rows = [
          ["title.fiveHour", limits.fiveHour],
          ["title.sevenDay", limits.sevenDay],
          ["title.month", limits.monthTotal !== undefined ? limits.monthTotal : limits.monthCode],
        ];
        for (const [key, window] of rows) {
          const percent = percentOf(window);
          if (percent === undefined) continue;
          let line = format(t(key), { percent });
          const reset = resetTime(window !== undefined && window !== null ? window.resetAt : undefined);
          if (reset !== "") line += " · " + format(t("title.resets"), { time: reset });
          lines.push(line);
        }
        if (typeof data.membership === "string") lines.push(format(t("title.plan"), { level: data.membership }));
        if (data.stale === true) lines.push(t("title.stale"));
        lines.push(t("title.hint"));
        return lines.join("\n");
      }
      lines.push(describeError(t, data.error));
      lines.push(t("title.hint"));
      return lines.join("\n");
    }

    /** One shared in-flight request per page, so two mounts do not double-fetch. */
    let pending;
    /** Last successful body, kept for a cheap remount repaint. */
    let lastBody;
    let lastAt = 0;

    /**
     * Read the Host route.
     * @param {boolean} force - ask the Host to bypass its cache.
     * @returns {Promise<object>} the response body (never throws).
     */
    function readUsage(force) {
      if (force !== true && lastBody !== undefined && Date.now() - lastAt < 15_000) return Promise.resolve(lastBody);
      if (pending !== undefined) return pending;
      const url = force === true ? USAGE_PATH + "?refresh=1" : USAGE_PATH;
      pending = fetch(url, { headers: { accept: "application/json" }, cache: "no-store" })
        .then(async (response) => {
          if (!response.ok) throw new Error("HTTP " + String(response.status));
          const body = await response.json();
          if (body !== null && typeof body === "object") {
            lastBody = body;
            lastAt = Date.now();
            return body;
          }
          throw new Error("Unexpected response body");
        })
        .catch((error) => ({ ok: false, error: { code: "usage-unavailable", message: String(error && error.message ? error.message : error) } }))
        .finally(() => {
          pending = undefined;
        });
      return pending;
    }

    /**
     * Resolve the provider and model ids of the current selection.
     * @param {unknown} selection - `modelSelection` projection value.
     * @returns {{ provider: string, model: string }} lowercase ids.
     */
    function selectionIds(selection) {
      const current = selection !== undefined && selection !== null ? selection.next ?? selection.lastUsed : undefined;
      const readId = (value) => {
        if (typeof value === "string") return value.toLowerCase();
        if (value !== null && typeof value === "object" && typeof value.id === "string") return value.id.toLowerCase();
        return "";
      };
      return {
        provider: current !== null && typeof current === "object" ? readId(current.provider) : "",
        model: current !== null && typeof current === "object" ? readId(current.model) : "",
      };
    }

    /**
     * The dock plate: remaining Kimi Code limits for the selected Kimi route.
     * @param {{ useProjection?: Function, t?: Function }} props - slot props.
     * @returns {import("react").ReactElement | null} the plate.
     */
    function KimiLimitsPlate({ useProjection, t }) {
      const translate = typeof t === "function" ? t : (key) => en[key] ?? key;
      const selection = typeof useProjection === "function" ? useProjection("modelSelection") : undefined;
      const ids = selectionIds(selection);
      const active = ids.provider.includes("kimi") || ids.model.includes("kimi");
      const [state, setState] = react.useState(() => ({ phase: "idle", body: undefined }));

      react.useEffect(() => {
        if (!active) {
          setState({ phase: "idle", body: undefined });
          return undefined;
        }
        let alive = true;
        let timer = 0;
        const paint = (body) => {
          if (!alive) return;
          setState(body.ok === true ? { phase: "ready", body } : { phase: "failed", body });
        };
        const tick = () => {
          void readUsage(false).then((body) => {
            paint(body);
            if (alive) timer = setTimeout(tick, POLL_MS);
          });
        };
        setState({ phase: "loading", body: undefined });
        tick();
        return () => {
          alive = false;
          clearTimeout(timer);
        };
      }, [active]);

      if (!active) return null;

      const refresh = () => {
        setState((previous) => ({ phase: previous.body !== undefined && previous.body.ok === true ? "ready" : "loading", body: previous.body }));
        void readUsage(true).then((body) => setState(body.ok === true ? { phase: "ready", body } : { phase: "failed", body }));
      };

      const data = state.body;
      const limits = data !== undefined && data !== null && data.ok === true && data.limits !== null && typeof data.limits === "object" ? data.limits : undefined;
      const five = limits !== undefined ? percentOf(limits.fiveHour) : undefined;
      const monthWindow = limits !== undefined ? (limits.monthTotal !== undefined ? limits.monthTotal : limits.monthCode) : undefined;
      const month = limits !== undefined ? percentOf(monthWindow) : undefined;
      const value = (percent) => (percent === undefined ? translate("value.none") : format(translate("value.percent"), { percent }));
      const label = translate("unit.fiveHour") + " " + value(five) + " · " + translate("unit.month") + " " + value(month);
      const title = describe(translate, data);

      return h(
        "span",
        { className: "dshcm-anchor", "data-kimi-limits": "true", "data-phase": state.phase, "data-stale": data !== undefined && data !== null && data.stale === true ? "true" : undefined },
        h(
          "button",
          { type: "button", className: "dshcm-pill", title, "aria-label": title.replace(/\n/g, ". "), onClick: refresh },
          h("span", { className: "dshcm-name" }, "Kimi"),
          h("span", { className: "dshcm-label" }, label),
        ),
      );
    }

    /** Required browser services: slot registry and dictionaries. */
    const inject = ["slots", "locale"];

    /**
     * Mount the plate into the composer dock right after the shipped usage pill.
     * @param {import("@deepseek-ai/cordis").Context} ctx - browser plugin context.
     */
    function apply(ctx) {
      installStyles();
      ctx.effect(() => ctx.locale.register(NS, { en, zh }), "cost-meter: dictionaries");
      ctx.slots.inject("conversation.composer.dock", () =>
        ctx.slots.register(
          {
            name: "conversation.composer.dock",
            id: "kimi-limits",
            order: 2,
            locale: NS,
          },
          KimiLimitsPlate,
        ),
      );
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
