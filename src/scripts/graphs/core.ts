// A small SVG plotting kit for textbook economics diagrams.
// Plots are drawn at the container's real pixel size so labels stay readable
// on phones, and every drawing call works in data units.

export type Pt = [number, number];

export interface Axis {
  min: number;
  max: number;
  step: number;
  label: string;
  /** Show numbers along the axis. Abstract diagrams (AD/AS) hide them. */
  ticks?: boolean;
  /** Draw a darker grid line every n steps. */
  major?: number;
  fmt?: (v: number) => string;
}

export interface Handle {
  id: string;
  x: number;
  y: number;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** "D_2" renders as D with a subscript 2. */
const rich = (s: string) => {
  const [main, sub] = s.split('_');
  return sub ? `${esc(main)}<tspan class="g-sub" dy="4">${esc(sub)}</tspan>` : esc(main);
};

const r1 = (n: number) => Math.round(n * 10) / 10;

export class Plot {
  readonly w: number;
  readonly h: number;
  readonly m = { t: 34, r: 26, b: 46, l: 58 };
  readonly xa: Axis;
  readonly ya: Axis;
  readonly clipId: string;
  readonly handles: Handle[] = [];
  private back: string[] = [];
  private mid: string[] = [];
  private front: string[] = [];
  private ticks: { x: number; y: number; text: string; anchor: string; axis: 'x' | 'y' }[] = [];
  private chips: { x: number; y: number; w: number; axis: 'x' | 'y' }[] = [];

  constructor(w: number, h: number, xa: Axis, ya: Axis, clipId: string) {
    this.w = w;
    this.h = h;
    this.xa = xa;
    this.ya = ya;
    this.clipId = clipId;
    if (w < 420) {
      this.m.l = 48;
      this.m.r = 16;
    }
  }

  get left() {
    return this.m.l;
  }
  get right() {
    return this.w - this.m.r;
  }
  get top() {
    return this.m.t;
  }
  get bottom() {
    return this.h - this.m.b;
  }

  X = (v: number) => this.left + ((v - this.xa.min) / (this.xa.max - this.xa.min)) * (this.right - this.left);
  Y = (v: number) => this.bottom - ((v - this.ya.min) / (this.ya.max - this.ya.min)) * (this.bottom - this.top);
  invX = (px: number) => this.xa.min + ((px - this.left) / (this.right - this.left)) * (this.xa.max - this.xa.min);
  invY = (px: number) => this.ya.min + ((this.bottom - px) / (this.bottom - this.top)) * (this.ya.max - this.ya.min);

  inside(x: number, y: number, pad = 0) {
    return (
      x >= this.xa.min - pad &&
      x <= this.xa.max + pad &&
      y >= this.ya.min - pad &&
      y <= this.ya.max + pad
    );
  }

  /** Graph paper: minor lines every step, major lines every `major` steps. */
  grid() {
    const { xa, ya } = this;
    const lines: string[] = [];
    const xm = xa.major ?? 5;
    const ym = ya.major ?? 5;
    let i = 0;
    for (let v = xa.min; v <= xa.max + 1e-9; v += xa.step, i++) {
      const cls = i % xm === 0 ? 'g-grid-major' : 'g-grid';
      lines.push(`<line class="${cls}" x1="${r1(this.X(v))}" y1="${this.top}" x2="${r1(this.X(v))}" y2="${this.bottom}"/>`);
    }
    i = 0;
    for (let v = ya.min; v <= ya.max + 1e-9; v += ya.step, i++) {
      const cls = i % ym === 0 ? 'g-grid-major' : 'g-grid';
      lines.push(`<line class="${cls}" x1="${this.left}" y1="${r1(this.Y(v))}" x2="${this.right}" y2="${r1(this.Y(v))}"/>`);
    }
    this.back.push(`<g aria-hidden="true">${lines.join('')}</g>`);
  }

