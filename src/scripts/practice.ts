// The question bank: build a set from filters, answer one question at a time
// with instant explanations, then see results by topic.
import { store } from './store';

interface Q {
  id: string;
  u: string;
  t: string[];
  l: 1 | 2 | 3;
  p: string;
  tb?: { head: string[]; rows: (string | number)[][] };
  o: [string, string][];
  a: number;
}
interface TopicInfo {
  code: string;
  title: string;
  course: 'micro' | 'macro';
  short: string;
  unit: number;
}
interface CourseInfo {
  id: 'micro' | 'macro';
  short: string;
  units: { n: number; title: string; topics: string[] }[];
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const LEVEL = { 1: 'Recall', 2: 'Apply', 3: 'Multi-step' } as const;
const esc = (s: string | number) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const shuffle = <T>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initPractice() {
  const root = document.querySelector<HTMLElement>('[data-bank]');
  if (!root) return;
  const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const topics: Record<string, TopicInfo> = JSON.parse(document.querySelector('[data-topic-info]')!.textContent!);
  const coursesInfo: CourseInfo[] = JSON.parse(document.querySelector('[data-course-info]')!.textContent!);
  const form = $<HTMLFormElement>('[data-builder]');
  const unitSel = $<HTMLSelectElement>('[data-unit-select]');
  const topicSel = $<HTMLSelectElement>('[data-topic-select]');
  const startBtn = $<HTMLButtonElement>('[data-start]');
  const matchEl = $('[data-match]');
  let bank: Q[] = [];

  // Filters
  const course = () => (form.querySelector<HTMLInputElement>('input[name=course]:checked')?.value ?? 'micro') as 'micro' | 'macro' | 'all';
  const levels = () => [...form.querySelectorAll<HTMLInputElement>('input[name=level]:checked')].map((i) => Number(i.value));
  const which = () => form.querySelector<HTMLInputElement>('input[name=which]:checked')?.value ?? 'all';

  const fillUnits = (keep?: string) => {
    const c = coursesInfo.find((x) => x.id === course());
    unitSel.innerHTML =
      '<option value="all">All units</option>' +
      (c ? c.units.map((u) => `<option value="${u.n}">Unit ${u.n}: ${esc(u.title)}</option>`).join('') : '');
    unitSel.disabled = !c;
    if (keep && [...unitSel.options].some((o) => o.value === keep)) unitSel.value = keep;
  };
  const fillTopics = (keep?: string) => {
    const c = coursesInfo.find((x) => x.id === course());
    const u = c?.units.find((x) => String(x.n) === unitSel.value);
    topicSel.innerHTML =
      '<option value="all">All topics</option>' +
      (u ? u.topics.map((id) => `<option value="${id}">${topics[id].code} ${esc(topics[id].title)}</option>`).join('') : '');
    topicSel.disabled = !u;
    if (keep && [...topicSel.options].some((o) => o.value === keep)) topicSel.value = keep;
  };

  const matching = () => {
    const c = course();
    const lv = levels();
    const w = which();
    const stats = store.get().qstats;
    const prefix = c === 'micro' ? 'mi' : c === 'macro' ? 'ma' : '';
    const unit = unitSel.value;
    const topic = topicSel.value;
    return bank.filter((x) => {
      if (!lv.includes(x.l)) return false;
      if (topic !== 'all' && !topicSel.disabled) {
        if (!x.t.includes(topic)) return false;
      } else if (unit !== 'all' && !unitSel.disabled) {
        if (!x.t.some((t) => t.startsWith(`${prefix}${unit}.`))) return false;
      } else if (prefix && !x.t.some((t) => t.startsWith(prefix))) return false;
      if (w === 'new' && stats[x.id]) return false;
      if (w === 'missed' && !(stats[x.id] && stats[x.id].l === 0)) return false;
      return true;
    });
  };

  // The topic a question is filed under in this set: the chosen topic, or the
  // first one from the chosen course.
  const mainTopic = (x: Q) => {
    if (!topicSel.disabled && topicSel.value !== 'all' && x.t.includes(topicSel.value)) return topicSel.value;
    const c = course();
    return x.t.find((id) => c === 'all' || id.startsWith(c === 'micro' ? 'mi' : 'ma')) ?? x.t[0];
  };

  const size = () => Number(form.querySelector<HTMLSelectElement>('select[name=size]')!.value);
  const updateMatch = () => {
    if (!bank.length) return;
    const n = matching().length;
    const take = size() ? Math.min(size(), n) : n;
    matchEl.textContent = n ? `${n} question${n === 1 ? '' : 's'} match. You will get ${take}.` : 'No questions match. Try widening the filters.';
    startBtn.disabled = n === 0;
  };

  // Progress panel
  const renderOverview = () => {
    const stats = store.get().qstats;
    const ids = Object.keys(stats).filter((id) => bank.some((x) => x.id === id));
    const text = $('[data-progress-text]');
    if (!ids.length) {
      text.textContent = `Nothing answered yet. There are ${bank.length || 'hundreds of'} questions waiting. Results are saved in this browser only.`;
      $('[data-weak]').hidden = true;
      return;
    }
    const tries = ids.reduce((n, id) => n + stats[id].a, 0);
    const right = ids.reduce((n, id) => n + stats[id].c, 0);
    text.textContent = `You have answered ${ids.length} of ${bank.length} questions (${tries} attempts, ${Math.round((right / tries) * 100)}% correct).`;
    const per: Record<string, { a: number; c: number }> = {};
    for (const x of bank) {
      const st = stats[x.id];
      if (!st) continue;
      for (const t of x.t) {
        per[t] ??= { a: 0, c: 0 };
        per[t].a += st.a;
        per[t].c += st.c;
      }
    }
    const weak = Object.entries(per)
      .filter(([, v]) => v.a >= 3)
      .map(([id, v]) => ({ id, pct: v.c / v.a, ...v }))
      .filter((w) => w.pct < 0.8)
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 5);
    $('[data-weak]').hidden = !weak.length;
    $('[data-weak-list]').innerHTML = weak
      .map((w) => {
        const t = topics[w.id];
        return `<li><span>${t.short} ${t.code} ${esc(t.title)}</span><span class="pct">${Math.round(w.pct * 100)}%</span><a href="?course=${t.course}&unit=${t.unit}&topic=${w.id}">Practice</a></li>`;
      })
      .join('');
  };

