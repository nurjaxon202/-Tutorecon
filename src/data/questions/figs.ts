// The graphs used by questions. Each is a function, so every question gets
// its own copy with its own ids.
import type { Plot, Pt } from '../../scripts/graphs/core';
import { figure } from './figures';

const dots = (p: Plot, pts: [number, number, string][], dx = 9, dy = -9) => {
  for (const [x, y, t] of pts) {
    p.dot(x, y, 'g-dot', 5);
    p.label([x, y], t, 'g-label-ink', dx, dy);
  }
};

/* Foundations */

export const ppcPoints = () =>
  figure(
    'A production possibilities curve bowed out from the origin, with consumer goods on the horizontal axis and capital goods on the vertical axis. Point A lies inside the curve, points B and C lie on the curve, and point D lies outside the curve.',
    'Consumer goods',
    'Capital goods',
    (p) => {
      const f = (x: number) => 9 - (x * x) / 9;
      p.fn(f, 'g-curve g-demand', 0, 9);
      p.note([8.2, 3.2], 'PPC', 'start', 'g-label g-label-demand');
      dots(p, [
        [3, 4, 'A'],
        [3, 8, 'B'],
        [6, 5, 'C'],
        [7, 8, 'D'],
      ]);
    },
  );

export const ppcShift = () =>
  figure(
    'Two production possibilities curves bowed out from the origin, with consumer goods on the horizontal axis and capital goods on the vertical axis. PPC2 lies entirely outside PPC1, showing an outward shift.',
    'Consumer goods',
    'Capital goods',
    (p) => {
      p.fn((x) => 6.5 - (x * x) / 6.5, 'g-curve g-ghost', 0, 6.5);
      p.fn((x) => 9 - (x * x) / 9, 'g-curve g-demand', 0, 9);
      p.note([4.3, 4.2], 'PPC_1', 'end', 'g-label g-label-ghost');
      p.note([7.5, 4.3], 'PPC_2', 'start', 'g-label g-label-demand');
    },
  );

/* Supply and demand */

export const ceilingFig = () =>
  figure(
    'A market with a downward-sloping demand curve D and an upward-sloping supply curve S that cross at price PE and quantity QE. A horizontal price ceiling is drawn at Pc, below PE. At Pc, quantity supplied is Q1 and quantity demanded is Q2, with Q1 less than QE and Q2 greater than QE.',
    'Quantity',
    'Price',
    (p) => {
      p.line([[0, 9], [9, 0]], 'g-curve g-demand');
      p.line([[0, 1], [8.5, 9.5]], 'g-curve g-supply');
      p.note([8.6, 0.6], 'D', 'start', 'g-label g-label-demand');
      p.note([8.2, 9.1], 'S', 'end', 'g-label g-label-supply');
      p.hline(3, 'g-curve g-third', 0, 9.5);
      p.note([9.4, 3.3], 'Price ceiling', 'end', 'g-label g-label-third');
      p.guides(4, 5, 'QE', 'PE');
      p.guides(2, 3, 'Q1', 'Pc');
      p.guides(6, 3, 'Q2');
      p.dot(4, 5, 'g-dot g-dot-eq', 5);
    },
  );

export const taxFig = () =>
  figure(
    'A market with demand curve D, supply curve S, and a second supply curve S plus tax shifted up by a per-unit tax. Before the tax, the market clears at price P0 and quantity Q0. After the tax, quantity is Qt, buyers pay Pb, and sellers keep Ps. Area A is the triangle below demand and above Pb. Area B is the rectangle between Pb and P0 out to Qt. Area D is the rectangle between P0 and Ps out to Qt. Areas C and E are the two small triangles between Qt and Q0, C above P0 and E below it. Area F is the triangle above supply and below Ps.',
    'Quantity',
    'Price',
    (p) => {
      p.area([[0, 9], [0, 6], [3, 6]], 'fill-q', 'A', [1, 7]);
      p.area([[0, 6], [3, 6], [3, 5], [0, 5]], 'fill-q', 'B', [1.1, 5.5]);
      p.area([[3, 6], [4, 5], [3, 5]], 'fill-q', 'C', [3.33, 5.33]);
      p.area([[0, 5], [3, 5], [3, 4], [0, 4]], 'fill-q', 'D', [0.6, 4.5]);
      p.area([[3, 5], [4, 5], [3, 4]], 'fill-q', 'E', [3.33, 4.67]);
      p.area([[0, 4], [3, 4], [0, 1]], 'fill-q', 'F', [1, 3]);
      p.line([[0, 9], [9, 0]], 'g-curve g-demand');
      p.line([[0, 1], [8.5, 9.5]], 'g-curve g-supply');
      p.line([[0, 3], [6.5, 9.5]], 'g-curve g-supply g-dashed');
      p.note([6.9, 2.5], 'D', 'end', 'g-label g-label-demand');
      p.note([6.9, 8.3], 'S', 'end', 'g-label g-label-supply');
      p.note([6.1, 9.5], 'S + tax', 'end', 'g-label g-label-supply');
      p.guides(3, 6, 'Qt', 'Pb');
      p.guides(4, 5, 'Q0', 'P0');
      p.guides(3, 4, undefined, 'Ps');
    },
    { xMax: 7, h: 360 },
  );

