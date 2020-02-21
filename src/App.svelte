<script>
  import logo from '../public/imgs/agricola.png';
  import Instructions from './components/Instructions.svelte';
  import RoundInfo from './components/RoundInfo.svelte';
  import Actions from './components/Actions.svelte';
  import Board from './components/Board.svelte';
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

  <Board />

</main>
