<script>
  export let esqueleto;
  import { meses_nomes } from "../js/utils.js";
  $: mes_numero = (meses_nomes.indexOf($esqueleto.data) + 1)
    .toString()
    .padStart(2, "0");
</script>

<style>
  :root {
    --cinza: #999999;
    --cor-tema: #f78d16;
    --fundo-gradiente: linear-gradient(to bottom, #f14a24, #f78d16);
    --data-entrega-fundo: #0ab2ca;
  }

  table {
    text-align: left;
    border-collapse: collapse;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
    color: #444444;
    position: relative;
    overflow: hidden;
  }

  .data-entrega-fundo {
    position: absolute;
    width: 80px;
    height: 100%;
    background-image: linear-gradient(to bottom, #10bbd2, #056083);
  }

  td,
  th {
    vertical-align: bottom;
    line-height: 1;
    font-size: 1.2em;
    position: relative;
  }

  th {
    background-color: var(--cinza);
    color: white;
    padding: 0.5em 19px;
    vertical-align: middle;
  }

  .empresa-nome::after,
  tbody td:not(:first-of-type):not(:last-of-type)::after,
  th:not(:last-of-type):not(:first-of-type)::after {
    content: "";
    position: absolute;
    right: 0;
    width: 1px;
    height: 60%;
    bottom: 0;
    top: 0;
    background-color: white;
    margin: auto;
  }

  tbody td:not(:first-of-type):not(:last-of-type)::after {
    background-color: #5e6163;
  }

  tfoot tr,
  tfoot {
    background-color: #efefef;
  }

  tfoot td {
    padding: 0.5em 19px;
    background-color: inherit;
  }

  tfoot tr:not(:first-of-type) td {
    width: 600px;
  }

  .empresa-nome::after {
    background-color: var(--cor-tema);
    margin-bottom: 0;
    width: 4px;
    height: 40%;
    /* Metade */
    transform: translateX(2px);
  }

  .empresa-nome,
  .titulo {
    padding-left: 19px;
    padding-right: 10px;
    color: var(--cinza);
    font-size: 5em;
  }

  .empresa-nome,
  .mes-nome {
    line-height: 0.8;
  }

  .titulo {
    font-weight: 300;
  }

  .mes-nome {
    font-size: 2em;
    padding-left: 0.2em;
    color: var(--cor-tema);
  }

  .legendas th:first-child {
    font-weight: normal;
  }

  tbody td:not(:first-of-type),
  .legendas th:not(:first-of-type) {
    width: 200px;
  }

  .data-entrega {
    text-align: center;
    vertical-align: middle;
    padding-left: 0;
    padding-right: 0;
    width: 80px;
    word-break: break-all;
    -webkit-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;
  }

  .legendas .data-entrega span {
    position: relative;
  }

  .legendas .data-entrega::before {
    content: "";
    position: absolute;
    height: 50vh;
    bottom: 0;
    right: 0;
    width: 100%;
    background-image: var(--fundo-gradiente);
    pointer-events: none;
  }

  tbody .data-entrega {
    /* background-color: var(--data-entrega-fundo); */
    color: white;
    font-weight: bold;
  }

  tbody td {
    vertical-align: middle;
    padding: 0.5em 19px;
  }

  tbody td:first-of-type {
    padding: 0.5em;
  }

  tbody tr:nth-of-type(odd) {
    background-color: #efefef;
  }
</style>

<table style="font-size: {$esqueleto.fonte}px">
  <thead>
    <tr role="presentation">
      <td rowspan="3" role="presentation" />
    </tr>
    <tr>
      <td class="titulo" colspan={$esqueleto.colunas.length - 1}>
        {$esqueleto.titulo}
      </td>
    </tr>
    <tr>
      <td class="empresa-nome">
        <b>{$esqueleto.cliente_iniciais}</b>
      </td>
      <td class="mes-nome">
        <b>{$esqueleto.data}</b>
      </td>
      <td>
        <img
          onerror="this.remove()"
          style="display:block;object-fit:cover;"
          loading="lazy"
          width="200"
          height="30"
          src="https://maru.fermen.to/marca/fermento-horizontal.png"
          alt="Fermen.to Innovation Lab" />
      </td>
    </tr>
    <tr role="presentation">
      <td role="presentation">
        <br />
      </td>
    </tr>
    <tr class="legendas">
      <th class="data-entrega">
        <span>
          Data de
          <br />
          <b>Entrega</b>
        </span>
      </th>
      <th>Tema</th>
      <th>Job</th>
      <th>Formato</th>
    </tr>
    <tr role="presentation">
      <td role="presentation">
        <br />
      </td>
    </tr>
  </thead>
  <tbody>
    <span class="data-entrega-fundo" />
    {#each $esqueleto.programacoes as programacao}
      <tr>
        {#each programacao as conteudo, index}
          <td class={index === 0 ? 'data-entrega' : ''}>
            {@html conteudo + (index === 0 ? '.' + mes_numero : '')}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
  <tfoot>
    {#if $esqueleto.rodape.length}
      <tr role="presentation">
        <td role="presentation" rowspan={$esqueleto.rodape.length + 1} />
      </tr>
    {/if}
    {#each $esqueleto.rodape as anotacao}
      <tr>
        <td colspan={$esqueleto.colunas.length - 1}>
          {@html anotacao}
        </td>
      </tr>
    {/each}
  </tfoot>
</table>
