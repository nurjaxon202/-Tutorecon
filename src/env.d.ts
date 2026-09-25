/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Supabase project URL. Accounts stay off unless this and the key are set at build time. */
  readonly PUBLIC_SUPABASE_URL?: string;
  /** Supabase publishable (anon) key. Safe to ship to the browser; row level security guards the data. */
  readonly PUBLIC_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
