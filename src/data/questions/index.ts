// The full question bank, one file per lesson. Counts shown anywhere on the
// site come from this array, so they are always accurate.
import type { Question } from './make';
import { allTopics } from '../ced';
import foundations from './foundations';
import supplyAndDemand from './supply-and-demand';
import productionAndCost from './production-and-cost';
import imperfectCompetition from './imperfect-competition';
import factorMarkets from './factor-markets';
import marketFailure from './market-failure';
import economicIndicators from './economic-indicators';
import nationalIncome from './national-income';
import financialSector from './financial-sector';
import stabilizationPolicy from './stabilization-policy';
import openEconomy from './open-economy';

export type { Question, Option, QTable, Level } from './make';

export const questions: Question[] = [
  ...foundations,
  ...supplyAndDemand,
  ...productionAndCost,
  ...imperfectCompetition,
  ...factorMarkets,
  ...marketFailure,
  ...economicIndicators,
  ...nationalIncome,
  ...financialSector,
  ...stabilizationPolicy,
  ...openEconomy,
];

// Checked on every build. A bad question stops the build instead of reaching students.
const topicIds = new Set(allTopics.map((t) => t.id));
const seen = new Set<string>();
for (const x of questions) {
  const problem = (msg: string) => {
    throw new Error(`Question ${x.id}: ${msg}`);
  };
  if (seen.has(x.id)) problem('duplicate id');
  seen.add(x.id);
  if (x.options.length !== 5) problem(`has ${x.options.length} choices, not 5`);
  if (!(x.answer >= 0 && x.answer < x.options.length)) problem('answer index is out of range');
  x.options.forEach((o, i) => {
    if (!o.text.trim() || !o.why.trim()) problem(`choice ${i} is missing text or an explanation`);
    if ((i === x.answer) !== o.why.startsWith('Correct.')) problem(`choice ${i} explanation does not match the marked answer`);
  });
  if (!x.topics.length || x.topics.some((t) => !topicIds.has(t))) problem(`has an unknown topic: ${x.topics.join(', ')}`);
  if (x.figure && x.figure.alt.trim().length < 40) problem('figure needs a full text description');
  if (/[\u2013\u2014]/.test(JSON.stringify({ p: x.prompt, o: x.options })) ) problem('uses an en or em dash');
}

// Every official topic needs a real practice set of its own.
export const MIN_PER_TOPIC = 12;
const thin = allTopics.filter((t) => questions.filter((x) => x.topics.includes(t.id)).length < MIN_PER_TOPIC).map((t) => t.id);
if (thin.length) throw new Error(`Topics with fewer than ${MIN_PER_TOPIC} questions: ${thin.join(', ')}`);

export const questionsFor = (unit: string) => questions.filter((x) => x.unit === unit);

/** The six questions used as the check at the end of a lesson. */
export const checkFor = (unit: string) => questions.filter((x) => x.unit === unit && x.check);

export const questionsForTopic = (topic: string) => questions.filter((x) => x.topics.includes(topic));

/** Which course a question counts toward: 'micro', 'macro', or both. */
export const coursesOf = (x: Question) => {
  const set = new Set<string>();
  for (const t of x.topics) set.add(t.startsWith('mi') ? 'micro' : 'macro');
  return [...set];
};
