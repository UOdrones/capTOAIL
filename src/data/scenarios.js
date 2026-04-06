// Pre-built OAIL cap table scenarios
export const DEFAULT_SCENARIOS = [
  {
    id: 'base',
    name: 'Base Case (Current)',
    description: 'Current ownership structure on paper',
    locked: false,
    holders: [
      { id: 'travis', name: 'Travis Johnson', role: 'Co-Founder', percent: 40, color: '#3b82f6', group: null, boardSeat: true },
      { id: 'kris', name: 'Kris Heidelberger', role: 'Co-Founder', percent: 40, color: '#8b5cf6', group: null, boardSeat: true },
      { id: 'jason', name: 'Jason Dusseault', role: 'Co-Founder', percent: 20, color: '#06b6d4', group: null, boardSeat: true },
    ],
  },
  {
    id: 'jason-bump',
    name: 'Jason Bump',
    description: 'Jason moves to 25%, reducing Kris to 35%',
    locked: false,
    holders: [
      { id: 'travis', name: 'Travis Johnson', role: 'Co-Founder', percent: 40, color: '#3b82f6', group: null, boardSeat: true },
      { id: 'kris', name: 'Kris Heidelberger', role: 'Co-Founder', percent: 35, color: '#8b5cf6', group: null, boardSeat: true },
      { id: 'jason', name: 'Jason Dusseault', role: 'Co-Founder', percent: 25, color: '#06b6d4', group: null, boardSeat: true },
    ],
  },
  {
    id: 'buffalo-3',
    name: 'Buffalo 3 Entry',
    description: 'Buffalo 3 gifted 25%. Johnny Ryan leads B3 allocation with a board seat.',
    locked: false,
    holders: [
      { id: 'travis', name: 'Travis Johnson', role: 'Co-Founder', percent: 30, color: '#3b82f6', group: null, boardSeat: true },
      { id: 'kris', name: 'Kris Heidelberger', role: 'Co-Founder', percent: 20, color: '#8b5cf6', group: null, boardSeat: true },
      { id: 'jason', name: 'Jason Dusseault', role: 'Co-Founder', percent: 25, color: '#06b6d4', group: null, boardSeat: true },
      { id: 'johnny', name: 'Johnny Ryan', role: 'Buffalo 3 — Lead', percent: 12.50, color: '#f97316', group: 'buffalo3', boardSeat: true },
      { id: 'garett', name: 'Garett Elwood', role: 'Buffalo 3', percent: 4.17, color: '#f59e0b', group: 'buffalo3', boardSeat: false },
      { id: 'jacob', name: 'Jacob Hanson', role: 'Buffalo 3', percent: 4.17, color: '#ef4444', group: 'buffalo3', boardSeat: false },
      { id: 'b3-tbd', name: 'TBD (Buffalo 3)', role: 'Buffalo 3', percent: 4.16, color: '#10b981', group: 'buffalo3', boardSeat: false },
    ],
  },
];

export const INVESTMENT_MODES = [
  { id: 'safe', name: 'SAFE (VC)', description: 'Simple Agreement for Future Equity — deferred dilution at next priced round' },
  { id: 'pe', name: 'Private Equity', description: 'Direct equity purchase — immediate ownership restructuring' },
  { id: 'angel-vc', name: 'Angel + VC', description: 'Angel tranche (SAFE) followed by VC priced round' },
];

export const HOLDER_COLORS = [
  '#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444',
  '#10b981', '#f97316', '#ec4899', '#14b8a6', '#a855f7',
  '#6366f1', '#84cc16', '#e11d48', '#0ea5e9', '#d946ef',
];
