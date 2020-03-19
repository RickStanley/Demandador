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

const isString = valor => typeof valor === "string";

const moveElement = (arr, from, to) =>
    arr.map((item, i) => (i === from ? arr[to] : i === to ? arr[from] : item));

// @todo Documentar
function configValida(configs) {
    if (Object.keys(configs).length > 6) return false;

    const tem_titulo = "titulo" in configs;
    const tem_cliente_iniciais = "cliente_iniciais" in configs;
    const tem_data = "data" in configs;
    const tem_colunas = "colunas" in configs;
    const tem_fonte = "fonte" in configs;
    const tem_programacoes = "programacoes" in configs;
    const tem_rodape = "rodape" in configs;

    if (
        tem_cliente_iniciais &&
        tem_colunas &&
        tem_data &&
        tem_fonte &&
        tem_programacoes &&
        tem_titulo &&
        tem_rodape
    ) {
        if (
            Array.isArray(configs.colunas) &&
            configs.colunas.every(isString) &&
            Array.isArray(configs.programacoes) &&
            configs.programacoes.every(Array.isArray) &&
            Array.isArray(configs.rodape)
        )
            return true;
        else return false;
    } else return false;
}

/**
 * @param {Element|HTMLElement} element 
 */
function pegaPosicaoDoCursor(element) {
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

/**
 * Cria um hash previsível.
 * @param {string} s 
 */
const hashCode = s => { for (var i = 0, h; i < s.length; i++)h = Math.imul(31, h) + s.charCodeAt(i) | 0; return h }


export {
    configValida,
    meses_nomes,
    moveElement,
    pegaPosicaoDoCursor,
    hashCode
};