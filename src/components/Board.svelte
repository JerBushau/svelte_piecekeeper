<script>
  import { activeSpaces } from '../store.js';
  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';
  import Space from './Space.svelte';

   // Send and receive messages for flip animation
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
       animate:flip="{{duration: 250}}">

    <Space space={sp}/>

  </div>


{/each}
</section>
