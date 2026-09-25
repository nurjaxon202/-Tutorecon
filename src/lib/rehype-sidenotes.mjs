// Adds a margin definition the first time a unit's glossary term appears in
// bold or highlighted in its lesson. On wide screens the note sits in the
// margin; on small screens a small button reveals it under the line.
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

const glossary = JSON.parse(readFileSync(new URL('../data/glossary.json', import.meta.url), 'utf8'));

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/^(the|a|an)\s+/, '')
    .replace(/[.,:;]+$/, '')
    .trim();

const textOf = (node) => {
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(textOf).join('');
};

const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function matchTerm(text, terms) {
  const t = norm(text);
  if (t.length < 3) return null;
  for (const entry of terms) {
    const g = norm(entry.term);
    if (t === g || t === `${g}s` || `${t}s` === g) return entry;
    if (g.length >= 8 && (t.startsWith(g) || t.endsWith(g))) return entry;
    if (t.length >= 10 && g.startsWith(t)) return entry;
  }
  return null;
}

const el = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });

export default function rehypeSidenotes() {
  return (tree, file) => {
    const unit = basename(file.path ?? '', '.mdx');
    const unitTerms = glossary.filter((t) => t.unit === unit);
    if (!unitTerms.length) return;
    const used = new Set();
    // One note per paragraph or list item keeps the margin readable.
    const noted = new Set();

    const walk = (node) => {
      if (!node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const isStrong = child.type === 'element' && child.tagName === 'strong';
        const isMark = (child.type === 'mdxJsxTextElement' && child.name === 'mark') || (child.type === 'element' && child.tagName === 'mark');
        if (isStrong || isMark) {
          const entry = matchTerm(textOf(child), isMark ? glossary : unitTerms);
          if (entry && !used.has(entry.term) && !noted.has(node)) {
            used.add(entry.term);
            noted.add(node);
            const id = `sn-${slug(entry.term)}`;
            const note = el('span', { className: ['sn'] }, [
              el(
                'button',
                { type: 'button', className: ['sn-btn'], ariaExpanded: 'false', ariaControls: id, ariaLabel: `Definition of ${entry.term}` },
                [{ type: 'text', value: 'def' }],
              ),
              el('span', { className: ['sidenote'], id, role: 'note' }, [
                el('strong', {}, [{ type: 'text', value: entry.term }]),
                { type: 'text', value: ` ${entry.def}` },
              ]),
            ]);
            node.children.splice(i + 1, 0, note);
            i++;
            continue;
          }
        }
        walk(child);
      }
    };
    walk(tree);
  };
}
