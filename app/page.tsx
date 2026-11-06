"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Login() {
  const [user, setUser] = useState<any>(null);
  const [paso, setPaso] = useState(1);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [coverSize, setCoverSize] = useState("");
  const audioRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const [f, setF] = useState({
    titulo: "", artista: "", nombrePersonal: "", featuring: "", numArtistas: "1",
    esCover: "No", coverDe: "", compositor: "", productor: "", explicito: "No",
    genero: "", idioma: "Español", fecha: "", whatsapp: "", emailRegalias: "", sello: "UNICO DISTRO"
  });
  const set = (k: string, v: string) => setF({ ...f, [k]: v });
  const inputCls = "w-full bg-[#1a1a1a] border border-zinc-700 rounded-[16px] px-4 py-4 text-white outline-none focus:border-[#d4af37] text-[15px]";
  const labelCls = "text-zinc-300 text-[14px] mb-1 block mt-4";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user || null));
    return () => listener.subscription.unsubscribe();
  }, []);

  const loginGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/login" }
    });
  };

  const loginEmail = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      await supabase.auth.signUp({ email, password: pass });
    }
  };

  const onCover = (file: File | null) => {
    if (!file) return;
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    const img = new Image();
    img.onload = () => setCoverSize(`${img.width}x${img.height}`);
    img.src = url;
  };

  // SI NO ESTA LOGUEADO - GOOGLE FUNCIONAL
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-5">
        <div className="w-full max-w-[400px] text-center">
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6d2b]">U</div>
          <h1 className="mt-2 text-xl tracking-[0.3em]">UNICO DISTRO</h1>
          <p className="text-zinc-400 text-sm mt-2">Inicia sesión para subir tu música</p>

          {/* ESTE SI ES EL GOOGLE REAL, YA NO ES PRUEBA */}
          <button onClick={loginGoogle} className="w-full bg-white text-black font-bold py-4 rounded-full mt-6 flex items-center justify-center gap-2">
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" /> Continuar con Google
          </button>

          <div className="flex items-center gap-3 my-5"><div className="h-[1px] flex-1 bg-zinc-700" /><span className="text-zinc-500 text-xs">o con email</span><div className="h-[1px] flex-1 bg-zinc-700" /></div>
          <input id="email" placeholder="tu@email.com" className={`${inputCls} text-left`} />
          <input id="pass" type="password" placeholder="Contraseña" className={`${inputCls} mt-2 text-left`} />
          <button onClick={() => {
            const e = (document.getElementById("email") as HTMLInputElement).value;
            const p = (document.getElementById("pass") as HTMLInputElement).value;
            loginEmail(e, p);
          }} className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-4">Entrar</button>
          <a href="/" className="block text-zinc-500 text-sm mt-4">← Volver al inicio</a>
        </div>
      </div>
    );
  }

  // SI YA ESTA LOGUEADO - TU FORMULARIO CON 3000x3000 + DATOS DISTROKID
  return (
    <div className="min-h-screen bg-black text-white px-5 py-8 max-w-[600px] mx-auto">
      <div className="flex justify-between items-center">
        <a href="/" className="text-zinc-400 text-sm">← Volver</a>
        <p className="text-xs text-green-400">{user.email} - <span onClick={async () => { await supabase.auth.signOut(); setUser(null); }} className="underline cursor-pointer text-red-400">Salir</span></p>
      </div>
      <p className="text-[#d4af37] tracking-[0.3em] text-[12px] mt-4">PASO {paso} DE 4 - Logueado con Google</p>
      <h1 className="text-[32px] font-black mt-1">Subir Lanzamiento</h1>

      {paso === 1 && (
        <>
          <div onClick={() => audioRef.current?.click()} className="mt-6 border border-dashed border-zinc-500 rounded-[20px] py-8 text-center cursor-pointer">
            <p className="font-bold">Audio del tema *</p>
            <p className="text-[#d4af37] mt-1">{audioFile ? audioFile.name : "Toca para subir WAV / FLAC"}</p>
            <input ref={audioRef} type="file" accept=".wav,.flac,.mp3" className="hidden" onChange={e => setAudioFile(e.target.files?.[0] || null)} />
          </div>

          <div className="mt-4">
            <p className="font-bold">Portada * - 3000x3000</p>
            <div onClick={() => coverRef.current?.click()} className="mt-2 border border-zinc-700 rounded-[20px] overflow-hidden cursor-pointer bg-zinc-900">
              {coverPreview ? (
                <>
                  <img src={coverPreview} className="w-full aspect-square object-cover" />
                  <div className="p-4 flex justify-between"><p className="text-sm">Tamaño: {coverSize} {coverSize === "3000x3000" ? "✓ Perfecto" : "⚠ Debe ser 3000x3000"}</p><span className="text-[#d4af37] text-sm">Cambiar</span></div>
                </>
              ) : (
                <div className="aspect-square flex items-center justify-center p-8">
                  <div className="w-[200px] h-[200px] border-2 border-dashed border-zinc-600 rounded-[16px] flex items-center justify-center text-center">
                    <p className="text-zinc-500 text-sm">3000 x 3000<br/>Toca para subir<br/>Se verá aquí</p>
                  </div>
                </div>
              )}
            </div>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={e => onCover(e.target.files?.[0] || null)} />
          </div>

          <label className={labelCls}>Título *</label>
          <input value={f.titulo} onChange={e => set("titulo", e.target.value)} placeholder="Nombre de tu canción" className={inputCls} />
          <button onClick={() => { if (!audioFile || !f.titulo) return alert("Falta audio y título"); setPaso(2); }} className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-6">Continuar</button>
        </>
      )}

      {paso === 2 && (
        <>
          <h2 className="font-bold text-lg mt-6">Artista</h2>
          <label className={labelCls}>Nombre artístico *</label>
          <input value={f.artista} onChange={e => set("artista", e.target.value)} placeholder="Tu nombre artístico" className={inputCls} />
          <label className={labelCls}>Nombre personal / legal *</label>
          <input value={f.nombrePersonal} onChange={e => set("nombrePersonal", e.target.value)} placeholder="Tu nombre real" className={inputCls} />
          <label className={labelCls}>¿Cuántos artistas?</label>
          <select value={f.numArtistas} onChange={e => set("numArtistas", e.target.value)} className={inputCls}>
            <option value="1">1 - Solo yo</option><option value="2">2</option><option value="3">3</option><option value="4">4 o más</option>
          </select>
          <label className={labelCls}>Featuring</label>
          <input value={f.featuring} onChange={e => set("featuring", e.target.value)} placeholder="Si hay invitado" className={inputCls} />
          <label className={labelCls}>¿Es Cover?</label>
          <select value={f.esCover} onChange={e => set("esCover", e.target.value)} className={inputCls}>
            <option value="No">No - Original</option><option value="Si">Sí - Cover</option>
          </select>
          {f.esCover === "Si" && <><label className={labelCls}>Cover de quién?</label><input value={f.coverDe} onChange={e => set("coverDe", e.target.value)} placeholder="Artista original" className={inputCls} /></>}
          <div className="flex gap-3 mt-6">
            <button onClick={() => setPaso(1)} className="flex-1 border border-zinc-600 py-4 rounded-full">Atrás</button>
            <button onClick={() => setPaso(3)} className="flex-1 bg-[#d4af37] text-black font-bold py-4 rounded-full">Continuar</button>
          </div>
        </>
      )}

      {paso === 3 && (
        <>
          <h2 className="font-bold text-lg mt-6">Créditos y detalles</h2>
          <label className={labelCls}>Compositor *</label>
          <input value={f.compositor} onChange={e => set("compositor", e.target.value)} placeholder="Quién escribió" className={inputCls} />
          <label className={labelCls}>Productor *</label>
          <input value={f.productor} onChange={e => set("productor", e.target.value)} placeholder="Quién hizo el beat" className={inputCls} />
          <label className={labelCls}>¿Letra explícita? *</label>
          <select value={f.explicito} onChange={e => set("explicito", e.target.value)} className={inputCls}>
            <option value="No">No - Limpia</option><option value="Si">Sí - Tiene malas palabras</option>
          </select>
          <label className={labelCls}>Género</label>
          <select value={f.genero} onChange={e => set("genero", e.target.value)} className={inputCls}>
            <option value="">Selecciona</option><option>Dembow</option><option>Reggaeton</option><option>Trap</option><option>Merengue</option><option>Bachata</option><option>Otro</option>
          </select>
          <label className={
