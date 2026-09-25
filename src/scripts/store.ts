// Everything TutorEcon remembers lives in this browser's localStorage.
// Nothing is sent to a server. Every access is wrapped because storage can be
// blocked (private windows, strict settings) and the site must still work.

const KEY = 'tutorecon.v1';
const THEME_KEY = 'tutorecon.theme';

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
}

const empty = (): Saved => ({ done: {}, quiz: {}, exams: [], pro: null });

function read(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw);
    return { ...empty(), ...parsed };
  } catch {
    return empty();
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
    } catch {
      /* storage unavailable: nothing to clear */
    }
    delete document.documentElement.dataset.theme;
    window.dispatchEvent(new CustomEvent('tutorecon:change'));
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
