"use client";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uxaupuajpfdvswnttysv.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YXVwdWFqcGZkdnN3bnR0eXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MTYxMjIsImV4cCI6MjEwODk5MjEyMn0.cFINxKq7WCHWjCCFSiYQJRht4AyP80MA8A2xiRyBRjM"
);

const ADMIN_EMAIL = "franklinflow24@gmail.com";
const PAYPAL_URL = "https://paypal.me/fernando2814/5USD";
const WHATSAPP_SOPORTE = "18295435381";

export default function Home() {
  const [view, setView] = useState("home");
  const [authTab, setAuthTab] = useState("login");
  const [userEmail, setUserEmail] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [nombreCuenta, setNombreCuenta] = useState("");
  const [paso, setPaso] = useState(1);
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [coverSize, setCoverSize] = useState("");
  const [saving, setSaving] = useState(false);
  const [misReleases, setMisReleases] = useState([]);
  const audioRef = useRef(null);
  const coverRef = useRef(null);
  const isAdmin = userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const [f, setF] = useState({
    titulo: "", artista: "", nombrePersonal: "", cedula: "", cantaSolo: "Si", numArtistas: "1", featuring: "", esCover: "No", coverDe: "", compositor: "", productor: "", explicito: "No", genero: "", idioma: "Español", fecha: "", whatsapp: "", emailRegalias: "", sello: "UNICO DISTRO", instagram: "",
  });

  const set = (k, v) => setF({ ...f, [k]: v });
  const inputCls = "w-full bg-[#1a1a1a] border border-zinc-700 rounded-[16px] px-4 py-4 text-white outline-none focus:border-[#d4af37] text-[15px]";
  const labelCls = "text-zinc-300 text-[14px] mb-1 block mt-4";

  const cargarMisSubidas = async (emailToUse) => {
    const { data } = await supabase.from("releases").select("*").eq("user_email", emailToUse).order("created_at", { ascending: false });
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
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin, queryParams: { prompt: "select_account" } } });
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

  const onCover = (file) => {
    if (!file) return;
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    const img = new Image();
    img.onload = () => {
      setCoverSize(img.width + "x" + img.height);
    };
    img.src = url;
  };

  const guardarYPagar = async () => {
    if (!f.whatsapp) return alert("Pon tu WhatsApp");
    if (!f.titulo || !f.artista) return alert("Falta titulo o artista");
    setSaving(true);
    const row = {
      title: f.titulo, artist: f.artista, nombre_personal: f.nombrePersonal, cedula: f.cedula, genre: f.genero, release_date: f.fecha, file_name: audioFile?.name || "", cover_name: coverFile?.name || "", cover_size: coverSize, user_email: userEmail, whatsapp: f.whatsapp, email_regalias: f.emailRegalias, compositor: f.compositor, productor: f.productor, explicito: f.explicito, canta_solo: f.cantaSolo, featuring: f.featuring, es_cover: f.esCover, idioma: f.idioma, instagram: f.instagram, fee: isAdmin ? "0.00" : "5.00", status: isAdmin ? "pagado_revisar" : "esperando_paypal",
    };
    const { error } = await supabase.from("releases").insert(row);
    setSaving(false);
    if (error) {
      alert("Error al guardar: " + error.message);
      return;
    }
    await cargarMisSubidas(userEmail);
    setView("mis");
    const msg = "NUEVO UNICO DISTRO " + f.titulo + " - " + f.artista + " Email: " + userEmail + " WA: " + f.whatsapp;
    window.open("https://wa.me/" + WHATSAPP_SOPORTE + "?text=" + encodeURIComponent(msg), "_blank");
    if (!isAdmin) {
      window.open(PAYPAL_URL, "_blank");
      alert("Pedido guardado. Completa el pago de $5 en PayPal. Ya lo ves en Mis Subidas como PENDIENTE.");
    } else {
      alert("Guardado GRATIS (admin).");
    }
  };

  if (view === "auth") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-5">
        <div className="w-full max-w-[420px]">
          <button onClick={() => setView("home")} className="text-zinc-400 text-sm">Volver</button>
          <div className="text-center mt-6">
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6d2b]">U</div>
            <h1 className="mt-2 text-xl tracking-[0.3em]">UNICO DISTRO</h1>
            <p className="text-zinc-400 text-sm mt-2">{authTab === "login" ? "Inicia sesion" : "Crea tu cuenta gratis"}</p>
          </div>
          <button onClick={loginGoogle} className="w-full bg-white text-black font-bold py-4 rounded-full mt-6">Continuar con Google</button>
          <div className="flex gap-2 mt-5 bg-zinc-900 p-1 rounded-full">
            <button onClick={() => setAuthTab("login")} className="flex-1 py-2.5 rounded-full text-sm font-bold">Iniciar Sesion</button>
            <button onClick={() => setAuthTab("crear")} className="flex-1 py-2.5 rounded-full text-sm font-bold">Crear Cuenta</button>
          </div>
          {authTab === "crear" && (
            <div>
              <label className={labelCls}>Nombre artistico *</label>
              <input value={nombreCuenta} onChange={(e) => setNombreCuenta(e.target.value)} placeholder="Tu nombre artistico" className={inputCls} />
            </div>
          )}
          <label className={labelCls}>Email *</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className={inputCls} />
          <label className={labelCls}>Contrasena *</label>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" className={inputCls} />
          <button onClick={entrar} className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-6">{authTab === "login" ? "Entrar y Subir Musica" : "Crear Cuenta y Subir"}</button>
        </div>
      </div>
    );
  }

  if (view === "mis") {
    return (
      <div className="min-h-screen bg-black text-white px-5 py-8 max-w-[600px] mx-auto">
        <button onClick={() => setView("home")} className="text-zinc-400 text-sm">Volver</button>
        <h1 className="text-[28px] font-black mt-4">Mis Lanzamientos</h1>
        <p className="text-zinc-400 text-sm">{userEmail}</p>
        <button onClick={() => setView("form")} className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-6">Subir Nuevo Tema</button>
        {misReleases.length === 0 && <p className="text-center text-zinc-500 mt-10">Todavia no has subido nada.</p>}
       {misReleases.map((r) => (
<div key={r.id} className="mt-4 bg-zinc-900 border border-zinc-800 rounded-[16px] p-4">
<p className="font-bold">{r.title}</p>
<p className="text-zinc-400 text-sm">{r.artist} - {r.genre}</p>
<p className="text-zinc-500 text-xs mt-1">Audio: {r.file_name} Portada: {r.cover_size}</p>
<p className="mt-2 text-[12px] font-bold text-yellow-400">{r.status}</p>
</div>
))} 
    );
  }

  if (view === "form") {
    return (
      <div className="min-h-screen bg-black text-white px-5 py-8 max-w-[600px] mx-auto">
        <div className="flex justify-between items-center">
          <button onClick={() => setView("home")} className="text-zinc-400 text-sm">Volver</button>
          <p className="text-xs text-zinc-400">{userEmail} {isAdmin && <span className="text-green-400 font-bold">ADMIN</span>}
            <span onClick={async () => { await cargarMisSubidas(userEmail); setView("mis"); }} className="text-[#d4af37] cursor-pointer ml-2">Mis Subidas</span>
            <span onClick={async () => { await supabase.auth.signOut(); setUserEmail(""); setView("home"); }} className="text-red-400 cursor-pointer ml-2">Salir</span>
          </p>
        </div>
        <p className="text-[#d4af37] tracking-[0.3em] text-[12px] mt-4">PASO {paso} DE 4</p>
        <h1 className="text-[32px] font-black mt-1">Subir Lanzamiento {isAdmin && <span className="text-green-400 text-[16px]">GRATIS</span>}</h1>
        {paso === 1 && (
          <div>
            <div onClick={() => audioRef.current?.click()} className="mt-6 border border-dashed border-zinc-500 rounded-[20px] py-8 text-center cursor-pointer">
              <p className="font-bold">Audio *</p>
              <p className="text-[#d4af37] mt-1">{audioFile ? audioFile.name : "Toca para subir WAV / FLAC"}</p>
              <input ref={audioRef} type="file" accept=".wav,.flac,.mp3" className="hidden" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
            </div>
            <div className="mt-4">
              <p className="font-bold">Portada - 3000x3000</p>
              <div onClick={() => coverRef.current?.click()} className="mt-2 border border-zinc-700 rounded-[20px] overflow-hidden cursor-pointer bg-zinc-900">
                {coverPreview ? (
                  <div>
                    <img src={coverPreview} className="w-full aspect-square object-cover" alt="cover" />
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold">{coverFile?.name}</p>
                        <p className="text-sm text-green-400">Tamano: {coverSize} {coverSize === "3000x3000" ? "Perfecto" : "Pide 3000x3000"}</p>
                      </div>
                      <span className="text-[#d4af37] text-sm">Cambiar</span>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square flex flex-col items-center justify-center p-8">
                    <div className="w-[220px] h-[220px] border-2 border-dashed border-zinc-600 rounded-[16px] flex items-center justify-center text-center">
                      <p className="text-zinc-500 text-sm">3000 x 3000 Toca para subir</p>
                    </div>
                  </div>
                )}
              </div>
              <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => onCover(e.target.files?.[0] || null)} />
            </div>
            <label className={labelCls}>Titulo *</label>
            <input value={f.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="Nombre de tu cancion" className={inputCls} />
            <button onClick={() => { if (!audioFile || !f.titulo) return alert("Falta audio y titulo"); setPaso(2); }} className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-6">Continuar Artista</button>
          </div>
        )}
        {paso === 2 && (
          <div>
            <h2 className="font-bold text-lg mt-6">Info del artista</h2>
            <label className={labelCls}>Nombre artistico *</label>
            <input value={f.artista} onChange={(e) => set("artista", e.target.value)} placeholder="Tu nombre artistico" className={inputCls} />
            <label className={labelCls}>Nombre personal / legal *</label>
            <input value={f.nombrePersonal} onChange={(e) => set("nombrePersonal", e.target.value)} placeholder="Tu nombre real" className={inputCls} />
            <label className={labelCls}>Cedula</label>
            <input value={f.cedula} onChange={(e) => set("cedula", e.target.value)} placeholder="Tu cedula" className={inputCls} />
            <label className={labelCls}>Cantas solo?</label>
            <select value={f.cantaSolo} onChange={(e) => set("cantaSolo", e.target.value)} className={inputCls}>
              <option value="Si">Si - Canto solo</option>
              <option value="No">No - Somos varios</option>
            </select>
            <label className={labelCls}>Instagram</label>
            <input value={f.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@tuinstagram" className={inputCls} />
            <div className="flex gap-3 mt-6">
              <button onClick={() => setPaso(1)} className="flex-1 border border-zinc-600 py-4 rounded-full">Atras</button>
              <button onClick={() => { if (!f.artista || !f.nombrePersonal) return alert("Falta artista y personal"); setPaso(3); }} className="flex-1 bg-[#d4af37] text-black font-bold py-4 rounded-full">Continuar</button>
            </div>
          </div>
        )}
        {paso === 3 && (
          <div>
            <h2 className="font-bold text-lg mt-6">Derechos y letra</h2>
            <label className={labelCls}>Es Cover?</label>
            <select value={f.esCover} onChange={(e) => set("esCover", e.target.value)} className={inputCls}>
              <option value="No">No - Original</option>
              <option value="Si">Si - Cover</option>
            </select>
            <label className={labelCls}>Compositor *</label>
            <input value={f.compositor} onChange={(e) => set("compositor", e.target.value)} placeholder="Quien escribio" className={inputCls} />
            <label className={labelCls}>Productor *</label>
            <input value={f.productor} onChange={(e) => set("productor", e.target.value)} placeholder="Quien hizo el beat" className={inputCls} />
            <label className={labelCls}>Letra explicita?</label>
            <select value={f.explicito} onChange={(e) => set("explicito", e.target.value)} className={inputCls}>
              <option value="No">No - Limpia</option>
              <option value="Si">Si - Explicita</option>
            </select>
            <label className={labelCls}>Genero *</label>
            <select value={f.genero} onChange={(e) => set("genero", e.target.value)} className={inputCls}>
              <option value="">Selecciona</option>
              <option>Dembow</option>
              <option>Reggaeton</option>
              <option>Trap</option>
              <option>Merengue</option>
              <option>Bachata</option>
              <option>Otro</option>
            </select>
            <label className={labelCls}>Idioma</label>
            <select value={f.idioma} onChange={(e) => set("idioma", e.target.value)} className={inputCls}>
              <option>Espanol</option>
              <option>Ingles</option>
              <option>Spanglish</option>
            </select>
            <label className={labelCls}>Fecha lanzamiento</label>
            <input type="date" value={f.fecha} onChange={(e) => set("fecha", e.target.value)} className={inputCls} />
            <div className="flex gap-3 mt-6">
              <button onClick={() => setPaso(2)} className="flex-1 border border-zinc-600 py-4 rounded-full">Atras</button>
              <button onClick={() => setPaso(4)} className="flex-1 bg-[#d4af37] text-black font-bold py-4 rounded-full">Continuar</button>
            </div>
          </div>
        )}
        {paso === 4 && (
          <div>
            <h2 className="font-bold text-lg mt-6">Pago y regalias</h2>
            <label className={labelCls}>WhatsApp *</label>
            <input value={f.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="8091234567" className={inputCls} />
            <label className={labelCls}>Email regalias *</label>
            <input value={f.emailRegalias} onChange={(e) => set("emailRegalias", e.target.value)} placeholder="tu@email.com" className={inputCls} />
            <div className="mt-5 bg-zinc-900 rounded-[16px] p-4 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-zinc-400">Tema</span><span>{f.titulo}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Artista</span><span>{f.artista}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Portada</span><span>{coverSize || "—"}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Total</span><span className="text-[#d4af37] font-bold">{isAdmin ? "GRATIS - ADMIN" : "$5 USD"}</span></div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setPaso(3)} className="flex-1 border border-zinc-600 py-4 rounded-full">Atras</button>
              <button onClick={guardarYPagar} disabled={saving} className="flex-1 bg-[#d4af37] text-black font-bold py-4 rounded-full">{saving ? "Guardando" : "Guardar y pagar $5 PayPal"}</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 pb-16 pt-14 text-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="text-7xl leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6d2b]">U</div>
          <h1 className="mt-2 text-2xl tracking-[0.35em] font-light">UNICO DISTRO</h1>
          <p className="mt-1 text-[10px] tracking-[0.45em] text-[#d4af37]">MUSIC DISTRIBUTION</p>
          {userEmail && <p className="mt-2 text-xs text-green-400">Logueado: {userEmail}</p>}
        </div>
        <h2 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">Distribuye tu musica al <span className="text-[#d4af37]">mundo</span></h2>
        <p className="mt-5 max-w-2xl text-base text-gray-400 md:text-lg">La distribuidora de RD para nuevos talentos. Sube tu tema, paga $5 USD por lanzamiento y nosotros lo llevamos a las plataformas.</p>
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <button onClick={() => { if (userEmail) setView("form"); else { setAuthTab("crear"); setView("auth"); } }} className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black">Subir Musica</button>
          <button onClick={() => { if (userEmail) { cargarMisSubidas(userEmail); setView("mis"); } else { setAuthTab("login"); setView("auth"); } }} className="rounded-full border border-white/40 px-8 py-3.5 text-sm font-medium">Mis Lanzamientos</button>
          <button onClick={() => { setAuthTab("login"); setView("auth"); }} className="rounded-full border border-white/40 px-8 py-3.5 text-sm font-medium">Iniciar Sesion</button>
        </div>
        <a href={"https://wa.me/" + WHATSAPP_SOPORTE} target="_blank" className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#25D366]/50 bg-[#25D366]/10 px-5 py-2.5 text-sm font-medium text-[#25D366]">Contactar con soporte (WhatsApp)</a>
        <p className="mt-16 text-xs text-gray-600">© 2026 UNICO DISTRO</p>
      </div>
    </div>
  );
}
