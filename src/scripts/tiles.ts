// Marks unit tiles with the reader's progress, from this browser only.
import { store } from './store';

const sync = () => {
  const saved = store.get();
  document.querySelectorAll<HTMLElement>('.tile[data-unit]').forEach((tile) => {
    const slug = tile.dataset.unit!;
    const el = tile.querySelector<HTMLElement>('[data-status]');
    if (!el) return;
    const quiz = saved.quiz[slug];
    if (saved.done[slug]) el.textContent = quiz ? `Done · ${quiz.best}/${quiz.total}` : 'Done';
    else el.textContent = quiz ? `Quiz ${quiz.best}/${quiz.total}` : '';
  });
};
window.addEventListener('tutorecon:change', sync);
sync();
