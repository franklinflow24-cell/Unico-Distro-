"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [googleMsg, setGoogleMsg] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Completa correo y contraseña.");
      return;
    }
    localStorage.setItem(
      "unico_session",
      JSON.stringify({ email, name: email.split("@")[0], at: Date.now() })
    );
    router.push("/upload");
  }

  function onGoogle() {
    // Cuando actives Google en Supabase, aquí va el signInWithOAuth.
    // Por ahora avisamos si aún no está configurado.
    setGoogleMsg(
      "El botón ya está listo. Falta activar Google en Supabase (te indico los pasos abajo)."
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
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

        {/* Google primero, bien visible */}
        <button
          type="button"
          onClick={onGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-medium py-3.5 rounded-full hover:bg-gray-100 transition mb-6"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuar con Google
        </button>

        {googleMsg ? (
          <p className="text-xs text-[#d4af37] text-center mb-4">{googleMsg}</p>
        ) : null}

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-xs text-gray-500 tracking-widest">O CON CORREO</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#d4af37] transition"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#d4af37] transition"
            />
          </div>
          {error ? <p className="text-sm text-[#d4af37]">{error}</p> : null}
          <button
            type="submit"
            className="w-full bg-[#d4af37] text-black font-bold py-3.5 rounded-full hover:bg-[#e5c04a] transition"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-[#d4af37] hover:underline font-medium">
            Regístrate gratis
          </a>
        </p>
        <a href="/" className="block text-center mt-8 text-sm text-gray-600 hover:text-gray-400">
          ← Volver al inicio
        </a>
      </div>
    </main>
  );
}