  // Session
  let set: Q[] = [];
  let at = 0;
  let results: { q: Q; right: boolean }[] = [];
  const runner = $('[data-runner]');
  const overview = $('[data-overview]');
  const resultsEl = $('[data-results]');
  const card = $<HTMLFormElement>('[data-card]');
  const fb = $('[data-feedback]');
  const checkBtn = $<HTMLButtonElement>('[data-check]');

  const show = (el: 'overview' | 'runner' | 'results') => {
    overview.hidden = el !== 'overview';
    runner.hidden = el !== 'runner';
    resultsEl.hidden = el !== 'results';
  };

  const start = (list: Q[]) => {
    set = list;
    at = 0;
    results = [];
    show('runner');
    render();
    root.querySelector('[data-session]')!.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' });
  };

  const render = () => {
    const q = set[at];
    $('[data-run-count]').textContent = `Question ${at + 1} of ${set.length}`;
    $('[data-run-bar]').style.transform = `scaleX(${at / set.length})`;
    const t = topics[mainTopic(q)];
    $('[data-q-meta]').innerHTML = `<span class="q-topic">${t.short} ${t.code}</span><span>${esc(t.title)}</span><span class="q-topic">${LEVEL[q.l]}</span>`;
    $('[data-q-prompt]').textContent = q.p;
    const tb = $('[data-q-table]');
    tb.hidden = !q.tb;
    tb.innerHTML = q.tb
      ? `<table><thead><tr>${q.tb.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${q.tb.rows
          .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
          .join('')}</tbody></table>`
      : '';
    $('[data-q-options]').innerHTML = q.o
      .map(
        ([text], j) =>
          `<label class="q-opt" data-opt="${j}"><input type="radio" name="pq" value="${j}" /><span class="q-letter mono" aria-hidden="true">${LETTERS[j]}</span><span class="q-text">${esc(text)}</span></label>`,
      )
      .join('');
    card.classList.remove('is-done');
    fb.innerHTML = '';
    fb.classList.remove('is-right', 'is-wrong');
    checkBtn.hidden = false;
    $('[data-q-prompt]').focus({ preventScroll: true });
  };

