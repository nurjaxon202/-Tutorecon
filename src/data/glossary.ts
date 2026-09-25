export interface Term {
  term: string;
  def: string;
  unit: string;
}

export const glossary: Term[] = [
  // Basic economic concepts
  { unit: 'foundations', term: 'Scarcity', def: 'The condition of having unlimited wants but limited resources to satisfy them.' },
  { unit: 'foundations', term: 'Factors of production', def: 'The resources used to make goods and services: land, labor, capital, and entrepreneurship.' },
  { unit: 'foundations', term: 'Capital', def: 'Tools, machines, and buildings used to produce other goods. Money is not capital in this sense.' },
  { unit: 'foundations', term: 'Opportunity cost', def: 'The value of the next best alternative given up when you make a choice.' },
  { unit: 'foundations', term: 'Sunk cost', def: 'A cost that has already been paid and cannot be recovered. It should not affect future decisions.' },
  { unit: 'foundations', term: 'Production possibilities curve (PPC)', def: 'A graph of every combination of two goods an economy can make using all its resources efficiently with current technology.' },
  { unit: 'foundations', term: 'Law of increasing opportunity cost', def: 'As production of one good rises, each extra unit costs more of the other good, because resources are not equally suited to both. It makes the PPC bow outward.' },
  { unit: 'foundations', term: 'Economic growth', def: 'An increase in an economy’s capacity to produce, shown as an outward shift of the PPC or a rightward shift of LRAS.' },
  { unit: 'foundations', term: 'Absolute advantage', def: 'The ability to produce more of a good than another producer with the same resources.' },
  { unit: 'foundations', term: 'Comparative advantage', def: 'The ability to produce a good at a lower opportunity cost than another producer. It is the basis for gains from trade.' },
  { unit: 'foundations', term: 'Terms of trade', def: 'The rate at which one good is exchanged for another. Both sides gain if it falls between their opportunity costs.' },
  { unit: 'foundations', term: 'Marginal analysis', def: 'Making decisions by comparing the extra benefit and extra cost of one more unit.' },
  { unit: 'foundations', term: 'Circular flow model', def: 'A diagram of how money, resources, and goods move between households and firms through product and factor markets.' },

  // Supply and demand
  { unit: 'supply-and-demand', term: 'Law of demand', def: 'All else equal, when the price of a good rises, the quantity demanded falls.' },
  { unit: 'supply-and-demand', term: 'Substitutes', def: 'Goods used in place of each other. When the price of one rises, demand for the other rises.' },
  { unit: 'supply-and-demand', term: 'Complements', def: 'Goods used together. When the price of one rises, demand for the other falls.' },
  { unit: 'supply-and-demand', term: 'Normal good', def: 'A good whose demand rises when income rises.' },
  { unit: 'supply-and-demand', term: 'Inferior good', def: 'A good whose demand falls when income rises.' },
  { unit: 'supply-and-demand', term: 'Law of supply', def: 'All else equal, when the price of a good rises, the quantity supplied rises.' },
  { unit: 'supply-and-demand', term: 'Equilibrium', def: 'The price and quantity at which quantity demanded equals quantity supplied.' },
  { unit: 'supply-and-demand', term: 'Shortage', def: 'The amount by which quantity demanded is greater than quantity supplied, which happens when price is below equilibrium.' },
  { unit: 'supply-and-demand', term: 'Surplus', def: 'The amount by which quantity supplied is greater than quantity demanded, which happens when price is above equilibrium.' },
  { unit: 'supply-and-demand', term: 'Price elasticity of demand', def: 'The percentage change in quantity demanded divided by the percentage change in price, in absolute value.' },
  { unit: 'supply-and-demand', term: 'Total revenue test', def: 'If demand is elastic, a price increase lowers total revenue. If inelastic, a price increase raises it.' },
  { unit: 'supply-and-demand', term: 'Consumer surplus', def: 'The difference between what buyers are willing to pay and what they actually pay. The area below demand and above price.' },
  { unit: 'supply-and-demand', term: 'Producer surplus', def: 'The difference between the price sellers receive and the lowest price they would accept. The area above supply and below price.' },
  { unit: 'supply-and-demand', term: 'Deadweight loss', def: 'The total surplus lost when the quantity traded is not the efficient quantity.' },
  { unit: 'supply-and-demand', term: 'Price ceiling', def: 'A legal maximum price. It binds only when set below equilibrium, where it causes a shortage.' },
  { unit: 'supply-and-demand', term: 'Price floor', def: 'A legal minimum price. It binds only when set above equilibrium, where it causes a surplus.' },
  { unit: 'supply-and-demand', term: 'Tax incidence', def: 'How the burden of a tax is split between buyers and sellers. The less elastic side bears more.' },
  { unit: 'supply-and-demand', term: 'Tariff', def: 'A tax on imported goods.' },
  { unit: 'supply-and-demand', term: 'Quota', def: 'A limit on the quantity of a good that can be imported.' },

  // Production, cost, perfect competition
  { unit: 'production-and-cost', term: 'Short run', def: 'A period in which at least one input, usually the size of the plant, is fixed.' },
  { unit: 'production-and-cost', term: 'Long run', def: 'A period long enough for every input to change and for firms to enter or leave the industry.' },
  { unit: 'production-and-cost', term: 'Marginal product', def: 'The extra output from adding one more unit of an input, such as one more worker.' },
  { unit: 'production-and-cost', term: 'Diminishing marginal returns', def: 'In the short run, adding more of a variable input to a fixed input eventually makes marginal product fall.' },
  { unit: 'production-and-cost', term: 'Fixed cost', def: 'A cost that does not change with output, such as rent.' },
  { unit: 'production-and-cost', term: 'Variable cost', def: 'A cost that changes with output, such as materials and hourly wages.' },
  { unit: 'production-and-cost', term: 'Marginal cost', def: 'The extra cost of producing one more unit.' },
  { unit: 'production-and-cost', term: 'Average total cost', def: 'Total cost divided by quantity. Equal to average fixed cost plus average variable cost.' },
  { unit: 'production-and-cost', term: 'Economic profit', def: 'Total revenue minus explicit and implicit costs.' },
  { unit: 'production-and-cost', term: 'Normal profit', def: 'Zero economic profit. The owner earns exactly what they could in their next best use of time and money.' },
  { unit: 'production-and-cost', term: 'Price taker', def: 'A firm so small relative to the market that it cannot affect the price.' },
  { unit: 'production-and-cost', term: 'Shutdown rule', def: 'In the short run, a firm should stop producing if price falls below minimum average variable cost.' },
  { unit: 'production-and-cost', term: 'Productive efficiency', def: 'Producing at the lowest possible average total cost (P = minimum ATC).' },
  { unit: 'production-and-cost', term: 'Allocative efficiency', def: 'Producing the quantity where the value to buyers of the last unit equals its cost (P = MC).' },
  { unit: 'production-and-cost', term: 'Economies of scale', def: 'When long-run average total cost falls as a firm grows.' },

  // Imperfect competition
  { unit: 'imperfect-competition', term: 'Monopoly', def: 'A market with one seller of a product with no close substitutes, protected by barriers to entry.' },
  { unit: 'imperfect-competition', term: 'Barriers to entry', def: 'Anything that keeps new firms out of a market, such as patents, control of a key resource, or economies of scale.' },
  { unit: 'imperfect-competition', term: 'Natural monopoly', def: 'A market where one firm can supply the whole market at a lower average cost than two or more firms could.' },
  { unit: 'imperfect-competition', term: 'Marginal revenue', def: 'The extra revenue from selling one more unit.' },
  { unit: 'imperfect-competition', term: 'Price discrimination', def: 'Charging different buyers different prices for the same good when the difference is not due to costs.' },
  { unit: 'imperfect-competition', term: 'Monopolistic competition', def: 'A market with many firms selling differentiated products and easy entry.' },
  { unit: 'imperfect-competition', term: 'Excess capacity', def: 'When a firm produces less than the quantity that would minimize its average total cost.' },
  { unit: 'imperfect-competition', term: 'Oligopoly', def: 'A market with a few large, interdependent firms.' },
  { unit: 'imperfect-competition', term: 'Dominant strategy', def: 'A choice that gives a player the best result no matter what the other player does.' },
  { unit: 'imperfect-competition', term: 'Nash equilibrium', def: 'An outcome where no player can do better by changing only their own choice.' },
  { unit: 'imperfect-competition', term: 'Collusion', def: 'An agreement among firms to limit competition, such as by fixing prices.' },

  // Factor markets
  { unit: 'factor-markets', term: 'Derived demand', def: 'Demand for an input that comes from demand for the product it helps make.' },
  { unit: 'factor-markets', term: 'Marginal revenue product (MRP)', def: 'The extra revenue from hiring one more unit of an input. In a competitive product market, MRP = MP × P.' },
  { unit: 'factor-markets', term: 'Marginal factor cost (MFC)', def: 'The extra cost of hiring one more unit of an input. Also called marginal resource cost.' },
  { unit: 'factor-markets', term: 'Least-cost rule', def: 'A firm minimizes cost when the marginal product per dollar is the same for every input.' },
  { unit: 'factor-markets', term: 'Monopsony', def: 'A market with a single buyer, such as one main employer in a town.' },

  // Market failure
  { unit: 'market-failure', term: 'Market failure', def: 'When a market left alone does not produce the efficient quantity.' },
  { unit: 'market-failure', term: 'Externality', def: 'A cost or benefit that falls on someone outside the transaction.' },
  { unit: 'market-failure', term: 'Marginal social cost (MSC)', def: 'The full cost to society of one more unit, including costs to third parties.' },
  { unit: 'market-failure', term: 'Marginal social benefit (MSB)', def: 'The full benefit to society of one more unit, including benefits to third parties.' },
  { unit: 'market-failure', term: 'Pigouvian tax', def: 'A per-unit tax equal to the external cost, used to correct a negative externality.' },
  { unit: 'market-failure', term: 'Public good', def: 'A good that is non-rival and non-excludable, such as national defense.' },
  { unit: 'market-failure', term: 'Free-rider problem', def: 'People benefit from a good without paying, so private markets provide too little of it.' },
  { unit: 'market-failure', term: 'Common resource', def: 'A good that is rival but non-excludable, such as fish in the ocean.' },
  { unit: 'market-failure', term: 'Tragedy of the commons', def: 'The overuse of a common resource because no one can be kept from using it.' },
  { unit: 'market-failure', term: 'Lorenz curve', def: 'A graph of the share of income earned by each share of households, from poorest to richest.' },
  { unit: 'market-failure', term: 'Gini coefficient', def: 'A measure of inequality from 0 (perfect equality) to 1 (one household has everything).' },
  { unit: 'market-failure', term: 'Progressive tax', def: 'A tax that takes a larger percentage of income from people with higher incomes.' },
  { unit: 'market-failure', term: 'Regressive tax', def: 'A tax that takes a larger percentage of income from people with lower incomes.' },

  // Economic indicators
  { unit: 'economic-indicators', term: 'Gross domestic product (GDP)', def: 'The market value of all final goods and services produced within a country in a given period.' },
  { unit: 'economic-indicators', term: 'Intermediate good', def: 'A good used to produce another good. It is left out of GDP to avoid counting it twice.' },
  { unit: 'economic-indicators', term: 'Transfer payment', def: 'A payment from the government for which no good or service is received, such as Social Security.' },
  { unit: 'economic-indicators', term: 'Real GDP', def: 'GDP measured at base-year prices, so it changes only when output changes.' },
  { unit: 'economic-indicators', term: 'GDP deflator', def: 'A price index equal to nominal GDP divided by real GDP, times 100.' },
  { unit: 'economic-indicators', term: 'Labor force', def: 'Everyone 16 or older who is either employed or unemployed and looking for work.' },
  { unit: 'economic-indicators', term: 'Unemployment rate', def: 'The number of unemployed people divided by the labor force, times 100.' },
  { unit: 'economic-indicators', term: 'Discouraged worker', def: 'Someone who wants a job but has stopped looking, and so is not counted as unemployed.' },
  { unit: 'economic-indicators', term: 'Frictional unemployment', def: 'Unemployment from people being between jobs or new to the job market.' },
  { unit: 'economic-indicators', term: 'Structural unemployment', def: 'Unemployment from a mismatch between workers’ skills or locations and the jobs available.' },
  { unit: 'economic-indicators', term: 'Cyclical unemployment', def: 'Unemployment caused by a downturn in the business cycle.' },
  { unit: 'economic-indicators', term: 'Natural rate of unemployment', def: 'The unemployment rate when cyclical unemployment is zero: frictional plus structural.' },
  { unit: 'economic-indicators', term: 'Consumer price index (CPI)', def: 'A measure of the cost of a fixed basket of goods and services bought by a typical household.' },
  { unit: 'economic-indicators', term: 'Disinflation', def: 'A slowdown in the rate of inflation. Prices still rise, just more slowly.' },
  { unit: 'economic-indicators', term: 'Real interest rate', def: 'The nominal interest rate minus the inflation rate.' },
  { unit: 'economic-indicators', term: 'Business cycle', def: 'The pattern of expansion, peak, contraction, and trough in real GDP over time.' },

  // National income
  { unit: 'national-income', term: 'Aggregate demand (AD)', def: 'The total quantity of real output all buyers want at each price level.' },
  { unit: 'national-income', term: 'Short-run aggregate supply (SRAS)', def: 'The total output firms will produce at each price level while some input prices, like wages, are fixed.' },
  { unit: 'national-income', term: 'Long-run aggregate supply (LRAS)', def: 'A vertical line at full-employment output. In the long run, output does not depend on the price level.' },
  { unit: 'national-income', term: 'Recessionary gap', def: 'When real GDP is below full-employment output.' },
  { unit: 'national-income', term: 'Inflationary gap', def: 'When real GDP is above full-employment output.' },
  { unit: 'national-income', term: 'Stagflation', def: 'Falling output and rising prices at the same time, usually caused by a leftward shift of SRAS.' },
  { unit: 'national-income', term: 'Marginal propensity to consume (MPC)', def: 'The share of each extra dollar of disposable income that is spent.' },
  { unit: 'national-income', term: 'Spending multiplier', def: '1 ÷ MPS. The total change in GDP from each dollar of new spending.' },
  { unit: 'national-income', term: 'Fiscal policy', def: 'The use of government spending and taxes to influence the economy.' },
  { unit: 'national-income', term: 'Automatic stabilizers', def: 'Parts of the budget, like unemployment insurance and progressive taxes, that push against the business cycle without new laws.' },

  // Financial sector
  { unit: 'financial-sector', term: 'Liquidity', def: 'How easily an asset can be used to buy goods and services.' },
  { unit: 'financial-sector', term: 'Bond', def: 'A loan to a company or government that pays interest and is repaid on a set date.' },
  { unit: 'financial-sector', term: 'M1', def: 'The most liquid measure of money: currency in circulation and checkable deposits.' },
  { unit: 'financial-sector', term: 'M2', def: 'M1 plus near-monies such as savings deposits, small time deposits, and money market funds.' },
  { unit: 'financial-sector', term: 'Fractional reserve banking', def: 'A system where banks hold only part of their deposits as reserves and lend the rest.' },
  { unit: 'financial-sector', term: 'Excess reserves', def: 'Reserves above the amount a bank is required to hold. The amount it can lend.' },
  { unit: 'financial-sector', term: 'Money multiplier', def: '1 ÷ the reserve requirement. The maximum change in deposits from each dollar of new excess reserves.' },
  { unit: 'financial-sector', term: 'Open market operations', def: 'The central bank buying or selling government bonds to change the money supply.' },
  { unit: 'financial-sector', term: 'Discount rate', def: 'The interest rate the central bank charges banks for short-term loans.' },
  { unit: 'financial-sector', term: 'Monetary policy', def: 'The central bank’s use of its tools to change interest rates and the money supply.' },
  { unit: 'financial-sector', term: 'Loanable funds market', def: 'The market where savers supply funds and borrowers demand them, setting the real interest rate.' },
  { unit: 'financial-sector', term: 'Crowding out', def: 'When government borrowing raises interest rates and reduces private investment.' },

  // Stabilization policy
  { unit: 'stabilization-policy', term: 'Short-run Phillips curve', def: 'A downward-sloping curve showing the short-run trade-off between inflation and unemployment.' },
  { unit: 'stabilization-policy', term: 'Long-run Phillips curve', def: 'A vertical line at the natural rate of unemployment. In the long run there is no trade-off.' },
  { unit: 'stabilization-policy', term: 'Quantity theory of money', def: 'The idea, based on M × V = P × Y, that in the long run money growth mainly raises prices.' },
  { unit: 'stabilization-policy', term: 'Velocity of money', def: 'The average number of times a dollar is spent on final goods and services in a year.' },
  { unit: 'stabilization-policy', term: 'Budget deficit', def: 'When government spending is greater than tax revenue in a year.' },
  { unit: 'stabilization-policy', term: 'National debt', def: 'The total amount the government owes: the sum of past deficits minus surpluses.' },
  { unit: 'stabilization-policy', term: 'Productivity', def: 'Output per worker or per hour worked.' },
  { unit: 'stabilization-policy', term: 'Rule of 70', def: 'A shortcut: 70 divided by the annual growth rate gives the approximate number of years for a value to double.' },

  // Open economy
  { unit: 'open-economy', term: 'Balance of payments', def: 'The record of all transactions between one country and the rest of the world.' },
  { unit: 'open-economy', term: 'Current account', def: 'The part of the balance of payments that records trade in goods and services, investment income, and transfers.' },
  { unit: 'open-economy', term: 'Financial account', def: 'The part of the balance of payments that records purchases and sales of assets across borders.' },
  { unit: 'open-economy', term: 'Exchange rate', def: 'The price of one currency in terms of another.' },
  { unit: 'open-economy', term: 'Appreciation', def: 'An increase in the value of a currency compared with another.' },
  { unit: 'open-economy', term: 'Depreciation', def: 'A decrease in the value of a currency compared with another.' },
  { unit: 'open-economy', term: 'Net exports', def: 'Exports minus imports.' },
];

export const termsFor = (unit: string) => glossary.filter((t) => t.unit === unit);

export const termSlug = (term: string) =>
  term
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
