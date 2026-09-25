// Interactive diagram definitions. Each entry returns a Setup: axes, controls,
// optional news scenarios, a draw function, and a plain-language readout.

import { Plot, money, pct, num, clamp, type Axis, type Pt } from './core';

export type State = Record<string, number | string | boolean>;

export type Control =
  | { type: 'range'; key: string; label: string; min: number; max: number; step: number; fmt?: (v: number) => string }
  | { type: 'toggle'; key: string; label: string }
  | { type: 'choice'; key: string; label: string; options: { value: string; label: string }[] };

export interface Scenario {
  label: string;
  /** Target values, or a function of the current state. Numbers animate. */
  set: State | ((s: State) => State);
  note: string;
  /**
   * The four moves a tutor walks through for any shift question:
   * what changed, which curve, which way, and what happens.
   */
  moves?: [string, string, string, string];
  /** Which curve to highlight while the moves play. */
  hl?: string;
}

export const MOVE_TITLES = ['What changed?', 'Which curve?', 'Which way?', 'What happens?'];

export interface Setup {
  title: string;
  x: Axis;
  y: Axis;
  ratio?: number;
  initial: State;
  controls: Control[];
  scenarios?: Scenario[];
  draw(p: Plot, s: State): void;
  describe(s: State): string;
  drag?(id: string, pt: Pt, s: State, start: State, startPt: Pt): State | null;
}

const n = (s: State, k: string) => Number(s[k]);
const b = (s: State, k: string) => Boolean(s[k]);
const moved = (from: number, to: number, eps = 0.005) =>
  Math.abs(to - from) < eps ? 'stays' : to > from ? 'rises' : 'falls';
const v = (t: string) => `<span class="mono">${t}</span>`;

/* ------------------------------------------------------------------ */
/* Supply and demand, with price controls and taxes                    */
/* ------------------------------------------------------------------ */

interface MarketParams {
  title: string;
  a: number; // demand: P = a - b(Q - dShift)
  b: number;
  c: number; // supply: P = c + d(Q - sShift)
  d: number;
  x: Axis;
  y: Axis;
  dName?: string;
  sName?: string;
  qUnit: string;
  fmtP: (v: number) => string;
  fmtQ?: (v: number) => string;
  buyers?: string;
  sellers?: string;
  mode?: 'basic' | 'ceiling' | 'floor' | 'tax';
  shiftRange?: number;
  controls?: string[];
  initial?: State;
  scenarios?: Scenario[];
  ceiling?: [number, number, number];
  floor?: [number, number, number];
  tax?: [number, number, number];
  surplusWord?: string;
  shortageWord?: string;
}

