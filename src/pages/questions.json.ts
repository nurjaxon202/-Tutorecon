// The whole question bank as one static file, loaded by the practice page and
// the mock exam. Keys are short to keep the download small.
import type { APIRoute } from 'astro';
import { questions } from '../data/questions';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      questions.map((x) => ({
        id: x.id,
        u: x.unit,
        t: x.topics,
        l: x.level,
        p: x.prompt,
        tb: x.table,
        o: x.options.map((o) => [o.text, o.why]),
        a: x.answer,
      })),
    ),
    { headers: { 'Content-Type': 'application/json' } },
  );
