"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [paso, setPaso] = useState(1);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [coverSize, setCoverSize] = useState<string>("");
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

  useEffect(() => {
    const saved = localStorage.getItem("unico_user");
    if (saved) { setIsLogged(true); setUserEmail(saved); }
  }, []);

  const handleSubirClick = () => {
    if (isLogged) setShowForm(true);
    else setShowLogin(true);
  };

  const doLogin = () => {
    if (!loginEmail || !loginPass) return alert("Pon tu email y contraseña");
    localStorage.setItem("unico_user", loginEmail);
    setIsLogged(true);
    setUserEmail(loginEmail);
    setShowLogin(false);
    setShowForm(true);
  };

  const loginWithGoogle = () => {
    // Por ahora entra directo con Google - luego lo conectamos a tu Google Cloud
    // Si quieres el real con Firebase, te lo conecto en el siguiente paso
    const googleEmail = prompt("Entra con Google - pon tu Gmail para probar:");
    if (googleEmail) {
      localStorage.setItem("unico_user", googleEmail);
      localStorage.setItem("unico_provider", "google");
      setIsLogged(true);
      setUserEmail(googleEmail);
      setShowLogin(false);
      setShowForm(true);
    }
  };

  const doLogout = () => {
    localStorage.removeItem("unico_user");
    localStorage.removeItem("unico_provider");
    setIsLogged(false);
    setUserEmail("");
    setShowForm(false);
  };

  const onCoverChange = (file: File | null) => {
    if (!file) return;
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    const img = new Image();
    img.onload = () => setCoverSize(`${img.width}x${img.height}`);
    img.src = url;
  };

  const inputCls = "w-full bg-[#1a1a1a] border border-zinc-700 rounded-[16px] px-4 py-4 text-white outline-none focus:border-[#d4af37] text-[15px]";
  const labelCls = "text-zinc-300 text-[14px] mb-1 block mt-4";

  const pagar = async () => {
    const fd = new FormData();
    Object.entries(f).forEach(([k, v]) => fd.append(k, v));
    fd.append("loginEmail", userEmail);
    if (audioFile) fd.append("audioName", audioFile.name);
    if (coverFile) fd.append("coverName", coverFile.name);
    await fetch("/api/submissions", { method: "POST", body: fd });
    window.location.href = "https://www.paypal.com/paypalme/unico2026/5";
  };

  if (showLogin && !isLogged) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-5">
        <div className="w-full max-w-[400px]">
          <button onClick={() => setShowLogin(false)} className="text-zinc-400 text-sm">← Volver</button>
          <div className="text-center mt-6">
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6d2b]">U</div>
            <h1 className="mt-2 text-xl tracking-[0.3em]">UNICO DISTRO</h1>
            <p className="text-zinc-400 text-sm mt-2">Inicia sesión para subir tu música</p>
          </div>

          {/* BOTON GOOGLE */}
          <button onClick={loginWithGoogle} className="w-full bg-white text-black font-bold py-4 rounded-full mt-6 flex items-center justify-center gap-2">
            <span className="text-[18px] font-black">G</span> Continuar con Google
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="h-[1px] flex-1 bg-zinc-700" />
            <span className="text-zinc-500 text-xs">o con email</span>
            <div className="h-[1px] flex-1 bg-zinc-700" />
          </div>

          <label className={labelCls}>Email *</label>
          <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="tu@email.com" className={inputCls} />
          <label className={labelCls}>Contraseña *</label>
          <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="••••••••" className={inputCls} />
          <button onClick={doLogin} className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-6">Entrar y Subir Música</button>
          <p className="text-center text-zinc-500 text-xs mt-4">¿No tienes cuenta? Al poner tu email y contraseña se crea automáticamente.</p>
        </div>
      </div>
    );
  }

  if (showForm && isLogged) {
    return (
      <div className="min-h-screen bg-black text-white px-5 py-8 max-w-[600px] mx-auto">
        <div className="flex justify-between items-center">
          <button onClick={() => setShowForm(false)} className="text-zinc-400 text-sm">← Volver</button>
          <p className="text-xs text-zinc-400">Sesión: {userEmail} <span onClick={doLogout} className="text-red-400 cursor-pointer ml-2">Salir</span></p>
        </div>
        <p className="text-[#d4af37] tracking-[0.3em] text-[12px] mt-4">PASO {paso} DE 5</p>
        <h1 className="text-[38px] font-black leading-none mt-2">Subir Lanzamiento</h1>

        {paso === 1 && (
          <>
            <div onClick={() => audioRef.current?.click()} className="mt-6 border border-dashed border-zinc-500 rounded-[20px] py-8 text-center cursor-pointer">
              <p className="font-bold">1. Audio del tema *</p>
              <p className="text-zinc-500 text-sm">WAV o FLAC</p>
              <p className="text-[#d4af37] mt-1">{audioFile ? audioFile.name : "Toca para subir"}</p>
              <input ref={audioRef} type="file" accept=".wav,.flac,.mp3" className="hidden" onChange={e => setAudioFile(e.target.files?.[0] || null)} />
            </div>

            <div className="mt-4">
              <p className="font-bold">2. Portada * - Debe ser 3000x3000</p>
              <div onClick={() => coverRef.current?.click()} className="mt-2 border border-zinc-700 rounded-[20px] overflow-hidden cursor-pointer bg-zinc-900">
                {coverPreview ? (
                  <>
                    <img src={coverPreview} className="w-full aspect-square object-cover" />
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
                  <div className="aspect-square flex flex-col items-center justify-center text-center p-8">
                    <div className="w-[200px] h-[200px] border-2 border-dashed border-zinc-600 rounded-[16px] flex items-center justify-center">
                      <p className="text-zinc-500 text-sm">3000 x 3000<br/>Toca para subir<br/>JPG / PNG</p>
                    </div>
                  </div>
                )}
              </div>
              <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={e => onCoverChange(e.target.files?.[0] || null)} />
            </div>

            <label className={labelCls}>Título de la canción *</label>
            <input value={f.titulo} onChange={e => set("titulo", e.target.value)} placeholder="Nombre de tu canción" className={inputCls} />
            <button onClick={() => { if (!audioFile || !f.titulo) return alert("Falta audio y título"); setPaso(2); }} className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-6">Continuar → Artista</button>
          </>
        )}

        {paso === 2 && (
          <>
            <h2 className="font-bold text-lg mt-6">Datos del Artista</h2>
            <label className={labelCls}>Nombre artístico *</label>
            <input value={f.artista} onChange={e => set("artista", e.target.value)} placeholder="Tu nombre artístico" className={inputCls} />
            <label className={labelCls}>Nombre personal / legal *</label>
            <input value={f.nombreLegal} onChange={e => set("nombreLegal", e.target.value)} placeholder="Tu nombre real" className={inputCls} />
            <label className={labelCls}>Cédula</label>
            <input value={f.cedula} onChange={e => set("cedula", e.target.value)} placeholder="Tu cédula" className={inputCls} />
            <label className={labelCls}>¿Cuántos artistas cantan? *</label>
            <select value={f.numArtistas} onChange={e => set("numArtistas", e.target.value)} className={inputCls}>
              <option value="1">1 - Solo yo</option><option value="2">2 artistas</option><option value="3">3 artistas</option><option value="4">4 o más</option>
            </select>
            <label className={labelCls}>Featuring</label>
            <input value={f.featuring} onChange={e => set("featuring", e.target.value)} placeholder="Nombre del invitado si hay" className={inputCls} />
            <label className={labelCls}>Instagram / Spotify</label>
            <input value={f.instagram} onChange={e => set("instagram", e.target.value)} placeholder="@tuinstagram" className={inputCls} />
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
              <option value="No">No - Original mío</option><option value="Si">Sí - Cover de otro</option>
            </select>
            {f.esCover === "Si" && (
              <>
                <label className={labelCls}>¿De quién es la original?</label>
                <input value={f.coverOriginalDe} onChange={e => set("coverOriginalDe", e.target.value)} placeholder="Nombre del artista original" className={inputCls} />
              </>
            )}
            <label className={labelCls}>Compositor *</label>
            <input value={f.compositor} onChange={e => set("compositor", e.target.value)} placeholder="Quién escribió la letra" className={inputCls} />
            <label className={labelCls}>Productor *</label>
            <input value={f.productor} onChange={e => set("productor", e.target.value)} placeholder="Quién hizo el beat" className={inputCls} />
            <label className={labelCls}>¿Tienes derechos del beat? *</label>
            <select value={f.derechos} onChange={e => set("derechos", e.target.value)} className={inputCls}>
              <option value="Si">Sí - Lo compré / hice</option><option value="No">No - Beat de YouTube</option>
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
            <label className={labelCls}>Género *</label>
            <select value={f.genero} onChange={e => set("genero", e.target.value)} className={inputCls}>
              <option value="">Selecciona</option><option>Dembow</option><option>Reggaeton</option><option>Trap</option><option>Drill</option><option>Afrobeat</option><option>Merengue</option><option>Bachata</option><option>Otro</option>
            </select>
            <label className={labelCls}>Idioma</label>
            <select value={f.idioma} onChange={e => set("idioma", e.target.value)} className={inputCls}>
              <option>Español</option><option>Inglés</option><option>Spanglish</option><option>Otro</option>
            </select>
            <label className={labelCls}>¿Letra explícita? *</label>
            <select value={f.explicito} onChange={e => set("explicito", e.target.value)} className={inputCls}>
              <option value="No">No - Limpia</option><option value="Si">Sí - Explícita</option>
            </select>
            <label className={labelCls}>Fecha lanzamiento</label>
            <input type="date" value={f.fecha} onChange={e => set("fecha", e.target.value)} className={inputCls} />
            <label className={labelCls}>Sello</label>
            <input value={f.sello} onChange={e => set("sello", e.target.value)} className={inputCls} />
            {coverPreview && (
              <div className="mt-5 flex gap-3 items-center bg-zinc-900 p-3 rounded-[16px]">
                <img src={coverPreview} className="w-[56px] h-[56px] rounded-[8px] object-cover" />
                <div className="text-left">
                  <p className="font-bold text-sm">{f.titulo || "Tu canción"}</p>
                  <p className="text-zinc-400 text-xs">{f.artista || "Tu nombre"} • {f.genero || "Género"}</p>
                </div>
              </div>
            )}
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
            <label className={labelCls}>Email regalías *</label>
            <input value={f.emailRegalias} onChange={e => set("emailRegalias", e.target.value)} placeholder="tu@email.com" className={inputCls} />
            <div className="mt-5 bg-zinc-900 rounded-[16px] p-4 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-zinc-400">Tema</span><span>{f.titulo}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Artista</span><span>{f.artista} {f.featuring ? `ft ${f.featuring}` : ""}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Portada</span><span>{coverSize || "Sin portada"}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Total</span><span className="text-[#d4af37] font-bold">$5 USD</span></div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setPaso(4)} className="flex-1 border border-zinc-600 py-4 rounded-full">Atrás</button>
              <button onClick={pagar} className="flex-1 bg-[#d4af37] text-black font-bold py-4 rounded-full">Pagar $5 con PayPal</button>
            </div>
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
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 pb-16 pt-14 text-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="text-7xl leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6d2b]">U</div>
          <h1 className="mt-2 text-2xl tracking-[0.35em] font-light">UNICO DISTRO</h1>
          <p className="mt-1 text-[10px] tracking-[0.45em] text-[#d4af37]">MUSIC DISTRIBUTION</p>
          {isLogged && <p className="mt-2 text-xs text-green-400">Logueado como {userEmail} - <span onClick={doLogout} className="underline cursor-pointer">Salir</span></p>}
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
          <button onClick={handleSubirClick} className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black">Subir Música</button>
          <button onClick={handleSubirClick} className="rounded-full border border-white/40 px-8 py-3.5 text-sm font-medium">Iniciar Sesión</button>
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
            <p className="mt-2 text-sm text-gray-400">Audio, portada 3000x3000 y todos los datos.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <p className="text-xs tracking-widest text-[#d4af37]">02</p>
            <h3 className="mt-2 text-lg font-bold">Paga $5 USD</h3>
            <p className="mt-2 text-sm text-gray-400">Un pago por lanzamiento.</p>
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
