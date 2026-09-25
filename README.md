# TutorEcon

Free AP Microeconomics and AP Macroeconomics lessons with graphs you can move.

- A try-it-now demo on the home page: answer a question and watch the market move
- 11 units that follow the AP course outlines, laid out as a path: Unit 1, then an AP Micro track and an AP Macro track
- Step-by-step lessons: one section at a time with a Continue button and a progress bar, or the whole lesson at once
- 18 live graphs (supply and demand, price controls, taxes, cost curves, monopoly, monopsony, externalities, Lorenz curve, business cycle, AD-AS, money market, loanable funds, Phillips curve, foreign exchange)
- **The four moves**: pick a news event and a tutor walks through what changed, which curve moves, which way, and what happens, while the graph highlights the curve, shifts it, and draws the axis arrows
- Margin definitions: the first time a key term appears in a lesson, its glossary definition sits beside it
- 66 practice questions, each with an explanation for every answer choice, keyboard shortcuts, and a progress strip
- XP for first correct answers, a daily goal, a day streak, and a unit check that marks the unit done
- A glossary, a graph lab, and progress saved in the browser
- A Pro tier (timed mock exams, printable review sheets) behind a clearly labeled **demo** checkout

## Design

Built like a learning app. Big, friendly type (Bricolage Grotesque for headlines, Figtree for reading), a blue and orange palette (blue for AP Macro and demand curves, orange for AP Micro and supply curves, yellow for the current step), and chunky buttons with a pressable bottom edge. Answers get a green or red banner with the reason, and progress shows up as bars, rings, and a streak counter. Every picture on the site is drawn by the same graph engine that powers the lessons, and all fonts are self-hosted.

Text meets WCAG AA contrast in both the light and dark themes, everything works with a keyboard, and motion is reduced when your device asks for it.

The site is fully static. It has no server, no accounts, no cookies, no analytics, and no third-party scripts.

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
2. In `.github/workflows/deploy.yml`, give the build step the new address:

   ```yaml
   - uses: withastro/action@v6
     env:
       SITE_URL: https://your-domain.com
       BASE_PATH: /
   ```

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
  units/            lesson content (MDX), one file per unit
  data/             units, practice questions, glossary, review sheets
  scripts/graphs/   the SVG graph engine, every graph model, and the four-moves scripts
  lib/rehype-sidenotes.mjs   adds margin definitions to lessons at build time
  scripts/          quiz, learning path, local storage (progress, XP, streak)
  components/       Graph, HeroDemo, UnitPathRow, Quiz, Callout, Worked, Step, ProGate, header, footer
  pages/            every route, including policies
  styles/           design tokens and component styles
```

Numbers shown on the site (units, graphs, worked problems, questions, glossary terms) are counted from these files at build time.
