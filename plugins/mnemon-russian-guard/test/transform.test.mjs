import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { transformClient } from '../transform.mjs';

// These are the actual verified distributable bundles, not reduced replicas.
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'mnemon-russian');
const work = path.join(project, 'dist', 'work');
const read = relative => fs.readFileSync(path.join(work, relative), 'utf8');
const json = relative => JSON.parse(read(relative));
const rootRu = json('translation/ru.json');
const sourceIds = ['runtime', 'documents', 'memory-spaces', 'skills'];
const packages = [
  { name: 'dsh-mnemon', source: read('upstream/dsh-mnemon/lib/client.js'), localized: read('package/lib/client.js'), russian: rootRu, title: 'tab.label', root: true },
  ...sourceIds.map(id => ({
    name: `dsh-mnemon-source-${id}`,
    source: read(`upstream/dsh-mnemon-source-${id}/lib/client.js`),
    localized: read(`sources/dsh-mnemon-source-${id}/lib/client.js`),
    russian: id === 'skills' ? JSON.parse(fs.readFileSync(path.join(project, 'translation/skills.ru.json'), 'utf8')) : json(`sources/dsh-mnemon-source-${id}/presentation/locales.json`).ru,
    title: { runtime: 'runtime.title', documents: 'documents.title', 'memory-spaces': 'overview.title', skills: 'page.title' }[id],
    id,
  })),
];
const han = /\p{Script=Han}/u;
const interpolate = (text, params) => params === undefined ? text : text.replace(/\{(\w+)\}/g, (match, name) => name in params ? String(params[name]) : match);

function transform(fixture, source = fixture.source) {
  let result;
  assert.doesNotThrow(() => { result = transformClient(fixture.name, source); }, `${fixture.name}: transform must return a result, not throw`);
  assert.ok(result && typeof result === 'object');
  assert.equal(typeof result.code, 'string');
  assert.ok(['patched', 'already-localized', 'incompatible'].includes(result.status), `unexpected status: ${result.status}`);
  if (result.status === 'incompatible') assert.deepEqual(result.missingTranslations, []);
  if (result.missingTranslations !== undefined) {
    assert.ok(Array.isArray(result.missingTranslations));
    assert.ok(result.missingTranslations.every(key => typeof key === 'string'));
  }
  return result;
}

function load(fixture, source, language) {
  const react = {
    Component: class {},
    createContext(value) { return { value, Provider: 'ContextProvider' }; },
    useContext: context => context.value,
    useMemo: fn => fn(), useCallback: fn => fn, memo: fn => fn, forwardRef: fn => fn,
    useRef: value => ({ current: value }),
    useState: value => [typeof value === 'function' ? value() : value, () => {}],
    useEffect() {}, useLayoutEffect() {}, useId: () => 'fixture-id',
    useSyncExternalStore: (_subscribe, get) => get(),
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    Fragment: 'Fragment',
  };
  const primitive = new Proxy(function () {}, {
    get: (_target, key) => key === Symbol.toPrimitive ? () => '' : primitive,
    apply: () => primitive,
  });
  const core = new Proxy({
    useLocale: () => language,
    useT: () => (key, params) => interpolate(rootRu[key] ?? key, params),
    memoryPageStyles: {}, memorySidebarStyles: {},
  }, { get: (target, key) => key in target ? target[key] : primitive });
  const jsx = (type, props) => ({ type, props });
  const imports = {
    react,
    'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'Fragment' },
    'react-dom': { createPortal: jsx },
    'dsh-mnemon/client': core,
    '@deepseek-ai/dsh-client-ui-primitives': primitive,
  };
  const hook = fixture.root ? 'useT$1' : 'useT';
  const helpers = fixture.root
    ? 'useT$1,I18nContext,LocaleContext,TranslationOverride,en,zh,en$1,zh$1'
    : 'useT,en,zh';
  assert.equal(source.split('return module.exports;').length, 2, 'fixture must contain exactly one export seam');
  const instrumented = source.replace('return module.exports;', `exports.__guardTest={${helpers}};return module.exports;`);
  let exports;
  vm.runInNewContext(instrumented, {
    window: { __ModuleLoader__: { load({ factory }) {
      exports = factory(id => {
        assert.ok(Object.hasOwn(imports, id), `Unexpected fixture dependency: ${id}`);
        return imports[id];
      });
    } } },
    console, URL, URLSearchParams, setTimeout, clearTimeout, setInterval, clearInterval,
    Intl, TextEncoder, TextDecoder, AbortController,
  }, { timeout: 5000, filename: `${fixture.name}-${language}.js` });
  assert.ok(exports?.__guardTest, 'real bundle must execute and export the private test seam');
  const helpersExport = exports.__guardTest;
  if (fixture.root) {
    helpersExport.LocaleContext.value = language;
    helpersExport.TranslationOverride.value = undefined;
    helpersExport.I18nContext.value = language.startsWith('ru') ? exports.translateRu
      : language.startsWith('en') ? exports.translateEn : exports.translateZh;
  }
  return { exports, helpers: helpersExport, t: helpersExport[hook]() };
}

