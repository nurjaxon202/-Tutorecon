# TutorEcon

Free AP Microeconomics and AP Macroeconomics review, organized by the official course topics, with graphs you can move.

- **Both courses, unit by unit**: course pages for AP Micro and AP Macro list all 6 units per course with their published exam weights and every numbered topic (78 in total), each linked to the lesson section that teaches it
- **11 lessons** with step-by-step reading, 18 live graphs, worked problems, margin definitions, and a six-question check at the end
- **Question bank**: 516 original multiple-choice questions in the AP format (five choices), each tagged with its official topic and a difficulty level, with an explanation for every choice. Every official topic has at least five. Filter by course, unit, topic, difficulty, questions you missed last time, or questions you flagged. Results are broken down by topic, and your weakest topics are tracked
- **Missed and flagged questions**: one page with every question you got wrong on your last try or flagged, with the answer and the reason
- **Study planner**: enter your exam date and the days you can study, and get a dated plan that gives each unit time by its exam weight and ends with mock exams and review
- **Formula sheet**: every formula and decision rule from both courses on one printable page, most with a worked example
- **Optional accounts**: sign up, sign in, password reset, and progress that follows you to any device (see [Accounts](#accounts)). Anything done before signing in is added to the account, and progress can also be moved between devices with a file
- **Free-response questions**: 24 original questions (8 long, 16 short) with point-by-point scoring guides, a timer set to the suggested time, and self-scoring
- **Flashcards** for all 146 glossary terms, by unit
- **Mock exam** (Pro demo): 60 questions in 70 minutes or a half-length version, drawn in proportion to each unit's exam weight and scored by unit
- **Score calculator** that shows how the exam weights each section, without guessing at cut scores the College Board does not publish
- Site search over topics, lessons, terms, formulas, graphs, and FRQs (press `/`)
- **The four moves**: pick a news event and a tutor walks through what changed, which curve moves, which way, and what happens, while the graph moves
- A Pro tier behind a clearly labeled **demo** checkout that only accepts test cards and charges nothing

## Content checks

Every build checks the question bank and FRQs: each multiple-choice question must have five choices, exactly one marked answer, an explanation for every choice, and a real official topic; each FRQ must add up to 10 points (long) or 5 points (short). A problem stops the build.

## Design

A study tool, not a landing page. Headings are set in Source Serif 4 and reading text in Figtree, with thin rules, plain surfaces, and left-aligned layouts. Color carries meaning: blue for demand curves and AP Macro, orange for supply curves and AP Micro, green and red for right and wrong answers, and yellow for where you are. Every picture on the site is drawn by the same graph engine that powers the lessons, and all fonts are self-hosted.

Text meets WCAG AA contrast in both the light and dark themes, everything works with a keyboard, and motion is reduced when your device asks for it.

The site is static. There are no cookies, no analytics, and no ads. Progress is saved in your browser. Accounts are optional and off until you connect an account service (below); with them off, nothing about a visitor leaves the browser and the account pages say so.

## Run it locally

```sh
npm install
npm run dev      # http://localhost:4321/-Tutorecon/
npm run build    # outputs to dist/
```

Needs Node 22.12 or newer.

## Publish on GitHub Pages

1. Merge this branch into `main`.
2. On GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and deploys on every push to `main`.

The site will be at `https://nurjaxon202.github.io/-Tutorecon/`.

### Custom domain

1. Buy a domain and add it under **Settings → Pages → Custom domain**. GitHub shows the DNS records to create.
2. In `.github/workflows/deploy.yml`, add the new address to the build step's `env:` list:

   ```yaml
   SITE_URL: https://your-domain.com
   BASE_PATH: /
   ```

## Accounts

Sign up and sign in use [Supabase](https://supabase.com) for email and password accounts and to store each person's progress. It has a free plan. Until the two settings below are added, accounts stay off, the sign-in pages explain that, and the Supabase code is never downloaded.

1. Create a project at supabase.com.
2. Open **SQL Editor**, paste in [`supabase/schema.sql`](supabase/schema.sql), and run it. It creates the `progress` table, locks each row so only its owner can read or change it, and adds the function behind **Delete account**.
3. Open **Authentication → URL Configuration**. Set **Site URL** to `https://nurjaxon202.github.io/-Tutorecon/` and add `https://nurjaxon202.github.io/-Tutorecon/**` under **Redirect URLs**, so email links bring people back to the site.
4. Choose how sign-up works under **Authentication → Sign In / Providers → Email**:
   - With **Confirm email** on, new people get a link before they can sign in. Supabase's built-in email sender is only meant for testing and has tight limits, so for real use add your own sender under **Authentication → Emails → SMTP settings**.
   - With it off, people are signed in as soon as they sign up. Password reset emails still need a working sender.
5. Open **Project Settings → API Keys** and copy the **Project URL** and the **anon** (publishable) key. Never use the `service_role` or secret key on the site.
6. On GitHub, open **Settings → Secrets and variables → Actions → Variables** and add two repository variables: `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`.
7. Run the deploy again (**Actions → Deploy to GitHub Pages → Run workflow**) or push to `main`.

To try accounts locally, put the same two lines in a `.env` file in the project folder. It is ignored by git.

The anon key is meant to be public. What keeps data private is row level security in `schema.sql`: every request is checked against the signed-in user, so no one can read or change another person's progress. The privacy policy, terms, cookie policy, and account page change their wording at build time depending on whether accounts are on, so they always describe what the live site does.

## Before you share it

Edit `src/site.ts`:

- `owner` and `ownerUrl`: your name and a link you are happy to make public.
- `contactUrl`: where people report problems. It points to this repo's GitHub issues by default.

The terms of use do not name a country for governing law. If you want one, add it to `src/pages/terms.astro`.

## About the Pro checkout

Payments are **not** switched on. The checkout at `/checkout/`:

- is labeled as a demo on the page, the pricing page, and in the terms
- accepts only Stripe's published test card numbers and refuses anything else
- turns off browser autofill so saved real cards are not filled in
- never sends or stores what is typed; it only sets a "Pro is on" flag in the browser

To take real payments later, create a Stripe Payment Link (Stripe handles the card form, so card details never touch this site), point the Pro button at it, and update the privacy, terms, and refund pages first. In most countries Stripe accounts need an adult owner, so a parent or guardian may need to open the account.

## Project layout

```
src/
  units/            lesson content (MDX), one file per lesson
  data/ced.ts       both courses: units, exam weights, and every official topic
  data/questions/   the question bank, one file per lesson, plus build-time checks
  data/frqs.ts      free-response questions and scoring guides
  data/             lessons list, glossary, review sheets
  scripts/graphs/   the SVG graph engine, every graph model, and the four-moves scripts
  scripts/          quiz, question bank, local storage (progress, XP, streak, question history),
                    account.ts (sign-in and progress sync), merge.ts (combining two copies of progress)
  data/formulas.ts  the formula sheet
supabase/schema.sql the database table and security rules for accounts
  lib/rehype-sidenotes.mjs   adds margin definitions to lessons at build time
  components/       CoursePage, AuthShell, Graph, HeroDemo, Quiz, SearchDialog, Callout, Worked, Step, ProGate, header, footer
  pages/            every route, including policies, plus search.json and questions.json
  styles/           design tokens and component styles
```

Numbers shown on the site (topics, questions, FRQs, graphs, glossary terms) are counted from these files at build time.
