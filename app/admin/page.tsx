"use client";
import { useState } from "react";

export default function Admin() {
  const [status, setStatus] = useState("PENDIENTE");
  const [routenote, setRoutenote] = useState("");

  const aprobar = () => {
    setStatus("APROBADO");
    setRoutenote("Subiendo a RouteNote...");
    setTimeout(() => setRoutenote("✅ En RouteNote - Enviando a 150+ tiendas"), 1500);
    setTimeout(() => setRoutenote("✅ LIVE - En Spotify, Apple Music, TikTok"), 3500);
  };

  return (
    <main className="min-h-screen bg-black text-white px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] tracking-[0.3em] text-[#d4af37] font-bold">UNICO DISTRO • ADMIN</p>
            <h1 className="text-[28px] font-black leading-none mt-1">Panel de Distribución</h1>
            <p className="text-[13px] text-gray-400 mt-1">Powered by RouteNote • Tú conservas tus derechos</p>
          </div>
          <div className="h-11 w-11 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-black">U</div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-2 mt-6 text-center">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl py-3"><p className="font-black text-lg">1</p><p className="text-[10px] text-gray-400">PENDIENTE</p></div>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl py-3"><p className="font-black text-lg text-green-400">{status === "APROBADO" ? 1 : 0}</p><p className="text-[10px] text-gray-400">APROBADO</p></div>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl py-3"><p className="font-black text-lg">150+</p><p className="text-[10px] text-gray-400">TIENDAS</p></div>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl py-3"><p className="font-black text-lg text-[#d4af37]">$5</p><p className="text-[10px] text-gray-400">COBRADO</p></div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mt-6">
          <span className="px-4 py-2 rounded-full bg-white text-black text-[13px] font-bold">Pendientes (1)</span>
          <span className="px-4 py-2 rounded-full bg-zinc-900 border border-white/10 text-[13px]">Aprobados</span>
          <span className="px-4 py-2 rounded-full bg-zinc-900 border border-white/10 text-[13px]">Rechazados</span>
        </div>

        {/* CARD COMPLETA */}
        <div className="mt-4 rounded-[24px] bg-zinc-900 border border-white/10 overflow-hidden">
          <div className="flex gap-4 p-5">
            <img src="https://picsum.photos/200" className="h-[90px] w-[90px] rounded-2xl object-cover" alt="cover" />
            <div className="flex-1">
              <div className="flex gap-2">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${status === "PENDIENTE" ? "bg-yellow-500/20 text-yellow-300" : "bg-green-500/20 text-green-300"}`}>{status}</span>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 font-bold">ROUTE NOTE READY</span>
              </div>
              <h2 className="font-bold text-[18px] mt-2 leading-tight">Mi Primer Dembow</h2>
              <p className="text-[13px] text-gray-400">Artista Prueba • Dembow</p>
              <p className="text-[11px] text-gray-500 mt-0.5">UPC: Pendiente • ISRC: Auto RouteNote</p>
            </div>
          </div>

          {/* PLAYER */}
          <div className="mx-5 mb-4 bg-black border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center font-bold">▶</div>
            <div className="flex-1">
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full w-[40%] bg-[#d4af37]"></div></div>
              <p className="text-[11px] text-gray-400 mt-1">Preview • 1:12 / 3:24 • MP3 320kbps</p>
            </div>
          </div>

          {/* DETALLES GRID */}
          <div className="grid grid-cols-2 gap-px bg-white/10 border-y border-white/10 text-[13px]">
            <div className="bg-zinc-900 p-3.5"><p className="text-[10px] text-gray-500">WHATSAPP / CONTACTO</p><p className="font-medium">829-543-5381</p></div>
            <div className="bg-zinc-900 p-3.5"><p className="text-[10px] text-gray-500">EMAIL</p><p className="font-medium truncate">franklinflow24@gmail.com</p></div>
            <div className="bg-zinc-900 p-3.5"><p className="text-[10px] text-gray-500">LANZAMIENTO</p><p className="font-medium">7 Nov 2026 • 12:00 AM</p></div>
            <div className="bg-zinc-900 p-3.5"><p className="text-[10px] text-gray-500">DERECHOS</p><p className="font-medium">100% del artista</p></div>
          </div>

          {/* ROUTENOTE STATUS */}
          <div className="p-5">
            <div className="rounded-xl bg-black border border-white/10 p-3.5">
              <p className="text-[11px] text-gray-400">DISTRIBUCIÓN VIA ROUTENOTE</p>
              <p className="text-[13px] font-medium mt-1">{routenote || "Listo para enviar a RouteNote • Spotify, Apple Music, TikTok, YouTube Music + 150 tiendas"}</p>
              <div className="flex gap-1.5 mt-3">
                <span className="text-[10px] px-2 py-1 rounded bg-white/10">Spotify</span>
                <span className="text-[10px] px-2 py-1 rounded bg-white/10">Apple Music</span>
                <span className="text-[10px] px-2 py-1 rounded bg-white/10">TikTok</span>
                <span className="text-[10px] px-2 py-1 rounded bg-white/10">+147 más</span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={aprobar} className="flex-1 bg-[#d4af37] text-black rounded-full py-3.5 font-black text-[14px]">APROBAR Y ENVIAR A ROUTENOTE →</button>
              <button className="px-5 bg-red-600 rounded-full py-3.5 font-bold text-[14px]">Rechazar</button>
            </div>
            <div className="flex gap-3 mt-3">
              <a href="https://wa.me/18295435381" className="flex-1 text-center border border-white/20 rounded-full py-2.5 text-[13px]">WhatsApp Artista</a>
              <button className="flex-1 border border-white/20 rounded-full py-2.5 text-[13px]">Ver Portada Full</button>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-600 mt-8">UNICO DISTRO © 2026 • Distribución vía RouteNote • Hecho en RD</p>
      </div>
    </main>
  );
}
