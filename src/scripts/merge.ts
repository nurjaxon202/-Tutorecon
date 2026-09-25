// Combines two copies of saved progress, for example this browser's and the
// one kept in an account, without losing work from either side.

import { emptySaved, type QStat, type QuizResult, type Saved, type StudyPlan } from './store';

type Dict = Record<string, unknown>;
const isObj = (v: unknown): v is Dict => Boolean(v) && typeof v === 'object' && !Array.isArray(v);
const num = (v: unknown, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

/** Turn anything (a downloaded file, an account row) into a well-formed record. */
export function cleanSaved(raw: unknown): Saved {
  const out = emptySaved();
  if (!isObj(raw)) return out;
  const r = raw;
  const pick = <T>(v: unknown, ok: (x: unknown) => boolean): Record<string, T> => {
    const res: Record<string, T> = {};
    if (isObj(v)) for (const [k, x] of Object.entries(v)) if (ok(x)) res[k] = x as T;
    return res;
  };
  out.done = pick<number>(r.done, (x) => typeof x === 'number');
  out.quiz = pick<QuizResult>(r.quiz, (x) => isObj(x) && typeof x.best === 'number' && typeof x.total === 'number');
  out.exams = Array.isArray(r.exams) ? r.exams.filter((e) => isObj(e) && typeof e.score === 'number' && typeof e.at === 'number').slice(0, 20) : [];
  out.pro = isObj(r.pro) && typeof r.pro.since === 'number' ? { since: r.pro.since } : null;
  out.xp = Math.max(0, num(r.xp));
  out.streak = Math.max(0, num(r.streak));
  out.lastDay = typeof r.lastDay === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.lastDay) ? r.lastDay : null;
  out.dayXp = Math.max(0, num(r.dayXp));
  out.answered = pick<true>(r.answered, (x) => x === true);
  out.steps = pick<number>(r.steps, (x) => typeof x === 'number');
  out.qstats = pick<QStat>(r.qstats, (x) => isObj(x) && typeof x.a === 'number' && typeof x.c === 'number');
  out.frq = pick<Saved['frq'][string]>(r.frq, (x) => isObj(x) && typeof x.score === 'number' && typeof x.at === 'number');
  out.cards = pick<true>(r.cards, (x) => x === true);
  out.flags = pick<true>(r.flags, (x) => x === true);
  const day = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
  if (isObj(r.plan) && day(r.plan.exam) && day(r.plan.start) && ['micro', 'macro', 'both'].includes(r.plan.course as string) && Array.isArray(r.plan.days)) {
    out.plan = {
      exam: r.plan.exam,
      start: r.plan.start,
      course: r.plan.course as StudyPlan['course'],
      days: r.plan.days.filter((d): d is number => Number.isInteger(d) && d >= 0 && d <= 6),
      done: pick<true>(r.plan.done, (x) => x === true),
    };
  }
  return out;
}

const later = <T extends { at: number }>(x: T | undefined, y: T): T => (!x || y.at > x.at ? y : x);

/** Merge two records. Nothing earned on either side is dropped. */
export function mergeSaved(a: Saved, b: Saved): Saved {
  const quiz = { ...a.quiz };
  for (const [k, v] of Object.entries(b.quiz)) {
    const p = quiz[k];
    quiz[k] = p ? { ...later(p, v), best: Math.max(p.best, v.best) } : v;
  }

  const seen = new Set<string>();
  const exams = [...a.exams, ...b.exams]
    .filter((e) => {
      const id = `${e.course}:${e.at}`;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .sort((x, y) => y.at - x.at)
    .slice(0, 20);

  // For each question keep the history with more attempts.
  const qstats = { ...a.qstats };
  for (const [k, v] of Object.entries(b.qstats)) if (!qstats[k] || v.a > qstats[k].a) qstats[k] = v;

  const frq = { ...a.frq };
  for (const [k, v] of Object.entries(b.frq)) frq[k] = later(frq[k], v);

  const steps = { ...a.steps };
  for (const [k, v] of Object.entries(b.steps)) steps[k] = Math.max(steps[k] ?? 0, v);

  // The streak comes from whichever copy was active most recently.
  const dayA = a.lastDay ?? '';
  const dayB = b.lastDay ?? '';
  const sameDay = dayA === dayB;
  const recent = dayB > dayA ? b : a;

  return {
    done: { ...b.done, ...a.done },
    quiz,
    exams,
    pro: a.pro && b.pro ? (a.pro.since <= b.pro.since ? a.pro : b.pro) : (a.pro ?? b.pro),
    xp: Math.max(a.xp, b.xp),
    streak: sameDay ? Math.max(a.streak, b.streak) : recent.streak,
    lastDay: recent.lastDay,
    dayXp: sameDay ? Math.max(a.dayXp, b.dayXp) : recent.dayXp,
    answered: { ...a.answered, ...b.answered },
    steps,
    qstats,
    frq,
    cards: { ...a.cards, ...b.cards },
    flags: { ...a.flags, ...b.flags },
    plan: mergePlan(a.plan, b.plan),
  };
}

/** Keep the newer plan. If both copies are the same plan, keep every day checked off on either. */
function mergePlan(a: StudyPlan | null, b: StudyPlan | null): StudyPlan | null {
  if (!a || !b) return a ?? b;
  if (a.start === b.start && a.exam === b.exam) return { ...a, done: { ...b.done, ...a.done } };
  return b.start > a.start ? b : a;
}
