// Shared shape and a small helper for writing questions compactly.
// Every option carries its own explanation, so a student who picks a wrong
// answer learns why that specific answer is wrong.

export interface Option {
  text: string;
  why: string;
}

export interface QTable {
  head: string[];
  rows: (string | number)[][];
}

export type Level = 1 | 2 | 3;

export type { QFigure } from './figures';
import type { QFigure } from './figures';

export interface Question {
  id: string;
  /** The lesson that teaches it. */
  unit: string;
  /** Official topic ids from src/data/ced.ts, like 'mi2.3'. */
  topics: string[];
  /** 1 recall, 2 apply, 3 multi-step. */
  level: Level;
  prompt: string;
  table?: QTable;
  /** A graph shown with the question. */
  figure?: QFigure;
  options: Option[];
  answer: number;
  /** Part of the six-question check at the end of the lesson. */
  check?: boolean;
}

interface Extra {
  table?: QTable;
  figure?: QFigure;
  check?: boolean;
}

export const make =
  (unit: string) =>
  (id: string, topics: string, level: Level, prompt: string, options: [string, string][], answer: number, extra: Extra = {}): Question => ({
    id,
    unit,
    topics: topics.split(' '),
    level,
    prompt,
    options: options.map(([text, why]) => ({ text, why })),
    answer,
    ...extra,
  });
