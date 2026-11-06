"use client";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 👇 PON AQUI TU EMAIL - TU VAS A SUBIR GRATIS
const ADMIN_EMAIL = "TU_EMAIL_AQUI@gmail.com";

export default function Home() {
  const [view, setView] = useState<"home" | "auth" | "form">("home");
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
  const audioRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const isAdmin = userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const [f, setF] = useState({
    titulo: "", artista: "", nombrePersonal: "", cedula: "",
    cantaSolo: "Si", numArtistas: "1", featuring: "",
    esCover: "No", coverDe: "", compositor: "", productor: "",
    explicito: "No", genero: "", idioma: "Español", fecha: "",
    whatsapp: "", emailRegalias: "", sello: "UNICO DISTRO", instagram: ""
  });
  const set = (k: string, v: string) => setF({ ...f, [k]: v });
  const inputCls = "w-full bg-[#1a1a1a] border border-zinc-700 rounded-[16px] px-4 py-4 text-white outline-none focus:border-[#d4af37] text-[15px]";
  const labelCls = "text-zinc-300 text-[14px] mb-1 block mt-4";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) setUserEmail(data.session.user.email || "");
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) { setUserEmail(session.user.email || ""); setView("form"); }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loginGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin, queryParams: { prompt: "select_account" } }
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

  const subirGratisAdmin = () => {
    const data = { ...f, coverSize, audioName: audioFile?.name, coverName: coverFile?.name, userEmail };
    const prev = JSON.parse(localStorage.getItem("unico_admin_subidas") || "[]");
    prev.push({ ...data, fecha: new Date().toISOString() });
    localStorage.setItem("unico_admin_subidas", JSON.stringify(prev));
    const msg = `ADMIN UNICO: ${f.titulo} - ${f.artista} - Personal:${f.nombrePersonal} - CantaSolo:${f.cantaSolo} - Explicito:${f.explicito} - Portada:${coverSize} - Audio:${audioFile?.name}`;
    window.open(`https://wa.me/18295435381?text=${encodeURIComponent(msg)}`, "_blank");
    alert("Subido GRATIS como Admin! Te llegó al WhatsApp.");
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
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" /> Continuar con Google
          </button>
          <div className="flex gap-2 mt-5 bg-zinc-900 p-1 rounded-full">
            <button onClick={() => setAuthTab("login")} className={`flex-1 py-2.5 rounded-full text-sm font-bold ${authTab === "login" ? "bg-[#d4af37] text-black" : "text-zinc-400"}`}>Iniciar Sesión</button>
            <button onClick={() => setAuthTab("crear")} className={`flex-1 py-2.5 rounded-full text-sm font-bold ${authTab === "crear" ? "bg-[#d4af37] text-black" : "text-zinc-400"}`}>Crear Cuenta</button>
          </div>
          {authTab === "crear" && (<><label className={labelCls}>Nombre artístico *</label><input value={nombreCuenta} onChange={e => setNombreCuenta(e.target.value)} placeholder="Tu nombre artístico" className={inputCls} /></>)}
          <label className={labelCls}>Email *</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" className={inputCls} />
          <label className={labelCls}>Contraseña *</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" className={inputCls} />
          <button onClick={entrar} className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-6">{authTab === "login" ? "Entrar y Subir Música" : "Crear Cuenta y Subir"}</button>
        </div>
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

        {paso === 1 && (
          <>
            <div onClick={() => audioRef.current?.click()} className="mt-6 border border-dashed border-zinc-500 rounded-[20px] py-8 text-center cursor-pointer">
              <p className="font-bold">Audio *</p>
              <p className="text-[#d4af37] mt-1">{audioFile ? audioFile.name : "Toca para subir WAV / FLAC"}</p>
              <input ref={audioRef} type="file" accept=".wav,.flac,.mp3" className="hidden" onChange={e => setAudioFile(e.target.files?.[0] || null)} />
            </div>
            <div className="mt-4">
              <p className="font-bold">Portada * - 3000x3000</p>
              <div onClick={() => coverRef.current?.click()} className="mt-2 border border-zinc-700 rounded-[20px] overflow-hidden cursor-pointer bg-zinc-900">
                {coverPreview ? (
                  <>
                    <img src={coverPreview} className="w-full aspect-square object-cover" />
                    <div className="p-4 flex justify-between items-center">
                      <div><p className="text-sm font-bold">{coverFile?.name}</p><p className={`text-sm ${coverSize === "3000x3000" ? "text-green-400" : "text-yellow-400"}`}>Tamaño: {coverSize} {coverSize === "3000x3000" ? "✓ Perfecto" : "⚠ Pide 3000x3000"}</p></div>
                      <span className="text-[#d4af37] text-sm">Cambiar</span>
                    </div>
                  </>
                ) : (
                  <div className="aspect-square flex flex-col items-center justify-center p-8">
                    <div className="w-[220px] h-[220px] border-2 border-dashed border-zinc-600 rounded-[16px] flex items-center justify-center text-center">
                      <p className="text-zinc-500 text-sm">3000 x 3000<br/>Toca para subir<br/>Aquí se va a ver</p>
                    </div>
                  </div>
                )}
              </div>
              <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={e => onCover(e.target.files?.[0] || null)} />
            </div>
            <label className={labelCls}>Título *</label>
            <input value={f.titulo} onChange={e => set("titulo", e.target.value)} placeholder="Nombre de tu canción" className={inputCls} />
            <button onClick={() => { if (!audioFile || !f.titulo) return alert("Falta audio y título"); setPaso(2); }} className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-6">Continuar → Artista</button>
          </>
        )}

        {paso === 2 && (
          <>
            <h2 className="font-bold text-lg mt-6">Info del artista</h2>
            <label className={labelCls}>Nombre artístico *</label><input value={f.artista} onChange={e => set("artista", e.target.value)} placeholder="Tu nombre artístico" className={inputCls} />
            <label className={labelCls}>Nombre personal / legal *</label><input value={f.nombrePersonal} onChange={e => set("nombrePersonal", e.target.value)} placeholder="Tu nombre real" className={inputCls} />
            <label className={labelCls}>Cédula</label><input value={f.cedula} onChange={e => set("cedula", e.target.value)} placeholder="Tu cédula" className={inputCls} />
            <label className={labelCls}>¿Cantas solo? *</label>
            <select value={f.cantaSolo} onChange={e => set("cantaSolo", e.target.value)} className={inputCls}><option value="Si">Sí - Canto solo</option><option value="No">No - Somos varios</option></select>
            <label className={labelCls}>¿Cuántos artistas?</label>
            <select value={f.numArtistas} onChange={e => set("numArtistas", e.target.value)} className={inputCls}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4 o más</option></select>
            {f.cantaSolo === "No" && (<><label className={labelCls}>Featuring</label><input value={f.featuring} onChange={e => set("featuring", e.target.value)} placeholder="Otros artistas" className={inputCls} /></>)}
            <label className={labelCls}>Instagram</label><input value={f.instagram} onChange={e => set("instagram", e.target.value)} placeholder="@tuinstagram" className={inputCls} />
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
            <select value={f.esCover} onChange={e => set("esCover", e.target.value)} className={inputCls}><option value="No">No - Original</option><option value="Si">Sí - Cover</option></select>
            {f.esCover === "Si" && (<><label className={labelCls}>¿De quién?</label><input value={f.coverDe} onChange={e => set("coverDe", e.target.value)} placeholder="Artista original" className={inputCls} /></>)}
            <label className={labelCls}>Compositor *</label><input value={f.compositor} onChange={e => set("compositor", e.target.value)} placeholder="Quién escribió" className={inputCls} />
            <label className={labelCls}>Productor *</label><input value={f.productor} onChange={e => set("productor", e.target.value)} placeholder="Quién hizo el beat" className={inputCls} />
            <label className={labelCls}>¿Letra explícita? *</label>
            <select value={f.explicito} onChange={e => set("explicito", e.target.value)} className={inputCls}><option value="No">No - Limpia</option><option value="Si">Sí - Explícita</option></select>
            <label className={labelCls}>Género *</label>
            <select value={f.genero} onChange={e => set("genero", e.target.value)} className={inputCls}><option value="">Selecciona</option><option>Dembow</option><option>Reggaeton</option><option>Trap</option><option>Merengue</option><option>Bachata</option><option>Otro</option></select>
            <label className={labelCls}>Idioma</label>
            <select value={f.idioma} onChange={e => set("idioma", e.target.value)} className={inputCls}><option>Español</option><option>Inglés</option><option>Spanglish</option></select>
            <label className={labelCls}>Fecha lanzamiento</label><input type="date" value={f.fecha} onChange={e => set("fecha", e.target.value)} className={inputCls} />
            {coverPreview && (
              <div className="mt-5 flex gap-3 items-center bg-zinc-900 p-3 rounded-[16px]">
                <img src={coverPreview} className="w-[56px] h-[56px] rounded-[8px] object-cover" />
                <div><p className="font-bold text-sm">{f.titulo}</p><p className="text-zinc-400 text-xs">{f.artista} • {f.explicito === "Si" ? "Explicit" : "Clean"}</p></div>
                {f.explicito === "Si" && <span className="ml-auto text-[10px] border border-zinc-500 px-1.5 py-0.5">E</span>}
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setPaso(2)} className="flex-1 border border-zinc-600 py-4 rounded-full">Atrás</button>
              <button onClick={() => setPaso(4)} className="flex-1 bg-[#d4af37] text-black font-bold py-4 rounded-full">Continuar</button>
            </div>
          </>
        )}

        {paso === 4 && (
          <>
            <h2 className="font-bold text-lg mt-6">Pago y regalías</h2>
            <label className={labelCls}>WhatsApp *</label><input value={f.whatsapp} onChange={e => set("whatsapp", e.target.value)} placeholder="8091234567" className={inputCls} />
            <label className={labelCls}>Email regalías *</label><input value={f.emailRegalias} onChange={e => set("emailRegalias", e.target.value)} placeholder="tu@email.com" className={inputCls} />
            <div className="mt-5 bg-zinc-900 rounded-[16px] p-4 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-zinc-400">Tema</span><span>{f.titulo}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Artista / Personal</span><span>{f.artista} / {f.nombrePersonal}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Canta solo?</span><span>{f.cantaSolo}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Explícita?</span><span>{f.explicito}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Portada</span><span>{coverSize}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Total</span><span className="text-[#d4af37] font-bold">{isAdmin ? "GRATIS - ADMIN" : "$5 USD"}</span></div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setPaso(3)} className="flex-1 border border-zinc-600 py-4 rounded-full">Atrás</button>
              {isAdmin ? (
                <button onClick={subirGratisAdmin} className="flex-1 bg-green-500 text-black font-bold py-4 rounded-full">Subir Gratis - Admin</button>
              ) : (
                <button onClick={() => window.location.href = "https://www.paypal.com/paypalme/unico2026/5"} className="flex-1 bg-[#d4af37] text-black font-bold py-4 rounded-full">Pagar $5 con PayPal</button>
              )}
            </div>
            {isAdmin && <p className="text-green-400 text-xs text-center mt-2">Eres Admin, por eso subes gratis</p>}
          </>
        )}
      </div>
    );
  }

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
          {userEmail && <p className="mt-2 text-xs text-green-400">Logueado: {userEmail} {isAdmin && "ADMIN"}</p>}
        </div>
        <h2 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">Distribuye tu música al <span className="text-[#d4af37]">mundo</span></h2>
        <p className="mt-5 max-w-2xl text-base text-gray-400 md:text-lg">La distribuidora de RD para nuevos talentos. Sube tu tema, paga <span className="font-semibold text-[#f5d37f]">$5 USD</span> por lanzamiento y nosotros lo llevamos a las plataformas. Tú conservas tus derechos.</p>
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <button onClick={() => { if (userEmail) setView("form"); else { setAuthTab("crear"); setView("auth"); } }} className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black">Subir Música</button>
          <button onClick={() => { setAuthTab("login"); setView("auth"); }} className="rounded-full border border-white/40 px-8 py-3.5 text-sm font-medium">Iniciar Sesión</button>
        </div>
        <a href="https://wa.me/18295435381?text=Hola%20UNICO%20DISTRO%2C%20necesito%20soporte" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#25D366]/50 bg-[#25D366]/10 px-5 py-2.5 text-sm font-medium text-[#25D366]">Contactar con soporte (WhatsApp)</a>
        <p className="mt-2 text-xs text-gray-600">829-543-5381</p>
        <div className="mt-14 w-full">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-gray-500">Disponible en las principales plataformas</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {["Spotify","Apple Music","Deezer","TikTok","YouTube Music","Amazon Music","Instagram","+150 más"].map((name) => (
              <div key={name} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4"><p className="font-semibold text-white">{name}</p></div>
            ))}
          </div>
        </div>
        <div className="mt-16 grid w-full gap-4 text-left md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5"><p className="text-xs tracking-widest text-[#d4af37]">01</p><h3 className="mt-2 text-lg font-bold">Sube tu tema</h3><p className="mt-2 text-sm text-gray-400">Audio, portada 3000x3000 y datos como DistroKid.</p></div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5"><p className="text-xs tracking-widest text-[#d4af37]">02</p><h3 className="mt-2 text-lg font-bold">Paga $5 USD</h3><p className="mt-2 text-sm text-gray-400">Un pago por lanzamiento. Tú conservas tus derechos.</p></div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5"><p className="text-xs tracking-widest text-[#d4af37]">03</p><h3 className="mt-2 text-lg font-bold">Va a las plataformas</h3><p className="mt-2 text-sm text-gray-400">Nosotros lo subimos a Spotify, Apple y más.</p></div>
        </div>
        <p className="mt-16 text-xs text-gray-600">© 2026 UNICO DISTRO</p>
      </div>
    </div>
  );
}
