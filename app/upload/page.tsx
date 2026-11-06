"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PAYPAL_URL = "https://paypal.me/fernando2814/5USD";

export default function UploadPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [step, setStep] = useState(0);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [fileName, setFileName] = useState("");
  const [coverName, setCoverName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [paid, setPaid] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("unico_session");
      if (!raw) {
        router.replace("/login");
        return;
      }
      const session = JSON.parse(raw);
      setUser(session);
      setArtist(session.name || "");
      setReady(true);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  async function goPay() {
    setSaving(true);
    setMsg("");

    const release = {
      title,
      artist,
      genre,
      release_date: releaseDate,
      file_name: fileName,
      cover_name: coverName,
      user_email: user?.email || "",
      fee: "5.00",
      status: "esperando_paypal",
      whatsapp: whatsapp || null,
    };

    // Guarda en Supabase para el admin (si la tabla existe)
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        "https://uxaupuajpfdvswnttysv.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YXVwdWFqcGZkdnN3bnR0eXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MTYxMjIsImV4cCI6MjEwODk5MjEyMn0.cFINxKq7WCHWjCCFSiYQJRht4AyP80MA8A2xiRyBRjM"
      );
      const { error } = await supabase.from("releases").insert(release);
      if (error) {
        // Si falla (ej. columna whatsapp no existe), intenta sin whatsapp
        await supabase.from("releases").insert({
          title: release.title,
          artist: release.artist,
          genre: release.genre,
          release_date: release.release_date,
          file_name: release.file_name,
          cover_name: release.cover_name,
          user_email: release.user_email,
          fee: release.fee,
          status: release.status,
        });
      }
    } catch {
      // sigue con PayPal igual
    }

    const key = "unico_releases";
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(key, JSON.stringify([{ ...release, at: new Date().toISOString() }, ...prev]));

    setPaid(true);
    setSaving(false);
    setMsg("Pedido guardado. Abriendo PayPal…");
    window.open(PAYPAL_URL, "_blank", "noopener,noreferrer");
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-500">Verificando sesión…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6d2b]">
              U
            </div>
            <div>
              <h1 className="text-xl tracking-[0.2em] font-light leading-none">UNICO</h1>
              <p className="text-[9px] tracking-[0.3em] text-[#d4af37]">DISTRO</p>
            </div>
          </div>
          <a href="/" className="text-sm text-gray-500 hover:text-white">
            ← Inicio
          </a>
        </div>

        <p className="text-xs tracking-[0.3em] text-[#d4af37] mb-2">
          PASO {step + 1} DE 3
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Subir Música</h2>
        <p className="text-gray-400 mb-8 text-sm">
          Sesión: {user?.email}. Al final pagas <span className="text-[#d4af37] font-semibold">$5 USD</span> con PayPal.
          Nosotros lo subimos a las plataformas (RouteNote).
        </p>

        {step === 0 && (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (!fileName || !title || !artist) return;
              setStep(1);
            }}
          >
            <label className="block border-2 border-dashed border-zinc-700 rounded-2xl p-10 text-center cursor-pointer hover:border-[#d4af37]/50">
              <p className="font-medium mb-1">Audio del tema *</p>
              <p className="text-sm text-gray-500 mb-3">WAV, FLAC o MP3</p>
              <span className="text-[#d4af37] text-sm">
                {fileName || "Seleccionar archivo"}
              </span>
              <input
                type="file"
                accept="audio/*"
                required
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
              />
            </label>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Título *</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nombre de la canción"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Artista *</label>
                <input
                  required
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Nombre artístico"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-[#d4af37] text-black font-bold py-3.5 px-8 rounded-full"
            >
              Continuar
            </button>
          </form>
        )}

        {step === 1 && (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (!genre || !coverName) return;
              setStep(2);
            }}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Género *</label>
                <select
                  required
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="">Selecciona</option>
                  <option>Reggaetón</option>
                  <option>Dembow</option>
                  <option>Bachata</option>
                  <option>Merengue</option>
                  <option>Trap Latino</option>
                  <option>Pop</option>
                  <option>Hip-Hop</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Fecha de lanzamiento
                </label>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                WhatsApp (para contactarte)
              </label>
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ej: 8091234567"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <label className="flex items-center justify-between border border-zinc-700 rounded-2xl p-4 cursor-pointer">
              <span>
                <span className="block text-sm">Portada *</span>
                <span className="text-xs text-gray-500">JPG/PNG · 3000×3000</span>
              </span>
              <span className="text-[#d4af37] text-sm">{coverName || "Subir"}</span>
              <input
                type="file"
                accept="image/*"
                required
                className="hidden"
                onChange={(e) => setCoverName(e.target.files?.[0]?.name || "")}
              />
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="flex-1 border border-zinc-600 py-3.5 rounded-full"
              >
                Atrás
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#d4af37] text-black font-bold py-3.5 rounded-full"
              >
                Ir al pago
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950 space-y-4">
            <h3 className="text-2xl font-bold">Pagar $5 USD con PayPal</h3>
            <div className="text-sm space-y-2 text-gray-300">
              <p className="flex justify-between border-b border-zinc-800 py-2">
                <span className="text-gray-500">Canción</span>
                <span>{title}</span>
              </p>
              <p className="flex justify-between border-b border-zinc-800 py-2">
                <span className="text-gray-500">Artista</span>
                <span>{artist}</span>
              </p>
              <p className="flex justify-between border-b border-zinc-800 py-2">
                <span className="text-gray-500">Género</span>
                <span>{genre}</span>
              </p>
              <p className="flex justify-between border-b border-zinc-800 py-2">
                <span className="text-gray-500">Tarifa</span>
                <span className="text-[#d4af37] font-bold">$5.00 USD</span>
              </p>
            </div>
            <p className="text-sm text-gray-400">
              Las regalías son 100% del artista. Este pago es solo el servicio de
              distribución. Después de pagar, nosotros lo subimos a RouteNote /
              plataformas.
            </p>
            {msg && <p className="text-sm text-[#d4af37]">{msg}</p>}
            {paid && (
              <p className="text-sm text-[#d4af37]">
                PayPal abierto. Cuando veamos el pago, procesamos tu lanzamiento.
                Soporte: WhatsApp 829-543-5381.
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-zinc-600 py-3.5 rounded-full"
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={goPay}
                disabled={saving}
                className="flex-1 bg-[#d4af37] text-black font-bold py-3.5 rounded-full disabled:opacity-60"
              >
                {saving ? "Guardando…" : "Pagar $5 con PayPal"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
