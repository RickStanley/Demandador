<script>
  // Libs externas
  import tippy from "tippy.js";
  import "tippy.js/dist/tippy.css";
  import MediumEditor from "medium-editor";

  // Componentes dependentes
  import ImpressoraIcon from "./assets/ImpressoraIcon.svelte";
  import ImportarIcon from "./assets/ImportarIcon.svelte";
  import ExportarIcon from "./assets/ExportarIcon.svelte";
  import DicaIcon from "./assets/DicaIcon.svelte";
  import Dica from "./Dica.svelte";

  import { onMount, afterUpdate } from "svelte";
  import {
    configValida,
    meses_nomes,
    moveElement,
    pegaPosicaoDoCursor,
    hashCode
  } from "../js/utils.js";

  export let esqueleto;

  $: mes_numero = (meses_nomes.indexOf($esqueleto.data) + 1)
    .toString()
    .padStart(2, "0");

  // Para caso a gente precise de meses
  // const esseAno = new Date().getFullYear();
  // $: dias_mes = new Date(esseAno, +mes_numero, 0).getDate();

  let editor;
  let arquivo;

  let campos_total = $esqueleto.programacoes.length;
  let anotacoes_total = $esqueleto.rodape.length;

  const backspace_icon =
    '<svg width="15" style="display:inline-block;vertical-align:middle;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">' +
    '<path fill="#444" d="M0 2v12h16V2H0zm13 7H6v2L3 8l3-3v2h7v2z"/>' +
    "</svg>";

  // esqueleto.subscribe(obj => {
  //   if (obj.programacoes) {
  //     obj.programacoes[0][0] = obj.programacoes[0][0].padStart(2, "0");
  //     // return obj;
  //   }
  // });

  const adicionarAnotacao = () => {
    esqueleto.update(obj => {
      obj.rodape.push("");
      return obj;
    });
  };

  const adicionarProgramacao = () => {
    esqueleto.update(obj => {
      obj.programacoes.push([, , , ,].fill(""));
      return obj;
    });
  };

  const encolherCampo = function() {
    const visivel = this.parentElement.nextElementSibling.hidden;
    this.parentElement.nextElementSibling.hidden = !visivel;
    this.innerText = visivel ? "Encolher" : "Expandir";
  };

  const remover = function() {
    const index = +this.dataset.posicao;
    const contexto = this.dataset.contexto;

    if (contexto === "programacao") {
      const campos = this.parentElement.nextElementSibling.children;

      esqueleto.update(obj => {
        obj.programacoes.splice(index, 1);
        return obj;
      });
    } else {
      const campo = this.parentElement.nextElementSibling;
      esqueleto.update(obj => {
        obj.rodape.splice(index, 1);
        return obj;
      });
    }
  };

  const moveCima = function() {
    const index = +this.dataset.posicao;
    if (index <= 0) return;

    const contexto = this.dataset.contexto;
    if (contexto === "programacao") {
      esqueleto.update(obj => {
        const novo_array = moveElement(obj.programacoes, index, index - 1);
        obj.programacoes = novo_array;

        return obj;
      });
    } else {
      esqueleto.update(obj => {
        const novo_array = moveElement(obj.rodape, index, index - 1);
        obj.rodape = novo_array;

        return obj;
      });
    }
  };

  const moveBaixo = function() {
    const index = +this.dataset.posicao;
    if (index >= campos_total - 1) return;
    const contexto = this.dataset.contexto;
    if (contexto === "programacao") {
      esqueleto.update(obj => {
        const novo_array = moveElement(obj.programacoes, index, index + 1);
        obj.programacoes = novo_array;

        return obj;
      });
    } else {
      esqueleto.update(obj => {
        const novo_array = moveElement(obj.rodape, index, index + 1);
        obj.rodape = novo_array;

        return obj;
      });
    }
  };

  const aumentarFonte = () => {
    esqueleto.update(obj => {
      obj.fonte = obj.fonte + 2;
      return obj;
    });
  };

  const reduzirFonte = () => {
    esqueleto.update(obj => {
      obj.fonte = obj.fonte - 2;
      return obj;
    });
  };

  const exportar = () => {
    const fileContents = JSON.stringify($esqueleto, null, 2);
    const hoje = new Date();
    const data = `${hoje.getDay()}-${hoje.getMonth() +
      1}-${hoje.getFullYear()}`;
    const fileName = `demandador_${$esqueleto.cliente_iniciais ||
      $esqueleto.titulo ||
      data}.mdm`;

    let ancora = document.createElement("a");
    ancora.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(fileContents)
    );
    ancora.setAttribute("download", fileName);
    ancora.click();
    ancora.remove();
    ancora = null;
  };

  const importar = () => {
    arquivo.click();
  };

  const lerArquivo = eventoArquivo => {
    const leitor = new FileReader();
    leitor.addEventListener("load", evento => {
      try {
        const json = JSON.parse(evento.target.result);
        if (configValida(json)) {
          if (confirm("Você quer mesmo sobrescrever o conteúdo atual?")) {
            esqueleto.set(json);
          }
        }
      } catch (error) {
        console.error("Não é um JSON válido.");
      } finally {
        eventoArquivo.target.value = null;
      }
    });

    leitor.readAsText(eventoArquivo.target.files[0]);
  };

  const checaCampo = function(evento) {
    const chave = evento.keyCode || evento.key || evento.code;
    const enter = chave === 13 || ["Enter", "NumpadEnter"].includes(chave);
    const backspace = chave === 8 || "Backspace" === chave;
    const cima = chave === 38 || "ArrowUp" === chave;
    const baixo = chave === 40 || "ArrowDown" === chave;
    const del = chave === 46 || "Delete" === chave;

    const contexto = this.dataset.contexto;

    const contexto_aportuguesado =
      contexto === "programacao" ? "programação" : "anotação";

    if (!this.nextElementSibling && enter) {
      const proximo_campos = this.parentElement.parentElement
        .nextElementSibling;
      if (proximo_campos && proximo_campos.tagName === "FIELDSET") {
        proximo_campos.querySelector("[contenteditable]").focus();
        return;
      }
      if (contexto === "programacao") {
        adicionarProgramacao();
      } else {
        adicionarAnotacao();
      }
    } else if ((enter || baixo) && evento.ctrlKey) {
      if (this.nextElementSibling) {
        this.nextElementSibling.focus();
      } else {
        const proximo_campos = this.parentElement.parentElement
          .nextElementSibling;
        if (proximo_campos && proximo_campos.tagName === "FIELDSET") {
          proximo_campos.querySelector("[contenteditable]").focus();
        }
      }
    } else if (cima || backspace || del) {
      if (backspace && pegaPosicaoDoCursor(this) !== 0) return;
      if (this.previousElementSibling && evento.ctrlKey && !del) {
        this.previousElementSibling.focus();
      } else {
        const campos_anterior = this.parentElement.parentElement
          .previousElementSibling;
        if (campos_anterior && campos_anterior.tagName === "FIELDSET") {
          if (backspace || del) {
            const todos_vazios = Array.from(this.parentElement.children).every(
              child => !child.innerText
            );
            if (todos_vazios && confirm(`Apagar ${contexto_aportuguesado}?`)) {
              this.parentElement.previousElementSibling
                .querySelector("[data-posicao]")
                .click();
            }
          }
          if (evento.ctrlKey && !del) {
            const children = campos_anterior.querySelectorAll(
              "[contenteditable]"
            );
            children[children.length - 1].focus();
          }
        }
      }
    }
  };

  const spotlight = function() {
    const celula = this.dataset.id;
    document.getElementById(celula).classList.add("ativo");
  };

  const unspot = () => {
    document.querySelector("td.ativo").classList.remove("ativo");
  };

  afterUpdate(e => {
    const programacoes_largura = $esqueleto.programacoes.length;
    const anotacoes_largura = $esqueleto.rodape.length;

    if (!editor && (programacoes_largura || anotacoes_largura)) {
      editor = new MediumEditor(".campos [contenteditable]", {
        toolbar: {
          buttons: ["bold", "italic", "underline"]
        },
        disableReturn: true
      });
      editor.subscribe("addElement", function(event, editable) {
        editable.parentElement.firstElementChild.focus();
      });
      document.querySelector(".campos [contenteditable]").focus();
    }

    if (
      programacoes_largura > campos_total ||
      anotacoes_largura > anotacoes_total
    ) {
      editor.addElements(".campos [contenteditable]");
    }

    anotacoes_total = anotacoes_largura;
    campos_total = programacoes_largura;
  });

  onMount(() => {
    tippy("[data-tippy-content]");
  });
