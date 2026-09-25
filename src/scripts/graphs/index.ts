// Brings every <figure data-graph> on the page to life: sliders, toggles,
// news scenarios with the four moves, dragging, resizing, and a screen
// reader summary.

import { Plot, heightFor, type Pt } from './core';
import { graphs, type Scenario, type Setup, type State } from './models';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const MOVE_GAP = 1400;

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
  let timers: number[] = [];
  let lastScenario: number | null = null;
  const introUntil = fig.dataset.intro === 'true' && !reduceMotion.matches ? performance.now() + 1600 : 0;

  const canvas = fig.querySelector<HTMLElement>('[data-canvas]')!;
  const svg = fig.querySelector<SVGSVGElement>('svg[data-svg]')!;
  const readout = fig.querySelector<HTMLElement>('[data-readout]')!;
  const noteEl = fig.querySelector<HTMLElement>('[data-note]');
  const live = fig.querySelector<HTMLElement>('[data-live]');
  const movesEl = fig.querySelector<HTMLElement>('[data-moves]');
  const moveItems = Array.from(fig.querySelectorAll<HTMLElement>('[data-move]'));
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

  const announce = (text: string, delay = 600) => {
    window.clearTimeout(liveTimer);
    liveTimer = window.setTimeout(() => {
      if (live) live.textContent = text;
    }, delay);
  };

  const render = () => {
    const w = Math.max(260, Math.round(canvas.clientWidth));
    const h = heightFor(w, Number(fig.dataset.ratio) || setup.ratio);
    const intro = performance.now() < introUntil;
    plot = new Plot(w, h, setup.x, setup.y, clipId, { intro });
    setup.draw(plot, state);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('width', String(w));
    svg.setAttribute('height', String(h));
    svg.innerHTML = plot.svg();
    fig.classList.toggle('is-intro', intro);
    readout.innerHTML = setup.describe(state);
    if (noteEl) {
      noteEl.textContent = note;
      noteEl.hidden = !note;
    }
    syncControls();
    if (!movesEl || movesEl.hidden) announce(`${note ? `${note} ` : ''}${readout.textContent ?? ''}`);
  };

  // A ring that pulses once around the new equilibrium.
  const pulse = () => {
    if (reduceMotion.matches) return;
    svg.querySelectorAll('.g-dot-eq').forEach((dot) => {
      const ring = dot.cloneNode() as SVGCircleElement;
      ring.setAttribute('class', 'g-ring');
      svg.appendChild(ring);
    });
  };

  const setActiveScenario = (index: number | null) => {
    fig.querySelectorAll<HTMLButtonElement>('[data-scenario]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(Number(btn.dataset.scenario) === index));
    });
  };

  const stopMoves = () => {
    timers.forEach((t) => window.clearTimeout(t));
    timers = [];
    if (movesEl) movesEl.hidden = true;
    if (state._hl) state._hl = '';
  };

  const animateTo = (target: State, onDone?: () => void) => {
    cancelAnimationFrame(raf);
    const from = { ...state };
    const numeric = Object.keys(target).filter(
      (k) => typeof target[k] === 'number' && typeof from[k] === 'number',
    );
    for (const k of Object.keys(target)) if (!numeric.includes(k)) state[k] = target[k];
    if (reduceMotion.matches || numeric.length === 0) {
      state = { ...state, ...target };
      render();
      onDone?.();
      return;
    }
    const start = performance.now();
    const duration = 800;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
      for (const k of numeric) state[k] = (from[k] as number) + ((target[k] as number) - (from[k] as number)) * e;
      if (t >= 1) state = { ...state, ...target };
      render();
      if (t < 1) raf = requestAnimationFrame(step);
      else {
        pulse();
        onDone?.();
      }
    };
    raf = requestAnimationFrame(step);
  };

  const setMove = (k: number) => {
    moveItems.forEach((li, i) => {
      li.dataset.state = i < k ? 'done' : i === k ? 'active' : 'todo';
    });
  };

  // The tutor sequence: what changed, which curve, which way, what happens.
  const playMoves = (sc: Scenario, target: State) => {
    if (!movesEl || !sc.moves) return;
    moveItems.forEach((li, i) => {
      const text = li.querySelector<HTMLElement>('[data-move-text]');
      if (text) text.textContent = sc.moves![i];
    });
    movesEl.hidden = false;
    note = '';
    const base = { ...setup.initial };

    if (reduceMotion.matches) {
      state = { ...base, ...target, _hl: '' };
      render();
      setMove(4);
      announce(sc.moves.join(' '), 100);
      return;
    }

    state = { ...base };
    render();
    setMove(0);
    timers.push(
      window.setTimeout(() => {
        setMove(1);
        state._hl = sc.hl ?? '';
        render();
      }, MOVE_GAP),
      window.setTimeout(() => {
        setMove(2);
        animateTo({ ...target, _hl: sc.hl ?? '' });
      }, MOVE_GAP * 2),
      window.setTimeout(() => {
        setMove(3);
        state._hl = '';
        render();
        pulse();
      }, MOVE_GAP * 3 + 200),
      window.setTimeout(() => {
        setMove(4);
        announce(`${sc.moves!.join(' ')} ${readout.textContent ?? ''}`, 50);
      }, MOVE_GAP * 4),
    );
  };

  // Controls
  fig.querySelectorAll<HTMLInputElement>('input[data-key]').forEach((input) => {
    const key = input.dataset.key!;
    const handler = () => {
      cancelAnimationFrame(raf);
      stopMoves();
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

  const runScenario = (index: number) => {
    const sc = setup.scenarios?.[index];
    if (!sc) return;
    stopMoves();
    lastScenario = index;
    const target = typeof sc.set === 'function' ? sc.set(state) : sc.set;
    setActiveScenario(index);
    if (sc.moves && movesEl) {
      playMoves(sc, { ...target });
    } else {
      note = sc.note;
      animateTo({ ...target });
    }
  };

  fig.querySelectorAll<HTMLButtonElement>('[data-scenario]').forEach((btn) => {
    btn.addEventListener('click', () => runScenario(Number(btn.dataset.scenario)));
  });

  fig.querySelector<HTMLButtonElement>('[data-replay]')?.addEventListener('click', () => {
    if (lastScenario !== null) runScenario(lastScenario);
  });

  fig.querySelector<HTMLButtonElement>('[data-reset]')?.addEventListener('click', () => {
    stopMoves();
    note = '';
    lastScenario = null;
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
      stopMoves();
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
      if (drag) pulse();
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
  let lastWidth = 0;
  new ResizeObserver(() => {
    const w = Math.round(canvas.clientWidth);
    if (w === lastWidth) return;
    lastWidth = w;
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(render);
  }).observe(canvas);

  lastWidth = Math.round(canvas.clientWidth);
  render();
}

export function mountAll(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('figure[data-graph]').forEach(mount);
}

mountAll();
