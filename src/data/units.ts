export type Course = 'both' | 'micro' | 'macro';

export interface Unit {
  slug: string;
  course: Course;
  /** Unit number in the AP course description. */
  apUnit: number;
  title: string;
  summary: string;
}

export const units: Unit[] = [
  {
    slug: 'foundations',
    course: 'both',
    apUnit: 1,
    title: 'Basic economic concepts',
    summary: 'Scarcity, opportunity cost, the production possibilities curve, and why trade makes both sides better off.',
  },
  {
    slug: 'supply-and-demand',
    course: 'micro',
    apUnit: 2,
    title: 'Supply and demand',
    summary: 'How markets set prices, what shifts each curve, elasticity, surplus, and what price controls and taxes do.',
  },
  {
    slug: 'production-and-cost',
    course: 'micro',
    apUnit: 3,
    title: 'Production, cost, and perfect competition',
    summary: 'Diminishing returns, the family of cost curves, the MR = MC rule, and why competitive firms earn zero profit in the long run.',
  },
  {
    slug: 'imperfect-competition',
    course: 'micro',
    apUnit: 4,
    title: 'Imperfect competition',
    summary: 'Monopoly, price discrimination, monopolistic competition, and oligopoly with a first look at game theory.',
  },
  {
    slug: 'factor-markets',
    course: 'micro',
    apUnit: 5,
    title: 'Factor markets',
    summary: 'How firms decide how many workers to hire, why labor demand is derived demand, and what changes with monopsony.',
  },
  {
    slug: 'market-failure',
    course: 'micro',
    apUnit: 6,
    title: 'Market failure and the role of government',
    summary: 'Externalities, public goods, the tools governments use to fix them, and how economists measure inequality.',
  },
  {
    slug: 'economic-indicators',
    course: 'macro',
    apUnit: 2,
    title: 'Economic indicators and the business cycle',
    summary: 'Measuring GDP, unemployment, and inflation, and telling real numbers from nominal ones.',
  },
  {
    slug: 'national-income',
    course: 'macro',
    apUnit: 3,
    title: 'National income and price determination',
    summary: 'Aggregate demand and supply, the spending multiplier, output gaps, and fiscal policy.',
  },
  {
    slug: 'financial-sector',
    course: 'macro',
    apUnit: 4,
    title: 'The financial sector',
    summary: 'Money, how banks create it, the money market, monetary policy, and the loanable funds market.',
  },
  {
    slug: 'stabilization-policy',
    course: 'macro',
    apUnit: 5,
    title: 'Long-run consequences of stabilization policies',
    summary: 'The Phillips curve, money and inflation, deficits and crowding out, and what drives long-run growth.',
  },
  {
    slug: 'open-economy',
    course: 'macro',
    apUnit: 6,
    title: 'The open economy',
    summary: 'The balance of payments, exchange rates, and how policy at home changes trade and capital flows.',
  },
];

export const courseName: Record<Course, string> = {
  both: 'AP Micro and Macro',
  micro: 'AP Micro',
  macro: 'AP Macro',
};

export const unitLabel = (u: Unit) => `${courseName[u.course]} · Unit ${u.apUnit}`;

export const getUnit = (slug: string) => units.find((u) => u.slug === slug);
