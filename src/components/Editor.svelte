<script>
  export let esqueleto;

  const adicionarProgramacao = () => {
    esqueleto.update(obj => {
      obj.programacoes.push([, , , ,].fill(""));
      return obj;
    });
  };

  const reduzir = function() {
    const visivel = this.parentElement.nextElementSibling.hidden;
    this.parentElement.nextElementSibling.hidden = !visivel;
    this.innerText = visivel ? "Encolher" : "Expandir";
  };

  const remover = function() {
    const position = +this.dataset.programacaoId;
    esqueleto.update(obj => {
      obj.programacoes.splice(position, 1);
      return obj;
    });
  };

  const meses_nomes = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
  ];
</script>

<style>
  fieldset {
    position: relative;
  }

  .acoes {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 0.75rem;
  }
</style>

<button class="imprimir" onclick="window.print();" title="Imprimir tabelas">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill-rule="evenodd"
    clip-rule="evenodd"
    image-rendering="optimizeQuality"
    shape-rendering="geometricPrecision"
    text-rendering="geometricPrecision"
    viewBox="0 0 640 640"
    width="24"
    fill="currentColor"
    style="display:block;">
    <path
      fill-rule="nonzero"
      d="M120.84 176.116V25.536a2.735 2.735 0 012.74-2.74h301.067a2.8 2.8 0
      011.263.295l10.052 4.146-1.051 2.539 1.05-2.54c.414.166.745.426
      1.028.745l67.336 66.437 4.358 4.288-1.913 1.96 1.925-1.96c.543.543.815
      1.252.815 1.96v75.45a2.742 2.742 0 01-2.74 2.74h-29.245a2.745 2.745 0
      01-2.752-2.74v-35.858h-77.352a2.757 2.757 0
      01-2.763-2.752c0-.071.012-.154.012-.237v-14.433h-.012V57.65H155.683v118.466a2.745
      2.745 0 01-2.752 2.74h-29.35a2.735 2.735 0 01-2.74-2.74zm40.382
      200.058h317.555c.225 0 .426.035.638.07a33.73 33.73 0 0112.272 2.564 33.659
      33.659 0 0110.96 7.358 33.53 33.53 0 017.3 10.926 33.137 33.137 0 012.528
      12.224c.059.2.094.425.094.638v48.154h68.529c.189 0 .39.024.578.047a23.44
      23.44 0 008.54-1.842c2.94-1.229 5.598-3.048 7.866-5.292a24.553 24.553 0
      005.291-7.866 23.459 23.459 0
      001.831-8.575c-.023-.189-.059-.366-.059-.543V249.629c0-.213.036-.39.071-.59a23.74
      23.74 0 00-1.843-8.54 24.502 24.502 0
      00-5.29-7.855c-2.269-2.244-4.926-4.063-7.867-5.303a23.342 23.342 0
      00-8.599-1.83 2.503 2.503 0 01-.52.047H58.904c-.19
      0-.39-.012-.58-.06-2.987.072-5.87.721-8.539 1.843-2.94 1.24-5.598
      3.06-7.866 5.303a24.502 24.502 0 00-5.291 7.855 23.635 23.635 0 00-1.831
      8.598c.024.166.035.343.035.532v184.42c0 .189-.011.39-.047.567.071 3 .72
      5.882 1.843 8.54a24.553 24.553 0 005.291 7.865c2.268 2.244 4.925 4.063
      7.866 5.292a23.592 23.592 0 008.599
      1.842c.165-.035.342-.047.52-.047h68.528v-48.142c0-.225.035-.45.07-.638a33.877
      33.877 0 012.552-12.26 34.303 34.303 0
      016.945-10.56c.106-.153.224-.295.354-.413a33.631 33.631 0 0110.95-7.299
      33.94 33.94 0 0112.271-2.551c.213-.036.414-.071.638-.071h.012zM512.57
      492.963v90.474c0 .224-.035.425-.094.637a32.978 32.978 0 01-2.551
      12.272c-1.701 4.122-4.229 7.843-7.347 10.961a33.53 33.53 0 01-10.925 7.3
      33.886 33.886 0 01-12.237 2.539 3.66 3.66 0 01-.626.059H161.211c-.213
      0-.425-.024-.626-.06a33.886 33.886 0 01-12.237-2.539 33.53 33.53 0
      01-10.925-7.299c-3.118-3.118-5.646-6.839-7.346-10.96a32.977 32.977 0
      01-2.552-12.273 2.315 2.315 0 01-.094-.637v-90.474H58.902c-.2
      0-.413-.035-.625-.07a58.839 58.839 0 01-21.875-4.454 58.909 58.909 0
      01-31.89-31.902c-2.8-6.744-4.37-14.126-4.453-21.862a2.827 2.827 0
      01-.07-.626v-184.42c0-.224.023-.437.07-.626.083-7.748 1.654-15.142
      4.453-21.886a59.11 59.11 0 0112.768-19.11 58.66 58.66 0 0119.122-12.768
      58.613 58.613 0 0121.875-4.465c.2-.047.401-.071.625-.071h522.195c.201 0
      .414.024.626.07a58.661 58.661 0 0121.875 4.466 58.66 58.66 0 0119.122
      12.767 59.11 59.11 0 0112.768 19.11c2.8 6.745 4.37 14.139 4.453
      21.887.047.189.07.402.07.626v184.408c0 .224-.023.425-.07.626-.083
      7.748-1.654 15.13-4.453 21.874a58.96 58.96 0 01-12.768 19.134 59.035
      59.035 0 01-19.122 12.768 58.839 58.839 0 01-21.875
      4.453c-.2.036-.425.071-.626.071H512.57zm-46.571-387.56l-36.485-35.977v35.977h36.485zm11.705
      305.626H162.298V582.35h315.405V411.029z" />
  </svg>
</button>
<form>
  <label for="titulo">Título</label>
  <input id="titulo" type="text" bind:value={$esqueleto.titulo} />
  <label for="iniciais">
    Cliente
    <small>(preferível iniciais)</small>
  </label>
  <input id="iniciais" type="text" bind:value={$esqueleto.cliente_iniciais} />
  <label for="data">Data</label>
  <select id="data" bind:value={$esqueleto.data}>
    {#each meses_nomes as mes}
      <option value={mes}>{mes}</option>
    {/each}
  </select>
  <br />
  {#each $esqueleto.programacoes as programacao, id}
    <fieldset>
      <legend>Programação</legend>
      <div class="acoes">
        <button type="button" on:click={remover} data-programacao-id={id}>
          Remover
        </button>
        <button type="button" on:click={reduzir}>Encolher</button>
      </div>
      <div class="campos">
        {#each programacao as conteudo, index}
          <input
            type="text"
            placeholder={$esqueleto.colunas[index]}
            bind:value={$esqueleto.programacoes[id][index]} />
        {/each}
      </div>
    </fieldset>
  {/each}
</form>

<button on:click={adicionarProgramacao} type="button">
  Adicionar programação
</button>
