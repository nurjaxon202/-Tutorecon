// Every formula and rule of thumb the two courses use, grouped by course unit.
// `lesson` is the lesson that teaches it.

export interface Formula {
  name: string;
  f: string;
  note?: string;
  ex?: string;
}

export interface FormulaGroup {
  id: string;
  course: 'micro' | 'macro';
  unit: number;
  title: string;
  lesson: string;
  items: Formula[];
}

export const formulaGroups: FormulaGroup[] = [
  {
    id: 'mi1',
    course: 'micro',
    unit: 1,
    title: 'Basic economic concepts',
    lesson: 'foundations',
    items: [
      { name: 'Opportunity cost of one unit', f: 'Cost of 1 X = Y given up ÷ X gained', note: 'Constant along a straight-line PPC. Rises along a PPC that bows outward.', ex: 'An economy can make 50 X or 25 Y. One Y costs 50 ÷ 25 = 2 X.' },
      { name: 'Terms of trade that help both sides', f: 'Cost to A < price < cost to B', note: 'The trade price has to fall between the two producers’ opportunity costs.', ex: 'A phone costs A 2 shirts and costs B 3 shirts. Any price between 2 and 3 shirts per phone helps both.' },
      { name: 'Utility-maximizing rule', f: 'MUx ÷ Px = MUy ÷ Py', note: 'With the whole budget spent. If one side is bigger, buy more of that good.', ex: 'Last apple ($1) adds 6 utils, last orange ($2) adds 8. Apples give 6 per dollar and oranges 4, so buy more apples.' },
      { name: 'Marginal decision rule', f: 'Keep going while MB ≥ MC', note: 'Stop at the point where one more unit would cost more than it is worth.' },
    ],
  },
  {
    id: 'mi2',
    course: 'micro',
    unit: 2,
    title: 'Supply and demand',
    lesson: 'supply-and-demand',
    items: [
      { name: 'Price elasticity of demand', f: 'Ed = %ΔQd ÷ %ΔP', note: 'Use the absolute value. Above 1 is elastic, below 1 inelastic, exactly 1 unit elastic.', ex: 'Price rises 10% and quantity falls 4%: Ed = 0.4, inelastic.' },
      { name: 'Midpoint percent change', f: '%Δ = (new − old) ÷ average of the two × 100', ex: 'A price change from $4 to $6 is 2 ÷ 5 = 40%.' },
      { name: 'Total revenue test', f: 'TR = P × Q', note: 'Elastic demand: price and total revenue move in opposite directions. Inelastic: the same direction. Unit elastic: revenue does not change.' },
      { name: 'Price elasticity of supply', f: 'Es = %ΔQs ÷ %ΔP', ex: 'Price rises 20% and quantity supplied rises 30%: Es = 1.5, elastic.' },
      { name: 'Income elasticity of demand', f: '%ΔQd ÷ %Δincome', note: 'Positive means a normal good (above 1, a luxury). Negative means an inferior good.' },
      { name: 'Cross-price elasticity of demand', f: '%ΔQd of X ÷ %ΔP of Y', note: 'Positive means substitutes. Negative means complements.' },
      { name: 'Consumer and producer surplus', f: 'Triangle area = ½ × base × height', note: 'Consumer surplus sits below demand and above the price. Producer surplus sits above supply and below the price.' },
      { name: 'Per-unit tax', f: 'Revenue = tax × quantity after the tax. DWL = ½ × tax × (Q before − Q after)', ex: 'A $2 tax cuts sales from 1,000 to 800. Revenue is $1,600, and deadweight loss is ½ × $2 × 200 = $200.' },
    ],
  },
  {
    id: 'mi3',
    course: 'micro',
    unit: 3,
    title: 'Production, cost, and perfect competition',
    lesson: 'production-and-cost',
    items: [
      { name: 'Marginal and average product', f: 'MP = ΔTP ÷ ΔL.  AP = TP ÷ L', ex: 'Output goes from 36 to 44 with the fourth worker: MP = 8 and AP = 44 ÷ 4 = 11.' },
      { name: 'Cost identities', f: 'TC = FC + VC.  ATC = TC ÷ Q = AFC + AVC', ex: 'FC $400 and ATC $20 at 50 units: AFC = $8, so AVC = $12.' },
      { name: 'Marginal cost', f: 'MC = ΔTC ÷ ΔQ = ΔVC ÷ ΔQ', note: 'Fixed cost never changes marginal cost.' },
      { name: 'Profit', f: 'Profit = TR − TC = (P − ATC) × Q' },
      { name: 'Accounting and economic profit', f: 'Accounting = TR − explicit costs.  Economic = TR − explicit − implicit costs', ex: '$200,000 revenue, $110,000 explicit costs, and a $120,000 salary given up: accounting profit $90,000, economic profit −$30,000.' },
      { name: 'Firm decision rules', f: 'Produce where MR = MC', note: 'Shut down in the short run if P < minimum AVC. Exit in the long run if P < minimum ATC. In perfect competition, P = MR = AR = the firm’s demand.' },
    ],
  },
  {
    id: 'mi4',
    course: 'micro',
    unit: 4,
    title: 'Imperfect competition',
    lesson: 'imperfect-competition',
    items: [
      { name: 'Marginal revenue for straight-line demand', f: 'If P = a − bQ, then MR = a − 2bQ', note: 'MR starts at the same price as demand and falls twice as fast.' },
      { name: 'Where total revenue peaks', f: 'MR = 0', note: 'That is the unit-elastic point on demand. A monopolist never produces where MR is negative.' },
      { name: 'Efficiency checks', f: 'Allocative: P = MC.  Productive: P = minimum ATC', note: 'A monopoly and a firm in monopolistic competition both charge P > MC in the long run.' },
      { name: 'Finding a Nash equilibrium', f: 'Neither player gains by switching alone', note: 'Check each cell of the payoff matrix. If a player has a dominant strategy, it is the best reply to everything the other player does.' },
    ],
  },
  {
    id: 'mi5',
    course: 'micro',
    unit: 5,
    title: 'Factor markets',
    lesson: 'factor-markets',
    items: [
      { name: 'Marginal revenue product', f: 'MRP = MP × MR', note: 'For a seller in a perfectly competitive market, MR = P, so MRP = MP × P.', ex: 'The fourth worker adds 10 units that sell for $3: MRP = $30.' },
      { name: 'Hiring rule', f: 'Hire until MRP = MFC', note: 'In a competitive labor market, MFC equals the wage. For a monopsonist, MFC is above the wage it pays.' },
      { name: 'Least-cost rule', f: 'MPL ÷ PL = MPK ÷ PK', note: 'If one side is bigger, the last dollar on that input buys more output, so use more of it.' },
      { name: 'Profit-maximizing use of inputs', f: 'MRPL = PL and MRPK = PK', note: 'Equivalently, MRP ÷ price = 1 for every input.' },
    ],
  },
  {
    id: 'mi6',
    course: 'micro',
    unit: 6,
    title: 'Market failure and the role of government',
    lesson: 'market-failure',
    items: [
      { name: 'Socially optimal quantity', f: 'MSB = MSC', note: 'MSC = MPC + marginal external cost. MSB = MPB + marginal external benefit.' },
      { name: 'Corrective tax or subsidy', f: 'Per-unit tax = marginal external cost', note: 'For a positive externality, the per-unit subsidy equals the marginal external benefit.' },
      { name: 'Gini coefficient', f: 'Gini = A ÷ (A + B)', note: 'A is the area between the line of equality and the Lorenz curve. B is the area under the Lorenz curve. 0 is perfect equality.' },
      { name: 'Average and marginal tax rates', f: 'Average = total tax ÷ income.  Marginal = tax on the next dollar', ex: '10% on the first $40,000 and 20% above it: on $100,000 the tax is $16,000, an average rate of 16%.' },
    ],
  },
  {
    id: 'ma2',
    course: 'macro',
    unit: 2,
    title: 'Economic indicators and the business cycle',
    lesson: 'economic-indicators',
    items: [
      { name: 'GDP by spending', f: 'GDP = C + I + G + (X − M)', note: 'Count only final goods and services made in the country this year.' },
      { name: 'Unemployment rate', f: 'Unemployed ÷ labor force × 100', note: 'Labor force = employed + unemployed. Discouraged workers are not in it.', ex: '800 employed and 200 unemployed: 200 ÷ 1,000 = 20%.' },
      { name: 'Labor force participation rate', f: 'Labor force ÷ adult population × 100' },
      { name: 'Natural rate of unemployment', f: 'Frictional + structural', note: 'The rate when cyclical unemployment is zero, at potential output.' },
      { name: 'Price index', f: 'Cost of the basket this year ÷ cost in the base year × 100', ex: 'A basket that cost $400 in the base year and $440 now gives an index of 110.' },
      { name: 'Inflation rate', f: '(index now − index before) ÷ index before × 100', ex: 'From 150 to 156 is 6 ÷ 150 = 4%.' },
      { name: 'GDP deflator and real GDP', f: 'Deflator = nominal GDP ÷ real GDP × 100.  Real GDP = nominal ÷ deflator × 100', ex: 'Nominal GDP $12 trillion with a deflator of 120: real GDP is $10 trillion.' },
      { name: 'Moving dollars between years', f: 'Value in year B = value in year A × (index B ÷ index A)', ex: '$5,000 when the index was 40 is worth $40,000 when the index is 320.' },
      { name: 'Real change, quick version', f: '% real change ≈ % nominal change − inflation rate', ex: 'Wages up 3% with 5% inflation: real wages fall about 2%.' },
    ],
  },
  {
    id: 'ma3',
    course: 'macro',
    unit: 3,
    title: 'National income and price determination',
    lesson: 'national-income',
    items: [
      { name: 'Propensities', f: 'MPC + MPS = 1' },
      { name: 'Spending multiplier', f: '1 ÷ MPS = 1 ÷ (1 − MPC)', ex: 'MPC 0.8 gives a multiplier of 5.' },
      { name: 'Tax multiplier', f: '−MPC ÷ MPS', note: 'Always one smaller in size than the spending multiplier.', ex: 'MPC 0.8 gives −4.' },
      { name: 'Balanced budget multiplier', f: '1', note: 'Raising spending and taxes by the same amount raises GDP by that amount.' },
      { name: 'Change in real GDP', f: 'ΔGDP = multiplier × initial change', ex: 'MPC 0.9 and a $20 billion tax cut: tax multiplier −9, so GDP can rise up to $180 billion.' },
      { name: 'Closing an output gap', f: 'Change needed = gap ÷ multiplier', ex: 'A $200 billion recessionary gap with MPC 0.75: raise spending by $50 billion, or cut taxes by about $66.7 billion.' },
    ],
  },
  {
    id: 'ma4',
    course: 'macro',
    unit: 4,
    title: 'The financial sector',
    lesson: 'financial-sector',
    items: [
      { name: 'Real interest rate', f: 'Real = nominal − inflation', note: 'Use expected inflation when a loan is made and actual inflation to see what was earned.', ex: 'A 6% loan with 7% actual inflation earned a real rate of −1%.' },
      { name: 'Money multiplier', f: '1 ÷ reserve requirement', ex: 'A 10% requirement gives a multiplier of 10.' },
      { name: 'Required and excess reserves', f: 'Required = deposits × requirement.  Excess = total reserves − required' },
      { name: 'What one bank can lend', f: 'New loans ≤ its excess reserves', ex: '$1,000 deposit with a 20% requirement: the bank can lend $800.' },
      { name: 'What the whole banking system can add', f: 'Maximum new money = excess reserves × money multiplier', note: 'A cash deposit does not add to M1 at first, because the cash was already counted. A Fed purchase of bonds from the public also adds the new deposit itself.' },
      { name: 'Bonds and interest rates', f: 'Bond prices and interest rates move in opposite directions' },
    ],
  },
  {
    id: 'ma5',
    course: 'macro',
    unit: 5,
    title: 'Long-run consequences of stabilization policies',
    lesson: 'stabilization-policy',
    items: [
      { name: 'Quantity theory of money', f: 'MV = PY', note: 'In growth rates: %ΔM + %ΔV ≈ %ΔP + %ΔY.', ex: 'Money grows 6%, velocity is steady, output grows 2%: inflation is about 4%.' },
      { name: 'Rule of 70', f: 'Years to double ≈ 70 ÷ growth rate', ex: '2% growth doubles real GDP per capita in about 35 years.' },
      { name: 'Growth per person', f: 'Growth in real GDP per capita ≈ real GDP growth − population growth' },
      { name: 'Deficit and debt', f: 'Deficit = spending − tax revenue.  Debt now = debt last year + this year’s deficit', note: 'A surplus is subtracted from the debt.' },
    ],
  },
  {
    id: 'ma6',
    course: 'macro',
    unit: 6,
    title: 'Open economy: international trade and finance',
    lesson: 'open-economy',
    items: [
      { name: 'Balance of payments', f: 'Current account + capital account + financial account = 0', note: 'A current account deficit is matched by a financial account surplus.' },
      { name: 'Net exports', f: 'NX = exports − imports' },
      { name: 'Flipping an exchange rate', f: 'If $1 = 20 pesos, then 1 peso = 1 ÷ 20 = $0.05' },
      { name: 'Converting a price', f: 'Price in dollars = price in euros × dollars per euro', ex: 'At $1.25 per euro, a €40 book costs $50.' },
      { name: 'Appreciation', f: 'A currency appreciates when it buys more of another currency', note: 'Its exports get more expensive abroad and its imports get cheaper, so net exports fall.' },
    ],
  },
];
