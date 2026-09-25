/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Supabase project URL. Accounts stay off unless this and the key are set (here or in src/site.ts). */
  readonly PUBLIC_SUPABASE_URL?: string;
  /** Supabase publishable (anon) key. Safe to ship to the browser; row level security guards the data. */
  readonly PUBLIC_SUPABASE_ANON_KEY?: string;
  /** Set to 1 to show "Continue with Google" once Google sign-in is set up in Supabase. */
  readonly PUBLIC_AUTH_GOOGLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
