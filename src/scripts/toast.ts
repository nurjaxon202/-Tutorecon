// Short notices like "Signed out." that appear at the bottom of the screen and
// fade on their own. A notice can also be queued for the next page, for
// actions that end in a redirect (it waits in sessionStorage until then).

const NEXT_KEY = 'tutorecon.toast';
let region: HTMLElement | null = null;

function ensureRegion(): HTMLElement {
  if (region && document.body.contains(region)) return region;
  region = document.createElement('div');
  region.className = 'toasts';
  region.setAttribute('role', 'status');
  region.setAttribute('aria-live', 'polite');
  document.body.append(region);
  return region;
}

export function toast(message: string, ms = 4500): void {
  const box = ensureRegion();
  const el = document.createElement('p');
  el.className = 'toast';
  el.textContent = message;
  box.append(el);
  requestAnimationFrame(() => el.classList.add('is-in'));
  const close = () => {
    el.classList.remove('is-in');
    setTimeout(() => el.remove(), 250);
  };
  const t = setTimeout(close, ms);
  el.addEventListener('click', () => {
    clearTimeout(t);
    close();
  });
}

/** Show a notice on the next page this tab opens. */
export function toastNext(message: string): void {
  try {
    sessionStorage.setItem(NEXT_KEY, message);
  } catch {
    /* storage blocked: the notice is skipped */
  }
}

/** Show a notice queued by the previous page, if any. */
export function showQueuedToast(): void {
  try {
    const m = sessionStorage.getItem(NEXT_KEY);
    if (!m) return;
    sessionStorage.removeItem(NEXT_KEY);
    toast(m);
  } catch {
    /* storage blocked */
  }
}
