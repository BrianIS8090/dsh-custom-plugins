import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Script } from 'node:vm';
import { renderMarkdown } from '../src/markdown.js';

// Structural adapter: tests the actual renderer's tags, props and text, not HTML/screenshot mocks.
const h = (tag, props, ...children) => ({ tag, props: props ?? {}, children: children.flat(Infinity).filter(v => v !== undefined && v !== null) });
const render = text => renderMarkdown(h, text);
function nodes(value) {
  if (Array.isArray(value)) return value.flatMap(nodes);
  return value && typeof value === 'object' ? [value, ...value.children.flatMap(nodes)] : [];
}
const find = (tree, tag) => nodes(tree).filter(n => n.tag === tag);
const textOf = value => Array.isArray(value) ? value.map(textOf).join('') : value && typeof value === 'object' ? textOf(value.children) : String(value ?? '');

test('ATX headings, paragraphs, inline emphasis, strikeout and horizontal rules', () => {
  const tree = render('# Title #\n\nParagraph with **strong**, *em*, __bold__, _italic_, ~~gone~~ and ***both***.\nsecond line\n\n---\n\n###### Small');
  assert.deepEqual(tree.map(n => n.tag), ['h1', 'p', 'hr', 'h6']);
  assert.equal(textOf(tree[0]), 'Title');
  assert.deepEqual(find(tree, 'strong').map(textOf), ['strong', 'bold', 'both']);
  assert.deepEqual(find(tree, 'em').map(textOf), ['em', 'italic', 'both']);
  assert.equal(textOf(find(tree, 'del')[0]), 'gone');
  assert.match(textOf(tree[1]), /second line/);
  assert.equal(textOf(render('word_with_underscores')), 'word_with_underscores');
});

test('inline code is literal, supports multi-backticks, and punctuation escapes', () => {
  const tree = render('`<img src=x> **raw**` and `` `tick` ``; \\*not em\\*');
  assert.deepEqual(find(tree, 'code').map(textOf), ['<img src=x> **raw**', '`tick`']);
  assert.equal(find(tree, 'strong').length, 0);
  assert.equal(find(tree, 'em').length, 0);
  assert.match(textOf(tree), /\*not em\*/);
});

test('closed fences preserve code, language metadata and matching fence rules', () => {
  const tree = render('````js\n<script>bad()</script>\n```\n````\n\nafter\n\n~~~txt\n**literal**\n~~~');
  assert.equal(find(tree, 'pre').length, 2);
  assert.equal(find(tree, 'code')[0].props.className, 'language-js');
  assert.equal(textOf(find(tree, 'code')[0]), '<script>bad()</script>\n```\n');
  assert.equal(find(tree, 'script').length, 0);
  assert.equal(find(tree, 'strong').length, 0);
  assert.equal(find(tree, 'pre')[0].props['data-incomplete'], undefined);
});

test('incomplete streaming fences remain code and settle cleanly when closed', () => {
  for (const suffix of ['', '\n', '\nconst', '\nconst x = `<b>`;', '\nconst x = `<b>`;\n``']) {
    const tree = render('before\n\n```javascript' + suffix);
    assert.equal(find(tree, 'pre').length, 1);
    assert.equal(find(tree, 'pre')[0].props['data-incomplete'], true);
    assert.equal(find(tree, 'b').length, 0);
  }
  const complete = render('```js\nlet x = 1;\n```\n\nafter');
  assert.equal(find(complete, 'pre')[0].props['data-incomplete'], undefined);
  assert.equal(textOf(complete.at(-1)), 'after');
  assert.equal(textOf(render('pending **bold and [link](https://exa')), 'pending **bold and [link](https://exa');
});

test('lists support ordered starts, nested list blocks and indented continuation', () => {
  const tree = render('- first\n  continued\n  - child\n    3. grandchild\n- second\n\nafter\n\n7. seven\n8. eight');
  assert.equal(find(tree, 'ul').length, 2);
  assert.equal(find(tree, 'ol').length, 2);
  assert.deepEqual(find(tree, 'ol').map(n => n.props.start), [3, 7]);
  assert.equal(find(tree, 'li').length, 6);
  assert.match(textOf(find(tree, 'li')[0]), /first\ncontinuedchildgrandchild/);
  assert.equal(textOf(tree[1]), 'after');
});

test('quotes render nested blocks without interpreting raw HTML', () => {
  const tree = render('> ## Quote\n>\n> outer\n> > nested\n\noutside');
  assert.equal(find(tree, 'blockquote').length, 2);
  assert.equal(textOf(find(tree, 'h2')[0]), 'Quote');
  assert.equal(textOf(tree.at(-1)), 'outside');
});

test('tables support alignments, inline formatting, escaped/code pipes and missing cells', () => {
  const tree = render('| Left | Center | Right |\n| :--- | :---: | ---: |\n| **a** | b\\|c | `d|e` |\n| short |\n\nafter');
  assert.equal(find(tree, 'table').length, 1);
  assert.deepEqual(find(tree, 'th').map(n => n.props.style.textAlign), ['left', 'center', 'right']);
  assert.deepEqual(find(tree, 'td').map(textOf), ['a', 'b|c', 'd|e', 'short', '', '']);
  assert.equal(find(tree, 'strong').length, 1);
  assert.equal(textOf(tree.at(-1)), 'after');
  assert.equal(find(render('a | b\n--- | nope'), 'table').length, 0);
});

