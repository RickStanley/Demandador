<script>
  import Editor from "./Editor.svelte";
  import Template from "./Template.svelte";

  import { writable } from "svelte/store";

  let esqueleto = writable({
    titulo: "Demandas",
    cliente_iniciais: "UNN",
    data: "Março",
    colunas: ["Data de entrega", "Tema", "Job", "Formato"],
    programacoes: [
      ["09.03", "Março Lilás", "Informativo", "Feed | Story | Banner Site"]
    ]
  });
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

  @media print {
    .editor-container {
      display: none;
    }
  }
</style>

<div class="host">
  <div class="editor-container">
    <Editor {esqueleto} />
  </div>
  <Template {esqueleto} />
</div>
