import { make } from './make';

const q = make('factor-markets');

// A firm selling its product in a perfectly competitive market for $4.
const hiring = { head: ['Workers', 'Total output'], rows: [[0, 0], [1, 10], [2, 18], [3, 24], [4, 28], [5, 30]] };
// A monopsonist: the wage it must pay to attract each number of workers, and each worker's MRP.
const monopsony = { head: ['Workers', 'Wage needed to attract them', 'Marginal revenue product'], rows: [[1, '$10', '$30'], [2, '$12', '$24'], [3, '$14', '$18'], [4, '$16', '$12']] };

export default [
  q('fm1', 'mi5.1', 1, 'The demand for pilots is called a derived demand because it', [
    ['comes from the demand for air travel', 'Correct. Airlines hire pilots because people buy flights.'],
    ['is set by the government', 'Derived demand is about where the demand comes from, not who sets it.'],
    ['is perfectly inelastic', 'Derived demand says nothing about elasticity.'],
    ['depends on the wage pilots ask for', 'The wage moves firms along the demand curve. It does not explain why the demand exists.'],
    ['rises whenever pilots’ wages rise', 'A higher wage lowers the quantity of pilots demanded.'],
  ], 0, { check: true }),
  q('fm2', 'mi5.3', 2, 'A competitive firm sells its product for $5. The fourth worker adds 6 units of output. The wage is $25. Should the firm hire the fourth worker?', [
    ['No, because 6 units is less than the wage of $25', 'You have to turn units into dollars first. MRP = 6 × $5 = $30.'],
    ['Yes, because the worker’s MRP of $30 is more than the wage of $25', 'Correct. The worker adds $30 of revenue and costs $25.'],
    ['No, because MRP is falling', 'MRP usually falls. What matters is whether it is still above MFC.'],
    ['Yes, because every worker adds output', 'Adding output is not enough. The added revenue must at least cover the added cost.'],
    ['Yes, because firms hire until MRP reaches zero', 'Firms hire until MRP equals the wage, not until MRP reaches zero.'],
  ], 1, { check: true }),
  q('fm3', 'mi5.2', 2, 'Which of the following would increase the demand for workers at a furniture factory?', [
    ['A rise in the workers’ wage', 'A higher wage moves the firm along its labor demand curve, lowering the quantity demanded.'],
    ['A fall in the price of furniture', 'A lower product price reduces MRP, which lowers labor demand.'],
    ['An increase in the workers’ productivity', 'Correct. Higher marginal product raises MRP at every level of employment.'],
    ['An increase in the number of people who want to work there', 'That shifts labor supply, not labor demand.'],
    ['A fall in the price of a machine that can replace these workers', 'Cheaper substitute capital leads firms to replace workers, which lowers labor demand.'],
  ], 2, { check: true }),
  q('fm4', 'mi5.3', 3, 'A firm uses labor and capital. The last worker adds 20 units and costs $10. The last machine adds 60 units and costs $40. To minimize cost, the firm should', [
    ['use more capital and less labor', 'Labor gives 2 units per dollar and capital gives 1.5, so the firm should shift toward labor.'],
    ['keep the same combination', 'The ratios are not equal (2 versus 1.5), so it is not minimizing cost yet.'],
    ['use less of both', 'Changing the mix, not the total amount, is what lowers cost for the same output.'],
    ['use more labor and less capital', 'Correct. MP ÷ price is 20/10 = 2 for labor and 60/40 = 1.5 for capital, so a dollar on labor goes further.'],
    ['use more capital, because each machine produces more units', 'What matters is output per dollar. Capital gives only 60 ÷ 40 = 1.5 units per dollar.'],
  ], 3, { check: true }),
  q('fm5', 'mi5.4', 2, 'Compared with a competitive labor market, a monopsony employer', [
    ['hires fewer workers and pays a lower wage', 'Correct. It hires where MRP = MFC, and MFC lies above labor supply, so both employment and pay are lower.'],
    ['hires more workers at a lower wage', 'Because MFC is above the wage, the monopsonist stops hiring sooner.'],
    ['hires the same number of workers at a lower wage', 'Employment is also lower, not just the wage.'],
    ['hires fewer workers at a higher wage', 'The monopsonist pays the lowest wage that attracts the workers it wants, which is below the competitive wage.'],
    ['hires the same number of workers at the same wage', 'Because MFC is above the wage, the monopsonist hires fewer workers and pays less.'],
  ], 0, { check: true }),
  q('fm6', 'mi5.4', 2, 'Why is the marginal factor cost curve above the labor supply curve for a monopsony?', [
    ['Because the firm pays higher taxes than competitive firms', 'Taxes are not what separates MFC from supply.'],
    ['Because workers in a monopsony are more productive', 'Productivity affects MRP, the demand side.'],
    ['Because to hire one more worker it must raise the wage for all its workers', 'Correct. The extra cost of a worker includes the raise given to everyone already employed.'],
    ['Because it faces a horizontal supply curve', 'A horizontal supply curve is the competitive case, where MFC equals the wage.'],
    ['Because a minimum wage is in place', 'MFC is above supply for a monopsony even with no minimum wage.'],
  ], 2, { check: true }),

  q('fm7', 'mi5.1', 1, 'In factor markets,', [
    ['households buy goods and services from firms', 'That happens in product markets.'],
    ['the government sets every wage', 'Wages are mostly set by supply and demand.'],
    ['firms sell finished goods to other countries', 'That is trade in product markets.'],
    ['banks buy labor from households', 'Any firm that hires workers buys labor, not only banks.'],
    ['firms buy labor, land, and capital from the households that own them', 'Correct. Households supply the factors of production and firms demand them.'],
  ], 4),
  q('fm8', 'mi5.3', 2, 'A firm sells its output in a perfectly competitive market for $4 a unit and hires workers in a competitive labor market at $20 a day. Using the table, how many workers should it hire?', [
    ['2', 'The third worker adds 6 units, or $24 of revenue, for $20 of cost, so hire that worker too.'],
    ['3', 'Correct. MRP is $40, $32, and $24 for the first three workers, all at least $20. The fourth adds only $16.'],
    ['4', 'The fourth worker adds 4 units, or $16, which is less than the $20 wage.'],
    ['5', 'The fifth worker adds only $8 of revenue.'],
    ['1', 'The second worker adds $32 of revenue for $20 of cost.'],
  ], 1, { table: hiring }),
  q('fm9', 'mi5.3', 2, 'A firm sells its output in a perfectly competitive market for $4 a unit. Using the table, what is the marginal revenue product of the fourth worker?', [
    ['$4', 'That is the marginal product (28 − 24). Multiply it by the $4 price.'],
    ['$28', 'That is total output with four workers.'],
    ['$112', 'That is total revenue with four workers (28 × $4).'],
    ['$16', 'Correct. Marginal product is 28 − 24 = 4 units, and 4 × $4 = $16.'],
    ['$7', 'That is average product (28 ÷ 4).'],
  ], 3, { table: hiring }),
  q('fm10', 'mi5.3', 3, 'A firm sells its output in a perfectly competitive market for $4 a unit. The market wage falls from $20 to $15 a day. Using the table, how does the firm’s hiring change?', [
    ['It rises from 3 to 4 workers', 'Correct. The fourth worker’s MRP of $16 now covers the $15 wage, but the fifth worker’s MRP of $8 does not.'],
    ['It stays at 3 workers', 'The fourth worker was not worth $20, but is worth $15.'],
    ['It rises from 3 to 5 workers', 'The fifth worker’s MRP is only $8.'],
    ['It falls from 3 to 2 workers', 'A lower wage makes more workers worth hiring, not fewer.'],
    ['It rises from 4 to 5 workers', 'At a $20 wage the firm hired 3 workers, not 4.'],
  ], 0, { table: hiring }),
  q('fm11', 'mi5.3', 2, 'A single firm hiring in a perfectly competitive labor market faces a labor supply curve that is', [
    ['upward sloping, because it must raise wages to hire more', 'That is the case for a monopsony.'],
    ['vertical, because the number of workers is fixed', 'The firm can hire as many as it wants at the market wage.'],
    ['downward sloping', 'Supply curves do not slope down.'],
    ['the same as the market labor demand curve', 'Demand and supply are different curves.'],
    ['horizontal at the market wage, so marginal factor cost equals the wage', 'Correct. The firm is a wage taker, so each extra worker costs exactly the market wage.'],
  ], 4),
  q('fm12', 'mi5.2', 2, 'The price of the furniture a factory produces rises sharply. In the market for furniture workers,', [
    ['labor supply shifts right and the wage falls', 'The product price affects the firms hiring workers, which is the demand side.'],
    ['labor demand shifts right, raising both the wage and employment', 'Correct. A higher product price raises each worker’s MRP.'],
    ['labor demand shifts left because furniture is more expensive to buy', 'Firms earn more from each worker’s output, so they want more workers.'],
    ['nothing changes, because wages are set separately from product prices', 'Labor demand is derived from the product’s value.'],
    ['the quantity of labor demanded rises along a fixed demand curve', 'The whole labor demand curve shifts when MRP changes.'],
  ], 1),
  q('fm13', 'mi5.2', 2, 'Many new workers move into a region and look for construction jobs. In the regional market for construction labor,', [
    ['labor demand shifts right and the wage rises', 'The number of workers affects labor supply.'],
    ['labor supply shifts left and the wage rises', 'More workers means supply increases.'],
    ['nothing changes until firms raise their output', 'More workers looking for jobs changes the market right away.'],
    ['labor supply shifts right, the wage falls, and employment rises', 'Correct. More people willing to work at each wage pushes the wage down and raises the number hired.'],
    ['the wage rises because more workers compete for jobs', 'More competition among workers lowers the wage.'],
  ], 3),
  q('fm14', 'mi5.2', 3, 'Workers in a warehouse operate forklifts, so forklifts and workers are complements in production. The price of forklifts falls sharply. The demand for warehouse workers will most likely', [
    ['increase, because firms buy more forklifts and need more workers to run them', 'Correct. When a complementary input gets cheaper, firms use more of it and more of the labor that goes with it.'],
    ['decrease, because forklifts replace workers', 'That would be true if forklifts were substitutes for workers, not complements.'],
    ['not change, because forklifts are capital', 'The price of other inputs affects labor demand.'],
    ['decrease, because the firm spends more on forklifts', 'Cheaper forklifts lower spending on each forklift.'],
    ['increase only if wages fall', 'A change in the wage moves along the demand curve. Here the curve itself shifts.'],
  ], 0),
  q('fm15', 'mi5.2 mi5.3', 3, 'The market wage for nurses rises. For a single hospital hiring in a perfectly competitive labor market, the result is that', [
    ['its labor demand curve shifts left', 'A higher wage does not change nurses’ MRP.'],
    ['it hires more nurses because each one is worth more', 'The wage changed, not the value of each nurse’s work.'],
    ['its horizontal supply curve of nurses shifts up, and it hires fewer nurses', 'Correct. MFC rises to the new wage, so the hospital hires until MRP equals the higher wage.'],
    ['it keeps hiring the same number of nurses', 'At a higher wage, the last few nurses’ MRP no longer covers their cost.'],
    ['it can pay less than the market wage', 'A firm in a competitive labor market must pay the market wage.'],
  ], 2),
  q('fm16', 'mi5.3', 2, 'A firm is using the least-cost combination of labor (L) and capital (K) when', [
    ['it uses more labor than capital', 'The right mix depends on productivity and prices, not on which input is used more.'],
    ['the marginal product of labor equals the marginal product of capital', 'The prices of the inputs also matter.'],
    ['the wage equals the price of capital', 'Equal prices say nothing about productivity.'],
    ['total cost is zero', 'Producing anything has a cost.'],
    ['the marginal product per dollar is the same for both: MPL ÷ PL = MPK ÷ PK', 'Correct. Then no dollar can be moved from one input to the other to produce the same output more cheaply.'],
  ], 4),
  q('fm17', 'mi5.3', 3, 'To maximize profit, not just minimize cost, a firm hiring labor (L) and capital (K) in competitive markets should use each input until', [
    ['MPL ÷ PL = MPK ÷ PK, whatever the level of output', 'That minimizes cost for a given output but does not pick the best output.'],
    ['the MRP of each input equals its price, so MRPL ÷ PL = MRPK ÷ PK = 1', 'Correct. Each input is hired until the last unit adds exactly as much revenue as it costs.'],
    ['total output is as large as possible', 'The largest output can cost more than it brings in.'],
    ['the marginal product of each input is zero', 'Stopping at zero marginal product would mean paying for inputs that add nothing.'],
    ['the firm spends the same amount on each input', 'Equal spending is not the rule. Each input’s revenue must cover its price.'],
  ], 1),
  q('fm18', 'mi5.4', 1, 'A monopsony is a market in which', [
    ['one firm sells a product with no close substitutes', 'That is monopoly.'],
    ['a few firms sell identical products', 'That is an oligopoly.'],
    ['workers form a union', 'A union is a seller of labor, not a single buyer.'],
    ['there is a single buyer of a factor of production, such as labor', 'Correct. A company town where one employer hires most workers is the classic example.'],
    ['many firms hire from a large pool of workers', 'That is a competitive labor market.'],
  ], 3),
  q('fm19', 'mi5.4', 3, 'The table shows the wage a monopsonist must pay to attract each number of workers. It must pay every worker the same wage. What is the marginal factor cost of the third worker?', [
    ['$18', 'Correct. Total labor cost rises from $24 (2 × $12) to $42 (3 × $14), an increase of $18.'],
    ['$14', 'That is the wage of the third worker. The firm must also raise the first two workers’ pay by $2 each.'],
    ['$42', 'That is total labor cost with three workers.'],
    ['$2', 'That is only the raise per worker.'],
    ['$16', 'That is the wage needed to attract a fourth worker.'],
  ], 0, { table: monopsony }),
  q('fm20', 'mi5.4', 3, 'The table shows the wage a monopsonist must pay to attract each number of workers, which it pays to all of them, and each worker’s MRP. How many workers will it hire, and at what wage?', [
    ['4 workers at $16', 'The fourth worker’s MFC is $64 − $42 = $22, more than the $12 MRP.'],
    ['2 workers at $12', 'The third worker’s MFC ($18) is covered by its MRP ($18).'],
    ['3 workers at $18', 'The firm pays the wage needed to attract 3 workers, which is $14, not the MFC.'],
    ['4 workers at $12, where MRP equals the wage', 'A monopsonist compares MRP with MFC, not with the wage.'],
    ['3 workers at $14', 'Correct. MFC is $10, $14, $18, $22. Hire while MRP ≥ MFC, which is 3 workers, then pay the $14 wage the supply schedule requires.'],
  ], 4, { table: monopsony }),
  q('fm21', 'mi5.4 mi2.8', 3, 'A labor market has a monopsony employer. The government sets a minimum wage above the monopsony wage but below the competitive wage. Employment will', [
    ['fall, as it always does when a minimum wage binds', 'In a competitive market it would fall, but a monopsony is different.'],
    ['stay the same, because the minimum wage is below the competitive wage', 'The minimum wage changes the monopsonist’s marginal factor cost.'],
    ['rise, because the minimum wage becomes the firm’s marginal factor cost over a range of hiring', 'Correct. The firm no longer has to raise everyone’s pay to hire one more worker, so it hires more.'],
    ['rise above the competitive level', 'At a wage below the competitive wage, employment stays at or below the competitive level.'],
    ['fall to zero', 'The firm still earns more from workers than they cost.'],
  ], 2),
  q('fm22', 'mi5.3', 2, 'A firm selling in a perfectly competitive product market and hiring in a competitive labor market has a demand curve for labor that is', [
    ['its average product curve', 'Average product does not measure the value of the next worker.'],
    ['its marginal revenue product curve', 'Correct. At each wage, the firm hires until MRP equals that wage.'],
    ['horizontal at the market wage', 'That is the labor supply curve the firm faces.'],
    ['its marginal cost curve', 'Marginal cost is about producing output, not hiring labor.'],
    ['vertical', 'The firm hires more workers at lower wages.'],
  ], 1),
  q('fm23', 'mi5.2', 1, 'Which of the following would increase the supply of labor to the nursing industry?', [
    ['A rise in the price of hospital services', 'That raises the demand for nurses, not the supply.'],
    ['A rise in wages for jobs that need similar skills', 'Better pay elsewhere draws workers away, which reduces supply to nursing.'],
    ['A rise in nurses’ wages', 'A higher wage moves along the supply curve.'],
    ['Better working conditions and benefits for nurses', 'Correct. Non-wage improvements make more people willing to work at every wage.'],
    ['New machines that do some nursing tasks', 'That affects the demand for nurses.'],
  ], 3),
  q('fm24', 'mi5.3 mi3.1', 2, 'For a firm selling in a perfectly competitive product market, marginal revenue product falls as it hires more workers because', [
    ['marginal product falls as more workers share fixed inputs', 'Correct. The product price is constant, so MRP falls only because each worker adds less output.'],
    ['the price of the product falls as the firm sells more', 'A competitive firm is a price taker, so its price does not fall.'],
    ['the wage rises as the firm hires more', 'The wage is set by the market and does not change MRP.'],
    ['total output falls', 'Total output keeps rising, just more slowly.'],
    ['fixed costs rise', 'Fixed costs do not change with hiring.'],
  ], 0),
];
