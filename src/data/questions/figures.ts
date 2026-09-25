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
}

let n = 0;
const axis = (label: string, max: number): Axis => ({ min: 0, max, step: 1, major: 5, label, ticks: false });

export function figure(
  alt: string,
  xLabel: string,
  yLabel: string,
  draw: (p: Plot) => void,
  opts: { w?: number; h?: number; xMax?: number; yMax?: number } = {},
): QFigure {
  const w = opts.w ?? 440;
  const h = opts.h ?? 320;
  const p = new Plot(w, h, axis(xLabel, opts.xMax ?? 10), axis(yLabel, opts.yMax ?? 10), `qfig${++n}`);
  p.axes();
  draw(p);
  return { svg: p.svg(), w, h, alt };
}
