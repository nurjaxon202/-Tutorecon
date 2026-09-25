// Practice questions: check one at a time, explain every choice, save the score.
import { store } from './store';

interface QData {
  answer: number;
  why: string[];
  unit: string;
}

const letters = ['A', 'B', 'C', 'D', 'E'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
  let active: HTMLElement[] = cards;
  let results = new Map<string, boolean>();

  const showBest = () => {
    const saved = store.get().quiz[saveAs];
    if (bestEl && saved) {
      bestEl.hidden = false;
      bestEl.textContent = `Your best: ${saved.best} of ${saved.total}`;
    }
  };

  const resetCard = (card: HTMLElement) => {
    card.classList.remove('is-done');
    card.querySelectorAll<HTMLInputElement>('input[type=radio]').forEach((r) => {
      r.checked = false;
      r.disabled = false;
    });
    card.querySelectorAll('.q-opt').forEach((o) => o.classList.remove('is-correct', 'is-wrong'));
    const fb = card.querySelector<HTMLElement>('[data-feedback]');
    if (fb) fb.innerHTML = '';
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
  };

  const finish = () => {
    const correct = [...results.values()].filter(Boolean).length;
    const total = active.length;
    const saved = store.saveQuiz(saveAs, correct, total);
    const message =
      correct === total
        ? 'Every answer right.'
        : correct >= total * 0.7
          ? 'Solid. Reread the explanations for the ones you missed.'
          : 'Worth another pass. Open the lesson sections for the questions you missed, then try again.';
    scoreEl.hidden = false;
    scoreEl.innerHTML = `
      <p class="quiz-score-num"><span class="mono">${correct}</span> of <span class="mono">${total}</span> correct</p>
      <p>${message} Your best score is ${saved.best} of ${saved.total}.</p>
      <div class="btn-row"><button type="button" class="btn btn-secondary btn-small" data-retry>${sample ? 'Try a new set' : 'Try these again'}</button></div>`;
    scoreEl.querySelector('[data-retry]')?.addEventListener('click', () => {
      if (sample) pickSet();
      else {
        cards.forEach(resetCard);
        results = new Map();
        scoreEl.hidden = true;
      }
      (active[0]?.querySelector('input') as HTMLElement | null)?.focus();
    });
    showBest();
  };

  cards.forEach((card) => {
    const id = card.dataset.q!;
    const q = data[id];
    const btn = card.querySelector<HTMLButtonElement>('[data-check]')!;
    const fb = card.querySelector<HTMLElement>('[data-feedback]')!;
    btn.addEventListener('click', () => {
      const picked = card.querySelector<HTMLInputElement>('input[type=radio]:checked');
      if (!picked) {
        fb.innerHTML = '<p class="q-msg">Choose an answer first.</p>';
        return;
      }
      const choice = Number(picked.value);
      const right = choice === q.answer;
      results.set(id, right);
      card.classList.add('is-done');
      card.querySelectorAll<HTMLInputElement>('input[type=radio]').forEach((r) => (r.disabled = true));
      card.querySelector(`[data-opt="${q.answer}"]`)?.classList.add('is-correct');
      if (!right) card.querySelector(`[data-opt="${choice}"]`)?.classList.add('is-wrong');
      btn.hidden = true;
      fb.innerHTML = right
        ? `<p class="q-verdict q-right">Correct.</p><p>${q.why[choice]}</p>`
        : `<p class="q-verdict q-wrong">Not quite. You chose ${letters[choice]}.</p><p>${q.why[choice]}</p>` +
          `<p class="q-answer"><strong>The answer is ${letters[q.answer]}.</strong> ${q.why[q.answer]}</p>`;
      if (active.every((c) => results.has(c.dataset.q!))) finish();
    });
  });

  if (sample) {
    root.querySelectorAll<HTMLInputElement>('input[data-course]').forEach((r) => r.addEventListener('change', pickSet));
    root.querySelector('[data-new-set]')?.addEventListener('click', pickSet);
    pickSet();
  }
  showBest();
}

document.querySelectorAll<HTMLElement>('[data-quiz]').forEach(mount);
