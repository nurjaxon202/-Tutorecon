// Everything TutorEcon remembers lives in this browser's localStorage. If the
// reader signs in to an account, src/scripts/account.ts keeps a copy of the
// progress entry in sync with it. Every access is wrapped because storage can
// be blocked (private windows, strict settings) and the site must still work.

const KEY = 'tutorecon.v1';
const THEME_KEY = 'tutorecon.theme';
/** Whether lessons show one step at a time or all at once. Read by the lesson page. */
export const LESSON_MODE_KEY = 'tutorecon.lessonMode';

export interface QuizResult {
  best: number;
  last: number;
  total: number;
  at: number;
}

export interface ExamResult {
  score: number;
  total: number;
  course: string;
  at: number;
}

export interface Saved {
  done: Record<string, number>;
  quiz: Record<string, QuizResult>;
  exams: ExamResult[];
  pro: { since: number } | null;
  /** Points earned for correct answers and finished units. */
  xp: number;
  /** Consecutive days with at least one correct answer. */
  streak: number;
  /** Local date (YYYY-MM-DD) of the last day that counted toward the streak. */
  lastDay: string | null;
  /** XP earned on lastDay, for the daily goal. */
  dayXp: number;
  /** Questions already answered correctly once (XP is only given the first time). */
  answered: Record<string, true>;
  /** How far the reader got in each lesson, as a section index. */
  steps: Record<string, number>;
  /** Question bank history: attempts, correct answers, and whether the last try was right. */
  qstats: Record<string, QStat>;
  /** Free-response self-scores: points checked off out of the total. */
  frq: Record<string, { score: number; total: number; at: number }>;
  /** Flashcards marked as known. */
  cards: Record<string, true>;
  /** Question-bank questions flagged to look at again. */
  flags: Record<string, true>;
  /** The schedule made on the study planner page. */
  plan: StudyPlan | null;
}

export interface StudyPlan {
  /** Exam date, YYYY-MM-DD. */
  exam: string;
  course: 'micro' | 'macro' | 'both';
  /** Days of the week to study, 0 = Sunday. */
  days: number[];
  /** The day the plan was made, YYYY-MM-DD. The schedule counts from here. */
  start: string;
  /** Study days checked off, by date. */
  done: Record<string, true>;
}

export interface QStat {
  /** Attempts. */
  a: number;
  /** Correct attempts. */
  c: number;
  /** 1 if the most recent attempt was right, 0 if wrong. */
  l: 0 | 1;
}

export const emptySaved = (): Saved => ({ done: {}, quiz: {}, exams: [], pro: null, xp: 0, streak: 0, lastDay: null, dayXp: 0, answered: {}, steps: {}, qstats: {}, frq: {}, cards: {}, flags: {}, plan: null });

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const daysBetween = (a: string, b: string) => {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
};

function read(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptySaved();
    const parsed = JSON.parse(raw);
    return { ...emptySaved(), ...parsed };
  } catch {
    return emptySaved();
  }
}

function write(data: Saved): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('tutorecon:change'));
    return true;
  } catch {
    return false;
  }
}

