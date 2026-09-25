// Practice questions. Every option carries its own explanation, so a student
// who picks a wrong answer learns why that specific answer is wrong.

export interface Option {
  text: string;
  why: string;
}

export interface Question {
  id: string;
  unit: string;
  prompt: string;
  options: Option[];
  answer: number;
}

const q = (id: string, unit: string, prompt: string, options: [string, string][], answer: number): Question => ({
  id,
  unit,
  prompt,
  options: options.map(([text, why]) => ({ text, why })),
  answer,
});

export const questions: Question[] = [
  /* Basic economic concepts */
  q('f1', 'foundations', 'Maya can work a shift paying $80, go to a concert she values at $60, or study for a test. She chooses to study. What is the opportunity cost of studying?', [
    ['$140, the value of both the shift and the concert', 'Opportunity cost counts only the single next best alternative, not everything you could have done.'],
    ['$80, the pay from the shift', 'Correct. The shift is the most valuable alternative she gave up, so its value is the opportunity cost.'],
    ['$60, the value of the concert', 'The concert is worth less to her than the shift, so it is not the next best alternative.'],
    ['Nothing, because studying is free', 'Studying costs no money, but it uses time that could have earned $80.'],
  ], 1),
  q('f2', 'foundations', 'An economy is producing at a point inside its production possibilities curve. Which is the most likely cause?', [
    ['A new technology was just introduced', 'New technology shifts the curve outward. It does not move the economy inside it.'],
    ['The economy is specializing in capital goods', 'Choosing capital goods is a point on the curve, not inside it.'],
    ['Many workers are unemployed', 'Correct. Idle resources mean the economy is making less than it could, which puts it inside the curve.'],
    ['The population has grown', 'More workers would shift the curve outward.'],
  ], 2),
  q('f3', 'foundations', 'A production possibilities curve that is bowed outward from the origin shows that', [
    ['opportunity cost rises as more of one good is produced', 'Correct. Resources are not equally suited to both goods, so each extra unit costs more of the other good.'],
    ['opportunity cost is the same at every point', 'Constant opportunity cost gives a straight-line PPC.'],
    ['the economy is using its resources inefficiently', 'Efficiency is about where the point is relative to the curve, not the curve’s shape.'],
    ['the economy has an absolute advantage in both goods', 'Absolute advantage compares two producers. A single PPC’s shape says nothing about it.'],
  ], 0),
  q('f4', 'foundations', 'In one day, Country A can make 40 shirts or 20 phones. Country B can make 30 shirts or 10 phones. Which statement is true?', [
    ['Country B has a comparative advantage in phones', 'In B, a phone costs 3 shirts; in A it costs only 2. A has the lower cost of phones.'],
    ['Country A has a comparative advantage in shirts', 'In A, a shirt costs 1/2 phone; in B it costs 1/3 phone. B has the lower cost of shirts.'],
    ['Neither country gains from trade because A has an absolute advantage in both', 'Trade depends on comparative advantage. Different opportunity costs mean both can gain.'],
    ['Country A has a comparative advantage in phones', 'Correct. A phone costs A 2 shirts (40 ÷ 20) and costs B 3 shirts (30 ÷ 10), so A gives up less to make phones.'],
  ], 3),
  q('f5', 'foundations', 'Using the countries in the previous question (A: 40 shirts or 20 phones; B: 30 shirts or 10 phones), which terms of trade would benefit both?', [
    ['1 phone for 1.5 shirts', 'Country A can make a phone for 2 shirts, so selling one for 1.5 shirts would make A worse off.'],
    ['1 phone for 2.5 shirts', 'Correct. The price must be between the two opportunity costs, 2 and 3 shirts per phone.'],
    ['1 phone for 3.5 shirts', 'Country B can make a phone itself for 3 shirts, so it would not pay 3.5.'],
    ['1 phone for 4 shirts', 'That is above B’s own cost of 3 shirts per phone, so B would refuse.'],
  ], 1),
  q('f6', 'foundations', 'A coffee shop sells 100 cups a day. The owner is deciding whether to stay open one more hour. What should she compare?', [
    ['Total revenue and total cost for the whole day', 'The decision is about the extra hour, so she should compare what that hour adds, not the day’s totals.'],
    ['The rent she already paid this month and the extra revenue', 'Rent already paid is a sunk cost. It does not change with the decision.'],
    ['The extra revenue and extra cost of the additional hour', 'Correct. Marginal analysis compares the marginal benefit and marginal cost of the next unit.'],
    ['Her revenue and a competitor’s revenue', 'A competitor’s results do not tell her whether the extra hour pays for itself.'],
  ], 2),

  /* Supply and demand */
  q('sd1', 'supply-and-demand', 'Which event would shift the demand curve for gasoline to the left?', [
    ['A rise in the price of gasoline', 'A change in the good’s own price is a movement along the demand curve, not a shift.'],
    ['A large increase in the price of cars, a complement', 'Correct. When a complement gets more expensive, people buy fewer cars, and demand for gasoline falls.'],
    ['A rise in the price of crude oil, an input', 'Input prices shift supply, not demand.'],
    ['An increase in the number of drivers', 'More buyers shifts demand to the right.'],
  ], 1),
  q('sd2', 'supply-and-demand', 'Incomes rise, and the demand for bus rides falls. For these buyers, bus rides are', [
    ['a normal good', 'Demand for a normal good rises when income rises.'],
    ['a complement', 'Complements are defined by the price of another good, not by income.'],
    ['an inferior good', 'Correct. Demand for an inferior good falls as income rises.'],
    ['a public good', 'A public good is non-rival and non-excludable. That has nothing to do with how demand responds to income.'],
  ], 2),
  q('sd3', 'supply-and-demand', 'Demand for strawberries increases while supply decreases. What must happen in the strawberry market?', [
    ['Price rises; the change in quantity is uncertain', 'Correct. Both shifts push price up. Demand pushes quantity up and supply pushes it down, so quantity depends on which shift is bigger.'],
    ['Price and quantity both rise', 'Quantity could fall if the supply decrease is larger than the demand increase.'],
    ['Price falls; quantity rises', 'Both shifts push price upward, so it cannot fall.'],
    ['Quantity rises; the change in price is uncertain', 'Price is the certain result here. Quantity is the uncertain one.'],
  ], 0),
  q('sd4', 'supply-and-demand', 'A 10% rise in the price of a good leads to a 4% fall in quantity demanded. Demand is', [
    ['elastic, and total revenue falls', 'The elasticity is 0.4, which is less than 1, so demand is inelastic.'],
    ['unit elastic, and total revenue does not change', 'Unit elastic would mean a 10% fall in quantity.'],
    ['perfectly inelastic', 'Quantity did respond, just not by much. Perfectly inelastic means no response at all.'],
    ['inelastic, and total revenue rises', 'Correct. 4% ÷ 10% = 0.4. With inelastic demand, a price increase raises total revenue.'],
  ], 3),
  q('sd5', 'supply-and-demand', 'The government sets a price ceiling below the equilibrium price of apartments. Compared with equilibrium, the result is', [
    ['a surplus of apartments and more apartments rented', 'A ceiling below equilibrium makes renters want more and landlords offer less, which is a shortage.'],
    ['a shortage of apartments and fewer apartments rented', 'Correct. Quantity traded is limited to what landlords supply at the lower price, which is less than before.'],
    ['a shortage of apartments and more apartments rented', 'Only the supply side can limit how many apartments get rented, and landlords supply fewer at the lower price.'],
    ['no change, because ceilings only matter above equilibrium', 'That is backwards. A ceiling binds only when it is below equilibrium.'],
  ], 1),
  q('sd6', 'supply-and-demand', 'A per-unit tax is placed on a good. Buyers bear most of the tax when', [
    ['demand is more elastic than supply', 'If buyers can easily switch away, sellers end up absorbing more of the tax.'],
    ['the tax is collected from sellers', 'Who writes the check to the government does not decide who bears the tax.'],
    ['demand is less elastic than supply', 'Correct. The less responsive side of the market cannot avoid the tax as easily, so it bears more of it.'],
    ['supply is perfectly inelastic', 'In that case sellers bear the entire tax, because they cannot reduce quantity at all.'],
  ], 2),

  /* Production, cost, and perfect competition */
  q('pc1', 'production-and-cost', 'A bakery adds a fifth worker and total output rises from 44 to 48 loaves. The fourth worker had raised output from 36 to 44. This illustrates', [
    ['diminishing marginal returns', 'Correct. The marginal product fell from 8 loaves to 4 as more workers share the same fixed kitchen.'],
    ['diseconomies of scale', 'Diseconomies of scale are a long-run idea about the whole firm growing, not about adding workers to a fixed plant.'],
    ['negative marginal product', 'Output still rose, so marginal product is positive. It is just smaller.'],
    ['increasing returns to scale', 'Each extra worker adds less, which is the opposite of increasing returns.'],
  ], 0),
  q('pc2', 'production-and-cost', 'When marginal cost is below average total cost,', [
    ['average total cost is rising', 'A marginal value below the average pulls the average down, not up.'],
    ['average total cost is at its minimum', 'The minimum is where MC equals ATC, not where it is below.'],
    ['the firm is making a loss', 'Profit depends on price compared with ATC, not on MC compared with ATC.'],
    ['average total cost is falling', 'Correct. Like a test score below your average, a marginal cost below ATC pulls ATC down.'],
  ], 3),
  q('pc3', 'production-and-cost', 'A shop earns $300,000 in revenue and pays $220,000 in explicit costs. The owner gave up a job paying $90,000. What are accounting and economic profit?', [
    ['Accounting profit $80,000; economic profit $80,000', 'Economic profit also subtracts the implicit cost of the owner’s forgone salary.'],
    ['Accounting profit $80,000; economic profit −$10,000', 'Correct. $300,000 − $220,000 = $80,000 accounting profit. Subtract the $90,000 implicit cost for economic profit of −$10,000.'],
    ['Accounting profit −$10,000; economic profit $80,000', 'The labels are reversed. Accounting profit ignores implicit costs.'],
    ['Accounting profit $170,000; economic profit $80,000', 'The $90,000 salary is subtracted, not added.'],
  ], 1),
  q('pc4', 'production-and-cost', 'A perfectly competitive firm faces a market price of $12. Its minimum average variable cost is $14. In the short run it should', [
    ['produce where price equals marginal cost', 'Price is below minimum AVC, so every unit loses money even before fixed costs.'],
    ['raise its price to $14', 'A competitive firm is a price taker. At $14 it would sell nothing.'],
    ['shut down', 'Correct. When price is below minimum AVC, shutting down limits the loss to fixed costs.'],
    ['produce where average total cost is lowest', 'Firms maximize profit where MR = MC, and here the right quantity is zero.'],
  ], 2),
  q('pc5', 'production-and-cost', 'Firms in a perfectly competitive industry are earning economic profits. In the long run, you would expect', [
    ['new firms to enter, the price to fall, and profits to reach zero', 'Correct. Profit attracts entry, market supply shifts right, and price falls until it equals minimum ATC.'],
    ['firms to leave, the price to rise, and profits to grow', 'Firms leave when they are losing money, not when they are making profits.'],
    ['the price to stay the same because each firm is a price taker', 'Each firm takes the price as given, but entry by many firms changes the market price.'],
    ['firms to keep earning profit because of barriers to entry', 'Perfect competition has no barriers to entry.'],
  ], 0),
  q('pc6', 'production-and-cost', 'In long-run equilibrium, a perfectly competitive firm produces where', [
    ['P = MC but P is above minimum ATC', 'In the long run, entry and exit push price down to minimum ATC.'],
    ['P is above MC and equal to ATC', 'A competitive firm always produces where P = MR = MC.'],
    ['MR = MC but P is below ATC', 'That would be a loss, and firms would leave until it disappeared.'],
    ['P = MC = minimum ATC', 'Correct. It is allocatively efficient (P = MC) and productively efficient (P = minimum ATC).'],
  ], 3),

  /* Imperfect competition */
  q('ic1', 'imperfect-competition', 'Why is a monopolist’s marginal revenue less than its price?', [
    ['Because it must pay taxes on each unit', 'Taxes affect cost, not how revenue changes with output.'],
    ['Because to sell one more unit it must lower the price on all units', 'Correct. The extra unit brings in its price, but the lower price on earlier units takes some of that away.'],
    ['Because its marginal cost is rising', 'Marginal cost is about cost, not revenue.'],
    ['Because demand is perfectly elastic', 'Perfectly elastic demand is the competitive case, where MR equals price.'],
  ], 1),
  q('ic2', 'imperfect-competition', 'A profit-maximizing monopolist that is not regulated will produce where', [
    ['MR = MC and charge the price on the demand curve at that quantity', 'Correct. Find quantity where MR = MC, then go up to demand for the price.'],
    ['P = MC', 'That is the allocatively efficient outcome, which an unregulated monopolist does not choose.'],
    ['demand is inelastic', 'A monopolist avoids the inelastic range, where MR is negative.'],
    ['P = minimum ATC', 'That is the long-run outcome in perfect competition.'],
  ], 0),
  q('ic3', 'imperfect-competition', 'A firm that practices perfect price discrimination will', [
    ['produce less than a single-price monopolist', 'Perfect price discrimination raises output, because MR equals demand.'],
    ['leave consumers with the largest possible surplus', 'The firm charges each buyer their maximum willingness to pay, so consumer surplus is zero.'],
    ['produce the allocatively efficient quantity with no deadweight loss', 'Correct. It keeps selling as long as a buyer values the unit above its marginal cost.'],
    ['charge every buyer the same price', 'That is the opposite of price discrimination.'],
  ], 2),
  q('ic4', 'imperfect-competition', 'In long-run equilibrium, a firm in monopolistic competition', [
    ['earns positive economic profit because its product is unique', 'Easy entry means new firms keep coming until profit is zero.'],
    ['produces at minimum ATC', 'Its demand curve touches ATC where ATC is still falling, which leaves excess capacity.'],
    ['sets price equal to marginal cost', 'Its demand slopes down, so price is above MC.'],
    ['earns zero economic profit and has excess capacity', 'Correct. Demand is tangent to ATC, so profit is zero, and output is below the level that minimizes ATC.'],
  ], 3),
  q('ic5', 'imperfect-competition', 'Two firms choose to advertise or not. If B advertises, A earns $40 by advertising and $20 by not. If B does not advertise, A earns $60 by advertising and $50 by not. Which is true for Firm A?', [
    ['Advertising is a dominant strategy', 'Correct. Advertising pays more whether B advertises ($40 versus $20) or not ($60 versus $50).'],
    ['Not advertising is a dominant strategy', 'Not advertising pays less in both cases.'],
    ['A has no dominant strategy', 'A dominant strategy is best no matter what the other player does. Advertising meets that test.'],
    ['A’s best choice depends on what B does', 'Advertising is better in both cases, so A does not need to know B’s choice.'],
  ], 0),
  q('ic6', 'imperfect-competition', 'A regulator sets the price of a natural monopoly equal to its average total cost. Compared with no regulation, this', [
    ['lowers output and raises price', 'Regulation at P = ATC lowers price and increases output.'],
    ['makes the firm lose money and require a subsidy', 'That happens at P = MC. At P = ATC, the firm breaks even.'],
    ['raises output and lets the firm earn a normal profit', 'Correct. This fair-return price increases quantity and leaves zero economic profit.'],
    ['eliminates all deadweight loss', 'At P = ATC, price is still above MC for a natural monopoly, so some deadweight loss remains.'],
  ], 2),

  /* Factor markets */
  q('fm1', 'factor-markets', 'The demand for pilots is called a derived demand because it', [
    ['comes from the demand for air travel', 'Correct. Airlines hire pilots because people buy flights.'],
    ['is set by the government', 'Derived demand is about where the demand comes from, not who sets it.'],
    ['is perfectly inelastic', 'Derived demand says nothing about elasticity.'],
    ['depends on the wage pilots ask for', 'The wage moves firms along the demand curve. It does not explain why the demand exists.'],
  ], 0),
  q('fm2', 'factor-markets', 'A competitive firm sells its product for $5. The fourth worker adds 6 units of output. The wage is $25. Should the firm hire the fourth worker?', [
    ['No, because 6 units is less than the wage of $25', 'You have to turn units into dollars first. MRP = 6 × $5 = $30.'],
    ['Yes, because the worker’s MRP of $30 is more than the wage of $25', 'Correct. The worker adds $30 of revenue and costs $25.'],
    ['No, because MRP is falling', 'MRP usually falls. What matters is whether it is still above MFC.'],
    ['Yes, because every worker adds output', 'Adding output is not enough. The added revenue must at least cover the added cost.'],
  ], 1),
  q('fm3', 'factor-markets', 'Which of the following would increase the demand for workers at a furniture factory?', [
    ['A rise in the workers’ wage', 'A higher wage moves the firm along its labor demand curve, lowering the quantity demanded.'],
    ['A fall in the price of furniture', 'A lower product price reduces MRP, which lowers labor demand.'],
    ['An increase in the workers’ productivity', 'Correct. Higher marginal product raises MRP at every level of employment.'],
    ['An increase in the number of people who want to work there', 'That shifts labor supply, not labor demand.'],
  ], 2),
  q('fm4', 'factor-markets', 'A firm uses labor and capital. The last worker adds 20 units and costs $10. The last machine adds 60 units and costs $40. To minimize cost, the firm should', [
    ['use more capital and less labor', 'Labor gives 2 units per dollar and capital gives 1.5, so the firm should shift toward labor.'],
    ['keep the same combination', 'The ratios are not equal (2 versus 1.5), so it is not minimizing cost yet.'],
    ['use less of both', 'Changing the mix, not the total amount, is what lowers cost for the same output.'],
    ['use more labor and less capital', 'Correct. MP ÷ price is 20/10 = 2 for labor and 60/40 = 1.5 for capital, so a dollar on labor goes further.'],
  ], 3),
  q('fm5', 'factor-markets', 'Compared with a competitive labor market, a monopsony employer', [
    ['hires fewer workers and pays a lower wage', 'Correct. It hires where MRP = MFC, and MFC lies above labor supply, so both employment and pay are lower.'],
    ['hires more workers at a lower wage', 'Because MFC is above the wage, the monopsonist stops hiring sooner.'],
    ['hires the same number of workers at a lower wage', 'Employment is also lower, not just the wage.'],
    ['hires fewer workers at a higher wage', 'The monopsonist pays the lowest wage that attracts the workers it wants, which is below the competitive wage.'],
  ], 0),
  q('fm6', 'factor-markets', 'Why is the marginal factor cost curve above the labor supply curve for a monopsony?', [
    ['Because the firm pays higher taxes than competitive firms', 'Taxes are not what separates MFC from supply.'],
    ['Because workers in a monopsony are more productive', 'Productivity affects MRP, the demand side.'],
    ['Because to hire one more worker it must raise the wage for all its workers', 'Correct. The extra cost of a worker includes the raise given to everyone already employed.'],
    ['Because it faces a horizontal supply curve', 'A horizontal supply curve is the competitive case, where MFC equals the wage.'],
  ], 2),

  /* Market failure */
  q('mf1', 'market-failure', 'A factory’s production pollutes a nearby river. Without government action, the market for the factory’s product will', [
    ['produce too much, because marginal social cost is above marginal private cost', 'Correct. The factory ignores the harm to others, so it produces past the socially best quantity.'],
    ['produce too little, because marginal social benefit is above marginal private benefit', 'That describes a positive externality.'],
    ['produce the efficient amount, because firms maximize profit', 'Profit maximization ignores costs that fall on third parties.'],
    ['produce too little, because pollution raises the firm’s costs', 'The pollution cost falls on others, not on the firm, which is the problem.'],
  ], 0),
  q('mf2', 'market-failure', 'Which policy would move a market with a negative externality to the socially optimal quantity?', [
    ['A per-unit subsidy equal to the external cost', 'A subsidy would increase production, making overproduction worse.'],
    ['A price ceiling below the market price', 'A ceiling does not make producers account for the external cost.'],
    ['A per-unit tax equal to the external cost', 'Correct. A Pigouvian tax makes producers face the full social cost.'],
    ['A tax on buyers equal to the market price', 'The right tax equals the external cost per unit, not the price.'],
  ], 2),
  q('mf3', 'market-failure', 'Which of the following is a public good?', [
    ['A slice of pizza', 'Pizza is rival and excludable, a private good.'],
    ['A subscription streaming service', 'You can be excluded if you do not pay, so it is a club good.'],
    ['Fish in the open ocean', 'Fish are rival: one person’s catch leaves fewer for others. That makes them a common resource.'],
    ['A lighthouse warning ships at night', 'Correct. One ship seeing the light does not stop another from seeing it, and no ship can be excluded.'],
  ], 3),
  q('mf4', 'market-failure', 'The free-rider problem explains why', [
    ['private markets tend to underprovide public goods', 'Correct. People can benefit without paying, so few pay, and private firms cannot cover their costs.'],
    ['common resources are overused', 'That is the tragedy of the commons, which is about rivalry, not free riding on non-excludable goods.'],
    ['monopolies charge high prices', 'Monopoly pricing is about market power.'],
    ['taxes are regressive', 'Free riding has nothing to do with how taxes relate to income.'],
  ], 0),
  q('mf5', 'market-failure', 'A country’s Lorenz curve moves farther from the line of equality. Its Gini coefficient', [
    ['falls, and income is more equal', 'A curve moving away from the diagonal means income is less equal.'],
    ['rises, and income is less equal', 'Correct. The area between the diagonal and the Lorenz curve grows, so the Gini coefficient rises.'],
    ['stays the same, because the Gini coefficient only measures wealth', 'The Gini coefficient can measure income or wealth, and it changes with the Lorenz curve.'],
    ['becomes negative', 'The Gini coefficient runs from 0 to 1. It is never negative.'],
  ], 1),
  q('mf6', 'market-failure', 'A tax takes 10% of income from a family earning $30,000 and 10% from a family earning $300,000. The tax is', [
    ['progressive', 'A progressive tax would take a larger percentage from the higher-income family.'],
    ['regressive', 'A regressive tax would take a larger percentage from the lower-income family.'],
    ['proportional', 'Correct. Both pay the same percentage of income.'],
    ['a transfer payment', 'A transfer payment is money paid to people, not taken from them.'],
  ], 2),

  /* Economic indicators */
  q('ei1', 'economic-indicators', 'Which of the following is counted in this year’s US GDP?', [
    ['A used car sold by a dealer this year', 'The car was produced in an earlier year. Only the dealer’s service is counted.'],
    ['Shares of stock bought on the stock exchange', 'Stock purchases are financial transactions. Nothing new is produced.'],
    ['A Social Security payment to a retiree', 'That is a transfer payment. No good or service is bought.'],
    ['A new house built and sold this year', 'Correct. New residential construction is counted as investment.'],
  ], 3),
  q('ei2', 'economic-indicators', 'Nominal GDP is $12 trillion and the GDP deflator is 120. Real GDP is', [
    ['$14.4 trillion', 'That multiplies by 1.2 instead of dividing.'],
    ['$10 trillion', 'Correct. Real GDP = (12 ÷ 120) × 100 = $10 trillion.'],
    ['$12 trillion', 'That would only be true if the deflator were 100, in the base year.'],
    ['$8 trillion', 'Check the arithmetic: 12 ÷ 1.2 = 10.'],
  ], 1),
  q('ei3', 'economic-indicators', 'An engineer quits her job to look for a better one. While she searches, she is', [
    ['frictionally unemployed', 'Correct. She is between jobs and searching, which is frictional unemployment.'],
    ['structurally unemployed', 'Structural unemployment comes from a mismatch of skills and jobs. She has in-demand skills.'],
    ['cyclically unemployed', 'Cyclical unemployment is caused by a recession, not a voluntary job search.'],
    ['not in the labor force', 'She is actively looking for work, so she is in the labor force.'],
  ], 0),
  q('ei4', 'economic-indicators', 'A town has 800 employed people, 200 unemployed people, and 500 adults not in the labor force. The unemployment rate is', [
    ['13.3%', 'That divides by the whole adult population. Use the labor force instead.'],
    ['25%', 'That divides unemployed by employed. Use the labor force, which includes both.'],
    ['20%', 'Correct. The labor force is 800 + 200 = 1,000, and 200 ÷ 1,000 = 20%.'],
    ['40%', 'That divides unemployed by people not in the labor force.'],
  ], 2),
  q('ei5', 'economic-indicators', 'A bank lends money at 6% expecting 2% inflation. Inflation turns out to be 5%. Who benefits?', [
    ['The bank, because it earns 6%', 'The real return is 6% − 5% = 1%, much less than the 4% the bank expected.'],
    ['Neither, because the nominal rate was fixed', 'The fixed nominal rate is exactly why unexpected inflation shifts value between the two.'],
    ['Savers with money in the bank', 'Savers also lose when inflation is higher than expected.'],
    ['The borrower, because the real cost of the loan fell', 'Correct. The borrower repays with dollars that buy less than expected.'],
  ], 3),
  q('ei6', 'economic-indicators', 'The natural rate of unemployment is made up of', [
    ['frictional and structural unemployment', 'Correct. It is the unemployment that exists even when the economy is at full employment.'],
    ['cyclical and frictional unemployment', 'Cyclical unemployment is zero at the natural rate.'],
    ['structural and cyclical unemployment', 'Cyclical unemployment is zero at the natural rate.'],
    ['discouraged workers only', 'Discouraged workers are not counted as unemployed at all.'],
  ], 0),

  /* National income and price determination */
  q('ni1', 'national-income', 'Which of the following would shift aggregate demand to the right?', [
    ['A rise in the price level', 'A change in the price level is a movement along AD.'],
    ['An increase in the price of oil', 'Higher input costs shift SRAS left, not AD.'],
    ['An increase in consumer confidence', 'Correct. More confident households spend more at every price level.'],
    ['A recession in a major trading partner', 'That lowers exports, shifting AD left.'],
  ], 2),
  q('ni2', 'national-income', 'A sharp increase in the price of energy will, in the short run, cause', [
    ['real GDP to fall and the price level to rise', 'Correct. SRAS shifts left, which causes stagflation.'],
    ['real GDP and the price level to fall', 'That is the result of AD shifting left.'],
    ['real GDP to rise and the price level to fall', 'That is the result of SRAS shifting right.'],
    ['no change in real GDP, only the price level', 'That describes a long-run adjustment along a vertical LRAS, not a short-run supply shock.'],
  ], 0),
  q('ni3', 'national-income', 'If the marginal propensity to consume is 0.75, the spending multiplier is', [
    ['0.75', 'That is the MPC itself, not the multiplier.'],
    ['1.33', 'That is 1 ÷ 0.75. The formula uses the MPS.'],
    ['3', 'That is the size of the tax multiplier (0.75 ÷ 0.25), not the spending multiplier.'],
    ['4', 'Correct. 1 ÷ (1 − 0.75) = 1 ÷ 0.25 = 4.'],
  ], 3),
  q('ni4', 'national-income', 'An economy is in a recessionary gap. With no policy action, in the long run', [
    ['nominal wages rise, SRAS shifts left, and prices rise', 'That is how an inflationary gap closes.'],
    ['nominal wages fall, SRAS shifts right, and output returns to full employment', 'Correct. High unemployment pushes wages down, which lowers costs and shifts SRAS right.'],
    ['AD shifts right on its own and output rises', 'Self-correction in the AD-AS model works through wages and SRAS, not AD.'],
    ['LRAS shifts left to meet the current output', 'LRAS depends on resources and technology, not on a temporary gap.'],
  ], 1),
  q('ni5', 'national-income', 'The MPC is 0.8 and there is an inflationary gap of $100 billion. Which fiscal policy would close it?', [
    ['Increase government spending by $20 billion', 'An inflationary gap calls for contractionary policy, not more spending.'],
    ['Cut taxes by $25 billion', 'A tax cut is expansionary and would make the gap larger.'],
    ['Decrease government spending by $20 billion', 'Correct. The spending multiplier is 1 ÷ 0.2 = 5, and $20 billion × 5 = $100 billion.'],
    ['Decrease government spending by $100 billion', 'That ignores the multiplier and would cut GDP by $500 billion.'],
  ], 2),
  q('ni6', 'national-income', 'Unemployment insurance payments rise automatically during a recession. This is an example of', [
    ['an automatic stabilizer', 'Correct. It supports spending in a downturn without any new law.'],
    ['discretionary fiscal policy', 'Discretionary policy requires a new decision by lawmakers.'],
    ['expansionary monetary policy', 'Monetary policy is run by the central bank through interest rates and the money supply.'],
    ['crowding out', 'Crowding out is higher interest rates reducing private investment.'],
  ], 0),

  /* Financial sector */
  q('fs1', 'financial-sector', 'If market interest rates rise, the price of existing bonds will', [
    ['rise, because bonds now pay more', 'Existing bonds keep their original payments. Only new bonds pay the higher rate.'],
    ['stay the same, because the payments are fixed', 'The payments are fixed, which is exactly why the price has to fall to stay competitive.'],
    ['fall, because new bonds offer a better return', 'Correct. Buyers will only pay less for an old bond with a lower payment.'],
    ['become impossible to sell', 'They can be sold, just at a lower price.'],
  ], 2),
  q('fs2', 'financial-sector', 'You use dollars to compare the prices of two phones. This is money acting as a', [
    ['medium of exchange', 'That is using money to buy something.'],
    ['store of value', 'That is using money to hold wealth over time.'],
    ['form of credit', 'Credit is a loan, not a function of money.'],
    ['unit of account', 'Correct. Money gives a common measure for comparing values.'],
  ], 3),
  q('fs3', 'financial-sector', 'A bank has $10,000 in new deposits and the reserve requirement is 20%. It may lend up to', [
    ['$8,000', 'Correct. Required reserves are $2,000, leaving $8,000 in excess reserves.'],
    ['$2,000', 'That is the amount the bank must keep, not what it can lend.'],
    ['$10,000', 'The bank must keep 20% as required reserves.'],
    ['$50,000', 'That is the maximum change for the whole banking system, not one bank’s lending.'],
  ], 0),
  q('fs4', 'financial-sector', 'To fight a recession in a limited-reserves system, the Fed would most likely', [
    ['sell government bonds', 'Selling bonds takes reserves out of banks and raises interest rates.'],
    ['buy government bonds', 'Correct. Buying bonds adds reserves, increases the money supply, and lowers interest rates.'],
    ['raise the discount rate', 'That makes borrowing reserves more expensive, which is contractionary.'],
    ['raise the reserve requirement', 'That reduces how much banks can lend, which is contractionary.'],
  ], 1),
  q('fs5', 'financial-sector', 'Real GDP rises and nothing else changes. In the money market, the nominal interest rate', [
    ['falls, because money supply rises', 'The central bank controls money supply. Higher GDP does not change it.'],
    ['stays the same, because money supply is fixed', 'Money demand shifts, and with a fixed supply the rate has to change.'],
    ['falls, because people hold less money', 'People need more money for extra transactions, not less.'],
    ['rises, because money demand increases', 'Correct. More transactions increase money demand, and with a vertical supply, the rate rises.'],
  ], 3),
  q('fs6', 'financial-sector', 'The government increases its budget deficit and borrows to cover it. In the loanable funds market,', [
    ['demand rises and the real interest rate rises', 'Correct. Government borrowing adds to demand for loanable funds, pushing up the real interest rate.'],
    ['supply rises and the real interest rate falls', 'Borrowing adds to demand. A deficit reduces public saving, if anything.'],
    ['demand falls and the real interest rate falls', 'More borrowing means more demand, not less.'],
    ['nothing changes, because deficits are fiscal policy', 'Fiscal policy still affects the loanable funds market through government borrowing.'],
  ], 0),

  /* Stabilization policy */
  q('sp1', 'stabilization-policy', 'An increase in aggregate demand is shown on the Phillips curve graph as', [
    ['a shift of the long-run Phillips curve to the right', 'The LRPC only moves when the natural rate changes.'],
    ['a shift of the short-run Phillips curve to the right', 'SRPC shifts come from supply shocks or changes in expected inflation.'],
    ['a movement up and to the left along the short-run Phillips curve', 'Correct. Unemployment falls and inflation rises.'],
    ['a movement down and to the right along the short-run Phillips curve', 'That is what a decrease in AD looks like.'],
  ], 2),
  q('sp2', 'stabilization-policy', 'The long-run Phillips curve is vertical because', [
    ['in the long run, unemployment returns to its natural rate whatever the inflation rate', 'Correct. Once expectations adjust, there is no lasting trade-off.'],
    ['inflation cannot change in the long run', 'Inflation can change a lot in the long run. It just does not change unemployment.'],
    ['the central bank sets unemployment directly', 'Central banks influence demand, but they cannot hold unemployment below its natural rate permanently.'],
    ['wages never change in the long run', 'It is the other way around. In the long run wages fully adjust.'],
  ], 0),
  q('sp3', 'stabilization-policy', 'According to the quantity theory of money, if velocity and real output are constant and the money supply grows 8%, then', [
    ['real GDP grows 8%', 'The question holds real output constant.'],
    ['velocity falls 8%', 'Velocity is held constant here.'],
    ['the price level falls 8%', 'More money chasing the same output raises prices.'],
    ['the price level rises 8%', 'Correct. With M × V = P × Y and V and Y fixed, P changes by the same percentage as M.'],
  ], 3),
  q('sp4', 'stabilization-policy', 'Crowding out happens when', [
    ['government borrowing raises real interest rates and reduces private investment', 'Correct. The government competes with private borrowers for loanable funds.'],
    ['imports replace domestic production', 'That is about trade, not crowding out.'],
    ['the Fed buys bonds from banks', 'Buying bonds lowers interest rates, which is the opposite.'],
    ['higher taxes reduce consumer spending', 'That is simply contractionary fiscal policy.'],
  ], 0),
  q('sp5', 'stabilization-policy', 'Which policy is most likely to shift the long-run aggregate supply curve to the right?', [
    ['A cut in the reserve requirement', 'That is monetary policy, which shifts AD, not LRAS.'],
    ['An increase in government transfer payments', 'Transfers raise spending, which shifts AD.'],
    ['Public spending on education and job training', 'Correct. More human capital raises productivity and the economy’s long-run capacity.'],
    ['A temporary tax rebate', 'A temporary rebate boosts spending for a short time, shifting AD.'],
  ], 2),
  q('sp6', 'stabilization-policy', 'At a steady growth rate of 2% per year, real GDP per capita will double in about', [
    ['2 years', 'Doubling at 2% takes much longer. Use the rule of 70.'],
    ['35 years', 'Correct. 70 ÷ 2 = 35.'],
    ['50 years', 'That would be about a 1.4% growth rate.'],
    ['140 years', 'That multiplies 70 by 2 instead of dividing.'],
  ], 1),

  /* Open economy */
  q('oe1', 'open-economy', 'A Japanese company buys a factory in Tennessee. In the US balance of payments, this is recorded in', [
    ['the current account, as an export', 'The factory is an asset, not a good or service produced for export.'],
    ['the current account, as net investment income', 'Investment income is the interest and dividends earned on assets, not the purchase of the asset.'],
    ['the financial account, as an inflow', 'Correct. A foreign purchase of a US asset brings money into the US.'],
    ['the financial account, as an outflow', 'Money is coming into the US, so it is an inflow.'],
  ], 2),
  q('oe2', 'open-economy', 'If the United States has a current account deficit, it must have', [
    ['a trade surplus', 'A current account deficit usually comes with a trade deficit.'],
    ['a financial account surplus', 'Correct. Buying more from the world than it sells is paid for by selling assets or borrowing abroad.'],
    ['a budget deficit', 'The government budget is a separate measure. The two often move together but do not have to.'],
    ['a depreciating currency', 'Exchange rates can move either way with a current account deficit.'],
  ], 1),
  q('oe3', 'open-economy', 'The price of a euro rises from $1.10 to $1.25. This means', [
    ['the euro has appreciated and the dollar has depreciated', 'Correct. A euro now buys more dollars, and a dollar buys fewer euros.'],
    ['the dollar has appreciated and the euro has depreciated', 'It now takes more dollars to buy a euro, so the dollar is weaker.'],
    ['both currencies have appreciated', 'Against each other, one must rise while the other falls.'],
    ['US exports to Europe will become more expensive for Europeans', 'A weaker dollar makes US goods cheaper for Europeans.'],
  ], 0),
  q('oe4', 'open-economy', 'Real interest rates in the United States rise relative to those in Canada. In the foreign exchange market,', [
    ['demand for Canadian dollars rises and the Canadian dollar appreciates', 'Savers move funds toward the higher US return, not toward Canada.'],
    ['the US dollar depreciates because borrowing is more expensive', 'Higher rates attract funds into US assets, which raises demand for dollars.'],
    ['exchange rates do not change because trade in goods is unchanged', 'Capital flows affect exchange rates even if trade in goods has not changed.'],
    ['demand for US dollars rises and the US dollar appreciates', 'Correct. Canadians buy dollars to invest in higher-yielding US assets.'],
  ], 3),
  q('oe5', 'open-economy', 'The Fed carries out expansionary monetary policy. Through the exchange rate, this will most likely', [
    ['appreciate the dollar and reduce net exports', 'Lower US interest rates reduce demand for dollars, so the dollar depreciates.'],
    ['have no effect, because monetary policy only affects interest rates', 'Interest rates affect capital flows, which affect exchange rates.'],
    ['depreciate the dollar and increase net exports', 'Correct. Lower rates mean less demand for US assets, a weaker dollar, and cheaper US exports.'],
    ['depreciate the dollar and reduce net exports', 'A weaker dollar makes US exports cheaper, which raises net exports.'],
  ], 2),
  q('oe6', 'open-economy', 'Incomes in Europe fall sharply during a recession. In the market for euros (priced in dollars),', [
    ['supply of euros falls and the euro appreciates', 'Correct. Europeans buy fewer US goods, so they sell fewer euros for dollars.'],
    ['demand for euros rises and the euro appreciates', 'European incomes mainly affect what Europeans buy, which is the supply side of the euro market.'],
    ['supply of euros rises and the euro depreciates', 'With lower incomes, Europeans buy fewer imports and supply fewer euros.'],
    ['nothing changes, because incomes do not affect exchange rates', 'Relative incomes are one of the main things that move exchange rates.'],
  ], 0),
];

export const questionsFor = (unit: string) => questions.filter((x) => x.unit === unit);
