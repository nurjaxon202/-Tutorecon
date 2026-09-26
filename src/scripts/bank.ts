// Loads questions.json once per page and puts each question's graph back in place.
import type { QFig } from './qfigure';

export interface BankQ {
  id: string;
  u: string;
  t: string[];
  l: 1 | 2 | 3;
  p: string;
  tb?: { head: string[]; rows: (string | number)[][] };
  fg?: QFig;
  o: [string, string][];
  a: number;
}

interface Raw {
  figs: Record<string, QFig>;
  qs: (Omit<BankQ, 'fg'> & { fg?: string })[];
}

let loading: Promise<BankQ[]> | null = null;

export function loadBank(src: string): Promise<BankQ[]> {
  loading ??= fetch(src)
    .then((r) => {
      if (!r.ok) throw new Error(`questions.json: ${r.status}`);
      return r.json() as Promise<Raw>;
    })
    .then((raw) => raw.qs.map((q) => ({ ...q, fg: q.fg ? raw.figs[q.fg] : undefined })));
  loading.catch(() => (loading = null));
  return loading;
}
