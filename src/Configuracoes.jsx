import { useState } from 'react'

export const DADOS_EMPRESA_PADRAO = {
  nomeFantasia: 'JS Piscinas & Materiais',
  razaoSocial: 'JS Piscinas e Produtos Ltda',
  cnpj: '12.345.678/0001-90',
  inscricaoEstadual: '123.456.789.110',
  telefone: '(11) 3456-7890',
  whatsapp: '(11) 98765-4321',
  email: 'contato@jspiscinas.com',
  endereco: 'Av. das Piscinas, 1500',
  bairro: 'Centro',
  cidade: 'Campinas',
  uf: 'SP',
  cep: '13000-000',
  instagram: '@jspiscinas',
  site: 'www.jspiscinas.com.br',
  logoUrl: '/logo.png',
  avisoLegal: '* Sem valor fiscal - Não é válido como recibo e como garantia de mercadoria - Não comprova pagamento *',
  observacoesPadrao: 'Conferir os materiais no ato da entrega. Agradecemos a sua preferência!',
  rodapeTexto: 'Obrigado pela preferência! Volte sempre.',
}

export default function Configuracoes({ dadosEmpresa, onSalvarEmpresa }) {
  const [abaAtiva, setAbaAtiva] = useState('recibo') // 'recibo' | 'geral'
  const [form, setForm] = useState(dadosEmpresa || DADOS_EMPRESA_PADRAO)
  const [salvoFeedback, setSalvoFeedback] = useState(false)

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  const handleUploadLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, SVG).')
      return
    }

    const reader = new FileReader()
    reader.onload = (evt) => {
      handleChange('logoUrl', evt.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSalvarEmpresa(form)
    setSalvoFeedback(true)
    setTimeout(() => setSalvoFeedback(false), 3000)
  }

  const restaurarPadroes = () => {
    if (window.confirm('Deseja restaurar os dados padrões de impressão do recibo?')) {
      setForm(DADOS_EMPRESA_PADRAO)
      onSalvarEmpresa(DADOS_EMPRESA_PADRAO)
      setSalvoFeedback(true)
      setTimeout(() => setSalvoFeedback(false), 3000)
    }
  }

  return (
    <div className="w-full space-y-5 animate-fadeIn">
      {/* CABEÇALHO DA SEÇÃO DE CONFIGURAÇÕES */}
      <div className="glass p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-[#ffc400]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Configurações do Sistema</span>
          </h2>
          <p className="text-xs text-white/70 mt-0.5">
            Personalize as informações da empresa, dados do recibo de venda e parâmetros de operação.
          </p>
        </div>

        {salvoFeedback && (
          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-400/50 bg-emerald-950/80 px-3 py-1.5 text-xs font-bold text-emerald-200 animate-fadeIn">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Configurações salvas com sucesso!</span>
          </div>
        )}
      </div>

      {/* ABAS INTERNAS DE CONFIGURAÇÃO */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setAbaAtiva('recibo')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-extrabold transition ${
            abaAtiva === 'recibo'
              ? 'bg-gradient-to-r from-[#ffc400] to-[#f28c1b] text-[#003a7d] shadow-md'
              : 'text-white/80 hover:bg-white/10'
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect width="12" height="8" x="6" y="14" />
          </svg>
          <span>Dados do Recibo / Comprovante</span>
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva('geral')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-extrabold transition ${
            abaAtiva === 'geral'
              ? 'bg-gradient-to-r from-[#ffc400] to-[#f28c1b] text-[#003a7d] shadow-md'
              : 'text-white/80 hover:bg-white/10'
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>Sobre & Informações</span>
        </button>
      </div>

      {/* ABA 1: EDIÇÃO DOS DADOS DO RECIBO */}
      {abaAtiva === 'recibo' && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* COLUNA ESQUERDA: LOGOTIPO E PRÉVIA */}
            <div className="glass p-4 space-y-4 lg:col-span-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-[#ffc400] border-b border-white/10 pb-2">
                Logotipo do Recibo
              </h3>

              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/25 bg-black/20 p-4 text-center">
                <div className="flex h-24 w-full items-center justify-center rounded-lg bg-white p-2 shadow-inner">
                  {form.logoUrl ? (
                    <img
                      src={form.logoUrl}
                      alt="Logo do Recibo"
                      className="max-h-20 max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs font-bold text-gray-400">Sem logo definida</span>
                  )}
                </div>

                <p className="mt-2 text-[11px] text-white/60">
                  Formato recomendado: PNG transparente ou SVG
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <label className="btn-sun cursor-pointer !py-1 !px-3 text-xs font-bold">
                    <span>Carregar Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadLogo}
                      className="hidden"
                    />
                  </label>

                  {form.logoUrl && (
                    <button
                      type="button"
                      onClick={() => handleChange('logoUrl', '')}
                      className="btn !py-1 !px-2.5 text-xs text-red-300 hover:text-red-100"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>

              {/* OPÇÃO DE URL DIRETA */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-white/80">URL da Imagem da Logo:</label>
                <input
                  type="text"
                  value={form.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  placeholder="https://... ou /logo.png"
                  className="field w-full !py-1.5 !px-2 text-xs"
                />
              </div>

              {/* DICA DE IMPRESSÃO */}
              <div className="rounded-xl border border-cyan-400/30 bg-[#002f68]/70 p-3 text-[11px] text-cyan-200 space-y-1">
                <span className="font-extrabold uppercase block text-[#ffe27a]">
                  Formato Retrato (A4 em 2 Vias):
                </span>
                <p>
                  O comprovante é impresso em folha <strong>A4 no modo Retrato</strong>, com duas vias idênticas empilhadas verticalmente e linha de corte com tesoura ao meio.
                </p>
              </div>
            </div>

            {/* COLUNA DIREITA: DADOS DA EMPRESA E TEXTOS DO RECIBO */}
            <div className="glass p-4 space-y-4 lg:col-span-8">
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-[#ffc400] border-b border-white/10 pb-2">
                Dados Cadastrais da Empresa (Cabeçalho do Recibo)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-white/80 mb-1">Nome Fantasia:</label>
                  <input
                    type="text"
                    required
                    value={form.nomeFantasia}
                    onChange={(e) => handleChange('nomeFantasia', e.target.value)}
                    className="field w-full"
                    placeholder="JS Piscinas & Materiais"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white/80 mb-1">Razão Social:</label>
                  <input
                    type="text"
                    value={form.razaoSocial}
                    onChange={(e) => handleChange('razaoSocial', e.target.value)}
                    className="field w-full"
                    placeholder="JS Piscinas e Produtos Ltda"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white/80 mb-1">CNPJ:</label>
                  <input
                    type="text"
                    value={form.cnpj}
                    onChange={(e) => handleChange('cnpj', e.target.value)}
                    className="field w-full font-mono"
                    placeholder="00.000.000/0001-00"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white/80 mb-1">Inscrição Estadual (I.E.):</label>
                  <input
                    type="text"
                    value={form.inscricaoEstadual}
                    onChange={(e) => handleChange('inscricaoEstadual', e.target.value)}
                    className="field w-full font-mono"
                    placeholder="000.000.000.000"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white/80 mb-1">Telefone / Fixo:</label>
                  <input
                    type="text"
                    value={form.telefone}
                    onChange={(e) => handleChange('telefone', e.target.value)}
                    className="field w-full font-mono"
                    placeholder="(00) 0000-0000"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white/80 mb-1">WhatsApp de Atendimento:</label>
                  <input
                    type="text"
                    value={form.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    className="field w-full font-mono"
                    placeholder="(00) 90000-0000"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white/80 mb-1">E-mail Comercial:</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="field w-full"
                    placeholder="contato@empresa.com"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white/80 mb-1">Instagram / Redes Sociais:</label>
                  <input
                    type="text"
                    value={form.instagram}
                    onChange={(e) => handleChange('instagram', e.target.value)}
                    className="field w-full"
                    placeholder="@jspiscinas"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-white/80 mb-1">Endereço Completo:</label>
                  <input
                    type="text"
                    value={form.endereco}
                    onChange={(e) => handleChange('endereco', e.target.value)}
                    className="field w-full"
                    placeholder="Av. Exemplo, 100 - Bairro"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white/80 mb-1">Cidade / UF:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.cidade}
                      onChange={(e) => handleChange('cidade', e.target.value)}
                      className="field flex-1"
                      placeholder="Cidade"
                    />
                    <input
                      type="text"
                      maxLength={2}
                      value={form.uf}
                      onChange={(e) => handleChange('uf', e.target.value.toUpperCase())}
                      className="field w-14 text-center font-bold"
                      placeholder="SP"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-white/80 mb-1">CEP:</label>
                  <input
                    type="text"
                    value={form.cep}
                    onChange={(e) => handleChange('cep', e.target.value)}
                    className="field w-full font-mono"
                    placeholder="00000-000"
                  />
                </div>
              </div>

              {/* TEXTOS LEGAIS E OBSERVAÇÕES PADRÃO */}
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-[#ffc400] border-t border-white/10 pt-4 pb-1">
                Textos e Avisos do Recibo
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-white/80 mb-1">Aviso Legal (itálico):</label>
                  <input
                    type="text"
                    value={form.avisoLegal}
                    onChange={(e) => handleChange('avisoLegal', e.target.value)}
                    className="field w-full text-xs"
                    placeholder="* Sem valor fiscal - Não comprova pagamento *"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white/80 mb-1">Observações Padrão de Venda:</label>
                  <textarea
                    rows={2}
                    value={form.observacoesPadrao}
                    onChange={(e) => handleChange('observacoesPadrao', e.target.value)}
                    className="field w-full text-xs"
                    placeholder="Texto que aparecerá nas observações caso a venda não possua observação específica..."
                  />
                </div>

                <div>
                  <label className="block font-bold text-white/80 mb-1">Texto do Rodapé da Via:</label>
                  <input
                    type="text"
                    value={form.rodapeTexto}
                    onChange={(e) => handleChange('rodapeTexto', e.target.value)}
                    className="field w-full text-xs"
                    placeholder="Obrigado pela preferência!"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BOTÕES DE AÇÃO DO FORMULÁRIO */}
          <div className="flex flex-wrap items-center justify-between gap-3 glass p-4">
            <button
              type="button"
              onClick={restaurarPadroes}
              className="btn text-xs text-white/70 hover:text-white"
            >
              Restaurar Valores Padrão
            </button>

            <button
              type="submit"
              className="btn-sun flex items-center gap-2 !py-2 !px-6 text-xs sm:text-sm font-black shadow-lg"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <span>Salvar Configurações</span>
            </button>
          </div>
        </form>
      )}

      {/* ABA 2: SOBRE & INFORMAÇÕES DO SISTEMA */}
      {abaAtiva === 'geral' && (
        <div className="glass p-5 space-y-4">
          <h3 className="text-base font-extrabold text-[#ffc400]">Sistema de Gestão & PDV — JS Piscinas</h3>
          <p className="text-sm text-white/80 leading-relaxed">
            Plataforma desenvolvida para gestão de estoque, controle de vendas em tempo real, emissão de comprovantes em duas vias horizontais (modo paisagem A4) e fechamento de caixa com múltiplas formas de pagamento.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="rounded-xl border border-white/15 bg-white/5 p-3">
              <span className="font-bold text-white/60 block">Versão:</span>
              <span className="text-sm font-black text-cyan-200">2.4.0 (PDV Pro)</span>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 p-3">
              <span className="font-bold text-white/60 block">Layout do Recibo:</span>
              <span className="text-sm font-black text-[#ffc400]">A4 Paisagem (Horizontal 2 Vias)</span>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 p-3">
              <span className="font-bold text-white/60 block">Armazenamento:</span>
              <span className="text-sm font-black text-emerald-300">Sessão Local Persistente</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