export const store = {
  get: read,

  /** Swap in a whole saved record, for example one merged with an account copy. */
  replace(data: Saved): boolean {
    return write(data);
  },

  /** True once there is anything worth keeping. */
  hasProgress(): boolean {
    const d = read();
    return d.xp > 0 || Object.keys(d.done).length > 0 || Object.keys(d.qstats).length > 0 || Object.keys(d.steps).length > 0 || Object.keys(d.frq).length > 0 || Object.keys(d.cards).length > 0 || d.exams.length > 0;
  },

  /** Remove study progress but keep device settings like the theme. */
  clearProgress(): void {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* storage unavailable: nothing to clear */
    }
    window.dispatchEvent(new CustomEvent('tutorecon:change'));
  },

  isDone(slug: string): boolean {
    return Boolean(read().done[slug]);
  },

  setDone(slug: string, done: boolean): void {
    const data = read();
    if (done) data.done[slug] = Date.now();
    else delete data.done[slug];
    write(data);
  },

  saveQuiz(slug: string, score: number, total: number): QuizResult {
    const data = read();
    const prev = data.quiz[slug];
    const result: QuizResult = {
      best: Math.max(score, prev?.best ?? 0),
      last: score,
      total,
      at: Date.now(),
    };
    data.quiz[slug] = result;
    write(data);
    return result;
  },

  saveExam(result: ExamResult): void {
    const data = read();
    data.exams = [result, ...data.exams].slice(0, 20);
    write(data);
  },

  /** Add points and count today toward the streak. Returns the new totals. */
  addXp(points: number): { xp: number; streak: number; newDay: boolean } {
    const data = read();
    const today = dayKey();
    let newDay = false;
    if (data.lastDay !== today) {
      const gap = data.lastDay ? daysBetween(data.lastDay, today) : Infinity;
      data.streak = gap === 1 ? data.streak + 1 : 1;
      data.lastDay = today;
      data.dayXp = 0;
      newDay = true;
    }
    data.xp += points;
    data.dayXp += points;
    write(data);
    return { xp: data.xp, streak: data.streak, newDay };
  },

  /** Award XP for a question the first time it is answered correctly. Returns points given. */
  rewardAnswer(id: string, points = 10): number {
    const data = read();
    if (data.answered[id]) return 0;
    data.answered[id] = true;
    write(data);
    store.addXp(points);
    return points;
  },

  /** Record one answer to a bank question. */
  recordAnswer(id: string, right: boolean): void {
    const data = read();
    const st = data.qstats[id] ?? { a: 0, c: 0, l: 0 };
    st.a += 1;
    if (right) st.c += 1;
    st.l = right ? 1 : 0;
    data.qstats[id] = st;
    write(data);
  },

  saveFrq(id: string, score: number, total: number): void {
    const data = read();
    data.frq[id] = { score, total, at: Date.now() };
    write(data);
  },

  setCard(term: string, known: boolean): void {
    const data = read();
    if (known) data.cards[term] = true;
    else delete data.cards[term];
    write(data);
  },

  resetCards(terms: string[]): void {
    const data = read();
    for (const t of terms) delete data.cards[t];
    write(data);
  },

  /** Flag or unflag a question. Returns whether it is now flagged. */
  toggleFlag(id: string): boolean {
    const data = read();
    const on = !data.flags[id];
    if (on) data.flags[id] = true;
    else delete data.flags[id];
    write(data);
    return on;
  },

  setPlan(plan: StudyPlan | null): void {
    const data = read();
    data.plan = plan;
    write(data);
  },

  setPlanDay(date: string, done: boolean): void {
    const data = read();
    if (!data.plan) return;
    if (done) data.plan.done[date] = true;
    else delete data.plan.done[date];
    write(data);
  },

  getStep(slug: string): number {
    return read().steps[slug] ?? 0;
  },

  setStep(slug: string, step: number): void {
    const data = read();
    if ((data.steps[slug] ?? 0) >= step) return;
    data.steps[slug] = step;
    write(data);
  },

  /** The streak only counts if the last active day was today or yesterday. */
  currentStreak(): number {
    const data = read();
    if (!data.lastDay) return 0;
    return daysBetween(data.lastDay, dayKey()) <= 1 ? data.streak : 0;
  },

  /** XP earned today, for the daily goal. */
  todayXp(): number {
    const data = read();
    return data.lastDay === dayKey() ? data.dayXp : 0;
  },

  isPro(): boolean {
    return Boolean(read().pro);
  },

  startPro(): void {
    const data = read();
    data.pro = { since: Date.now() };
    write(data);
  },

  cancelPro(): void {
    const data = read();
    data.pro = null;
    write(data);
  },

  clearAll(): void {
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem(THEME_KEY);
      localStorage.removeItem(LESSON_MODE_KEY);
    } catch {
      /* storage unavailable: nothing to clear */
    }
    delete document.documentElement.dataset.theme;
    window.dispatchEvent(new CustomEvent('tutorecon:change'));
  },

  getLessonMode(): 'steps' | 'all' | null {
    try {
      const m = localStorage.getItem(LESSON_MODE_KEY);
      return m === 'steps' || m === 'all' ? m : null;
    } catch {
      return null;
    }
  },

  getTheme(): 'light' | 'dark' | null {
    try {
      const t = localStorage.getItem(THEME_KEY);
      return t === 'light' || t === 'dark' ? t : null;
    } catch {
      return null;
    }
  },

  setTheme(theme: 'light' | 'dark'): void {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* theme still applies for this page view */
    }
  },
};

export function currentTheme(): 'light' | 'dark' {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
