// Facts about each lesson, measured from the lesson files themselves
// so the numbers shown on the site are always accurate.
import type { MarkdownHeading } from 'astro';
import { units } from '../data/units';

type LessonModule = {
  Content: (props: Record<string, unknown>) => unknown;
  getHeadings: () => MarkdownHeading[];
};

const modules = import.meta.glob<LessonModule>('../units/*.mdx', { eager: true });
const raws = import.meta.glob<string>('../units/*.mdx', { eager: true, query: '?raw', import: 'default' });

export function lesson(slug: string) {
  const key = `../units/${slug}.mdx`;
  const mod = modules[key];
  const raw = raws[key] ?? '';
  if (!mod) throw new Error(`Missing lesson file for ${slug}`);
  const prose = raw
    .replace(/^import .*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*|`-]/g, ' ');
  const words = prose.split(/\s+/).filter(Boolean).length;
  return {
    Content: mod.Content,
    headings: mod.getHeadings().filter((h) => h.depth === 2),
    minutes: Math.max(5, Math.round(words / 180)),
    graphs: [...raw.matchAll(/<Graph model="([^"]+)"/g)].map((m) => m[1]),
    worked: (raw.match(/<Worked /g) ?? []).length,
  };
}

export const allLessons = () => units.map((u) => ({ unit: u, ...lesson(u.slug) }));
