"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Completa correo y contraseña.");
      return;
    }
    // Sesión simple en el navegador (hasta conectar Supabase de verdad)
    localStorage.setItem(
      "unico_session",
      JSON.stringify({ email, name: email.split("@")[0], at: Date.now() })
    );
    router.push("/upload");
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
          Debes entrar para subir música
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition"
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
