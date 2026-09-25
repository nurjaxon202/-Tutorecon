// Free-response practice in the AP format: one long question worth 10 points
// or a short question worth 5. Every scoring bullet is worth one point, written
// the way a reader would apply it. These are original questions, not copies of
// released exams.
import type { QTable } from './questions';
import type { CourseId } from './ced';

export interface FrqPart {
  label: string;
  text: string;
  /** One entry per point, describing exactly what earns it. */
  points: string[];
}

export interface Frq {
  id: string;
  course: CourseId;
  kind: 'long' | 'short';
  title: string;
  /** Course unit numbers this question draws on. */
  units: number[];
  topics: string[];
  stem: string;
  table?: QTable;
  parts: FrqPart[];
  /** Graph lab models worth practicing for this question. */
  graphs?: string[];
}

export const frqs: Frq[] = [
  /* AP Microeconomics */
  {
    id: 'mi-long-corn',
    course: 'micro',
    kind: 'long',
    title: 'A corn farm in a perfectly competitive market',
    units: [3],
    topics: ['mi3.2', 'mi3.5', 'mi3.6', 'mi3.7', 'mi6.4'],
    stem: 'The market for corn is perfectly competitive and in long-run equilibrium. All corn farms have identical costs, and the industry is a constant-cost industry.',
    parts: [
      {
        label: '(a)',
        text: 'Draw correctly labeled side-by-side graphs for the corn market and for a typical corn farm. On the market graph, label the equilibrium price PM and quantity QM. On the farm graph, show the farm’s demand curve and label its profit-maximizing quantity QF.',
        points: [
          'A correctly labeled market graph (price and quantity axes, downward-sloping demand, upward-sloping supply) with PM and QM marked at the intersection.',
          'A correctly labeled farm graph with a horizontal demand curve (also MR) at PM, and QF where MR = MC at the minimum of ATC.',
        ],
      },
      {
        label: '(b)',
        text: 'Is the farm earning positive, negative, or zero economic profit? Explain.',
        points: ['Zero economic profit, because free entry and exit have pushed price to the minimum of ATC (P = ATC).'],
      },
      {
        label: '(c)',
        text: 'A new study shows that corn-based fuel cuts emissions, and the demand for corn increases. (i) On your graphs, show the new market price P2 and the farm’s new quantity Q2. (ii) In the short run, will the farm earn positive, negative, or zero economic profit?',
        points: [
          'Market demand shifts right, and P2 is above PM.',
          'The farm’s horizontal demand (MR) shifts up to P2, and Q2 is greater than QF where P2 = MC.',
          'Positive economic profit, because P2 is above ATC at Q2.',
        ],
      },
      {
        label: '(d)',
        text: 'In the long run, after the change in part (c): (i) What happens to the number of corn farms? Explain. (ii) Compared with PM, is the new long-run market price higher, lower, or the same?',
        points: [
          'The number of farms increases, because positive economic profit attracts entry.',
          'The same as PM, because in a constant-cost industry entry continues until price returns to minimum ATC.',
        ],
      },
      {
        label: '(e)',
        text: 'Go back to the original long-run equilibrium. The government places a lump-sum tax on each farm. In the short run, what happens to the farm’s output? Explain.',
        points: ['Output does not change.', 'A lump-sum tax is a fixed cost, so it does not change marginal cost, and the MR = MC quantity stays the same.'],
      },
    ],
    graphs: ['firm'],
  },
  {
    id: 'mi-long-pharma',
    course: 'micro',
    kind: 'long',
    title: 'A monopoly on a patented drug',
    units: [4, 6],
    topics: ['mi4.2', 'mi4.3', 'mi6.1', 'mi6.4', 'mi2.3'],
    stem: 'PharmaCo holds a patent and is the only seller of a new allergy drug. It maximizes profit and is earning positive economic profit.',
    parts: [
      {
        label: '(a)',
        text: 'Draw a correctly labeled graph for PharmaCo showing demand, marginal revenue, marginal cost, and average total cost. Label the profit-maximizing quantity QM and price PM.',
        points: [
          'A correctly labeled graph with downward-sloping demand, MR below demand, and QM where MR = MC.',
          'PM found on the demand curve directly above QM.',
        ],
      },
      { label: '(b)', text: 'Shade the area of economic profit.', points: ['The rectangle between PM and ATC at QM, with a width of QM.'] },
      { label: '(c)', text: 'Label the allocatively efficient quantity QE.', points: ['QE where MC crosses the demand curve, to the right of QM.'] },
      { label: '(d)', text: 'Shade the area of deadweight loss.', points: ['The triangle between the demand curve and MC, from QM to QE.'] },
      {
        label: '(e)',
        text: 'At QM, is the demand for the drug elastic, inelastic, or unit elastic? Explain.',
        points: ['Elastic.', 'MR equals MC at QM and MC is positive, so MR is positive, which happens only on the elastic part of a straight-line demand curve.'],
      },
      {
        label: '(f)',
        text: 'Suppose PharmaCo could practice perfect price discrimination. (i) Compared with QM, would output be greater, smaller, or the same? (ii) What would happen to consumer surplus?',
        points: ['Greater, rising to QE.', 'Consumer surplus falls to zero, because each buyer pays their maximum willingness to pay.'],
      },
      {
        label: '(g)',
        text: 'Instead, the government places a per-unit tax on each dose PharmaCo sells. Will the price of the drug rise, fall, or stay the same?',
        points: ['Rise, because the tax raises marginal cost, so MR = MC at a smaller quantity with a higher price on the demand curve.'],
      },
    ],
    graphs: ['monopoly'],
  },
  {
    id: 'mi-long-gas-tax',
    course: 'micro',
    kind: 'long',
    title: 'A tax on gasoline',
    units: [2],
    topics: ['mi2.3', 'mi2.6', 'mi2.8'],
    stem: 'The market for gasoline is perfectly competitive, with a downward-sloping demand curve and an upward-sloping supply curve.',
    parts: [
      { label: '(a)', text: 'Draw a correctly labeled graph of the gasoline market. Label the equilibrium price P1 and quantity Q1.', points: ['A correctly labeled graph with P1 and Q1 at the intersection of supply and demand.'] },
      {
        label: '(b)',
        text: 'The government places a per-unit tax on sellers of gasoline. On your graph, show the price buyers pay (PB), the price sellers keep (PS), and the new quantity Q2.',
        points: [
          'Supply shifts up (to the left) by the amount of the tax, and Q2 is less than Q1.',
          'PB is above P1 and PS is below P1, with the gap between them equal to the tax.',
        ],
      },
      { label: '(c)', text: 'Shade the area of tax revenue.', points: ['The rectangle with height PB − PS and width Q2.'] },
      { label: '(d)', text: 'Shade the area of deadweight loss.', points: ['The triangle between supply and demand from Q2 to Q1.'] },
      {
        label: '(e)',
        text: 'In the short run, the demand for gasoline is more inelastic than the supply. Do buyers or sellers bear more of the tax? Explain.',
        points: ['Buyers.', 'The less elastic side of the market cannot easily reduce the quantity it trades, so it bears a larger share of the tax.'],
      },
      { label: '(f)', text: 'What happens to consumer surplus as a result of the tax?', points: ['Consumer surplus decreases.'] },
      { label: '(g)', text: 'The tax is $0.50 per gallon, and Q2 is 8 million gallons. Calculate the government’s tax revenue. Show your work.', points: ['$4 million ($0.50 × 8 million gallons).'] },
      {
        label: '(h)',
        text: 'Instead of a tax, the government sets a binding price ceiling on gasoline. Compared with Q1, will the quantity of gasoline bought and sold increase, decrease, or stay the same?',
        points: ['Decrease, because at a price below equilibrium sellers supply less, and the quantity traded is limited to the quantity supplied.'],
      },
    ],
    graphs: ['tax-incidence', 'ceiling-rent'],
  },
  {
    id: 'mi-long-externality',
    course: 'micro',
    kind: 'long',
    title: 'Pollution, vaccines, public goods, and taxes',
    units: [6],
    topics: ['mi6.1', 'mi6.2', 'mi6.3', 'mi6.5'],
    stem: 'A paper mill produces paper in a perfectly competitive market. Its production releases chemicals into a river, harming people downstream.',
    parts: [
      {
        label: '(a)',
        text: 'Draw a correctly labeled graph of the paper market showing demand (equal to marginal social benefit), marginal private cost (the supply curve), and marginal social cost. Label the market quantity QM and the socially optimal quantity QS.',
        points: [
          'A correctly labeled graph with MSC above MPC.',
          'QM where MPC crosses demand, and QS where MSC crosses demand, with QS less than QM.',
        ],
      },
      { label: '(b)', text: 'Shade the area of deadweight loss that results from the market outcome.', points: ['The triangle between MSC and demand from QS to QM.'] },
      {
        label: '(c)',
        text: 'The government wants the market to produce QS. (i) Identify the per-unit tax that would achieve this. (ii) Will the price paid by buyers rise or fall?',
        points: ['A per-unit tax equal to the marginal external cost at QS (the vertical gap between MSC and MPC).', 'Rise.'],
      },
      {
        label: '(d)',
        text: 'Flu vaccines create benefits for people who are not vaccinated. (i) Without government action, is the market quantity of vaccines greater than, less than, or equal to the socially optimal quantity? (ii) Identify a policy that would move the market to the socially optimal quantity.',
        points: ['Less than.', 'A per-unit subsidy equal to the marginal external benefit (to buyers or to sellers).'],
      },
      { label: '(e)', text: 'A town holds a fireworks show that anyone nearby can watch. Explain why a private firm would be unlikely to provide it.', points: ['The show is non-excludable, so people can watch without paying (the free-rider problem), and a firm could not collect enough revenue to cover its cost.'] },
      { label: '(f)', text: 'Is an uncrowded toll road rival or non-rival? Is it excludable or non-excludable?', points: ['Non-rival and excludable (a club good). Both parts must be correct for the point.'] },
      { label: '(g)', text: 'A tax takes $2,000 from a household earning $20,000 and $5,000 from a household earning $100,000. Is the tax progressive, proportional, or regressive?', points: ['Regressive, because it takes 10% of the lower income and only 5% of the higher income.'] },
    ],
    graphs: ['externality-negative', 'externality-positive'],
  },
  {
    id: 'mi-short-trade',
    course: 'micro',
    kind: 'short',
    title: 'Comparative advantage between two countries',
    units: [1],
    topics: ['mi1.3', 'mi1.4'],
    stem: 'The table shows how much one worker in each country can produce in a day. Assume constant opportunity costs.',
    table: { head: ['Output per worker per day', 'Tomatoes', 'Wheat'], rows: [['Country A', 20, 10], ['Country B', 15, 5]] },
    parts: [
      { label: '(a)', text: 'Which country has an absolute advantage in producing wheat?', points: ['Country A, because one worker produces 10 units of wheat compared with 5.'] },
      { label: '(b)', text: 'What is Country B’s opportunity cost of producing one unit of wheat?', points: ['3 tomatoes (15 ÷ 5).'] },
      {
        label: '(c)',
        text: 'Which country has a comparative advantage in producing tomatoes? Explain using opportunity cost.',
        points: ['Country B.', 'A tomato costs Country B 1/3 unit of wheat and costs Country A 1/2 unit of wheat, so B gives up less.'],
      },
      { label: '(d)', text: 'Would a trade of 1 unit of wheat for 2.5 tomatoes benefit both countries? Explain.', points: ['Yes, because 2.5 tomatoes per unit of wheat is between Country A’s opportunity cost (2 tomatoes) and Country B’s (3 tomatoes).'] },
    ],
    graphs: ['ppc'],
  },
  {
    id: 'mi-short-utility',
    course: 'micro',
    kind: 'short',
    title: 'Spending a budget on apps and songs',
    units: [1],
    topics: ['mi1.6'],
    stem: 'Jamal has $9 to spend on apps, which cost $2 each, and songs, which cost $1 each. The table shows his marginal utility from each unit.',
    table: { head: ['Unit', 'MU of apps ($2 each)', 'MU of songs ($1 each)'], rows: [['1st', 20, 12], ['2nd', 16, 8], ['3rd', 12, 6], ['4th', 8, 4], ['5th', 4, 2]] },
    parts: [
      { label: '(a)', text: 'Calculate the marginal utility per dollar of the second app.', points: ['8 (16 ÷ $2).'] },
      {
        label: '(b)',
        text: 'How many apps and how many songs should Jamal buy to maximize his utility? Explain using the utility-maximizing rule.',
        points: ['3 apps and 3 songs.', 'The whole $9 budget is spent, and the marginal utility per dollar of the last app (12 ÷ 2 = 6) equals that of the last song (6 ÷ 1 = 6).'],
      },
      { label: '(c)', text: 'Does the table show diminishing marginal utility? Explain.', points: ['Yes, because each additional app and each additional song adds less utility than the one before.'] },
      { label: '(d)', text: 'The price of songs rises to $2. Will Jamal buy more, fewer, or the same number of songs?', points: ['Fewer, because the marginal utility per dollar of each song falls by half.'] },
    ],
  },
  {
    id: 'mi-short-elasticity',
    course: 'micro',
    kind: 'short',
    title: 'Elasticity of concert tickets',
    units: [2],
    topics: ['mi2.3', 'mi2.5'],
    stem: 'A concert venue raises its ticket price from $40 to $60. The number of tickets sold falls from 1,000 to 800.',
    parts: [
      {
        label: '(a)',
        text: 'Using the midpoint method, calculate the price elasticity of demand. Is demand elastic, inelastic, or unit elastic?',
        points: ['About 0.56: quantity changes by 200 ÷ 900 ≈ 22.2% and price by 20 ÷ 50 = 40%.', 'Inelastic, because the value is less than 1.'],
      },
      {
        label: '(b)',
        text: 'Does the venue’s total revenue increase or decrease? Explain.',
        points: ['Increase, from $40,000 to $48,000.', 'Demand is inelastic, so the percentage fall in quantity is smaller than the percentage rise in price.'],
      },
      { label: '(c)', text: 'Incomes in the city rise by 5%, and the quantity of tickets demanded at each price rises by 10%. Are concert tickets a normal good or an inferior good?', points: ['A normal good, because the income elasticity (10% ÷ 5% = 2) is positive.'] },
    ],
  },
  {
    id: 'mi-short-costs',
    course: 'micro',
    kind: 'short',
    title: 'Reading a cost table',
    units: [3],
    topics: ['mi3.2', 'mi3.5', 'mi3.7'],
    stem: 'The table shows the total cost of a firm in a perfectly competitive market.',
    table: { head: ['Output', 'Total cost'], rows: [[0, '$50'], [1, '$80'], [2, '$100'], [3, '$130'], [4, '$180'], [5, '$250']] },
    parts: [
      { label: '(a)', text: 'What is the firm’s fixed cost?', points: ['$50, the total cost at zero output.'] },
      { label: '(b)', text: 'Calculate the marginal cost of the third unit.', points: ['$30 ($130 − $100).'] },
      { label: '(c)', text: 'Calculate average variable cost at 4 units.', points: ['$32.50: variable cost is $180 − $50 = $130, and $130 ÷ 4 = $32.50.'] },
      {
        label: '(d)',
        text: 'The market price is $60. How many units should the firm produce, and what is its profit?',
        points: ['4 units, because the fourth unit’s marginal cost ($50) is below the price and the fifth unit’s ($70) is above it.', 'Profit is $60 (revenue $240 − total cost $180).'],
      },
    ],
    graphs: ['firm'],
  },
  {
    id: 'mi-short-game',
    course: 'micro',
    kind: 'short',
    title: 'Two coffee shops choose their hours',
    units: [4],
    topics: ['mi4.5'],
    stem: 'Brew and Bean are the only coffee shops in a small town. Each chooses to open early or late. The matrix shows daily profits, with Brew’s profit listed first. Both know the matrix and choose at the same time.',
    table: { head: ['', 'Bean: early', 'Bean: late'], rows: [['Brew: early', '$400, $300', '$600, $250'], ['Brew: late', '$300, $450', '$500, $400']] },
    parts: [
      {
        label: '(a)',
        text: 'Does Brew have a dominant strategy? Explain using numbers from the matrix.',
        points: ['Yes, opening early.', 'Early pays Brew more whether Bean opens early ($400 versus $300) or late ($600 versus $500).'],
      },
      { label: '(b)', text: 'Identify the Nash equilibrium.', points: ['Both shops open early.'] },
      { label: '(c)', text: 'Would both shops earn more if both opened late? Explain.', points: ['Yes: Brew would earn $500 instead of $400 and Bean $400 instead of $300.'] },
      {
        label: '(d)',
        text: 'The town pays Bean an extra $200 a day whenever Bean opens late. Does Bean now have a dominant strategy? If so, identify it.',
        points: ['Yes, opening late: it now pays Bean $450 versus $300 if Brew opens early, and $600 versus $450 if Brew opens late.'],
      },
    ],
  },
  {
    id: 'mi-short-hiring',
    course: 'micro',
    kind: 'short',
    title: 'How many workers to hire',
    units: [5],
    topics: ['mi5.2', 'mi5.3'],
    stem: 'A firm sells its product in a perfectly competitive market for $5 a unit and hires workers in a perfectly competitive labor market at a wage of $35 a day.',
    table: { head: ['Workers', 'Total output'], rows: [[0, 0], [1, 12], [2, 22], [3, 30], [4, 36], [5, 40]] },
    parts: [
      { label: '(a)', text: 'Calculate the marginal revenue product of the third worker.', points: ['$40: marginal product is 8 units, and 8 × $5 = $40.'] },
      {
        label: '(b)',
        text: 'How many workers will the firm hire? Explain.',
        points: ['3 workers.', 'The third worker’s MRP ($40) is above the $35 wage, but the fourth worker’s MRP ($30) is below it.'],
      },
      { label: '(c)', text: 'The price of the firm’s product rises to $6. What happens to the firm’s demand for labor?', points: ['It increases, because each worker’s MRP rises.'] },
      { label: '(d)', text: 'Instead, the market supply of labor increases. What happens to the number of workers this firm hires?', points: ['It increases, because the market wage falls.'] },
    ],
  },
  {
    id: 'mi-short-monopsony',
    course: 'micro',
    kind: 'short',
    title: 'A town with one big employer',
    units: [5],
    topics: ['mi5.4', 'mi2.8'],
    stem: 'A mining company is the only employer in a remote town, so it is a monopsony in the labor market.',
    parts: [
      {
        label: '(a)',
        text: 'Draw a correctly labeled graph of the labor market showing the labor supply curve, the marginal factor cost curve, and the marginal revenue product curve. Label the quantity of workers hired QM and the wage WM.',
        points: ['A correctly labeled graph with MFC above labor supply and QM where MRP = MFC.', 'WM read from the labor supply curve at QM, below the point where MRP = MFC.'],
      },
      { label: '(b)', text: 'Compared with a perfectly competitive labor market, are the wage and the number of workers higher or lower?', points: ['Both are lower.'] },
      { label: '(c)', text: 'A minimum wage is set above WM but below the competitive wage. What happens to the number of workers hired?', points: ['It increases.'] },
      { label: '(d)', text: 'Explain why the MFC curve lies above the labor supply curve.', points: ['To hire one more worker, the firm must raise the wage for all of its workers, so the extra cost is more than the new worker’s wage.'] },
    ],
    graphs: ['monopsony'],
  },
  {
    id: 'mi-short-goods',
    course: 'micro',
    kind: 'short',
    title: 'Public goods and inequality',
    units: [6],
    topics: ['mi6.3', 'mi6.5'],
    stem: 'Answer each part about kinds of goods and the distribution of income.',
    parts: [
      { label: '(a)', text: 'Classify national defense as a private good, public good, common resource, or club good.', points: ['A public good.'] },
      { label: '(b)', text: 'Classify the fish in a lake that anyone may fish in.', points: ['A common resource.'] },
      { label: '(c)', text: 'Explain why private markets tend to underprovide public goods.', points: ['People can benefit without paying (free riders), so firms cannot earn enough to cover the cost.'] },
      { label: '(d)', text: 'Country X has a Gini coefficient of 0.25 and Country Y has 0.45. Which has the more equal distribution of income?', points: ['Country X.'] },
      { label: '(e)', text: 'Every adult pays the same $500 tax regardless of income. Is the tax progressive, proportional, or regressive?', points: ['Regressive, because $500 is a larger share of a low income than of a high income.'] },
    ],
    graphs: ['lorenz'],
  },

  /* AP Macroeconomics */
  {
    id: 'ma-long-recession',
    course: 'macro',
    kind: 'long',
    title: 'Closing a recessionary gap',
    units: [3, 4, 5],
    topics: ['ma3.5', 'ma3.7', 'ma3.8', 'ma4.4', 'ma4.5', 'ma4.6', 'ma4.7', 'ma5.2'],
    stem: 'The economy of Country Z is in a short-run equilibrium with unemployment above its natural rate. The central bank operates with limited reserves.',
    parts: [
      {
        label: '(a)',
        text: 'Draw a correctly labeled graph of aggregate demand and aggregate supply. Show the current equilibrium output Y1 and price level PL1, and full-employment output YF.',
        points: ['A correctly labeled graph with AD, SRAS, and a vertical LRAS at YF.', 'Y1 is to the left of YF, with PL1 marked at the intersection of AD and SRAS.'],
      },
      { label: '(b)', text: 'If there is no policy action, what will happen to nominal wages and SRAS in the long run?', points: ['Nominal wages fall and SRAS shifts right.'] },
      {
        label: '(c)',
        text: 'The central bank wants to close the gap. (i) Identify an open-market operation it could use. (ii) Draw a correctly labeled graph of the money market showing the effect on the nominal interest rate.',
        points: ['Buy government bonds.', 'A correctly labeled money market graph with a vertical money supply that shifts right, lowering the nominal interest rate.'],
      },
      { label: '(d)', text: 'How will the policy in part (c) affect real GDP and the price level in the short run?', points: ['Both increase.'] },
      { label: '(e)', text: 'On a short-run Phillips curve, will the economy move along the curve or will the curve shift? In which direction?', points: ['Move along the SRPC, up and to the left (lower unemployment, higher inflation).'] },
      { label: '(f)', text: 'The reserve requirement is 10%. The central bank buys $10 million of bonds from commercial banks. Calculate the maximum possible change in the money supply.', points: ['An increase of $100 million ($10 million × 10).'] },
      { label: '(g)', text: 'Instead, the government increases spending by $50 billion, and the MPC is 0.8. Calculate the maximum possible change in real GDP.', points: ['An increase of $250 billion (multiplier 1 ÷ 0.2 = 5).'] },
      { label: '(h)', text: 'If the spending in part (g) is paid for by borrowing, what happens to the real interest rate in the loanable funds market? Explain.', points: ['It rises, because government borrowing increases the demand for loanable funds.'] },
    ],
    graphs: ['adas', 'money-market', 'loanable-funds'],
  },
  {
    id: 'ma-long-open',
    course: 'macro',
    kind: 'long',
    title: 'Deficits, interest rates, and the dollar',
    units: [4, 5, 6],
    topics: ['ma4.7', 'ma5.5', 'ma5.6', 'ma6.1', 'ma6.3', 'ma6.4', 'ma6.5', 'ma6.6'],
    stem: 'The United States and Japan trade goods and financial assets. Both have flexible exchange rates. The US government increases its budget deficit and borrows to pay for it.',
    parts: [
      {
        label: '(a)',
        text: 'Draw a correctly labeled graph of the US loanable funds market and show the effect of the borrowing on the real interest rate.',
        points: ['A correctly labeled loanable funds graph with the real interest rate on the vertical axis.', 'Demand shifts right and the real interest rate rises.'],
      },
      { label: '(b)', text: 'What happens to private investment in the United States?', points: ['It decreases (crowding out).'] },
      {
        label: '(c)',
        text: 'Draw a correctly labeled graph of the foreign exchange market for US dollars, with the price in yen. Show the effect of the change in the US real interest rate on the value of the dollar.',
        points: ['A correctly labeled foreign exchange graph for dollars.', 'Demand for dollars shifts right and the dollar appreciates.'],
      },
      { label: '(d)', text: 'What happens to US exports to Japan?', points: ['They decrease, because US goods become more expensive for Japanese buyers.'] },
      { label: '(e)', text: 'What happens to the US financial account balance? Explain.', points: ['It increases (moves toward surplus), because foreign savers buy more US assets.'] },
      { label: '(f)', text: 'Given your answer to part (d), what happens to US aggregate demand?', points: ['It decreases, because net exports fall.'] },
      { label: '(g)', text: 'Given your answer to part (b), what happens to the long-run growth rate of US potential output?', points: ['It slows, because less investment means slower growth of the capital stock.'] },
      { label: '(h)', text: 'As the dollar changes value against the yen, do Japanese goods become cheaper or more expensive for American buyers?', points: ['Cheaper, because each dollar now buys more yen.'] },
    ],
    graphs: ['loanable-funds', 'forex'],
  },
  {
    id: 'ma-long-oil',
    course: 'macro',
    kind: 'long',
    title: 'An oil price shock',
    units: [3, 5],
    topics: ['ma3.3', 'ma3.6', 'ma3.7', 'ma3.8', 'ma3.2', 'ma5.2'],
    stem: 'Country R is in long-run equilibrium when a sharp, temporary increase in the price of oil hits its economy.',
    parts: [
      {
        label: '(a)',
        text: 'Draw a correctly labeled graph of aggregate demand and aggregate supply. Show the effect of the oil shock, labeling the new price level PL2 and output Y2.',
        points: ['A correctly labeled graph with AD, SRAS, and LRAS meeting at the original equilibrium.', 'SRAS shifts left, with PL2 above the original price level and Y2 below full-employment output.'],
      },
      { label: '(b)', text: 'What happens to the unemployment rate?', points: ['It increases.'] },
      {
        label: '(c)',
        text: 'Draw a correctly labeled graph of the short-run and long-run Phillips curves and show the effect of the oil shock.',
        points: ['A correctly labeled graph with a vertical LRPC at the natural rate and a downward-sloping SRPC.', 'The SRPC shifts right (up).'],
      },
      {
        label: '(d)',
        text: 'The government uses fiscal policy to return output to full employment. (i) Identify one action it could take. (ii) What happens to the price level?',
        points: ['Increase government spending, cut taxes, or raise transfer payments.', 'The price level rises further.'],
      },
      { label: '(e)', text: 'The MPC is 0.75, and the government wants to raise spending in the economy by $300 billion using a tax cut. Calculate the size of the tax cut.', points: ['$100 billion (tax multiplier 0.75 ÷ 0.25 = 3).'] },
      {
        label: '(f)',
        text: 'Suppose instead the government takes no action. In the long run, (i) what happens to nominal wages, and (ii) how does the price level compare with its level before the shock?',
        points: ['Nominal wages fall.', 'The price level returns to its original level as SRAS shifts back.'],
      },
    ],
    graphs: ['adas', 'phillips'],
  },
  {
    id: 'ma-long-banks',
    course: 'macro',
    kind: 'long',
    title: 'A bank, the money supply, and inflation',
    units: [4, 5],
    topics: ['ma4.2', 'ma4.3', 'ma4.4', 'ma4.6', 'ma5.3'],
    stem: 'First National Bank has the balance sheet shown. The reserve requirement is 10%.',
    table: { head: ['Assets', 'Liabilities'], rows: [['Reserves: $50,000', 'Checkable deposits: $200,000'], ['Loans: $120,000', ''], ['Government bonds: $30,000', '']] },
    parts: [
      { label: '(a)', text: 'Calculate the bank’s required reserves.', points: ['$20,000 (10% × $200,000).'] },
      { label: '(b)', text: 'Calculate the bank’s excess reserves.', points: ['$30,000 ($50,000 − $20,000).'] },
      { label: '(c)', text: 'What is the largest new loan this bank can make?', points: ['$30,000, its excess reserves.'] },
      { label: '(d)', text: 'If the bank lends all of its excess reserves, what is the maximum change in the money supply for the whole banking system?', points: ['An increase of $300,000 ($30,000 × 10).'] },
      { label: '(e)', text: 'A customer withdraws $5,000 in cash from a checking account. What happens to M1 at that moment?', points: ['No change, because currency rises by $5,000 and checkable deposits fall by $5,000.'] },
      {
        label: '(f)',
        text: 'In an ample-reserves system, the Fed raises the interest rate it pays on reserve balances. (i) What happens to the federal funds rate? (ii) What happens to aggregate demand?',
        points: ['It increases.', 'Aggregate demand decreases, because higher interest rates reduce borrowing and spending.'],
      },
      { label: '(g)', text: 'Velocity is constant, the money supply grows 7% a year, and real GDP grows 3% a year. Using the quantity theory of money, calculate the inflation rate.', points: ['4% (7% − 3%).'] },
      {
        label: '(h)',
        text: 'A loan has a nominal interest rate of 6%, and expected inflation is 4%. (i) Calculate the expected real interest rate. (ii) If actual inflation turns out to be 6%, does the borrower or the lender gain?',
        points: ['2% (6% − 4%).', 'The borrower gains, because the real interest rate turns out to be 0% instead of 2%.'],
      },
    ],
    graphs: ['money-market'],
  },
  {
    id: 'ma-short-ppc',
    course: 'macro',
    kind: 'short',
    title: 'Trade-offs and a car market',
    units: [1],
    topics: ['ma1.2', 'ma1.5', 'ma1.6'],
    stem: 'An economy produces capital goods and consumer goods.',
    parts: [
      { label: '(a)', text: 'Draw a correctly labeled production possibilities curve with increasing opportunity costs. Label an efficient point A.', points: ['A correctly labeled PPC bowed out from the origin, with point A on the curve.'] },
      { label: '(b)', text: 'Point B lies inside the curve. Identify one cause of producing at point B.', points: ['Unemployment or idle resources, as in a recession.'] },
      { label: '(c)', text: 'A new technology improves production of both goods. Show the effect on your graph.', points: ['The PPC shifts outward.'] },
      {
        label: '(d)',
        text: 'In the market for cars, the price of steel rises. What happens to the equilibrium price and quantity of cars?',
        points: ['Price rises.', 'Quantity falls.'],
      },
    ],
    graphs: ['ppc', 'market-oj'],
  },
  {
    id: 'ma-short-indicators',
    course: 'macro',
    kind: 'short',
    title: 'Measuring an economy',
    units: [2],
    topics: ['ma2.1', 'ma2.3', 'ma2.4', 'ma2.6'],
    stem: 'The table shows data for Country Q (in billions of dollars).',
    table: { head: ['Item', 'Amount'], rows: [['Consumption', '$800'], ['Gross private investment', '$250'], ['Government purchases', '$300'], ['Exports', '$120'], ['Imports', '$170'], ['Transfer payments', '$90']] },
    parts: [
      { label: '(a)', text: 'Calculate GDP.', points: ['$1,300 billion: 800 + 250 + 300 + (120 − 170). Transfer payments are not included.'] },
      { label: '(b)', text: 'Country Q has 190 million employed people and 10 million unemployed people. Calculate the unemployment rate.', points: ['5% (10 ÷ 200).'] },
      {
        label: '(c)',
        text: 'A market basket cost $250 in the base year and costs $265 this year. Calculate this year’s consumer price index and the inflation rate since the base year.',
        points: ['CPI = 106 (265 ÷ 250 × 100).', 'Inflation since the base year is 6%.'],
      },
      { label: '(d)', text: 'Nominal GDP is $1,300 billion and the GDP deflator is 130. Calculate real GDP.', points: ['$1,000 billion (1,300 ÷ 130 × 100).'] },
    ],
  },
  {
    id: 'ma-short-multiplier',
    course: 'macro',
    kind: 'short',
    title: 'Sizing a fiscal stimulus',
    units: [3],
    topics: ['ma3.2', 'ma3.8', 'ma3.9'],
    stem: 'An economy has a recessionary gap of $500 billion. The marginal propensity to consume is 0.9.',
    parts: [
      { label: '(a)', text: 'Calculate the spending multiplier.', points: ['10 (1 ÷ 0.1).'] },
      { label: '(b)', text: 'By how much should government spending increase to close the gap?', points: ['$50 billion ($500 billion ÷ 10).'] },
      { label: '(c)', text: 'If the government uses only a tax cut, how large should it be?', points: ['About $55.6 billion (tax multiplier 0.9 ÷ 0.1 = 9, and $500 billion ÷ 9).'] },
      { label: '(d)', text: 'Explain why the tax cut in part (c) must be larger than the spending increase in part (b).', points: ['Households save part of a tax cut before spending, so the first round of spending is smaller.'] },
      { label: '(e)', text: 'Identify one automatic stabilizer that would already be helping during this recession.', points: ['Unemployment insurance, a progressive income tax, or another program that changes automatically with income.'] },
    ],
    graphs: ['adas'],
  },
  {
    id: 'ma-short-loanable',
    course: 'macro',
    kind: 'short',
    title: 'Saving, bonds, and growth',
    units: [4, 5],
    topics: ['ma4.1', 'ma4.2', 'ma4.7', 'ma5.6'],
    stem: 'Households in Country S decide to save a larger share of their income.',
    parts: [
      {
        label: '(a)',
        text: 'Draw a correctly labeled graph of the loanable funds market and show the effect on the real interest rate.',
        points: ['A correctly labeled loanable funds graph with the real interest rate on the vertical axis.', 'Supply shifts right and the real interest rate falls.'],
      },
      { label: '(b)', text: 'What happens to the price of bonds that were already issued?', points: ['It rises, because their fixed payments are now more attractive than new bonds.'] },
      { label: '(c)', text: 'What happens to the long-run growth rate of the economy? Explain.', points: ['It increases, because lower interest rates raise investment in physical capital.'] },
      { label: '(d)', text: 'The real interest rate is 2% and expected inflation is 3%. Calculate the nominal interest rate.', points: ['5% (2% + 3%).'] },
    ],
    graphs: ['loanable-funds'],
  },
  {
    id: 'ma-short-money',
    course: 'macro',
    kind: 'short',
    title: 'Fighting inflation with monetary policy',
    units: [4, 6],
    topics: ['ma4.5', 'ma4.6', 'ma6.4'],
    stem: 'Inflation in Country M is well above the central bank’s target. The central bank operates with limited reserves.',
    parts: [
      { label: '(a)', text: 'Draw a correctly labeled graph of the money market. Label the current nominal interest rate i1.', points: ['A correctly labeled graph with a vertical money supply, downward-sloping money demand, and i1 at their intersection.'] },
      { label: '(b)', text: 'The central bank sells government bonds. Show the effect on your graph.', points: ['Money supply shifts left and the nominal interest rate rises above i1.'] },
      { label: '(c)', text: 'What happens to investment spending and aggregate demand?', points: ['Both decrease.'] },
      { label: '(d)', text: 'If the central bank operated with ample reserves instead, identify the tool it would use to achieve the same goal.', points: ['Raise the interest rate it pays on reserve balances.'] },
      { label: '(e)', text: 'What happens to the international value of Country M’s currency? Explain.', points: ['It appreciates, because higher interest rates attract foreign financial capital.'] },
    ],
    graphs: ['money-market', 'forex'],
  },
  {
    id: 'ma-short-phillips',
    course: 'macro',
    kind: 'short',
    title: 'Inflation and unemployment',
    units: [5],
    topics: ['ma5.2'],
    stem: 'An economy has a natural rate of unemployment of 5% and is in long-run equilibrium with 2% inflation.',
    parts: [
      { label: '(a)', text: 'Draw a correctly labeled graph showing the short-run and long-run Phillips curves. Label the current point A.', points: ['A correctly labeled graph with a vertical LRPC at 5% and point A where the SRPC crosses the LRPC at 2% inflation.'] },
      { label: '(b)', text: 'Aggregate demand increases. Label the new short-run point B.', points: ['Point B is up and to the left of A on the same SRPC.'] },
      { label: '(c)', text: 'People come to expect higher inflation. Show the effect on your graph.', points: ['The SRPC shifts right (up).'] },
      { label: '(d)', text: 'In the long run, what is the unemployment rate?', points: ['5%, the natural rate.'] },
      { label: '(e)', text: 'Job training programs lower the natural rate of unemployment. What happens to the LRPC?', points: ['It shifts left.'] },
    ],
    graphs: ['phillips'],
  },
  {
    id: 'ma-short-debt',
    course: 'macro',
    kind: 'short',
    title: 'Deficits, crowding out, and growth',
    units: [5],
    topics: ['ma5.4', 'ma5.5', 'ma5.6'],
    stem: 'The government of Country D runs large budget deficits for several years and borrows to pay for them.',
    parts: [
      { label: '(a)', text: 'Explain the difference between a budget deficit and the national debt.', points: ['A deficit is the shortfall of revenue below spending in one year. The debt is the total of past deficits minus past surpluses.'] },
      { label: '(b)', text: 'What happens to the real interest rate?', points: ['It rises.'] },
      { label: '(c)', text: 'What happens to private investment?', points: ['It decreases.'] },
      { label: '(d)', text: 'What happens to the country’s long-run economic growth? Explain.', points: ['It slows, because lower investment means a smaller capital stock in the future.'] },
      { label: '(e)', text: 'Real GDP per capita grows 2.5% a year. About how many years will it take to double?', points: ['28 years (70 ÷ 2.5).'] },
    ],
    graphs: ['loanable-funds'],
  },
  {
    id: 'ma-short-forex',
    course: 'macro',
    kind: 'short',
    title: 'The balance of payments and the euro',
    units: [6],
    topics: ['ma6.1', 'ma6.2', 'ma6.3'],
    stem: 'Answer each part about the United States and the euro area.',
    parts: [
      { label: '(a)', text: 'A US company builds a factory in Canada. In which US account is this recorded, and is it an inflow or an outflow?', points: ['The financial account, as an outflow.'] },
      { label: '(b)', text: 'A tourist from Japan pays for a hotel in Hawaii. In which US account is this recorded?', points: ['The current account (an export of services).'] },
      {
        label: '(c)',
        text: 'US consumers buy much more European wine. Draw a correctly labeled graph of the foreign exchange market for euros, priced in dollars, and show the effect on the value of the euro.',
        points: ['A correctly labeled foreign exchange graph for euros.', 'Demand for euros shifts right and the euro appreciates.'],
      },
      { label: '(d)', text: 'What happens to the value of the dollar relative to the euro?', points: ['The dollar depreciates.'] },
    ],
    graphs: ['forex'],
  },
];

export const frqPoints = (f: Frq) => f.parts.reduce((n, p) => n + p.points.length, 0);

// Checked on every build: long questions are worth 10 points and short ones 5.
for (const f of frqs) {
  const pts = frqPoints(f);
  if (pts !== (f.kind === 'long' ? 10 : 5)) throw new Error(`FRQ ${f.id} is worth ${pts} points`);
}
export const getFrq = (id: string) => frqs.find((f) => f.id === id);
