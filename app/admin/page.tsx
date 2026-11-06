"use client";
import { useState, useRef } from "react";

export default function Admin() {
  const [tab, setTab] = useState("pendientes");
  const [status, setStatus] = useState("PENDIENTE");
  const [playing, setPlaying] = useState(false);
  const [stores, setStores] = useState([
    { name: "Spotify", state: "pending" },
    { name: "Apple Music", state: "pending" },
    { name: "TikTok", state: "pending" },
    { name: "YouTube Music", state: "pending" },
    { name: "Amazon", state: "pending" },
  ]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const aprobar = () => {
    setStatus("APROBADO");
    // Simula subiendo tienda por tienda como RouteNote
    setTimeout(() => setStores(s => s.map((t,i)=> i===0 ? {...t, state:"live"} : t)), 800);
    setTimeout(() => setStores(s => s.map((t,i)=> i===1 ? {...t, state:"review"} : t)), 1600);
    setTimeout(() => setStores(s => s.map((t,i)=> i===2 ? {...t, state:"live"} : t)), 2400);
    setTimeout(() => setStores(s => s.map((t,i)=> i===1 ? {...t, state:"live"} : t)), 3400);
    setTimeout(() => {
      setStores(s => s.map(t => ({...t, state:"live"})));
      setTab("aprobados");
    }, 4500);
  };

  const liveCount = stores.filter(s => s.state === "live").length;

  return (
    <main className="min-h-screen bg-black text-white px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] tracking-[0.3em] text-[#d4af37] font-bold">UNICO DISTRO • ADMIN</p>
            <h1 className="text-[28px] font-black leading-none mt-1">Panel de Distribución</h1>
            <p className="text-[13px] text-gray-400 mt-1">Powered by RouteNote • Tú conservas tus derechos</p>
          </div>
          <div className="h-11 w-11 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-black">U</div>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-6 text-center">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl py-3"><p className="font-black text-lg">{tab === "pendientes" ? 1 : 0}</p><p className="text-[10px] text-gray-400">PENDIENTE</p></div>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl py-3"><p className="font-black text-lg text-green-400">{tab === "aprobados" ? 1 : 0}</p><p className="text-[10px] text-gray-400">APROBADO</p></div>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl py-3"><p className="font-black text-lg">{liveCount}/{stores.length}</p><p className="text-[10px] text-gray-400">TIENDAS LIVE</p></div>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl py-3"><p className="font-black text-lg text-[#d4af37]">$5</p><p className="text-[10px] text-gray-400">COBRADO</p></div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={() => setTab("pendientes")} className={`px-4 py-2 rounded-full text-[13px] font-bold ${tab === "pendientes" ? "bg-white text-black" : "bg-zinc-900 border border-white/10"}`}>Pendientes ({tab === "pendientes" ? 1 : 0})</button>
          <button onClick={() => setTab("aprobados")} className={`px-4 py-2 rounded-full text-[13px] ${tab === "aprobados" ? "bg-white text-black font-bold" : "bg-zinc-900 border border-white/10"}`}>Aprobados ({tab === "aprobados" ? 1 : 0})</button>
          <button className="px-4 py-2 rounded-full bg-zinc-900 border border-white/10 text-[13px]">Rechazados</button>
        </div>

        <div className="mt-4 rounded-[24px] bg-zinc-900 border border-white/10 overflow-hidden">
          <div className="flex gap-4 p-5">
            <img src="https://picsum.photos/200" className="h-[90px] w-[90px] rounded-2xl object-cover" alt="cover" />
            <div className="flex-1 min-w-0">
              <div className="flex gap-2 flex-wrap">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${status === "PENDIENTE" ? "bg-yellow-500/20 text-yellow-300" : "bg-green-500/20 text-green-300"}`}>{status}</span>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 font-bold">ROUTE NOTE READY</span>
              </div>
              <h2 className="font-bold text-[18px] mt-2 leading-tight">Mi Primer Dembow</h2>
              <p className="text-[13px] text-gray-400">Artista Prueba • Dembow</p>
              <p className="text-[11px] text-gray-500 mt-0.5">UPC: Pendiente • ISRC: Auto RouteNote</p>
            </div>
          </div>

          {/* PLAYER REAL */}
          <div className="mx-5 mb-4 bg-black border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" onEnded={() => setPlaying(false)} />
            <button onClick={togglePlay} className="h-10 w-10 shrink-0 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">{playing ? "⏸" : "▶"}</button>
            <div className="flex-1">
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className={`h-full bg-[#d4af37] transition-all ${playing ? "w-[60%]" : "w-[40%]"}`}></div></div>
              <p className="text-[11px] text-gray-400 mt-1">{playing ? "Sonando ahora..." : "Preview • Dale play pa' escuchar el tema real"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-white/10 border-y border-white/10 text-[13px]">
            <div className="bg-zinc-900 p-3.5"><p className="text-[10px] text-gray-500">WHATSAPP / CONTACTO</p><p className="font-medium">829-543-5381</p></div>
            <div className="bg-zinc-900 p-3.5 min-w-0"><p className="text-[10px] text-gray-500">EMAIL</p><p className="font-medium text-[12px] break-all leading-tight">franklinflow24@gmail.com</p></div>
            <div className="bg-zinc-900 p-3.5"><p className="text-[10px] text-gray-500">LANZAMIENTO</p><p className="font-medium">7 Nov 2026 • 12:00 AM</p></div>
            <div className="bg-zinc-900 p-3.5"><p className="text-[10px] text-gray-500">DERECHOS</p><p className="font-medium">100% del artista</p></div>
          </div>

          <div className="p-5">
            {/* PROGRESO TIENDAS */}
            <div className="rounded-xl bg-black border border-white/10 p-4">
              <div className="flex justify-between items-center">
                <p className="text-[11px] text-gray-400">DISTRIBUCIÓN VIA ROUTENOTE • {liveCount}/{stores.length} LIVE</p>
                <p className="text-[11px] font-bold text-[#d4af37]">{Math.round(liveCount/stores.length*100)}%</p>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full mt-2 overflow-hidden"><div className="h-full bg-[#d4af37] transition-all duration-500" style={{width: `${liveCount/stores.length*100}%`}}></div></div>
              
              <div className="mt-3 space-y-2">
                {stores.map((s) => (
                  <div key={s.name} className="flex justify-between text-[13px]">
                    <span>{s.name}</span>
                    <span className={s.state === "live" ? "text-green-400 font-bold" : s.state === "review" ? "text-yellow-300" : "text-gray-500"}>
                      {s.state === "live" ? "✅ LIVE" : s.state === "review" ? "⏳ En revisión" : "⚪ Pendiente"}
                    </span>
                  </div>
                ))}
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
