// Topic guides: one detailed page for each official topic in both courses.
// Guides live in src/topics/<topic id>.mdx. AP Macro Unit 1 repeats several
// AP Micro topics word for word, so those share one guide.
import { glossary, type Term } from '../data/glossary';
import type { MarkdownHeading } from 'astro';
import { courses, allTopics, type Course, type CourseUnit, type Topic } from '../data/ced';

type GuideModule = {
  Content: (props: Record<string, unknown>) => unknown;
  getHeadings: () => MarkdownHeading[];
};

const modules = import.meta.glob<GuideModule>('../topics/*.mdx', { eager: true });
const raws = import.meta.glob<string>('../topics/*.mdx', { eager: true, query: '?raw', import: 'default' });

/** AP Macro topics taught exactly like an AP Micro topic. */
export const sameAs: Record<string, string> = {
  'ma1.1': 'mi1.1',
  'ma1.3': 'mi1.4',
  'ma1.4': 'mi2.1',
  'ma1.5': 'mi2.2',
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function placeOf(id: string): { course: Course; unit: CourseUnit; topic: Topic; index: number } {
  for (const course of courses)
    for (const unit of course.units) {
      const index = unit.topics.findIndex((t) => t.id === id);
      if (index >= 0) return { course, unit, topic: unit.topics[index], index };
    }
  throw new Error(`Unknown topic ${id}`);
}

export const topicSlug = (t: Topic) => `${t.code.replace('.', '-')}-${slugify(t.title)}`;

/** Site path (without the deploy base) of a topic guide, like /ap-micro/2-3-price-elasticity-of-demand/. */
export const topicPath = (id: string) => {
  const { course, topic } = placeOf(id);
  return `${course.path}${topicSlug(topic)}/`;
};

export function guide(id: string) {
  const source = sameAs[id] ?? id;
  const key = `../topics/${source}.mdx`;
  const mod = modules[key];
  if (!mod) throw new Error(`Topic ${id} has no guide. Add src/topics/${source}.mdx.`);
  const raw = raws[key] ?? '';
  const words = raw
    .replace(/^import .*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*|`-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return {
    Content: mod.Content,
    headings: mod.getHeadings().filter((h) => h.depth === 2),
    terms: keyTerms(raw),
    words,
    minutes: Math.max(3, Math.round(words / 180)),
    sharedWith: sameAs[id] ? placeOf(sameAs[id]) : null,
  };
}

/** Glossary terms that appear in a guide, in the order they first come up (at most eight). */
function keyTerms(raw: string): Term[] {
  const text = raw.replace(/^import .*$/gm, '').toLowerCase();
  const found: { t: Term; at: number }[] = [];
  for (const g of glossary) {
    const name = g.term.replace(/\s*\(.*?\)\s*/g, ' ').trim().toLowerCase();
    if (name.length < 4) continue;
    const m = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?\\b`).exec(text);
    if (m) found.push({ t: g, at: m.index });
  }
  return found
    .sort((a, b) => a.at - b.at)
    .slice(0, 8)
    .map((f) => f.t);
}

export const hasGuide = (id: string) => Boolean(modules[`../topics/${sameAs[id] ?? id}.mdx`]);

// Every official topic must have a guide, checked on every build.
const missing = allTopics.filter((t) => !hasGuide(t.id)).map((t) => t.id);
if (missing.length && !process.env.TOPICS_DRAFT) throw new Error(`Topics without a guide: ${missing.join(', ')}`);
