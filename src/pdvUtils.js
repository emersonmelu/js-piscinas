/**
 * Utilitário de cálculos financeiros e regras de negócio para Ponto de Venda (PDV)
 * JS Piscinas
 */

export const BRL = (valor) => {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/**
 * Calcula os totais de um item de venda individual
 * @param {number} preco - Preço unitário
 * @param {number} qtd - Quantidade
 * @param {number} desc - Valor ou percentual de desconto
 * @param {'%' | 'R$'} tipoDesc - Tipo do desconto
 */
export function calcularItem(preco = 0, qtd = 1, desc = 0, tipoDesc = '%') {
  const p = Math.max(0, Number(preco) || 0)
  const q = Math.max(0, Number(qtd) || 0)
  const d = Math.max(0, Number(desc) || 0)

  const subtotalBruto = p * q
  const valorDesconto =
    tipoDesc === '%'
      ? subtotalBruto * (Math.min(d, 100) / 100)
      : Math.min(d, subtotalBruto)

  const subtotalLiquido = Math.max(0, subtotalBruto - valorDesconto)

  return {
    preco: p,
    qtd: q,
    subtotalBruto: round2(subtotalBruto),
    desconto: round2(valorDesconto),
    subtotalLiquido: round2(subtotalLiquido),
  }
}

/**
 * Calcula o resumo financeiro completo do carrinho de PDV
 * @param {Array} itens - Lista de itens no carrinho
 * @param {number} descontoGeral - Desconto geral do pedido
 * @param {'%' | 'R$'} tipoDescontoGeral - Tipo do desconto geral
 * @param {number} taxaImpostoPercentual - Alíquota ou taxa percentual (opcional, padrão 0)
 */
export function calcularResumoVenda(
  itens = [],
  descontoGeral = 0,
  tipoDescontoGeral = '%',
  taxaImpostoPercentual = 0
) {
  // 1. Soma dos itens
  const subtotalItensBruto = itens.reduce((soma, it) => soma + (it.subtotalBruto || 0), 0)
  const descontoItens = itens.reduce((soma, it) => soma + (it.desconto || 0), 0)
  const subtotalItensLiquido = itens.reduce((soma, it) => soma + (it.subtotalLiquido || 0), 0)
  const totalUnidades = itens.reduce((soma, it) => soma + (it.qtd || 0), 0)

  // 2. Desconto Geral sobre a soma dos itens
  const descGeralNum = Math.max(0, Number(descontoGeral) || 0)
  const valorDescontoGeral =
    tipoDescontoGeral === '%'
      ? subtotalItensLiquido * (Math.min(descGeralNum, 100) / 100)
      : Math.min(descGeralNum, subtotalItensLiquido)

  const baseAposDescontoGeral = Math.max(0, subtotalItensLiquido - valorDescontoGeral)

  // 3. Impostos / Taxas
  const taxaPercentual = Math.max(0, Number(taxaImpostoPercentual) || 0)
  const valorImpostos = baseAposDescontoGeral * (taxaPercentual / 100)

  // 4. Total Final da Venda
  const totalFinal = Math.max(0, baseAposDescontoGeral + valorImpostos)
  const totalDescontosAcumulado = descontoItens + valorDescontoGeral

  return {
    totalItens: itens.length,
    totalUnidades,
    subtotalItensBruto: round2(subtotalItensBruto),
    descontoItens: round2(descontoItens),
    subtotalItensLiquido: round2(subtotalItensLiquido),
    descontoGeral: round2(valorDescontoGeral),
    totalDescontos: round2(totalDescontosAcumulado),
    valorImpostos: round2(valorImpostos),
    totalFinal: round2(totalFinal),
  }
}

/**
 * Arredonda para 2 casas decimais precisas
 */
export function round2(num) {
  return Math.round((Number(num) + Number.EPSILON) * 100) / 100
}
