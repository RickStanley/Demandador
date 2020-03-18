<script>
  import tippy from "tippy.js";
  import "tippy.js/dist/tippy.css";

  import MediumEditor from "medium-editor";

  import { onMount, afterUpdate } from "svelte";
  import { configValida, meses_nomes } from "../js/utils.js";

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

  // esqueleto.subscribe(obj => {
  //   if (obj.programacoes) {
  //     obj.programacoes[0][0] = obj.programacoes[0][0].padStart(2, "0");
  //     // return obj;
  //   }
  // });

  function getCaretCharacterOffsetWithin(element) {
    let caretOffset = 0;
    const doc = element.ownerDocument || element.document;
    const win = doc.defaultView || doc.parentWindow;
    let sel;
    if (typeof win.getSelection != "undefined") {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        const range = win.getSelection().getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && sel.type != "Control") {
      const textRange = sel.createRange();
      const preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint("EndToEnd", textRange);
      caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  }

  const adicionarProgramacao = () => {
    esqueleto.update(obj => {
      obj.programacoes.push([, , , ,].fill(""));
      return obj;
    });
  };

  const encolherProgramacao = function() {
    const visivel = this.parentElement.nextElementSibling.hidden;
    this.parentElement.nextElementSibling.hidden = !visivel;
    this.innerText = visivel ? "Encolher" : "Expandir";
  };

  const remover = function(eventoOuId) {
    const position = +this.dataset.programacaoId;
    const campos = this.parentElement.nextElementSibling.children;
    editor.removeElements(campos);
    esqueleto.update(obj => {
      obj.programacoes.splice(position, 1);
      return obj;
    });
  };
  const move = (arr, from, to) =>
    arr.map((item, i) => (i === from ? arr[to] : i === to ? arr[from] : item));
  const moveCima = function() {
    const index = +this.dataset.programacaoId;
    if (index <= 0) return;
    esqueleto.update(obj => {
      const novo_array = move(obj.programacoes, index, index - 1);
      obj.programacoes = novo_array;

      return obj;
    });
  };

  const moveBaixo = function() {
    const index = +this.dataset.programacaoId;
    if (index >= campos_total - 1) return;
    esqueleto.update(obj => {
      const novo_array = move(obj.programacoes, index, index + 1);
      obj.programacoes = novo_array;

      return obj;
    });
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

    if (!this.nextElementSibling && enter) {
      adicionarProgramacao();
    } else if ((enter || baixo) && evento.ctrlKey) {
      if (this.nextElementSibling) {
        this.nextElementSibling.focus();
      } else {
        const next_exists = this.parentElement.parentElement.nextElementSibling;
        if (next_exists && next_exists.tagName === "FIELDSET") {
          next_exists.querySelector("[contenteditable]").focus();
        }
      }
    } else if (cima || backspace || del) {
      if (backspace && getCaretCharacterOffsetWithin(this) !== 0) return;
      if (this.previousElementSibling && evento.ctrlKey && !del) {
        this.previousElementSibling.focus();
      } else {
        const previous_exists = this.parentElement.parentElement
          .previousElementSibling;
        if (previous_exists && previous_exists.tagName === "FIELDSET") {
          if (backspace || del) {
            const todos_vazios = Array.from(this.parentElement.children).every(
              child => !child.innerText
            );
            if (todos_vazios && confirm("Apagar programação?")) {
              this.parentElement.previousElementSibling
                .querySelector("[data-programacao-id]")
                .click();
            }
          }
          if (evento.ctrlKey && !del) {
            const children = previous_exists.querySelectorAll(
              "[contenteditable]"
            );
            children[children.length - 1].focus();
          }
        }
      }
    }
  };

  afterUpdate(e => {
    const programacoes_largura = $esqueleto.programacoes.length;

    if (!editor && programacoes_largura) {
      editor = new MediumEditor(".campos [contenteditable]", {
        toolbar: {
          buttons: ["bold", "italic", "underline"]
        },
        disableReturn: true
      });

      editor.subscribe("addElement", function(event, editable) {
        editable.parentElement.firstElementChild.focus();
      });

    }

    if (programacoes_largura > campos_total) {
      editor.addElements(".campos [contenteditable]");
    }

    campos_total = programacoes_largura;
  });

  onMount(() => {
    tippy("[data-tippy-content]", {
      allowHTML: true
    });

    var getCellValue = function(tr, idx) {
      return tr.children[idx].innerText || tr.children[idx].textContent;
    };

    var comparer = function(idx, asc) {
      return function(a, b) {
        return (function(v1, v2) {
          return v1 !== "" && v2 !== "" && !isNaN(v1) && !isNaN(v2)
            ? v1 - v2
            : v1.toString().localeCompare(v2);
        })(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
      };
    };

    Array.prototype.slice
      .call(document.querySelectorAll("th"))
      .forEach(function(th) {
        th.addEventListener("click", function() {
          var table = th.parentNode;
          while (table.tagName.toUpperCase() != "TABLE")
            table = table.parentNode;
          var tbody = table.querySelector("tbody");
          Array.prototype.slice
            .call(tbody.querySelectorAll("tr"))
            .sort(
              comparer(
                Array.prototype.slice.call(th.parentNode.children).indexOf(th),
                (this.asc = !this.asc)
              )
            )
            .forEach(function(tr) {
              tbody.appendChild(tr);
            });
        });
      });
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
    display: flex;
    align-items: center;
  }
  .secao-titulo p {
    margin-bottom: 0.5em;
  }
  button svg {
    display: block;
    margin: 0 auto;
  }

  /* .dica-callout {
    width: 100%;
    background-color: var(--callout-info-bg, #eaeaea);
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    color: #312b45;
    color: var(--texto-cor-primario, #312b45);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .dica-callout p {
    margin: 0 0 0 1rem;
    flex: 1;
  }

  .dica-callout svg {
    width: 20px;
  } */
</style>

<div class="controles">
  <button
    data-tippy-content="Exportar conteúdo"
    type="button"
    on:click={exportar}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      viewBox="0 0 60.067 60.067">
      <path
        d="M36.573 53.527H7.847C3.207 53.527 0 49.633 0 44.66V15.729C0 10.662
        3.285 6.54 7.847 6.54h28.605c5.153 0 9.674 4.819 9.674 10.313 0
        .828-.672 1.499-1.5
        1.499s-1.5-.671-1.5-1.499c0-3.828-3.181-7.314-6.674-7.314H7.847C4.59
        9.539 3 12.752 3 15.729V44.66c0 3.345 1.84 5.868 4.847 5.868h28.726c.828
        0 1.5.672 1.5 1.499 0 .828-.672 1.5-1.5 1.5z" />
      <path
        d="M24.5 46.029c-.828 0-1.5-.672-1.5-1.499v-9.711c0-6.222 4.968-11.284
        11.598-11.284h20.305l-5.01-4.93c-.591-.581-.599-1.531-.018-2.12.582-.592
        1.53-.599 2.121-.018l7.622 7.499c.435.428.568 1.074.336
        1.637-.23.563-.779.932-1.388.932H34.598c-4.977 0-8.598 3.716-8.598
        8.284v9.711c0 .827-.672 1.499-1.5 1.499z" />
      <path
        d="M52.383 33.778c-.318
        0-.637-.1-.908-.307-.66-.502-.787-1.443-.285-2.102l5.812-7.625c.502-.66
        1.444-.786 2.102-.284.66.502.787 1.443.285 2.102l-5.812
        7.625c-.295.388-.742.591-1.194.591z" />
    </svg>
  </button>
  <button
    type="button"
    data-tippy-content="Importar conteúdo"
    on:click={importar}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 1000 1000">
      <path
        d="M294.62 12.61c-12.82 4.59-26.99 17.8-33.11 30.82L256.92
        53v332.47l5.55 5.55c9.95 9.95 25.84 7.46 31.77-4.98 2.49-5.55 2.87-26.22
        2.87-167.86 0-98.38.77-162.5 1.91-164.23 1.53-2.49 31.2-2.87
        245-3.44l243.09-.38v75.22c0 82.3-.19 80.39 11.48 86.52 4.59 2.49 17.42
        2.87 78.48 2.87h72.73v365.58c0 359.27 0 365.4-3.64 367.5-5.93
        3.06-641.59
        2.68-645.8-.38-2.87-2.3-3.25-14.16-3.64-146.62l-.57-144.32-6.32-5.55c-8.61-7.85-19.52-7.85-27.37
        0l-5.55 5.55v145.66c0 141.83.19 145.85 3.83 153.89 6.13 13.01 14.55
        21.63 27.18 27.95l11.67 5.93h647.34l9.95-4.59c12.25-5.74 23.35-16.65
        28.9-28.52l4.21-9V182.96l-4.79-9.57c-6.32-12.63-149.87-154.08-162.12-159.63-8.04-3.63-15.12-3.83-264.71-3.63-209.58-.01-257.82.37-263.75
        2.48zm629.34 152.74l7.66 7.27H827.3V70.6l44.6 43.64c24.31 24.12 47.85
        47.09 52.06 51.11z" />
      <path
        d="M428.03 367.86c-6.89 2.68-12.25 11.29-12.25 19.33 0 8.42 3.83 13.01
        66.8 78.09l35.03 36.56H20.14l-5.17 4.02c-4.4 3.45-4.97 5.17-4.97 16.08 0
        10.91.57 12.63 4.98 16.08l5.17 4.02h497.47l-42.68 44.22c-56.85
        58.76-59.14 61.44-59.14 70.63 0 14.17 14.16 23.93 26.8 18.57 5.93-2.49
        137.05-138.2 141.45-146.43 5.36-10.34
        2.68-13.78-68.53-88.05-37.13-39.05-69.67-71.78-72.35-72.92-5.38-2.5-9.59-2.5-15.14-.2z" />
    </svg>
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill-rule="evenodd"
      clip-rule="evenodd"
      image-rendering="optimizeQuality"
      shape-rendering="geometricPrecision"
      text-rendering="geometricPrecision"
      viewBox="0 0 640 640"
      width="24"
      fill="currentColor">
      <path
        fill-rule="nonzero"
        d="M120.84 176.116V25.536a2.735 2.735 0 012.74-2.74h301.067a2.8 2.8 0
        011.263.295l10.052 4.146-1.051 2.539 1.05-2.54c.414.166.745.426
        1.028.745l67.336 66.437 4.358 4.288-1.913 1.96 1.925-1.96c.543.543.815
        1.252.815 1.96v75.45a2.742 2.742 0 01-2.74 2.74h-29.245a2.745 2.745 0
        01-2.752-2.74v-35.858h-77.352a2.757 2.757 0
        01-2.763-2.752c0-.071.012-.154.012-.237v-14.433h-.012V57.65H155.683v118.466a2.745
        2.745 0 01-2.752 2.74h-29.35a2.735 2.735 0 01-2.74-2.74zm40.382
        200.058h317.555c.225 0 .426.035.638.07a33.73 33.73 0 0112.272 2.564
        33.659 33.659 0 0110.96 7.358 33.53 33.53 0 017.3 10.926 33.137 33.137 0
        012.528 12.224c.059.2.094.425.094.638v48.154h68.529c.189 0
        .39.024.578.047a23.44 23.44 0 008.54-1.842c2.94-1.229 5.598-3.048
        7.866-5.292a24.553 24.553 0 005.291-7.866 23.459 23.459 0
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
</div>
<!-- <aside class="dica-callout unselectable">
  <svg xmlns="http://www.w3.org/2000/svg" style="isolation:isolate;" viewBox="0 0 48 48"><path fill="#C0BBCD" fill-rule="nonzero" d="M22 34h4V22h-4v12zm2-30C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16zm-2-22h4v-4h-4v4z"></path></svg>
  <p>Você pode re-ordernar a tabela clicando nos cabeçalhos.</p>
</aside> -->
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
  <div class="secao-titulo">
    <p>Programações</p>
    <div
      class="dica"
      data-tippy-content="Para alterar a aparência do texto, basta selecioná-lo
      e utilizar as ferramentas de estilos.<br><br> Para navegar entre os campos
      segure a tecla <b>CTRL</b> e use as setas direcionais ↓ ou ↑, ou Enter
      para avançar ou Apagar (←) para voltar.">
      <svg
        class="infos__icon"
        role="presentation"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        style="display:block"
        viewBox="0 0 256 256">
        <path
          fill="#f5ab1e"
          fill-rule="evenodd"
          d="M128 22.158a105.84 105.84 0 00-105.84 105.84A105.84 105.84 0 00128
          233.838a105.84 105.84 0 00105.84-105.84A105.84 105.84 0 00128
          22.158zm0 32.76c5.16.117 9.55 1.875 13.18 5.273 3.34 3.575 5.07 7.94
          5.19 13.096-.12 5.156-1.85 9.404-5.19 12.744-3.63 3.75-8.02
          5.625-13.18
          5.625s-9.4-1.875-12.74-5.625c-3.75-3.34-5.63-7.588-5.63-12.744s1.88-9.521
          5.63-13.096c3.34-3.398 7.58-5.156 12.74-5.273zm-16.35
          53.792h32.79v92.37h-32.79v-92.37z" />
      </svg>
    </div>
  </div>
  {#each $esqueleto.programacoes as programacao, id}
    <fieldset>
      <legend>
        {programacao[0] ? `${programacao[0]}.${mes_numero}` : 'Programação'}
      </legend>
      <div class="acoes">
        <button type="button" on:click={remover} data-programacao-id={id}>
          Remover
        </button>
        <button type="button" on:click={encolherProgramacao}>Encolher</button>
        <button type="button" on:click={moveCima} data-programacao-id={id} title="Mover para cima">
          ↑
        </button>
        <button type="button" on:click={moveBaixo} data-programacao-id={id} title="Mover para baixo">
          ↓
        </button>
      </div>
      <div class="campos">
        {#each programacao as conteudo, index}
          <div
            contenteditable="true"
            data-placeholder={$esqueleto.colunas[index]}
            on:keydown={checaCampo}
            bind:innerHTML={$esqueleto.programacoes[id][index]} />
        {/each}
      </div>
    </fieldset>
  {/each}
</form>

<button on:click={adicionarProgramacao} type="button">
  Adicionar programação
</button>
