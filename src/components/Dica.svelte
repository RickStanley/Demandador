<script>
  export let dica;

  const regras = [
    { regex: /(\*\*|__)(.*?)\1/g, replacement: "<strong>$2</strong>" }, // bold
    { regex: /(\*|_)(.*?)\1/g, replacement: "<em>$2</em>" }, // emphasis
    { regex: /\~\~(.*?)\~\~/g, replacement: "<del>$1</del>" }, // del
    { regex: /\:\"(.*?)\"\:/g, replacement: "<q>$1</q>" }, // quote
    { regex: /`(.*?)`/g, replacement: "<code>$1</code>" } // inline code
  ];

  const renderiza = texto => {
    texto = `\n${texto}\n`;
    regras.forEach(regra => {
      texto = texto.replace(regra.regex, regra.replacement);
    });
    return texto.trim();
  };
</script>

<style>
  .dica-callout {
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
    line-height: 1.2;
  }

  .dica-callout svg {
    width: 20px;
  }
</style>

<aside class="dica-callout">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style="isolation:isolate;"
    viewBox="0 0 48 48">
    <path
      fill="#C0BBCD"
      fill-rule="nonzero"
      d="M22 34h4V22h-4v12zm2-30C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95
      20-20S35.05 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16
      16-7.18 16-16 16zm-2-22h4v-4h-4v4z" />
  </svg>
  <p>
    {@html renderiza(dica)}
  </p>
</aside>
