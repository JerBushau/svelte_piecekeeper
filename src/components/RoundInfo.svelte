<script>
  import { round, roundInfo } from '../store.js'
</script>

<div class={ 'round-info-container ' +
               ($roundInfo.isHarvestRound ? 'alert ' : '') +
               (($round === 14) ? 'alert-final' : '') }>
  <div class="round-info">
    <h1>Round: { $round }</h1>
    <h1>Stage: { $roundInfo.stage }</h1>
  </div>
  <h1 class="message">{ $roundInfo.message }</h1>
</div>
