// Lights up finished units on any path of unit nodes.
// Nodes carry data-path-track. Until the shared first unit ("main") is done,
// only it gets the "Start" marker; after that, the first unfinished unit of
// each course track does.
import { store } from './store';

const sync = () => {
  const saved = store.get();
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-path-node]'));
  const firstOpen = new Map<string, HTMLElement>();
  nodes.forEach((node) => {
    const slug = node.dataset.pathNode!;
    const done = Boolean(saved.done[slug]);
    const started = Boolean(saved.steps[slug] || saved.quiz[slug]);
    node.classList.toggle('is-done', done);
    node.classList.toggle('is-started', !done && started);
    const label = node.querySelector<HTMLElement>('[data-node-state]');
    if (label) label.textContent = done ? 'Done' : started ? 'In progress' : '';
    const track = node.dataset.pathTrack ?? 'main';
    if (!done && !firstOpen.has(track)) firstOpen.set(track, node);
  });
  const mainOpen = firstOpen.get('main');
  nodes.forEach((node) => {
    const isNext = mainOpen ? node === mainOpen : firstOpen.get(node.dataset.pathTrack ?? 'main') === node;
    node.classList.toggle('is-next', isNext);
  });
};
window.addEventListener('tutorecon:change', sync);
sync();
