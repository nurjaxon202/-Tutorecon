// Is the reader a guest? The answer is set on <html data-access> before the
// page paints (see Base.astro) and kept up to date by account.ts.
import { GUEST_DAILY, gated } from '../lib/access';
import { store } from './store';

export { GUEST_DAILY };

export const isGuest = () => gated && document.documentElement.dataset.access === 'guest';

/** Question-bank answers a guest has left today, or Infinity for members. */
export const guestLeft = () => (isGuest() ? Math.max(0, GUEST_DAILY - store.bankToday()) : Infinity);