  axes() {
    const { xa, ya } = this;
    const out: string[] = [];
    out.push(
      `<path class="g-axis" d="M${this.left} ${this.top - 8} V${this.bottom} H${this.right + 8}"/>`,
    );
    if (xa.ticks !== false) {
      const every = this.w < 420 ? 2 : 1;
      let i = 0;
      for (let v = xa.min; v <= xa.max + 1e-9; v += xa.step * (xa.major ?? 5), i++) {
        if (i % every) continue;
        const f = xa.fmt ? xa.fmt(v) : String(r1(v));
        this.ticks.push({ x: this.X(v), y: this.bottom + 17, text: f, anchor: 'middle', axis: 'x' });
      }
    }
    if (ya.ticks !== false) {
      for (let v = ya.min; v <= ya.max + 1e-9; v += ya.step * (ya.major ?? 5)) {
        const f = ya.fmt ? ya.fmt(v) : String(r1(v));
        this.ticks.push({ x: this.left - 8, y: this.Y(v) + 4, text: f, anchor: 'end', axis: 'y' });
      }
    }
    out.push(`<text class="g-axis-label" x="${this.right + 8}" y="${this.bottom + 36}" text-anchor="end">${esc(xa.label)}</text>`);
    out.push(`<text class="g-axis-label" x="${this.left - (ya.ticks === false ? 4 : 50)}" y="${this.top - 16}" text-anchor="start">${esc(ya.label)}</text>`);
    this.front.push(`<g>${out.join('')}</g>`);
  }

  private d(points: Pt[]) {
    return points
      .map(([x, y], i) => `${i ? 'L' : 'M'}${r1(this.X(x))} ${r1(this.Y(y))}`)
      .join(' ');
  }

  /** Plot y = f(x). Returns the last point that is visible, for labelling. */
  fn(f: (x: number) => number, cls: string, from = this.xa.min, to = this.xa.max, n = 96): Pt | null {
    const pts: Pt[] = [];
    for (let i = 0; i <= n; i++) {
      const x = from + ((to - from) * i) / n;
      const y = f(x);
      if (Number.isFinite(y)) pts.push([x, y]);
    }
    this.mid.push(`<path class="${cls}" d="${this.d(pts)}" clip-path="url(#${this.clipId})"/>`);
    let last: Pt | null = null;
    for (const p of pts) if (this.inside(p[0], p[1])) last = p;
    return last;
  }

  line(points: Pt[], cls: string, clip = true) {
    this.mid.push(`<path class="${cls}" d="${this.d(points)}"${clip ? ` clip-path="url(#${this.clipId})"` : ''}/>`);
  }

  vline(x: number, cls: string) {
    this.line(
      [
        [x, this.ya.min],
        [x, this.ya.max],
      ],
      cls,
    );
  }

  hline(y: number, cls: string, from = this.xa.min, to = this.xa.max) {
    this.line(
      [
        [from, y],
        [to, y],
      ],
      cls,
    );
  }

  area(points: Pt[], cls: string, label?: string, at?: Pt, hatch = false) {
    if (points.length < 3) return;
    const fill = hatch ? ` fill="url(#${this.clipId}-hatch)"` : '';
    this.back.push(`<path class="${cls}"${fill} d="${this.d(points)} Z" clip-path="url(#${this.clipId})"/>`);
    if (label && at && this.inside(at[0], at[1])) {
      this.front.push(
        `<text class="g-area-label" x="${r1(this.X(at[0]))}" y="${r1(this.Y(at[1])) + 4}" text-anchor="middle">${esc(label)}</text>`,
      );
    }
  }

  dot(x: number, y: number, cls = 'g-dot', r = 5) {
    if (!this.inside(x, y, 1e-6)) return;
    this.front.push(`<circle class="${cls}" cx="${r1(this.X(x))}" cy="${r1(this.Y(y))}" r="${r}"/>`);
  }

  /** Label placed next to a data point, nudged back inside the plot. */
  label(at: Pt | null, text: string, cls: string, dx = 8, dy = -8, side?: 'start' | 'end') {
    if (!at) return;
    let px = this.X(at[0]) + dx;
    const py = Math.min(Math.max(this.Y(at[1]) + dy, this.top + 4), this.bottom - 6);
    let anchor: string = side ?? 'start';
    const approx = text.replace('_', '').length * 7.6;
    if (!side && px + approx > this.right + 4) {
      px = this.X(at[0]) - Math.abs(dx);
      anchor = 'end';
    }
    this.front.push(`<text class="g-label ${cls}" x="${r1(px)}" y="${r1(py)}" text-anchor="${anchor}">${rich(text)}</text>`);
  }