export const tariffFig = () =>
  figure(
    'Domestic demand D and domestic supply S for a good, with the world price Pw and a higher price Pt equal to the world price plus a tariff. At Pw, domestic firms supply Q1 and buyers demand Q4. At Pt, domestic firms supply Q2 and buyers demand Q3. Area A is the triangle below demand and above Pt. Area B lies between Pw and Pt to the left of supply. Area C is the triangle between Q1 and Q2 below Pt and above Pw. Area D is the rectangle between Q2 and Q3 from Pw to Pt. Area E is the triangle between Q3 and Q4 below demand and above Pw.',
    'Quantity',
    'Price',
    (p) => {
      p.area([[0, 10], [0, 4], [6, 4]], 'fill-q', 'A', [2, 6]);
      p.area([[0, 2], [0, 4], [4, 4], [2, 2]], 'fill-q', 'B', [1.5, 3]);
      p.area([[2, 2], [4, 4], [4, 2]], 'fill-q', 'C', [3.33, 2.67]);
      p.area([[4, 2], [6, 2], [6, 4], [4, 4]], 'fill-q', 'D', [5, 3]);
      p.area([[6, 4], [8, 2], [6, 2]], 'fill-q', 'E', [6.67, 2.67]);
      p.line([[0, 10], [10, 0]], 'g-curve g-demand');
      p.line([[0, 0], [9.5, 9.5]], 'g-curve g-supply');
      p.hline(2, 'g-curve g-third', 0, 9.6);
      p.hline(4, 'g-curve g-third g-dashed', 0, 9.6);
      p.note([9.7, 0.7], 'D', 'end', 'g-label g-label-demand');
      p.note([9.2, 9.6], 'S', 'end', 'g-label g-label-supply');
      p.guides(2, 2, 'Q1', 'Pw');
      p.guides(4, 4, 'Q2', 'Pt');
      p.guides(6, 4, 'Q3');
      p.guides(8, 2, 'Q4');
    },
  );

/* Production and cost */

const AVC = (q: number) => 3 + 0.12 * (q - 5) ** 2;
const ATC = (q: number) => AVC(q) + 8 / q;
const MC = (q: number) => 3 + 0.12 * (q - 5) * (3 * q - 5);

export const costFig = () =>
  figure(
    'Cost curves for a perfectly competitive firm: marginal cost MC, average total cost ATC, and average variable cost AVC. MC crosses AVC at its lowest point, which is at price P1, and crosses ATC at its lowest point, which is at price P3. Price P2 lies between P1 and P3, and price P4 lies above P3.',
    'Quantity',
    'Price and cost',
    (p) => {
      for (const [v, t] of [[6.5, 'P_4'], [4.45, 'P_3'], [3.75, 'P_2'], [3, 'P_1']] as [number, string][]) {
        p.hline(v, 'g-guide', 0, 10);
        p.tag('y', v, t.replace('_', ''));
      }
      const mc = p.fn(MC, 'g-curve g-supply', 1.6, 7.6);
      const atc = p.fn(ATC, 'g-curve g-demand', 1.4, 9.6);
      const avc = p.fn(AVC, 'g-curve g-third', 0.8, 9.6);
      p.label(mc, 'MC', 'g-label-supply', 6, 4);
      p.label(atc, 'ATC', 'g-label-demand', -30, -8);
      p.label(avc, 'AVC', 'g-label-third', -30, 16);
    },
    { yMax: 8, h: 340 },
  );

/* Imperfect competition */

