// One-page review sheets for Pro. Short, exam-focused, printable.

export interface Sheet {
  points: string[];
  formulas?: string[];
  graphs: string[];
  traps: string[];
}

export const review: Record<string, Sheet> = {
  foundations: {
    points: [
      'Scarcity means every choice has an opportunity cost: the value of the single next best alternative.',
      'Points on the PPC are efficient, points inside are inefficient (idle resources), points outside are unattainable.',
      'A bowed-out PPC shows increasing opportunity cost; a straight PPC shows constant opportunity cost.',
      'More resources or better technology shift the PPC outward. A recession does not shift it.',
      'Specialize by comparative advantage (lower opportunity cost), not absolute advantage.',
      'Keep doing something while marginal benefit is at least marginal cost. Ignore sunk costs.',
    ],
    formulas: ['Output table: opportunity cost of A = output of B ÷ output of A', 'Input table: opportunity cost of A = input for A ÷ input for B'],
    graphs: ['PPC with efficient, inefficient, and unattainable points', 'Outward shift of the PPC'],
    traps: ['Adding up every alternative instead of taking the next best one', 'Confusing absolute and comparative advantage', 'Terms of trade that are not between the two opportunity costs'],
  },
  'supply-and-demand': {
    points: [
      'Own-price change: movement along the curve. Anything else: shift of the curve.',
      'Demand shifters: tastes, related goods, income, number of buyers, expectations.',
      'Supply shifters: input costs, technology, taxes and subsidies, other goods, expectations, number of sellers.',
      'When both curves shift, one of price or quantity is indeterminate.',
      'Elastic demand: a price increase lowers total revenue. Inelastic: a price increase raises it.',
      'A binding ceiling (below equilibrium) causes a shortage; a binding floor (above) causes a surplus. Both create deadweight loss.',
      'The less elastic side of the market bears more of a tax.',
    ],
    formulas: ['Price elasticity = |%ΔQd ÷ %ΔP|', 'Midpoint %Δ = change ÷ average of start and end', 'Tax revenue = tax × quantity after tax', 'Deadweight loss = ½ × base × height'],
    graphs: ['Demand or supply shift with new equilibrium labeled', 'Consumer and producer surplus', 'Binding price ceiling and floor', 'Per-unit tax with revenue and deadweight loss'],
    traps: ['"Price rose so demand fell"', 'Putting a ceiling above equilibrium and calling it binding', 'Assuming whoever pays the tax to the government bears it'],
  },
  'production-and-cost': {
    points: [
      'Diminishing marginal returns: in the short run, each extra worker eventually adds less output.',
      'MC crosses AVC and ATC at their minimum points.',
      'Economic profit subtracts implicit costs; zero economic profit is normal profit.',
      'Every firm maximizes profit where MR = MC.',
      'Competitive firm: P = MR = D (horizontal). Profit if P > ATC, loss if P < ATC.',
      'Shut down in the short run if P < minimum AVC.',
      'Long run in perfect competition: P = MC = minimum ATC, zero economic profit.',
    ],
    formulas: ['ATC = AFC + AVC', 'MC = ΔTC ÷ ΔQ', 'Profit = (P − ATC) × Q', 'Economic profit = revenue − explicit − implicit costs'],
    graphs: ['Side-by-side market and firm graphs', 'Firm with profit or loss rectangle', 'Long-run equilibrium at minimum ATC'],
    traps: ['Reading the firm’s price from ATC instead of MR = MC', 'Shutting down whenever there is a loss', 'Mixing up productive (P = min ATC) and allocative (P = MC) efficiency'],
  },
  'imperfect-competition': {
    points: [
      'Monopoly: one seller, barriers to entry, downward-sloping demand, MR below demand.',
      'Monopolist sets Q where MR = MC, then reads price off demand.',
      'Monopoly produces less, charges more, and creates deadweight loss. It operates on the elastic part of demand.',
      'Perfect price discrimination: MR = D, efficient quantity, no DWL, zero consumer surplus.',
      'Monopolistic competition: long-run zero profit with demand tangent to ATC and excess capacity.',
      'Oligopoly: interdependence. Dominant strategy is best whatever the rival does. Nash equilibrium: no one wants to change alone.',
    ],
    formulas: ['Linear demand P = a − bQ gives MR = a − 2bQ', 'Fair-return price: P = ATC', 'Socially optimal price: P = MC'],
    graphs: ['Monopoly with profit and deadweight loss', 'Monopolistic competition in the long run', 'Regulated natural monopoly'],
    traps: ['Setting monopoly price where MC meets demand', 'Reading payoffs from the wrong player in a matrix', 'Claiming monopolistic competition earns long-run profit'],
  },
  'factor-markets': {
    points: [
      'Labor demand is derived from demand for the product.',
      'MRP = MP × P (competitive product market). Hire until MRP = MFC.',
      'In a competitive labor market, MFC = wage and the firm is a wage taker.',
      'Labor demand shifts with product price, productivity, and the price of other inputs.',
      'Least-cost combination: MP per dollar is equal across inputs.',
      'Monopsony: MFC above supply, hires fewer workers at a lower wage. A minimum wage can raise both pay and jobs.',
    ],
    formulas: ['MRP = MP × P', 'Least cost: MP(labor) ÷ P(labor) = MP(capital) ÷ P(capital)', 'Profit max: MRP ÷ price = 1 for every input'],
    graphs: ['Competitive labor market and firm side by side', 'Monopsony with MRP, S, and MFC'],
    traps: ['Comparing MP (units) with the wage (dollars)', 'Reading the monopsony wage from MFC instead of supply'],
  },
  'market-failure': {
    points: [
      'Socially optimal quantity is where MSB = MSC.',
      'Negative externality: MSC above MPC, overproduction. Fix with a Pigouvian tax equal to the external cost.',
      'Positive externality: MSB above MPB, underproduction. Fix with a subsidy equal to the external benefit.',
      'Public goods are non-rival and non-excludable, so free riders lead to underprovision.',
      'Common resources are rival and non-excludable, so they are overused.',
      'Lorenz curve further from the diagonal means more inequality and a higher Gini coefficient.',
      'Tax type depends on the percentage of income paid, not the dollar amount.',
    ],
    formulas: ['Gini = area A ÷ total area under the line of equality', 'Average tax rate = tax ÷ income'],
    graphs: ['Negative externality with DWL between Qsocial and Qmarket', 'Positive externality with DWL', 'Lorenz curve'],
    traps: ['Drawing MSC below supply for pollution', 'Calling a good public just because the government provides it'],
  },
  'economic-indicators': {
    points: [
      'GDP counts final goods and services produced within the country this period, at market value.',
      'Excluded: intermediate goods, used goods, financial transactions, transfer payments, non-market work.',
      'Real GDP uses base-year prices, so it only changes when output changes.',
      'Unemployed: 16+, no job, looked in the past four weeks. Discouraged workers are outside the labor force.',
      'Natural rate = frictional + structural. Full employment means zero cyclical unemployment.',
      'Unexpected inflation hurts lenders, savers, and fixed incomes; it helps fixed-rate borrowers.',
    ],
    formulas: ['GDP = C + I + G + (X − M)', 'Deflator = nominal ÷ real × 100', 'Unemployment rate = unemployed ÷ labor force × 100', 'LFPR = labor force ÷ adult population × 100', 'Inflation = (CPI this year − CPI last year) ÷ CPI last year × 100', 'Real rate = nominal rate − inflation'],
    graphs: ['Business cycle: expansion, peak, contraction, trough, trend line'],
    traps: ['Counting stock purchases as investment', 'Dividing unemployed by the whole population', 'Calling disinflation deflation'],
  },
  'national-income': {
    points: [
      'AD slopes down: wealth effect, interest rate effect, exchange rate effect.',
      'AD shifts with C, I, G, and net exports. SRAS shifts with input prices, productivity, and expectations.',
      'LRAS is vertical at full-employment output.',
      'Recessionary gap: Y below Yf, unemployment above natural rate. Inflationary gap: the reverse.',
      'SRAS shifting left causes stagflation.',
      'Without policy, wages adjust and SRAS shifts to close gaps in the long run.',
      'Automatic stabilizers work without new laws; discretionary policy has lags.',
    ],
    formulas: ['MPC + MPS = 1', 'Spending multiplier = 1 ÷ MPS', 'Tax multiplier = −MPC ÷ MPS', 'Required change in G = gap ÷ spending multiplier'],
    graphs: ['AD-SRAS-LRAS in long-run equilibrium', 'Recessionary and inflationary gaps', 'Self-correction through SRAS'],
    traps: ['Using the spending multiplier for a tax change', 'Shifting LRAS for a demand shock', 'Forgetting to label PL, real GDP, and Yf'],
  },
  'financial-sector': {
    points: [
      'Bond prices and interest rates move in opposite directions.',
      'Money: medium of exchange, unit of account, store of value.',
      'Banks create money by lending excess reserves.',
      'Money demand slopes down; money supply is vertical and set by the central bank.',
      'Expansionary monetary policy: buy bonds, lower discount rate, lower reserve requirement, lower interest on reserves.',
      'Loanable funds sets the real interest rate. Government borrowing raises it and crowds out private investment.',
    ],
    formulas: ['Required reserves = deposits × reserve requirement', 'Money multiplier = 1 ÷ reserve requirement', 'Max change in money supply = new excess reserves × money multiplier'],
    graphs: ['Money market with MS shift', 'Loanable funds with a government deficit', 'Bank balance sheet (T-account)'],
    traps: ['Counting a cash deposit as new money', 'Putting the real interest rate on the money market axis', 'Treating credit cards as money'],
  },
  'stabilization-policy': {
    points: [
      'Short-run Phillips curve: trade-off between inflation and unemployment.',
      'Long-run Phillips curve: vertical at the natural rate.',
      'AD shifts move the economy along the SRPC. Supply shocks and expectations shift the SRPC.',
      'Quantity theory: with V and Y stable, money growth raises the price level.',
      'Deficits add to the national debt and can crowd out investment.',
      'Growth comes from capital, human capital, technology, and productivity. It shifts LRAS and the PPC out.',
    ],
    formulas: ['M × V = P × Y', 'Years to double ≈ 70 ÷ growth rate'],
    graphs: ['SRPC and LRPC with a point off the natural rate', 'SRPC shift after a supply shock'],
    traps: ['Shifting the SRPC for a demand change', 'Mixing up deficit (one year) and debt (total)'],
  },
  'open-economy': {
    points: [
      'Current account: goods and services, investment income, transfers. Financial account: asset purchases.',
      'A current account deficit is matched by a financial account surplus.',
      'Appreciation makes exports more expensive and lowers net exports.',
      'Higher relative real interest rates attract capital and appreciate the currency.',
      'Expansionary monetary policy depreciates the currency and raises net exports.',
      'Deficit spending raises real rates, appreciates the currency, and lowers net exports.',
    ],
    formulas: ['Current account + capital and financial account = 0'],
    graphs: ['Foreign exchange market for one currency', 'Linked shifts in two currency markets'],
    traps: ['Labeling the wrong currency on the horizontal axis', 'Recording asset purchases in the current account'],
  },
};
