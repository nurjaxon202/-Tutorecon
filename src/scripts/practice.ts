// The question bank: build a set from filters, then answer in tutor mode
// (an explanation after each answer) or exam mode (results at the end, with an
// optional timer at the real exam's pace). Guests get a daily allowance when
// accounts are switched on (see src/lib/access.ts).
import { store } from './store';
import { figureHtml } from './qfigure';
import { loadBank, type BankQ as Q } from './bank';
import { GUEST_DAILY, guestLeft, isGuest } from './access';

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
/** The AP exams give 70 minutes for 60 questions. */
const PACE = 70;
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
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const why = (text: string) => text.replace(/^Correct\.\s*/, '');

export function initPractice() {
  const root = document.querySelector<HTMLElement>('[data-bank]');
  if (!root) return;
  const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const topics: Record<string, TopicInfo> = JSON.parse(document.querySelector('[data-topic-info]')!.textContent!);
  const coursesInfo: CourseInfo[] = JSON.parse(document.querySelector('[data-course-info]')!.textContent!);
  const form = $<HTMLFormElement>('[data-builder]');
  const unitSel = $<HTMLSelectElement>('[data-unit-select]');
  const topicSel = $<HTMLSelectElement>('[data-topic-select]');
  const sizeSel = form.querySelector<HTMLSelectElement>('select[name=size]')!;
  const timedBox = $<HTMLInputElement>('[data-timed]');
  const startBtn = $<HTMLButtonElement>('[data-start]');
  const matchEl = $('[data-match]');
  const wall = root.querySelector<HTMLElement>('[data-guest-wall]');
  let bank: Q[] = [];

  // Filters
  const course = () => (form.querySelector<HTMLInputElement>('input[name=course]:checked')?.value ?? 'micro') as 'micro' | 'macro' | 'all';
  const levels = () => [...form.querySelectorAll<HTMLInputElement>('input[name=level]:checked')].map((i) => Number(i.value));
  const which = () => form.querySelector<HTMLInputElement>('input[name=which]:checked')?.value ?? 'all';
  const mode = () => (form.querySelector<HTMLInputElement>('input[name=mode]:checked')?.value === 'exam' ? 'exam' : 'tutor');

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
    const { qstats: stats, flags } = store.get();
    const due = new Set(w === 'due' ? store.dueReviews() : []);
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
      if (w === 'flagged' && !flags[x.id]) return false;
      if (w === 'due' && !due.has(x.id)) return false;
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

  const size = () => Number(sizeSel.value);
  /** How many questions the next set will have, after the guest allowance. */
  const setSize = (n: number) => Math.min(size() ? Math.min(size(), n) : n, guestLeft());

  const updateMatch = () => {
    timedBox.disabled = mode() !== 'exam';
    if (timedBox.disabled) timedBox.checked = false;
    const dueN = store.dueReviews().length;
    const dueEl = root.querySelector('[data-due-count]');
    if (dueEl) dueEl.textContent = `(${dueN})`;
    const allow = root.querySelector<HTMLElement>('[data-allow]');
    if (allow) {
      const left = guestLeft();
      allow.textContent = isGuest()
        ? left
          ? `As a guest you can answer ${GUEST_DAILY} questions a day. ${left} left today.`
          : `You have used today’s ${GUEST_DAILY} free questions. A free account removes the limit.`
        : '';
    }
    if (!bank.length) return;
    const n = matching().length;
    const take = setSize(n);
    matchEl.textContent = n
      ? `${n} question${n === 1 ? '' : 's'} match. You will get ${take}${timedBox.checked && take ? `, with ${clock(take * PACE)} on the clock` : ''}.`
      : which() === 'due'
        ? 'Nothing is due for smart review right now.'
        : 'No questions match. Try widening the filters.';
    startBtn.disabled = n === 0 || take === 0;
  };

  // Progress panel
  const renderOverview = () => {
    const { qstats: stats, flags } = store.get();
    const ids = Object.keys(stats).filter((id) => bank.some((x) => x.id === id));
    const text = $('[data-progress-text]');
    const missedN = ids.filter((id) => stats[id].l === 0).length;
    const flaggedN = Object.keys(flags).filter((id) => bank.some((x) => x.id === id)).length;
    $('[data-review-link]').hidden = !missedN && !flaggedN;
    $('[data-review-count]').textContent = `(${missedN} missed, ${flaggedN} flagged)`;
    if (!ids.length) {
      text.textContent = `Nothing answered yet. There are ${bank.length || 'hundreds of'} questions waiting. Results are saved in this browser.`;
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
  let exam = false;
  let answers: (number | null)[] = [];
  let results: { q: Q; right: boolean; choice: number | null }[] = [];
  let timer: number | undefined;
  let timedOut = false;
  const runner = $('[data-runner]');
  const overview = $('[data-overview]');
  const resultsEl = $('[data-results]');
  const card = $<HTMLFormElement>('[data-card]');
  const fb = $('[data-feedback]');
  const checkBtn = $<HTMLButtonElement>('[data-check]');
  const prevBtn = $<HTMLButtonElement>('[data-prev]');
  const flagBtn = $<HTMLButtonElement>('[data-flag]');
  const timerEl = $('[data-timer]');
  const syncFlag = () => flagBtn.setAttribute('aria-pressed', String(Boolean(set[at] && store.get().flags[set[at].id])));
  flagBtn.addEventListener('click', () => {
    if (!set[at]) return;
    store.toggleFlag(set[at].id);
    syncFlag();
  });

  const show = (el: 'overview' | 'runner' | 'results' | 'wall') => {
    overview.hidden = el !== 'overview';
    runner.hidden = el !== 'runner';
    resultsEl.hidden = el !== 'results';
    if (wall) wall.hidden = el !== 'wall';
  };

  const showWall = (focus = true) => {
    if (!wall) return;
    show('wall');
    if (focus) wall.focus();
  };

  const stopTimer = () => {
    clearInterval(timer);
    timer = undefined;
    timerEl.hidden = true;
  };

  const start = (list: Q[]) => {
    const cap = guestLeft();
    if (cap === 0) return showWall();
    set = list.slice(0, Math.min(list.length, cap));
    at = 0;
    exam = mode() === 'exam';
    answers = set.map(() => null);
    results = [];
    timedOut = false;
    stopTimer();
    if (exam && timedBox.checked) {
      const end = Date.now() + set.length * PACE * 1000;
      const tick = () => {
        const left = Math.max(0, Math.round((end - Date.now()) / 1000));
        timerEl.textContent = `${clock(left)} left`;
        timerEl.classList.toggle('is-low', left <= 60);
        if (left === 0) {
          timedOut = true;
          saveChoice();
          finish();
        }
      };
      timerEl.hidden = false;
      tick();
      timer = window.setInterval(tick, 1000);
    }
    show('runner');
    render();
    root.querySelector('[data-session]')!.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' });
  };

  const render = () => {
    const q = set[at];
    $('[data-run-count]').textContent = `Question ${at + 1} of ${set.length}${exam ? `, ${answers.filter((a) => a !== null).length} answered` : ''}`;
    $('[data-run-bar]').style.transform = `scaleX(${at / set.length})`;
    const t = topics[mainTopic(q)];
    $('[data-q-meta]').innerHTML = `<span class="q-topic">${t.short} ${t.code}</span><span>${esc(t.title)}</span><span class="q-topic">${LEVEL[q.l]}</span>`;
    $('[data-q-prompt]').textContent = q.p;
    $('[data-q-fig]').innerHTML = figureHtml(q.fg);
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
          `<label class="q-opt" data-opt="${j}"><input type="radio" name="pq" value="${j}"${exam && answers[at] === j ? ' checked' : ''} /><span class="q-letter mono" aria-hidden="true">${LETTERS[j]}</span><span class="q-text">${esc(text)}</span></label>`,
      )
      .join('');
    card.classList.remove('is-done');
    fb.innerHTML = '';
    fb.classList.remove('is-right', 'is-wrong');
    checkBtn.hidden = false;
    checkBtn.textContent = exam ? (at === set.length - 1 ? 'Finish and see results' : 'Next question') : 'Check answer';
    prevBtn.hidden = !exam || at === 0;
    syncFlag();
    $('[data-q-prompt]').focus({ preventScroll: true });
  };

  const picked = () => {
    const el = card.querySelector<HTMLInputElement>('input[name=pq]:checked');
    return el ? Number(el.value) : null;
  };
  const saveChoice = () => {
    if (exam && set[at]) answers[at] = picked() ?? answers[at];
  };

  const check = () => {
    if (card.classList.contains('is-done')) return;
    if (exam) {
      saveChoice();
      if (at < set.length - 1) {
        at += 1;
        render();
      } else finish();
      return;
    }
    const q = set[at];
    const choice = picked();
    if (choice === null) {
      fb.innerHTML = '<p class="q-msg">Choose an answer first.</p>';
      return;
    }
    const right = choice === q.a;
    results.push({ q, right, choice });
    store.recordAnswer(q.id, right);
    store.countBankAnswer();
    const xp = right ? store.rewardAnswer(`q-${q.id}`) : 0;
    card.classList.add('is-done');
    card.querySelectorAll<HTMLInputElement>('input[name=pq]').forEach((r) => (r.disabled = true));
    card.querySelector(`[data-opt="${q.a}"]`)?.classList.add('is-correct');
    if (!right) card.querySelector(`[data-opt="${choice}"]`)?.classList.add('is-wrong');
    checkBtn.hidden = true;
    fb.classList.toggle('is-right', right);
    fb.classList.toggle('is-wrong', !right);
    const last = at === set.length - 1;
    const out = isGuest() && guestLeft() === 0 && last;
    fb.innerHTML =
      (right
        ? `<p class="q-verdict q-right">Correct${xp ? `<span class="xp-chip">+${xp} XP</span>` : ''}</p><p>${esc(why(q.o[choice][1]))}</p>`
        : `<p class="q-verdict q-wrong">Not quite</p><p><strong>You chose ${LETTERS[choice]}.</strong> ${esc(q.o[choice][1])}</p><p><strong>The answer is ${LETTERS[q.a]}.</strong> ${esc(why(q.o[q.a][1]))}</p>`) +
      (out ? `<p class="muted">That was your last free question for today.</p>` : '') +
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

  prevBtn.addEventListener('click', () => {
    saveChoice();
    if (at > 0) {
      at -= 1;
      render();
    }
  });

  const finish = () => {
    stopTimer();
    if (exam) {
      // Exam mode records everything at the end, like the real test.
      results = set.map((q, i) => ({ q, choice: answers[i], right: answers[i] === q.a }));
      for (const r of results) {
        if (r.choice === null) continue;
        store.recordAnswer(r.q.id, r.right);
        store.countBankAnswer();
        if (r.right) store.rewardAnswer(`q-${r.q.id}`);
      }
    }
    const right = results.filter((r) => r.right).length;
    const total = results.length;
    const skipped = results.filter((r) => r.choice === null).length;
    show('results');
    $('[data-results-title]').textContent = `${right} of ${total} correct`;
    $('[data-results-text]').textContent =
      total === 0
        ? 'You ended the set before answering any questions.'
        : (timedOut ? 'Time is up. ' : '') +
          (skipped ? `${skipped} left blank, which count as wrong, just like on the exam. ` : '') +
          (right === total ? 'Every answer right. Try a harder set or a new topic.' : 'Review the topics below, then retry the questions you missed.');
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

    // In exam mode, every question can be opened to see the answer and why.
    $('[data-review-wrap]').hidden = !exam || total === 0;
    $('[data-review-list]').innerHTML = exam
      ? results
          .map((r, i) => {
            const mine = r.choice === null ? 'You left it blank.' : `You chose ${LETTERS[r.choice]}: ${esc(r.q.o[r.choice][0])}.`;
            return `<li><details><summary><span class="mark ${r.right ? 'mark-right' : 'mark-wrong'}">${i + 1}. ${r.right ? 'Right' : r.choice === null ? 'Blank' : 'Wrong'}</span><span>${esc(r.q.p)}</span></summary>
              <div class="rv-body">${figureHtml(r.q.fg)}<p>${mine}</p>${r.right ? '' : `<p><strong>The answer is ${LETTERS[r.q.a]}:</strong> ${esc(r.q.o[r.q.a][0])}.</p>`}<p>${esc(why(r.q.o[r.q.a][1]))}</p>${
                r.choice !== null && !r.right ? `<p class="muted">Why ${LETTERS[r.choice]} is wrong: ${esc(r.q.o[r.choice][1])}</p>` : ''
              }</div></details></li>`;
          })
          .join('')
      : '';

    const missed = results.filter((r) => !r.right).map((r) => r.q);
    const retry = $<HTMLButtonElement>('[data-retry-missed]');
    retry.hidden = missed.length === 0;
    retry.onclick = () => start(shuffle(missed));
    $('[data-again]').onclick = () => start(shuffle(matching()).slice(0, size() || undefined));
    resultsEl.focus();
    renderOverview();
    updateMatch();
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
  $('[data-exit]').addEventListener('click', () => {
    saveChoice();
    finish();
  });
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

  // Filters from the address, like ?course=micro&unit=2&topic=mi2.3, ?which=due, or ?size=0
  const params = new URLSearchParams(location.search);
  const pc = params.get('course');
  if (pc === 'micro' || pc === 'macro' || pc === 'all') form.querySelector<HTMLInputElement>(`input[name=course][value=${pc}]`)!.checked = true;
  const pw = params.get('which');
  if (pw === 'new' || pw === 'missed' || pw === 'flagged' || pw === 'due') form.querySelector<HTMLInputElement>(`input[name=which][value=${pw}]`)!.checked = true;
  const ps = params.get('size');
  if (ps && [...sizeSel.options].some((o) => o.value === ps)) sizeSel.value = ps;
  if (params.get('mode') === 'exam') form.querySelector<HTMLInputElement>('input[name=mode][value=exam]')!.checked = true;
  fillUnits(params.get('unit') ?? undefined);
  fillTopics(params.get('topic') ?? undefined);
  updateMatch();

  loadBank(root.dataset.src!)
    .then((data) => {
      bank = data;
      updateMatch();
      renderOverview();
      // A guest who has used today's questions sees why right away.
      if (guestLeft() === 0) showWall(false);
    })
    .catch(() => {
      matchEl.textContent = 'The questions could not load. Check your connection and reload the page.';
    });
  window.addEventListener('tutorecon:change', () => {
    if (!overview.hidden) renderOverview();
  });
  window.addEventListener('tutorecon:auth', updateMatch);
}
