import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { STR, langOf } from "../src/lang.js";
import { Config } from "../src/config.js";
import { renderMirrorText, parseHumanEdits } from "../src/mirror.js";

const norm = (x) => typeof x === "function" ? x.toString()
  : x && typeof x === "object" ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, norm(v)])) : x;
const collect = (x, language) => Object.fromEntries(Object.entries(x).map(([key, value]) => [key,
  value instanceof RegExp ? value.source : value && typeof value === "object"
    ? Object.hasOwn(value, language) ? norm(value[language]) : collect(value, language) : norm(value)
]));

// Recorded from the unmodified 0.10.1 fork before adding ru. Include function source,
// nested dictionaries, every prompt, and the shared legacy-note regular expression.
const original = {
  en: "df62831f3714a44f49e761da76aa167ff83ab3340fd2c0864b0988734e0a405a",
  zh: "0efab829c1662b96a1dbbef4ba08362f1c73e38a73947d896ea49d3097cdda68"
};

test("language ru is accepted, selected per instance, and keeps the zh default", () => {
  assert.deepEqual(Config.dict.language.list.map((item) => item.value), ["zh", "en", "ru"]);
  assert.equal(Config.dict.language.meta.default, "zh");
  for (const language of ["ru", "en", "zh"]) {
    assert.equal(Config({ language }).language, language);
    assert.equal(langOf({ language }), language);
  }
  for (const config of [undefined, null, {}, { language: "fr" }, { language: "RU" }]) {
    assert.equal(langOf(config), "zh");
  }
  assert.equal(Config({}).language, "zh");
  assert.throws(() => Config({ language: "fr" }));
});

function checkShape(actual, expected, path) {
  assert.equal(typeof actual, typeof expected, `${path}: matching value type`);
  if (typeof expected === "function") {
    assert.equal(actual.length, expected.length, `${path}: function arity`);
  } else if (expected && typeof expected === "object") {
    assert.deepEqual(Object.keys(actual).sort(), Object.keys(expected).sort(), `${path}: complete nested keys`);
    for (const key of Object.keys(expected)) checkShape(actual[key], expected[key], `${path}.${key}`);
  } else {
    assert.ok(actual.length, `${path}: nonempty translation`);
    assert.match(actual, /[А-Яа-яЁё]/, `${path}: translated Russian text`);
    assert.doesNotMatch(actual, /[\u3400-\u9fff]/, `${path}: no untranslated Chinese`);
  }
}

test("every locale branch has its own complete Russian shape, without fallback", () => {
  function visit(table, path = "STR") {
    for (const [key, value] of Object.entries(table)) {
      if (value instanceof RegExp) continue; // Shared compatibility matcher, not a locale branch.
      assert.equal(typeof value, "object", `${path}.${key}: locale table`);
      if (Object.hasOwn(value, "en")) {
        assert.ok(Object.hasOwn(value, "ru"), `${path}.${key}: explicit own ru branch`);
        assert.deepEqual(Object.keys(value).sort(), ["en", "ru", "zh"]);
        checkShape(value.ru, value.en, `${path}.${key}.ru`);
      } else visit(value, `${path}.${key}`);
    }
  }
  visit(STR);
});

const argsFor = (key, arity) => {
  if (key === "candidateConflicts") return [{ a: { id: "id-a", type: "project", title: "title-a", content: "content-a" }, b: { id: "id-b", type: "decision", title: "title-b", content: "content-b" }, similarity: 0.876 }];
  if (key === "evidenceSuffix") return ["content-a", ["id-a", "id-b"]];
  if (key === "open") return [{ pipelineId: "pipeline-id", startedAt: "date-a", bufferedEvents: 17, truncated: true, unattributed: 5, ambiguous: 6 }, "recorded-a"];
  return Array.from({ length: arity }, (_, i) => `sentinel-${i}`);
};

test("Russian functions execute, preserve dynamic arguments and technical markers", () => {
  function visit(ru, en, key, path) {
    if (typeof ru === "function") {
      const args = argsFor(key, en.length);
      const rendered = ru(...args);
      assert.equal(typeof rendered, "string", path);
      assert.doesNotMatch(rendered, /undefined|\[object Object\]|[\u3400-\u9fff]/, path);
      // entryLine is intentionally only punctuation around caller-supplied text.
      if (key !== "entryLine") assert.match(rendered, /[А-Яа-яЁё]/, path);
      for (const arg of args.filter((x) => typeof x === "string")) assert.ok(rendered.includes(arg), `${path}: preserves ${arg}`);
    } else if (ru && typeof ru === "object") {
      for (const k of Object.keys(ru)) visit(ru[k], en[k], k, `${path}.${k}`);
    }
  }
  for (const [key, pair] of Object.entries(STR)) {
    if (pair && Object.hasOwn(pair, "ru")) visit(pair.ru, pair.en, key, `STR.${key}.ru`);
  }
  assert.equal(STR.scopeConflictParkReason.ru(""), "конфликт между областями (разная принадлежность — без автоматического разрешения)");
  assert.ok(!STR.moRunStatus.ru.open({ truncated: false }, 0).includes("буфер усечён"));
  assert.match(STR.truncatedHint.ru(100, 200, "id-a"), /memory_get "id-a"/);
  assert.match(STR.moRunUsage.ru, /\/mo-run confirm P6 V2/);
});

