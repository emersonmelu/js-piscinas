import React, { useState } from 'react'

export default function Login({ onLogin, onForgotPassword }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email || !password) {
      setErrorMessage('Por favor, preencha o seu e-mail e palavra-passe.')
      return
    }

    setIsLoading(true)
    // Simulação de autenticação com feedback visual fluido
    setTimeout(() => {
      setIsLoading(false)
      if (onLogin) {
        onLogin({ email, rememberMe })
      }
    }, 1100)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4 sm:p-6 select-none">
      {/* 1. FUNDO COM GRADIENTE AQUÁTICO (#005BBE + CIANO + VERDE-ÁGUA) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(120% 100% at 50% 0%, rgba(14, 165, 233, 0.45) 0%, rgba(20, 184, 166, 0.25) 35%, transparent 70%),
            radial-gradient(80% 80% at 100% 100%, rgba(45, 212, 191, 0.3) 0%, transparent 60%),
            radial-gradient(75% 75% at 0% 100%, rgba(0, 91, 190, 0.6) 0%, transparent 60%),
            linear-gradient(145deg, #0284c7 0%, #005bbe 45%, #003366 100%)
          `
        }}
      />

      {/* 2. FORMAS ORGÂNICAS ANIMADAS (BLOBS EM CSS - FLUIDEZ & ONDULAÇÃO DA ÁGUA) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blob Ciano Claro Superior */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 sm:w-[480px] sm:h-[480px] rounded-[42%_58%_70%_30%/45%_45%_55%_55%] bg-gradient-to-tr from-cyan-400/40 via-teal-300/35 to-blue-500/25 blur-3xl animate-blob"
        />

        {/* Blob Verde-Água / Turquesa Direito Central */}
        <div
          className="absolute top-1/3 -right-28 w-80 h-80 sm:w-[460px] sm:h-[460px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-gradient-to-bl from-teal-300/40 via-cyan-500/30 to-[#005bbe]/35 blur-3xl animate-blob animation-delay-2000"
        />

        {/* Blob Azul Real e Ciano Inferior Esquerdo */}
        <div
          className="absolute -bottom-28 left-1/4 w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-[45%_55%_65%_35%/50%_60%_40%_50%] bg-gradient-to-tr from-[#005bbe]/50 via-sky-400/30 to-emerald-300/25 blur-3xl animate-blob animation-delay-4000"
        />

        {/* Reflexo de Luz de Piscina (Ondulações Cáusticas Sutis) */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-color-dodge animate-pulse"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
            animationDuration: '6s'
          }}
        />
      </div>

      {/* 3. TEXTURA DE RUÍDO (GRAIN / NOISE) TÁTIL & MODERNA */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='grain'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23grain)'/></svg>")`,
          backgroundSize: '160px 160px'
        }}
      />

      {/* 4. CARTÃO DE LOGIN CENTRALIZADO (GLASSMORPHISM AVANÇADO) */}
      <div className="relative z-10 w-full max-w-[430px]">
        {/* Glow de fundo exterior para destacar o cartão no cenário aquático */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-400/30 via-[#005bbe]/40 to-teal-400/30 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

        <div
          className="relative rounded-3xl border border-white/25 bg-white/[0.08] p-7 sm:p-9 shadow-[0_20px_50px_rgba(2,16,48,0.55)] backdrop-blur-2xl overflow-hidden transition-all duration-300"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 36, 80, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4), inset 0 -1px 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Brilho linear superior do efeito vidro */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-cyan-300/20 blur-2xl" />

          {/* CABEÇALHO DO CARTÃO: LOGO E TÍTULO */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-3 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="JS Piscinas"
                className="h-16 w-auto max-w-[190px] object-contain drop-shadow-[0_8px_16px_rgba(0,35,90,0.45)] transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const fallback = document.getElementById('logo-text-fallback')
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
              {/* Fallback visual em caso de imagem não renderizar */}
              <div
                id="logo-text-fallback"
                style={{ display: 'none' }}
                className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-[#005bbe] to-cyan-400 items-center justify-center shadow-lg border border-white/30"
              >
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-300/30 bg-cyan-500/10 backdrop-blur-md mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-semibold tracking-wider uppercase text-cyan-200">
                Sistema de Gestão Integrada
              </span>
            </div>

            <h1 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight">
              JS Piscinas
            </h1>
            <p className="text-sm text-cyan-100/80 font-medium mt-1">
              Bem-vindo ao seu painel de controle aquático
            </p>
          </div>

          {/* MENSAGEM DE ERRO/ALERTA */}
          {errorMessage && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-400/40 bg-red-500/20 px-3.5 py-2.5 text-xs text-red-100 backdrop-blur-md animate-fadeIn">
              <svg className="h-4 w-4 shrink-0 text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* FORMULÁRIO DE LOGIN */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* CAMPO DE E-MAIL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold tracking-wide text-cyan-100/90 ml-1">
                E-mail Profissional
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-cyan-200/75 transition-colors group-focus-within:text-cyan-300">
                  {/* Ícone pastel de Email */}
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="utilizador@jspiscinas.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/20 bg-[#002855]/40 py-3 pl-11 pr-4 text-sm text-white placeholder-cyan-100/40 backdrop-blur-md transition-all duration-300 outline-none hover:border-white/30 hover:bg-[#002855]/55 focus:border-cyan-300 focus:bg-[#002855]/70 focus:shadow-[0_0_20px_rgba(34,211,238,0.35)] focus:ring-1 focus:ring-cyan-300/50"
                />
              </div>
            </div>

            {/* CAMPO DE PALAVRA-PASSE */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="block text-xs font-semibold tracking-wide text-cyan-100/90">
                  Palavra-passe
                </label>
                {/* LINK ESQUECEU A PALAVRA-PASSE */}
                <button
                  type="button"
                  onClick={() => onForgotPassword ? onForgotPassword() : alert('Recuperação de palavra-passe: Envie um email para suporte@jspiscinas.com')}
                  className="text-xs text-cyan-200/80 transition-colors hover:text-cyan-100 hover:underline font-medium focus:outline-none"
                >
                  Esqueceu-se da palavra-passe?
                </button>
              </div>

              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-cyan-200/75 transition-colors group-focus-within:text-cyan-300">
                  {/* Ícone pastel de Cadeado */}
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/20 bg-[#002855]/40 py-3 pl-11 pr-11 text-sm text-white placeholder-cyan-100/40 backdrop-blur-md transition-all duration-300 outline-none hover:border-white/30 hover:bg-[#002855]/55 focus:border-cyan-300 focus:bg-[#002855]/70 focus:shadow-[0_0_20px_rgba(34,211,238,0.35)] focus:ring-1 focus:ring-cyan-300/50"
                />

                {/* Botão de alternar visibilidade */}
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-cyan-200/60 transition-colors hover:text-cyan-100 focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* LEMBRAR SESSÃO */}
            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/30 bg-[#002855]/60 text-[#005bbe] focus:ring-cyan-400 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-[#005bbe]"
                />
                <span className="text-xs text-cyan-100/80 font-medium group-hover:text-white transition-colors">
                  Lembrar as minhas credenciais
                </span>
              </label>
            </div>

            {/* BOTÃO DE ENTRAR COM ONDULAÇÃO LUMINOSA & HOVER #005BBE */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full group overflow-hidden rounded-xl py-3.5 px-4 font-bold text-white text-sm shadow-[0_10px_25px_rgba(0,91,190,0.5)] transition-all duration-300 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none mt-2"
              style={{
                backgroundColor: '#005BBE',
                backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)'
              }}
            >
              {/* Efeito de onda / reflexo luminoso contínuo no hover */}
              <div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none bg-gradient-to-r from-transparent via-white/35 to-transparent"
              />

              {/* Intensificação de cor e brilho no hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-[#0066d6] via-[#005bbe] to-[#0284c7]"
              />

              {/* Brilho de borda superior */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-white/40" />

              <span className="relative z-10 flex items-center justify-center gap-2 font-semibold tracking-wide">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>A aceder ao sistema...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar no Sistema</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* RODAPÉ DO CARTÃO COM SEGURANÇA E SUPORTE */}
          <div className="mt-7 pt-5 border-t border-white/10 flex items-center justify-between text-[11px] text-cyan-200/60">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Conexão Segura SSL 256-bit
            </span>
            <span>v2.4.0</span>
          </div>
        </div>

        {/* INFORMAÇÃO COMPLEMENTAR NO EXTERIOR DO CARTÃO */}
        <p className="mt-5 text-center text-xs text-white/60">
          Precisa de assistência técnica? Contacte a equipa da{' '}
          <span className="font-semibold text-cyan-300">JS Piscinas</span>
        </p>
      </div>
    </div>
  )
}