function dictionary(source, name) {
  const declaration = new RegExp(`(?:var|const) ${name.replaceAll('$', '\\$')} = \\{`);
  const match = declaration.exec(source);
  assert.ok(match, `upstream fixture dictionary ${name} exists`);
  const start = match.index + match[0].length - 1;
  const end = source.indexOf('\n\t\t};', start);
  assert.notEqual(end, -1);
  return { start, end: end + '\n\t\t}'.length };
}

function addDictionaryEntry(source, name, key, value) {
  const { start } = dictionary(source, name);
  return source.slice(0, start + 1) + `\n\t\t\t${JSON.stringify(key)}: ${JSON.stringify(value)},` + source.slice(start + 1);
}

function changeDictionaryEntry(source, name, key, value) {
  const { start, end } = dictionary(source, name);
  const section = source.slice(start, end);
  const escapedKey = JSON.stringify(key).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const property = new RegExp(`(${escapedKey}:\\s*)"(?:\\\\.|[^"\\\\])*"`);
  assert.ok(property.test(section), `upstream fixture ${name}.${key} exists`);
  return source.slice(0, start) + section.replace(property, (_match, prefix) => prefix + JSON.stringify(value)) + source.slice(end);
}

function removeTranslatorAnchor(fixture) {
  const declaration = fixture.id === 'skills' ? 'function translate(locale) {'
    : `function ${fixture.root ? 'useT$1' : 'useT'}() {`;
  const start = fixture.source.indexOf(declaration);
  assert.notEqual(start, -1);
  const end = fixture.source.indexOf('\n\t\t}', start) + '\n\t\t}'.length;
  assert.ok(end > start);
  return fixture.source.slice(0, start) + declaration + '\n\t\t\treturn () => "upstream translator removed";\n\t\t}' + fixture.source.slice(end);
}

