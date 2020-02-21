<script>
  import logo from '../public/imgs/agricola.png';
  import { activeSpaces, round, roundInfo } from './store.js';
  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';
  import { fly, crossfade } from 'svelte/transition';
  import Instructions from './components/Instructions.svelte';
  import RoundInfo from './components/RoundInfo.svelte';
  import Actions from './components/Actions.svelte'

  // crossfade produces send/receive functions for flip (first, last, invert, play) animation
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
  let dropdownActive = false;
  let editing = false;

  let id = 8;

  const handleAccumulation = e => {
    e.shiftKey
      ? activeSpaces.accumulateSpaces(true)
      : activeSpaces.accumulateSpaces();
  };
  const handleAddSpace = (type) => {
    let model = randomOrderSpaces.find((sp) => (type === sp.type));
    let space = Object.assign({}, model);
    let count = 1;
    if (space.type === 'stone') {
      $activeSpaces.forEach((sp) => {
        if (type === sp.type) {
          count++
        }
      });
    }
    if (count > 1) space.name = 'Eastern Quarry';
    if (count > 2) space.name = 'oops...'
    space.id = id++;

    activeSpaces.addSpace(space)
  };
  const spaceClickHandler = (e, id) => {
    const clickedSpace = $activeSpaces.find((space) => (space.id === id));
    const isTargetInEditingOptions = e.target.parentElement.className === 'editing-options';
    let amount;

    if (isTargetInEditingOptions) {
      return editingOptionsClickHandler(e, clickedSpace)
    }
    if (e.ctrlKey) return toggleEditing();
    e.shiftKey ? clickedSpace.accumulatedAmount++
               : clickedSpace.accumulatedAmount = 0;

    activeSpaces.updateSpace(clickedSpace);
  };
  const editingOptionsClickHandler = (e, space) => {
    const isDelete = e.target.className === 'delete-button';
    const isPrevVal = e.target.className === 'prev-value';
    if (isDelete) {
      return activeSpaces.removeSpace(space.id)
    } else if (isPrevVal) {
      space.accumulatedAmount = space.previousAmount
      activeSpaces.updateSpace(space);
    }
  };
  const toggleDropdown = () => dropdownActive = !dropdownActive;
  const toggleEditing = () => editing = !editing;
</script>

<main class="App wrapper">

  <Instructions />

	<header>
      <div class="logo">
        <img src={ logo } alt="agricola logo" />
      </div>
      <h3 class="site-title">Piecekeeper</h3>
  </header>

  <nav>

    <RoundInfo />

    <Actions />

  </nav>

  <section class="space-container">
  {#each $activeSpaces as sp (sp.id)}

    <div in:receive="{{key: sp.id}}"
         out:send="{{key: sp.id}}"
         animate:flip="{{duration: 400}}"
         class={ "space " + sp.type }
         on:click={ (e) => spaceClickHandler(e, sp.id) }>
      {#if editing}

        <div transition:fly="{{x: 50, duration: 200}}" class="editing-options">
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
