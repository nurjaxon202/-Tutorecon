// Small helpers shared by the account forms.

export const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** "Show" buttons next to password fields. */
export function wireReveal(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>('[data-reveal]').forEach((btn) => {
    const input = document.getElementById(btn.getAttribute('aria-controls') ?? '') as HTMLInputElement | null;
    if (!input) return;
    btn.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? 'Hide' : 'Show';
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      btn.setAttribute('aria-pressed', String(show));
    });
  });
}

/** Show or clear the message under one field. */
export function fieldError(form: HTMLElement, name: string, message: string, input?: HTMLInputElement | null): void {
  const el = form.querySelector<HTMLElement>(`[data-error="${name}"]`);
  if (el) el.textContent = message;
  input?.setAttribute('aria-invalid', message ? 'true' : 'false');
}

/** Disable a submit button while a request is out, and change its label. */
export function busy(btn: HTMLButtonElement, on: boolean, label: string): void {
  btn.disabled = on;
  btn.textContent = label;
  btn.setAttribute('aria-busy', String(on));
}

/** Only follow ?next= links that stay on this site. */
export function safeNext(fallback: string): string {
  const next = new URLSearchParams(location.search).get('next');
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (next && next.startsWith(`${base}/`) && !next.startsWith('//')) return next;
  return fallback;
}

/* Password strength */

// A short list of passwords that show up first in every breach. Anything here,
// or anything built from the email address, is refused.
const COMMON = new Set([
  'password', 'password1', 'password12', 'password123', 'passw0rd', '12345678', '123456789', '1234567890', '87654321',
  '11111111', '00000000', 'qwertyui', 'qwerty123', 'qwertyuiop', 'iloveyou', 'abc12345', 'abcd1234', 'letmein1',
  'football', 'baseball', 'basketball', 'sunshine', 'princess', 'welcome1', 'admin123', 'superman', 'trustno1',
  'whatever', 'starwars', 'computer', 'dragon123', 'monkey123', 'tutorecon', 'economics', 'apmacro', 'apmicro',
]);

export interface Strength {
  /** 0 empty, 1 not allowed or weak, 2 fair, 3 good, 4 strong. */
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  /** Why the password cannot be used, if it cannot. */
  problem: string;
}

export function strength(pw: string, email: string, min: number): Strength {
  if (!pw) return { score: 0, label: '', problem: `Use at least ${min} characters.` };
  const lower = pw.toLowerCase();
  const local = email.split('@')[0].toLowerCase();
  if (pw.length < min) return { score: 1, label: 'Too short', problem: `Use at least ${min} characters.` };
  if (COMMON.has(lower) || /^(.)\1+$/.test(pw) || (local.length >= 4 && lower.includes(local)))
    return { score: 1, label: 'Too easy to guess', problem: 'That password is too easy to guess. A few unrelated words in a row work well.' };
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length;
  let score = 1 + (pw.length >= 12 ? 1 : 0) + (kinds >= 3 ? 1 : 0) + (pw.length >= 16 || (pw.length >= 12 && kinds === 4) ? 1 : 0);
  if (kinds === 1 && pw.length < 16) score = Math.min(score, 2);
  const s = Math.min(4, score) as 1 | 2 | 3 | 4;
  return { score: s, label: ['', 'Weak', 'Fair', 'Good', 'Strong'][s], problem: '' };
}

/** Keep a strength bar under a new-password field up to date. */
export function wireMeter(input: HTMLInputElement, email: HTMLInputElement | null, min: number): () => Strength {
  const meter = document.querySelector<HTMLElement>(`[data-meter="${input.id}"]`);
  const text = document.querySelector<HTMLElement>(`[data-meter-text="${input.id}"]`);
  const update = () => {
    const s = strength(input.value, email?.value.trim() ?? '', min);
    if (meter) meter.dataset.score = String(s.score);
    if (text) text.textContent = s.label ? `Strength: ${s.label}` : '';
    // Clear an earlier error as soon as the password is good enough.
    if (!s.problem && input.getAttribute('aria-invalid') === 'true') {
      input.setAttribute('aria-invalid', 'false');
      const err = document.getElementById(`${input.id}-error`);
      if (err) err.textContent = '';
    }
    return s;
  };
  input.addEventListener('input', update);
  email?.addEventListener('input', update);
  update();
  return update;
}

/** Wait before a "send again" button can be used again, showing the seconds left. */
export function cooldown(btn: HTMLButtonElement, label: string, seconds = 60): void {
  let left = seconds;
  btn.disabled = true;
  const tick = () => {
    if (left <= 0) {
      btn.disabled = false;
      btn.textContent = label;
      return;
    }
    btn.textContent = `${label} (${left}s)`;
    left -= 1;
    setTimeout(tick, 1000);
  };
  tick();
}
