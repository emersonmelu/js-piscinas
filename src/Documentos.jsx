import { useState } from 'react'

const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const hoje = () => new Date().toISOString().slice(0, 10)
const dataBR = (iso) => (iso ? iso.split('-').reverse().join('/') : '—')
const impostos = ['DAS (Simples Nacional)', 'ICMS', 'ISS', 'PIS/COFINS', 'FGTS', 'INSS', 'IRPJ', 'Outro']
const pagamentos = ['Pix', 'Boleto', 'Transferência', 'Débito em conta', 'Cartão de Crédito']

export const statusDe = (d) => (d.pagoEm ? 'Pago' : d.vencimento < hoje() ? 'Vencido' : 'Pendente')
const statusCor = {
  Pago: 'bg-emerald-400/20 text-emerald-200 border-emerald-300/50',
  Vencido: 'bg-red-500/25 text-red-200 border-red-300/50',
  Pendente: 'bg-[#ffc400]/25 text-[#ffe27a] border-[#ffc400]/50',
}

function baixar(d) {
  let url = d.url
  let temp = false
  if (!url) {
    const txt = `${d.imposto}\nCompetência: ${d.competencia}\nVencimento: ${dataBR(d.vencimento)}\nValor: ${brl(d.valor)}\n\n(Documento de exemplo)`
    url = URL.createObjectURL(new Blob([txt], { type: 'text/plain' }))
    temp = true
  }
  const a = document.createElement('a')
  a.href = url
  a.download = d.arquivo || `${d.imposto}.txt`
  a.click()
  if (temp) setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function Overlay({ children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#031438]/60 p-4 backdrop-blur-sm sm:items-center">
      {children}
    </div>
  )
}
const Lbl = ({ t, children, cls = '' }) => (
  <label className={`flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-white/80 ${cls}`}>{t}{children}</label>
)

function Anexar({ onSave, onClose }) {
  const [f, setF] = useState({ imposto: impostos[0], competencia: hoje().slice(0, 7), vencimento: hoje(), valor: 0, obs: '' })
  const [file, setFile] = useState(null)
  const [erro, setErro] = useState('')
  const set = (k, v) => setF({ ...f, [k]: v })
  const submit = (e) => {
    e.preventDefault()
    if (!file) return setErro('Anexe o arquivo do documento.')
    if (!(f.valor > 0)) return setErro('Informe o valor a pagar.')
    onSave({ ...f, arquivo: file.name, url: URL.createObjectURL(file), anexadoEm: hoje() })
  }
  return (
    <Overlay>
      <form onSubmit={submit} className="glass my-auto w-full max-w-xl p-6">
        <h3 className="mb-4 text-xl font-extrabold">Anexar documento de imposto</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Lbl t="Imposto / Guia" cls="md:col-span-2">
            <select className="field normal-case" value={f.imposto} onChange={(e) => set('imposto', e.target.value)}>{impostos.map((i) => <option key={i}>{i}</option>)}</select>
          </Lbl>
          <Lbl t="Competência"><input type="month" className="field" value={f.competencia} onChange={(e) => set('competencia', e.target.value)} /></Lbl>
          <Lbl t="Vencimento"><input type="date" className="field" value={f.vencimento} onChange={(e) => set('vencimento', e.target.value)} /></Lbl>
          <Lbl t="Valor (R$)"><input type="number" min="0" step="0.01" className="field" value={f.valor} onChange={(e) => set('valor', +e.target.value)} /></Lbl>
          <Lbl t="Arquivo (PDF, imagem...)">
            <input type="file" className="field normal-case file:mr-3 file:rounded-md file:border-0 file:bg-white/20 file:px-3 file:py-1 file:text-white" onChange={(e) => setFile(e.target.files[0])} />
          </Lbl>
          <Lbl t="Observações" cls="md:col-span-2"><input className="field normal-case" placeholder="Opcional" value={f.obs} onChange={(e) => set('obs', e.target.value)} /></Lbl>
        </div>
        <div className="mt-5 flex items-center justify-end gap-3">
          {erro && <span className="mr-auto text-sm font-bold text-red-200">{erro}</span>}
          <button type="button" className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn-sun">Anexar</button>
        </div>
      </form>
    </Overlay>
  )
}

function Pagar({ doc, onSave, onClose }) {
  const [f, setF] = useState({ pagoEm: hoje(), pagto: pagamentos[0] })
  const [file, setFile] = useState(null)
  const submit = (e) => {
    e.preventDefault()
    onSave({ ...f, comprovante: file ? file.name : null, comprovanteUrl: file ? URL.createObjectURL(file) : null })
  }
  return (
    <Overlay>
      <form onSubmit={submit} className="glass my-auto w-full max-w-md p-6">
        <h3 className="mb-1 text-xl font-extrabold">Informar pagamento</h3>
        <p className="mb-4 text-sm text-white/80">{doc.imposto} · {brl(doc.valor)}</p>
        <div className="flex flex-col gap-4">
          <Lbl t="Data do pagamento"><input type="date" className="field" value={f.pagoEm} onChange={(e) => setF({ ...f, pagoEm: e.target.value })} required /></Lbl>
          <Lbl t="Meio de pagamento">
            <select className="field normal-case" value={f.pagto} onChange={(e) => setF({ ...f, pagto: e.target.value })}>{pagamentos.map((p) => <option key={p}>{p}</option>)}</select>
          </Lbl>
          <Lbl t="Comprovante (opcional)">
            <input type="file" className="field normal-case file:mr-3 file:rounded-md file:border-0 file:bg-white/20 file:px-3 file:py-1 file:text-white" onChange={(e) => setFile(e.target.files[0])} />
          </Lbl>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn-sun">Confirmar pagamento</button>
        </div>
      </form>
    </Overlay>
  )
}

export default function Documentos({ abrir, docs, setDocs }) {
  const [perfil, setPerfil] = useState('contador')
  const [filtro, setFiltro] = useState('Todos')
  const [anexando, setAnexando] = useState(!!abrir)
  const [pagando, setPagando] = useState(null)

  const com = docs.map((d) => ({ ...d, status: statusDe(d) }))
  const lista = com.filter((d) => filtro === 'Todos' || d.status === filtro + (filtro.endsWith('s') ? '' : '')).sort((a, b) => a.vencimento.localeCompare(b.vencimento))
  const soma = (st) => com.filter((d) => d.status === st).reduce((s, d) => s + d.valor, 0)
  const cont = (st) => com.filter((d) => d.status === st).length
  const resumo = [
    { l: 'Pendentes', v: cont('Pendente'), s: brl(soma('Pendente')) },
    { l: 'Vencidos', v: cont('Vencido'), s: brl(soma('Vencido')) },
    { l: 'Pagos', v: cont('Pago'), s: brl(soma('Pago')) },
    { l: 'Total a pagar', v: brl(soma('Pendente') + soma('Vencido')), s: 'pendentes + vencidos' },
  ]
  const filtros = [['Todos', 'Todos'], ['Pendente', 'Pendentes'], ['Vencido', 'Vencidos'], ['Pago', 'Pagos']]
  const isContador = perfil === 'contador'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {resumo.map((s) => (
          <div key={s.l} className="glass p-5">
            <div className="text-xl font-extrabold text-[#ffc400] sm:text-2xl">{s.v}</div>
            <div className="text-sm font-bold">{s.l}</div>
            <div className="text-xs text-white/70">{s.s}</div>
          </div>
        ))}
      </div>

      <section className="glass">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <div className="flex flex-wrap gap-2">
            {filtros.map(([k, l]) => (
              <button key={k} onClick={() => setFiltro(k)} className={`btn !px-3 !py-1 ${filtro === k ? '!border-0 !bg-gradient-to-r !from-[#ffc400] !to-[#f28c1b] !text-[#003a7d]' : ''}`}>{l}</button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex overflow-hidden rounded-lg border border-white/30 text-xs font-bold">
              {[['contador', 'Contador'], ['loja', 'Loja']].map(([k, l]) => (
                <button key={k} onClick={() => setPerfil(k)} className={`px-3 py-2 transition ${perfil === k ? 'bg-white/90 text-[#005bbe]' : 'hover:bg-white/15'}`}>{l}</button>
              ))}
            </div>
            {isContador && <button className="btn-sun flex items-center gap-2" onClick={() => setAnexando(true)}><span className="text-lg leading-none">+</span>Anexar Documento</button>}
          </div>
        </div>
        <div className="overflow-x-auto pt-3">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#003a7d]/50 text-xs uppercase tracking-wider text-[#ffc400]">
              <tr>{['Imposto', 'Competência', 'Vencimento', 'Valor', 'Status', 'Pagamento', 'Ações'].map((h) => <th key={h} className="whitespace-nowrap px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {lista.length === 0 && <tr><td colSpan="7" className="px-5 py-6 text-center text-white/70">Nenhum documento.</td></tr>}
              {lista.map((d) => (
                <tr key={d.id} className="border-t border-white/15 transition hover:bg-white/10">
                  <td className="px-4 py-3"><div className="font-bold">{d.imposto}</div><div className="text-xs text-white/70">{d.arquivo}</div></td>
                  <td className="whitespace-nowrap px-4 py-3">{d.competencia.split('-').reverse().join('/')}</td>
                  <td className="whitespace-nowrap px-4 py-3">{dataBR(d.vencimento)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-extrabold text-[#ffc400]">{brl(d.valor)}</td>
                  <td className="px-4 py-3"><span className={`rounded-md border px-2.5 py-0.5 text-xs font-bold ${statusCor[d.status]}`}>{d.status}</span></td>
                  <td className="whitespace-nowrap px-4 py-3 text-white/80">{d.pagoEm ? `${dataBR(d.pagoEm)} · ${d.pagto}` : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button className="btn !px-3 !py-1" onClick={() => baixar(d)}>Baixar</button>
                      {!isContador && !d.pagoEm && <button className="btn-sun !px-3 !py-1" onClick={() => setPagando(d)}>Informar pagamento</button>}
                      {d.comprovanteUrl && <a className="btn !px-3 !py-1" href={d.comprovanteUrl} download={d.comprovante}>Comprovante</a>}
                      {isContador && <button className="btn !px-3 !py-1 hover:!bg-red-500/60" onClick={() => window.confirm('Excluir documento?') && setDocs(docs.filter((x) => x.id !== d.id))}>Excluir</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {anexando && <Anexar onClose={() => setAnexando(false)} onSave={(d) => { setDocs([...docs, { ...d, id: Math.max(0, ...docs.map((x) => x.id)) + 1 }]); setAnexando(false) }} />}
      {pagando && <Pagar doc={pagando} onClose={() => setPagando(null)} onSave={(p) => { setDocs(docs.map((x) => (x.id === pagando.id ? { ...x, ...p } : x))); setPagando(null) }} />}
    </div>
  )
}
