// Practice questions: check one at a time, explain every choice, save the score.
import { store } from './store';
import { isGuest } from './access';

interface QData {
  answer: number;
  why: string[];
  unit: string;
}

const letters = ['A', 'B', 'C', 'D', 'E'];
const PRAISE = ['Nice work!', 'Correct!', 'Exactly right!', 'Spot on!'];
const ICON_RIGHT =
  '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_WRONG =
  '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function ring(correct: number, total: number) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const off = c * (1 - (total ? correct / total : 0));
  return `<svg class="score-ring" viewBox="0 0 92 92" aria-hidden="true">
    <circle class="track" cx="46" cy="46" r="${r}"/>
    <circle class="fill" cx="46" cy="46" r="${r}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${c.toFixed(1)}" data-off="${off.toFixed(1)}"/>
    <text x="46" y="54" text-anchor="middle">${Math.round((correct / Math.max(1, total)) * 100)}%</text>
  </svg>`;
}

function mount(root: HTMLElement) {
  if (root.dataset.ready) return;
  root.dataset.ready = 'true';
  const data: Record<string, QData> = JSON.parse(root.querySelector('[data-quiz-data]')?.textContent ?? '{}');
  const saveAs = root.dataset.save ?? 'quiz';
  const sample = Number(root.dataset.sample) || 0;
  const cards = Array.from(root.querySelectorAll<HTMLElement>('.qcard'));
  const scoreEl = root.querySelector<HTMLElement>('[data-score]')!;
  const bestEl = root.querySelector<HTMLElement>('[data-best]');
  const strip = root.querySelector<HTMLElement>('[data-strip]');
  let active: HTMLElement[] = cards;
  let results = new Map<string, boolean>();

  const showBest = () => {
    const saved = store.get().quiz[saveAs];
    if (bestEl && saved) {
      bestEl.hidden = false;
      bestEl.textContent = `Your best: ${saved.best} of ${saved.total}`;
    }
  };

  const drawStrip = () => {
    if (!strip) return;
    strip.innerHTML = active
      .map((c) => {
        const r = results.get(c.dataset.q!);
        return `<li${r === undefined ? '' : ` data-result="${r ? 'right' : 'wrong'}"`}></li>`;
      })
      .join('');
  };

  const resetCard = (card: HTMLElement) => {
    card.classList.remove('is-done');
    card.querySelectorAll<HTMLInputElement>('input[type=radio]').forEach((r) => {
      r.checked = false;
      r.disabled = false;
    });
    card.querySelectorAll('.q-opt').forEach((o) => o.classList.remove('is-correct', 'is-wrong'));
    const fb = card.querySelector<HTMLElement>('[data-feedback]');
    if (fb) {
      fb.innerHTML = '';
      fb.classList.remove('is-right', 'is-wrong');
    }
    const btn = card.querySelector<HTMLButtonElement>('[data-check]');
    if (btn) btn.hidden = false;
  };

  const number = () => {
    active.forEach((card, i) => {
      const n = card.querySelector('[data-qn]');
      if (n) n.textContent = `Question ${i + 1} of ${active.length}`;
    });
  };

  const pickSet = () => {
    const course = root.querySelector<HTMLInputElement>('input[data-course]:checked')?.value ?? 'all';
    const pool = cards.filter((c) => course === 'all' || c.dataset.course === course || c.dataset.course === 'both');
    active = shuffle(pool).slice(0, sample);
    const list = root.querySelector('.quiz-list')!;
    cards.forEach((c) => {
      c.hidden = true;
      resetCard(c);
    });
    active.forEach((c) => {
      c.hidden = false;
      list.appendChild(c);
    });
    results = new Map();
    scoreEl.hidden = true;
    number();
    drawStrip();
  };

  const finish = () => {
    const correct = [...results.values()].filter(Boolean).length;
    const total = active.length;
    const saved = store.saveQuiz(saveAs, correct, total);
    // Finishing a unit's own check marks the unit done and pays a one-time bonus.
    let bonus = 0;
    if (root.dataset.unitCheck === 'true' && !store.isDone(saveAs)) {
      store.setDone(saveAs, true);
      bonus = store.rewardAnswer(`unit-${saveAs}`, 30);
    }
    const message =
      correct === total
        ? 'Every answer right.'
        : correct >= total * 0.7
          ? 'Solid. Reread the explanations for the ones you missed.'
          : 'Worth another pass. Reread the lesson sections for the questions you missed, then try again.';
    scoreEl.hidden = false;
    scoreEl.innerHTML = `
      ${ring(correct, total)}
      <div>
        <p class="quiz-score-num">${bonus ? 'Unit complete! ' : ''}${correct} of ${total} correct</p>
        <p>${message} Your best score is ${saved.best} of ${saved.total}.${bonus ? ` You earned a ${bonus} XP bonus for finishing the unit.` : ''}</p>
      </div>
      <div class="btn-row"><button type="button" class="btn btn-small" data-retry>${sample ? 'Try a new set' : 'Try these again'}</button></div>`;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const fill = scoreEl.querySelector<SVGCircleElement>('.fill');
        if (fill) fill.setAttribute('stroke-dashoffset', fill.dataset.off ?? '0');
      }),
    );
    scoreEl.querySelector('[data-retry]')?.addEventListener('click', () => {
      if (sample) pickSet();
      else {
        cards.forEach(resetCard);
        results = new Map();
        scoreEl.hidden = true;
        drawStrip();
      }
      (active[0]?.querySelector('input') as HTMLElement | null)?.focus();
    });
    showBest();
  };

  const check = (card: HTMLElement) => {
    const id = card.dataset.q!;
    const q = data[id];
    const btn = card.querySelector<HTMLButtonElement>('[data-check]')!;
    const fb = card.querySelector<HTMLElement>('[data-feedback]')!;
    if (card.classList.contains('is-done')) return;
    const picked = card.querySelector<HTMLInputElement>('input[type=radio]:checked');
    if (!picked) {
      fb.innerHTML = '<p class="q-msg">Choose an answer first.</p>';
      return;
    }
    const choice = Number(picked.value);
    const right = choice === q.answer;
    results.set(id, right);
    store.recordAnswer(id, right);
    card.classList.add('is-done');
    card.querySelectorAll<HTMLInputElement>('input[type=radio]').forEach((r) => (r.disabled = true));
    card.querySelector(`[data-opt="${q.answer}"]`)?.classList.add('is-correct');
    if (!right) card.querySelector(`[data-opt="${choice}"]`)?.classList.add('is-wrong');
    btn.hidden = true;
    const xp = right ? store.rewardAnswer(`q-${id}`) : 0;
    fb.classList.toggle('is-right', right);
    fb.classList.toggle('is-wrong', !right);
    fb.innerHTML = right
      ? `<p class="q-verdict q-right">${ICON_RIGHT}${PRAISE[Math.floor(Math.random() * PRAISE.length)]}${xp ? `<span class="xp-chip">+${xp} XP</span>` : ''}</p><p>${esc(q.why[choice])}</p>`
      : `<p class="q-verdict q-wrong">${ICON_WRONG}Not quite</p><p>You chose ${letters[choice]}. ${esc(q.why[choice])}</p>` +
        `<p class="q-answer"><strong>The answer is ${letters[q.answer]}.</strong> ${esc(q.why[q.answer])}</p>`;
    drawStrip();
    // Move on to the next unanswered question, so keyboard users can keep going.
    const next = active.find((c) => !results.has(c.dataset.q!));
    if (next) fb.insertAdjacentHTML('beforeend', '<p><button type="button" class="btn btn-secondary btn-small" data-next>Next question</button></p>');
    fb.querySelector('[data-next]')?.addEventListener('click', () => {
      next?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      next?.querySelector<HTMLInputElement>('input[type=radio]')?.focus({ preventScroll: true });
    });
    if (active.every((c) => results.has(c.dataset.q!))) finish();
  };

  cards.forEach((card) => {
    card.querySelector<HTMLButtonElement>('[data-check]')!.addEventListener('click', () => check(card));
    // A to E (or 1 to 5) picks an answer; Enter checks it.
    card.addEventListener('keydown', (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || card.classList.contains('is-done')) return;
      const key = e.key.toLowerCase();
      const idx = 'abcde'.indexOf(key) >= 0 ? 'abcde'.indexOf(key) : '12345'.indexOf(key);
      const radios = card.querySelectorAll<HTMLInputElement>('input[type=radio]');
      if (idx >= 0 && idx < radios.length) {
        e.preventDefault();
        radios[idx].checked = true;
        radios[idx].focus();
        radios[idx].dispatchEvent(new Event('change', { bubbles: true }));
      } else if (key === 'enter' && (e.target as HTMLElement).matches('input[type=radio]')) {
        e.preventDefault();
        check(card);
      }
    });
  });

  // Guests practice the first few questions of a topic; the rest need an account.
  if (root.dataset.preview !== undefined && isGuest()) {
    active = cards.filter((c) => !c.hasAttribute('data-over-preview'));
    number();
  }

  if (sample) {
    root.querySelectorAll<HTMLInputElement>('input[data-course]').forEach((r) => r.addEventListener('change', pickSet));
    root.querySelector('[data-new-set]')?.addEventListener('click', pickSet);
    pickSet();
  } else {
    drawStrip();
  }
  showBest();
}

document.querySelectorAll<HTMLElement>('[data-quiz]').forEach(mount);
