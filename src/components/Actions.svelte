<script>
  import { activeSpaces } from '../store.js';
  const randomOrderSpaces = [

  ];

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