function market(p: MarketParams): Setup {
  const mode = p.mode ?? 'basic';
  const dName = p.dName ?? 'D';
  const sName = p.sName ?? 'S';
  const buyers = p.buyers ?? 'buyers';
  const sellers = p.sellers ?? 'sellers';
  const fq = p.fmtQ ?? ((q: number) => num(q));
  const range = p.shiftRange ?? 30;

  const fns = (s: State) => {
    const slope = s.bSlope !== undefined ? n(s, 'bSlope') : p.b;
    const dS = n(s, 'dShift');
    const sS = n(s, 'sShift');
    const Pd = (q: number) => p.a - slope * (q - dS);
    const Qd = (P: number) => (p.a - P) / slope + dS;
    const Ps = (q: number) => p.c + p.d * (q - sS);
    const Qs = (P: number) => (P - p.c) / p.d + sS;
    const Qe = (p.a - p.c + slope * dS + p.d * sS) / (slope + p.d);
    const Pe = Pd(Qe);
    return { slope, dS, sS, Pd, Qd, Ps, Qs, Qe, Pe };
  };

  const base = fns({ dShift: 0, sShift: 0 });

  const all: Record<string, Control> = {
    dShift: { type: 'range', key: 'dShift', label: `Shift demand`, min: -range, max: range, step: 1, fmt: (x) => (x === 0 ? 'none' : x > 0 ? `right ${x}` : `left ${-x}`) },
    sShift: { type: 'range', key: 'sShift', label: `Shift supply`, min: -range, max: range, step: 1, fmt: (x) => (x === 0 ? 'none' : x > 0 ? `right ${x}` : `left ${-x}`) },
    surplus: { type: 'toggle', key: 'surplus', label: 'Shade consumer and producer surplus' },
    ceiling: { type: 'range', key: 'ceiling', label: 'Price ceiling', min: p.ceiling?.[0] ?? 0, max: p.ceiling?.[1] ?? 10, step: p.ceiling?.[2] ?? 0.25, fmt: p.fmtP },
    floor: { type: 'range', key: 'floor', label: 'Price floor', min: p.floor?.[0] ?? 0, max: p.floor?.[1] ?? 10, step: p.floor?.[2] ?? 0.25, fmt: p.fmtP },
    tax: { type: 'range', key: 'tax', label: 'Tax per unit', min: p.tax?.[0] ?? 0, max: p.tax?.[1] ?? 4, step: p.tax?.[2] ?? 0.25, fmt: p.fmtP },
    bSlope: {
      type: 'range', key: 'bSlope', label: 'How much buyers react to price', min: 0.04, max: 0.4, step: 0.01,
      fmt: (x) => (x < 0.08 ? 'a lot (elastic)' : x > 0.25 ? 'very little (inelastic)' : 'somewhat'),
    },
  };

  const initial: State = { dShift: 0, sShift: 0, surplus: false, ceiling: p.ceiling?.[0] ?? 0, floor: p.floor?.[1] ?? 0, tax: 0, ...p.initial };
  const controls = (p.controls ?? ['dShift', 'sShift', 'surplus']).map((k) => all[k]);

  const drawCurves = (pl: Plot, f: ReturnType<typeof fns>, shifted: boolean) => {
    const dl = pl.fn(f.Pd, 'g-curve g-demand');
    const sl = pl.fn(f.Ps, 'g-curve g-supply');
    pl.label(dl, shifted && f.dS !== 0 ? `${dName}_2` : dName, 'g-label-demand', 8, -6);
    pl.label(sl, shifted && f.sS !== 0 ? `${sName}_2` : sName, 'g-label-supply', 8, 14);
    return { dl, sl };
  };

  return {
    title: p.title,
    x: p.x,
    y: p.y,
    initial,
    controls,
    scenarios: p.scenarios,

    draw(pl, s) {
      const f = fns(s);
      pl.grid();
      pl.axes();

      if (mode === 'basic') {
        const shifted = f.dS !== 0 || f.sS !== 0;
        if (f.dS !== 0) {
          const g = pl.fn(base.Pd, 'g-curve g-demand g-ghost');
          pl.label(g, `${dName}_1`, 'g-label-demand g-label-ghost', -10, -6);
        }
        if (f.sS !== 0) {
          const g = pl.fn(base.Ps, 'g-curve g-supply g-ghost');
          pl.label(g, `${sName}_1`, 'g-label-supply g-label-ghost', -10, 14);
        }
        if (b(s, 'surplus')) {
          pl.area([[0, f.Pe], [0, f.Pd(0)], [f.Qe, f.Pe]], 'fill-cs', 'CS', [f.Qe / 3, (2 * f.Pe + f.Pd(0)) / 3]);
          const q0 = Math.max(0, f.Qs(0));
          const ps: Pt[] = [[0, f.Pe], [f.Qe, f.Pe], [q0, f.Ps(q0)]];
          if (q0 > 0) ps.push([q0, 0], [0, 0]);
          else ps.push([0, f.Ps(0)]);
          pl.area(ps, 'fill-ps', 'PS', [f.Qe / 3, (2 * f.Pe + Math.max(0, f.Ps(0))) / 3]);
        }
        if (s._hl === 'd') pl.glow(f.Pd);
        if (s._hl === 's') pl.glow(f.Ps);
        drawCurves(pl, f, shifted);
        if (shifted) {
          pl.dot(base.Qe, base.Pe, 'g-dot g-dot-ghost', 4);
          pl.axisArrow('y', base.Pe, f.Pe);
          pl.axisArrow('x', base.Qe, f.Qe);
        }
        pl.guides(f.Qe, f.Pe, fq(f.Qe), p.fmtP(f.Pe));
        pl.dot(f.Qe, f.Pe, 'g-dot g-dot-eq', 6);
        // Handles sit on the visible part of each curve, near its upper end.
        const dLo = Math.max(p.x.min, f.Qd(p.y.max));
        const dHi = Math.min(p.x.max, f.Qd(p.y.min));
        if (dHi > dLo) {
          const q = dLo + 0.14 * (dHi - dLo);
          pl.handle('d', q, f.Pd(q));
        }
        const sLo = Math.max(p.x.min, f.Qs(p.y.min));
        const sHi = Math.min(p.x.max, f.Qs(p.y.max));
        if (sHi > sLo) {
          const q = sHi - 0.14 * (sHi - sLo);
          pl.handle('s', q, f.Ps(q));
        }
        return;
      }

      if (mode === 'tax') {
        const t = n(s, 'tax');
        const Qt = (p.a - p.c - t + f.slope * f.dS + p.d * f.sS) / (f.slope + p.d);
        const Pb = f.Pd(Qt);
        const Pp = Pb - t;
        if (t > 0) {
          pl.area([[0, Pb], [0, f.Pd(0)], [Qt, Pb]], 'fill-cs', 'CS', [Qt / 3, (2 * Pb + f.Pd(0)) / 3]);
          pl.area([[0, Pp], [Qt, Pp], [0, f.Ps(0)]], 'fill-ps', 'PS', [Qt / 3, (2 * Pp + f.Ps(0)) / 3]);
          pl.area([[0, Pp], [0, Pb], [Qt, Pb], [Qt, Pp]], 'fill-tax', 'Tax revenue', [Qt / 2, (Pb + Pp) / 2]);
          pl.area([[Qt, Pb], [f.Qe, f.Pe], [Qt, Pp]], 'fill-dwl', undefined, undefined, true);
          const ts = pl.fn((q) => f.Ps(q) + t, 'g-curve g-supply g-shift');
          pl.label(ts, `${sName} + tax`, 'g-label-supply', 8, 14);
        }
        const dl = pl.fn(f.Pd, 'g-curve g-demand');
        const sl = pl.fn(f.Ps, t > 0 ? 'g-curve g-supply g-ghost' : 'g-curve g-supply');
        pl.label(dl, dName, 'g-label-demand', 8, -6);
        pl.label(sl, sName, 'g-label-supply', 8, 14);
        if (t > 0) {
          pl.guides(Qt, Pb, fq(Qt), p.fmtP(Pb));
          pl.guides(Qt, Pp, undefined, p.fmtP(Pp));
          pl.dot(f.Qe, f.Pe, 'g-dot g-dot-ghost', 4);
          pl.dot(Qt, Pb, 'g-dot g-dot-eq', 5);
          pl.dot(Qt, Pp, 'g-dot', 4);
        } else {
          pl.guides(f.Qe, f.Pe, fq(f.Qe), p.fmtP(f.Pe));
          pl.dot(f.Qe, f.Pe, 'g-dot g-dot-eq', 6);
        }
        return;
      }

      // Price ceiling or floor
      const isCeil = mode === 'ceiling';
      const P = n(s, isCeil ? 'ceiling' : 'floor');
      const binding = isCeil ? P < f.Pe - 1e-9 : P > f.Pe + 1e-9;
      if (binding) {
        const qs = f.Qs(P);
        const qd = f.Qd(P);
        const traded = Math.max(0, Math.min(qs, qd));
        if (isCeil) {
          pl.area([[0, P], [0, f.Pd(0)], [traded, f.Pd(traded)], [traded, P]], 'fill-cs', 'CS', [traded / 3, (P + f.Pd(traded)) / 2 + (f.Pd(0) - f.Pd(traded)) / 4]);
          pl.area([[0, P], [traded, P], [traded, f.Ps(traded)], [0, f.Ps(0)]], 'fill-ps', 'PS', [traded / 3, (P + f.Ps(0)) / 2]);
        } else {
          pl.area([[0, P], [0, f.Pd(0)], [traded, P]], 'fill-cs', 'CS', [traded / 3, (2 * P + f.Pd(0)) / 3]);
          pl.area([[0, P], [traded, P], [traded, f.Ps(traded)], [0, f.Ps(0)]], 'fill-ps', 'PS', [traded / 3, (P + f.Ps(0)) / 2]);
        }
        pl.area([[traded, f.Pd(traded)], [f.Qe, f.Pe], [traded, f.Ps(traded)]], 'fill-dwl', undefined, undefined, true);
      }
      drawCurves(pl, f, false);
      pl.hline(P, 'g-control-line');
      pl.note([p.x.max * 0.98, P + (p.y.max - p.y.min) * (isCeil ? -0.045 : 0.03)], isCeil ? 'Price ceiling' : 'Price floor', 'end', 'g-note g-note-strong');
      if (binding) {
        const qs = f.Qs(P);
        const qd = f.Qd(P);
        pl.span(qs, qd, P, isCeil ? p.shortageWord ?? 'Shortage' : p.surplusWord ?? 'Surplus', 'g-span', !isCeil);
        pl.guides(qs, P, fq(qs), p.fmtP(P));
        pl.guides(qd, P, fq(qd));
        pl.dot(qs, P, 'g-dot', 4.5);
        pl.dot(qd, P, 'g-dot', 4.5);
        pl.dot(f.Qe, f.Pe, 'g-dot g-dot-ghost', 4);
      } else {
        pl.guides(f.Qe, f.Pe, fq(f.Qe), p.fmtP(f.Pe));
        pl.dot(f.Qe, f.Pe, 'g-dot g-dot-eq', 6);
      }
    },

    describe(s) {
      const f = fns(s);
      if (mode === 'basic') {
        if (f.dS === 0 && f.sS === 0) {
          return `Equilibrium price is ${v(p.fmtP(f.Pe))} and quantity is ${v(fq(f.Qe))} ${p.qUnit}. At this price the amount ${buyers} want to buy equals the amount ${sellers} want to sell.`;
        }
        return `Price ${moved(base.Pe, f.Pe)} from ${v(p.fmtP(base.Pe))} to ${v(p.fmtP(f.Pe))}. Quantity ${moved(base.Qe, f.Qe, 0.05)} from ${v(fq(base.Qe))} to ${v(fq(f.Qe))} ${p.qUnit}.`;
      }
      if (mode === 'tax') {
        const t = n(s, 'tax');
        if (t <= 0) return `No tax yet. Equilibrium price is ${v(p.fmtP(f.Pe))} and quantity is ${v(fq(f.Qe))} ${p.qUnit}. Move the tax slider to add one.`;
        const Qt = (p.a - p.c - t + f.slope * f.dS + p.d * f.sS) / (f.slope + p.d);
        const Pb = f.Pd(Qt);
        const Pp = Pb - t;
        const share = Math.round(((Pb - f.Pe) / t) * 100);
        return `${buyers[0].toUpperCase() + buyers.slice(1)} now pay ${v(p.fmtP(Pb))} and ${sellers} keep ${v(p.fmtP(Pp))}. Quantity falls from ${v(fq(f.Qe))} to ${v(fq(Qt))} ${p.qUnit}. ${buyers[0].toUpperCase() + buyers.slice(1)} carry ${v(`${share}%`)} of the tax and ${sellers} carry ${v(`${100 - share}%`)}. Tax revenue is ${v(money(t * Qt, 0))} and deadweight loss is ${v(money(0.5 * t * (f.Qe - Qt), 0))}.`;
      }
      const isCeil = mode === 'ceiling';
      const P = n(s, isCeil ? 'ceiling' : 'floor');
      const binding = isCeil ? P < f.Pe - 1e-9 : P > f.Pe + 1e-9;
      if (!binding) {
        return `The ${isCeil ? 'ceiling' : 'floor'} of ${v(p.fmtP(P))} is ${isCeil ? 'above' : 'below'} the equilibrium price of ${v(p.fmtP(f.Pe))}, so it does nothing. A ${isCeil ? 'ceiling' : 'floor'} only binds when it is ${isCeil ? 'below' : 'above'} equilibrium.`;
      }
      const qs = f.Qs(P);
      const qd = f.Qd(P);
      if (isCeil) {
        return `At ${v(p.fmtP(P))}, ${buyers} want ${v(fq(qd))} but ${sellers} offer only ${v(fq(qs))} ${p.qUnit}. That is a ${(p.shortageWord ?? 'shortage').toLowerCase()} of ${v(fq(qd - qs))}. The hatched triangle is deadweight loss: trades worth making that no longer happen.`;
      }
      return `At ${v(p.fmtP(P))}, ${sellers} offer ${v(fq(qs))} but ${buyers} want only ${v(fq(qd))} ${p.qUnit}. That leaves a ${(p.surplusWord ?? 'surplus').toLowerCase()} of ${v(fq(qs - qd))}. The hatched triangle is deadweight loss.`;
    },

    drag:
      mode === 'basic'
        ? (id, pt, s, start, startPt) => {
            const dx = pt[0] - startPt[0];
            if (id === 'd') return { ...s, dShift: Math.round(clamp(n(start, 'dShift') + dx, -range, range)) };
            if (id === 's') return { ...s, sShift: Math.round(clamp(n(start, 'sShift') + dx, -range, range)) };
            return null;
          }
        : undefined,
  };
}

