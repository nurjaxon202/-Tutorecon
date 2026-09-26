// Optional accounts, backed by Supabase Auth (email and password).
//
// Accounts only exist when the site is built with a Supabase project (see the
// README). Without one, nothing here loads and TutorEcon keeps everything in
// this browser, exactly as before.
//
// When someone is signed in, the progress entry (tutorecon.v1) is copied to a
// row in the `progress` table that only they can read or write. The Supabase
// library is large, so it is fetched only for people who are signed in, are
// signing in, or arrive from an email link.

import type { AuthChangeEvent, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { accountsOn, supabaseAnonKey, supabaseUrl } from '../lib/accounts';
import { url } from '../lib/url';
import { emptySaved, store, type Saved } from './store';
import { cleanSaved, mergeSaved } from './merge';

export { accountsOn };

/** Session tokens, written by the Supabase library while someone is signed in. */
export const SESSION_KEY = 'tutorecon.auth';
/** Set in sessionStorage when someone signs in without "Keep me signed in". */
const TAB_ONLY_KEY = 'tutorecon.tabOnly';
/** Which account this browser last synced with, when, and whether it has unsaved changes. */
export const SYNC_KEY = 'tutorecon.sync';

const get = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const set = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* storage blocked: sync still works for this page view */
  }
};
const del = (k: string) => {
  try {
    localStorage.removeItem(k);
  } catch {
    /* nothing stored */
  }
};
const tabGet = (k: string) => {
  try {
    return sessionStorage.getItem(k);
  } catch {
    return null;
  }
};
const tabSet = (k: string, v: string) => {
  try {
    sessionStorage.setItem(k, v);
  } catch {
    /* storage blocked */
  }
};
const tabDel = (k: string) => {
  try {
    sessionStorage.removeItem(k);
  } catch {
    /* nothing stored */
  }
};

// Where the Supabase library keeps sign-in tokens. Normally that is local
// storage, so people stay signed in. Without "Keep me signed in", tokens live
// in sessionStorage instead and disappear when the tab is closed.
const authStorage = {
  getItem: (k: string) => get(k) ?? tabGet(k),
  setItem: (k: string, v: string) => {
    if (tabGet(TAB_ONLY_KEY) === '1') {
      tabSet(k, v);
      del(k);
    } else {
      set(k, v);
      tabDel(k);
    }
  },
  removeItem: (k: string) => {
    del(k);
    tabDel(k);
  },
};

/** Call before signing in. False keeps the session only until this tab is closed. */
export function keepSignedIn(on: boolean): void {
  if (on) tabDel(TAB_ONLY_KEY);
  else tabSet(TAB_ONLY_KEY, '1');
}

// Read before the Supabase library clears it from the address bar.
const firstHash = typeof location === 'undefined' ? '' : location.hash;

/** A full link to a page on this site, for emails that bring people back. */
export const siteLink = (path: string) => new URL(url(path), location.origin).href;

/** If the reader arrived from an email link that failed, why. */
export function linkProblem(): string | null {
  const params = new URLSearchParams(firstHash.replace(/^#/, ''));
  if (!params.get('error') && !params.get('error_code')) return null;
  const code = params.get('error_code') ?? '';
  if (code === 'otp_expired') return 'That link has expired or was already used.';
  return params.get('error_description')?.replace(/\+/g, ' ') ?? 'That link did not work.';
}

let clientPromise: Promise<SupabaseClient> | null = null;

export function getClient(): Promise<SupabaseClient> {
  if (!accountsOn) return Promise.reject(new Error('Accounts are not switched on.'));
  clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storageKey: SESSION_KEY,
        storage: authStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'implicit',
      },
    }),
  );
  return clientPromise;
}

