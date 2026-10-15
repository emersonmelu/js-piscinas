import { useState, useMemo } from 'react'
import { BRL, calcularItem, calcularResumoVenda } from './pdvUtils.js'
import ReciboDuasVias from './ReciboDuasVias.jsx'

// Formas de pagamento
export const FORMAS_PAGAMENTO = [
  'PIX',
  'Dinheiro',
  'Cartão de Crédito',
  'Cartão de Débito',
  'Faturado',
]

// Categorias rápidas para materiais e produtos de piscina
export const CATEGORIAS_PDV = [
  'Todos',
  'Químicos',
  'Cloro',
  'Limpeza',
  'Equipamentos',
  'Acessórios',
]

// Ícones SVG monocromáticos para cada categoria
const IconesMonocromaticos = {
  Todos: (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  ),
  Químicos: (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16h10" />
    </svg>
  ),
  Cloro: (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  Limpeza: (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m2 22 10-10" />
      <path d="M15 9l5-5a1.41 1.41 0 0 1 2 2l-5 5" />
      <path d="M9 15l6 6" />
    </svg>
  ),
  Equipamentos: (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Acessórios: (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h20" />
      <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
      <path d="M12 2v10" />
    </svg>
  ),
}

export default function Vendas({ items = [], vendas = [], dadosEmpresa = {}, onRegistrar, onEditar, onExcluir }) {
  // 1. Estados do Catálogo
  const [busca, setBusca] = useState('')
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos')

  // 2. Estados do Carrinho / Painel de Caixa (Sessão de Venda)
  const [carrinho, setCarrinho] = useState([])
  const [descontoGeral, setDescontoGeral] = useState(0)
  const [tipoDescontoGeral, setTipoDescontoGeral] = useState('%')
  const [pagamentosMultiplos, setPagamentosMultiplos] = useState([]) // [{ forma: 'PIX', valor: 100 }, ...]
  const [formaSelecionada, setFormaSelecionada] = useState('PIX')
  const [valorParcelaForma, setValorParcelaForma] = useState('')
  const [cliente, setCliente] = useState('')
  const [observacao, setObservacao] = useState('')

  // 3. Feedback visual e abas secundárias
  const [notificacao, setNotificacao] = useState(null)
  const [drawerAbertoMobile, setDrawerAbertoMobile] = useState(false)
  const [abaSecundaria, setAbaSecundaria] = useState('pdv') // 'pdv' | 'historico'
  const [vendaDetalhes, setVendaDetalhes] = useState(null)
  const [vendaRecibo, setVendaRecibo] = useState(null)

  // Disparar toast temporário de feedback
  const avisar = (tipo, mensagem) => {
    setNotificacao({ tipo, mensagem })
    setTimeout(() => setNotificacao(null), 3000)
  }

  // Filtragem do catálogo de produtos por nome, código ou categoria
  const produtosFiltrados = useMemo(() => {
    return items.filter((prod) => {
      const matchCat =
        categoriaAtiva === 'Todos' ||
        prod.categoria?.toLowerCase() === categoriaAtiva.toLowerCase() ||
        (categoriaAtiva === 'Cloro' && prod.nome.toLowerCase().includes('cloro'))

      if (!matchCat) return false

      if (!busca.trim()) return true
      const termo = busca.toLowerCase()
      const codigoStr = String(prod.id).padStart(3, '0')
      return (
        prod.nome.toLowerCase().includes(termo) ||
        (prod.desc && prod.desc.toLowerCase().includes(termo)) ||
        codigoStr.includes(termo)
      )
    })
  }, [items, categoriaAtiva, busca])

  // Quantidade em tempo real de cada produto adicionada ao carrinho
  const qtdNoCarrinho = (produtoId) => {
    const it = carrinho.find((c) => c.produtoId === produtoId)
    return it ? it.qtd : 0
  }

  // Adicionar produto ao carrinho
  const adicionarAoCarrinho = (produto) => {
    const jaAdicionado = qtdNoCarrinho(produto.id)
    if (jaAdicionado + 1 > produto.qtd) {
      avisar('erro', `Estoque máximo atingido para ${produto.nome} (${produto.qtd} disponíveis).`)
      return
    }

    const itemExistente = carrinho.find((it) => it.produtoId === produto.id)

    if (itemExistente) {
      const novaQtd = itemExistente.qtd + 1
      const calculos = calcularItem(produto.preco, novaQtd, itemExistente.desc, itemExistente.tipoDesc)
      setCarrinho(
        carrinho.map((it) =>
          it.produtoId === produto.id ? { ...it, ...calculos, qtd: novaQtd } : it
        )
      )
    } else {
      const calculos = calcularItem(produto.preco, 1, 0, '%')
      setCarrinho([
        ...carrinho,
        {
          idTemp: Date.now() + Math.random(),
          produtoId: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          categoria: produto.categoria,
          embalagem: produto.embalagem || 'Unidade',
          qtd: 1,
          desc: 0,
          tipoDesc: '%',
          ...calculos,
        },
      ])
    }

    avisar('sucesso', `${produto.nome} adicionado ao pedido.`)
  }

  // Alterar quantidade (+ / - ou digitado)
  const alterarQtd = (produtoId, delta) => {
    const prodCatalogo = items.find((p) => p.id === produtoId)
    const itemAtual = carrinho.find((it) => it.produtoId === produtoId)
    if (!itemAtual || !prodCatalogo) return

    const novaQtd = itemAtual.qtd + delta

    if (novaQtd <= 0) {
      removerDoCarrinho(produtoId)
      return
    }

    if (novaQtd > prodCatalogo.qtd) {
      avisar('erro', `Estoque insuficiente! Apenas ${prodCatalogo.qtd} disponíveis.`)
      return
    }

    const calculos = calcularItem(itemAtual.preco, novaQtd, itemAtual.desc, itemAtual.tipoDesc)
    setCarrinho(
      carrinho.map((it) => (it.produtoId === produtoId ? { ...it, ...calculos, qtd: novaQtd } : it))
    )
  }

  // Alterar desconto individual de um item
  const alterarDescontoItem = (produtoId, desc, tipoDesc) => {
    const itemAtual = carrinho.find((it) => it.produtoId === produtoId)
    if (!itemAtual) return

    const calculos = calcularItem(itemAtual.preco, itemAtual.qtd, desc, tipoDesc)
    setCarrinho(
      carrinho.map((it) =>
        it.produtoId === produtoId ? { ...it, ...calculos, desc, tipoDesc } : it
      )
    )
  }

  // Remover item do carrinho
  const removerDoCarrinho = (produtoId) => {
    setCarrinho(carrinho.filter((it) => it.produtoId !== produtoId))
  }

  // Limpar Venda / Carrinho
  const limparVenda = () => {
    if (carrinho.length === 0) return
    if (!window.confirm('Deseja limpar todos os itens da venda atual?')) return
    setCarrinho([])
    setDescontoGeral(0)
    setTipoDescontoGeral('%')
    setPagamentosMultiplos([])
    setValorParcelaForma('')
    setCliente('')
    setObservacao('')
    avisar('info', 'Venda reiniciada.')
  }

  // Resumo Financeiro isolado usando pdvUtils
  const resumo = useMemo(() => {
    return calcularResumoVenda(carrinho, descontoGeral, tipoDescontoGeral, 0)
  }, [carrinho, descontoGeral, tipoDescontoGeral])

  // Total já pago e saldo restante
  const totalPago = useMemo(() => {
    return pagamentosMultiplos.reduce((s, p) => s + (Number(p.valor) || 0), 0)
  }, [pagamentosMultiplos])

  const saldoRestante = Math.max(0, resumo.totalFinal - totalPago)

  // Adicionar uma forma de pagamento com valor
  const adicionarFormaPagamento = (forma, valorSugerido) => {
    const val = Number(valorSugerido ?? (valorParcelaForma ? Number(valorParcelaForma) : saldoRestante))

    if (!val || val <= 0) {
      avisar('erro', 'Informe um valor válido para este pagamento.')
      return
    }

    // Se já existe a mesma forma, soma o valor
    const jaExiste = pagamentosMultiplos.find((p) => p.forma === forma)
    if (jaExiste) {
      setPagamentosMultiplos(
        pagamentosMultiplos.map((p) =>
          p.forma === forma ? { ...p, valor: Math.round((p.valor + val) * 100) / 100 } : p
        )
      )
    } else {
      setPagamentosMultiplos([
        ...pagamentosMultiplos,
        {
          idTemp: Date.now() + Math.random(),
          forma,
          valor: Math.round(val * 100) / 100,
        },
      ])
    }

    setValorParcelaForma('')
    avisar('sucesso', `${forma}: ${BRL(val)} adicionado.`)
  }

  // Remover uma forma de pagamento adicionada
  const removerFormaPagamento = (idTemp) => {
    setPagamentosMultiplos(pagamentosMultiplos.filter((p) => p.idTemp !== idTemp))
  }

  // Concluir Venda
  const concluirVenda = () => {
    if (carrinho.length === 0) {
      avisar('erro', 'Adicione pelo menos um produto antes de concluir a venda.')
      return
    }

    // Se não adicionou pagamentos explícitos na lista, assume pagamento integral pela formaSelecionada
    let listaPagamentosFinal = [...pagamentosMultiplos]
    if (listaPagamentosFinal.length === 0) {
      listaPagamentosFinal = [{ forma: formaSelecionada, valor: resumo.totalFinal }]
    }

    const somaPagamentos = listaPagamentosFinal.reduce((s, p) => s + p.valor, 0)

    // Formata o texto de exibição das formas de pagamento
    const textoPagamentos =
      listaPagamentosFinal.length === 1
        ? listaPagamentosFinal[0].forma
        : listaPagamentosFinal.map((p) => `${p.forma} (${BRL(p.valor)})`).join(' + ')

    const novaVenda = {
      data: new Date().toISOString().slice(0, 10),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      cliente: cliente.trim() || 'Consumidor Final',
      pagto: textoPagamentos,
      pagamentos: listaPagamentosFinal,
      totalPago: somaPagamentos,
      troco: Math.max(0, somaPagamentos - resumo.totalFinal),
      observacao: observacao.trim(),
      itens: carrinho.map((it) => ({
        produtoId: it.produtoId,
        produto: it.nome,
        preco: it.preco,
        qtd: it.qtd,
        desc: it.desc,
        tipo: it.tipoDesc,
        desconto: it.desconto,
        total: it.subtotalLiquido,
      })),
      produto:
        carrinho.length === 1
          ? carrinho[0].nome
          : `${carrinho[0].nome} + ${carrinho.length - 1} item(s)`,
      qtdTotal: resumo.totalUnidades,
      bruto: resumo.subtotalItensBruto,
      descontoItens: resumo.descontoItens,
      descGeral: Number(descontoGeral) || 0,
      tipoDescGeral: tipoDescontoGeral,
      descontoGeral: resumo.descontoGeral,
      desconto: resumo.totalDescontos,
      total: resumo.totalFinal,
    }

    onRegistrar(novaVenda)

    // Reset da sessão de venda
    setCarrinho([])
    setDescontoGeral(0)
    setTipoDescontoGeral('%')
    setPagamentosMultiplos([])
    setValorParcelaForma('')
    setCliente('')
    setObservacao('')
    setDrawerAbertoMobile(false)


    avisar('sucesso', `Venda de ${BRL(novaVenda.total)} registrada com sucesso!`)
  }

  return (
    <div className="space-y-4">
      {/* TOAST FLUTUANTE DE FEEDBACK VISUAL COM ÍCONE MONOCROMÁTICO */}
      {notificacao && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-xl animate-fadeIn ${
            notificacao.tipo === 'sucesso'
              ? 'border-emerald-400/50 bg-emerald-950/85 text-emerald-100'
              : notificacao.tipo === 'erro'
              ? 'border-red-400/50 bg-red-950/85 text-red-100'
              : 'border-[#ffc400]/50 bg-[#003a7d]/90 text-[#ffe27a]'
          }`}
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {notificacao.tipo === 'sucesso' ? (
              <path d="M20 6L9 17l-5-5" />
            ) : notificacao.tipo === 'erro' ? (
              <>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </>
            ) : (
              <>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </>
            )}
          </svg>
          <span className="text-xs font-bold">{notificacao.mensagem}</span>
        </div>
      )}

      {/* CABEÇALHO COM ABAS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAbaSecundaria('pdv')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition ${
              abaSecundaria === 'pdv'
                ? 'bg-gradient-to-r from-[#ffc400] to-[#f28c1b] text-[#003a7d] shadow-lg'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span>Terminal PDV</span>
            {carrinho.length > 0 && (
              <span className="ml-1 rounded-full bg-[#003a7d] px-2 py-0.5 text-xs font-black text-[#ffc400]">
                {resumo.totalUnidades}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setAbaSecundaria('historico')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition ${
              abaSecundaria === 'historico'
                ? 'bg-gradient-to-r from-[#ffc400] to-[#f28c1b] text-[#003a7d] shadow-lg'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Histórico de Vendas ({vendas.length})</span>
          </button>
        </div>

        {/* BOTÃO MOBILE PARA ABRIR O DRAWER DO CAIXA */}
        {abaSecundaria === 'pdv' && (
          <button
            type="button"
            onClick={() => setDrawerAbertoMobile(true)}
            className="btn-sun flex items-center gap-2 xl:hidden !py-2 !px-4 text-xs font-black"
          >
            <span>Ver Caixa ({resumo.totalUnidades})</span>
            <span className="rounded bg-[#003a7d] px-2 py-0.5 text-[11px] text-[#ffc400]">
              {BRL(resumo.totalFinal)}
            </span>
          </button>
        )}
      </div>

      {/* VISÃO 1: TERMINAL PDV */}
      {abaSecundaria === 'pdv' && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          {/* LADO ESQUERDO: CATÁLOGO DE PRODUTOS */}
          <div className="space-y-4 xl:col-span-7 2xl:col-span-8">
            {/* BARRA DE PESQUISA E FILTROS RÁPIDOS POR CATEGORIA (TOTALMENTE RESPONSIVO COM FLEX-WRAP, SEM SCROLLBAR) */}
            <div className="glass p-3.5 space-y-3">
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Pesquisar por nome ou código do produto..."
                  className="field w-full !pl-10 !py-2 text-xs sm:text-sm placeholder:text-white/50"
                />
                {busca && (
                  <button
                    onClick={() => setBusca('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* FILTROS RÁPIDOS POR CATEGORIAS: QUEBRA EM LINHAS RESPONSIVAS, ZERO BARRA DE SCROLL */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {CATEGORIAS_PDV.map((cat) => {
                  const ativa = categoriaAtiva === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoriaAtiva(cat)}
                      className={`rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                        ativa
                          ? 'bg-gradient-to-r from-[#ffc400] to-[#f28c1b] text-[#003a7d] shadow-md'
                          : 'border border-white/20 bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      <span className="text-current">{IconesMonocromaticos[cat] || IconesMonocromaticos.Todos}</span>
                      <span>{cat}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* GRADE DE CARDS DOS PRODUTOS */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {produtosFiltrados.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-dashed border-white/20 p-10 text-center text-white/60 bg-white/5">
                  Nenhum produto encontrado no catálogo para &quot;{busca}&quot;.
                </div>
              ) : (
                produtosFiltrados.map((prod) => {
                  const noCarrinho = qtdNoCarrinho(prod.id)
                  const estoqueEsgotado = prod.qtd <= 0

                  return (
                    <div
                      key={prod.id}
                      className={`glass group relative flex flex-col justify-between p-3.5 transition-all duration-300 hover:-translate-y-0.5 ${
                        estoqueEsgotado
                          ? 'opacity-60 border-red-500/30'
                          : 'hover:border-[#ffc400]/70'
                      }`}
                    >
                      {/* TOPO: CÓDIGO + BADGE DE CATEGORIA */}
                      <div>
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] text-white/50">
                            #{String(prod.id).padStart(3, '0')}
                          </span>
                          <span className="rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/80">
                            {prod.categoria}
                          </span>
                        </div>

                        {/* ÍCONE MONOCROMÁTICO EM DESTAQUE */}
                        <div className="mb-2.5 flex h-14 items-center justify-center rounded-xl border border-white/15 bg-[#003a7d]/40 text-cyan-200 shadow-inner group-hover:scale-105 transition-transform duration-300">
                          {IconesMonocromaticos[prod.categoria] ? (
                            <div className="scale-150">
                              {IconesMonocromaticos[prod.categoria]}
                            </div>
                          ) : (
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                              <line x1="7" y1="7" x2="7.01" y2="7" />
                            </svg>
                          )}
                        </div>

                        {/* NOME E DESCRIÇÃO */}
                        <h4 className="font-extrabold text-sm leading-tight text-white line-clamp-1">
                          {prod.nome}
                        </h4>
                        <p className="mt-1 text-xs text-white/70 line-clamp-2">{prod.desc}</p>
                      </div>

                      {/* RODAPÉ DO CARD: PREÇO, ESTOQUE E BOTÃO DE ADICIONAR */}
                      <div className="mt-3 pt-2.5 border-t border-white/10">
                        <div className="flex items-baseline justify-between mb-2">
                          <span className="text-lg font-black text-[#ffc400]">
                            {BRL(prod.preco)}
                          </span>
                          <span
                            className={`text-[10px] font-bold ${
                              estoqueEsgotado
                                ? 'text-red-300'
                                : prod.qtd <= 5
                                ? 'text-amber-300'
                                : 'text-emerald-300'
                            }`}
                          >
                            {estoqueEsgotado ? 'Esgotado' : `${prod.qtd} em estoque`}
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={estoqueEsgotado}
                          onClick={() => adicionarAoCarrinho(prod)}
                          className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-black transition-all shadow-md active:scale-95 ${
                            estoqueEsgotado
                              ? 'bg-white/10 text-white/40 cursor-not-allowed'
                              : noCarrinho > 0
                              ? 'bg-emerald-500/80 text-white hover:bg-emerald-500'
                              : 'btn-sun'
                          }`}
                        >
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            {noCarrinho > 0 ? (
                              <path d="M20 6L9 17l-5-5" />
                            ) : (
                              <>
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </>
                            )}
                          </svg>
                          <span>{noCarrinho > 0 ? `No Pedido (${noCarrinho})` : 'Adicionar'}</span>
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* LADO DIREITO: PAINEL DE VENDA / CAIXA */}
          {/* Versão Desktop (fixa na coluna do grid, sem sobreposição nem sombras vazadas) */}
          <div className="hidden xl:block xl:col-span-5 2xl:col-span-4">
            <div className="glass flex h-full flex-col p-4">
              {/* TOPO DO CAIXA COM CLIENTE E BOTÃO LIMPAR */}
              <div className="mb-3 flex items-center justify-between border-b border-white/15 pb-2.5">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#ffc400]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                  <h3 className="text-sm font-black uppercase tracking-wide text-white">
                    Painel do Caixa
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {carrinho.length > 0 && (
                    <button
                      type="button"
                      onClick={limparVenda}
                      className="rounded-lg border border-red-400/40 bg-red-500/20 px-2 py-0.5 text-[11px] font-bold text-red-200 hover:bg-red-500/35 transition"
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </div>

              {/* DADOS DO CLIENTE */}
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Nome do Cliente (opcional)"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  className="field w-full !py-1.5 !px-3 text-xs placeholder:text-white/50"
                />
              </div>

              {/* LISTA DE ITENS ADICIONADOS AO PEDIDO */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[150px] max-h-[300px] xl:max-h-[340px]">
                {carrinho.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-white/20 p-5 text-center text-white/50">
                    <svg className="h-8 w-8 text-white/30 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="8" cy="21" r="1" />
                      <circle cx="19" cy="21" r="1" />
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                    <span className="text-xs font-semibold">O caixa está vazio.</span>
                    <span className="text-[10px] text-white/40">
                      Adicione itens a partir do catálogo.
                    </span>
                  </div>
                ) : (
                  carrinho.map((item) => (
                    <div
                      key={item.produtoId}
                      className="rounded-xl border border-white/15 bg-white/10 p-2.5 backdrop-blur-md transition hover:border-white/25"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h5 className="font-extrabold text-xs text-white truncate">{item.nome}</h5>
                          <span className="text-[10px] text-white/60">
                            Unitário: {BRL(item.preco)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removerDoCarrinho(item.produtoId)}
                          className="text-red-300 hover:text-red-100 text-[11px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 hover:bg-red-500/40"
                          title="Remover item"
                        >
                          ✕
                        </button>
                      </div>

                      {/* CONTROLES DE QUANTIDADE E SUBTOTAL DO ITEM */}
                      <div className="mt-2 flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                        {/* BOTÕES + / - */}
                        <div className="flex items-center gap-1 rounded-lg border border-white/20 bg-[#003a7d]/50 p-0.5">
                          <button
                            type="button"
                            onClick={() => alterarQtd(item.produtoId, -1)}
                            className="flex h-5 w-5 items-center justify-center rounded bg-white/10 font-black text-white hover:bg-white/25 active:scale-95 text-xs"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-black text-white">
                            {item.qtd}
                          </span>
                          <button
                            type="button"
                            onClick={() => alterarQtd(item.produtoId, +1)}
                            className="flex h-5 w-5 items-center justify-center rounded bg-white/10 font-black text-white hover:bg-white/25 active:scale-95 text-xs"
                          >
                            +
                          </button>
                        </div>

                        {/* DESCONTO INDIVIDUAL DO PRODUTO */}
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={item.desc || ''}
                            onChange={(e) =>
                              alterarDescontoItem(item.produtoId, +e.target.value, item.tipoDesc)
                            }
                            className="field !py-0.5 !px-1 w-12 text-center text-[10px]"
                            title="Desconto neste item"
                          />
                          <select
                            value={item.tipoDesc}
                            onChange={(e) =>
                              alterarDescontoItem(item.produtoId, item.desc, e.target.value)
                            }
                            className="field !py-0.5 !px-1 text-[10px]"
                          >
                            <option value="%">%</option>
                            <option value="R$">R$</option>
                          </select>
                        </div>

                        {/* SUBTOTAL DO ITEM */}
                        <div className="text-right">
                          <div className="text-xs font-black text-[#ffc400]">
                            {BRL(item.subtotalLiquido)}
                          </div>
                          {item.desconto > 0 && (
                            <div className="text-[10px] text-amber-300">
                              - {BRL(item.desconto)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* SELEÇÃO E GERENCIAMENTO DE FORMAS DE PAGAMENTO */}
              <div className="mt-3 pt-2.5 border-t border-white/15">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70">
                    Forma de Pagamento
                  </label>
                  <span className="text-[10px] text-white/50">
                    {pagamentosMultiplos.length > 0 ? `${pagamentosMultiplos.length} lançada(s)` : 'Clique para selecionar'}
                  </span>
                </div>

                {/* BOTÕES DAS FORMAS DISPONÍVEIS */}
                <div className="grid grid-cols-3 gap-1 text-xs mb-2">
                  {FORMAS_PAGAMENTO.map((f) => {
                    const ativa = formaSelecionada === f
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => {
                          setFormaSelecionada(f)
                          const valorSugerido = saldoRestante > 0 ? saldoRestante : resumo.totalFinal
                          setValorParcelaForma(valorSugerido > 0 ? valorSugerido.toFixed(2) : '')
                        }}
                        className={`rounded-lg py-1 px-1.5 text-center text-[10px] font-bold transition truncate ${
                          ativa
                            ? 'bg-gradient-to-r from-[#ffc400] to-[#f28c1b] text-[#003a7d] shadow-sm'
                            : 'border border-white/15 bg-white/10 text-white/80 hover:bg-white/20'
                        }`}
                      >
                        {f}
                      </button>
                    )
                  })}
                </div>

                {/* CAMPO DE VALOR PREENCHIDO AUTOMATICAMENTE */}
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-white/50">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder={saldoRestante > 0 ? saldoRestante.toFixed(2) : '0.00'}
                      value={valorParcelaForma}
                      onChange={(e) => setValorParcelaForma(e.target.value)}
                      className="field !py-1 !pl-6 !pr-2 w-full text-xs font-mono font-bold"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => adicionarFormaPagamento(formaSelecionada)}
                    className="btn !py-1 !px-2.5 text-xs font-bold whitespace-nowrap bg-white/15 hover:bg-white/25 border-white/20"
                    title={`Adicionar valor em ${formaSelecionada}`}
                  >
                    + Adicionar
                  </button>

                  {saldoRestante > 0 && pagamentosMultiplos.length > 0 && (
                    <button
                      type="button"
                      onClick={() => adicionarFormaPagamento(formaSelecionada, saldoRestante)}
                      className="rounded-lg border border-[#ffc400]/40 bg-[#ffc400]/20 text-[#ffe27a] py-1 px-2 text-[10px] font-bold hover:bg-[#ffc400]/30 transition"
                      title="Lançar saldo restante nesta forma"
                    >
                      Lançar Resto
                    </button>
                  )}
                </div>

                {/* LISTA DE PAGAMENTOS MÚLTIPLOS */}
                {pagamentosMultiplos.length > 0 && (
                  <div className="space-y-1 mb-2 max-h-24 overflow-y-auto rounded-lg border border-white/10 bg-[#001f44]/40 p-1.5">
                    {pagamentosMultiplos.map((p) => (
                      <div
                        key={p.idTemp}
                        className="flex items-center justify-between gap-1 rounded bg-white/5 px-2 py-1 text-[11px]"
                      >
                        <span className="font-bold text-white/90">{p.forma}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#ffc400] font-black">{BRL(p.valor)}</span>
                          <button
                            type="button"
                            onClick={() => removerFormaPagamento(p.idTemp)}
                            className="text-red-300 hover:text-red-100 text-[10px] font-bold px-1 rounded bg-red-500/20"
                            title="Remover forma"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DESCONTO GERAL */}
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white/80">Desconto no Pedido:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={descontoGeral || ''}
                    onChange={(e) => setDescontoGeral(+e.target.value)}
                    className="field !py-0.5 !px-2 w-16 text-right text-xs"
                  />
                  <select
                    value={tipoDescontoGeral}
                    onChange={(e) => setTipoDescontoGeral(e.target.value)}
                    className="field !py-0.5 !px-1.5 text-xs font-bold"
                  >
                    <option value="%">%</option>
                    <option value="R$">R$</option>
                  </select>
                </div>
              </div>

              {/* RESUMO FINANCEIRO */}
              <div className="mt-2.5 space-y-1 rounded-xl border border-white/15 bg-[#001f44]/60 p-2.5 text-xs">
                <div className="flex justify-between text-white/70 text-[11px]">
                  <span>Subtotal Bruto:</span>
                  <span className="font-semibold">{BRL(resumo.subtotalItensBruto)}</span>
                </div>
                {resumo.totalDescontos > 0 && (
                  <div className="flex justify-between text-amber-300 font-medium text-[11px]">
                    <span>Descontos Totais:</span>
                    <span>- {BRL(resumo.totalDescontos)}</span>
                  </div>
                )}
                <div className="flex items-baseline justify-between border-t border-white/15 pt-1.5 text-xs font-black">
                  <span className="uppercase text-white">Total Geral:</span>
                  <span className="text-xl font-black text-[#ffc400]">
                    {BRL(resumo.totalFinal)}
                  </span>
                </div>

                {pagamentosMultiplos.length > 0 && (
                  <div className="border-t border-white/10 pt-1 space-y-0.5 text-[11px]">
                    <div className="flex justify-between text-white/80">
                      <span>Total Lançado:</span>
                      <span className="font-mono font-bold text-emerald-300">{BRL(totalPago)}</span>
                    </div>
                    {totalPago < resumo.totalFinal ? (
                      <div className="flex justify-between text-amber-300 font-bold">
                        <span>Falta Pagar:</span>
                        <span className="font-mono">{BRL(resumo.totalFinal - totalPago)}</span>
                      </div>
                    ) : totalPago > resumo.totalFinal ? (
                      <div className="flex justify-between text-cyan-200 font-bold">
                        <span>Troco:</span>
                        <span className="font-mono">{BRL(totalPago - resumo.totalFinal)}</span>
                      </div>
                    ) : (
                      <div className="text-right text-[10px] text-emerald-300 font-bold">
                        ✓ Valor integral coberto
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* BOTÕES DE AÇÃO */}
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={carrinho.length === 0}
                  onClick={limparVenda}
                  className="rounded-xl border border-white/20 bg-white/10 py-2.5 text-xs font-bold text-white transition hover:bg-white/20 active:scale-95 disabled:opacity-40"
                >
                  Limpar
                </button>

                <button
                  type="button"
                  disabled={carrinho.length === 0}
                  onClick={concluirVenda}
                  className="col-span-2 btn-sun !py-2.5 flex items-center justify-center gap-1.5 text-xs font-black shadow-lg disabled:opacity-40"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Concluir Venda</span>
                </button>
              </div>
            </div>
          </div>

          {/* Versão Mobile (Drawer overlay deslizante, apenas quando aberto) */}
          {drawerAbertoMobile && (
            <div className="fixed inset-0 z-50 flex justify-end xl:hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="w-full max-w-md bg-[#002f68] p-4 flex flex-col h-full shadow-2xl">
                {/* TOPO DO CAIXA COM CLIENTE E BOTÃO FECHAR */}
                <div className="mb-3 flex items-center justify-between border-b border-white/15 pb-2.5">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-[#ffc400]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M9 21V9" />
                    </svg>
                    <h3 className="text-sm font-black uppercase tracking-wide text-white">
                      Painel do Caixa
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {carrinho.length > 0 && (
                      <button
                        type="button"
                        onClick={limparVenda}
                        className="rounded-lg border border-red-400/40 bg-red-500/20 px-2 py-0.5 text-[11px] font-bold text-red-200 hover:bg-red-500/35 transition"
                      >
                        Limpar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setDrawerAbertoMobile(false)}
                      className="btn !px-2 !py-0.5 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* DADOS DO CLIENTE */}
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Nome do Cliente (opcional)"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    className="field w-full !py-1.5 !px-3 text-xs placeholder:text-white/50"
                  />
                </div>

                {/* LISTA DE ITENS */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[150px]">
                  {carrinho.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-white/20 p-5 text-center text-white/50">
                      <span className="text-xs font-semibold">O caixa está vazio.</span>
                    </div>
                  ) : (
                    carrinho.map((item) => (
                      <div
                        key={item.produtoId}
                        className="rounded-xl border border-white/15 bg-white/10 p-2.5 backdrop-blur-md"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h5 className="font-extrabold text-xs text-white truncate">{item.nome}</h5>
                            <span className="text-[10px] text-white/60">Unitário: {BRL(item.preco)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removerDoCarrinho(item.produtoId)}
                            className="text-red-300 hover:text-red-100 text-[11px] font-bold px-1.5 py-0.5 rounded bg-red-500/20"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                          <div className="flex items-center gap-1 rounded-lg border border-white/20 bg-[#003a7d]/50 p-0.5">
                            <button
                              type="button"
                              onClick={() => alterarQtd(item.produtoId, -1)}
                              className="flex h-5 w-5 items-center justify-center rounded bg-white/10 font-black text-white"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-black text-white">{item.qtd}</span>
                            <button
                              type="button"
                              onClick={() => alterarQtd(item.produtoId, +1)}
                              className="flex h-5 w-5 items-center justify-center rounded bg-white/10 font-black text-white"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="text-xs font-black text-[#ffc400]">{BRL(item.subtotalLiquido)}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* FORMAS DE PAGAMENTO MOBILE */}
                <div className="mt-3 pt-2.5 border-t border-white/15">
                  <div className="grid grid-cols-3 gap-1 text-xs mb-2">
                    {FORMAS_PAGAMENTO.map((f) => {
                      const ativa = formaSelecionada === f
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => {
                            setFormaSelecionada(f)
                            const valorSugerido = saldoRestante > 0 ? saldoRestante : resumo.totalFinal
                            setValorParcelaForma(valorSugerido > 0 ? valorSugerido.toFixed(2) : '')
                          }}
                          className={`rounded-lg py-1 px-1.5 text-center text-[10px] font-bold transition truncate ${
                            ativa
                              ? 'bg-gradient-to-r from-[#ffc400] to-[#f28c1b] text-[#003a7d]'
                              : 'border border-white/15 bg-white/10 text-white/80'
                          }`}
                        >
                          {f}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="relative flex-1">
                      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-white/50">
                        R$
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder={saldoRestante > 0 ? saldoRestante.toFixed(2) : '0.00'}
                        value={valorParcelaForma}
                        onChange={(e) => setValorParcelaForma(e.target.value)}
                        className="field !py-1 !pl-6 !pr-2 w-full text-xs font-mono font-bold"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => adicionarFormaPagamento(formaSelecionada)}
                      className="btn !py-1 !px-2.5 text-xs font-bold whitespace-nowrap bg-white/15"
                    >
                      + Adicionar
                    </button>
                  </div>
                </div>

                {/* RESUMO E BOTÃO CONCLUIR */}
                <div className="mt-2.5 space-y-1 rounded-xl border border-white/15 bg-[#001f44]/60 p-2.5 text-xs">
                  <div className="flex items-baseline justify-between text-xs font-black">
                    <span className="uppercase text-white">Total:</span>
                    <span className="text-xl font-black text-[#ffc400]">{BRL(resumo.totalFinal)}</span>
                  </div>
                </div>

                <div className="mt-2.5 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    disabled={carrinho.length === 0}
                    onClick={limparVenda}
                    className="rounded-xl border border-white/20 bg-white/10 py-2.5 text-xs font-bold text-white"
                  >
                    Limpar
                  </button>
                  <button
                    type="button"
                    disabled={carrinho.length === 0}
                    onClick={concluirVenda}
                    className="col-span-2 btn-sun !py-2.5 flex items-center justify-center gap-1.5 text-xs font-black shadow-lg"
                  >
                    <span>Concluir Venda</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VISÃO 2: HISTÓRICO DE VENDAS COM FILTRO POR DATA E BARRA DE BUSCA */}
      {abaSecundaria === 'historico' && (
        <HistoricoVendasSecao
          vendas={vendas}
          onNovoPedido={() => setAbaSecundaria('pdv')}
          onRecibo={(v) => setVendaRecibo(v)}
          onDetalhes={(v) => setVendaDetalhes(v)}
          onExcluir={onExcluir}
        />
      )}

      {/* MODAL PARA DETALHAR ITENS DE UMA VENDA DO HISTÓRICO */}
      {vendaDetalhes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#031438]/70 p-4 backdrop-blur-sm">
          <div className="glass w-full max-w-lg p-6">
            <div className="mb-4 flex items-center justify-between border-b border-white/20 pb-3">
              <div>
                <h3 className="text-lg font-black text-white">Detalhes da Venda #{vendaDetalhes.id}</h3>
                <p className="text-xs text-white/70">
                  Data: {vendaDetalhes.data?.split('-').reverse().join('/')} • Cliente:{' '}
                  {vendaDetalhes.cliente || 'Consumidor'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVendaDetalhes(null)}
                className="rounded-lg border border-white/20 bg-white/10 p-1.5 text-white/70 hover:bg-white/25 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-white/70">
                Itens da Venda
              </div>

              <div className="max-h-56 overflow-y-auto rounded-xl border border-white/15 bg-[#001f44]/50">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#003a7d]/60 text-white/80">
                    <tr>
                      <th className="px-3 py-2">Item</th>
                      <th className="px-2 py-2">Qtd</th>
                      <th className="px-3 py-2">Unit.</th>
                      <th className="px-3 py-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {vendaDetalhes.itens && vendaDetalhes.itens.length > 0 ? (
                      vendaDetalhes.itens.map((it, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2 font-bold text-white">{it.produto}</td>
                          <td className="px-2 py-2">{it.qtd}</td>
                          <td className="px-3 py-2">{BRL(it.preco)}</td>
                          <td className="px-3 py-2 font-black text-[#ffc400]">{BRL(it.total)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-3 py-2 font-bold text-white">{vendaDetalhes.produto}</td>
                        <td className="px-2 py-2">{vendaDetalhes.qtd || 1}</td>
                        <td className="px-3 py-2">{BRL(vendaDetalhes.preco)}</td>
                        <td className="px-3 py-2 font-black text-[#ffc400]">{BRL(vendaDetalhes.total)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/10 p-3 space-y-1 text-xs">
                <div className="flex justify-between text-white/75">
                  <span>Subtotal bruto:</span>
                  <span>{BRL(vendaDetalhes.bruto || vendaDetalhes.total)}</span>
                </div>
                {vendaDetalhes.desconto > 0 && (
                  <div className="flex justify-between text-amber-300">
                    <span>Desconto total concedido:</span>
                    <span>- {BRL(vendaDetalhes.desconto)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/75">
                  <span>Pagamento:</span>
                  <span className="font-bold text-white">{vendaDetalhes.pagto}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#ffc400] border-t border-white/15 pt-2 mt-1">
                  <span>Valor Total Final:</span>
                  <span>{BRL(vendaDetalhes.total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-between gap-2">
              <button
                type="button"
                className="btn !bg-[#ffc400]/25 !text-[#ffe27a] hover:!bg-[#ffc400]/35 border-[#ffc400]/40 font-bold flex items-center gap-1.5"
                onClick={() => {
                  const v = vendaDetalhes
                  setVendaDetalhes(null)
                  setVendaRecibo(v)
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect width="12" height="8" x="6" y="14" />
                </svg>
                <span>Visualizar Recibo (2 Vias)</span>
              </button>

              <button className="btn" onClick={() => setVendaDetalhes(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPROVANTE DE PEDIDO / RECIBO EM DUAS VIAS (A4 HORIZONTAL / PAISAGEM) */}
      {vendaRecibo && (
        <ReciboDuasVias
          venda={vendaRecibo}
          dadosEmpresa={dadosEmpresa}
          onClose={() => setVendaRecibo(null)}
        />
      )}
    </div>
  )
}

// Subcomponente de Histórico de Vendas Completo com Filtros Rápidos, Período e Busca Responsivo
function HistoricoVendasSecao({ vendas = [], onNovoPedido, onRecibo, onDetalhes, onExcluir }) {
  const [filtroData, setFiltroData] = useState('Hoje') // 'Hoje' | 'Este mês' | 'Escolher período' | 'Todas'
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [busca, setBusca] = useState('')

  // Hoje no formato YYYY-MM-DD
  const hojeStr = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const mesAtualStr = useMemo(() => hojeStr.slice(0, 7), [hojeStr]) // YYYY-MM

  // Filtragem combinada
  const vendasFiltradas = useMemo(() => {
    return vendas.filter((v) => {
      // 1. Filtro de Data
      if (filtroData === 'Hoje') {
        if (v.data !== hojeStr) return false
      } else if (filtroData === 'Este mês') {
        if (!v.data?.startsWith(mesAtualStr)) return false
      } else if (filtroData === 'Escolher período') {
        if (dataInicio && v.data < dataInicio) return false
        if (dataFim && v.data > dataFim) return false
      }

      // 2. Filtro de Busca (por cliente, produto, número do pedido ou pagamento)
      if (busca.trim()) {
        const termo = busca.toLowerCase()
        const matchCliente = v.cliente?.toLowerCase().includes(termo)
        const matchProduto = v.produto?.toLowerCase().includes(termo)
        const matchPagto = v.pagto?.toLowerCase().includes(termo)
        const matchId = String(v.id).includes(termo)
        const matchItens = v.itens?.some((it) => it.produto.toLowerCase().includes(termo))

        if (!matchCliente && !matchProduto && !matchPagto && !matchId && !matchItens) {
          return false
        }
      }

      return true
    })
  }, [vendas, filtroData, dataInicio, dataFim, busca, hojeStr, mesAtualStr])

  // Métricas calculadas sobre as vendas filtradas para atualizar os cards
  const metricas = useMemo(() => {
    const totalVendido = vendasFiltradas.reduce((s, v) => s + (v.total || 0), 0)
    const totalItens = vendasFiltradas.reduce((s, v) => {
      if (v.itens && v.itens.length > 0) {
        return s + v.itens.reduce((acc, it) => acc + it.qtd, 0)
      }
      return s + (v.qtd || 1)
    }, 0)
    const ticketMedio = vendasFiltradas.length > 0 ? totalVendido / vendasFiltradas.length : 0

    return { totalVendido, totalItens, ticketMedio, qtdVendas: vendasFiltradas.length }
  }, [vendasFiltradas])

  return (
    <div className="w-full space-y-4">
      {/* BARRA SUPERIOR: TÍTULO, BOTÕES DE FILTRO DE DATA E BOTÃO NOVO PEDIDO */}
      <div className="glass p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm sm:text-base font-black text-white whitespace-nowrap mr-1">
              Histórico de Vendas
            </h3>

            {/* BOTÕES DE FILTRO DE DATA COM WRAP NATURAL */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              {[
                { id: 'Hoje', rotulo: 'Hoje' },
                { id: 'Este mês', rotulo: 'Este mês' },
                { id: 'Escolher período', rotulo: 'Escolher período' },
                { id: 'Todas', rotulo: 'Todas' },
              ].map((btn) => {
                const ativo = filtroData === btn.id
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setFiltroData(btn.id)}
                    className={`rounded-lg px-2.5 sm:px-3 py-1 text-xs font-extrabold transition ${
                      ativo
                        ? 'bg-gradient-to-r from-[#ffc400] to-[#f28c1b] text-[#003a7d] shadow-md'
                        : 'border border-white/20 bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {btn.rotulo}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={onNovoPedido}
            className="btn-sun flex items-center justify-center gap-1.5 !py-1.5 !px-3 text-xs font-black shadow-md self-start sm:self-auto"
          >
            <span>+ Novo Pedido</span>
          </button>
        </div>

        {/* CONTROLES EXTRAS: SELETORES DE DATA (SE ESCOLHER PERÍODO) E BARRA DE PESQUISA */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 pt-2 border-t border-white/10">
          {/* BARRA DE PESQUISA NAS VENDAS */}
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar por cliente, produto ou nº do pedido..."
              className="field w-full !pl-9 !py-1.5 text-xs placeholder:text-white/50"
            />
            {busca && (
              <button
                type="button"
                onClick={() => setBusca('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* DATAS DE/ATÉ QUANDO 'Escolher período' ESTIVER ATIVO */}
          {filtroData === 'Escolher período' && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-white/70 font-semibold">De:</span>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="field !py-1 !px-2 text-xs"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white/70 font-semibold">Até:</span>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="field !py-1 !px-2 text-xs"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CARDS DINÂMICOS DE RESUMO (FLUIDOS, 1 COL NO MOBILE, 2 NO SM, 4 NO LG) */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-3">
        <div className="glass p-3 sm:p-3.5 flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/60">
            Total Faturado
          </span>
          <div className="mt-1 text-base sm:text-xl font-black text-[#ffc400]">
            {BRL(metricas.totalVendido)}
          </div>
          <span className="text-[9px] sm:text-[10px] text-white/50 truncate">no período selecionado</span>
        </div>

        <div className="glass p-3 sm:p-3.5 flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/60">
            Pedidos Realizados
          </span>
          <div className="mt-1 text-base sm:text-xl font-black text-white">
            {metricas.qtdVendas}
          </div>
          <span className="text-[9px] sm:text-[10px] text-white/50 truncate">vendas registradas</span>
        </div>

        <div className="glass p-3 sm:p-3.5 flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/60">
            Ticket Médio
          </span>
          <div className="mt-1 text-base sm:text-xl font-black text-cyan-200">
            {BRL(metricas.ticketMedio)}
          </div>
          <span className="text-[9px] sm:text-[10px] text-white/50 truncate">por pedido concluído</span>
        </div>

        <div className="glass p-3 sm:p-3.5 flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/60">
            Itens Vendidos
          </span>
          <div className="mt-1 text-base sm:text-xl font-black text-emerald-300">
            {metricas.totalItens} un.
          </div>
          <span className="text-[9px] sm:text-[10px] text-white/50 truncate">volume total de produtos</span>
        </div>
      </div>

      {/* ÁREA DA TABELA COM CONTROLE DE OVERFLOW E LARGURA 100% */}
      <div className="glass w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#003a7d]/60 text-[10px] sm:text-[11px] uppercase tracking-wider text-[#ffc400]">
              <tr>
                {['Data', 'Itens / Produto', 'Cliente', 'Qtd Itens', 'Desconto', 'Pagamento', 'Total', 'Ações'].map(
                  (h) => (
                    <th key={h} className="whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 font-extrabold">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-8 text-center text-white/70">
                    Nenhuma venda encontrada para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                [...vendasFiltradas]
                  .sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id)
                  .map((v) => {
                    const qtdTotalItens = v.itens ? v.itens.reduce((s, it) => s + it.qtd, 0) : v.qtd || 1
                    return (
                      <tr key={v.id} className="border-t border-white/10 transition hover:bg-white/10">
                        <td className="whitespace-nowrap px-3 sm:px-4 py-2.5">
                          <div className="font-semibold">{v.data?.split('-').reverse().join('/')}</div>
                          {v.hora && <div className="text-[10px] text-white/50">{v.hora}</div>}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 font-bold">
                          <div className="flex items-center gap-2">
                            <span className="truncate max-w-[140px] sm:max-w-xs">{v.produto}</span>
                            {v.itens && v.itens.length > 1 && (
                              <button
                                type="button"
                                onClick={() => onDetalhes(v)}
                                className="text-[10px] font-semibold text-cyan-200 bg-white/10 border border-white/20 px-1.5 py-0.5 rounded hover:bg-white/20 whitespace-nowrap"
                              >
                                {v.itens.length} itens
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 text-white/80">{v.cliente || 'Consumidor'}</td>
                        <td className="px-3 sm:px-4 py-2.5 font-semibold">{qtdTotalItens} un.</td>
                        <td className="whitespace-nowrap px-3 sm:px-4 py-2.5 text-amber-200">
                          {v.desconto ? `- ${BRL(v.desconto)}` : '—'}
                        </td>
                        <td className="whitespace-nowrap px-3 sm:px-4 py-2.5">{v.pagto}</td>
                        <td className="whitespace-nowrap px-3 sm:px-4 py-2.5 font-extrabold text-[#ffc400]">
                          {BRL(v.total)}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              className="btn !px-2.5 !py-1 text-xs !bg-[#ffc400]/20 !text-[#ffe27a] hover:!bg-[#ffc400]/30 border-[#ffc400]/40 font-bold flex items-center gap-1"
                              onClick={() => onRecibo(v)}
                              title="Visualizar e Imprimir Recibo em 2 Vias"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6 9 6 2 18 2 18 9" />
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                <rect width="12" height="8" x="6" y="14" />
                              </svg>
                              <span>Recibo</span>
                            </button>
                            <button
                              type="button"
                              className="btn !px-2.5 !py-1 text-xs"
                              onClick={() => onDetalhes(v)}
                              title="Ver detalhes"
                            >
                              Detalhes
                            </button>
                            <button
                              type="button"
                              className="btn !px-2.5 !py-1 text-xs hover:!bg-red-500/60"
                              onClick={() => onExcluir(v)}
                              title="Excluir venda"
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


