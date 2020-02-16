<script>
import { flip } from 'svelte/animate';
import logo from '../public/imgs/agricola.png';
import { quintOut } from 'svelte/easing';
import { crossfade } from 'svelte/transition';

const [send, receive] = crossfade({
  duration: d => Math.sqrt(d * 200),

  fallback(node, params) {
    const style = getComputedStyle(node);
    const transform = style.transform === 'none' ? '' : style.transform;

    return {
      duration: 600,
      easing: quintOut,
      css: t => `
        transform: ${transform} scale(${t});
        opacity: ${t}
      `
    };
  }
});
let instructionsActive = false;
let dropdownActive = false;
let editing = false;
let id = 8;
const randomOrderSpaces = [
  { previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'sheep', name: 'Sheep' },
  { previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'cow', name: 'Cattle' },
  { previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'boar', name: 'Pig' },
  { previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'stone', name: 'Western Quarry' }
];
let activeSpaces = [
  { id: 0, previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'wood', name: 'Copse' },
  { id: 1, previousAmount: 2, defaultAmount: 2, accumulatedAmount: 2, type: 'wood', name: 'Grove' },
  { id: 2, previousAmount: 3, defaultAmount: 3, accumulatedAmount: 3, type: 'wood', name: 'Forest' },
  { id: 3, previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'clay', name: 'Clay Pit' },
  { id: 4, previousAmount: 2, defaultAmount: 2, accumulatedAmount: 2, type: 'clay', name: 'Hollow' },
  { id: 5, previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'reed', name: 'Reed Bank' },
  { id: 6, previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'food', name: 'Fishing' },
  { id: 7, previousAmount: 1, defaultAmount: 1, accumulatedAmount: 1, type: 'food', name: 'Traveling Players' }
];
let roundInfo = {
  currentRound: 1,
  currentStage: 1,
  isHarvestRound: false,
  message: ''
};
const handleAccumulation = e => {
  const currentRound = e.shiftKey ? (roundInfo.currentRound - 1)
                                  : (roundInfo.currentRound + 1);
  if (currentRound >= 15 || currentRound <= -1) return;
  const harvestRound = isHarvestRound(currentRound);
  const currentStage = getStage(currentRound);
  const message = getMessage(currentRound, harvestRound);


  activeSpaces = activeSpaces.map(space => {
    const accumulatedAmount = e.shiftKey
                            ? (space.accumulatedAmount - space.defaultAmount)
                            : (space.accumulatedAmount + space.defaultAmount);
    if (accumulatedAmount <= 0) accumulatedAmount = 0;
    return {
      ...space,
      accumulatedAmount: accumulatedAmount,
      previousAmount: accumulatedAmount
    }
  });
  roundInfo = {
    currentRound: currentRound,
    currentStage: currentStage,
    isHarvestRound: harvestRound,
    message: message
  };
};
const handleAddSpace = (type) => {
  let model = randomOrderSpaces.find(sp => (type === sp.type));
  let space = Object.assign({}, model);
  let count = 1;
  if (space.type === 'stone') {
    activeSpaces.forEach(sp => {
      if (type === sp.type) {
        count++
      }
    });
  }
  if (count > 1) space.name = 'Eastern Quarry';
  if (count > 2) space.name = 'oops...'
  space.id = id++;

  activeSpaces = [
    ...activeSpaces,
    space
  ];
};
const spaceClickHandler = (e, id) => {
  const clickedSpace = activeSpaces.find(space => (space.id === id));
  let amount;
  console.log(e.target.parentElement.className)
  if (e.target.parentElement.className === 'editing-options') {
    return editingOptionsClickHandler(e, id)
  }
  if (e.ctrlKey) return toggleEditing();
  e.shiftKey ? amount = clickedSpace.accumulatedAmount + 1
             : amount = 0;

  activeSpaces = activeSpaces.map(space => {
    if (space.id === id) {
      return {
        ...space,
        accumulatedAmount: amount
      }
    }
    return space
  })
};
const editingOptionsClickHandler = (e, id) => {
  console.log('edit handle')
  if (e.target.className === 'delete-button') {
    return removeSpaceAt(id)
  } else if (e.target.className === 'prev-value') {
    activeSpaces = activeSpaces.map(space => {
      if (space.id === id) {
        return {
          ...space,
          accumulatedAmount: space.previousAmount
        }
      }
      return space
    });
  }
};
const removeSpaceAt = id => activeSpaces = activeSpaces.filter(space => id !== space.id);
const isHarvestRound = currentRound => {
    const harvestRounds = [4, 7, 9, 11, 13, 14];

  return harvestRounds.some(round =>
    (round === currentRound))
};
const getMessage = (currentRound, isHarvestRound) => {
  if (isHarvestRound) {
    return (currentRound === 14) ? 'Last Harvest!'
                                 : 'Harvest this round!';
  }
  return ''
};
const getStage = currentRound => {
  const roundToStageMap = new Map([[11, 5], [9, 4], [7, 3],[4, 2], [0, 1]]);

  for (let [round, stage] of roundToStageMap) {
    if (currentRound > round) {
      return (currentRound === 14) ? 6 : stage;
    }
  }
  return 0
};
const toggleDropdown = () => dropdownActive = !dropdownActive;
const toggleEditing = () => editing = !editing;
const toggleInstructions = () => instructionsActive = !instructionsActive;
</script>

