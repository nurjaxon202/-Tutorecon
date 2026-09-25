// Accounts are optional. They switch on when the site is built with both
// PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY set (see the README).
// Pages read this at build time so the policies always match what the
// deployed site actually does.
export const accountsOn = Boolean(import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.PUBLIC_SUPABASE_ANON_KEY);

/** Minimum password length for new accounts. */
export const MIN_PASSWORD = 8;
