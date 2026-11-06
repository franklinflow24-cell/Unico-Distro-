"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uxaupuajpfdvswnttysv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YXVwdWFqcGZkdnN3bnR0eXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MTYxMjIsImV4cCI6MjEwODk5MjEyMn0.cFINxKq7WCHWjCCFSiYQJRht4AyP80MA8A2xiRyBRjM"
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Completa correo y contraseña.");
      return;
    }
    setError("");
    localStorage.setItem(
      "unico_session",
      JSON.stringify({ email, name: email.split("@")[0], at: Date.now() })
    );
    router.push("/upload");
  }

  async function onGoogle() {
    setLoading(true);
    setMsg("");
    setError("");
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://unico-distro.vercel.app/auth/callback",
      },
    });
    if (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  async function onForgot() {
    if (!email) {
      setError("Escribe tu correo arriba para recuperar la contraseña.");
      return;
    }
    setError("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://unico-distro.vercel.app/login",
    });
    if (err) setError(err.message);
    else setMsg("Te enviamos un correo para restablecer la contraseña.");
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

        <button
          type="button"
          onClick={onGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-medium py-3.5 rounded-full mb-6 disabled:opacity-60"
        >
          {loading ? "Conectando..." : "Continuar con Google"}
        </button>

        {msg ? (
          <p className="text-xs text-[#d4af37] text-center mb-4">{msg}</p>
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
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="flex justify-end -mt-2">
            <button
              type="button"
              onClick={onForgot}
              className="text-sm text-[#d4af37]"
            >
              ¿Olvidé mi contraseña?
            </button>
          </div>

          {error ? <p className="text-sm text-[#d4af37]">{error}</p> : null}

          <button
            type="submit"
            className="w-full bg-[#d4af37] text-black font-bold py-3.5 rounded-full"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-[#d4af37] font-medium">
            Regístrate gratis
          </a>
        </p>
        <a href="/" className="block text-center mt-8 text-sm text-gray-600">
          ← Volver al inicio
        </a>
      </div>
    </main>
  );
}
