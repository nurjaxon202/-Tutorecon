// A small static search index: every official topic, lesson, glossary term,
// graph, free-response question, and tool page. Built once at build time.
import type { APIRoute } from 'astro';
import { courses } from '../data/ced';
import { units } from '../data/units';
import { glossary, termSlug } from '../data/glossary';
import { graphList } from '../scripts/graphs/models';
import { frqs } from '../data/frqs';
import { formulaGroups } from '../data/formulas';
import { accountsOn } from '../lib/accounts';
import { url } from '../lib/url';

interface Entry {
  /** Title shown in results. */
  t: string;
  /** Short context line. */
  s: string;
  /** Link. */
  u: string;
  /** Kind label. */
  k: string;
  /** Extra words to match on, not shown. */
  x?: string;
}

export const GET: APIRoute = () => {
  const entries: Entry[] = [];
  const pages: [string, string, string, string?][] = [
    ['Question bank', 'Practice by course, unit, topic, and difficulty', '/practice/', 'practice multiple choice mcq quiz'],
    ['Free-response questions', 'AP-style FRQs with scoring guides', '/frq/', 'frq free response written'],
    ['Flashcards', 'Every key term, one card at a time', '/flashcards/', 'cards vocabulary terms'],
    ['Score calculator', 'How the exam weights each section', '/score-calculator/', 'score composite curve'],
    ['Mock exam', 'Timed, full-length practice (Pro)', '/mock-exam/', 'test exam timed'],
    ['Review sheets', 'One page per unit (Pro)', '/review/', 'cheat sheet cram summary'],
    ['Graph lab', 'All interactive graphs', '/graph-lab/', 'graphs diagrams'],
    ['Glossary', 'Every key term defined', '/glossary/', 'definitions vocabulary'],
    ['All lessons', 'Every unit in order', '/learn/', 'units lessons path'],
    ['Pricing', 'Free and Pro plans', '/pricing/', 'pro subscription'],
    ['Missed and flagged questions', 'Every question you missed or flagged, with the answer', '/missed/', 'mistakes wrong review flagged'],
    ['Study planner', 'A day-by-day plan up to your exam date', '/study-plan/', 'schedule calendar plan exam date'],
    ['Formula sheet', 'Every formula from both courses on one page', '/formulas/', 'equations formulas cheat sheet multiplier elasticity'],
    [accountsOn ? 'Your account and data' : 'Your data and settings', 'Progress, theme, and deleting your data', '/account/', 'account settings privacy delete export import'],
    ...(accountsOn
      ? ([
          ['Sign in', 'Pick up your progress on any device', '/sign-in/', 'log in login account'],
          ['Create an account', 'Free account to save progress', '/sign-up/', 'sign up register signup'],
        ] as [string, string, string, string][])
      : []),
  ];
  for (const [t, s, u, x] of pages) entries.push({ t, s, u: url(u), k: 'Page', x });

  for (const c of courses) {
    entries.push({ t: c.name, s: 'Course overview, units, and topics', u: url(c.path), k: 'Course', x: c.short });
    for (const unit of c.units) {
      entries.push({ t: `Unit ${unit.n}: ${unit.title}`, s: `${c.short} · ${unit.weight} of the exam`, u: url(`${c.path}#unit-${unit.n}`), k: 'Unit' });
      for (const topic of unit.topics) {
        entries.push({ t: `${topic.code} ${topic.title}`, s: `${c.short} · Unit ${unit.n}`, u: url(`/learn/${topic.lesson}/#${topic.anchor}`), k: 'Topic' });
      }
    }
  }
  for (const u of units) entries.push({ t: u.title, s: `Lesson · ${u.summary}`, u: url(`/learn/${u.slug}/`), k: 'Lesson' });
  for (const g of glossary) entries.push({ t: g.term, s: g.def, u: url(`/glossary/#${termSlug(g.term)}`), k: 'Term' });
  for (const g of graphList) entries.push({ t: g.label, s: 'Interactive graph', u: url(`/graph-lab/#${g.key}`), k: 'Graph' });
  for (const g of formulaGroups) {
    for (const f of g.items) entries.push({ t: f.name, s: `Formula · ${f.f}`, u: url(`/formulas/#${g.id}`), k: 'Formula' });
  }
  for (const f of frqs) {
    entries.push({
      t: f.title,
      s: `${f.course === 'micro' ? 'AP Micro' : 'AP Macro'} · ${f.kind === 'long' ? 'Long FRQ, 10 points' : 'Short FRQ, 5 points'}`,
      u: url(`/frq/${f.id}/`),
      k: 'FRQ',
    });
  }
  return new Response(JSON.stringify(entries), { headers: { 'Content-Type': 'application/json' } });
};
