import { writable, derived } from 'svelte/store';

export const id = writable(8)

const randomOrderSpaces = [
  { previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'sheep', name: 'Sheep' },
  { previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'cow', name: 'Cattle' },
  { previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'boar', name: 'Pig' },
  { previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'stone', name: 'Western Quarry' }
];

function activeSpaces() {
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
    addspace: (space) => update(activeSpaces => [...activeSpaces, space]),
    accumulateSpaces: () => update(todos => todos.map(t => t.id === todo.id ? todo : t)),
    removeTodo: (todo) => update(todos => todos.filter(t => !t.id === todo.id)),
  };
}

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

export const round = writable(1);
export const stage = derived(round, ($round) => getStage($round));
export const isHarvestRound = derived(round, $round => getIsHarvestRound($round));
export const message = derived([round, isHarvestRound], ([$round, $isHarvestRound]) => getMessage($round, $isHarvestRound));

round.subscribe((r) => console.log('yes', r))

// export const todos = createTodos();

// export let sortedTodos = derived(todos, $todos => $todos.slice(0).sort((a, b) => a.votes - b.votes))


