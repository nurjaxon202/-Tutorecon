// Draws a question's graph from questions.json.
export interface QFig {
  svg: string;
  w: number;
  h: number;
  alt: string;
}

const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export const figureHtml = (fg?: QFig) =>
  fg
    ? `<figure class="q-fig"><svg viewBox="0 0 ${fg.w} ${fg.h}" width="${fg.w}" height="${fg.h}" role="img" aria-label="${attr(fg.alt)}" focusable="false">${fg.svg}</svg></figure>`
    : '';
