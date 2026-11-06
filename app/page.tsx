"use client";
import { useState, useRef } from "react";

export default function SubirMusica() {
  const [paso, setPaso] = useState(1);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    titulo: "", artista: "", genero: "", fecha: "", whatsapp: "",
    nombreLegal: "", emailRegalias: "", featuring: "", numArtistas: "1",
    compositor: "", productor: "", explicito: "No",
    instagram: "", spotify: ""
  });

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const irPago = () => {
    if (!audioFile || !form.titulo || !form.artista || !form.genero || !form.nombreLegal) {
      alert("Falta: Audio, Título, Artista, Género y Nombre Legal");
      return;
    }
    setPaso(3);
  };

  const pagar = async () => {
    const fd = new FormData();
    fd.append("titulo", form.titulo);
    fd.append("artista", form.artista);
    fd.append("genero", form.genero);
    fd.append("fecha", form.fecha);
    fd.append("whatsapp", form.whatsapp);
    fd.append("nombreLegal", form.nombreLegal);
    fd.append("emailRegalias", form.emailRegalias);
    fd.append("featuring", form.featuring);
    fd.append("numArtistas", form.numArtistas);
    fd.append("compositor", form.compositor);
    fd.append("productor", form.productor);
    fd.append("explicito", form.explicito);
    fd.append("instagram", form.instagram);
    fd.append("spotify", form.spotify);
    if (audioFile) fd.append("audioName", audioFile.name);
    if (coverFile) fd.append("coverName", coverFile.name);
    await fetch("/api/submissions", { method: "POST", body: fd });
    window.location.href = "https://www.paypal.com/paypalme/unico2026/5";
  };

  const inputCls = "w-full bg-[#1a1a1a] border border-zinc-700 rounded-[16px] px-4 py-4 text-white outline-none focus:border-[#d4af37]";
  const labelCls = "text-zinc-300 text-[15px] mb-1 block";

  return (
    <div className="min-h-screen bg-black text-white px-5 py-8 max-w-[600px] mx-auto">
      <p className="text-[#d4af37] tracking-[0.3em] text-[13px]">PASO {paso} DE 3</p>
      <h1 className="text-[42px] font-black leading-none mt-2">Subir Música</h1>
      <p className="text-zinc-400 mt-2">Sesión: franklinflow24@gmail.com. Al final pagas <span className="text-[#d4af37] font-bold">$5 USD</span> con PayPal. Nosotros lo subimos a las plataformas (RouteNote).</p>

      {paso === 1 && (
        <>
          <div onClick={() => audioRef.current?.click()} className="mt-8 border border-dashed border-zinc-500 rounded-[20px] py-10 text-center cursor-pointer">
            <p className="font-bold text-[18px]">Audio del tema *</p>
            <p className="text-zinc-500">WAV, FLAC o MP3</p>
            <p className="text-[#d4af37] mt-1">{audioFile ? audioFile.name : "Toca para subir"}</p>
            <input ref={audioRef} type="file" accept=".wav,.flac,.mp3" className="hidden" onChange={e => setAudioFile(e.target.files?.[0] || null)} />
          </div>
          <label className={`${labelCls} mt-6`}>Título *</label>
          <input value={form.titulo} onChange={e => set("titulo", e.target.value)} placeholder="Que para tu da" className={inputCls} />
          <label className={`${labelCls} mt-4`}>Artista *</label>
          <input value={form.artista} onChange={e => set("artista", e.target.value)} placeholder="Cacon R" className={inputCls} />
          <button onClick={() => { if (!form.titulo || !form.artista || !audioFile) return alert("Falta audio, título o artista"); setPaso(2); }} className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-6">Continuar</button>
        </>
      )}

      {paso === 2 && (
        <>
          <label className={`${labelCls} mt-6`}>Nombre Legal Completo * (para regalías)</label>
          <input value={form.nombreLegal} onChange={e => set("nombreLegal", e.target.value)} placeholder="Franklin Pérez" className={inputCls} />

          <label className={`${labelCls} mt-4`}>Email para regalías *</label>
          <input value={form.emailRegalias} onChange={e => set("emailRegalias", e.target.value)} placeholder="tu@email.com" className={inputCls} />

          <label className={`${labelCls} mt-4`}>¿Cuántos artistas cantan? *</label>
          <select value={form.numArtistas} onChange={e => set("numArtistas", e.target.value)} className={inputCls}>
            <option value="1">1 - Solo yo</option>
            <option value="2">2 artistas</option>
            <option value="3">3 artistas</option>
            <option value="4">4 o más</option>
          </select>

          <label className={`${labelCls} mt-4`}>Featuring / Otros artistas (si hay)</label>
          <input value={form.featuring} onChange={e => set("featuring", e.target.value)} placeholder="Ej: Cacon R ft Yailin" className={inputCls} />

          <label className={`${labelCls} mt-4`}>Compositor / Quién escribió *</label>
          <input value={form.compositor} onChange={e => set("compositor", e.target.value)} placeholder="Quién escribió la letra" className={inputCls} />

          <label className={`${labelCls} mt-4`}>Productor del Beat *</label>
          <input value={form.productor} onChange={e => set("productor", e.target.value)} placeholder="Quién hizo el beat" className={inputCls} />

          <label className={`${labelCls} mt-4`}>Género *</label>
          <select value={form.genero} onChange={e => set("genero", e.target.value)} className={inputCls}>
            <option value="">Selecciona</option>
            <option>Dembow</option><option>Trap</option><option>Reggaeton</option><option>Drill</option><option>Afrobeat</option><option>Merengue</option><option>Otro</option>
          </select>

          <label className={`${labelCls} mt-4`}>¿Letra explícita? *</label>
          <select value={form.explicito} onChange={e => set("explicito", e.target.value)} className={inputCls}>
            <option value="No">No - Limpia</option>
            <option value="Si">Sí - Tiene malas palabras</option>
          </select>

          <label className={`${labelCls} mt-4`}>Fecha de lanzamiento</label>
          <input type="date" value={form.fecha} onChange={e => set("fecha", e.target.value)} className={inputCls} />

          <label className={`${labelCls} mt-4`}>WhatsApp (para contactarte)</label>
          <input value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} placeholder="Ej: 8091234567" className={inputCls} />

          <label className={`${labelCls} mt-4`}>Instagram / Spotify del artista</label>
          <input value={form.instagram} onChange={e => set("instagram", e.target.value)} placeholder="@tuinstagram" className={inputCls} />

          <div onClick={() => coverRef.current?.click()} className="mt-5 border border-zinc-700 rounded-[20px] p-4 flex justify-between items-center cursor-pointer">
            <div><p className="font-bold">Portada *</p><p className="text-zinc-500 text-sm">JPG/PNG · 3000x3000 {coverFile ? " - " + coverFile.name : ""}</p></div>
            <span className="text-[#d4af37]">Subir</span>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={e => setCoverFile(e.target.files?.[0] || null)} />
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setPaso(1)} className="flex-1 border border-zinc-600 py-4 rounded-full">Atrás</button>
            <button onClick={irPago} className="flex-1 bg-[#d4af37] text-black font-bold py-4 rounded-full">Ir al pago</button>
          </div>
        </>
      )}

      {paso === 3 && (
        <div className="mt-6 border border-zinc-700 rounded-[20px] p-5">
          <h2 className="text-[28px] font-black">Pagar $5 USD con PayPal</h2>
          <div className="mt-4 space-y-3 text-[16px]">
            <div className="flex justify-between"><span className="text-zinc-400">Canción</span><span>{form.titulo}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Artista</span><span>{form.artista}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Legal</span><span>{form.nombreLegal}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Featuring</span><span>{form.featuring || "Ninguno"}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Compositor</span><span>{form.compositor}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Productor</span><span>{form.productor}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Género</span><span>{form.genero}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Explícito</span><span>{form.explicito}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Tarifa</span><span className="text-[#d4af37] font-bold">$5.00 USD</span></div>
          </div>
          <p className="text-zinc-400 mt-4 text-[15px]">Las regalías son 100% del artista. Este pago es solo el servicio de distribución. Después de pagar, nosotros lo subimos a RouteNote / plataformas.</p>
          <button onClick={() => setPaso(2)} className="w-full border border-zinc-600 py-4 rounded-full mt-6">Atrás</button>
          <button onClick={pagar} className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-3">Pagar $5 con PayPal</button>
        </div>
      )}
    </div>
  );
}
