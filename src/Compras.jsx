import { useState } from 'react'

const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const pct = (v) => `${(isFinite(v) ? v : 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`
const hoje = () => new Date().toISOString().slice(0, 10)
const dataBR = (iso) => iso.split('-').reverse().join('/')

/**
 * Fórmulas de precificação
 *   Imposto unitário   = imposto por unidade (R$)  |  imposto total da nota ÷ quantidade  |  valor do produto × (% / 100)
 *   Frete unitário     = frete total ÷ quantidade
 *   Custo unitário     = valor do produto + imposto unitário + frete unitário
 *   Preço (Markup)     = custo × (1 + lucro% / 100)
 *   Preço (Margem)     = custo ÷ (1 − lucro% / 100)
 *   Lucro unitário     = preço de venda − custo
 */
export function calcular({ produto, imposto, tipoImp, escopoImp, frete, qtd, lucro, modo }) {
  const q = Math.max(1, qtd)
  const impostoUn = tipoImp === '%' ? produto * (imposto / 100) : escopoImp === 'total' ? imposto / q : imposto
  const freteUn = frete / q
  const custo = produto + impostoUn + freteUn
  const preco = modo === 'markup' ? custo * (1 + lucro / 100) : lucro >= 100 ? NaN : custo / (1 - lucro / 100)
  const lucroUn = preco - custo
  return { impostoUn, freteUn, custo, preco, lucroUn, lucroTotal: lucroUn * q, custoTotal: custo * q, q }
}

const Lbl = ({ t, children, cls = '' }) => (
  <label className={`flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-white/80 ${cls}`}>{t}{children}</label>
)

