import { useState, useMemo } from 'react'
import Vendas from './Vendas.jsx'
import Documentos from './Documentos.jsx'
import Compras from './Compras.jsx'
import Login from './Login.jsx'

const initial = [
  { id: 1, nome: 'Cloro Granulado 10kg', categoria: 'Químicos', qtd: 42, preco: 289.9, desc: 'Cloro estabilizado de dissolução rápida para tratamento da água.' },
  { id: 2, nome: 'Bomba Filtrante 1/2 CV', categoria: 'Equipamentos', qtd: 8, preco: 1249.0, desc: 'Motobomba silenciosa e econômica para piscinas até 40 mil litros.' },
  { id: 3, nome: 'Rede de Limpeza com Cabo Telescópico', categoria: 'Limpeza', qtd: 23, preco: 119.5, desc: 'Rede de malha fina com cabo de alumínio ajustável até 3,6 m.' },
  { id: 4, nome: 'Kit Teste de pH/Cloro', categoria: 'Químicos', qtd: 3, preco: 49.9, desc: 'Medição precisa de pH e cloro em segundos, com 150 testes.' },
  { id: 5, nome: 'Flutuador Químico', categoria: 'Químicos', qtd: 60, preco: 34.9, desc: 'Dosador flutuante para pastilhas de cloro, liberação gradual.' },
  { id: 6, nome: 'Aspirador Manual de Piscina', categoria: 'Limpeza', qtd: 14, preco: 159.0, desc: 'Cabeça de aspiração com escovas para fundo e bordas.' },
]

const paths = {
  dashboard: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  catalogo: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  estoque: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  money: '<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  compras: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  documentos: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  vendas: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  Químicos: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
  Equipamentos: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  Limpeza: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
}
const Icon = ({ n, className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className} dangerouslySetInnerHTML={{ __html: paths[n] }} />
)

const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const cats = ['Químicos', 'Equipamentos', 'Limpeza']
const catColor = {
  Químicos: 'bg-[#ffc400]/25 text-[#ffe27a] border-[#ffc400]/50',
  Equipamentos: 'bg-sky-300/20 text-sky-100 border-sky-200/50',
  Limpeza: 'bg-[#f28c1b]/25 text-[#ffc88a] border-[#f28c1b]/50',
}
const Tag = ({ c }) => (
  <span className={`w-fit rounded-md border px-2.5 py-0.5 text-xs font-bold ${catColor[c]}`}>{c}</span>
)

const menu = [
  { k: 'dashboard', l: 'Dashboard', i: 'dashboard' },
  { k: 'vendas', l: 'Vendas', i: 'vendas' },
  { k: 'catalogo', l: 'Catálogo', i: 'catalogo' },
  { k: 'estoque', l: 'Estoque', i: 'estoque' },
  { k: 'compras', l: 'Compras', i: 'compras' },
  { k: 'documentos', l: 'Documentos', i: 'documentos' },
]

