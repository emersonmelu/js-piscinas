import { useState } from 'react'

const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const pagamentos = ['Pix', 'Dinheiro', 'Cartão de Débito', 'Cartão de Crédito', 'Boleto', 'Transferência']

export const calcTotal = (preco, qtd, desc, tipo) => {
  const bruto = preco * qtd
  const d = tipo === '%' ? bruto * (Math.min(desc, 100) / 100) : Math.min(desc, bruto)
  return { bruto, desconto: d, total: Math.max(0, bruto - d) }
}

const hoje = () => new Date().toISOString().slice(0, 10)
const dataBR = (iso) => iso.split('-').reverse().join('/')

export default function Vendas({ abrir, items, vendas, onRegistrar, onExcluir }) {
  const vazio = { produtoId: '', qtd: 1, preco: 0, desc: 0, tipo: '%', pagto: pagamentos[0], cliente: '', data: hoje() }
  const [f, setF] = useState(vazio)
  const [erro, setErro] = useState('')
  const [aberto, setAberto] = useState(!!abrir)
  const set = (k, v) => setF((o) => ({ ...o, [k]: v }))

  const prod = items.find((i) => i.id === +f.produtoId)
  const { bruto, desconto, total } = calcTotal(f.preco, f.qtd, f.desc, f.tipo)

  const escolher = (id) => {
    const p = items.find((i) => i.id === +id)
    setF((o) => ({ ...o, produtoId: id, preco: p ? p.preco : 0, qtd: 1 }))
    setErro('')
  }

  const submit = (e) => {
    e.preventDefault()
    if (!prod) return setErro('Selecione um produto.')
    if (f.qtd < 1) return setErro('Quantidade inválida.')
    if (f.qtd > prod.qtd) return setErro(`Estoque insuficiente (${prod.qtd} disponíveis).`)
    onRegistrar({ ...f, produtoId: prod.id, produto: prod.nome, total, desconto, bruto })
    setF({ ...vazio, data: f.data })
    setErro('')
    setAberto(false)
  }

  const faturamento = vendas.reduce((s, v) => s + v.total, 0)
  const descontos = vendas.reduce((s, v) => s + v.desconto, 0)
  const resumo = [
    { l: 'Vendas registradas', v: vendas.length },
    { l: 'Faturamento', v: brl(faturamento) },
    { l: 'Descontos concedidos', v: brl(descontos) },
    { l: 'Ticket médio', v: brl(vendas.length ? faturamento / vendas.length : 0) },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {resumo.map((s) => (
          <div key={s.l} className="glass p-5">
            <div className="text-xl font-extrabold text-[#ffc400] sm:text-2xl">{s.v}</div>
            <div className="text-sm text-white/80">{s.l}</div>
          </div>
        ))}
      </div>

      {aberto && (
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#031438]/60 p-4 backdrop-blur-sm sm:items-center">
      <form onSubmit={submit} className="glass my-auto w-full max-w-2xl p-6">
        <h3 className="mb-4 text-xl font-extrabold">Registrar nova venda</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-white/80 md:col-span-2">
            Produto
            <select className="field normal-case" value={f.produtoId} onChange={(e) => escolher(e.target.value)}>
              <option value="">Selecione...</option>
              {items.map((i) => <option key={i.id} value={i.id} disabled={i.qtd === 0}>{i.nome} — {i.qtd} em estoque</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-white/80">
            Quantidade
            <input type="number" min="1" className="field" value={f.qtd} onChange={(e) => set('qtd', Math.max(0, +e.target.value))} />
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-white/80">
            Valor unitário (R$)
            <input type="number" min="0" step="0.01" className="field" value={f.preco} onChange={(e) => set('preco', Math.max(0, +e.target.value))} />
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-white/80">
            Desconto
            <div className="flex gap-2">
              <input type="number" min="0" step="0.01" className="field w-full" value={f.desc} onChange={(e) => set('desc', Math.max(0, +e.target.value))} />
              <select className="field" value={f.tipo} onChange={(e) => set('tipo', e.target.value)}>
                <option value="%">%</option>
                <option value="R$">R$</option>
              </select>
            </div>
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-white/80">
            Meio de pagamento
            <select className="field normal-case" value={f.pagto} onChange={(e) => set('pagto', e.target.value)}>
              {pagamentos.map((p) => <option key={p}>{p}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-white/80">
            Cliente (opcional)
            <input className="field normal-case" placeholder="Nome do cliente" value={f.cliente} onChange={(e) => set('cliente', e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-white/80">
            Data
            <input type="date" className="field" value={f.data} onChange={(e) => set('data', e.target.value)} />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-white/20 pt-4">
          <div className="flex gap-8 text-sm">
            <div><div className="text-white/70">Subtotal</div><div className="font-bold">{brl(bruto)}</div></div>
            <div><div className="text-white/70">Desconto</div><div className="font-bold text-red-200">- {brl(desconto)}</div></div>
            <div><div className="text-white/70">Total</div><div className="text-2xl font-extrabold text-[#ffc400]">{brl(total)}</div></div>
          </div>
          <div className="flex items-center gap-3">
            {erro && <span className="text-sm font-bold text-red-200">{erro}</span>}
            <button type="button" className="btn" onClick={() => { setAberto(false); setErro('') }}>Cancelar</button>
            <button type="submit" className="btn-sun">Registrar venda</button>
          </div>
        </div>
      </form>
      </div>
      )}

      <section className="glass">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <h3 className="text-lg font-extrabold">Histórico de vendas</h3>
          <button type="button" className="btn-sun flex items-center gap-2" onClick={() => setAberto(true)}><span className="text-lg leading-none">+</span>Registrar Nova Venda</button>
        </div>
        <div className="overflow-x-auto pt-3">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#003a7d]/50 text-xs uppercase tracking-wider text-[#ffc400]">
              <tr>{['Data', 'Produto', 'Cliente', 'Qtd', 'Valor unit.', 'Desconto', 'Pagamento', 'Total', ''].map((h) => <th key={h} className="whitespace-nowrap px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {vendas.length === 0 && <tr><td colSpan="9" className="px-5 py-6 text-center text-white/70">Nenhuma venda registrada.</td></tr>}
              {[...vendas].sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id).map((v) => (
                <tr key={v.id} className="border-t border-white/15 transition hover:bg-white/10">
                  <td className="whitespace-nowrap px-4 py-3">{dataBR(v.data)}</td>
                  <td className="px-4 py-3 font-bold">{v.produto}</td>
                  <td className="px-4 py-3 text-white/80">{v.cliente || '—'}</td>
                  <td className="px-4 py-3">{v.qtd}</td>
                  <td className="whitespace-nowrap px-4 py-3">{brl(v.preco)}</td>
                  <td className="whitespace-nowrap px-4 py-3">{v.desconto ? `- ${brl(v.desconto)}` : '—'}</td>
                  <td className="whitespace-nowrap px-4 py-3">{v.pagto}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-extrabold text-[#ffc400]">{brl(v.total)}</td>
                  <td className="px-4 py-3"><button type="button" className="btn !px-3 !py-1 hover:!bg-red-500/60" onClick={() => onExcluir(v)}>Excluir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