export default function Compras({ items, compras, onRegistrar, onExcluir }) {
  const [f, setF] = useState({ produtoId: '', qtd: 1, produto: 0, imposto: 0, tipoImp: 'R$', escopoImp: 'unidade', frete: 0, lucro: 30, modo: 'markup', atualizar: true })
  const [msg, setMsg] = useState('')
  const set = (k, v) => { setF((o) => ({ ...o, [k]: v })); setMsg('') }
  const num = (k) => (e) => set(k, Math.max(0, +e.target.value))
  const r = calcular(f)
  const prod = items.find((i) => i.id === +f.produtoId)
  const valido = isFinite(r.preco) && f.produto > 0

  const registrar = () => {
    if (!prod) return setMsg('Selecione o produto comprado para registrar.')
    if (!valido) return setMsg('Verifique os valores informados.')
    onRegistrar({ ...f, produtoId: prod.id, nome: prod.nome, data: hoje(), custo: r.custo, preco: r.preco, total: r.custoTotal })
    setMsg('Compra registrada e estoque atualizado.')
  }

  const totalInvestido = compras.reduce((s, c) => s + c.total, 0)
  const nums = [
    { l: 'Compras registradas', v: compras.length },
    { l: 'Total investido', v: brl(totalInvestido) },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {nums.map((s) => (
          <div key={s.l} className="glass p-5">
            <div className="text-xl font-extrabold text-[#ffc400] sm:text-2xl">{s.v}</div>
            <div className="text-sm text-white/80">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <section className="glass p-5 xl:col-span-3">
          <h3 className="mb-4 text-lg font-extrabold">Dados da compra</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Lbl t="Produto (opcional para simular)" cls="md:col-span-2">
              <select className="field normal-case" value={f.produtoId} onChange={(e) => set('produtoId', e.target.value)}>
                <option value="">Somente simular</option>
                {items.map((i) => <option key={i.id} value={i.id}>{i.nome} — venda atual {brl(i.preco)}</option>)}
              </select>
            </Lbl>
            <Lbl t="Quantidade comprada"><input type="number" min="1" className="field" value={f.qtd} onChange={(e) => set('qtd', Math.max(1, +e.target.value))} /></Lbl>
            <Lbl t="Valor do produto - unitário (R$)"><input type="number" min="0" step="0.01" className="field" value={f.produto} onChange={num('produto')} /></Lbl>
            <Lbl t={f.tipoImp === '%' ? 'Imposto (% sobre o produto)' : f.escopoImp === 'total' ? 'Imposto total da nota (R$)' : 'Imposto por unidade (R$)'}>
              <div className="flex gap-2">
                <input type="number" min="0" step="0.01" className="field w-full" value={f.imposto} onChange={num('imposto')} />
                <select className="field" value={f.tipoImp} onChange={(e) => set('tipoImp', e.target.value)}><option>R$</option><option>%</option></select>
              </div>
              {f.tipoImp === 'R$' && (
                <div className="mt-1 flex overflow-hidden rounded-lg border border-white/30 text-xs font-bold normal-case tracking-normal">
                  {[['unidade', 'Por unidade'], ['total', 'Total da nota']].map(([k, l]) => (
                    <button type="button" key={k} onClick={() => set('escopoImp', k)} className={`flex-1 px-3 py-1.5 transition ${f.escopoImp === k ? 'bg-white/90 text-[#005bbe]' : 'hover:bg-white/15'}`}>{l}</button>
                  ))}
                </div>
              )}
            </Lbl>
            <Lbl t="Frete total da compra (R$)"><input type="number" min="0" step="0.01" className="field" value={f.frete} onChange={num('frete')} /></Lbl>
            <Lbl t="Lucro desejado (%)"><input type="number" min="0" step="0.5" className="field" value={f.lucro} onChange={num('lucro')} /></Lbl>
            <Lbl t="Base do cálculo do lucro" cls="md:col-span-2">
              <div className="flex overflow-hidden rounded-lg border border-white/30 text-sm font-bold normal-case tracking-normal">
                {[['markup', 'Markup (sobre o custo)'], ['margem', 'Margem (sobre o preço de venda)']].map(([k, l]) => (
                  <button type="button" key={k} onClick={() => set('modo', k)} className={`flex-1 px-3 py-2 transition ${f.modo === k ? 'bg-gradient-to-r from-[#ffc400] to-[#f28c1b] text-[#003a7d]' : 'hover:bg-white/15'}`}>{l}</button>
                ))}
              </div>
            </Lbl>
          </div>

          <div className="mt-5 rounded-xl border border-white/20 bg-[#003a7d]/40 p-4 text-xs leading-relaxed text-white/80">
            <div className="mb-1 font-bold uppercase tracking-wide text-[#ffc400]">Fórmula utilizada</div>
            <div>Imposto unitário = {f.tipoImp === '%' ? 'produto × (% ÷ 100)' : f.escopoImp === 'total' ? 'imposto total da nota ÷ quantidade' : 'valor informado por unidade'}</div>
            <div>Custo unitário = produto + imposto unitário + (frete ÷ quantidade)</div>
            <div>{f.modo === 'markup' ? 'Preço de venda = custo × (1 + lucro% ÷ 100)' : 'Preço de venda = custo ÷ (1 − lucro% ÷ 100)'}</div>
          </div>
        </section>

        <section className="glass flex flex-col p-5 xl:col-span-2">
          <h3 className="mb-4 text-lg font-extrabold">Resultado da precificação</h3>
          <dl className="space-y-3 text-sm">
            {[
              ['Valor do produto', brl(f.produto)],
              ['+ Imposto unitário', brl(r.impostoUn)],
              ['+ Frete rateado por unidade', brl(r.freteUn)],
            ].map(([k, v]) => <div key={k} className="flex justify-between"><dt className="text-white/80">{k}</dt><dd className="font-bold">{v}</dd></div>)}
            <div className="flex justify-between border-t border-white/20 pt-3"><dt className="font-bold">Custo unitário</dt><dd className="font-extrabold">{brl(r.custo)}</dd></div>
          </dl>
          <div className="my-5 rounded-xl border border-[#ffc400]/50 bg-[#ffc400]/10 p-4 text-center">
            <div className="text-xs font-bold uppercase tracking-wide text-white/80">Preço de venda sugerido</div>
            <div className="text-4xl font-extrabold text-[#ffc400]">{isFinite(r.preco) ? brl(r.preco) : '—'}</div>
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-white/80">Lucro por unidade</dt><dd className="font-bold">{isFinite(r.preco) ? brl(r.lucroUn) : '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-white/80">Lucro total ({r.q} un.)</dt><dd className="font-bold">{isFinite(r.preco) ? brl(r.lucroTotal) : '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-white/80">Custo total da compra</dt><dd className="font-bold">{brl(r.custoTotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-white/80">{f.modo === 'markup' ? 'Margem equivalente' : 'Markup equivalente'}</dt>
              <dd className="font-bold">{isFinite(r.preco) && r.custo > 0 ? pct(f.modo === 'markup' ? (r.lucroUn / r.preco) * 100 : (r.lucroUn / r.custo) * 100) : '—'}</dd></div>
          </dl>

          <div className="mt-auto space-y-3 pt-5">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-[#ffc400]" checked={f.atualizar} onChange={(e) => set('atualizar', e.target.checked)} />Atualizar preço de venda do produto</label>
            <button className="btn-sun w-full" onClick={registrar}>Registrar compra</button>
            {msg && <p className="text-center text-sm font-bold text-[#ffe27a]">{msg}</p>}
          </div>
        </section>
      </div>

      <section className="glass">
        <h3 className="px-5 pt-5 text-lg font-extrabold">Histórico de compras</h3>
        <div className="overflow-x-auto pt-3">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#003a7d]/50 text-xs uppercase tracking-wider text-[#ffc400]">
              <tr>{['Data', 'Produto', 'Qtd', 'Custo unit.', 'Lucro', 'Preço de venda', 'Total', ''].map((h) => <th key={h} className="whitespace-nowrap px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {compras.length === 0 && <tr><td colSpan="8" className="px-5 py-6 text-center text-white/70">Nenhuma compra registrada.</td></tr>}
              {[...compras].reverse().map((c) => (
                <tr key={c.id} className="border-t border-white/15 transition hover:bg-white/10">
                  <td className="whitespace-nowrap px-4 py-3">{dataBR(c.data)}</td>
                  <td className="px-4 py-3 font-bold">{c.nome}</td>
                  <td className="px-4 py-3">{c.qtd}</td>
                  <td className="whitespace-nowrap px-4 py-3">{brl(c.custo)}</td>
                  <td className="whitespace-nowrap px-4 py-3">{pct(c.lucro)} <span className="text-xs text-white/60">({c.modo})</span></td>
                  <td className="whitespace-nowrap px-4 py-3 font-extrabold text-[#ffc400]">{brl(c.preco)}</td>
                  <td className="whitespace-nowrap px-4 py-3">{brl(c.total)}</td>
                  <td className="px-4 py-3"><button className="btn !px-3 !py-1 hover:!bg-red-500/60" onClick={() => onExcluir(c)}>Excluir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
