/**
 * Small, deliberately non-CommonMark preview renderer. No HTML parsing or network I/O.
 * Limits: 65,536 UTF-16 units, 2,000 lines, 8 block/inline nesting levels,
 * 32 table columns, 200 body rows/table, 2,048-unit link destinations, and
 * 1,000,000 inline scanning/search units. Depth/work overflow stays literal;
 * input/line truncation gets a visible notice. Returns a keyed React element array.
 */
export function renderMarkdown(h, text, labels = {}) {
  const imageLabel = labels.image ?? 'Image';
  const truncatedLabel = labels.truncated ?? '[Markdown preview truncated]';
  const MAX_DEPTH = 8;
  let key = 0, work = 1000000;
  const el = (tag, props, children) => h(tag, { ...props, key: key++ }, children);
  const original = String(text ?? '');
  const lines = original.slice(0, 65536).replace(/\r\n?/g, '\n').split('\n');
  const truncated = original.length > 65536 || lines.length > 2000;
  lines.length = Math.min(lines.length, 2000);
  const escaped = (s, i) => {
    let n = 0;
    while (i > 0 && s[--i] === '\\') n++;
    return n % 2 === 1;
  };
  function safeHref(value) {
    if (value.length > 2048 || /[\s\u0000-\u001f\u007f-\u009f\\]/u.test(value)) return null;
    if (!/^(https?:\/\/|mailto:)/i.test(value)) return null;
    try {
      const url = new URL(value);
      if (url.protocol === 'mailto:') return url.pathname ? value : null;
      return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname ? value : null;
    } catch { return null; }
  }
  function closing(s, marker, from) {
    work -= s.length - from;
    if (work < 0) return -1;
    let at = s.indexOf(marker, from);
    while (at >= 0) {
      if (!escaped(s, at) && s[at - 1] !== marker[0] && s[at + marker.length] !== marker[0]
          && (marker[0] === '`' || !/\s/.test(s[at - 1]))) return at;
      at = s.indexOf(marker, at + marker.length);
    }
    return -1;
  }
  // Balanced brackets/parentheses are intentionally capped, not recursive.
  function linkAt(s, start) {
    let end = start + 1, depth = 1;
    for (; end < s.length && --work > 0; end++) {
      if (s[end] === '\\') { end++; continue; }
      if (s[end] === '[' && ++depth > MAX_DEPTH) return null;
      if (s[end] === ']' && --depth === 0) break;
    }
    if (depth || s[end + 1] !== '(') return null;
    let close = end + 2, nesting = 1, quote = '';
    for (; close < s.length && --work > 0; close++) {
      const c = s[close];
      if (c === '\\') { close++; continue; }
      if (quote) { if (c === quote) quote = ''; continue; }
      if ((c === '"' || c === "'") && /\s/.test(s[close - 1])) { quote = c; continue; }
      if (c === '(' && ++nesting > MAX_DEPTH) return null;
      if (c === ')' && --nesting === 0) break;
    }
    if (nesting) return null;
    const dest = s.slice(end + 2, close).trim();
    const match = /^(?:<([^<>]*)>|(\S+?))(?:\s+["']([^\n]*)["'])?$/.exec(dest);
    if (!match) return null;
    return { label: s.slice(start + 1, end), href: (match[1] ?? match[2]).replace(/\\([\\()[\]])/g, '$1'), title: match[3], end: close + 1 };
  }
  function inline(s, depth = 0, links = true) {
    if (depth >= MAX_DEPTH || work <= 0) return [s];
    const out = [];
    let plain = '', i = 0;
    const flush = () => { if (plain) { out.push(plain); plain = ''; } };
    while (i < s.length) {
      if (--work <= 0) { plain += s.slice(i); break; }
      if (s[i] === '\\' && /[!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~]/.test(s[i + 1] ?? '')) {
        plain += s[i + 1]; i += 2; continue;
      }
      if (s[i] === '`') {
        let size = 1;
        while (s[i + size] === '`') size++;
        const end = closing(s, '`'.repeat(size), i + size);
        if (end >= 0) {
          let code = s.slice(i + size, end).replace(/\n/g, ' ');
          if (/^ .* $/.test(code) && /[^ ]/.test(code)) code = code.slice(1, -1);
          flush(); out.push(el('code', {}, code)); i = end + size; continue;
        }
        plain += s.slice(i, i + size); i += size; continue;
      }
      const image = s[i] === '!' && s[i + 1] === '[';
      if ((links || image) && (s[i] === '[' || image)) {
        const link = linkAt(s, i + (image ? 1 : 0));
        if (link) {
          flush();
          if (image) {
            out.push(el('span', { className: 'dsh-hover-1e3fa7-image', title: link.title },
              `[${imageLabel}: ${link.label || imageLabel} — ${link.href}]`));
          } else {
            const href = safeHref(link.href);
            const label = inline(link.label, depth + 1, false);
            out.push(href ? el('a', { href, title: link.title, target: '_blank', rel: 'noopener noreferrer nofollow' }, label)
              : el('span', {}, label));
          }
          i = link.end; continue;
        }
      }
      if (links && s[i] === '<') {
        work -= s.length - i;
        const end = work >= 0 ? s.indexOf('>', i + 1) : -1;
        if (end >= 0) {
          const href = safeHref(s.slice(i + 1, end));
          if (href) {
            flush(); out.push(el('a', { href, target: '_blank', rel: 'noopener noreferrer nofollow' }, href));
            i = end + 1; continue;
          }
        }
      }
      let formatted = false;
      if ('*_~'.includes(s[i])) {
        for (const marker of ['***', '___', '**', '__', '~~', '*', '_']) {
          if (!s.startsWith(marker, i) || /\s/.test(s[i + marker.length] ?? ' ')) continue;
          if (marker[0] === '_' && /[\p{L}\p{N}]/u.test(s[i - 1] ?? '')) continue;
          const end = closing(s, marker, i + marker.length);
          if (end < 0) continue;
          flush();
          const body = inline(s.slice(i + marker.length, end), depth + 1, links);
          const tag = marker === '~~' ? 'del' : marker.length === 1 ? 'em' : 'strong';
          out.push(el(tag, {}, marker.length === 3 ? el('em', {}, body) : body));
          i = end + marker.length; formatted = true; break;
        }
      }
      if (!formatted) plain += s[i++];
    }
    flush(); return out;
  }
  const heading = s => /^ {0,3}(#{1,6})(?:[ \t]+|$)(.*)$/.exec(s);
  const fence = s => /^ {0,3}(`{3,}|~{3,})([^\n]*)$/.exec(s);
  const rule = s => /^ {0,3}(?:(?:\*[ \t]*){3,}|(?:-[ \t]*){3,}|(?:_[ \t]*){3,})$/.test(s);
  const quote = s => /^ {0,3}>[ \t]?(.*)$/.exec(s);
  const item = s => /^( *)([-+*]|\d{1,9}[.)])[ \t]+(.*)$/.exec(s);
  const ordered = m => /^\d/.test(m[2]);
  const blockStart = s => heading(s) || fence(s) || rule(s) || quote(s) || item(s);
  function cells(s) {
    const row = [], trimmed = s.trim();
    let cell = '', ticks = 0;
    for (let i = 0; i < trimmed.length; i++) {
      const c = trimmed[i];
      if (c === '\\' && i + 1 < trimmed.length) { cell += c + trimmed[++i]; continue; }
      if (c === '`') {
        let n = 1;
        while (trimmed[i + n] === '`') n++;
        if (!ticks) ticks = n; else if (ticks === n) ticks = 0;
        cell += '`'.repeat(n); i += n - 1; continue;
      }
      if (c === '|' && !ticks) { row.push(cell.trim()); cell = ''; } else cell += c;
    }
    row.push(cell.trim());
    if (trimmed.startsWith('|')) row.shift();
    if (trimmed.endsWith('|') && !escaped(trimmed, trimmed.length - 1) && !ticks) row.pop();
    return row;
  }
  function tableAt(source, i) {
    if (i + 1 >= source.length || !source[i].includes('|')) return null;
    const heads = cells(source[i]), marks = cells(source[i + 1]);
    if (!heads.length || heads.length > 32 || heads.length !== marks.length || !marks.every(s => /^:?-{3,}:?$/.test(s))) return null;
    return { heads, align: marks.map(s => s.startsWith(':') && s.endsWith(':') ? 'center' : s.endsWith(':') ? 'right' : 'left') };
  }
  function blocks(source, depth = 0) {
    if (depth >= MAX_DEPTH) return [el('p', {}, source.join('\n'))];
    const out = [];
    for (let i = 0; i < source.length;) {
      if (!source[i].trim()) { i++; continue; }
      const f = fence(source[i]);
      if (f) {
        const body = [], indent = source[i].length - source[i].trimStart().length;
        const language = f[2].trim().split(/\s/)[0];
        let closed = false; i++;
        while (i < source.length) {
          const end = /^ {0,3}(`+|~+)[ \t]*$/.exec(source[i]);
          if (end && end[1][0] === f[1][0] && end[1].length >= f[1].length) { closed = true; i++; break; }
          const remove = Math.min(indent, /^ */.exec(source[i])[0].length);
          body.push(source[i++].slice(remove));
        }
        out.push(el('pre', { 'data-incomplete': closed ? undefined : true }, el('code', {
          className: /^[\w+-]{1,32}$/.test(language) ? `language-${language}` : undefined,
        }, body.join('\n') + (closed && body.length ? '\n' : ''))));
        continue;
      }
      const head = heading(source[i]);
      if (head) { out.push(el(`h${head[1].length}`, {}, inline(head[2].replace(/[ \t]+#+[ \t]*$/, '')))); i++; continue; }
      if (rule(source[i])) { out.push(el('hr', {}, undefined)); i++; continue; }
      if (quote(source[i])) {
        const body = [];
        while (i < source.length && quote(source[i])) body.push(quote(source[i++])[1]);
        out.push(el('blockquote', {}, blocks(body, depth + 1))); continue;
      }
      const first = item(source[i]);
      if (first) {
        const base = first[1].length, isOrdered = ordered(first), children = [];
        while (i < source.length) {
          const current = item(source[i]);
          if (!current || current[1].length !== base || ordered(current) !== isOrdered || rule(source[i])) break;
          const contentIndent = source[i].length - current[3].length, body = [current[3]]; i++;
          while (i < source.length) {
            const next = item(source[i]);
            if (next && next[1].length <= base) break;
            if (!source[i].trim()) {
              let look = i + 1;
              while (look < source.length && !source[look].trim()) look++;
              if (look === source.length || /^ */.exec(source[look])[0].length <= base) break;
              body.push(''); i++; continue;
            }
            const indentation = /^ */.exec(source[i])[0].length;
            if (indentation <= base) break;
            body.push(source[i++].slice(Math.min(indentation, contentIndent)));
          }
          children.push(el('li', {}, blocks(body, depth + 1)));
          // Blank-separated siblings are supported; an unindented paragraph ends the list.
          let look = i;
          while (look < source.length && !source[look].trim()) look++;
          const sibling = look < source.length && item(source[look]);
          if (sibling && sibling[1].length === base && ordered(sibling) === isOrdered && !rule(source[look])) i = look;
          else if (look !== i) break;
        }
        out.push(el(isOrdered ? 'ol' : 'ul', isOrdered ? { start: parseInt(first[2], 10) } : {}, children)); continue;
      }
      const table = tableAt(source, i);
      if (table) {
        const makeRow = (values, tag) => el('tr', {}, table.heads.map((_, col) => el(tag, { style: { textAlign: table.align[col] } }, inline(values[col] ?? ''))));
        const rows = []; i += 2;
        while (i < source.length && source[i].trim() && source[i].includes('|') && rows.length < 200) rows.push(makeRow(cells(source[i++]), 'td'));
        out.push(el('table', {}, [el('thead', {}, makeRow(table.heads, 'th')), el('tbody', {}, rows)])); continue;
      }
      const body = [source[i++]];
      while (i < source.length && source[i].trim() && !blockStart(source[i]) && !tableAt(source, i)) body.push(source[i++]);
      out.push(el('p', {}, inline(body.join('\n'))));
    }
    return out;
  }
  const result = blocks(lines);
  if (truncated) result.push(el('p', { className: 'dsh-hover-1e3fa7-truncated' }, truncatedLabel));
  return result;
}
