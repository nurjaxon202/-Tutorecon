// Graphs drawn inside questions, the way the AP exam shows them: plain
// curves, letters for areas and points, and labels like P1 and Q1 instead of
// numbers. They are drawn at build time by the same engine as the lessons.
import { Plot, type Axis } from '../../scripts/graphs/core';

export interface QFigure {
  /** SVG markup, without the outer <svg> element. */
  svg: string;
  w: number;
  h: number;
  /** A full text description for screen readers. */
  alt: string;
  /** Id used inside the SVG. Renderers make it unique per copy on a page. */
  id: string;
}

let n = 0;
// Each graph is drawn once and shared by every question that uses it.
const cache = new Map<string, QFigure>();
const axis = (label: string, max: number): Axis => ({ min: 0, max, step: 1, major: 5, label, ticks: false });

export function figure(
  alt: string,
  xLabel: string,
  yLabel: string,
  draw: (p: Plot) => void,
  opts: { w?: number; h?: number; xMax?: number; yMax?: number } = {},
): QFigure {
  const hit = cache.get(alt);
  if (hit) return hit;
  const w = opts.w ?? 440;
  const h = opts.h ?? 320;
  // The trailing "z" keeps one id from being the start of another (qf1z, qf12z).
  const id = `qf${++n}z`;
  const p = new Plot(w, h, axis(xLabel, opts.xMax ?? 10), axis(yLabel, opts.yMax ?? 10), id);
  p.axes();
  draw(p);
  const fig = { svg: p.svg(), w, h, alt, id };
  cache.set(alt, fig);
  return fig;
}

/** A copy of the SVG whose ids will not clash with another copy on the same page. */
export const uniqueSvg = (fig: QFigure, suffix: string) => fig.svg.split(fig.id).join(`${fig.id}${suffix}`);