<main class="App wrapper">
  <div class={ "instruction-toggle " + (instructionsActive ? 'active' : '' ) }
       on:click={ () => toggleInstructions() } >
    <span class="icon"> { instructionsActive ? 'X' : '?' } </span>
    <div class={ "instructions " + (instructionsActive ? '' : 'hidden') } >
      <h1>Agricola Piecekeeper</h1>
      <p>Help and info.</p>
      <ul>
        <li class="instruction-title">Basic Functions</li>
        <li><code>click</code> on a space to gather resources.</li>
        <li><code>click</code> the accumulate button to accumulate resourses.</li>
        <li><code>click</code> the add space button, then choose which type of space to create.</li>
        <li class="instruction-title">Corrections and Bonuses</li>
        <li><code>shift+click</code> on the accumulate button to roll back one round.</li>
        <li><code>shift+click</code> on any space to increment that space by one for bonuses.</li>
        <ul>
          <li class="instruction-title">Editing Mode</li>
          <li><code>ctrl+click</code> on any space to display editing options.</li>
          <li><span class="green">3</span> The green button displays the value of the space as it was at the beginning of the current round, click it to set the current value of the space to this value. (This provides a quick-fix in the case a space was unintentionally gathered.)</li>
          <li><span class="red">×</span> The red button allows you to remove added spaces from the board.</li>
        </ul>
      </ul>
    </div>
  </div>

	<header>
      <div class="logo">
        <img src={ logo } alt="agricola logo" />
      </div>
      <h3 class="site-title">Piecekeeper</h3>
  </header>

  <nav>
    <div class={ 'round-info-container ' +
                   (roundInfo.isHarvestRound ? 'alert ' : '') +
                   ((roundInfo.currentRound === 14) ? 'alert-final' : '') }>
      <div class="round-info">
        <h1>Round: { roundInfo.currentRound }</h1>
        <h1>Stage: { roundInfo.currentStage }</h1>
      </div>
      <h1 class="message">{ roundInfo.message }</h1>
    </div>

    <div class="actions">
      <div tabIndex="0"
           class="accumulate-button"
           on:click={ handleAccumulation } >accumulate</div>
      <div class={ 'add-space-button ' + (dropdownActive ? 'active' : '') }
           on:click={ toggleDropdown }>add space
        <div class={ 'add-space-dropdown ' + (dropdownActive ? '' : 'hidden') }>
          <button class="add-sheep"
                  on:click={ () => handleAddSpace('sheep') }>Sheep</button>
          <button class="add-boar"
                  on:click={ () => handleAddSpace('boar') }>Pig</button>
          <button class="add-cow"
                  on:click={ () => handleAddSpace('cow') }>Cow</button>
          <button class="add-stone"
                  on:click={ () => handleAddSpace('stone') }>Stone</button>
        </div>
      </div>
    </div>
  </nav>

  <section class="space-container">
    {#each activeSpaces as sp (sp.id)}

    <div in:receive="{{key: sp.id}}"
         out:send="{{key: sp.id}}"
         animate:flip="{{duration: 400}}"
         class={ "space " + sp.type }
         on:click={ (e) => spaceClickHandler(e, sp.id) }>
      {#if editing}

        <div class="editing-options">
          <small class="prev-value">{ sp.previousAmount }</small>
          {#if sp.id > 7}
            <button class="delete-button">&#215;</button>
          {/if}
        </div>
      {/if}
      <h1 class="name">{ sp.name }</h1>
      <h1 class="number">{ sp.accumulatedAmount }</h1>
      <h3 class="type">{ sp.type }</h3>
    </div>

    {/each}
  </section>

</main>
