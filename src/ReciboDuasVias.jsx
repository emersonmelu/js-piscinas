import React from 'react'
import { BRL } from './pdvUtils.js'

/**
 * Componente de Impressão de Recibo / Comprovante de Pedido em Duas Vias
 * Formato Retrato (Portrait) A4 com duas vias idênticas empilhadas verticalmente
 * e linha horizontal pontilhada de corte (tesoura) entre elas.
 * As informações da empresa e do cabeçalho são extraídas dinamicamente das Configurações.
 */
export default function ReciboDuasVias({ venda, dadosEmpresa = {}, onClose }) {
  if (!venda) return null

  // Dados da empresa originários da aba de configurações (com fallback seguro)
  const empresa = {
    nomeFantasia: dadosEmpresa.nomeFantasia || 'JS Piscinas & Materiais',
    razaoSocial: dadosEmpresa.razaoSocial || 'JS Piscinas & Materiais',
    cnpj: dadosEmpresa.cnpj || '',
    inscricaoEstadual: dadosEmpresa.inscricaoEstadual || '',
    telefone: dadosEmpresa.telefone || '(11) 3456-7890',
    whatsapp: dadosEmpresa.whatsapp || '(11) 98765-4321',
    email: dadosEmpresa.email || 'contato@jspiscinas.com',
    endereco: dadosEmpresa.endereco || 'Av. das Piscinas, 1500 - Centro',
    bairro: dadosEmpresa.bairro || 'Centro',
    cidade: dadosEmpresa.cidade || 'Campinas',
    uf: dadosEmpresa.uf || 'SP',
    cep: dadosEmpresa.cep || '13000-000',
    instagram: dadosEmpresa.instagram || '@jspiscinas',
    logoUrl: dadosEmpresa.logoUrl || '/logo.png',
    avisoLegal:
      dadosEmpresa.avisoLegal ||
      '* Sem valor fiscal - Não é válido como recibo e como garantia de mercadoria - Não comprova pagamento *',
    observacoesPadrao:
      dadosEmpresa.observacoesPadrao ||
      'Conferir os materiais no ato da entrega. Agradecemos a sua preferência!',
    rodapeTexto: dadosEmpresa.rodapeTexto || '',
  }

  // Itens extraídos diretamente da venda
  const itens =
    venda.itens && venda.itens.length > 0
      ? venda.itens
      : [
          {
            produtoId: venda.produtoId || 1,
            produto: venda.produto || 'Item de Piscina',
            qtd: venda.qtd || 1,
            preco: venda.preco || venda.total,
            total: venda.total,
          },
        ]

  const totalFormatado = BRL(venda.total || 0)

  const imprimir = () => {
    window.print()
  }

  // Componente que renderiza CADA UMA das duas vias idênticas
  const ViaComprovante = ({ numeroVia }) => (
    <div className="via-container flex flex-col justify-between border border-black bg-white p-3 text-black font-sans leading-tight text-[11px] box-border">
      {/* 1. CABEÇALHO DIVIDIDO EM 3 SEÇÕES HORIZONTAIS */}
      <div className="grid grid-cols-12 gap-1 border-b border-black pb-1.5 items-center">
        {/* Esquerda: Logo JS Piscinas */}
        <div className="col-span-3 flex flex-col items-center justify-center p-1 border-r border-black/40">
          {empresa.logoUrl ? (
            <img
              src={empresa.logoUrl}
              alt={empresa.nomeFantasia}
              className="h-12 w-auto max-w-[130px] object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="text-[11px] font-black tracking-tighter text-black uppercase text-center">
              {empresa.nomeFantasia}
            </div>
          )}
          <span className="text-[10px] font-black tracking-tighter text-black uppercase mt-0.5 text-center leading-none">
            {empresa.nomeFantasia}
          </span>
        </div>

        {/* Centro: Dados da empresa originários da aba de configurações */}
        <div className="col-span-6 px-2 text-center text-[9.5px] leading-tight space-y-0.5 border-r border-black/40">
          <p className="font-extrabold uppercase text-[10.5px]">
            {empresa.razaoSocial || empresa.nomeFantasia}
          </p>
          {empresa.cnpj && (
            <p className="font-mono text-[9px]">
              CNPJ: {empresa.cnpj} {empresa.inscricaoEstadual ? `• I.E: ${empresa.inscricaoEstadual}` : ''}
            </p>
          )}
          <p>
            Tel / WhatsApp: {empresa.whatsapp || empresa.telefone} • E-mail: {empresa.email}
          </p>
          <p>
            Endereço: {empresa.endereco} {empresa.cidade ? `• ${empresa.cidade}/${empresa.uf}` : ''} {empresa.cep ? `• CEP: ${empresa.cep}` : ''}
          </p>
          {empresa.instagram && (
            <p className="text-[8.5px] text-gray-700">Instagram: {empresa.instagram} • Atendimento de Seg a Sáb</p>
          )}
        </div>

        {/* Direita: Duas caixas empilhadas com bordas */}
        <div className="col-span-3 flex flex-col gap-1 text-center">
          <div className="border border-black p-0.5">
            <span className="block text-[8px] uppercase font-bold text-gray-600">Transação nº</span>
            <span className="block text-xs font-black font-mono">
              #{String(venda.id || 1).padStart(5, '0')}
            </span>
          </div>
          <div className="border border-black p-0.5">
            <span className="block text-[8px] uppercase font-bold text-gray-600">Data / Hora</span>
            <span className="block text-[9.5px] font-bold">
              {venda.data?.split('-').reverse().join('/') || '15/10/2026'}{' '}
              {venda.hora ? `• ${venda.hora}` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* 2. TÍTULO */}
      <div className="border-b border-black py-1 text-center bg-gray-100">
        <h2 className="text-sm font-black uppercase tracking-wider text-black">
          Pedido de Venda
        </h2>
      </div>

      {/* 3. DADOS DO PEDIDO (GRID COM BORDAS SÓLIDAS CONTÍGUAS) */}
      <div className="grid grid-cols-12 border-b border-black text-left text-[9.5px]">
        {/* Cliente */}
        <div className="col-span-6 border-r border-black p-1">
          <span className="block text-[7.5px] uppercase font-bold text-gray-600">Cliente</span>
          <span className="block font-bold text-[10.5px] truncate">
            {venda.cliente || 'Consumidor Final'}
          </span>
        </div>

        {/* Vendedor */}
        <div className="col-span-6 p-1">
          <span className="block text-[7.5px] uppercase font-bold text-gray-600">Vendedor / Caixa</span>
          <span className="block font-bold text-[10.5px]">Atendimento Balcão</span>
        </div>

        {/* Telefone / Celular */}
        <div className="col-span-6 border-t border-r border-black p-1">
          <span className="block text-[7.5px] uppercase font-bold text-gray-600">Telefone / Celular</span>
          <span className="block font-semibold">{venda.telefone || '(11) —'}</span>
        </div>

        {/* Pagamento / E-mail */}
        <div className="col-span-6 border-t border-black p-1">
          <span className="block text-[7.5px] uppercase font-bold text-gray-600">Forma(s) de Pagamento</span>
          <span className="block font-bold text-[10px] text-black truncate">
            {venda.pagto || 'PIX'}
          </span>
        </div>
      </div>

      {/* 4. AVISO LEGAL */}
      <div className="py-0.5 text-center border-b border-black">
        <p className="text-[7.5px] italic text-gray-700 tracking-tight">
          {empresa.avisoLegal}
        </p>
      </div>

      {/* 5. TABELA DE ITENS (PRODUTOS) */}
      <div className="my-1 flex-1">
        <table className="w-full border-collapse border border-black text-[9.5px]">
          <thead>
            <tr className="bg-black text-white font-black text-[9px] uppercase tracking-wider print:bg-black print:text-white">
              <th className="border border-black px-2 py-1 text-left w-20">CÓDIGO</th>
              <th className="border border-black px-2 py-1 text-center w-16">QTD</th>
              <th className="border border-black px-2 py-1 text-left">DESCRIÇÃO</th>
              <th className="border border-black px-2 py-1 text-right w-24">SUBTOTAL</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((it, idx) => (
              <tr key={idx} className="border-b border-black/30">
                <td className="border border-black/40 px-2 py-0.5 font-mono text-[9px]">
                  #{String(it.produtoId || idx + 1).padStart(3, '0')}
                </td>
                <td className="border border-black/40 px-2 py-0.5 text-center font-bold">
                  {it.qtd}
                </td>
                <td className="border border-black/40 px-2 py-0.5 text-left font-medium">
                  {it.produto}
                </td>
                <td className="border border-black/40 px-2 py-0.5 text-right font-bold">
                  {BRL(it.total || 0)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-black font-black bg-gray-100">
              <td colSpan="3" className="border border-black px-2 py-1 text-right uppercase text-[9px]">
                {venda.desconto > 0 ? `Desconto: - ${BRL(venda.desconto)} | TOTAL LÍQUIDO:` : 'TOTAL DO PEDIDO:'}
              </td>
              <td className="border border-black px-2 py-1 text-right text-xs text-black font-black">
                {totalFormatado}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 6. OBSERVAÇÕES E RODAPÉ */}
      <div className="space-y-1">
        {/* Caixa de Observações */}
        <div className="flex border border-black text-[9px] min-h-[28px]">
          <div className="bg-black text-white font-bold px-2 py-1 flex items-center justify-center uppercase text-[8px] print:bg-black print:text-white">
            Observações:
          </div>
          <div className="px-2 py-1 flex-1 text-gray-800">
            {venda.observacao || empresa.observacoesPadrao}
          </div>
        </div>

        {/* Rodapé retangular vazado */}
        <div className="border border-black py-1 text-center">
          <span className="text-[8px] font-black uppercase tracking-widest text-gray-700">
            RODAPÉ — VIA {numeroVia} ({numeroVia === 1 ? 'ESTABELECIMENTO' : 'CLIENTE'}) {empresa.rodapeTexto ? `• ${empresa.rodapeTexto}` : ''}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      {/* BARRA SUPERIOR DE AÇÕES (OCULTA NA IMPRESSÃO) */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#002f68] border border-white/20 px-5 py-2.5 rounded-2xl shadow-2xl print:hidden">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <svg className="w-4 h-4 text-[#ffc400]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect width="12" height="8" x="6" y="14" />
          </svg>
          Comprovante de Pedido (2 Vias A4)
        </span>
        <button
          type="button"
          onClick={imprimir}
          className="btn-sun flex items-center gap-1.5 !py-1.5 !px-3.5 text-xs font-black shadow-lg"
        >
          <span>Imprimir / Salvar PDF</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="btn !py-1.5 !px-3 text-xs font-bold"
        >
          Fechar
        </button>
      </div>

      {/* FOLHA A4 EM MODO RETRATO COM DUAS VIAS EMPILHADAS */}
      <div
        id="recibo-impressao-a4"
        className="w-full max-w-[210mm] bg-white shadow-2xl p-[8mm] text-black my-auto print:my-0 print:p-0 print:shadow-none print:w-full print:max-w-none"
        style={{
          minHeight: '297mm',
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
        }}
      >
        {/* PRIMEIRA VIA (SUPERIOR) */}
        <div className="via-bloco" style={{ height: '136mm' }}>
          <ViaComprovante numeroVia={1} />
        </div>

        {/* LINHA HORIZONTAL PONTILHADA DE CORTE COM TESOURA */}
        <div className="my-2.5 flex items-center justify-between gap-2 text-gray-500 py-1 print:my-2">
          <div className="h-[1px] flex-1 border-t-2 border-dashed border-gray-400" />
          <span className="text-[10px] font-mono tracking-widest flex items-center gap-1 uppercase">
            <span>✂</span> Linha de Corte <span>✂</span>
          </span>
          <div className="h-[1px] flex-1 border-t-2 border-dashed border-gray-400" />
        </div>

        {/* SEGUNDA VIA (INFERIOR - IDÊNTICA) */}
        <div className="via-bloco" style={{ height: '136mm' }}>
          <ViaComprovante numeroVia={2} />
        </div>
      </div>
    </div>
  )
}
