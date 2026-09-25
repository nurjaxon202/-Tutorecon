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