for (const fixture of packages) {
  test(`${fixture.name}: upstream bundle is patched into valid executable JavaScript`, () => {
    const result = transform(fixture);
    assert.equal(result.status, 'patched');
    assert.notEqual(result.code, fixture.source);
    assert.doesNotThrow(() => new vm.Script(result.code));
    const { exports } = load(fixture, result.code, 'ru');
    if (fixture.root) {
      assert.equal(typeof exports.translateRu, 'function');
      for (const [key, expected] of Object.entries(rootRu)) assert.equal(exports.translateRu(key), expected, key);
      assert.equal(exports.translateRu('common.showing', { visible: 2, total: 5 }), interpolate(rootRu['common.showing'], { visible: 2, total: 5 }));
    }
  });

  test(`${fixture.name}: actual ${fixture.root ? 'useT$1' : 'useT'} selects reviewed Russian, including ru-RU`, () => {
    const result = transform(fixture);
    assert.equal(result.status, 'patched');
    for (const language of ['ru', 'ru-RU']) {
      const { t, exports } = load(fixture, result.code, language);
      const catalog = fixture.root ? packages.find(entry => entry.id === 'memory-spaces').russian : fixture.russian;
      for (const [key, expected] of Object.entries(catalog)) {
        assert.equal(t(key), expected, `${language}: ${key}`);
        assert.doesNotMatch(t(key), han, `${language}: ${key}`);
      }
      const title = fixture.root ? exports.translateRu(fixture.title) : t(fixture.title);
      assert.match(title, /[А-Яа-яЁё]/u);
    }
  });

  test(`${fixture.name}: English and Chinese behavior are preserved across all existing keys`, () => {
    const result = transform(fixture);
    assert.equal(result.status, 'patched');
    for (const language of ['en', 'en-US', 'zh', 'zh-CN']) {
      const upstream = load(fixture, fixture.source, language);
      const patched = load(fixture, result.code, language);
      const catalog = fixture.root ? upstream.helpers[language.startsWith('en') ? 'en$1' : 'zh$1'] : upstream.helpers[language.startsWith('en') ? 'en' : 'zh'];
      for (const key of Object.keys(catalog)) {
        assert.equal(patched.t(key), upstream.t(key), `${language}: ${key}`);
        const params = { count: 2, name: 'example', visible: 2, total: 5 };
        assert.equal(patched.t(key, params), upstream.t(key, params), `${language} interpolated: ${key}`);
      }
      if (fixture.root) {
        const translate = language.startsWith('en') ? 'translateEn' : 'translateZh';
        for (const key of Object.keys(upstream.helpers[language.startsWith('en') ? 'en' : 'zh'])) {
          assert.equal(patched.exports[translate](key), upstream.exports[translate](key), `${translate}: ${key}`);
        }
      }
    }
  });

  test(`${fixture.name}: unknown future English keys stay English in Russian, never Chinese`, () => {
    const key = 'guard.future.unknown';
    const english = 'A new upstream setting for {name}';
    let source = addDictionaryEntry(fixture.source, 'en', key, english);
    source = addDictionaryEntry(source, 'zh', key, '上游新设置 {name}');
    if (fixture.root) {
      source = addDictionaryEntry(source, 'en$1', key, english);
      source = addDictionaryEntry(source, 'zh$1', key, '上游新设置 {name}');
    }
    const result = transform(fixture, source);
    assert.equal(result.status, 'patched');
    for (const language of ['ru', 'ru-RU']) {
      const { t, exports } = load(fixture, result.code, language);
      assert.equal(t(key), english);
      assert.equal(t(key, { name: 'test' }), 'A new upstream setting for test');
      assert.doesNotMatch(t(key), han);
      if (fixture.root) assert.equal(exports.translateRu(key, { name: 'test' }), 'A new upstream setting for test');
    }
  });

  test(`${fixture.name}: changed known English copy is not replaced with stale Russian`, () => {
    const changedEnglish = 'Upstream changed the meaning of this title';
    let source = changeDictionaryEntry(fixture.source, 'en', fixture.title, changedEnglish);
    if (fixture.root) source = changeDictionaryEntry(source, 'en$1', 'overview.title', changedEnglish);
    const result = transform(fixture, source);
    assert.equal(result.status, 'patched');
    const { t, exports } = load(fixture, result.code, 'ru');
    assert.equal(t(fixture.root ? 'overview.title' : fixture.title), changedEnglish);
    if (fixture.root) assert.equal(exports.translateRu(fixture.title), changedEnglish);
  });

  test(`${fixture.name}: losing a required translation anchor fails closed without throwing`, () => {
    const source = removeTranslatorAnchor(fixture);
    assert.doesNotThrow(() => new vm.Script(source), 'anchor-drift fixture itself must remain valid JavaScript');
    const result = transform(fixture, source);
    assert.equal(result.status, 'incompatible');
    assert.equal(result.code, source, 'a partial patch must never escape');
  });

  test(`${fixture.name}: unsupported English dictionary expressions fail closed`, () => {
    const { start } = dictionary(fixture.source, 'en');
    const source = fixture.source.slice(0, start + 1)
      + '\n\t\t\t"guard.future.dynamic": String("not a literal"),'
      + fixture.source.slice(start + 1);
    assert.doesNotThrow(() => new vm.Script(source), 'non-literal dictionary fixture is valid JavaScript');
    const result = transform(fixture, source);
    assert.equal(result.status, 'incompatible');
    assert.equal(result.code, source);
  });

  test(`${fixture.name}: patching is byte-idempotent`, () => {
    const first = transform(fixture);
    assert.equal(first.status, 'patched');
    const second = transform(fixture, first.code);
    assert.equal(second.status, 'already-localized');
    assert.equal(second.code, first.code);
  });

  test(`${fixture.name}: current ru.2 bundle is already localized and remains byte-identical`, () => {
    const result = transform(fixture, fixture.localized);
    assert.equal(result.status, 'already-localized');
    assert.equal(result.code, fixture.localized);
    assert.doesNotThrow(() => new vm.Script(result.code));
    const { t, exports } = load(fixture, result.code, 'ru-RU');
    assert.equal(fixture.root ? exports.translateRu(fixture.title) : t(fixture.title), fixture.russian[fixture.title]);
  });

  test(`${fixture.name}: malformed or unrelated source is returned unchanged, never thrown`, () => {
    for (const source of ['', 'not a Mnemon client bundle', 'function broken( {', fixture.source + '\nfunction unterminated( {']) {
      const result = transform(fixture, source);
      assert.equal(result.status, 'incompatible');
      assert.equal(result.code, source);
    }
  });
}

test('unknown package names are rejected without touching otherwise patchable source', () => {
  for (const name of ['unrelated-plugin', 'dsh-mnemon-source-future', '@local/mnemon-russian-guard']) {
    const fixture = { ...packages[0], name };
    const result = transform(fixture);
    assert.equal(result.status, 'incompatible');
    assert.equal(result.code, fixture.source);
  }
});
