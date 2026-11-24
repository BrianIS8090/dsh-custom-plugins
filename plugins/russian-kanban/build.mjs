/**
 * dsh-kanban client build.
 *
 * Bundle React, TSX, dnd-kit and Radix into one CJS artifact with esbuild,
 * then wrap it in the official client-modules window.__ModuleLoader__.load({ id, factory }).
 * Inline namespaced kanban-* CSS as a string and inject it at runtime.
 */
import esbuild from 'esbuild'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const minify = !process.argv.includes('--no-minify')
const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
if (typeof packageJson.name !== 'string' || packageJson.name.length === 0) {
  throw new Error('package.json must define a non-empty package name')
}
const moduleId = packageJson.name
mkdirSync(resolve(root, 'dist'), { recursive: true })
mkdirSync(resolve(root, 'lib'), { recursive: true })

const result = await esbuild.build({
  entryPoints: [resolve(root, 'src/client/entry.tsx')],
  bundle: true,
  outfile: resolve(root, 'dist/app.cjs'),
  format: 'cjs',
  platform: 'browser',
  jsx: 'automatic',
  jsxImportSource: 'react',
  target: ['es2020'],
  sourcemap: false,
  minify,
  logLevel: 'info',
  external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom/client', '@deepseek-ai/dsh-client-ui-primitives', '@deepseek-ai/dsh-client-store'],
  alias: { '@': resolve(root, 'src/client') },
  plugins: [
    {
      name: 'inline-native-css',
      setup(build) {
        build.onLoad({ filter: /\.css$/ }, (args) => args.path.endsWith(".module.css") ? undefined : ({
          contents: readFileSync(args.path, 'utf8').replace(/\r\n/g, '\n'),
          loader: 'text',
        }))
      },
    },
    {
      name: 'normalize-scroll-bar-css',
      setup(build) {
        // The pinned dependency emits a CSS string with whitespace-only lines.
        // Strip their indentation before esbuild inlines it as a JS template literal.
        build.onLoad({ filter: /react-remove-scroll-bar[\\/]dist[\\/]es2015[\\/]component\.js$/ }, (args) => ({
          contents: readFileSync(args.path, 'utf8').replace(/\\n[ \t]+(?=\\n)/g, '\\n'),
          loader: 'js',
        }))
      },
    },
  ],
})

if (result.errors.length > 0) {
  console.error(result.errors)
  process.exit(1)
}

const app = readFileSync(resolve(root, 'dist/app.cjs'), 'utf8')
const nativeCss = existsSync(resolve(root, 'dist/app.css')) ? readFileSync(resolve(root, 'dist/app.css'), 'utf8') : ''
const wrapped = [
  'window.__ModuleLoader__.load({',
  `  id: ${JSON.stringify(moduleId)},`,
  '  factory: function (require) {',
  '    var module = { exports: {} }',
  '    var exports = module.exports',
  `if (typeof document !== 'undefined') { var style = document.querySelector('style[data-russian-kanban-style]') || document.head.appendChild(document.createElement('style')); style.setAttribute('data-russian-kanban-style', ''); style.textContent = ${JSON.stringify(nativeCss)}; }`,
  app,
  '    return (module.exports && module.exports.default) || module.exports',
  '  },',
  '})',
].join('\n')
writeFileSync(resolve(root, 'lib/client.js'), wrapped)
console.log('✓ built lib/client.js (' + wrapped.length + ' bytes)')
