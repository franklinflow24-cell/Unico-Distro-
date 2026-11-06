"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [paso, setPaso] = useState(1);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const [f, setF] = useState({
    titulo: "", artista: "", nombreLegal: "", cedula: "", emailRegalias: "", whatsapp: "",
    numArtistas: "1", featuring: "", esCover: "No", coverOriginalDe: "",
    compositor: "", productor: "", sello: "UNICO DISTRO",
    genero: "", genero2: "", idioma: "Español", explicito: "No",
    fecha: "", instagram: "", spotify: "", tiktok: "", derechos: "Si"
  });
  const set = (k: string, v: string) => setF({ ...f, [k]: v });

  const inputCls = "w-full bg-[#1a1a1a] border border-zinc-700 rounded-[16px] px-4 py-4 text-white outline-none focus:border-[#d4af37] text-[15px]";
  const labelCls = "text-zinc-300 text-[14px] mb-1 block mt-4";

  const pagar = async () => {
    const fd = new FormData();
    Object.entries(f).forEach(([k, v]) => fd.append(k, v));
    if (audioFile) fd.append("audioName", audioFile.name);
    if (coverFile) fd.append("coverName", coverFile.name);
    await fetch("/api/submissions", { method: "POST", body: fd });
    window.location.href = "https://www.paypal.com/paypalme/unico2026/5";
  };

  // ===== VISTA FORMULARIO COMPLETO TIPO DISTROKID =====
  if (showForm) {
    return (
      <div className="min-h-screen bg-black text-white px-5 py-8 max-w-[600px] mx-auto">
        <button onClick={() => setShowForm(false)} className="text-zinc-400 text-sm">← Volver a UNICO DISTRO</button>
        <p className="text-[#d4af37] tracking-[0.3em] text-[12px] mt-4">PASO {paso} DE 5 - COMO DISTROKID</p>
        <h1 className="text-[38px] font-black leading-none mt-2">Subir Lanzamiento</h1>
        <p className="text-zinc-400 mt-1 text-sm">Llena todo, esto es lo que Spotify / Apple piden. Si falta algo, te lo rebotan.</p>

        {paso === 1 && (
          <>
            <div onClick={() => audioRef.current?.click()} className="mt-6 border border-dashed border-zinc-500 rounded-[20px] py-8 text-center cursor-pointer">
              <p className="font-bold">1. Audio del tema *</p>
              <p className="text-zinc-500 text-sm">WAV o FLAC (mejor que MP3)</p>
              <p className="text-[#d4af37] mt-1">{audioFile ? audioFile.name : "Toca para subir"}</p>
              <input ref={audioRef} type="file" accept=".wav,.flac,.mp3" className="hidden" onChange={e => setAudioFile(e.target.files?.[0] || null)} />
            </div>
            <div onClick={() => coverRef.current?.click()} className="mt-3 border border-zinc-700 rounded-[20px] p-4 flex justify-between items-center cursor-pointer">
              <div><p className="font-bold">2. Portada *</p><p className="text-zinc-500 text-sm">3000x3000 JPG/PNG {coverFile ? "- " + coverFile.name : ""}</p></div>
              <span className="text-[#d4af37]">Subir</span>
              <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={e => setCoverFile(e.target.files?.[0] || null)} />
            </div>
            <label className={labelCls}>Título de la canción *</label>
            <input value={f.titulo} onChange={e => set("titulo", e.target.value)} placeholder="Ej: Que para tu da" className={inputCls} />
            <label className={labelCls}>Versión / Mix (si tiene)</label>
            <input placeholder="Ej: Remix, Sped Up, Acapella - dejar vacío si es original" className={inputCls} />
            <button onClick={() => { if (!audioFile || !f.titulo) return alert("Falta audio y título"); setPaso(2); }} className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-6">Continuar → Artista</button>
          </>
        )}

        {paso === 2 && (
          <>
            <h2 className="font-bold text-lg mt-6">Datos del Artista</h2>
            <label className={labelCls}>Nombre artístico *</label>
            <input value={f.artista} onChange={e => set("artista", e.target.value)} placeholder="Cacon R" className={inputCls} />
            <label className={labelCls}>Nombre personal / legal * (pa' regalías)</label>
            <input value={f.nombreLegal} onChange={e => set("nombreLegal", e.target.value)} placeholder="Franklin Pérez" className={inputCls} />
            <label className={labelCls}>Cédula / ID</label>
            <input value={f.cedula} onChange={e => set("cedula", e.target.value)} placeholder="001-xxxxxxx-x" className={inputCls} />
            <label className={labelCls}>¿Cuántos artistas cantan? *</label>
            <select value={f.numArtistas} onChange={e => set("numArtistas", e.target.value)} className={inputCls}>
              <option value="1">1 - Solo yo</option><option value="2">2 artistas</option><option value="3">3 artistas</option><option value="4">4 o más</option>
            </select>
            <label className={labelCls}>Featuring / Artistas invitados</label>
            <input value={f.featuring} onChange={e => set("featuring", e.target.value)} placeholder="Ej: ft Yailin, ft El Alfa" className={inputCls} />
            <label className={labelCls}>Instagram / Spotify / TikTok del artista</label>
            <input value={f.instagram} onChange={e => set("instagram", e.target.value)} placeholder="@tuinstagram" className={inputCls} />
            <input value={f.spotify} onChange={e => set("spotify", e.target.value)} placeholder="Link Spotify si ya tienes" className={`${inputCls} mt-2`} />
            <div className="flex gap-3 mt-6">
              <button onClick={() => setPaso(1)} className="flex-1 border border-zinc-600 py-4 rounded-full">Atrás</button>
              <button onClick={() => { if (!f.artista || !f.nombreLegal) return alert("Falta artista y nombre legal"); setPaso(3); }} className="flex-1 bg-[#d4af37] text-black font-bold py-4 rounded-full">Continuar</button>
            </div>
          </>
        )}

        {paso === 3 && (
          <>
            <h2 className="font-bold text-lg mt-6">Derechos y Créditos</h2>
            <label className={labelCls}>¿Es un Cover? *</label>
            <select value={f.esCover} onChange={e => set("esCover", e.target.value)} className={inputCls}>
              <option value="No">No - Es tema original mío</option><option value="Si">Sí - Es cover de otro artista</option>
            </select>
            {f.esCover === "Si" && (
              <>
                <label className={labelCls}>¿De quién es la canción original?</label>
                <input value={f.coverOriginalDe} onChange={e => set("coverOriginalDe", e.target.value)} placeholder="Ej: Cover de Juan Luis Guerra" className={inputCls} />
              </>
            )}
            <label className={labelCls}>Compositor / Quién escribió la letra *</label>
            <input value={f.compositor} onChange={e => set("compositor", e.target.value)} placeholder="Nombre de quien escribió" className={inputCls} />
            <label className={labelCls}>Productor / Quién hizo el beat *</label>
            <input value={f.productor} onChange={e => set("productor", e.target.value)} placeholder="Nombre del productor" className={inputCls} />
            <label className={labelCls}>¿Tienes los derechos de la pista? *</label>
            <select value={f.derechos} onChange={e => set("derechos", e.target.value)} className={inputCls}>
              <option value="Si">Sí - Yo compré / hice el beat</option><option value="No">No - Es beat de YouTube sin licencia</option>
            </select>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setPaso(2)} className="flex-1 border border-zinc-600 py-4 rounded-full">Atrás</button>
              <button onClick={() => setPaso(4)} className="flex-1 bg-[#d4af37] text-black font-bold py-4 rounded-full">Continuar</button>
            </div>
          </>
        )}

        {paso === 4 && (
          <>
            <h2 className="font-bold text-lg mt-6">Detalles para Spotify</h2>
            <label className={labelCls}>Género principal *</label>
            <select value={f.genero} onChange={e => set("genero", e.target.value)} className={inputCls}>
              <option value="">Selecciona</option><option>Dembow</option><option>Reggaeton</option><option>Trap</option><option>Drill</option><option>Afrobeat</option><option>Merengue</option><option>Bachata</option><option>Otro</option>
            </select>
            <label className={labelCls}>Género secundario</label>
            <input value={f.genero2} onChange={e => set("genero2", e.target.value)} placeholder="Ej: Trap" className={inputCls} />
            <label className={labelCls}>Idioma *</label>
            <select value={f.idioma} onChange={e => set("idioma", e.target.value)} className={inputCls}>
              <option>Español</option><option>Inglés</option><option>Spanglish</option><option>Otro</option>
            </select>
            <label className={labelCls}>¿Letra explícita? * (Si tiene malas palabras pon Sí)</label>
            <select value={f.explicito} onChange={e => set("explicito", e.target.value)} className={inputCls}>
              <option value="No">No - Limpia</option><option value="Si">Sí - Explícita</option>
            </select>
            <label className={labelCls}>Fecha de lanzamiento deseada</label>
            <input type="date" value={f.fecha} onChange={e => set("fecha", e.target.value)} className={inputCls} />
            <label className={labelCls}>Sello discográfico</label>
            <input value={f.sello} onChange={e => set("sello", e.target.value)} className={inputCls} />
            <div className="flex gap-3 mt-6">
              <button onClick={() => setPaso(3)} className="flex-1 border border-zinc-600 py-4 rounded-full">Atrás</button>
              <button onClick={() => setPaso(5)} className="flex-1 bg-[#d4af37] text-black font-bold py-4 rounded-full">Continuar</button>
            </div>
          </>
        )}

        {paso === 5 && (
          <>
            <h2 className="font-bold text-lg mt-6">Pago y Regalías</h2>
            <label className={labelCls}>WhatsApp *</label>
            <input value={f.whatsapp} onChange={e => set("whatsapp", e.target.value)} placeholder="8091234567" className={inputCls} />
            <label className={labelCls}>Email donde te llegan las regalías *</label>
            <input value={f.emailRegalias} onChange={e => set("emailRegalias", e.target.value)} placeholder="tu@email.com" className={inputCls} />
            <div className="mt-5 bg-zinc-900 rounded-[16px] p-4 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-zinc-400">Tema</span><span>{f.titulo}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Artista</span><span>{f.artista} {f.featuring ? `ft ${f.featuring}` : ""}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Legal</span><span>{f.nombreLegal}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Cover?</span><span>{f.esCover} {f.coverOriginalDe}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Compositor</span><span>{f.compositor}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Productor</span><span>{f.productor}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Género</span><span>{f.genero}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Explícito</span><span>{f.explicito}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Total</span><span className="text-[#d4af37] font-bold">$5 USD</span></div>
            </div>
            <p className="text-zinc-400 text-xs mt-3">Al pagar confirmas que eres dueño del tema o tienes permiso. Regalías 100% tuyas.</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setPaso(4)} className="flex-1 border border-zinc-600 py-4 rounded-full">Atrás</button>
              <button onClick={pagar} className="flex-1 bg-[#d4af37] text-black font-bold py-4 rounded-full">Pagar $5 con PayPal</button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ===== TU HOME ORIGINAL QUE ME MANDASTE =====
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-[#d4af37]/15 blur-[100px] animate-pulse" />
        <div className="absolute -right-20 bottom-10 h-[380px] w-[380px] rounded-full bg-purple-700/20 blur-[110px] animate-pulse" />
        <div className="absolute left-1/3 top-1/3 h-[260px] w-[260px] rounded-full bg-cyan-500/10 blur-[90px] animate-pulse" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 pb-16 pt-14 text-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="text-7xl leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6d2b]">U</div>
          <h1 className="mt-2 text-2xl tracking-[0.35em] font-light">UNICO DISTRO</h1>
          <p className="mt-1 text-[10px] tracking-[0.45em] text-[#d4af37]">MUSIC DISTRIBUTION</p>
        </div>

        <h2 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
          Distribuye tu música al <span className="text-[#d4af37]">mundo</span>
        </h2>

        <p className="mt-5 max-w-2xl text-base text-gray-400 md:text-lg">
          La distribuidora de RD para nuevos talentos. Sube tu tema, paga{" "}
          <span className="font-semibold text-[#f5d37f]">$5 USD</span> por lanzamiento y nosotros
          lo llevamos a las plataformas. Tú conservas tus derechos.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <button onClick={() => setShowForm(true)} className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black">Subir Música</button>
          <button onClick={() => setShowForm(true)} className="rounded-full border border-white/40 px-8 py-3.5 text-sm font-medium">Iniciar Sesión</button>
        </div>

        <a href="https://wa.me/18295435381?text=Hola%20UNICO%20DISTRO%2C%20necesito%20soporte" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#25D366]/50 bg-[#25D366]/10 px-5 py-2.5 text-sm font-medium text-[#25D366]">
          Contactar con soporte (WhatsApp)
        </a>
        <p className="mt-2 text-xs text-gray-600">829-543-5381</p>

        <div className="mt-14 w-full">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-gray-500">Disponible en las principales plataformas</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {["Spotify","Apple Music","Deezer","TikTok","YouTube Music","Amazon Music","Instagram","+150 más"].map((name) => (
              <div key={name} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4">
                <p className="font-semibold text-white">{name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid w-full gap-4 text-left md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <p className="text-xs tracking-widest text-[#d4af37]">01</p>
            <h3 className="mt-2 text-lg font-bold">Sube tu tema</h3>
            <p className="mt-2 text-sm text-gray-400">Audio, portada y todos los datos como DistroKid.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <p className="text-xs tracking-widest text-[#d4af37]">02</p>
            <h3 className="mt-2 text-lg font-bold">Paga $5 USD</h3>
            <p className="mt-2 text-sm text-gray-400">Un pago por lanzamiento. Tú conservas tus derechos.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <p className="text-xs tracking-widest text-[#d4af37]">03</p>
            <h3 className="mt-2 text-lg font-bold">Va a las plataformas</h3>
            <p className="mt-2 text-sm text-gray-400">Nosotros lo subimos a Spotify, Apple y más.</p>
          </div>
        </div>

        <p className="mt-16 text-xs text-gray-600">© 2026 UNICO DISTRO</p>
      </div>
    </div>
  );
}
