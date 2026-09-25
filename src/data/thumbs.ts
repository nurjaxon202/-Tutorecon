import type { State } from '../scripts/graphs/models';

// The diagram that stands for each unit on cards and tiles.
export const unitThumb: Record<string, { model: string; state?: State }> = {
  foundations: { model: 'ppc' },
  'supply-and-demand': { model: 'market-oj', state: { sShift: -20 } },
  'production-and-cost': { model: 'firm' },
  'imperfect-competition': { model: 'monopoly' },
  'factor-markets': { model: 'monopsony' },
  'market-failure': { model: 'externality-negative' },
  'economic-indicators': { model: 'business-cycle' },
  'national-income': { model: 'adas', state: { ad: -24 } },
  'financial-sector': { model: 'money-market', state: { ms: 80 } },
  'stabilization-policy': { model: 'phillips', state: { u: 3.5 } },
  'open-economy': { model: 'forex', state: { dShift: 16 } },
};