  const check = () => {
    if (card.classList.contains('is-done')) return;
    const q = set[at];
    const picked = card.querySelector<HTMLInputElement>('input[name=pq]:checked');
    if (!picked) {
      fb.innerHTML = '<p class="q-msg">Choose an answer first.</p>';
      return;
    }
    const choice = Number(picked.value);
    const right = choice === q.a;
    results.push({ q, right });
    store.recordAnswer(q.id, right);
    const xp = right ? store.rewardAnswer(`q-${q.id}`) : 0;
    card.classList.add('is-done');
    card.querySelectorAll<HTMLInputElement>('input[name=pq]').forEach((r) => (r.disabled = true));
    card.querySelector(`[data-opt="${q.a}"]`)?.classList.add('is-correct');
    if (!right) card.querySelector(`[data-opt="${choice}"]`)?.classList.add('is-wrong');
    checkBtn.hidden = true;
    fb.classList.toggle('is-right', right);
    fb.classList.toggle('is-wrong', !right);
    const last = at === set.length - 1;
    fb.innerHTML =
      (right
        ? `<p class="q-verdict q-right">Correct${xp ? `<span class="xp-chip">+${xp} XP</span>` : ''}</p><p>${esc(q.o[choice][1].replace(/^Correct\.\s*/, ''))}</p>`
        : `<p class="q-verdict q-wrong">Not quite</p><p><strong>You chose ${LETTERS[choice]}.</strong> ${esc(q.o[choice][1])}</p><p><strong>The answer is ${LETTERS[q.a]}.</strong> ${esc(q.o[q.a][1].replace(/^Correct\.\s*/, ''))}</p>`) +
      `<p><button type="button" class="btn" data-next>${last ? 'See results' : 'Next question'}</button></p>`;
    fb.querySelector<HTMLButtonElement>('[data-next]')!.addEventListener('click', next);
    fb.querySelector<HTMLButtonElement>('[data-next]')!.focus({ preventScroll: true });
  };

  const next = () => {
    if (at < set.length - 1) {
      at += 1;
      render();
      card.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'nearest' });
    } else finish();
  };

  const finish = () => {
    const right = results.filter((r) => r.right).length;
    const total = results.length;
    show('results');
    $('[data-results-title]').textContent = `${right} of ${total} correct`;
    $('[data-results-text]').textContent =
      total === 0
        ? 'You ended the set before answering any questions.'
        : right === total
          ? 'Every answer right. Try a harder set or a new topic.'
          : 'Review the topics below, then retry the questions you missed.';
    const per: Record<string, { a: number; c: number }> = {};
    for (const r of results) {
      const id = mainTopic(r.q);
      per[id] ??= { a: 0, c: 0 };
      per[id].a += 1;
      if (r.right) per[id].c += 1;
    }
    $('[data-results-topics]').innerHTML = Object.entries(per)
      .sort((a, b) => a[1].c / a[1].a - b[1].c / b[1].a)
      .map(([id, v]) => `<tr><td>${topics[id].short} ${topics[id].code} ${esc(topics[id].title)}</td><td>${v.c} of ${v.a}</td></tr>`)
      .join('');
    const missed = results.filter((r) => !r.right).map((r) => r.q);
    const retry = $<HTMLButtonElement>('[data-retry-missed]');
    retry.hidden = missed.length === 0;
    retry.onclick = () => start(shuffle(missed));
    $('[data-again]').onclick = () => {
      const list = shuffle(matching());
      start(size() ? list.slice(0, size()) : list);
    };
    resultsEl.focus();
    renderOverview();
  };

  // Wire up
  form.addEventListener('change', (e) => {
    const t = e.target as HTMLElement;
    if (t.matches('input[name=course]')) {
      fillUnits();
      fillTopics();
    } else if (t === unitSel) fillTopics();
    updateMatch();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const list = shuffle(matching());
    if (!list.length) return;
    start(size() ? list.slice(0, size()) : list);
  });
  checkBtn.addEventListener('click', check);
  $('[data-exit]').addEventListener('click', finish);
  card.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const key = e.key.toLowerCase();
    if (card.classList.contains('is-done')) return;
    const idx = 'abcde'.indexOf(key) >= 0 ? 'abcde'.indexOf(key) : '12345'.indexOf(key);
    const radios = card.querySelectorAll<HTMLInputElement>('input[name=pq]');
    if (idx >= 0 && idx < radios.length && (e.target as HTMLElement).tagName !== 'BUTTON') {
      e.preventDefault();
      radios[idx].checked = true;
      radios[idx].focus();
    } else if (key === 'enter' && (e.target as HTMLElement).matches('input[name=pq]')) {
      e.preventDefault();
      check();
    }
  });

  // Filters from the address, like ?course=micro&unit=2&topic=mi2.3 or ?which=missed
  const params = new URLSearchParams(location.search);
  const pc = params.get('course');
  if (pc === 'micro' || pc === 'macro' || pc === 'all') form.querySelector<HTMLInputElement>(`input[name=course][value=${pc}]`)!.checked = true;
  const pw = params.get('which');
  if (pw === 'new' || pw === 'missed') form.querySelector<HTMLInputElement>(`input[name=which][value=${pw}]`)!.checked = true;
  fillUnits(params.get('unit') ?? undefined);
  fillTopics(params.get('topic') ?? undefined);

  fetch(root.dataset.src!)
    .then((r) => r.json())
    .then((data: Q[]) => {
      bank = data;
      updateMatch();
      renderOverview();
    })
    .catch(() => {
      matchEl.textContent = 'The questions could not load. Check your connection and reload the page.';
    });
  window.addEventListener('tutorecon:change', () => {
    if (!overview.hidden) renderOverview();
  });
}