test('safe absolute HTTP, HTTPS and mailto links; labels allow formatting but not anchors', () => {
  const tree = render('[**web**](https://example.org/a_(b) "Title") [http](HTTP://example.org) [mail](mailto:test@example.org) <https://example.org/a> [[inside](https://inner.org)](https://outer.org)');
  const links = find(tree, 'a');
  assert.equal(links.length, 5);
  assert.equal(links[0].props.href, 'https://example.org/a_(b)');
  assert.equal(links[0].props.title, 'Title');
  assert.equal(find(links[0], 'strong').length, 1);
  for (const link of links) {
    assert.equal(link.props.target, '_blank');
    assert.equal(link.props.rel, 'noopener noreferrer nofollow');
    assert.equal(find(link, 'a').length, 1, 'no nested anchors');
  }
});

test('unsafe, obfuscated, relative, protocol-relative and malformed destinations never clickable', () => {
  const destinations = [
    'javascript:alert(1)', 'JaVaScRiPt:alert(1)', 'data:text/html,<svg>', 'vbscript:msgbox(1)',
    'file:///etc/passwd', 'blob:https://example.org/x', '//example.org', '/local', '#fragment',
    'java\tscript:alert(1)', 'java\nscript:alert(1)', 'javascript&#58;alert(1)',
    'https:\\evil.org', 'https://', 'http://[bad]', 'mailto:', 'https://example.org/\u0000x',
    'https://example.org/\u007fx', 'https://example.org/' + 'x'.repeat(2048),
  ];
  for (const destination of destinations) {
    const tree = render(`[label](${destination})`);
    assert.equal(find(tree, 'a').length, 0, destination);
  }
});

test('remote images are inert metadata and raw HTML stays text; no injection props exist', () => {
  const tree = render('![diagram](https://example.org/track.png "caption") ![bad](javascript:alert(1))\n\n<script>alert(1)</script><img src=x onerror=alert(1)><iframe src="https://evil.org"></iframe> &lt;b&gt;');
  assert.equal(find(tree, 'img').length, 0);
  assert.equal(find(tree, 'a').length, 0);
  assert.equal(find(tree, 'script').length, 0);
  assert.equal(find(tree, 'iframe').length, 0);
  assert.equal(find(tree, 'span').filter(n => n.props.className === 'dsh-hover-1e3fa7-image').length, 2);
  assert.match(textOf(tree), /Image: diagram — https:\/\/example.org\/track.png/);
  assert.match(textOf(tree), /<script>alert\(1\)<\/script>/);
  assert.match(textOf(tree), /&lt;b&gt;/);
  const allowed = new Set(['key', 'className', 'title', 'href', 'target', 'rel', 'style', 'start', 'data-incomplete']);
  for (const node of nodes(tree)) for (const prop of Object.keys(node.props)) assert.ok(allowed.has(prop), prop);
});

test('bounded nesting degrades to literal text; hostile long delimiter streams terminate', () => {
  const quoteTree = render('> '.repeat(3000) + 'end');
  assert.equal(find(quoteTree, 'blockquote').length, 8);
  assert.match(textOf(quoteTree), /end$/);
  const listTree = render(Array.from({ length: 100 }, (_, i) => '  '.repeat(i) + '- item').join('\n'));
  assert.equal(find(listTree, 'ul').length, 8);
  for (const input of ['*a '.repeat(20000), '['.repeat(60000), '`'.repeat(60000), '_a_'.repeat(20000)]) {
    assert.ok(Array.isArray(render(input)));
  }
});

test('input, line and table bounds are explicit and stable across re-renders', () => {
  assert.equal(textOf(render('x'.repeat(65537))).length, 65536 + '[Markdown preview truncated]'.length);
  const manyLines = render(Array(2002).fill('x').join('\n'));
  assert.equal(manyLines.at(-1).props.className, 'dsh-hover-1e3fa7-truncated');
  const table = render('a | b\n--- | ---\n' + Array(220).fill('x | y').join('\n'));
  assert.equal(find(table, 'tbody')[0].children.length, 200);
  const columns = Array(33).fill('a').join('|') + '\n' + Array(33).fill('---').join('|');
  assert.equal(find(render(columns), 'table').length, 0);
  assert.deepEqual(render('# deterministic\n\n**yes**'), render('# deterministic\n\n**yes**'));
  assert.deepEqual(render(null), []);
});

test('visible image/truncation labels accept localized text without HTML parsing', () => {
  const tree = renderMarkdown(h, '![схема](https://example.org/img.png)\n\n' + 'x'.repeat(65536), {
    image: 'Изображение', truncated: '<b>Предпросмотр сокращён</b>',
  });
  assert.match(textOf(tree[0]), /Изображение: схема/);
  assert.equal(textOf(tree.at(-1)), '<b>Предпросмотр сокращён</b>');
  assert.equal(find(tree, 'b').length, 0);
});

test('source is import-free and embeddable by stripping export declarations', async () => {
  const source = await readFile(new URL('../src/markdown.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /\bimport\s|dangerouslySetInnerHTML|innerHTML|\bfetch\s*\(/);
  const embedded = new Script(source.replaceAll('export ', '') + '\nrenderMarkdown');
  const fn = embedded.runInNewContext({ URL });
  assert.equal(textOf(fn(h, '# embedded')), 'embedded');
});