export const monopolyFig = () =>
  figure(
    'A monopolist with demand D, marginal revenue MR, and constant marginal cost equal to average total cost, drawn as a horizontal line MC = ATC. MR equals MC at quantity Qm, where demand gives price Pm. Demand meets MC at quantity Qc and price Pc. Area A is the triangle below demand and above Pm. Area B is the rectangle between Pm and Pc out to Qm. Area C is the triangle between Qm and Qc below demand and above MC. Area D is the rectangle below MC out to Qm, and area E is the rectangle below MC between Qm and Qc.',
    'Quantity',
    'Price and cost',
    (p) => {
      p.area([[0, 9], [0, 6], [4, 6]], 'fill-q', 'A', [2.4, 6.6]);
      p.area([[0, 6], [4, 6], [4, 3], [0, 3]], 'fill-q', 'B', [2, 4.5]);
      p.area([[4, 6], [4, 3], [8, 3]], 'fill-q', 'C', [5.33, 4]);
      p.area([[0, 3], [4, 3], [4, 0], [0, 0]], 'fill-q', 'D', [2, 1.5]);
      p.area([[4, 3], [8, 3], [8, 0], [4, 0]], 'fill-q', 'E', [7, 1.5]);
      p.line([[0, 9], [12, 0]], 'g-curve g-demand');
      p.line([[0, 9], [6, 0]], 'g-curve g-demand g-dashed');
      p.hline(3, 'g-curve g-supply', 0, 11.5);
      p.note([11.6, 0.6], 'D', 'end', 'g-label g-label-demand');
      p.note([5.9, 0.6], 'MR', 'start', 'g-label g-label-demand');
      p.note([11.5, 3.35], 'MC = ATC', 'end', 'g-label g-label-supply');
      p.guides(4, 6, 'Qm', 'Pm');
      p.guides(8, 3, 'Qc', 'Pc');
    },
    { xMax: 12 },
  );

export const monopCompFig = () =>
  figure(
    'A firm in monopolistic competition in long-run equilibrium. Its demand curve D is tangent to its average total cost curve ATC at quantity Q1 and price P1. Marginal revenue MR equals marginal cost MC at Q1, at the height P3. ATC reaches its lowest point at quantity Q2 and cost P2, where MC crosses it. Q2 is larger than Q1.',
    'Quantity',
    'Price and cost',
    (p) => {
      p.fn((x) => 3 + 0.15 * (x - 6) ** 2, 'g-curve g-supply', 1.6, 10);
      p.line([[0, 6], [10, 0]], 'g-curve g-demand');
      p.line([[0, 6], [5, 0]], 'g-curve g-demand g-dashed');
      const mc = p.fn((x) => -2.4 + 0.9 * x, 'g-curve g-third', 3, 9.8);
      p.note([9.95, 4.75], 'ATC', 'end', 'g-label g-label-supply');
      p.label(mc, 'MC', 'g-label-third', -26, 6);
      p.note([9.9, 0.45], 'D', 'end', 'g-label g-label-demand');
      p.note([4.6, 0.45], 'MR', 'start', 'g-label g-label-demand');
      p.guides(4, 3.6, 'Q1', 'P1');
      p.guides(6, 3, 'Q2', 'P2');
      p.guides(4, 1.2, undefined, 'P3');
      p.dot(4, 3.6, 'g-dot g-dot-eq', 5);
    },
    { yMax: 8, h: 340 },
  );

/* Factor markets */

export const monopsonyFig = () =>
  figure(
    'A labor market with one employer. The marginal revenue product curve MRP slopes down. The labor supply curve S slopes up, and the marginal factor cost curve MFC lies above it and is steeper. MRP equals MFC at quantity Q1 and height W1. The supply curve at Q1 gives wage W3. MRP crosses supply at quantity Q2 and wage W2, where Q2 is greater than Q1 and W2 lies between W3 and W1.',
    'Quantity of labor',
    'Wage',
    (p) => {
      p.line([[0, 9], [12, 0]], 'g-curve g-demand');
      p.line([[0, 1], [11, 6.5]], 'g-curve g-supply');
      p.line([[0, 1], [8.5, 9.5]], 'g-curve g-third');
      p.note([11.4, 0.6], 'MRP', 'end', 'g-label g-label-demand');
      p.note([11.2, 6.9], 'S', 'end', 'g-label g-label-supply');
      p.note([8.2, 9.3], 'MFC', 'end', 'g-label g-label-third');
      const q1 = 32 / 7;
      p.guides(q1, 1 + q1, undefined, 'W1');
      p.guides(6.4, 4.2, 'Q2', 'W2');
      p.guides(q1, 1 + 0.5 * q1, 'Q1', 'W3');
    },
    { xMax: 12 },
  );

