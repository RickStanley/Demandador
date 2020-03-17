<script>
  import Editor from "./Editor.svelte";
  import Template from "./Template.svelte";

  import { writable } from "svelte/store";

  // let dropzone;

  let esqueleto = writable({
    titulo: "Demandas",
    cliente_iniciais: "UNN",
    data: "Março",
    colunas: ["Data de entrega", "Tema", "Job", "Formato"],
    fonte: 16,
    programacoes: [
      ["09.03", "Março Lilás", "Informativo", "Feed | Story | Banner Site"]
    ]
  });

  // window.addEventListener("dragenter", function(e) {
  //   dropzone.style.display = "block";
  // });

  // const dragenter = e => {
  //   if (true) {
  //     // Test that the item being dragged is a valid one
  //     e.dataTransfer.dropEffect = "copy";
  //     e.preventDefault();
  //   }
  // };

  // const dragover = e => {
  //   if (true) {
  //     // Test that the item being dragged is a valid one
  //     e.dataTransfer.dropEffect = "copy";
  //     e.preventDefault();
  //   }
  // };

  // const dragleave = e => {
  //   dropzone.style.display = "none";
  // };

  // const drop = e => {
  //   e.preventDefault();
  //   dragleave();
  // };
</script>

<style>
  .host {
    display: flex;
    min-height: 100vh;
    width: 100%;
    flex-wrap: wrap-reverse;
    align-items: flex-end;
  }

  .editor-container {
    padding: 1rem;
    flex-basis: 300px;
    background-color: whitesmoke;
    height: 100vh;
    overflow: auto;
    -webkit-position: sticky;
    position: sticky;
    top: 0;
  }

  .dropzone {
    box-sizing: border-box;
    display: none;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 99999;

    background: rgba(96, 167, 220, 0.8);
    border: 11px dashed #60a7dc;
  }

  @media print {
    .editor-container {
      display: none;
    }
  }
</style>

<!-- @todo Dropzone -->
<!-- <div
  bind:this={dropzone}
  on:dragover={dragover}
  on:dragenter={dragenter}
  on:dragleave={dragleave}
  class="dropzone" /> -->
<div class="host">
  <div class="editor-container">
    <Editor {esqueleto} />
  </div>
  <Template {esqueleto} />
</div>
