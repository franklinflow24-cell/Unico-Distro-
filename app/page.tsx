"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uxaupuajpfdvswnttysv.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YXVwdWFqcGZkdnN3bnR0eXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MTYxMjIsImV4cCI6MjEwODk5MjEyMn0.cFINxKq7WCHWjCCFSiYQJRht4AyP80MA8A2xiRyBRjM"
);

const ADMIN_EMAIL = "franklinflow24@gmail.com";
const PAYPAL_URL = "https://paypal.me/fernando2814/5USD";
const WHATSAPP_SOPORTE = "18295435381";

export default function Home() {
  const [view, setView] = useState<"home" | "auth" | "form" | "mis">("home");
  const [authTab, setAuthTab] = useState<"login" | "crear">("login");
  const [userEmail, setUserEmail] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [nombreCuenta, setNombreCuenta] = useState("");
  const [paso, setPaso] = useState(1);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [coverSize, setCoverSize] = useState("");
  const [saving, setSaving] = useState(false);
  const [misReleases, setMisReleases] = useState<any[]>([]);
  const audioRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const isAdmin = userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const [f, setF] = useState({
    titulo: "",
    artista: "",
    nombrePersonal: "",
    cedula: "",
    cantaSolo: "Si",
    numArtistas: "1",
    featuring: "",
    esCover: "No",
    coverDe: "",
    compositor: "",
    productor: "",
    explicito: "No",
    genero: "",
    idioma: "Español",
    fecha: "",
    whatsapp: "",
    emailRegalias: "",
    sello: "UNICO DISTRO",
    instagram: "",
  });

  const set = (k: string, v: string) => setF({ ...f, [k]: v });
  const inputCls =
    "w-full bg-[#1a1a1a] border border-zinc-700 rounded-[16px] px-4 py-4 text-white outline-none focus:border-[#d4af37] text-[15px]";
  const labelCls = "text-zinc-300 text-[14px] mb-1 block mt-4";

  const cargarMisSubidas = async (emailToUse: string) => {
    const { data } = await supabase
      .from("releases")
      .select("*")
      .eq("user_email", emailToUse)
      .order("created_at", { ascending: false });
    if (data) setMisReleases(data);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) {
        setUserEmail(data.session.user.email);
        cargarMisSubidas(data.session.user.email);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUserEmail(session.user.email || "");
        cargarMisSubidas(session.user.email || "");
        setView("form");
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loginGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: "select_account" },
      },
    });
  };

  const entrar = async () => {
    if (!email || !pass) return alert("Pon email y contraseña");
    if (authTab === "crear") {
      if (!nombreCuenta) return alert("Pon tu nombre");
      const { error } = await supabase.auth.signUp({ email, password: pass });
      if (error) return alert(error.message);
      alert("Cuenta creada, ahora entra");
      setAuthTab("login");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) return alert("Mal, crea tu cuenta");
      setView("form");
    }
  };

  // ARREGLADO LO DE 3000x3000
  const onCover = (file: File | null) => {
    if (!file) return;
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    const img = new Image();
    img.onload = () => {
      const sizeText = `${img.width}x${img.height}`;
      setCoverSize(sizeText);
    };
    img.src = url;
  };

  const guardarYPagar = async () => {
    if (!f.whatsapp) return alert("Pon tu WhatsApp");
    if (!f.titulo || !f.artista) return alert("Falta título o artista");
    setSaving(true);

    let audioUrl = "";
    let coverUrl = "";

    // Subir archivos a Supabase Storage si tienes los buckets
    try {
      if (audioFile) {
        const audioName = `${Date.now()}_${audioFile.name}`;
        const { data } = await supabase.storage.from("audios").upload(audioName, audioFile);
        if (data) {
          const { data: pub } = supabase.storage.from("audios").getPublicUrl(audioName);
          audioUrl = pub.publicUrl;
        }
      }
      if (coverFile) {
        const coverName = `${Date.now()}_${coverFile.name}`;
        const { data } = await supabase.storage.from("covers").upload(coverName, coverFile);
        if (data) {
          const { data: pub } = supabase.storage.from("covers").getPublicUrl(coverName);
          coverUrl = pub.publicUrl;
        }
      }
    } catch (e) {
      console.log("storage no configurado, sigue solo con nombres");
    }

    const row = {
      title: f.titulo,
      artist: f.artista,
      nombre_personal: f.nombrePersonal,
      cedula: f.cedula,
      genre: f.genero,
      release_date: f.fecha,
      file_name: audioFile?.name || "",
      cover_name: coverFile?.name || "",
      cover_size: coverSize,
      audio_url: audioUrl,
      cover_url: coverUrl,
      user_email: userEmail,
      whatsapp: f.whatsapp,
      email_regalias: f.emailRegalias,
      compositor: f.compositor,
      productor: f.productor,
      explicito: f.explicito,
      canta_solo: f.cantaSolo,
      featuring: f.featuring,
      es_cover: f.esCover,
      idioma: f.idioma,
      instagram: f.instagram,
      fee: isAdmin ? "0.00" : "5.00",
      status: isAdmin ? "pagado_revisar" : "esperando_paypal",
    };

    const { error } = await supabase.from("releases").insert(row);
    setSaving(false);

    if (error) {
      alert("Error al guardar: " + error.message + "\n¿Corriste el SQL en Supabase?");
      return;
    }

    await cargarMisSubidas(userEmail);
    setView("mis");

    const msg = `NUEVO UNICO DISTRO\n${f.titulo} - ${f.artista}\nEmail: ${userEmail}\nWA: ${f.whatsapp}\nGénero: ${f.genero}\nAudio: ${audioFile?.name}\nPortada: ${coverFile?.name} (${coverSize})\nStatus: ${row.status}`;
    window.open(`https://wa.me/${WHATSAPP_SOPORTE}?text=${encodeURIComponent(msg)}`, "_blank");

    if (!isAdmin) {
      window.open(PAYPAL_URL, "_blank");
      alert("Pedido guardado. Completa el pago de $5 en PayPal. Ya lo ves en Mis Subidas como PENDIENTE.");
    } else {
      alert("Guardado GRATIS (admin). Ya está en el panel /admin y en Mis Subidas.");
    }
  };

  if (view === "auth") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-5">
        <div className="w-full max-w-[420px]">
          <button onClick={() => setView("home")} className="text-zinc-400 text-sm">← Volver</button>
          <div className="text-center mt-6">
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6d2b]">U</div>
            <h1 className="mt-2 text-xl tracking-[0.3em]">UNICO DISTRO</h1>
            <p className="text-zinc-400 text-sm mt-2">{authTab === "login" ? "Inicia sesión" : "Crea tu cuenta gratis"}</p>
          </div>
          <button onClick={loginGoogle} className="w-full bg-white text-black font-bold py-4 rounded-full mt-6 flex items-center justify-center gap-2">
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="" /> Continuar con Google
          </button>
          <div className="flex gap-2 mt-5 bg-zinc-900 p-1 rounded-full">
            <button onClick={() => setAuthTab("login")} className={`flex-1 py-2.5 rounded-full text-sm font-bold ${authTab === "login" ? "bg-[#d4af37] text-black" : "text-zinc-400"}`}>Iniciar Sesión</button>
            <button onClick={() => setAuthTab("crear")} className={`flex-1 py-2.5 rounded-full text-sm font-bold ${authTab === "crear" ? "bg-[#d4af37] text-black" : "text-zinc-400"}`}>Crear Cuenta</button>
          </div>
          {authTab === "crear" && (
            <>
              <label className={labelCls}>Nombre artístico *</label>
              <input value={nombreCuenta} onChange={(e) => setNombreCuenta(e.target.value)} placeholder="Tu nombre artístico" className={inputCls} />
            </>
          )}
          <label className={labelCls}>Email *</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className={inputCls} />
          <label className={labelCls}>Contraseña *</label>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" className={inputCls} />
          <button onClick={entrar} className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-6">{authTab === "login" ? "Entrar y Subir Música" : "Crear Cuenta y Subir"}</button>
        </div>
      </div>
    );
  }

  if (view === "mis") {
    return (
      <div className="min-h-screen bg-black text-white px-5 py-8 max-w-[600px] mx-auto">
        <button onClick={() => setView("home")} className="text-zinc-400 text-sm">← Volver</button>
        <h1 className="text-[28px] font-black mt-4">Mis Lanzamientos</h1>
        <p className="text-zinc-400 text-sm">{userEmail}</p>
        <button onClick={() => setView("form")} className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-6">+ Subir Nuevo Tema</button>
        {misReleases.length === 0 && <p className="text-center text-zinc-500 mt-10">Todavía no has subido nada. Lo que subas aparece aquí.</p>}
        {misReleases.map((r) => (
          <div key={r.id} className="mt-4 bg-zinc-900 border border-zinc-800 rounded-[16px] p-4">
            <div className="flex gap-3">
              {r.cover_url ? <img src={r.cover_url} className="w-[60px] h-[60px] rounded-lg object-cover" alt="" /> : coverPreview ? null : null}
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-bold">{r.title}</p>
                    <p className="text-zinc-400 text-sm">{r.artist} • {r.genre}</p>
                    <p className="text-zinc-500 text-xs mt-1">Audio: {r.file_name} • Portada: {r.cover_size}</p>
                    {r.audio_url && <audio controls src={r.audio_url} className="w-full mt-2 h-[32px]" />}
                  </div>
                  <span className={`shrink-0 text-[11px] font-bold px-3 py-1 rounded-full ${r.status === 'subido' || r.status === 'aprobado' ? 'bg-green-500 text-black' : r.status === 'pagado_revisar' ? 'bg-yellow-400 text-black' : 'bg-zinc-700 text-white'}`}>
                    {r.status === 'esperando_paypal' ? 'PENDIENTE' : r.status === 'pagado_revisar' ? 'PENDIENTE' : r.status === 'subido' ? 'SUBIDO ✓' : r.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (view === "form") {
    return (
      <div className="min-h-screen bg-black text-white px-5 py-8 max-w-[600px] mx-auto">
        <div className="flex justify-between items-center">
          <button onClick={() => setView("home")} className="text-zinc-400 text-sm">← Volver</button>
          <p className="text-xs text-zinc-400">
            {userEmail} {isAdmin && <span className="text-green-400 font-bold">ADMIN</span>}
            <span onClick={async () => { await cargarMisSubidas(userEmail); setView("mis"); }} className="text-[#d4af37] cursor-pointer ml-2">Mis Subidas</span>
            <span onClick={async () => { await supabase.auth.signOut(); setUserEmail(""); setView("home"); }} className="text-red-400 cursor-pointer ml-2">Salir</span>
          </p>
        </div>
        <p className="text-[#d4af37] tracking-[0.3em] text-[12px] mt-4">PASO {paso} DE 4</p>
        <h1 className="text-[32px] font-black mt-1">Subir Lanzamiento {isAdmin && <span className="text-green-400 text-[16px]">GRATIS</span>}</h1>

        {paso === 1 && (
          <>
            <div onClick={() => audioRef.current?.click()} className="mt-6 border border-dashed border-zinc-500 rounded-[20px] py-8 text-center cursor-pointer">
              <p className="font-bold">Audio *</p>
              <p className="text-[#d4af37] mt-1">{audioFile ? audioFile.name : "Toca para subir WAV / FLAC"}</p>
              {audioFile && <audio controls src={URL.createObjectURL(audioFile)} className="w-full mt-3 px-4" />}
              <input ref={audioRef} type="file" accept=".wav,.flac,.mp3" className="hidden" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
            </div>
            <div className="mt-4">
              <p className="font-bold">Portada * - 3000x3000</p>
              <div onClick={() => coverRef.current?.click()} className="mt-2 border border-zinc-700 rounded-[20px] overflow-hidden cursor-pointer bg-zinc-900">
                {coverPreview ? (
                  <>
                    <img src={coverPreview} className="w-full aspect-square object-cover" alt="cover" />
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold">{coverFile?.name}</p>
                        <p className={`text-sm ${coverSize === "3000x3000" ? "text-green-400" : "text-yellow-400"}`}>
                          Tamaño: {coverSize} {coverSize === "3000x3000" ? "✓ Perfecto" : "⚠ Pide 3000x3000"}
                        </p>
                      </div>
                      <span className="text-[#d4af37] text-sm">Cambiar</span>
                    </div>
                  </>
                ) : (
                  <div className="aspect-square flex flex-col items-center justify-center p-8">
                    <div className="w-[220px] h-[220px] border-2 border-dashed border-zinc-600 rounded-[16px] flex items-center justify-center text-center">
                      <p className="text-zinc-500 text-sm">3000 x 3000<br />Toca para subir</p>
                    </div>
                  </div>
                )}
              </div>
              <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => onCover(e.target.files?.[0] || null)} />
            </div>
            <label className={labelCls}>Título *</label>
            <input value={f.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="Nombre de tu canción" className={inputCls} />
            <button onClick={() => { if (!audioFile || !f.titulo) return alert("Falta audio y título"); setPaso(2); }} className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-6">Continuar → Artista</button>
          </>
        )}

        {paso === 2 && (
          <>
            <h2 className="font-bold text-lg mt-6">Info del artista</h2>
            <label className={labelCls}>Nombre artístico *</label>
            <input value={f.artista} onChange={(e) => set("artista", e.target.value)} placeholder="Tu nombre artístico" className={inputCls} />
            <label className={labelCls}>Nombre personal / legal *</label>
            <input value={f.nombrePersonal} onChange={(e) => set("nombrePersonal", e.target.value)} placeholder="Tu nombre real" className={inputCls} />
            <label className={labelCls}>Cédula</label>
            <input value={f.cedula} onChange={(e) => set("cedula", e.target.value)} placeholder="Tu cédula" className={inputCls} />
            <label className={labelCls}>¿Cantas solo? *</label>
            <select value={f.cantaSolo} onChange={(e) => set("cantaSolo", e.target.value)} className={inputCls}>
              <option value="Si">Sí - Canto solo</option>
              <option value="No">No - Somos varios</option>
            </select>
            <label className={labelCls}>¿Cuántos artistas?</label>
            <select value={f.numArtistas} onChange={(e) => set("numArtistas", e.target.value)} className={inputCls}>
              <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4 o más</option>
            </select>
            {f.cantaSolo === "No" && (
              <>
                <label className={labelCls}>Featuring</label>
                <input value={f.featuring} onChange={(e) => set("featuring", e.target.value)} placeholder="Otros artistas" className={inputCls} />
              </>
            )}
            <label className={labelCls}>Instagram</label>
            <input value={f.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@tuinstagram" className={inputCls} />
            <div className="flex gap-3 mt-6">
              <button onClick={() => setPaso(1)} className="flex-1 border border-zinc-600 py-4 rounded-full">Atrás</button>
              <button onClick={() => { if (!f.artista || !f.nombrePersonal) return alert("Falta artista y personal"); setPaso(3); }} className="flex-1 bg-[#d4af37] text-black font-bold py-4 rounded-full">Continuar</button>
            </div>
          </>
        )}

        {paso === 3 && (
          <>
            <h2 className="font-bold text-lg mt-6">Derechos y letra</h2>
            <label className={labelCls}>¿Es Cover? *</label>
            <select value={f.esCover} onChange={(e) => set("esCover", e.target.value)} className={inputCls}>
              <option value="No">No - Original</option><option value="Si">Sí - Cover</option>
            </select>
            {f.esCover === "Si" && (
              <>
                <label className={labelCls}>¿De quién?</label>
                <input value={f.coverDe} onChange={(e) => set("coverDe", e.target.value)} placeholder="Artista original" className={inputCls} />
              </>
            )}
            <label className={labelCls}>Compositor *</label>
            <input value={f.compositor} onChange={(e) => set("compositor", e.target.value)} placeholder="Quién escribió" className={inputCls} />
            <label className={labelCls}>Productor *</label>
            <input value={f.productor} onChange={(e) => set("productor", e.target.value)} placeholder="Quién hizo el beat" className={inputCls} />
            <label className={labelCls}>¿Letra explícita? *</label>
            <select value={f.explicito} onChange={(e) => set("explicito", e.target.value)} className={inputCls}>
              <option value="No">No - Limpia</option><option value="Si">Sí - Explícita</option>
            </select>
            <label className={labelCls}>Género *</label>
            <select value={f.genero} onChange={(e) => set("genero", e.target.value)} className={inputCls}>
              <option value="">Selecciona</option><option>Dembow</option><option>Reggaeton</option><option>Trap</option><option>Merengue</option><option>Bachata</option><option>Otro</option>
            </select>
            <label className={labelCls}>Idioma</label>
            <select value={f.idioma} onChange={(e) => set("idioma", e.target.value)} className={inputCls}>
              <option>Español</option><option>Inglés</option><option>Spanglish</option>
            </select>
            <label className={labelCls}>Fecha lanzamiento</label>
            <input type="date" value={f.fecha} onChange={(e) => set("fecha", e.target.value)} className={inputCls} />
            <div className="flex gap-3 mt-6">
              <button onClick={() => setPaso(2)} className="flex-1 border border-zinc-600 py-4 rounded-full">Atrás</button>
              <button onClick={() => s