export const hasStoredSession = () => Boolean(get(SESSION_KEY) ?? tabGet(SESSION_KEY));
const fromEmailLink = () => /(^|[#&])(access_token|error|error_code)=/.test(firstHash);

/* Signed-in state */

let session: Session | null = null;
let ready = false;
let listening = false;

export const currentSession = () => session;

/** Calls back with the signed-in state now (when known) and whenever it changes. */
export function onAuth(cb: (s: Session | null) => void): void {
  window.addEventListener('tutorecon:auth', () => cb(session));
  if (ready || !accountsOn || (!hasStoredSession() && !fromEmailLink())) cb(session);
}

/** Load Supabase and start listening for sign-in changes. */
export async function connect(): Promise<SupabaseClient> {
  const client = await getClient();
  if (!listening) {
    listening = true;
    client.auth.onAuthStateChange((event, s) => {
      // Supabase asks that its own calls are not awaited inside this callback,
      // so the follow-up work runs just after it returns.
      setTimeout(() => handleAuth(event, s), 0);
    });
  }
  return client;
}

function handleAuth(event: AuthChangeEvent, s: Session | null) {
  const before = session?.user.id ?? null;
  session = s;
  ready = true;
  const now = s?.user.id ?? null;
  if (now && now !== before) void reconcile(now);
  syncHeader();
  window.dispatchEvent(new CustomEvent('tutorecon:auth', { detail: { event } }));
}

/** Resolves once a session exists, or with null after the wait. */
export function waitForSession(ms = 6000): Promise<Session | null> {
  if (session) return Promise.resolve(session);
  return new Promise((resolve) => {
    const done = () => {
      clearTimeout(t);
      window.removeEventListener('tutorecon:auth', check);
      resolve(session);
    };
    const check = () => session && done();
    const t = setTimeout(done, ms);
    window.addEventListener('tutorecon:auth', check);
  });
}

/* Names */

/** The name someone gave when signing up, or the one Google shared. */
export function displayName(user: User | null | undefined): string {
  const m = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const name = [m.name, m.full_name].find((v) => typeof v === 'string' && v.trim());
  return typeof name === 'string' ? name.trim() : '';
}

/** One or two letters for the round badge in the header. */
export function initials(user: User | null | undefined): string {
  const name = displayName(user);
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }
  return (user?.email?.[0] ?? '?').toUpperCase();
}

/** How someone signs in: 'email' or 'google'. */
export const provider = (user: User | null | undefined) => (user?.app_metadata?.provider as string | undefined) ?? 'email';

/** The header shows "Sign in" and "Sign up", or a badge with the reader's initials. */
function syncHeader() {
  const signedIn = session ? true : !ready && hasStoredSession();
  document.documentElement.dataset.auth = signedIn ? 'in' : 'out';
  if (accountsOn) document.documentElement.dataset.access = signedIn ? 'member' : 'guest';
  const user = session?.user;
  document.querySelectorAll<HTMLElement>('[data-avatar]').forEach((el) => (el.textContent = user ? initials(user) : ''));
  document.querySelectorAll<HTMLElement>('[data-who-name]').forEach((el) => {
    el.textContent = displayName(user) || 'Signed in';
  });
  document.querySelectorAll<HTMLElement>('[data-who-email]').forEach((el) => (el.textContent = user?.email ?? ''));
}

/** Update the name on the account and in the header. */
export async function saveName(name: string): Promise<void> {
  const client = await getClient();
  const { data, error } = await client.auth.updateUser({ data: { name } });
  if (error) throw error;
  if (session && data.user) session = { ...session, user: data.user };
  syncHeader();
}

/* Progress sync */

interface Marker {
  user: string;
  at: string | null;
  dirty: boolean;
}
const readMarker = (): Marker | null => {
  try {
    const m = JSON.parse(get(SYNC_KEY) ?? 'null');
    return m && typeof m.user === 'string' ? m : null;
  } catch {
    return null;
  }
};
const writeMarker = (m: Marker) => set(SYNC_KEY, JSON.stringify(m));

export interface SyncState {
  state: 'idle' | 'saving' | 'saved' | 'error';
  /** When the account copy was last written (ISO time). */
  at: string | null;
}
let sync: SyncState = { state: 'idle', at: readMarker()?.at ?? null };
const setSync = (s: SyncState) => {
  sync = s;
  window.dispatchEvent(new CustomEvent('tutorecon:sync'));
};
export const syncState = () => sync;

let applying = false;
let timer: number | undefined;
let queue: Promise<void> = Promise.resolve();
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

async function pull(client: SupabaseClient, id: string): Promise<{ data: Saved | null; at: string | null }> {
  const { data, error } = await client.from('progress').select('data, updated_at').eq('user_id', id).maybeSingle();
  if (error) throw error;
  return data ? { data: cleanSaved(data.data), at: data.updated_at as string } : { data: null, at: null };
}

async function upload(client: SupabaseClient, id: string, data: Saved): Promise<string> {
  const at = new Date().toISOString();
  const { error } = await client.from('progress').upsert({ user_id: id, data, updated_at: at });
  if (error) throw error;
  return at;
}

function applyLocal(data: Saved) {
  applying = true;
  try {
    store.replace(data);
  } finally {
    applying = false;
  }
}

/** Bring this browser and the account copy together. Runs after each sign-in and page load. */
function reconcile(id: string): Promise<void> {
  queue = queue.then(async () => {
    setSync({ state: 'saving', at: sync.at });
    try {
      const client = await getClient();
      const remote = await pull(client, id);
      const mark = readMarker();
      const local = store.get();
      let next: Saved;
      if (!mark) {
        // First sign-in in this browser: add what was done here to the account.
        next = remote.data ? mergeSaved(local, remote.data) : local;
      } else if (mark.user !== id) {
        // This browser last held someone else's account. Do not mix the two.
        next = remote.data ?? emptySaved();
      } else if (mark.dirty && remote.data && remote.at !== mark.at) {
        // Changed here and somewhere else since the last sync.
        next = mergeSaved(local, remote.data);
      } else if (mark.dirty) {
        next = local;
      } else {
        next = remote.data ?? local;
      }
      if (!same(next, local)) applyLocal(next);
      let at = remote.at;
      if (!remote.data || !same(next, remote.data)) at = await upload(client, id, next);
      writeMarker({ user: id, at, dirty: false });
      setSync({ state: 'saved', at });
    } catch {
      setSync({ state: 'error', at: sync.at });
    }
  });
  return queue;
}

/** Write this browser's progress to the account right away. */
export function saveNow(): Promise<void> {
  clearTimeout(timer);
  timer = undefined;
  const id = session?.user.id;
  if (!id) return queue;
  queue = queue.then(async () => {
    setSync({ state: 'saving', at: sync.at });
    try {
      const client = await getClient();
      const at = await upload(client, id, store.get());
      writeMarker({ user: id, at, dirty: false });
      setSync({ state: 'saved', at });
    } catch {
      setSync({ state: 'error', at: sync.at });
    }
  });
  return queue;
}

/** Fetch the account copy and combine it with this browser. */
export const syncNow = () => (session ? reconcile(session.user.id) : Promise.resolve());

/** Wait for any sync in progress, but not forever. */
export const settled = (ms = 6000) => Promise.race([queue, new Promise<void>((r) => setTimeout(r, ms))]);

function onLocalChange() {
  if (applying) return;
  const mark = readMarker();
  if (mark && !mark.dirty) writeMarker({ ...mark, dirty: true });
  if (!session) return;
  clearTimeout(timer);
  timer = window.setTimeout(() => void saveNow(), 1500);
}

/* Account actions */

/** Sign out in this browser. Progress can stay here or be cleared. */
export async function signOut(clearHere: boolean): Promise<void> {
  if (timer !== undefined) await saveNow();
  await settled();
  const client = await getClient();
  const { error } = await client.auth.signOut({ scope: 'local' });
  if (error) del(SESSION_KEY);
  session = null;
  tabDel(SESSION_KEY);
  if (clearHere) {
    applying = true;
    try {
      store.clearProgress();
    } finally {
      applying = false;
    }
    del(SYNC_KEY);
  }
  syncHeader();
  window.dispatchEvent(new CustomEvent('tutorecon:auth', { detail: { event: 'SIGNED_OUT' } }));
}

/** Erase the account and its saved progress. This browser keeps its own copy. */
export async function deleteAccount(): Promise<void> {
  clearTimeout(timer);
  timer = undefined;
  await settled();
  const client = await getClient();
  const { error } = await client.rpc('delete_my_account');
  if (error) throw error;
  session = null;
  await client.auth.signOut({ scope: 'local' }).catch(() => undefined);
  del(SESSION_KEY);
  tabDel(SESSION_KEY);
  del(SYNC_KEY);
  syncHeader();
  window.dispatchEvent(new CustomEvent('tutorecon:auth', { detail: { event: 'SIGNED_OUT' } }));
}

/** Plain-language versions of the errors Supabase can return. */
export function authMessage(err: unknown): string {
  const e = (err ?? {}) as { code?: string; message?: string; status?: number };
  const code = e.code ?? '';
  const msg = (e.message ?? '').toLowerCase();
  if (code === 'invalid_credentials' || msg.includes('invalid login')) return 'That email and password do not match an account. Check both and try again.';
  if (code === 'email_not_confirmed' || msg.includes('not confirmed')) return 'Confirm your email first. Open the link we sent you, then sign in.';
  if (code === 'user_already_exists' || msg.includes('already registered')) return 'An account already uses this email. Sign in instead, or reset the password.';
  if (code === 'same_password' || msg.includes('different from the old')) return 'The new password has to be different from the old one.';
  if (code === 'weak_password' || msg.includes('password should')) return 'Choose a longer password that is harder to guess.';
  if (code === 'otp_disabled' || msg.includes('signups not allowed for otp') || code === 'user_not_found') return 'No account uses this email yet. Check the spelling, or create an account.';
  if (code === 'provider_disabled' || msg.includes('provider is not enabled')) return 'Google sign-in is not set up yet. Use your email instead.';
  if (code === 'email_address_invalid' || msg.includes('invalid format')) return 'Enter an email address like name@example.com.';
  if (code.startsWith('over_') || e.status === 429 || msg.includes('rate limit') || msg.includes('security purposes')) return 'Too many tries in a short time. Wait a minute, then try again.';
  if (code === 'signup_disabled' || msg.includes('signups not allowed')) return 'New accounts are closed right now.';
  if (msg.includes('fetch') || msg.includes('network')) return 'Could not reach the account service. Check your connection and try again.';
  return 'Something went wrong. Try again in a moment.';
}

/* Other ways to sign in */

/** Send a one-time sign-in link. Only works for existing accounts. */
export async function sendSignInLink(email: string, next: string): Promise<void> {
  const client = await connect();
  const { error } = await client.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: siteLink(next) } });
  if (error) throw error;
}

/** Send the sign-up confirmation email again. */
export async function resendConfirmation(email: string, next: string): Promise<void> {
  const client = await connect();
  const { error } = await client.auth.resend({ type: 'signup', email, options: { emailRedirectTo: siteLink(next) } });
  if (error) throw error;
}

/** Leave for Google's sign-in page. It sends the reader back to `next`, signed in. */
export async function signInWithGoogle(next: string): Promise<void> {
  const client = await connect();
  const { error } = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: siteLink(next) } });
  if (error) throw error;
}

/** Runs on every page from the header. */
export function initAccount(): void {
  syncHeader();
  window.addEventListener('tutorecon:change', onLocalChange);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && timer !== undefined) void saveNow();
  });
  if (accountsOn && (hasStoredSession() || fromEmailLink())) {
    connect().catch(() => {
      ready = true;
      syncHeader();
      window.dispatchEvent(new CustomEvent('tutorecon:auth', { detail: { event: 'INITIAL_SESSION' } }));
    });
  }
}
