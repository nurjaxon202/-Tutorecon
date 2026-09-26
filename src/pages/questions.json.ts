// The whole question bank as one static file, loaded by the question bank,
// the missed list, and the mock exam (see src/scripts/bank.ts). Keys are short
// and each graph is listed once, to keep the download small.
import type { APIRoute } from 'astro';
import { questions } from '../data/questions';

export const GET: APIRoute = () => {
  const figs: Record<string, { svg: string; w: number; h: number; alt: string; id: string }> = {};
  for (const x of questions) if (x.figure) figs[x.figure.id] = x.figure;
  const qs = questions.map((x) => ({
    id: x.id,
    u: x.unit,
    t: x.topics,
    l: x.level,
    p: x.prompt,
    tb: x.table,
    fg: x.figure?.id,
    o: x.options.map((o) => [o.text, o.why]),
    a: x.answer,
  }));
  return new Response(JSON.stringify({ figs, qs }), { headers: { 'Content-Type': 'application/json' } });
};
