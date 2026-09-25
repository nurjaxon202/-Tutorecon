// Accounts are optional. They switch on when the site is built with a
// Supabase project: either PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY
// at build time, or the two values in src/site.ts (see the README). Pages
// read this at build time so the policies always match what the deployed
// site actually does.
import { site } from '../site';

export const supabaseUrl: string = import.meta.env.PUBLIC_SUPABASE_URL || site.accounts.supabaseUrl;
export const supabaseAnonKey: string = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || site.accounts.supabaseAnonKey;

export const accountsOn = Boolean(supabaseUrl && supabaseAnonKey);

/** "Continue with Google", when accounts are on and Google is set up. */
export const googleOn = accountsOn && (site.accounts.google || import.meta.env.PUBLIC_AUTH_GOOGLE === '1');

/** Minimum password length for new accounts. */
export const MIN_PASSWORD = 8;

/** Longest display name we keep. */
export const MAX_NAME = 40;