</script>

<style>
  fieldset {
    position: relative;
    margin: 0;
  }

  legend {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .acoes {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 0.75rem;
  }

  .acoes button {
    margin: 0 0.2em;
  }

  .decresce-fonte {
    font-size: 12px;
  }

  .controles {
    display: flex;
    margin-bottom: 0.5rem;
    position: sticky;
    top: -1rem;
    padding: 0.5rem 0;
    background-color: inherit;
    z-index: 1;
  }

  .controles > * {
    flex: 1;
  }

  .controles button:first-child {
    margin-left: 0;
  }
  .controles button:last-child {
    margin-right: 0;
  }

  .secao-titulo {
    font-weight: 500;
    display: flex;
    align-items: center;
  }
  .secao-titulo p {
    margin-bottom: 0.5em;
  }
</style>

<div class="controles">
  <button
    data-tippy-content="Exportar conteúdo"
    type="button"
    on:click={exportar}>
    <ExportarIcon />
  </button>
  <button
    type="button"
    data-tippy-content="Importar conteúdo"
    on:click={importar}>
    <ImportarIcon />
  </button>
  <input
    on:change={lerArquivo}
    bind:this={arquivo}
    id="arquivo"
    type="file"
    accept=".json,.mdm"
    hidden />
  <button
    data-tippy-content="Reduzir fonte"
    type="button"
    class="decresce-fonte"
    on:click={reduzirFonte}>
    -A
  </button>
  <button
    data-tippy-content="Aumentar fonte"
    type="button"
    on:click={aumentarFonte}>
    +A
  </button>
  <button
    class="imprimir"
    onclick="window.print();"
    data-tippy-content="Imprimir demandas">
    <ImpressoraIcon />
  </button>
</div>

<form>
  <label for="titulo">Título</label>
  <input id="titulo" type="text" bind:value={$esqueleto.titulo} />
  <label for="iniciais">
    Cliente
    <small>(preferível iniciais)</small>
  </label>
  <input id="iniciais" type="text" bind:value={$esqueleto.cliente_iniciais} />
  <label for="data">Mês</label>
  <select id="data" bind:value={$esqueleto.data}>
    {#each meses_nomes as mes}
      <option value={mes}>{mes}</option>
    {/each}
  </select>
  <br />
  <Dica
    dica="Para navegar entre os campos segure a tecla **CTRL** e use as setas
    direcionais ↓ ou ↑, ou Enter para avançar ou Apagar ({backspace_icon}) para
    voltar." />
  <div class="secao-titulo">
    <p>Anotações do rodapé</p>
    <div
      class="dica"
      data-tippy-content="Para alterar a aparência do texto, basta selecioná-lo
      e utilizar as ferramentas de estilos.">
      <DicaIcon />
    </div>
  </div>
  {#if $esqueleto.rodape.length}
    {#each $esqueleto.rodape as anotacoes, index}
      <fieldset>
        <legend>{index + 1}°</legend>
        <div class="acoes">
          <button
            type="button"
            on:click={remover}
            data-posicao={index}
            data-contexto="anotacao">
            Remover
          </button>
          <button type="button" on:click={encolherCampo}>Encolher</button>
          <button
            type="button"
            on:click={moveCima}
            data-posicao={index}
            data-contexto="anotacao"
            title="Mover para cima">
            <b>↑</b>
          </button>
          <button
            type="button"
            on:click={moveBaixo}
            data-posicao={index}
            data-contexto="anotacao"
            title="Mover para baixo">
            <b>↓</b>
          </button>
        </div>
        <div class="campos">
          <div
            data-id={hashCode('anotacao_' + index.toString())}
            contenteditable="true"
            data-placeholder="Anotação"
            on:keydown={checaCampo}
            on:focus={spotlight}
            on:blur={unspot}
            bind:innerHTML={$esqueleto.rodape[index]} />
        </div>
      </fieldset>
    {/each}
  {/if}
  <button type="button" on:click={adicionarAnotacao}>Adicionar anotação</button>
  <div class="secao-titulo">
    <p>Programações</p>
    <div
      class="dica"
      data-tippy-content="Para alterar a aparência do texto, basta selecioná-lo
      e utilizar as ferramentas de estilos.">
      <DicaIcon />
    </div>
  </div>
  {#each $esqueleto.programacoes as programacao, id}
    <fieldset>
      <legend>
        {programacao[0] ? `${programacao[0]}.${mes_numero}` : 'Programação'}
      </legend>
      <div class="acoes">
        <button
          type="button"
          on:click={remover}
          data-posicao={id}
          data-contexto="programacao">
          Remover
        </button>
        <button type="button" on:click={encolherCampo}>Encolher</button>
        <button
          type="button"
          on:click={moveCima}
          data-posicao={id}
          data-contexto="programacao"
          title="Mover para cima">
          <b>↑</b>
        </button>
        <button
          type="button"
          on:click={moveBaixo}
          data-posicao={id}
          data-contexto="programacao"
          title="Mover para baixo">
          <b>↓</b>
        </button>
      </div>
      <div class="campos">
        {#each programacao as conteudo, index}
          <div
            data-id={hashCode('programacao_' + index + id)}
            contenteditable="true"
            data-contexto="programacao"
            data-placeholder={$esqueleto.colunas[index]}
            on:keydown={checaCampo}
            on:focus={spotlight}
            on:blur={unspot}
            bind:innerHTML={$esqueleto.programacoes[id][index]} />
        {/each}
      </div>
    </fieldset>
  {/each}
</form>

<button on:click={adicionarProgramacao} type="button">
  Adicionar programação
</button>