/* Market failure */

export const externalityFig = () =>
  figure(
    'A market with a negative externality. Demand D is also marginal social benefit. Supply is marginal private cost MPC, and marginal social cost MSC lies above it by a constant amount. The market produces Qm where D meets MPC, at price Pm. The socially optimal quantity is Q* where D meets MSC, at price P*. Area A is the triangle between Q* and Qm bounded by MSC above and D below. Area B lies between MPC and MSC from zero to Q*. Area C lies below D and above MSC from zero to Q*. Area D is the triangle between Q* and Qm bounded by D above and MPC below.',
    'Quantity',
    'Price and cost',
    (p) => {
      p.area([[0, 9], [0, 3], [4.8, 5.4]], 'fill-q', 'C', [1.6, 5.8]);
      p.area([[0, 1], [0, 3], [4.8, 5.4], [4.8, 3.4]], 'fill-q', 'B', [2.4, 3.2]);
      p.area([[4.8, 5.4], [6.4, 6.2], [6.4, 4.2]], 'fill-q', 'A', [5.87, 5.27]);
      p.area([[4.8, 5.4], [6.4, 4.2], [4.8, 3.4]], 'fill-q', 'D', [5.33, 4.33]);
      p.line([[0, 9], [12, 0]], 'g-curve g-demand');
      p.line([[0, 1], [11, 6.5]], 'g-curve g-supply');
      p.line([[0, 3], [11, 8.5]], 'g-curve g-third');
      p.note([11.6, 0.6], 'D = MSB', 'end', 'g-label g-label-demand');
      p.note([11.3, 6.1], 'MPC', 'end', 'g-label g-label-supply');
      p.note([11.3, 8.9], 'MSC', 'end', 'g-label g-label-third');
      p.guides(6.4, 4.2, 'Qm', 'Pm');
      p.guides(4.8, 5.4, 'Q*', 'P*');
    },
    { xMax: 12 },
  );

export const lorenzFig = () =>
  figure(
    'A Lorenz curve for a country, with the cumulative share of households on the horizontal axis and the cumulative share of income on the vertical axis, both from 0 to 100 percent. A straight 45-degree line of equality runs from the origin to the top right corner. The Lorenz curve bows below it. Area A lies between the line of equality and the Lorenz curve. Area B lies below the Lorenz curve.',
    'Share of households (%)',
    'Share of income (%)',
    (p) => {
      const curve: Pt[] = [];
      for (let x = 0; x <= 100; x += 4) curve.push([x, 100 * (x / 100) ** 2.2]);
      p.area([[0, 0], [100, 100], ...[...curve].reverse()], 'fill-q', 'A', [56, 41]);
      p.area([...curve, [100, 0]], 'fill-q', 'B', [80, 18]);
      p.line([[0, 0], [100, 100]], 'g-curve g-third');
      p.line(curve, 'g-curve g-demand');
      p.note([38, 50], 'Line of equality', 'end', 'g-label g-label-third');
      p.note([58, 12], 'Lorenz curve', 'end', 'g-label g-label-demand');
    },
    { xMax: 100, yMax: 100, h: 340 },
  );

/* Economic indicators */

const trend = (x: number) => 3 + 0.4 * x;
const cycle = (x: number) => trend(x) + 1.6 * Math.sin(1.1 * x);

export const cycleFig = () =>
  figure(
    'A business cycle graph with time on the horizontal axis and real GDP on the vertical axis. A straight dashed line rising from left to right shows potential output. Actual real GDP moves above and below it in waves. Point A is at a high point of the wave, point B is on the way down, point C is at the low point, and point D is on the way back up.',
    'Time',
    'Real GDP',
    (p) => {
      p.fn(trend, 'g-curve g-third g-dashed', 0, 10);
      p.fn(cycle, 'g-curve g-demand', 0, 10);
      p.note([9.95, 7.45], 'Potential', 'end', 'g-label g-label-third');
      const pts: [number, string][] = [
        [Math.PI / 2 / 1.1, 'A'],
        [Math.PI / 1.1, 'B'],
        [(3 * Math.PI) / 2 / 1.1, 'C'],
        [(2 * Math.PI) / 1.1, 'D'],
      ];
      for (const [x, t] of pts) {
        p.dot(x, cycle(x), 'g-dot', 5);
        const [dx, dy] = ({ A: [-4, -12], B: [-4, -14], C: [-4, 22], D: [9, 20] } as Record<string, [number, number]>)[t];
        p.label([x, cycle(x)], t, 'g-label-ink', dx, dy);
      }
    },
  );

