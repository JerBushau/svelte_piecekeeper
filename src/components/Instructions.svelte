<script>
  let instructionsActive = false;
  const toggleInstructions = () => instructionsActive = !instructionsActive;
</script>

<div class={ "instruction-toggle " + (instructionsActive ? 'active' : '' ) }
     on:click={ toggleInstructions }>

  <span class="icon"> { instructionsActive ? 'X' : '?' } </span>

  <div class={ "instructions " + (instructionsActive ? '' : 'hidden') }>
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
