const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const React = require('react');
const { renderToString } = require('react-dom/server');

function loadWarRoomView() {
  let factory;
  vm.runInNewContext(require('node:fs').readFileSync(path.join(__dirname, '..', 'client.js'), 'utf8'), {
    window: { __ModuleLoader__: { load: definition => { factory = definition.factory; } } },
  });
  const module = factory(require);
  let View;
  const dictionaries = {};
  const ctx = {
    effect: callback => callback(),
    locale: {
      register: (namespace, values) => { Object.assign(dictionaries, values); },
      bind: () => key => dictionaries.en[key] || key,
    },
    slots: {
      inject: (name, callback) => callback(),
      register: (options, component) => { View = component; },
    },
    sessions: {},
  };
  module.apply(ctx);
  return View;
}

test('War Room renders its empty state when the session has no runs', () => {
  const View = loadWarRoomView();
  const projectionsBySession = { lead: { values: {} } };
  const html = renderToString(React.createElement(View, {
    sessionId: 'lead',
    t: key => key,
    sessions: {},
    useSession: selector => selector({}),
    useSessions: selector => selector({ projectionsBySession }),
    useSessionStatus: selector => selector(new Map()),
  }));
  assert.match(html, /emptyTitle/);
  assert.doesNotMatch(html, /renderError/);
});
