// Everything a visitor sees about who runs the site lives here.
// Change these to your real details before you share the link.
export const site = {
  name: 'TutorEcon',
  tagline: 'AP Micro and AP Macro review',
  description:
    'Free AP Microeconomics and AP Macroeconomics review organized by the official course topics: lessons with graphs you can drag, a question bank that explains every answer, free-response questions with scoring guides, and flashcards.',
  owner: 'nurjaxon202',
  ownerUrl: 'https://github.com/nurjaxon202',
  contactUrl: 'https://github.com/nurjaxon202/-Tutorecon/issues',
  sourceUrl: 'https://github.com/nurjaxon202/-Tutorecon',
  launched: '2026-09-25',
  policiesUpdated: '25 September 2026',
  // Optional accounts. Paste your Supabase project's URL and its public
  // "anon" key here, or set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY
  // when building (the build settings win). Both values are public by design:
  // they ship to every visitor's browser, and the row rules in
  // supabase/schema.sql are what keep each account's data private.
  // Never put the service_role key or the database password here.
  accounts: {
    supabaseUrl: '',
    supabaseAnonKey: '',
    /** Show "Continue with Google". Turn on only after setting up Google in Supabase (see the README). */
    google: false,
  },
  pro: {
    price: 5,
    currency: 'USD',
    interval: 'month',
  },
};