/* ------------------------------------------------------------------ */
/* Production possibilities curve                                      */
/* ------------------------------------------------------------------ */

function ppc(): Setup {
  const X = 100;
  const Y = 100;
  const frontier = (x: number, g: number, straight: boolean) => {
    const Xg = X * g;
    const Yg = Y * g;
    if (x > Xg) return NaN;
    return straight ? Yg * (1 - x / Xg) : Yg * Math.sqrt(1 - (x / Xg) ** 2);
  };
  const status = (s: State) => {
    const g = n(s, 'growth') / 100;
    const x = n(s, 'x');
    const y = n(s, 'y');
    const straight = s.shape === 'straight';
    const fy = frontier(x, g, straight);
    if (!Number.isFinite(fy) || y > fy + 1.5) return 'outside';
    if (y < fy - 1.5) return 'inside';
    return 'on';
  };
  return {
    title: 'Production possibilities curve',
    x: { min: 0, max: 140, step: 5, major: 4, label: 'Consumer goods (thousand units)' },
    y: { min: 0, max: 140, step: 5, major: 4, label: 'Capital goods (thousand units)' },
    ratio: 0.8,
    initial: { x: 60, y: 80, growth: 100, shape: 'bowed' },
    controls: [
      { type: 'range', key: 'x', label: 'Consumer goods made', min: 0, max: 140, step: 1 },
      { type: 'range', key: 'y', label: 'Capital goods made', min: 0, max: 140, step: 1 },
      { type: 'range', key: 'growth', label: 'Resources and technology', min: 70, max: 135, step: 1, fmt: (x) => (x === 100 ? 'today' : `${x > 100 ? '+' : ''}${x - 100}%`) },
      { type: 'choice', key: 'shape', label: 'Opportunity cost', options: [{ value: 'bowed', label: 'Increasing' }, { value: 'straight', label: 'Constant' }] },
    ],
    scenarios: [
      {
        label: 'Move to the curve',
        set: (s) => {
          const g = n(s, 'growth') / 100;
          const x = clamp(n(s, 'x'), 0, X * g);
          return { x, y: Math.round(frontier(x, g, s.shape === 'straight')) };
        }, note: 'Every point on the curve uses all resources fully. To get more of one good, you must give up some of the other.' },
      { label: 'A recession idles factories', set: { x: 45, y: 50, growth: 100 }, note: 'Unemployed workers and idle machines put the economy inside the curve. It could make more of both goods without giving anything up.' },
      { label: 'A new technology arrives', set: { growth: 125 }, note: 'Better technology or more resources shift the whole curve outward. Points that were impossible before are now within reach.' },
    ],
    draw(pl, s) {
      const g = n(s, 'growth') / 100;
      const straight = s.shape === 'straight';
      pl.grid();
      pl.axes();
      if (g !== 1) {
        const gl = pl.fn((x) => frontier(x, 1, straight), 'g-curve g-third g-ghost', 0, X);
        pl.label(gl, 'PPC_1', 'g-label-third g-label-ghost', -8, -8);
      }
      const last = pl.fn((x) => frontier(x, g, straight), 'g-curve g-third', 0, X * g, 160);
      pl.label([X * g * 0.72, frontier(X * g * 0.72, g, straight)], g !== 1 ? 'PPC_2' : 'PPC', 'g-label-third', 10, -8);
      void last;
      const st = status(s);
      const x = n(s, 'x');
      const y = n(s, 'y');
      pl.guides(x, y, num(x), num(y));
      pl.dot(x, y, st === 'on' ? 'g-dot g-dot-eq' : st === 'inside' ? 'g-dot g-dot-inside' : 'g-dot g-dot-outside', 7);
      pl.handle('pt', x, y);
    },
    describe(s) {
      const g = n(s, 'growth') / 100;
      const straight = s.shape === 'straight';
      const x = n(s, 'x');
      const y = n(s, 'y');
      const st = status(s);
      if (st === 'outside') return `The point (${v(num(x))}, ${v(num(y))}) is outside the curve. The economy cannot produce it with the resources and technology it has now.`;
      if (st === 'inside') return `The point (${v(num(x))}, ${v(num(y))}) is inside the curve, so resources are sitting idle or being wasted. More of both goods is possible.`;
      const Xg = X * g;
      const Yg = Y * g;
      const slope = straight ? Yg / Xg : (Yg * (x / Xg ** 2)) / Math.sqrt(Math.max(1e-6, 1 - (x / Xg) ** 2));
      return `The point (${v(num(x))}, ${v(num(y))}) is on the curve, so resources are fully used. Here, making 1 more unit of consumer goods costs about ${v(slope.toFixed(2))} units of capital goods.${straight ? ' With a straight line that cost never changes.' : ' Move right and watch that cost climb.'}`;
    },
    drag(_id, pt, s) {
      return { ...s, x: Math.round(clamp(pt[0], 0, 140)), y: Math.round(clamp(pt[1], 0, 140)) };
    },
  };
}

/* ------------------------------------------------------------------ */
/* Aggregate demand and aggregate supply                               */
/* ------------------------------------------------------------------ */