function Modal({ item, onSave, onClose }) {
  const [f, setF] = useState(item || { nome: '', categoria: 'Químicos', qtd: 0, preco: 0, desc: '' })
  const set = (k, v) => setF({ ...f, [k]: v })
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#031438]/60 p-4 backdrop-blur-sm">
      <div className="glass w-full max-w-md p-6">
        <h3 className="mb-4 text-xl font-extrabold">{item ? 'Editar Produto' : 'Novo Produto'}</h3>
        <div className="flex flex-col gap-3">
          <input className="field" placeholder="Nome" value={f.nome} onChange={(e) => set('nome', e.target.value)} />
          <input className="field" placeholder="Descrição" value={f.desc} onChange={(e) => set('desc', e.target.value)} />
          <select className="field" value={f.categoria} onChange={(e) => set('categoria', e.target.value)}>
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" min="0" className="field" placeholder="Qtd" value={f.qtd} onChange={(e) => set('qtd', +e.target.value)} />
            <input type="number" min="0" step="0.01" className="field" placeholder="Preço" value={f.preco} onChange={(e) => set('preco', +e.target.value)} />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <button className="btn" onClick={onClose}>Cancelar</button>
            <button className="btn-sun" onClick={() => f.nome && onSave(f)}>Salvar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ items, onAction }) {
  const total = items.reduce((s, i) => s + i.qtd * i.preco, 0)
  const unidades = items.reduce((s, i) => s + i.qtd, 0)
  const baixos = items.filter((i) => i.qtd <= 5)
  const porCat = cats.map((c) => ({ c, v: items.filter((i) => i.categoria === c).reduce((s, i) => s + i.qtd * i.preco, 0) }))
  const max = Math.max(1, ...porCat.map((x) => x.v))
  const stats = [
    { l: 'Produtos cadastrados', v: items.length, i: 'estoque' },
    { l: 'Unidades em estoque', v: unidades, i: 'layers' },
    { l: 'Valor total em estoque', v: brl(total), i: 'money' },
    { l: 'Itens com estoque baixo', v: baixos.length, i: 'alert' },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/80">Ações rápidas</h3>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {[
            ['venda', 'Nova Venda', 'Registrar uma venda', 'vendas'],
            ['produto', 'Novo Produto', 'Cadastrar no estoque', 'estoque'],
            ['compra', 'Nova Compra', 'Calcular precificação', 'compras'],
            ['documento', 'Anexar Documento', 'Impostos e guias', 'documentos'],
          ].map(([k, t, d, ic]) => (
            <button key={k} onClick={() => onAction(k)}
              className="glass group flex items-center gap-3 p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-[#ffc400]/70 active:scale-95">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffc400] to-[#f28c1b] text-[#003a7d] shadow-lg"><Icon n={ic} /></span>
              <span className="min-w-0"><span className="block font-extrabold leading-tight">{t}</span><span className="block text-xs text-white/70">{d}</span></span>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="glass p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 bg-white/15"><Icon n={s.i} /></div>
            <div className="mt-2 text-2xl font-extrabold text-[#ffc400]">{s.v}</div>
            <div className="text-sm text-white/80">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass p-5">
          <h3 className="mb-4 font-extrabold">Valor em estoque por categoria</h3>
          <div className="space-y-4">
            {porCat.map((x) => (
              <div key={x.c}>
                <div className="mb-1 flex justify-between text-sm"><span>{x.c}</span><span className="font-bold">{brl(x.v)}</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-[#003a7d]/50">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#ffc400] to-[#f28c1b]" style={{ width: `${(x.v / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass p-5">
          <h3 className="mb-4 flex items-center gap-2 font-extrabold"><Icon n="alert" className="h-5 w-5 text-[#ffc400]" />Reposição necessária</h3>
          {baixos.length === 0 ? <p className="text-sm text-white/70">Tudo em dia.</p> : (
            <ul className="space-y-2">
              {baixos.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-lg border border-white/20 bg-[#003a7d]/40 px-4 py-2 text-sm">
                  <span className="font-semibold">{p.nome}</span>
                  <span className="rounded-md bg-red-500/80 px-2 py-0.5 font-bold">{p.qtd} un.</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [items, setItems] = useState(initial)
  const [tab, setTab] = useState('dashboard')
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState(null)
  const [open, setOpen] = useState(false) // controle mobile
  const [collapsed, setCollapsed] = useState(false) // controle desktop/tablet
  const [acao, setAcao] = useState(null)
  const irPara = (k) => { setTab(k); setAcao(null); setBusca('') }
  const acaoRapida = (a) => {
    setBusca('')
    if (a === 'venda') { setTab('vendas'); setAcao('venda') }
    if (a === 'produto') { setTab('estoque'); setAcao(null); setModal('new') }
    if (a === 'compra') { setTab('compras'); setAcao(null) }
    if (a === 'documento') { setTab('documentos'); setAcao('documento') }
  }

  const [vendas, setVendas] = useState([
    { id: 1, data: '2026-10-13', produtoId: 1, produto: 'Cloro Granulado 10kg', cliente: 'Carlos Mendes', qtd: 2, preco: 289.9, desc: 10, tipo: '%', bruto: 579.8, desconto: 57.98, total: 521.82, pagto: 'Pix' },
    { id: 2, data: '2026-10-14', produtoId: 2, produto: 'Bomba Filtrante 1/2 CV', cliente: 'Ana Souza', qtd: 1, preco: 1249, desc: 50, tipo: 'R$', bruto: 1249, desconto: 50, total: 1199, pagto: 'Cartão de Crédito' },
  ])
  const [docs, setDocs] = useState([
    { id: 1, imposto: 'DAS (Simples Nacional)', competencia: '2026-09', vencimento: '2026-10-20', valor: 1842.35, arquivo: 'DAS-092026.pdf', obs: '' },
    { id: 2, imposto: 'FGTS', competencia: '2026-09', vencimento: '2026-10-07', valor: 612.4, arquivo: 'FGTS-092026.pdf', obs: '' },
    { id: 3, imposto: 'ICMS', competencia: '2026-08', vencimento: '2026-09-15', valor: 934.8, arquivo: 'ICMS-082026.pdf', obs: '', pagoEm: '2026-09-14', pagto: 'Pix' },
  ])
  const [compras, setCompras] = useState([])
  const registrarCompra = (c) => {
    setCompras([...compras, { ...c, id: Math.max(0, ...compras.map((x) => x.id)) + 1 }])
    setItems(items.map((i) => (i.id === c.produtoId ? { ...i, qtd: i.qtd + c.qtd, preco: c.atualizar ? Math.round(c.preco * 100) / 100 : i.preco } : i)))
  }
  const excluirCompra = (c) => {
    if (!window.confirm('Excluir esta compra? As unidades saem do estoque.')) return
    setCompras(compras.filter((x) => x.id !== c.id))
    setItems(items.map((i) => (i.id === c.produtoId ? { ...i, qtd: Math.max(0, i.qtd - c.qtd) } : i)))
  }
  const registrar = (v) => {
    setVendas([...vendas, { ...v, id: Math.max(0, ...vendas.map((x) => x.id)) + 1 }])
    setItems(items.map((i) => (i.id === v.produtoId ? { ...i, qtd: i.qtd - v.qtd } : i)))
  }
  const excluirVenda = (v) => {
    if (!window.confirm('Excluir esta venda? A quantidade volta ao estoque.')) return
    setVendas(vendas.filter((x) => x.id !== v.id))
    setItems(items.map((i) => (i.id === v.produtoId ? { ...i, qtd: i.qtd + v.qtd } : i)))
  }

  const filtrados = useMemo(
    () => items.filter((i) => i.nome.toLowerCase().includes(busca.toLowerCase())),
    [items, busca]
  )
  const save = (f) => {
    if (f.id) setItems(items.map((i) => (i.id === f.id ? f : i)))
    else setItems([...items, { ...f, id: Math.max(0, ...items.map((i) => i.id)) + 1 }])
    setModal(null)
  }
  const remove = (id) => window.confirm('Excluir este produto?') && setItems(items.filter((i) => i.id !== id))
  const repor = (id) => setItems(items.map((i) => (i.id === id ? { ...i, qtd: i.qtd + 10 } : i)))
  const title = menu.find((m) => m.k === tab).l

  if (!isAuthenticated) {
    return (
      <Login
        onLogin={(userData) => {
          setUser(userData)
          setIsAuthenticated(true)
        }}
      />
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* OVERLAY ESCURO PARA MOBILE QUANDO MENU ABERTO */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-[#021028]/70 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MENU LATERAL RESPONSIVO COM SUPORTE A MINIMIZAR */}
      <aside
        style={{
          background: 'linear-gradient(180deg, #005bbe 0%, #004a9c 45%, #00306b 100%)',
          boxShadow: '0 10px 40px rgba(3,20,60,0.45), inset 0 1px 0 rgba(255,255,255,0.3)',
        }}
        className={`fixed inset-y-0 left-0 z-40 m-3 flex flex-col overflow-hidden rounded-2xl border border-white/20 transition-all duration-300 ${
          collapsed ? 'w-20 p-2.5' : 'w-64 p-4'
        } ${open ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'}`}
      >
        {/* CABEÇALHO DA SIDEBAR COM LOGO COMPACTA E BOTÃO DE MINIMIZAR */}
        <div className="mb-4 flex items-center justify-between gap-2 border-b border-white/10 pb-3">
          {!collapsed ? (
            <div className="flex items-center gap-2 overflow-hidden px-1">
              <img
                src="/logo.png"
                alt="JS Piscinas"
                className="h-10 w-auto max-w-[140px] object-contain drop-shadow-[0_4px_8px_rgba(0,20,60,0.4)]"
              />
            </div>
          ) : (
            <div className="mx-auto flex h-10 w-10 items-center justify-center">
              <img
                src="/logo.png"
                alt="JS Piscinas"
                className="h-8 w-8 object-contain drop-shadow"
              />
            </div>
          )}

          {/* BOTÃO PARA MINIMIZAR / EXPANDIR SIDEBAR (DESKTOP E MOBILE) */}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                setOpen(false)
              } else {
                setCollapsed(!collapsed)
              }
            }}
            title={collapsed ? 'Expandir menu lateral' : 'Minimizar menu lateral'}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white/80 transition hover:bg-white/25 hover:text-white"
          >
            <svg
              className={`h-4 w-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* NAVEGAÇÃO DE ITENS */}
        <nav className="flex flex-col gap-1.5">
          {menu.map((m) => {
            const active = tab === m.k
            return (
              <button
                key={m.k}
                onClick={() => {
                  irPara(m.k)
                  setOpen(false)
                }}
                title={collapsed ? m.l : undefined}
                className={`flex items-center rounded-xl font-bold transition ${
                  collapsed ? 'justify-center p-3' : 'gap-3 px-3.5 py-2.5 text-left'
                } ${
                  active
                    ? 'bg-gradient-to-r from-[#ffc400] to-[#f28c1b] text-[#003a7d] shadow-lg'
                    : 'text-white/90 hover:bg-white/15 hover:text-white'
                }`}
              >
                <Icon n={m.i} className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate text-sm">{m.l}</span>}
              </button>
            )
          })}
        </nav>

        {/* RODAPÉ DO MENU LATERAL */}
        <div className="mt-auto pt-3 flex flex-col gap-2 border-t border-white/10">
          {!collapsed && user?.email && (
            <p className="text-center text-[11px] text-cyan-200/80 truncate px-1">
              Sessão: {user.email}
            </p>
          )}

          <button
            onClick={() => setIsAuthenticated(false)}
            title="Terminar Sessão"
            className={`flex items-center justify-center rounded-xl border border-white/20 bg-white/10 text-xs font-bold text-white transition hover:bg-red-500/40 ${
              collapsed ? 'p-2.5' : 'gap-2 px-3 py-2'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!collapsed && <span>Terminar Sessão</span>}
          </button>

          {!collapsed && (
            <p className="text-center text-[10px] text-white/50">Sistema de gestão · JS Piscinas</p>
          )}
        </div>
      </aside>

      {/* ÁREA PRINCIPAL COM MARGEM DINÂMICA CONFORME SIDEBAR MINIMIZADA */}
      <main className={`w-full p-4 transition-all duration-300 lg:p-8 ${collapsed ? 'lg:ml-24' : 'lg:ml-72'}`}>
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* BOTÃO MOBILE PARA ABRIR MENU */}
            <button
              className="btn lg:hidden flex items-center gap-1.5"
              onClick={() => setOpen(true)}
              title="Abrir menu"
            >
              <Icon n="menu" />
              <span className="text-xs">Menu</span>
            </button>

            {/* BOTÃO DESKTOP PARA ALTERNAR MINIMIZAÇÃO */}
            <button
              className="btn hidden lg:flex items-center gap-1.5 !px-2.5 !py-2"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'Expandir menu lateral' : 'Minimizar menu lateral'}
            >
              <svg
                className={`h-4 w-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </button>

            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          </div>

          {(tab === 'catalogo' || tab === 'estoque') && (
            <div className="flex flex-wrap gap-3">
              <div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/70"><Icon n="search" className="h-4 w-4" /></span><input className="field !pl-9 w-full" placeholder="Buscar produto..." value={busca} onChange={(e) => setBusca(e.target.value)} /></div>
              <button className="btn-sun flex items-center gap-2" onClick={() => setModal('new')}><Icon n="plus" className="h-4 w-4" />Adicionar Novo Produto</button>
            </div>
          )}
        </header>

        {tab === 'dashboard' && <Dashboard items={items} onAction={acaoRapida} />}

        {tab === 'documentos' && <Documentos abrir={acao === 'documento'} docs={docs} setDocs={setDocs} />}

        {tab === 'compras' && <Compras items={items} compras={compras} onRegistrar={registrarCompra} onExcluir={excluirCompra} />}

        {tab === 'vendas' && <Vendas abrir={acao === 'venda'} items={items} vendas={vendas} onRegistrar={registrar} onExcluir={excluirVenda} />}

        {tab === 'catalogo' && (
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtrados.map((p) => (
              <article key={p.id} className="glass flex flex-col p-5 transition duration-300 hover:-translate-y-1 hover:border-[#ffc400]/60">
                <div className="mb-3 flex h-24 items-center justify-center rounded-xl border border-white/20 bg-[#003a7d]/40 text-white/90"><Icon n={p.categoria} className="h-12 w-12" /></div>
                <Tag c={p.categoria} />
                <h3 className="mt-2 text-lg font-extrabold leading-tight">{p.nome}</h3>
                <p className="mt-1 flex-1 text-sm text-white/75">{p.desc}</p>
                <div className="mt-4 flex items-end justify-between gap-2">
                  <div>
                    <div className="text-2xl font-extrabold text-[#ffc400]">{brl(p.preco)}</div>
                    <div className={`text-xs font-bold ${p.qtd <= 5 ? 'text-red-300' : 'text-white/70'}`}>{p.qtd} disponíveis</div>
                  </div>
                  <button className="btn" onClick={() => setModal(p)}>Editar</button>
                </div>
              </article>
            ))}
          </section>
        )}

        {tab === 'estoque' && (
          <section className="glass">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#003a7d]/50 text-xs uppercase tracking-wider text-[#ffc400]">
                  <tr>{['ID', 'Produto', 'Categoria', 'Estoque', 'Preço Unit.', 'Ações'].map((h) => <th key={h} className="px-5 py-4">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filtrados.map((p) => (
                    <tr key={p.id} className="border-t border-white/15 transition hover:bg-white/10">
                      <td className="px-5 py-3 font-mono text-white/70">#{String(p.id).padStart(3, '0')}</td>
                      <td className="px-5 py-3 font-bold">{p.nome}</td>
                      <td className="px-5 py-3"><Tag c={p.categoria} /></td>
                      <td className={`px-5 py-3 font-bold ${p.qtd <= 5 ? 'text-red-300' : ''}`}>{p.qtd}</td>
                      <td className="px-5 py-3">{brl(p.preco)}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button className="btn !px-3 !py-1" onClick={() => repor(p.id)}>+10</button>
                          <button className="btn !px-3 !py-1" onClick={() => setModal(p)}>Editar</button>
                          <button className="btn !px-3 !py-1 hover:!bg-red-500/60" onClick={() => remove(p.id)}>Excluir</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {modal && <Modal item={modal === 'new' ? null : modal} onSave={save} onClose={() => setModal(null)} />}
    </div>
  )
}

