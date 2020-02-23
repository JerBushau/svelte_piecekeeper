<script>
  export let space;
  import { activeSpaces } from '../store.js';
  import { fly } from 'svelte/transition';

  let editing = false;

  const toggleEditing = () => editing = !editing;
  const spaceClickHandler = (e, id) => {
    const clickedSpace = $activeSpaces.find((space) => (space.id === id));
    const isTargetInEditingOptions = e.target.parentElement.className === 'editing-options';

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
</script>

<div class={ "space " + space.type }
     on:mousedown={ (e) => spaceClickHandler(e, space.id) }>
  {#if editing}

    <div transition:fly="{{x: 50, duration: 200}}" class="editing-options">
      <small class="prev-value">{ space.previousAmount }</small>
      {#if space.id > 7}
        <button class="delete-button">&#215;</button>
      {/if}
    </div>
  {/if}
  <h1 class="name">{ space.name }</h1>
  <h1 class="number">{ space.accumulatedAmount }</h1>
  <h3 class="type">{ space.type }</h3>
</div>
