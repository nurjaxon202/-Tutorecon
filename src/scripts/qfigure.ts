// Draws a question's graph from questions.json.
export interface QFig {
  svg: string;
  w: number;
  h: number;
  alt: string;
  id: string;
}

const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
let copies = 0;

/** The figure as HTML. Each call gets its own SVG ids, so two copies can share a page. */
export const figureHtml = (fg?: QFig) => {
  if (!fg) return '';
  const svg = fg.svg.split(fg.id).join(`${fg.id}c${++copies}`);
  return `<figure class="q-fig"><svg viewBox="0 0 ${fg.w} ${fg.h}" width="${fg.w}" height="${fg.h}" role="img" aria-label="${attr(fg.alt)}" focusable="false">${svg}</svg></figure>`;
};