  /** Free text at a data point. */
  note(at: Pt, text: string, anchor: 'start' | 'middle' | 'end' = 'middle', cls = 'g-note') {
    if (!this.inside(at[0], at[1])) return;
    this.front.push(
      `<text class="${cls}" x="${r1(this.X(at[0]))}" y="${r1(this.Y(at[1]))}" text-anchor="${anchor}">${rich(text)}</text>`,
    );
  }

  /** Dashed guides from a point to both axes, with value chips on the axes. */
  guides(x: number, y: number, xText?: string, yText?: string, cls = 'g-guide') {
    if (!this.inside(x, y, 1e-6)) return;
    const px = r1(this.X(x));
    const py = r1(this.Y(y));
    this.back.push(`<path class="${cls}" d="M${this.left} ${py} H${px} V${this.bottom}"/>`);
    if (yText) this.chip(this.left - 6, py, yText, 'end');
    if (xText) this.chip(px, this.bottom + 17, xText, 'middle', true);
  }

  private chip(px: number, py: number, text: string, anchor: 'end' | 'middle', below = false) {
    const cw = text.length * 6.7 + 10;
    const rx = anchor === 'end' ? px - cw : px - cw / 2;
    const ry = below ? py - 12 : py - 9;
    this.chips.push({ x: rx + cw / 2, y: ry + 9, w: cw, axis: below ? 'x' : 'y' });
    this.front.push(
      `<g class="g-chip"><rect x="${r1(rx)}" y="${r1(ry)}" width="${r1(cw)}" height="18" rx="3"/>` +
        `<text x="${r1(rx + cw / 2)}" y="${r1(ry + 13)}" text-anchor="middle">${esc(text)}</text></g>`,
    );
  }

  /** Horizontal bracket spanning x1..x2 at height y, with a label. */
  span(x1: number, x2: number, y: number, text: string, cls = 'g-span', above = true) {
    const a = r1(this.X(Math.min(x1, x2)));
    const b = r1(this.X(Math.max(x1, x2)));
    const py = r1(this.Y(y) + (above ? -12 : 12));
    const tick = above ? 5 : -5;
    this.front.push(
      `<g class="${cls}"><path d="M${a} ${py + tick} V${py} H${b} V${py + tick}"/>` +
        `<text x="${r1((a + b) / 2)}" y="${r1(py + (above ? -6 : 16))}" text-anchor="middle">${esc(text)}</text></g>`,
    );
  }

  /** A grab point the reader can drag. */
  handle(id: string, x: number, y: number) {
    if (!this.inside(x, y)) return;
    this.handles.push({ id, x, y });
    this.front.push(
      `<g class="g-handle" data-handle="${id}"><circle cx="${r1(this.X(x))}" cy="${r1(this.Y(y))}" r="14" class="g-handle-hit"/>` +
        `<circle cx="${r1(this.X(x))}" cy="${r1(this.Y(y))}" r="6.5" class="g-handle-dot"/></g>`,
    );
  }

  svg(): string {
    const clip = `<defs><clipPath id="${this.clipId}"><rect x="${this.left}" y="${this.top}" width="${r1(this.right - this.left)}" height="${r1(this.bottom - this.top)}"/></clipPath>` +
      `<pattern id="${this.clipId}-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" class="g-hatch-bg"/><line x1="0" y1="0" x2="0" y2="7" class="g-hatch-line"/></pattern></defs>`;
    // Drop axis numbers that would sit under a value chip.
    const ticks = this.ticks
      .filter((t) =>
        !this.chips.some((c) =>
          c.axis === t.axis &&
          (t.axis === 'x'
            ? Math.abs(c.x - t.x) < c.w / 2 + t.text.length * 3.6 + 2
            : Math.abs(c.y - (t.y - 4)) < 14),
        ),
      )
      .map((t) => `<text class="g-tick" x="${r1(t.x)}" y="${r1(t.y)}" text-anchor="${t.anchor}">${esc(t.text)}</text>`)
      .join('');
    return clip + this.back.join('') + this.mid.join('') + ticks + this.front.join('');
  }
}

export const money = (v: number, dp = 2) => `$${v.toFixed(dp)}`;
export const pct = (v: number, dp = 1) => `${v.toFixed(dp)}%`;
export const num = (v: number, dp = 0) => v.toFixed(dp);
export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Plot height for a given width, so tall phones don't get squashed graphs. */
export function heightFor(width: number, ratio = 0.72) {
  return clamp(Math.round(width * ratio), 250, 520);
}
