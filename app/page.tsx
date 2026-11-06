"use client";
import { useState } from "react";

export default function Subir() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [genre, setGenre] = useState("Dembow");
  const [subiendo, setSubiendo] = useState(false);
  const [listo, setListo] = useState(false);

  const handleSubir = async () => {
    if (!title || !artist) return alert("Pon título y artista");
    setSubiendo(true);
    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, artist, email, whatsapp, genre })
    });
    setSubiendo(false);
    setListo(true);
  };

  if (listo) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-5xl">✅</p>
          <h1 className="text-[24px] font-black mt-3">¡Tema enviado!</h1>
          <p className="text-gray-400 text-[14px] mt-1">El admin ya fue notificado.</p>
          <button onClick={() => setListo(false)} className="mt-6 bg-[#d4af37] text-black px-6 py-3 rounded-full font-black">Subir otro tema</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-md mx-auto">
        <p className="text-[11px] tracking-[0.3em] text-[#d4af37] font-bold text-center">UNICO DISTRO</p>
        <h1 className="text-[28px] font-black text-center mt-1">Sube tu tema</h1>
        <p className="text-center text-gray-400 text-[13px]">Distribuye a Spotify, Apple Music, TikTok</p>
        <div className="mt-6 space-y-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Nombre del tema" className="w-full bg-zinc-900 border border-white/10 rounded-full px-4 py-3.5 text-[14px] outline-none focus:border-[#d4af37]" />
          <input value={artist} onChange={e=>setArtist(e.target.value)} placeholder="Nombre del artista" className="w-full bg-zinc-900 border border-white/10 rounded-full px-4 py-3.5 text-[14px] outline-none focus:border-[#d4af37]" />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Tu email" className="w-full bg-zinc-900 border border-white/10 rounded-full px-4 py-3.5 text-[14px] outline-none focus:border-[#d4af37]" />
          <input value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="Tu WhatsApp - 829-543-5381" className="w-full bg-zinc-900 border border-white/10 rounded-full px-4 py-3.5 text-[14px] outline-none focus:border-[#d4af37]" />
          <select value={genre} onChange={e=>setGenre(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-full px-4 py-3.5 text-[14px]">
            <option>Dembow</option><option>Trap</option><option>Reggaeton</option><option>Afrobeat</option><option>Merengue</option>
          </select>
          <button onClick={handleSubir} disabled={subiendo} className="w-full bg-[#d4af37] text-black rounded-full py-4 font-black text-[15px] mt-2">
            {subiendo ? "SUBIENDO..." : "SUBIR TEMA - $5 →"}
          </button>
        </div>
      </div>
    </main>
  );
}
