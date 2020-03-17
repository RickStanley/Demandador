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

function configValida(configs) {
    if (Object.keys(configs).length > 6) return false;

    const tem_titulo = "titulo" in configs;
    const tem_cliente_iniciais = "cliente_iniciais" in configs;
    const tem_data = "data" in configs;
    const tem_colunas = "colunas" in configs;
    const tem_fonte = "fonte" in configs;
    const tem_programacoes = "programacoes" in configs;

    if (
        tem_cliente_iniciais &&
        tem_colunas &&
        tem_data &&
        tem_fonte &&
        tem_programacoes &&
        tem_titulo
    ) {
        if (
            Array.isArray(configs.colunas) &&
            configs.colunas.every(isString) &&
            Array.isArray(configs.programacoes) &&
            configs.programacoes.every(Array.isArray)
        )
            return true;
        else return false;
    } else return false;
}

export {
    configValida,
    meses_nomes
};