/* National income */

export const adasGap = () =>
  figure(
    'An aggregate demand and aggregate supply graph with real GDP on the horizontal axis and the price level on the vertical axis. AD slopes down and SRAS slopes up. They cross at real GDP Y1 and price level PL1. A vertical long-run aggregate supply curve LRAS stands at full-employment output Yf, to the right of Y1.',
    'Real GDP',
    'Price level',
    (p) => {
      p.line([[0, 9], [9, 0]], 'g-curve g-demand');
      p.line([[0, 1], [8.5, 9.5]], 'g-curve g-supply');
      p.vline(6, 'g-curve g-third');
      p.note([8.8, 0.6], 'AD', 'end', 'g-label g-label-demand');
      p.note([8.1, 9.3], 'SRAS', 'end', 'g-label g-label-supply');
      p.note([6.15, 0.45], 'LRAS', 'start', 'g-label g-label-third');
      p.guides(4, 5, 'Y1', 'PL1');
      p.tag('x', 6, 'Yf');
      p.dot(4, 5, 'g-dot g-dot-eq', 5);
    },
  );

export const adasBoom = () =>
  figure(
    'An aggregate demand and aggregate supply graph with real GDP on the horizontal axis and the price level on the vertical axis. AD and SRAS cross at real GDP Y1 and price level PL1. A vertical LRAS curve stands at full-employment output Yf, to the left of Y1.',
    'Real GDP',
    'Price level',
    (p) => {
      p.line([[1, 10], [10, 1]], 'g-curve g-demand');
      p.line([[0, 1], [8.5, 9.5]], 'g-curve g-supply');
      p.vline(3.5, 'g-curve g-third');
      p.note([9.8, 1.6], 'AD', 'end', 'g-label g-label-demand');
      p.note([8.1, 9.3], 'SRAS', 'end', 'g-label g-label-supply');
      p.note([3.65, 0.45], 'LRAS', 'start', 'g-label g-label-third');
      p.guides(5, 6, 'Y1', 'PL1');
      p.tag('x', 3.5, 'Yf');
      p.dot(5, 6, 'g-dot g-dot-eq', 5);
    },
  );

export const adasShock = () =>
  figure(
    'An aggregate demand and aggregate supply graph. The economy starts at point A, where AD crosses SRAS1 on the vertical LRAS curve. SRAS2 lies to the left of SRAS1, and AD crosses SRAS2 at point B, which has a higher price level and lower real GDP than point A.',
    'Real GDP',
    'Price level',
    (p) => {
      p.line([[0, 9], [9, 0]], 'g-curve g-demand');
      p.line([[0, 1], [8.5, 9.5]], 'g-curve g-ghost');
      p.line([[0, 3], [6.5, 9.5]], 'g-curve g-supply');
      p.vline(4, 'g-curve g-third');
      p.note([8.8, 0.6], 'AD', 'end', 'g-label g-label-demand');
      p.note([8.3, 9.4], 'SRAS_1', 'end', 'g-label g-label-ghost');
      p.note([6.4, 9.4], 'SRAS_2', 'end', 'g-label g-label-supply');
      p.note([4.15, 0.45], 'LRAS', 'start', 'g-label g-label-third');
      dots(p, [
        [4, 5, 'A'],
        [3, 6, 'B'],
      ], 10, 4);
    },
  );

/* Financial sector */

