<script>
  import { activeSpaces } from '../store.js';

  let dropdownActive = false;

  const toggleDropdown = () => dropdownActive = !dropdownActive;
  const handleAccumulation = e => {
    e.shiftKey
      ? activeSpaces.accumulateSpaces(true)
      : activeSpaces.accumulateSpaces();
  };
  const handleAddSpace = (type) => activeSpaces.addSpace(type);
</script>

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
