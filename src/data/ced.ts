// The official structure of both AP courses, from the College Board's
// Course and Exam Descriptions: six units each, the share of the
// multiple-choice section each unit is worth, and every numbered topic.
// Each topic points at the lesson section that teaches it.

export type CourseId = 'micro' | 'macro';

export interface Topic {
  /** Stable id used to tag questions, like 'mi2.3' or 'ma4.6'. */
  id: string;
  /** The number used in the course description, like '2.3'. */
  code: string;
  title: string;
  /** Lesson slug and section anchor that teach this topic. */
  lesson: string;
  anchor: string;
}

export interface CourseUnit {
  n: number;
  title: string;
  /** Share of the multiple-choice section, as published. */
  weight: string;
  /** Lessons that make up this unit, in reading order. */
  lessons: string[];
  topics: Topic[];
}

export interface Course {
  id: CourseId;
  name: string;
  short: string;
  path: string;
  blurb: string;
  units: CourseUnit[];
}

const t = (course: 'mi' | 'ma', code: string, title: string, lesson: string, anchor: string): Topic => ({
  id: `${course}${code}`,
  code,
  title,
  lesson,
  anchor,
});

export const courses: Course[] = [
  {
    id: 'micro',
    name: 'AP Microeconomics',
    short: 'AP Micro',
    path: '/ap-micro/',
    blurb: 'How people, firms, and single markets make choices: supply and demand, costs, market structures, labor markets, and market failure.',
    units: [
      {
        n: 1,
        title: 'Basic economic concepts',
        weight: '12 to 15%',
        lessons: ['foundations'],
        topics: [
          t('mi', '1.1', 'Scarcity', 'foundations', 'scarcity-forces-choices'),
          t('mi', '1.2', 'Resource allocation and economic systems', 'foundations', 'scarcity-forces-choices'),
          t('mi', '1.3', 'Production possibilities curve', 'foundations', 'the-production-possibilities-curve'),
          t('mi', '1.4', 'Comparative advantage and trade', 'foundations', 'comparative-advantage-and-trade'),
          t('mi', '1.5', 'Cost-benefit analysis', 'foundations', 'opportunity-cost'),
          t('mi', '1.6', 'Marginal analysis and consumer choice', 'foundations', 'thinking-at-the-margin'),
        ],
      },
      {
        n: 2,
        title: 'Supply and demand',
        weight: '20 to 25%',
        lessons: ['supply-and-demand'],
        topics: [
          t('mi', '2.1', 'Demand', 'supply-and-demand', 'demand'),
          t('mi', '2.2', 'Supply', 'supply-and-demand', 'supply'),
          t('mi', '2.3', 'Price elasticity of demand', 'supply-and-demand', 'elasticity'),
          t('mi', '2.4', 'Price elasticity of supply', 'supply-and-demand', 'elasticity'),
          t('mi', '2.5', 'Other elasticities', 'supply-and-demand', 'elasticity'),
          t('mi', '2.6', 'Market equilibrium and consumer and producer surplus', 'supply-and-demand', 'consumer-and-producer-surplus'),
          t('mi', '2.7', 'Market disequilibrium and changes in equilibrium', 'supply-and-demand', 'equilibrium'),
          t('mi', '2.8', 'The effects of government intervention in markets', 'supply-and-demand', 'price-ceilings-and-price-floors'),
          t('mi', '2.9', 'International trade and public policy', 'supply-and-demand', 'trade-and-tariffs'),
        ],
      },
      {
        n: 3,
        title: 'Production, cost, and the perfect competition model',
        weight: '22 to 25%',
        lessons: ['production-and-cost'],
        topics: [
          t('mi', '3.1', 'The production function', 'production-and-cost', 'production-and-diminishing-returns'),
          t('mi', '3.2', 'Short-run production costs', 'production-and-cost', 'the-cost-family'),
          t('mi', '3.3', 'Long-run production costs', 'production-and-cost', 'long-run-costs-and-economies-of-scale'),
          t('mi', '3.4', 'Types of profit', 'production-and-cost', 'economic-profit-and-accounting-profit'),
          t('mi', '3.5', 'Profit maximization', 'production-and-cost', 'the-profit-maximizing-rule'),
          t('mi', '3.6', 'Short-run decisions to produce and long-run decisions to enter or exit', 'production-and-cost', 'perfect-competition'),
          t('mi', '3.7', 'Perfect competition', 'production-and-cost', 'perfect-competition'),
        ],
      },
      {
        n: 4,
        title: 'Imperfect competition',
        weight: '15 to 22%',
        lessons: ['imperfect-competition'],
        topics: [
          t('mi', '4.1', 'Introduction to imperfectly competitive markets', 'imperfect-competition', 'comparing-market-structures'),
          t('mi', '4.2', 'Monopoly', 'imperfect-competition', 'monopoly'),
          t('mi', '4.3', 'Price discrimination', 'imperfect-competition', 'monopoly'),
          t('mi', '4.4', 'Monopolistic competition', 'imperfect-competition', 'monopolistic-competition'),
          t('mi', '4.5', 'Oligopoly and game theory', 'imperfect-competition', 'oligopoly-and-game-theory'),
        ],
      },
      {
        n: 5,
        title: 'Factor markets',
        weight: '10 to 13%',
        lessons: ['factor-markets'],
        topics: [
          t('mi', '5.1', 'Introduction to factor markets', 'factor-markets', 'derived-demand'),
          t('mi', '5.2', 'Changes in factor demand and factor supply', 'factor-markets', 'what-shifts-labor-demand-and-supply'),
          t('mi', '5.3', 'Profit-maximizing behavior in perfectly competitive factor markets', 'factor-markets', 'how-many-workers-to-hire'),
          t('mi', '5.4', 'Monopsonistic markets', 'factor-markets', 'monopsony'),
        ],
      },
      {
        n: 6,
        title: 'Market failure and the role of government',
        weight: '8 to 13%',
        lessons: ['market-failure'],
        topics: [
          t('mi', '6.1', 'Socially efficient and inefficient market outcomes', 'market-failure', 'when-markets-get-it-wrong'),
          t('mi', '6.2', 'Externalities', 'market-failure', 'externalities'),
          t('mi', '6.3', 'Public and private goods', 'market-failure', 'public-goods'),
          t('mi', '6.4', 'Effects of government intervention in different market structures', 'market-failure', 'government-and-firms-with-market-power'),
          t('mi', '6.5', 'Inequality', 'market-failure', 'inequality'),
        ],
      },
    ],
  },
  {
    id: 'macro',
    name: 'AP Macroeconomics',
    short: 'AP Macro',
    path: '/ap-macro/',
    blurb: 'How a whole economy behaves: GDP, unemployment, inflation, aggregate demand and supply, money and banks, policy, and trade.',
    units: [
      {
        n: 1,
        title: 'Basic economic concepts',
        weight: '5 to 10%',
        lessons: ['foundations', 'supply-and-demand'],
        topics: [
          t('ma', '1.1', 'Scarcity', 'foundations', 'scarcity-forces-choices'),
          t('ma', '1.2', 'Opportunity cost and the production possibilities curve', 'foundations', 'the-production-possibilities-curve'),
          t('ma', '1.3', 'Comparative advantage and gains from trade', 'foundations', 'comparative-advantage-and-trade'),
          t('ma', '1.4', 'Demand', 'supply-and-demand', 'demand'),
          t('ma', '1.5', 'Supply', 'supply-and-demand', 'supply'),
          t('ma', '1.6', 'Market equilibrium, disequilibrium, and changes in equilibrium', 'supply-and-demand', 'equilibrium'),
        ],
      },
      {
        n: 2,
        title: 'Economic indicators and the business cycle',
        weight: '12 to 17%',
        lessons: ['economic-indicators'],
        topics: [
          t('ma', '2.1', 'The circular flow and GDP', 'economic-indicators', 'gross-domestic-product'),
          t('ma', '2.2', 'Limitations of GDP', 'economic-indicators', 'real-and-nominal-gdp'),
          t('ma', '2.3', 'Unemployment', 'economic-indicators', 'unemployment'),
          t('ma', '2.4', 'Price indices and inflation', 'economic-indicators', 'inflation'),
          t('ma', '2.5', 'Costs of inflation', 'economic-indicators', 'the-costs-of-inflation'),
          t('ma', '2.6', 'Real versus nominal GDP', 'economic-indicators', 'real-and-nominal-gdp'),
          t('ma', '2.7', 'Business cycles', 'economic-indicators', 'the-business-cycle'),
        ],
      },
      {
        n: 3,
        title: 'National income and price determination',
        weight: '17 to 27%',
        lessons: ['national-income'],
        topics: [
          t('ma', '3.1', 'Aggregate demand', 'national-income', 'aggregate-demand'),
          t('ma', '3.2', 'Multipliers', 'national-income', 'the-spending-multiplier'),
          t('ma', '3.3', 'Short-run aggregate supply', 'national-income', 'aggregate-supply'),
          t('ma', '3.4', 'Long-run aggregate supply', 'national-income', 'aggregate-supply'),
          t('ma', '3.5', 'Equilibrium in the AD-AS model', 'national-income', 'equilibrium-and-output-gaps'),
          t('ma', '3.6', 'Changes in the AD-AS model in the short run', 'national-income', 'equilibrium-and-output-gaps'),
          t('ma', '3.7', 'Long-run self-adjustment', 'national-income', 'self-correction-in-the-long-run'),
          t('ma', '3.8', 'Fiscal policy', 'national-income', 'fiscal-policy'),
          t('ma', '3.9', 'Automatic stabilizers', 'national-income', 'fiscal-policy'),
        ],
      },
      {
        n: 4,
        title: 'Financial sector',
        weight: '18 to 23%',
        lessons: ['financial-sector'],
        topics: [
          t('ma', '4.1', 'Financial assets', 'financial-sector', 'financial-assets'),
          t('ma', '4.2', 'Nominal versus real interest rates', 'economic-indicators', 'who-wins-and-who-loses-from-unexpected-inflation'),
          t('ma', '4.3', 'Definition, measurement, and functions of money', 'financial-sector', 'what-money-is'),
          t('ma', '4.4', 'Banking and the expansion of the money supply', 'financial-sector', 'how-banks-create-money'),
          t('ma', '4.5', 'The money market', 'financial-sector', 'the-money-market'),
          t('ma', '4.6', 'Monetary policy', 'financial-sector', 'monetary-policy'),
          t('ma', '4.7', 'The loanable funds market', 'financial-sector', 'the-loanable-funds-market'),
        ],
      },
      {
        n: 5,
        title: 'Long-run consequences of stabilization policies',
        weight: '20 to 30%',
        lessons: ['stabilization-policy'],
        topics: [
          t('ma', '5.1', 'Fiscal and monetary policy actions in the short run', 'stabilization-policy', 'using-fiscal-and-monetary-policy-together'),
          t('ma', '5.2', 'The Phillips curve', 'stabilization-policy', 'the-phillips-curve'),
          t('ma', '5.3', 'Money growth and inflation', 'stabilization-policy', 'money-growth-and-inflation'),
          t('ma', '5.4', 'Government deficits and the national debt', 'stabilization-policy', 'deficits-and-debt'),
          t('ma', '5.5', 'Crowding out', 'stabilization-policy', 'deficits-and-debt'),
          t('ma', '5.6', 'Economic growth', 'stabilization-policy', 'economic-growth'),
          t('ma', '5.7', 'Public policy and economic growth', 'stabilization-policy', 'economic-growth'),
        ],
      },
      {
        n: 6,
        title: 'Open economy: international trade and finance',
        weight: '10 to 13%',
        lessons: ['open-economy'],
        topics: [
          t('ma', '6.1', 'Balance of payments accounts', 'open-economy', 'the-balance-of-payments'),
          t('ma', '6.2', 'Exchange rates', 'open-economy', 'exchange-rates'),
          t('ma', '6.3', 'The foreign exchange market', 'open-economy', 'exchange-rates'),
          t('ma', '6.4', 'Effects of policy and economic conditions on the foreign exchange market', 'open-economy', 'policy-in-an-open-economy'),
          t('ma', '6.5', 'Changes in the foreign exchange market and net exports', 'open-economy', 'how-exchange-rates-affect-trade'),
          t('ma', '6.6', 'Real interest rates and international capital flows', 'open-economy', 'real-interest-rates-and-capital-flows'),
        ],
      },
    ],
  },
];

export const allTopics: Topic[] = courses.flatMap((c) => c.units.flatMap((u) => u.topics));
export const topicById = new Map(allTopics.map((x) => [x.id, x]));
export const getCourse = (id: CourseId) => courses.find((c) => c.id === id)!;

/** Which course and unit a topic id belongs to. */
export const topicPlace = (id: string) => {
  for (const c of courses) {
    for (const u of c.units) {
      if (u.topics.some((x) => x.id === id)) return { course: c, unit: u };
    }
  }
  return null;
};

/** The exam itself, as the College Board describes it. Both courses share it. */
export const examFormat = {
  sections: [
    { name: 'Section I: Multiple choice', detail: '60 questions', time: '1 hour 10 minutes', weight: '66.7%' },
    { name: 'Section II: Free response', detail: '1 long question (10 points) and 2 short questions (5 points each)', time: '1 hour, including a 10-minute reading period', weight: '33.3%' },
  ],
  notes: [
    'Multiple-choice answers are given in the Bluebook app. Free-response answers, including graphs, are written by hand in a paper booklet.',
    'A four-function calculator is allowed.',
    'The long free-response question is worth half of Section II. Each short question is worth a quarter.',
  ],
};