export const moneyFig = () =>
  figure(
    'A money market graph with the quantity of money on the horizontal axis and the nominal interest rate on the vertical axis. Money demand MD slopes down. A vertical money supply curve MS1 is at quantity M1, and a second vertical curve MS2 is at a larger quantity M2. MD crosses MS1 at interest rate i1 and MS2 at a lower interest rate i2.',
    'Quantity of money',
    'Nominal interest rate',
    (p) => {
      p.line([[0, 9], [11, 0.2]], 'g-curve g-demand');
      p.vline(4, 'g-curve g-ghost');
      p.vline(6, 'g-curve g-supply');
      p.note([10.9, 1.1], 'MD', 'end', 'g-label g-label-demand');
      p.note([4.2, 9.4], 'MS_1', 'start', 'g-label g-label-ghost');
      p.note([6.2, 9.4], 'MS_2', 'start', 'g-label g-label-supply');
      p.guides(4, 5.8, 'M1', 'i1');
      p.guides(6, 4.2, 'M2', 'i2');
    },
    { xMax: 11 },
  );

export const loanableFig = () =>
  figure(
    'A loanable funds market with the quantity of loanable funds on the horizontal axis and the real interest rate on the vertical axis. Supply S slopes up. Demand D1 slopes down, and a second demand curve D2 lies to its right. D1 crosses S at real interest rate r1 and quantity Q1. D2 crosses S at a higher real interest rate r2 and a larger quantity Q2.',
    'Quantity of loanable funds',
    'Real interest rate',
    (p) => {
      p.line([[0, 1], [10, 9]], 'g-curve g-supply');
      p.line([[0, 9], [10, 1]], 'g-curve g-ghost');
      p.line([[1.25, 10], [11, 2.2]], 'g-curve g-demand');
      p.note([9.8, 9.3], 'S', 'end', 'g-label g-label-supply');
      p.note([9.8, 0.6], 'D_1', 'end', 'g-label g-label-ghost');
      p.note([10.9, 1.6], 'D_2', 'end', 'g-label g-label-demand');
      p.guides(5, 5, 'Q1', 'r1');
      p.guides(6.25, 6, 'Q2', 'r2');
    },
    { xMax: 11 },
  );

/* Stabilization policy */

export const phillipsFig = () =>
  figure(
    'A Phillips curve graph with the unemployment rate on the horizontal axis and the inflation rate on the vertical axis. A vertical long-run Phillips curve LRPC stands at the natural rate of unemployment. Two downward-sloping short-run Phillips curves are shown, SRPC1 and a higher SRPC2. Point A is where SRPC1 meets LRPC. Point B is on SRPC1 up and to the left of A. Point C is where SRPC2 meets LRPC, directly above A. Point D is on SRPC1 down and to the right of A.',
    'Unemployment rate (%)',
    'Inflation rate (%)',
    (p) => {
      p.fn((x) => 2 + 1.2 * (5 - x), 'g-curve g-demand', 1, 6.66);
      p.fn((x) => 3.8 + 1.2 * (5 - x), 'g-curve g-supply', 2.5, 8.1);
      p.vline(5, 'g-curve g-third');
      p.note([1.25, 7.25], 'SRPC_1', 'start', 'g-label g-label-demand');
      p.note([8.25, 0.5], 'SRPC_2', 'start', 'g-label g-label-supply');
      p.note([5.2, 7.6], 'LRPC', 'start', 'g-label g-label-third');
      dots(p, [
        [5, 2, 'A'],
        [3.5, 3.8, 'B'],
        [5, 3.8, 'C'],
        [6.5, 0.2, 'D'],
      ]);
    },
    { yMax: 8, h: 330 },
  );

/* Open economy */

export const forexFig = () =>
  figure(
    'The foreign exchange market for US dollars, with the quantity of dollars on the horizontal axis and the price of a dollar in euros on the vertical axis. Supply S slopes up. Demand D1 slopes down, and a second demand curve D2 lies to its right. D1 crosses S at exchange rate E1. D2 crosses S at a higher exchange rate E2.',
    'Quantity of dollars',
    'Euros per dollar',
    (p) => {
      p.line([[0, 1], [10, 9]], 'g-curve g-supply');
      p.line([[0, 9], [10, 1]], 'g-curve g-ghost');
      p.line([[1.25, 10], [11, 2.2]], 'g-curve g-demand');
      p.note([9.8, 9.3], 'S', 'end', 'g-label g-label-supply');
      p.note([9.8, 0.6], 'D_1', 'end', 'g-label g-label-ghost');
      p.note([10.9, 1.6], 'D_2', 'end', 'g-label g-label-demand');
      p.guides(5, 5, 'Q1', 'E1');
      p.guides(6.25, 6, 'Q2', 'E2');
    },
    { xMax: 11 },
  );