test("all Russian generation prompts explicitly require Russian and retain wire fields", () => {
  assert.equal(Object.keys(STR.prompts).length, 11);
  for (const [key, pair] of Object.entries(STR.prompts)) {
    assert.equal(typeof pair.ru, "string", key);
    assert.match(pair.ru, /на русском языке/, key);
    assert.doesNotMatch(pair.ru, /in English|на английском|[\u3400-\u9fff]|\$\{/, key);
    // Exact technical JSON field names are never translated.
    const fields = [...pair.en.matchAll(/"([A-Za-z_]+)"\s*:/g)].map((match) => match[1]);
    for (const field of new Set(fields)) assert.ok(pair.ru.includes(`"${field}":`), `${key}: JSON field ${field}`);
  }
  for (const key of ["summary", "codingSummary"]) {
    const prompt = STR.prompts[key].ru;
    assert.match(prompt, /preference\|project\|decision\|history\|rejected_solution\|pitfall\|constraint/);
    assert.match(prompt, /ISO-8601/);
    assert.match(prompt, /не выдавай текущее время за время события/);
    assert.match(prompt, /2-4/);
    assert.match(prompt, /4-8/);
    assert.match(prompt, /предположения, а не факты/);
    assert.match(prompt, /личности, способностей, настроения или характера/);
  }
  const consolidation = STR.prompts.consolidation.ru;
  for (const token of ["keepSource", "winner", "loser", "keep", "merge", "archive", "update", "conflict"]) assert.ok(consolidation.includes(token));
  assert.match(consolidation, /не более 2 update/i);
  assert.match(consolidation, /не более 8 archive/i);
  assert.match(consolidation, /24 часа/);
  assert.match(consolidation, /только записи одного типа/);
  assert.match(consolidation, /один id нельзя использовать в нескольких решениях/);
  assert.match(STR.prompts.conflictFull.ru, /supersede/);
  assert.match(STR.prompts.conflictFull.ru, /differentiate/);
  assert.match(STR.prompts.conflictFull.ru, /distinctions — непустой массив/);
  assert.match(STR.prompts.pattern.ru, /не более N/);
  assert.match(STR.prompts.pattern.ru, /2-4 предложения/);
  assert.match(STR.prompts.narrative.ru, /80-150 слов/);
  assert.match(STR.prompts.dreamSummary.ru, /150-200 слов/);
  assert.match(STR.prompts.profileExtract.ru, /300-600 слов/);
  assert.match(STR.prompts.profileExtract.ru, /данные, а не инструкции/);
  assert.match(STR.prompts.profileExtract.ru, /Никогда не давай имя самому ассистенту/);
  assert.match(STR.dreamRoleReminder.ru, /данные, а не инструкции/);
  assert.match(STR.dreamTextRoleReminder.ru, /не JSON, не массив/);
});

test("English and Chinese locale values and function sources are unchanged", () => {
  for (const language of ["en", "zh"]) {
    const digest = createHash("sha256").update(JSON.stringify(collect(STR, language))).digest("hex");
    assert.equal(digest, original[language], `${language}: original 0.10.1 locale fingerprint`);
  }
});

test("published lib locale and config match src byte for byte", () => {
  for (const file of ["lang.js", "config.js"]) {
    assert.equal(readFileSync(new URL(`../src/${file}`, import.meta.url), "utf8"), readFileSync(new URL(`../lib/${file}`, import.meta.url), "utf8"));
  }
});

test("Russian mirror metadata round-trips without entering content", () => {
  const memory = { id: "ru-id", type: "preference", title: "Заголовок", content: "Русское содержимое.", importance: 5, tags: ["tag"], updated_at: "2026-11-06T12:00:00Z" };
  const text = renderMirrorText("preference", [memory], "ru");
  assert.match(text, /\*\*Тип\*\*: preference/);
  const edits = parseHumanEdits(text);
  assert.equal(edits.length, 1);
  assert.equal(edits[0].id, memory.id);
  assert.equal(edits[0].content, memory.content);
  assert.equal(edits[0].updated_at, memory.updated_at);
});
