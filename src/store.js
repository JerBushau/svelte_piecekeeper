import { writable, derived } from 'svelte/store';

function createRound() {
  const { subscribe, set, update } = writable(1);

  return {
    subscribe,
    increment: () => update(round => round < 14 ? round = round += 1: 14),
    decrement: () => update(round => round > 0 ? round = round -= 1 : 0)
  }
};

export const round = createRound();

export const roundInfo = derived(round, ($round) => ({
  stage: getStage($round),
  isHarvestRound: getIsHarvestRound($round),
  message: getMessage($round, getIsHarvestRound($round))
}));

function createActiveSpaces() {
  const { subscribe, set, update } = writable([
    { id: 0, previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'wood', name: 'Copse' },
    { id: 1, previousAmount: 2, defaultAmount: 2, accumulatedAmount: 2, type: 'wood', name: 'Grove' },
    { id: 2, previousAmount: 3, defaultAmount: 3, accumulatedAmount: 3, type: 'wood', name: 'Forest' },
    { id: 3, previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'clay', name: 'Clay Pit' },
    { id: 4, previousAmount: 2, defaultAmount: 2, accumulatedAmount: 2, type: 'clay', name: 'Hollow' },
    { id: 5, previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'reed', name: 'Reed Bank' },
    { id: 6, previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'food', name: 'Fishing' },
    { id: 7, previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'food', name: 'Traveling Players' }
  ]);

  return {
    subscribe,
    addSpace: (space) => update(activeSpaces => [...activeSpaces, space]),
    updateSpace: (space) => update(activeSpaces => activeSpaces.map(s => s.id === space.id ? space : s)),
    accumulateSpaces: (down=false) => update(activeSpaces => {
      down ? round.decrement() : round.increment();

      return activeSpaces.map(s => {
        if (down) {
          s.accumulatedAmount -= s.defaultAmount;
          if (s.accumulatedAmount < 0) s.accumulatedAmount = 0;
        } else {
          s.accumulatedAmount += s.defaultAmount;
          if (s.accumulatedAmount > 14) s.accumulatedAmount = 14;
        }
        return s
      })
    }),
    removeSpace: (id) => update(activeSpaces => activeSpaces.filter(s => s.id !== id)),
  };
}

export const activeSpaces = createActiveSpaces();

// helpers for derived state
const getIsHarvestRound = (currentRound) => {
  const harvestRounds = [4, 7, 9, 11, 13, 14];

  return harvestRounds.some((round) => round === currentRound)
};
const getMessage = (currentRound, isHarvestRound) => {
  if (isHarvestRound) {
    return (currentRound === 14) ? 'Last Harvest!'
                                 : 'Harvest this round!';
  }
  return ''
};
const getStage = (currentRound) => {
  const roundToStageMap = new Map([[11, 5], [9, 4], [7, 3],[4, 2], [0, 1]]);

  for (let [round, stage] of roundToStageMap) {
    if (currentRound > round) {
      return (currentRound === 14) ? 6 : stage;
    }
  }
  return 0
};
