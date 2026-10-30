export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
      {/* Logo pequeño */}
      <div className="flex flex-col items-center mb-10">
        <div className="text-6xl leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6d2b]">
          U
        </div>
        <h1 className="mt-2 text-2xl tracking-[0.3em] font-light">UNICO</h1>
        <p className="text-[10px] tracking-[0.4em] text-[#d4af37] mt-1">DISTRO</p>
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-2">Iniciar Sesión</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Accede a tu cuenta de artista
        </p>

        <form className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Correo electrónico</label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#d4af37]" />
              <span className="text-gray-400">Recordarme</span>
            </label>
            <a href="#" className="text-[#d4af37] hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#d4af37] text-black font-bold py-3.5 rounded-full hover:bg-[#e5c04a] transition mt-2"
          >
            Entrar
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-black text-gray-500">o continúa con</span>
          </div>
        </div>

        <button className="w-full border border-zinc-700 rounded-full py-3 flex items-center justify-center gap-3 hover:bg-zinc-900 transition">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuar con Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-8">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-[#d4af37] hover:underline font-medium">
            Regístrate gratis
          </a>
        </p>
      </div>

      <a href="/" className="mt-12 text-sm text-gray-600 hover:text-gray-400 transition">
        ← Volver al inicio
      </a>
    </main>
  );
}
