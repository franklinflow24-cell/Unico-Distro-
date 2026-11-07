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
  const inputCls = "w-full bg-[#1a1a1a] border border-zinc-700 rounded-[16px] px-4 py-4 text-white outline-none focus:border-[#d4af37] text-[15px]";
  const labelCls = "text-zinc-300 text-[14px] mb-1 block mt-4";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) setUserEmail(data.session.user.email || "");
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUserEmail(session.user.email || "");
        setView("form");
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const cargarMis = async (emailToUse: string) => {
    if (!emailToUse) return;
    const { data } = await supabase.from("releases").select("*").eq("user_email", emailToUse).order("id", { ascending: false });
    if (data) setMisReleases(data);
  };

  const loginGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin, queryParams: { prompt: "select_account" } },
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
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) return alert("Mal, crea tu cuenta");
      setView("form");
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

  const guardarYPagar = async () => {
    if (!f.whatsapp) return alert("Pon tu WhatsApp");
    if (!f.titulo || !f.artista) return alert("Falta título o artista");
    setSaving(true);
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
    const msg = `NUEVO UNICO DISTRO\n${f.titulo} - ${f.artista}\nEmail: ${userEmail}\nWA: ${f.whatsapp}\nGenero: ${f.genero}\nAudio: ${audioFile?.name}\nPortada: ${coverFile?.name} (${coverSize})\nStatus: ${row.status}`;
    window.open(`https://wa.me/${WHATSAPP_SOPORTE}?text=${encodeURIComponent(msg)}`, "_blank");
    if (!isAdmin) {
      window.open(PAYPAL_URL, "_blank");
      alert("Pedido guardado. Completa el pago de $5 en PayPal.");
    } else {
      alert("Guardado GRATIS (admin). Ya está en el panel /admin.");
    }
    cargarMis(userEmail);
    setView("mis");
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
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="" />
            Continuar con Google
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
        <p className="text-zinc-400 text-sm">{userEmail} {isAdmin && <span className="text-green-400 font-bold">ADMIN</span>}</p>
        <button onClick={() => { setPaso(1); setView("form"); }} className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-6">Subir Nuevo Tema</button>
        <button onClick={() => cargarMis(userEmail)} className="w-full border border-zinc-700 py-3 rounded-full mt-2 text-sm">Recargar</button>
        {misReleases.length === 0 && <p className="text-center text-zinc-500 mt-10">Todavia no has subido nada. Sube tu primer tema.</p>}
        {misReleases.map((r) => (
          <div key={r.id} className="mt-4 bg-zinc-900 border border-zinc-800 rounded-[16px] p-4">
            <p className="font-bold">{r.title}</p>
            <p className="text-zinc-400 text-sm">{r.artist} - {r.genre}</p>
            <p className="text-zinc-500 text-xs mt-1">Audio: {r.file_name} Portada: {r.cover_size}</p>
            <p className="mt-2 text-[12px] font-bold text-yellow-400">{r.status}</p>
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
          <p className="text-xs text-zinc-400">{userEmail} {isAdmin && <span className="text-green-400 font-bold">ADMIN</span>} <span onClick={async () => { await supabase.auth.signOut(); setUserEmail(""); setView("home"); }} className="text-red-400 cursor-pointer ml-2">Salir</span></p>
        </div>
        <p className="text-[#d4af37] tracking-[0.3em] text-[12px] mt-4">PASO {paso} DE 4</p>
        <h1 className="text-[32px] font-black mt-1">Subir Lanzamiento {isAdmin && <span className="text-green-400 text-[16px]">GRATIS</span>}</h1>
        <button onClick={() => { cargarMis(userEmail); setView("mis"); }} className="text-sm text-[#d4af37] mt-2">→ Ver Mis Lanzamientos</button>

        {paso === 1 && (
          <>
            <div onClick={() => audioRef.current?.click()} className="mt-6 border border-dashed border-zinc-500 rounded-[20px] py-8 text-center cursor-pointer">
              <p className="font-bold">Audio *</p>
              <p className="text-[#d4af37] mt-1">{audioFile ? audioFile.name : "Toca para subir WAV / FLAC"}</p>
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
                        <p className={`text-sm ${coverSize === "3000x3000" ? "text-green-400" : "text-yellow-400"}`}>Tamaño: {coverSize} {coverSize === "3000x3000" ? "✓ Perfecto" : "⚠ Pide 3000x3000"}</p>
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
            <label className
