import { writable, derived, get } from 'svelte/store';

function createRound(initialRound) {
  const { subscribe, set, update } = writable(initialRound || 1);

  return {
    subscribe,
    increment: () => update(round => round < 14 ? round = round += 1: 14),
    decrement: () => update(round => round > 0 ? round = round -= 1 : 0)
  }
};

function createActiveSpaces(initialSpaces) {
  const { subscribe, set, update } = writable(initialSpaces || [
    { id: 0, previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'wood', name: 'Copse' },
    { id: 1, previousAmount: 2, defaultAmount: 2, accumulatedAmount: 2, type: 'wood', name: 'Grove' },
    { id: 2, previousAmount: 3, defaultAmount: 3, accumulatedAmount: 3, type: 'wood', name: 'Forest' },
    { id: 3, previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'clay', name: 'Clay Pit' },
    { id: 4, previousAmount: 2, defaultAmount: 2, accumulatedAmount: 2, type: 'clay', name: 'Hollow' },
    { id: 5, previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'reed', name: 'Reed Bank' },
    { id: 6, previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'food', name: 'Fishing' },
    { id: 7, previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'food', name: 'Traveling Players' }
  ]);

  const randomOrderSpaces = [
    { previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'sheep', name: 'Sheep' },
    { previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'cow', name: 'Cattle' },
    { previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'boar', name: 'Pig' },
    { previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'stone', name: 'Western Quarry' }
  ];

  return {
    subscribe,
    addSpace: (type) => update(activeSpaces => {
      let model = randomOrderSpaces.find((sp) => (type === sp.type));
      let space = Object.assign({}, model);
      let count = 1;

      if (space.type === 'stone') {
        activeSpaces.forEach((sp) => {
          if (type === sp.type) {
            count++
          }
        });
      }

      if (count > 1) space.name = 'Eastern Quarry';
      if (count > 2) space.name = 'oops...'

      space.id = get(id);
      id.update(id => id+=1);
      return [...activeSpaces, space]
    }),
    accumulateSpaces: (down=false) => update(activeSpaces => {
      const r = get(round);

      down ? round.decrement() : round.increment();

      return activeSpaces.map(s => {
        if (down) {
          s.accumulatedAmount -= s.defaultAmount;
          if (s.accumulatedAmount < 0) s.accumulatedAmount = 0;
          s.previousAmount = s.accumulatedAmount;
        } else if (r < 14) {
          s.accumulatedAmount += s.defaultAmount;
          s.previousAmount = s.accumulatedAmount;
        }
        return s
      })
    }),
    updateSpace: (space) => update(activeSpaces => activeSpaces.map(s => s.id === space.id ? space : s)),
    removeSpace: (id) => update(activeSpaces => activeSpaces.filter(s => s.id !== id)),
  };
}

export const round = createRound(retrieveFromStorage('round') || 0);
export const id = writable(retrieveFromStorage('id') || 8);
export const activeSpaces = createActiveSpaces(retrieveFromStorage('activeSpaces'));
export const roundInfo = derived(round, ($round) => ({
  stage: getStage($round),
  isHarvestRound: getIsHarvestRound($round),
  message: getMessage($round, getIsHarvestRound($round))
}));

// helpers for derived state
function getIsHarvestRound(currentRound) {
  const harvestRounds = [4, 7, 9, 11, 13, 14];

  return harvestRounds.some((round) => round === currentRound)
};
function getMessage(currentRound, isHarvestRound) {
  if (isHarvestRound) {
    return (currentRound === 14) ? 'Last Harvest!'
                                 : 'Harvest this round!';
  }
  return ''
};
function getStage(currentRound) {
  const roundToStageMap = new Map([[11, 5], [9, 4], [7, 3],[4, 2], [0, 1]]);

  for (let [round, stage] of roundToStageMap) {
    if (currentRound > round) {
      return (currentRound === 14) ? 6 : stage;
    }
  }
  return 0
};

// session storage functions
function retrieveFromStorage(key) {
  const previousState = JSON.parse(sessionStorage.getItem('apks-state'));

  if (previousState) {
    return previousState[key]
  }
}

function persistToSessionStorage() {
  sessionStorage.setItem('apks-state', JSON.stringify({
    activeSpaces: get(activeSpaces),
    round: get(round),
    id: get(id)
  }))
}

activeSpaces.subscribe(() => persistToSessionStorage());
