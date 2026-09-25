import data from './glossary.json';

export interface Term {
  term: string;
  def: string;
  unit: string;
}

// The glossary lives in JSON so the build step that adds margin
// definitions to lessons (src/lib/rehype-sidenotes.mjs) can read it too.
export const glossary: Term[] = data;

export const termsFor = (unit: string) => glossary.filter((t) => t.unit === unit);

export const termSlug = (term: string) =>
  term
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
