# Standalone testing

Install development dependencies without executing third-party lifecycle scripts:

```sh
npm install --ignore-scripts
npm test
```

`npm test` verifies `src`/`lib` parity, checks that `runtime-manifest.json` matches `package-lock.json`, and runs every standalone `test/*.test.js` and `test/*.test.mjs` file with Node's normal per-file isolation. The Russian `.mjs` tests are included explicitly.

The runner prints every excluded upstream-monorepo test and its reason. Those files check upstream CI/release workflows, parent-repository documents, badges or pipeline definitions that are not runtime files of this package. They are not counted as executed and their exclusion is not a claim that the upstream monorepo would pass them.

After dependency changes, review the resulting lockfile and regenerate the runtime download manifest. The update command resolves npm metadata in an isolated temporary directory so an existing pnpm/npm dependency tree cannot leak unsupported development-only protocols into the lock operation:

```sh
npm run lock:update
npm test
```

No live DSH profile, private memory database or production credential is required by the standalone suite.
