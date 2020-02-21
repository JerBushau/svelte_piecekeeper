<script>
  import { activeSpaces } from '../store.js';
  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';
  import { fly, crossfade } from 'svelte/transition';

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
  // Send and receive messages for
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
</script>

<section class="space-container">
{#each $activeSpaces as sp (sp.id)}

  <div in:receive="{{key: sp.id}}"
       out:send="{{key: sp.id}}"
       animate:flip="{{duration: 400}}"
       class={ "space " + sp.type }
       on:mousedown={ (e) => spaceClickHandler(e, sp.id) }>
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
