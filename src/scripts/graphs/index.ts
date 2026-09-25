// Brings every <figure data-graph> on the page to life: sliders, toggles,
// news scenarios, dragging, resizing, and a screen reader summary.

import { Plot, heightFor, type Pt } from './core';
import { graphs, type Setup, type State } from './models';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function mount(fig: HTMLElement) {
  if (fig.dataset.ready) return;
  const make = graphs[fig.dataset.graph ?? ''];
  if (!make) return;
  fig.dataset.ready = 'true';

  const setup: Setup = make();
  let state: State = { ...setup.initial };
  let note = '';
  let plot: Plot | null = null;
  let raf = 0;
  let liveTimer = 0;

  const canvas = fig.querySelector<HTMLElement>('[data-canvas]')!;
  const svg = fig.querySelector<SVGSVGElement>('svg[data-svg]')!;
  const readout = fig.querySelector<HTMLElement>('[data-readout]')!;
  const noteEl = fig.querySelector<HTMLElement>('[data-note]');
  const live = fig.querySelector<HTMLElement>('[data-live]');
  const clipId = `${fig.id}-clip`;

  const syncControls = () => {
    for (const c of setup.controls) {
      const value = state[c.key];
      if (c.type === 'range') {
        const input = fig.querySelector<HTMLInputElement>(`input[data-key="${c.key}"]`);
        if (input && document.activeElement !== input) input.value = String(value);
        const out = fig.querySelector<HTMLOutputElement>(`output[data-out="${c.key}"]`);
        if (out) out.textContent = c.fmt ? c.fmt(Number(value)) : String(Math.round(Number(value) * 100) / 100);
      } else if (c.type === 'toggle') {
        const input = fig.querySelector<HTMLInputElement>(`input[data-key="${c.key}"]`);
        if (input) input.checked = Boolean(value);
      } else {
        fig.querySelectorAll<HTMLInputElement>(`input[data-key="${c.key}"]`).forEach((r) => {
          r.checked = r.value === value;
        });
      }
    }
  };

  const render = () => {
    const w = Math.max(260, Math.round(canvas.clientWidth));
    const h = heightFor(w, Number(fig.dataset.ratio) || setup.ratio);
    plot = new Plot(w, h, setup.x, setup.y, clipId);
    setup.draw(plot, state);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('width', String(w));
    svg.setAttribute('height', String(h));
    svg.innerHTML = plot.svg();
    readout.innerHTML = setup.describe(state);
    if (noteEl) {
      noteEl.textContent = note;
      noteEl.hidden = !note;
    }
    syncControls();
    window.clearTimeout(liveTimer);
    liveTimer = window.setTimeout(() => {
      if (live) live.textContent = `${note ? `${note} ` : ''}${readout.textContent ?? ''}`;
    }, 600);
  };

  const setActiveScenario = (index: number | null) => {
    fig.querySelectorAll<HTMLButtonElement>('[data-scenario]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(Number(btn.dataset.scenario) === index));
    });
  };

  const animateTo = (target: State) => {
    cancelAnimationFrame(raf);
    const from = { ...state };
    const numeric = Object.keys(target).filter(
      (k) => typeof target[k] === 'number' && typeof from[k] === 'number',
    );
    for (const k of Object.keys(target)) if (!numeric.includes(k)) state[k] = target[k];
    if (reduceMotion.matches || numeric.length === 0) {
      state = { ...state, ...target };
      render();
      return;
    }
    const start = performance.now();
    const duration = 700;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
      for (const k of numeric) state[k] = (from[k] as number) + ((target[k] as number) - (from[k] as number)) * e;
      if (t >= 1) state = { ...state, ...target };
      render();
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };

  // Controls
  fig.querySelectorAll<HTMLInputElement>('input[data-key]').forEach((input) => {
    const key = input.dataset.key!;
    const handler = () => {
      cancelAnimationFrame(raf);
      if (input.type === 'range') state[key] = Number(input.value);
      else if (input.type === 'checkbox') state[key] = input.checked;
      else if (input.checked) state[key] = input.value;
      note = '';
      setActiveScenario(null);
      render();
    };
    input.addEventListener('input', handler);
    input.addEventListener('change', handler);
  });

  fig.querySelectorAll<HTMLButtonElement>('[data-scenario]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = Number(btn.dataset.scenario);
      const sc = setup.scenarios?.[index];
      if (!sc) return;
      const target = typeof sc.set === 'function' ? sc.set(state) : sc.set;
      note = sc.note;
      setActiveScenario(index);
      animateTo({ ...target });
    });
  });

  fig.querySelector<HTMLButtonElement>('[data-reset]')?.addEventListener('click', () => {
    note = '';
    setActiveScenario(null);
    animateTo({ ...setup.initial });
  });

  // Dragging
  let drag: { id: string; start: State; startPt: Pt } | null = null;
  const toData = (e: PointerEvent): Pt | null => {
    if (!plot) return null;
    const rect = svg.getBoundingClientRect();
    const sx = plot.w / rect.width;
    const sy = plot.h / rect.height;
    const px = (e.clientX - rect.left) * sx;
    const py = (e.clientY - rect.top) * sy;
    return [plot.invX(px), plot.invY(py)];
  };

  if (setup.drag) {
    svg.addEventListener('pointerdown', (e) => {
      const target = (e.target as Element).closest('[data-handle]');
      if (!target) return;
      const pt = toData(e);
      if (!pt) return;
      e.preventDefault();
      cancelAnimationFrame(raf);
      svg.setPointerCapture(e.pointerId);
      drag = { id: target.getAttribute('data-handle')!, start: { ...state }, startPt: pt };
      fig.classList.add('is-dragging');
    });
    svg.addEventListener('pointermove', (e) => {
      if (!drag || !setup.drag) return;
      const pt = toData(e);
      if (!pt) return;
      const next = setup.drag(drag.id, pt, state, drag.start, drag.startPt);
      if (next) {
        state = next;
        note = '';
        setActiveScenario(null);
        render();
      }
    });
    const end = () => {
      drag = null;
      fig.classList.remove('is-dragging');
    };
    svg.addEventListener('pointerup', end);
    svg.addEventListener('pointercancel', end);
    // Stop the page from scrolling when a finger starts on a handle.
    svg.addEventListener(
      'touchstart',
      (e) => {
        if ((e.target as Element).closest('[data-handle]')) e.preventDefault();
      },
      { passive: false },
    );
  }

  let resizeRaf = 0;
  new ResizeObserver(() => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(render);
  }).observe(canvas);

  render();
}

export function mountAll(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('figure[data-graph]').forEach(mount);
}

mountAll();