function adas(): Setup {
  const Yf = 100;
  const eq = (s: State) => {
    const a = n(s, 'ad');
    const r = n(s, 'sras');
    const Y = Yf + (a + r) / 2;
    const PL = 180 - 0.8 * (Y - a);
    return { a, r, Y, PL };
  };
  return {
    title: 'Aggregate demand and aggregate supply',
    x: { min: 40, max: 160, step: 5, major: 4, label: 'Real GDP', ticks: false },
    y: { min: 40, max: 160, step: 5, major: 4, label: 'Price level', ticks: false },
    initial: { ad: 0, sras: 0 },
    controls: [
      { type: 'range', key: 'ad', label: 'Shift aggregate demand', min: -30, max: 30, step: 1, fmt: (x) => (x === 0 ? 'none' : x > 0 ? `right ${x}` : `left ${-x}`) },
      { type: 'range', key: 'sras', label: 'Shift short-run supply', min: -30, max: 30, step: 1, fmt: (x) => (x === 0 ? 'none' : x > 0 ? `right ${x}` : `left ${-x}`) },
    ],
    scenarios: [
      {
        label: 'Consumer confidence drops',
        set: { ad: -24, sras: 0 },
        note: 'Households spend less, so AD shifts left. Output falls below full employment and the price level falls. That is a recessionary gap.',
        hl: 'ad',
        moves: [
          'Households feel worse about the future and cut spending. Consumption is part of AD.',
          'Aggregate demand.',
          'Left. Less spending at every price level.',
          'Real GDP and the price level both fall. Output is below full employment: a recessionary gap.',
        ],
      },
      {
        label: 'Oil prices spike',
        set: { ad: 0, sras: -24 },
        note: 'Higher input costs shift SRAS left. Output falls and the price level rises at the same time. Economists call this stagflation.',
        hl: 'sras',
        moves: [
          'A key input to almost every business got more expensive.',
          'Short-run aggregate supply. Input costs move SRAS.',
          'Left. Firms produce less at every price level.',
          'Output falls and the price level rises at the same time. That is stagflation.',
        ],
      },
      {
        label: 'Government spends more',
        set: { ad: 24, sras: 0 },
        note: 'More government spending shifts AD right. Starting from full employment, output rises above potential and prices climb: an inflationary gap.',
        hl: 'ad',
        moves: [
          'Government purchases (G) go up. G is part of AD.',
          'Aggregate demand.',
          'Right. More spending at every price level.',
          'Real GDP and the price level both rise. Output is now above full employment: an inflationary gap.',
        ],
      },
      {
        label: 'Wages adjust after a recession',
        set: { ad: -24, sras: 24 },
        note: 'In the long run, lower nominal wages cut firms’ costs. SRAS shifts right until output is back at full employment, at a lower price level.',
        hl: 'sras',
        moves: [
          'After demand fell, high unemployment slowly pushes nominal wages down.',
          'Short-run aggregate supply. Wages are firms’ biggest input cost.',
          'Right. Lower costs mean more output at every price level.',
          'Output returns to full employment at a lower price level. The economy corrected itself, slowly.',
        ],
      },
    ],
    draw(pl, s) {
      const { a, r, Y, PL } = eq(s);
      pl.grid();
      pl.axes();
      pl.vline(Yf, 'g-curve g-fourth');
      pl.note([Yf + 1.5, 155], 'LRAS', 'start', 'g-label g-label-fourth');
      if (a !== 0) {
        const g = pl.fn((y) => 180 - 0.8 * y, 'g-curve g-demand g-ghost');
        pl.label(g, 'AD_1', 'g-label-demand g-label-ghost', -8, -6);
      }
      if (r !== 0) {
        const g = pl.fn((y) => 20 + 0.8 * y, 'g-curve g-supply g-ghost');
        pl.label(g, 'SRAS_1', 'g-label-supply g-label-ghost', -8, 14);
      }
      if (s._hl === 'ad') pl.glow((y) => 180 - 0.8 * (y - a));
      if (s._hl === 'sras') pl.glow((y) => 20 + 0.8 * (y - r));
      const dl = pl.fn((y) => 180 - 0.8 * (y - a), 'g-curve g-demand');
      const sl = pl.fn((y) => 20 + 0.8 * (y - r), 'g-curve g-supply');
      if (a !== 0 || r !== 0) {
        pl.axisArrow('y', 100, PL);
        pl.axisArrow('x', 100, Y);
      }
      pl.label(dl, a !== 0 ? 'AD_2' : 'AD', 'g-label-demand', 8, -6);
      pl.label(sl, r !== 0 ? 'SRAS_2' : 'SRAS', 'g-label-supply', 8, 14);
      if (Math.abs(Y - Yf) > 0.5) {
        pl.span(Y, Yf, 40, Y < Yf ? 'Recessionary gap' : 'Inflationary gap', 'g-span', true);
      }
      pl.guides(Y, PL, Math.abs(Y - Yf) < 0.5 ? 'Y = Yf' : 'Y', 'PL');
      if (a !== 0 || r !== 0) pl.dot(100, 100, 'g-dot g-dot-ghost', 4);
      pl.dot(Y, PL, 'g-dot g-dot-eq', 6);
    },
    describe(s) {
      const { Y, PL } = eq(s);
      const gap = ((Y - Yf) / Yf) * 100;
      const pl = `Price level ${v(PL.toFixed(0))} (it started at ${v('100')}).`;
      if (Math.abs(gap) < 0.5) return `Output is at full employment. ${pl} Unemployment is at its natural rate.`;
      if (gap < 0) return `Real GDP is ${v(`${Math.abs(gap).toFixed(0)}%`)} below full employment. ${pl} Unemployment is above its natural rate.`;
      return `Real GDP is ${v(`${gap.toFixed(0)}%`)} above full employment. ${pl} Unemployment is below its natural rate, and wages will start to rise.`;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Money market                                                        */
/* ------------------------------------------------------------------ */

function moneyMarket(): Setup {
  const rate = (s: State) => 12 - 0.1 * (n(s, 'ms') - n(s, 'md'));
  return {
    title: 'The money market',
    x: { min: 0, max: 120, step: 5, major: 4, label: 'Quantity of money ($ billions)' },
    y: { min: 0, max: 14, step: 0.5, major: 4, label: 'Nominal interest rate', fmt: (x) => `${x}%` },
    initial: { ms: 60, md: 0 },
    controls: [
      { type: 'range', key: 'ms', label: 'Money supply', min: 20, max: 100, step: 1, fmt: (x) => `$${x}B` },
      { type: 'range', key: 'md', label: 'Shift money demand', min: -30, max: 30, step: 1, fmt: (x) => (x === 0 ? 'none' : x > 0 ? `right ${x}` : `left ${-x}`) },
    ],
    scenarios: [
      {
        label: 'The Fed buys bonds',
        set: { ms: 80, md: 0 },
        note: 'Paying for bonds puts new reserves into banks, so the money supply shifts right and the interest rate falls. Lower rates encourage borrowing and investment.',
        hl: 'ms',
        moves: [
          'The Fed buys government bonds from banks and pays with new reserves.',
          'Money supply. The central bank controls it.',
          'Right. Banks can lend the new reserves, so there is more money.',
          'The nominal interest rate falls, which encourages borrowing, investment, and spending.',
        ],
      },
      {
        label: 'The Fed sells bonds',
        set: { ms: 40, md: 0 },
        note: 'Selling bonds pulls reserves out of banks. The money supply shifts left and the interest rate rises.',
        hl: 'ms',
        moves: [
          'The Fed sells bonds, and buyers pay with money that leaves the banking system.',
          'Money supply.',
          'Left. Banks have fewer reserves to lend.',
          'The nominal interest rate rises and borrowing slows.',
        ],
      },
      {
        label: 'Incomes rise',
        set: { ms: 60, md: 20 },
        note: 'With higher incomes people need more money for everyday spending. Money demand shifts right and, with the same money supply, the interest rate rises.',
        hl: 'md',
        moves: [
          'People earn and spend more, so they need more money on hand for purchases.',
          'Money demand.',
          'Right. People want to hold more money at every interest rate.',
          'With the money supply unchanged, the nominal interest rate rises.',
        ],
      },
    ],
    draw(pl, s) {
      const ms = n(s, 'ms');
      const md = n(s, 'md');
      const i = rate(s);
      pl.grid();
      pl.axes();
      if (md !== 0) {
        const g = pl.fn((m) => 12 - 0.1 * m, 'g-curve g-demand g-ghost');
        pl.label(g, 'MD_1', 'g-label-demand g-label-ghost', -8, -6);
      }
      if (ms !== 60) {
        pl.vline(60, 'g-curve g-supply g-ghost');
        pl.note([60, 13.3], 'MS_1', 'middle', 'g-label g-label-supply g-label-ghost');
      }
      if (s._hl === 'md') pl.glow((m) => 12 - 0.1 * (m - md));
      if (s._hl === 'ms') pl.vglow(ms);
      if (Math.abs(i - 6) > 0.01) pl.axisArrow('y', 6, i);
      const dl = pl.fn((m) => 12 - 0.1 * (m - md), 'g-curve g-demand');
      pl.label(dl, md !== 0 ? 'MD_2' : 'MD', 'g-label-demand', 8, -6);
      pl.vline(ms, 'g-curve g-supply');
      pl.note([ms + 1.5, 13.3], ms !== 60 ? 'MS_2' : 'MS', 'start', 'g-label g-label-supply');
      pl.guides(ms, i, `$${ms}B`, pct(i));
      pl.dot(ms, i, 'g-dot g-dot-eq', 6);
      pl.handle('ms', ms, Math.min(12.2, i + 3));
    },
    describe(s) {
      const i = rate(s);
      const start = 6;
      if (Math.abs(i - start) < 0.01) return `The nominal interest rate is ${v(pct(i))}, where the money people want to hold equals the money supply.`;
      return `The nominal interest rate ${i > start ? 'rises' : 'falls'} from ${v(pct(start))} to ${v(pct(i))}. ${i > start ? 'Borrowing costs more, so investment and interest-sensitive spending fall.' : 'Borrowing is cheaper, so investment and interest-sensitive spending rise.'}`;
    },
    drag(_id, pt, s, start, startPt) {
      return { ...s, ms: Math.round(clamp(n(start, 'ms') + (pt[0] - startPt[0]), 20, 100)) };
    },
  };
}

/* ------------------------------------------------------------------ */
/* Phillips curve                                                      */
/* ------------------------------------------------------------------ */

function phillips(): Setup {
  const un = 5;
  const inflation = (s: State) => n(s, 'exp') - 1.2 * (n(s, 'u') - un);
  return {
    title: 'Short-run and long-run Phillips curves',
    x: { min: 0, max: 12, step: 0.5, major: 4, label: 'Unemployment rate', fmt: (x) => `${x}%` },
    y: { min: 0, max: 12, step: 0.5, major: 4, label: 'Inflation rate', fmt: (x) => `${x}%` },
    initial: { u: 5, exp: 3 },
    controls: [
      { type: 'range', key: 'u', label: 'Unemployment rate', min: 2, max: 9, step: 0.1, fmt: (x) => pct(x) },
      { type: 'range', key: 'exp', label: 'Expected inflation', min: 1, max: 8, step: 0.1, fmt: (x) => pct(x) },
    ],
    scenarios: [
      { label: 'AD rises in the short run', set: { u: 3.5, exp: 3 }, note: 'Higher spending pushes unemployment below its natural rate. The economy moves up along the short-run curve: inflation rises.' },
      { label: 'Workers expect more inflation', set: { u: 5, exp: 4.8 }, note: 'Once workers expect higher inflation they bargain for higher wages. The short-run curve shifts up and unemployment returns to its natural rate, with higher inflation than before.' },
      { label: 'A supply shock hits', set: { u: 7, exp: 5.5 }, note: 'A negative supply shock raises both unemployment and inflation. That is a shift of the short-run curve up and to the right, not a move along it.' },
    ],
    draw(pl, s) {
      const u = n(s, 'u');
      const e = n(s, 'exp');
      const pi = inflation(s);
      pl.grid();
      pl.axes();
      pl.vline(un, 'g-curve g-fourth');
      pl.note([un + 0.15, 11.5], 'LRPC', 'start', 'g-label g-label-fourth');
      if (e !== 3) {
        const g = pl.fn((x) => 3 - 1.2 * (x - un), 'g-curve g-demand g-ghost', 1, 11);
        pl.label(g, 'SRPC_1', 'g-label-demand g-label-ghost', -8, -6);
      }
      const l = pl.fn((x) => e - 1.2 * (x - un), 'g-curve g-demand', 0.5, 11.5);
      pl.label(l, e !== 3 ? 'SRPC_2' : 'SRPC', 'g-label-demand', 8, -6);
      pl.guides(u, pi, pct(u), pct(pi));
      pl.dot(u, pi, 'g-dot g-dot-eq', 6);
    },
    describe(s) {
      const u = n(s, 'u');
      const pi = inflation(s);
      const e = n(s, 'exp');
      if (Math.abs(u - un) < 0.05) return `Unemployment is at its natural rate of ${v(pct(un))} and inflation equals what people expect, ${v(pct(e))}. This is a long-run equilibrium.`;
      return `Unemployment is ${v(pct(u))} and inflation is ${v(pct(pi))}. ${u < un ? 'Inflation is above what people expected. As expectations catch up, the short-run curve will shift up.' : 'Inflation is below what people expected. As expectations adjust down, the short-run curve will shift down.'}`;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Perfectly competitive firm                                          */
/* ------------------------------------------------------------------ */

function firm(): Setup {
  const F = 100;
  const MC = (q: number) => 24 - 4.8 * q + 0.36 * q * q;
  const AVC = (q: number) => 24 - 2.4 * q + 0.12 * q * q;
  const ATC = (q: number) => AVC(q) + F / q;
  const minAVC = 12;
  const output = (P: number) => (P < minAVC ? 0 : (4.8 + Math.sqrt(4.8 ** 2 - 1.44 * (24 - P))) / 0.72);
  return {
    title: 'A perfectly competitive firm',
    x: { min: 0, max: 20, step: 1, major: 5, label: 'Quantity (units per day)' },
    y: { min: 0, max: 60, step: 2, major: 5, label: 'Price and cost ($)', fmt: (x) => `$${x}` },
    initial: { price: 30 },
    controls: [{ type: 'range', key: 'price', label: 'Market price', min: 6, max: 50, step: 0.5, fmt: (x) => money(x) }],
    scenarios: [
      { label: 'Price high enough for profit', set: { price: 34 }, note: 'Price is above average total cost, so the firm earns an economic profit. In the long run, new firms will enter and push the price down.' },
      { label: 'Break-even price', set: { price: 20.7 }, note: 'Price equals minimum average total cost. The firm earns zero economic profit, which still covers the opportunity cost of the owner’s time and money. This is the long-run outcome.' },
      { label: 'Below average variable cost', set: { price: 10 }, note: 'Price is below minimum average variable cost, so every unit loses money even before fixed costs. The firm does better by shutting down in the short run.' },
    ],
    draw(pl, s) {
      const P = n(s, 'price');
      const q = output(P);
      pl.grid();
      pl.axes();
      if (q > 0) {
        const atc = ATC(q);
        pl.area([[0, P], [q, P], [q, atc], [0, atc]], P >= atc ? 'fill-profit' : 'fill-loss', P >= atc ? 'Profit' : 'Loss', [q / 2, (P + atc) / 2]);
      }
      const mc = pl.fn(MC, 'g-curve g-third', 0.5, 20);
      const atcL = pl.fn(ATC, 'g-curve g-fourth', 1.8, 20);
      const avcL = pl.fn(AVC, 'g-curve g-fourth g-dashed', 0.5, 20);
      pl.label(mc, 'MC', 'g-label-third', 8, 4);
      pl.label(atcL, 'ATC', 'g-label-fourth', 6, 14);
      pl.label(avcL, 'AVC', 'g-label-fourth', 6, 14);
      pl.hline(P, 'g-curve g-demand');
      pl.note([19.8, P + 1.6], 'P = MR = D', 'end', 'g-label g-label-demand');
      if (q > 0) {
        pl.guides(q, P, num(q, 1), money(P));
        pl.guides(q, ATC(q), undefined, money(ATC(q)));
        pl.dot(q, P, 'g-dot g-dot-eq', 6);
      }
    },
    describe(s) {
      const P = n(s, 'price');
      const q = output(P);
      if (q === 0) return `At ${v(money(P))} the price is below minimum average variable cost (${v(money(minAVC))}). The firm shuts down and loses only its fixed cost of ${v(money(F, 0))}.`;
      const atc = ATC(q);
      const profit = (P - atc) * q;
      const where = `The firm makes ${v(num(q, 1))} units, where price equals marginal cost.`;
      if (Math.abs(profit) < 1) return `${where} Average total cost is ${v(money(atc))}, the same as price, so economic profit is zero.`;
      if (profit > 0) return `${where} Average total cost is ${v(money(atc))}, so profit is ${v(money(profit, 0))} a day.`;
      return `${where} Average total cost is ${v(money(atc))}, so the firm loses ${v(money(-profit, 0))} a day. It keeps producing because price still covers average variable cost, which makes the loss smaller than its fixed cost.`;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Monopoly                                                            */
/* ------------------------------------------------------------------ */

function monopoly(): Setup {
  const D = (q: number) => 50 - 2 * q;
  const MR = (q: number) => 50 - 4 * q;
  return {
    title: 'Monopoly compared with competition',
    x: { min: 0, max: 26, step: 1, major: 5, label: 'Quantity' },
    y: { min: 0, max: 56, step: 2, major: 5, label: 'Price and cost ($)', fmt: (x) => `$${x}` },
    initial: { mc: 10, compare: true },
    controls: [
      { type: 'range', key: 'mc', label: 'Marginal cost (also average cost)', min: 4, max: 40, step: 1, fmt: (x) => money(x, 0) },
      { type: 'toggle', key: 'compare', label: 'Show the competitive outcome' },
    ],
    draw(pl, s) {
      const c = n(s, 'mc');
      const Qm = (50 - c) / 4;
      const Pm = D(Qm);
      const Qc = (50 - c) / 2;
      pl.grid();
      pl.axes();
      pl.area([[0, c], [0, Pm], [Qm, Pm], [Qm, c]], 'fill-profit', 'Profit', [Qm / 2, (Pm + c) / 2]);
      if (b(s, 'compare')) pl.area([[Qm, Pm], [Qm, c], [Qc, c]], 'fill-dwl', undefined, undefined, true);
      const dl = pl.fn(D, 'g-curve g-demand');
      const mr = pl.fn(MR, 'g-curve g-demand g-dashed', 0, 12.5);
      pl.label(dl, 'D', 'g-label-demand', 6, -6);
      pl.label(mr, 'MR', 'g-label-demand', 6, -6);
      pl.hline(c, 'g-curve g-third');
      pl.note([25.6, c + 1.6], 'MC = ATC', 'end', 'g-label g-label-third');
      pl.guides(Qm, Pm, `Qm ${num(Qm, 1)}`, `Pm ${money(Pm, 0)}`);
      pl.guides(Qm, c);
      pl.dot(Qm, Pm, 'g-dot g-dot-eq', 6);
      pl.dot(Qm, c, 'g-dot', 4);
      if (b(s, 'compare')) {
        pl.guides(Qc, c, `Qc ${num(Qc, 1)}`);
        pl.dot(Qc, c, 'g-dot g-dot-ghost', 5);
      }
    },
    describe(s) {
      const c = n(s, 'mc');
      const Qm = (50 - c) / 4;
      const Pm = D(Qm);
      const Qc = (50 - c) / 2;
      const profit = (Pm - c) * Qm;
      const dwl = 0.5 * (Pm - c) * (Qc - Qm);
      const main = `The monopolist makes ${v(num(Qm, 1))} units, where marginal revenue equals marginal cost, then charges the most buyers will pay for that amount: ${v(money(Pm))}. Profit is ${v(money(profit, 0))}.`;
      if (!b(s, 'compare')) return main;
      return `${main} A competitive market would make ${v(num(Qc, 1))} units at ${v(money(c))}. The hatched triangle, worth ${v(money(dwl, 0))}, is the deadweight loss from monopoly.`;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Externalities                                                       */
/* ------------------------------------------------------------------ */

function externality(kind: 'negative' | 'positive'): Setup {
  const neg = kind === 'negative';
  return {
    title: neg ? 'A negative externality: pollution' : 'A positive externality: vaccination',
    x: { min: 0, max: 25, step: 1, major: 5, label: neg ? 'Quantity of steel' : 'Vaccinations (thousands)' },
    y: { min: 0, max: 60, step: 2, major: 5, label: 'Price and cost ($)', fmt: (x) => `$${x}` },
    initial: { ext: 12, fix: false },
    controls: [
      { type: 'range', key: 'ext', label: neg ? 'Harm to others per unit' : 'Benefit to others per unit', min: 0, max: 24, step: 1, fmt: (x) => money(x, 0) },
      { type: 'toggle', key: 'fix', label: neg ? 'Add a tax equal to the harm (Pigouvian tax)' : 'Add a subsidy equal to the benefit' },
    ],
    draw(pl, s) {
      const e = n(s, 'ext');
      const fix = b(s, 'fix');
      const Qm = 10;
      const Qs = neg ? (40 - e) / 4 : (40 + e) / 4;
      pl.grid();
      pl.axes();
      if (neg) {
        const Ps = 50 - 2 * Qs;
        if (!fix && e > 0) pl.area([[Qs, Ps], [Qm, 10 + e + 2 * Qm], [Qm, 30]], 'fill-dwl', undefined, undefined, true);
        const dl = pl.fn((q) => 50 - 2 * q, 'g-curve g-demand');
        const mpc = pl.fn((q) => 10 + 2 * q, fix ? 'g-curve g-supply g-ghost' : 'g-curve g-supply');
        const msc = pl.fn((q) => 10 + e + 2 * q, 'g-curve g-fourth');
        void msc;
        pl.label(dl, 'D = MPB = MSB', 'g-label-demand', 6, -6);
        pl.label(mpc, 'S = MPC', 'g-label-supply', 6, 14);
        const lq = Math.min(14, (50 - e) / 2 - 1);
        pl.label([lq, 10 + e + 2 * lq], fix ? 'MSC = S + tax' : 'MSC', 'g-label-fourth', -10, -4, 'end');
        if (!fix) {
          pl.guides(Qm, 30, 'Qm', money(30, 0));
          pl.dot(Qm, 30, 'g-dot g-dot-eq', 6);
        }
        pl.guides(Qs, Ps, 'Q*', fix ? money(Ps, 0) : undefined, fix ? 'g-guide' : 'g-guide g-guide-soft');
        pl.dot(Qs, Ps, fix ? 'g-dot g-dot-eq' : 'g-dot g-dot-ghost', fix ? 6 : 5);
      } else {
        const Ps = 10 + 2 * Qs;
        if (!fix && e > 0) pl.area([[Qm, 50 + e - 2 * Qm], [Qs, Ps], [Qm, 30]], 'fill-dwl', undefined, undefined, true);
        const mpb = pl.fn((q) => 50 - 2 * q, fix ? 'g-curve g-demand g-ghost' : 'g-curve g-demand');
        const msb = pl.fn((q) => 50 + e - 2 * q, 'g-curve g-fourth');
        const sl = pl.fn((q) => 10 + 2 * q, 'g-curve g-supply');
        pl.label(mpb, 'D = MPB', 'g-label-demand', 6, -6);
        pl.label(msb, fix ? 'MSB = D + subsidy' : 'MSB', 'g-label-fourth', 6, -6);
        pl.label(sl, 'S = MPC = MSC', 'g-label-supply', 6, 14);
        if (!fix) {
          pl.guides(Qm, 30, 'Qm', money(30, 0));
          pl.dot(Qm, 30, 'g-dot g-dot-eq', 6);
        }
        pl.guides(Qs, Ps, 'Q*', fix ? money(Ps, 0) : undefined, fix ? 'g-guide' : 'g-guide g-guide-soft');
        pl.dot(Qs, Ps, fix ? 'g-dot g-dot-eq' : 'g-dot g-dot-ghost', fix ? 6 : 5);
      }
    },
    describe(s) {
      const e = n(s, 'ext');
      const fix = b(s, 'fix');
      const Qs = neg ? (40 - e) / 4 : (40 + e) / 4;
      const dwl = 0.5 * e * Math.abs(10 - Qs);
      if (e === 0) return `With no ${neg ? 'harm' : 'benefit'} to others, private and social ${neg ? 'costs' : 'benefits'} match and the market quantity of ${v('10')} is already the best one.`;
      if (fix) return `The ${neg ? 'tax' : 'subsidy'} of ${v(money(e, 0))} per unit makes ${neg ? 'producers pay for the harm they cause' : 'buyers count the benefit to others'}. The market now settles at ${v(num(Qs, 1))}, the socially best quantity, and the deadweight loss disappears.`;
      return `Left alone, the market makes ${v('10')} units (Qm), but the socially best quantity (Q*) is ${v(num(Qs, 1))}. The market ${neg ? 'overproduces' : 'underproduces'}, and the hatched triangle shows a deadweight loss of ${v(money(dwl, 0))}.`;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Monopsony labor market                                              */
/* ------------------------------------------------------------------ */

function monopsony(): Setup {
  const S = (l: number) => 4 + 0.5 * l;
  const MFC = (l: number) => 4 + l;
  const MRP = (l: number) => 40 - 0.5 * l;
  const Lm = 24;
  const Wm = S(Lm);
  const Lc = 36;
  const Wc = S(Lc);
  const outcome = (s: State) => {
    if (!b(s, 'on')) return { L: Lm, W: Wm, floor: false };
    const w = n(s, 'wage');
    if (w <= Wm) return { L: Lm, W: Wm, floor: false };
    const L = Math.min((w - 4) / 0.5, (40 - w) / 0.5);
    return { L, W: w, floor: true };
  };
  return {
    title: 'A monopsony employer',
    x: { min: 0, max: 64, step: 2, major: 5, label: 'Workers hired' },
    y: { min: 0, max: 44, step: 1, major: 4, label: 'Wage ($ per hour)', fmt: (x) => `$${x}` },
    initial: { on: false, wage: 20 },
    controls: [
      { type: 'toggle', key: 'on', label: 'Add a minimum wage' },
      { type: 'range', key: 'wage', label: 'Minimum wage', min: 10, max: 34, step: 0.5, fmt: (x) => money(x) },
    ],
    draw(pl, s) {
      const o = outcome(s);
      pl.grid();
      pl.axes();
      const mrp = pl.fn(MRP, 'g-curve g-demand');
      const sl = pl.fn(S, 'g-curve g-supply');
      const mfc = pl.fn(MFC, o.floor ? 'g-curve g-fourth g-ghost' : 'g-curve g-fourth');
      pl.label(mrp, 'MRP = D', 'g-label-demand', 6, -6);
      pl.label(sl, 'S = AFC', 'g-label-supply', 6, 14);
      pl.label(mfc, 'MFC', 'g-label-fourth', 6, -4);
      if (o.floor) {
        pl.hline(o.W, 'g-control-line');
        pl.note([63, o.W + 1.2], 'Minimum wage', 'end', 'g-note g-note-strong');
      } else {
        pl.guides(Lm, MFC(Lm), undefined, undefined, 'g-guide g-guide-soft');
        pl.dot(Lm, MFC(Lm), 'g-dot', 4);
      }
      pl.guides(Lc, Wc, undefined, undefined, 'g-guide g-guide-soft');
      pl.dot(Lc, Wc, 'g-dot g-dot-ghost', 5);
      pl.guides(o.L, o.W, num(o.L, 1), money(o.W));
      pl.dot(o.L, o.W, 'g-dot g-dot-eq', 6);
    },
    describe(s) {
      const o = outcome(s);
      if (!o.floor) {
        const extra = b(s, 'on') ? ` A minimum wage of ${v(money(n(s, 'wage')))} is below that, so it changes nothing.` : '';
        return `The monopsonist hires ${v(num(Lm))} workers, where MRP equals MFC, and pays only ${v(money(Wm))}, the lowest wage that attracts that many people. A competitive market would hire ${v(num(Lc))} at ${v(money(Wc))}.${extra}`;
      }
      const vs = o.L > Lm + 0.05 ? `more than the ${v(num(Lm))} it hired without one` : o.L < Lm - 0.05 ? `fewer than the ${v(num(Lm))} it hired without one` : `the same number as before`;
      return `With a minimum wage of ${v(money(o.W))}, the firm hires ${v(num(o.L, 1))} workers, ${vs}. In a monopsony, a minimum wage set between ${v(money(Wm))} and ${v(money(Wc))} raises both pay and employment.`;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Lorenz curve                                                        */
/* ------------------------------------------------------------------ */

function lorenz(): Setup {
  return {
    title: 'Lorenz curve and the Gini coefficient',
    x: { min: 0, max: 100, step: 5, major: 4, label: 'Share of households, poorest first', fmt: (x) => `${x}%` },
    y: { min: 0, max: 100, step: 5, major: 4, label: 'Share of income', fmt: (x) => `${x}%` },
    ratio: 0.85,
    initial: { k: 2.4 },
    controls: [{ type: 'range', key: 'k', label: 'Inequality', min: 1, max: 6, step: 0.1, fmt: (x) => (x <= 1.05 ? 'none' : x < 2 ? 'low' : x < 3.5 ? 'medium' : 'high') }],
    draw(pl, s) {
      const k = n(s, 'k');
      const L = (x: number) => 100 * (x / 100) ** k;
      pl.grid();
      pl.axes();
      const pts: Pt[] = [];
      for (let i = 0; i <= 60; i++) pts.push([(100 * i) / 60, L((100 * i) / 60)]);
      pl.area([...pts, [100, 100], [0, 0]], 'fill-dwl', k > 1.05 ? 'A' : undefined, [58, 46], true);
      pl.fn((x) => x, 'g-curve g-fourth');
      pl.label([34, 34], 'Line of equality', 'g-label-fourth', -10, -8, 'end');
      pl.fn(L, 'g-curve g-demand');
      pl.label([72, L(72)], 'Lorenz curve', 'g-label-demand', 10, 16, 'start');
      pl.guides(50, L(50), '50%', pct(L(50), 0));
      pl.dot(50, L(50), 'g-dot g-dot-eq', 5);
    },
    describe(s) {
      const k = n(s, 'k');
      const gini = (k - 1) / (k + 1);
      const half = 100 * 0.5 ** k;
      return `The poorest half of households earn ${v(pct(half, 0))} of all income. The Gini coefficient is ${v(gini.toFixed(2))}: area A divided by the whole triangle under the line of equality. 0 means everyone earns the same; closer to 1 means more unequal.`;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Business cycle                                                      */
/* ------------------------------------------------------------------ */

function businessCycle(): Setup {
  const trend = (t: number) => 60 + 5 * t;
  const cycle = (t: number) => trend(t) + 9 * Math.sin((t - 0.5) * (Math.PI / 2.5));
  const k = Math.PI / 2.5;
  // Slope of real GDP: trend growth plus the cycle's own slope.
  const slope = (t: number) => 5 + 9 * k * Math.cos((t - 0.5) * k);
  const phase = (t: number) => {
    const m = slope(t);
    if (Math.abs(m) < 1.6) return Math.sin((t - 0.5) * k) > 0 ? 'peak' : 'trough';
    return m > 0 ? 'expansion' : 'contraction';
  };
  // Where the slope is zero: peaks near years 2.1 and 7.1, troughs near 3.9 and 8.9.
  const u = Math.acos(-5 / (9 * k));
  const peakT = 0.5 + u / k;
  const troughT = 0.5 + (2 * Math.PI - u) / k;
  return {
    title: 'The business cycle',
    x: { min: 0, max: 10, step: 0.5, major: 2, label: 'Time (years)' },
    y: { min: 40, max: 130, step: 5, major: 2, label: 'Real GDP', ticks: false },
    initial: { t: 1 },
    controls: [{ type: 'range', key: 't', label: 'Move through time', min: 0.2, max: 9.8, step: 0.1, fmt: (x) => `year ${x.toFixed(1)}` }],
    draw(pl, s) {
      const t = n(s, 't');
      pl.grid();
      pl.axes();
      const tl = pl.fn(trend, 'g-curve g-fourth g-dashed', 0, 10);
      pl.label(tl, 'Long-run trend', 'g-label-fourth', -6, 16, 'end');
      pl.fn(cycle, 'g-curve g-demand', 0, 10, 160);
      if (!pl.compact) {
        pl.note([peakT, cycle(peakT) + 6], 'Peak', 'middle', 'g-note g-note-strong');
        pl.note([troughT, cycle(troughT) - 8], 'Trough', 'middle', 'g-note g-note-strong');
      }
      pl.guides(t, cycle(t));
      pl.dot(t, cycle(t), 'g-dot g-dot-eq', 7);
    },
    describe(s) {
      const t = n(s, 't');
      const ph = phase(t);
      const gap = cycle(t) - trend(t);
      const where = gap > 1 ? 'above' : gap < -1 ? 'below' : 'close to';
      const text: Record<string, string> = {
        expansion: 'Real GDP is growing. Firms hire, unemployment falls, and inflation tends to pick up as the expansion goes on.',
        contraction: 'Real GDP is falling. Firms cut jobs, cyclical unemployment rises, and inflation usually slows. A long enough contraction is a recession.',
        peak: 'The expansion has topped out. Output is as far above trend as it will get in this cycle, and unemployment is at its lowest.',
        trough: 'The contraction has hit bottom. Output is furthest below trend and unemployment is at its highest. Recovery starts from here.',
      };
      return `${v(ph[0].toUpperCase() + ph.slice(1))}. Output is ${where} its long-run trend. ${text[ph]}`;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

const ojAxes = {
  x: { min: 0, max: 80, step: 2, major: 5, label: 'Quantity (millions of cartons)' },
  y: { min: 0, max: 12, step: 0.5, major: 4, label: 'Price per carton', fmt: (x: number) => `$${x}` },
};

export const graphs: Record<string, () => Setup> = {
  'market-oj': () =>
    market({
      title: 'The market for orange juice',
      a: 10, b: 0.1, c: 2, d: 0.1,
      ...ojAxes,
      qUnit: 'million cartons',
      fmtP: (x) => money(x),
      scenarios: [
        {
          label: 'A frost hits the orange harvest',
          set: { dShift: 0, sShift: -20 },
          note: 'Frost destroys part of the crop, so growers can sell fewer cartons at every price. Supply shifts left.',
          hl: 's',
          moves: [
            'Frost destroys oranges, a key input. Nothing changed about what buyers want.',
            'Supply. Inputs, technology, and the number of sellers move the supply curve.',
            'Left. With fewer oranges, growers offer fewer cartons at every price.',
            'The price rises and the quantity sold falls. Buyers compete for fewer cartons.',
          ],
        },
        {
          label: 'A study links juice to fewer colds',
          set: { dShift: 20, sShift: 0 },
          note: 'Tastes move toward orange juice, so buyers want more at every price. Demand shifts right.',
          hl: 'd',
          moves: [
            'Buyers learn something that makes them like orange juice more. That is a change in tastes.',
            'Demand. Tastes, income, related goods, buyers, and expectations move demand.',
            'Right. Buyers want more cartons at every price.',
            'Both price and quantity rise. Sellers move up their supply curve to meet the new demand.',
          ],
        },
        {
          label: 'Apple juice gets cheaper',
          set: { dShift: -16, sShift: 0 },
          note: 'Apple juice is a substitute. When it gets cheaper some buyers switch, so demand for orange juice shifts left.',
          hl: 'd',
          moves: [
            'The price of a related good fell. Apple juice is a substitute for orange juice.',
            'Demand for orange juice. The price of apple juice is not the price of this good, so it shifts a curve instead of moving along one.',
            'Left. Some buyers switch to the cheaper substitute.',
            'Price and quantity both fall.',
          ],
        },
        {
          label: 'Both the frost and the study',
          set: { dShift: 20, sShift: -20 },
          note: 'When both curves shift, one result is certain and the other depends on size. Here price must rise. Quantity only stays the same because the two shifts are equal.',
          moves: [
            'Two things at once: fewer oranges and a change in tastes.',
            'Both curves. The frost moves supply and the study moves demand.',
            'Supply shifts left and demand shifts right.',
            'Both push the price up, so it must rise. They push quantity in opposite directions, so its change depends on which shift is bigger.',
          ],
        },
      ],
    }),
  'market-basic': () =>
    market({
      title: 'Supply and demand',
      a: 10, b: 0.1, c: 2, d: 0.1,
      ...ojAxes,
      qUnit: 'million cartons',
      fmtP: (x) => money(x),
      initial: { surplus: true },
    }),
  'ceiling-rent': () =>
    market({
      title: 'Rent control as a price ceiling',
      a: 2400, b: 30, c: 400, d: 20,
      x: { min: 0, max: 80, step: 2, major: 5, label: 'Apartments (thousands)' },
      y: { min: 0, max: 2600, step: 100, major: 5, label: 'Monthly rent', fmt: (x) => `$${x}` },
      qUnit: 'thousand apartments',
      fmtP: (x) => money(x, 0),
      buyers: 'renters',
      sellers: 'landlords',
      mode: 'ceiling',
      controls: ['ceiling'],
      ceiling: [500, 1800, 50],
      initial: { ceiling: 900 },
    }),
  'floor-wage': () =>
    market({
      title: 'A minimum wage as a price floor',
      a: 30, b: 0.4, c: 4, d: 0.25,
      x: { min: 0, max: 80, step: 2, major: 5, label: 'Workers (thousands)' },
      y: { min: 0, max: 32, step: 1, major: 4, label: 'Hourly wage', fmt: (x) => `$${x}` },
      dName: 'D',
      sName: 'S',
      qUnit: 'thousand workers',
      fmtP: (x) => money(x),
      buyers: 'employers',
      sellers: 'workers',
      mode: 'floor',
      controls: ['floor'],
      floor: [8, 26, 0.5],
      initial: { floor: 18 },
      surplusWord: 'Unemployment',
    }),
  'tax-incidence': () =>
    market({
      title: 'Who really pays a tax',
      a: 10, b: 0.1, c: 2, d: 0.1,
      x: { min: 0, max: 80, step: 2, major: 5, label: 'Quantity (millions of gallons)' },
      y: { min: 0, max: 12, step: 0.5, major: 4, label: 'Price per gallon', fmt: (x: number) => `$${x}` },
      qUnit: 'million gallons',
      fmtP: (x) => money(x),
      mode: 'tax',
      controls: ['tax', 'bSlope'],
      tax: [0, 4, 0.25],
      initial: { tax: 2, bSlope: 0.1 },
    }),
  'loanable-funds': () =>
    market({
      title: 'The loanable funds market',
      a: 10, b: 0.1, c: 0, d: 0.1,
      x: { min: 0, max: 100, step: 2, major: 5, label: 'Quantity of loanable funds ($ billions)' },
      y: { min: 0, max: 12, step: 0.5, major: 4, label: 'Real interest rate', fmt: (x) => `${x}%` },
      dName: 'D_LF',
      sName: 'S_LF',
      qUnit: 'billion dollars of loans',
      fmtP: (x) => pct(x),
      fmtQ: (x) => `$${num(x)}B`,
      buyers: 'borrowers',
      sellers: 'savers',
      controls: ['dShift', 'sShift'],
      scenarios: [
        {
          label: 'The government borrows to cover a deficit',
          set: { dShift: 20, sShift: 0 },
          note: 'Government borrowing adds to the demand for loanable funds. The real interest rate rises, and some private investment is priced out. That is crowding out.',
          hl: 'd',
          moves: [
            'The government spends more than it collects in taxes and has to borrow the difference.',
            'Demand for loanable funds. Borrowers are the demand side of this market.',
            'Right. There is more borrowing at every interest rate.',
            'The real interest rate rises. Some firms decide not to borrow for investment, which is crowding out.',
          ],
        },
        {
          label: 'Households save more',
          set: { dShift: 0, sShift: 20 },
          note: 'More saving shifts supply right. The real interest rate falls and firms borrow more for investment.',
          hl: 's',
          moves: [
            'Households decide to save a larger share of their income.',
            'Supply of loanable funds. Savers are the supply side.',
            'Right. More funds are available at every interest rate.',
            'The real interest rate falls and more money is lent, mostly for investment.',
          ],
        },
        {
          label: 'Firms expect strong sales',
          set: { dShift: 14, sShift: 0 },
          note: 'Firms want to build and buy equipment, so demand for loans rises. The real interest rate rises.',
          hl: 'd',
          moves: [
            'Businesses become more optimistic about future sales.',
            'Demand for loanable funds. Firms borrow to invest.',
            'Right. Firms want to borrow more at every rate.',
            'The real interest rate rises and the quantity of loans grows.',
          ],
        },
      ],
    }),
  forex: () =>
    market({
      title: 'The foreign exchange market for euros',
      a: 2, b: 0.02, c: 0.4, d: 0.02,
      x: { min: 0, max: 80, step: 2, major: 5, label: 'Quantity of euros (billions)' },
      y: { min: 0, max: 2.4, step: 0.1, major: 4, label: 'Dollars per euro', fmt: (x) => `$${x.toFixed(1)}` },
      dName: 'D_€',
      sName: 'S_€',
      qUnit: 'billion euros',
      fmtP: (x) => money(x),
      buyers: 'people buying euros',
      sellers: 'people selling euros',
      controls: ['dShift', 'sShift'],
      scenarios: [
        {
          label: 'Americans buy more European goods',
          set: { dShift: 16, sShift: 0 },
          note: 'To pay for European goods, Americans need euros. Demand for euros shifts right, the euro appreciates, and the dollar depreciates.',
          hl: 'd',
          moves: [
            'American tastes shift toward European products.',
            'Demand for euros. Americans need euros to pay European sellers.',
            'Right. More euros are wanted at every exchange rate.',
            'The euro appreciates: one euro now costs more dollars. The dollar depreciates.',
          ],
        },
        {
          label: 'US interest rates rise',
          set: { dShift: -10, sShift: 10 },
          note: 'Higher US rates draw savings into dollar assets. Europeans sell euros to buy dollars and Americans buy fewer euros. The euro depreciates against the dollar.',
          moves: [
            'US assets now pay a better return than European ones.',
            'Both sides of the euro market. Europeans sell euros to buy dollar assets, and Americans buy fewer euros.',
            'Supply of euros shifts right and demand for euros shifts left.',
            'The euro depreciates and the dollar appreciates.',
          ],
        },
        {
          label: 'Europe has a recession',
          set: { dShift: 0, sShift: -12 },
          note: 'Europeans buy fewer imports from the US, so they supply fewer euros. Supply of euros shifts left and the euro appreciates.',
          hl: 's',
          moves: [
            'Incomes in Europe fall.',
            'Supply of euros. Europeans supply euros when they buy American goods.',
            'Left. Poorer Europeans buy fewer imports, so fewer euros are offered.',
            'The euro appreciates against the dollar.',
          ],
        },
      ],
    }),
  ppc,
  adas,
  'money-market': moneyMarket,
  phillips,
  firm,
  monopoly,
  'externality-negative': () => externality('negative'),
  'externality-positive': () => externality('positive'),
  monopsony,
  lorenz,
  'business-cycle': businessCycle,
};

export const graphList: { key: string; label: string; unit: string }[] = [
  { key: 'market-oj', label: 'Supply and demand shifts', unit: 'supply-and-demand' },
  { key: 'market-basic', label: 'Consumer and producer surplus', unit: 'supply-and-demand' },
  { key: 'ceiling-rent', label: 'Price ceiling (rent control)', unit: 'supply-and-demand' },
  { key: 'floor-wage', label: 'Price floor (minimum wage)', unit: 'supply-and-demand' },
  { key: 'tax-incidence', label: 'Tax incidence and elasticity', unit: 'supply-and-demand' },
  { key: 'ppc', label: 'Production possibilities curve', unit: 'foundations' },
  { key: 'firm', label: 'Perfectly competitive firm', unit: 'production-and-cost' },
  { key: 'monopoly', label: 'Monopoly and deadweight loss', unit: 'imperfect-competition' },
  { key: 'externality-negative', label: 'Negative externality', unit: 'market-failure' },
  { key: 'externality-positive', label: 'Positive externality', unit: 'market-failure' },
  { key: 'monopsony', label: 'Monopsony and the minimum wage', unit: 'factor-markets' },
  { key: 'lorenz', label: 'Lorenz curve and Gini coefficient', unit: 'market-failure' },
  { key: 'business-cycle', label: 'Business cycle', unit: 'economic-indicators' },
  { key: 'adas', label: 'AD and AS', unit: 'national-income' },
  { key: 'money-market', label: 'Money market', unit: 'financial-sector' },
  { key: 'loanable-funds', label: 'Loanable funds', unit: 'financial-sector' },
  { key: 'phillips', label: 'Phillips curve', unit: 'stabilization-policy' },
  { key: 'forex', label: 'Foreign exchange', unit: 'open-economy' },
];
