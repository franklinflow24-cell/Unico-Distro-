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

const PLATAFORMAS = [
  "Spotify",
  "Apple Music",
  "YouTube Music",
  "Deezer",
  "TikTok",
  "Instagram",
  "Amazon Music",
  "Tidal",
  "Pandora",
  "+150 más",
];

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
  const [openId, setOpenId] = useState<number | null>(null);
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
    spotify: "",
    appleMusic: "",
    youtubeMusic: "",
  });

  const set = (k: string, v: string) => setF({ ...f, [k]: v });
  const inputCls =
    "w-full bg-[#1a1a1a] border border-zinc-700 rounded-[16px] px-4 py-4 text-white outline-none focus:border-[#d4af37] text-[15px]";
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
    const { data } = await supabase
      .from("releases")
      .select("*")
      .eq("user_email", emailToUse)
      .order("id", { ascending: false });
    if (data) setMisReleases(data);
  };

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
    img.onload = () => setCoverSize(`\( {img.width}x \){img.height}`);
    img.src = url;
  };

  const uploadFile = async (file: File, folder: string) => {
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `\( {folder}/ \){Date.now()}_${safe}`;
    const { error } = await supabase.storage.from("releases").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("releases").getPublicUrl(path);
    return data.publicUrl;
  };

  const guardarYPagar = async () => {
    if (!f.whatsapp) return alert("Pon tu WhatsApp");
    if (!f.titulo || !f.artista) return alert("Falta título o artista");
    if (!audioFile) return alert("Sube el audio WAV / FLAC");
    if (!coverFile) return alert("Sube la portada");
    setSaving(true);

    let cover_url = "";
    let audio_url = "";
    try {
      cover_url = await uploadFile(coverFile, "covers");
      audio_url = await uploadFile(audioFile, "audio");
    } catch (e: any) {
      setSaving(false);
      alert(
        "Error subiendo archivos: " +
          (e?.message || e) +
          "\n¿Corriste el SQL del bucket releases?"
      );
      return;
    }

    const row = {
      title: f.titulo,
      artist: f.artista,
      nombre_personal: f.nombrePersonal,
      cedula: f.cedula || "",
      genre: f.genero,
      release_date: f.fecha,
      file_name: audioFile.name,
      cover_name: coverFile.name,
      cover_size: coverSize,
      cover_url,
      audio_url,
      user_email: userEmail,
      whatsapp: f.whatsapp,
      email_regalias: f.emailRegalias,
      compositor: f.compositor,
      productor: f.productor,
      explicito: f.explicito,
      canta_solo: f.cantaSolo,
      num_artistas: f.numArtistas,
      featuring: f.featuring,
      es_cover: f.esCover,
      idioma: f.idioma,
      instagram: f.instagram,
      spotify_profile: f.spotify,
      apple_profile: f.appleMusic,
      youtube_profile: f.youtubeMusic,
      fee: isAdmin ? "0.00" : "5.00",
      status: "pendiente",
    };

    const { error } = await supabase.from("releases").insert(row);
    setSaving(false);

    if (error) {
      alert("Error al guardar: " + error.message);
      return;
    }

    const msg = `NUEVO UNICO DISTRO\n${f.titulo} - ${f.artista}\nEmail: ${userEmail}\nWA: ${f.whatsapp}\nGénero: ${f.genero}\nAudio: ${audioFile.name}\nPortada: \( {coverFile.name} ( \){coverSize})\nStatus: pendiente\nSpotify: ${f.spotify || "-"}\nApple: ${f.appleMusic || "-"}\nYT Music: ${f.youtubeMusic || "-"}`;
    window.open(
      `https://wa.me/\( {WHATSAPP_SOPORTE}?text= \){encodeURIComponent(msg)}`,
      "_blank"
    );

    if (!isAdmin) {
      window.open(PAYPAL_URL, "_blank");
      alert(
        "Pedido guardado en PENDIENTE.\nCompleta el pago de $5 en PayPal.\nCuando esté en plataformas, verás estado LISTO en Mis Lanzamientos."
      );
    } else {
      alert("Guardado GRATIS (admin). Estado: PENDIENTE. Revisa /admin.");
    }

    await cargarMis(userEmail);
    setView("mis");
  };

  const statusUI = (s: string) => {
    if (s === "listo" || s === "enviado_routenote")
      return { label: "LISTO · En plataformas", color: "text-green-400", dot: "bg-green-400" };
    if (s === "subiendo" || s === "subiendo_routenote" || s === "pagado_revisar")
      return { label: "SUBIENDO a RouteNote", color: "text-blue-400", dot: "bg-blue-400" };
    return { label: "PENDIENTE", color: "text-yellow-400", dot: "bg-yellow-400" };
  };

  if (view === "auth") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-5">
        <div className="w-full max-w-[420px]">
          <button onClick={() => setView("home")} className="text-zinc-400 text-sm">
            ← Volver
          </button>
          <div className="text-center mt-6">
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6d2b]">
              U
            </div>
            <h1 className="mt-2 text-xl tracking-[0.3em]">UNICO DISTRO</h1>
            <p className="text-zinc-400 text-sm mt-2">
              {authTab === "login" ? "Inicia sesión" : "Crea tu cuenta gratis"}
            </p>
          </div>
          <button
            onClick={loginGoogle}
            className="w-full bg-white text-black font-bold py-4 rounded-full mt-6 flex items-center justify-center gap-2"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="" />
            Continuar con Google
          </button>
          <div className="flex gap-2 mt-5 bg-zinc-900 p-1 rounded-full">
            <button
              onClick={() => setAuthTab("login")}
              className={`flex-1 py-2.5 rounded-full text-sm font-bold ${
                authTab === "login" ? "bg-[#d4af37] text-black" : "text-zinc-400"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setAuthTab("crear")}
              className={`flex-1 py-2.5 rounded-full text-sm font-bold ${
                authTab === "crear" ? "bg-[#d4af37] text-black" : "text-zinc-400"
              }`}
            >
              Crear Cuenta
            </button>
          </div>
          {authTab === "crear" && (
            <>
              <label className={labelCls}>Nombre artístico *</label>
              <input
                value={nombreCuenta}
                onChange={(e) => setNombreCuenta(e.target.value)}
                placeholder="Tu nombre artístico"
                className={inputCls}
              />
            </>
          )}
          <label className={labelCls}>Email *</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className={inputCls}
          />
          <label className={labelCls}>Contraseña *</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••"
            className={inputCls}
          />
          <button
            onClick={entrar}
            className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-6"
          >
            {authTab === "login" ? "Entrar y Subir Música" : "Crear Cuenta y Subir"}
          </button>
        </div>
      </div>
    );
  }

  if (view === "mis") {
    return (
      <div className="min-h-screen bg-black text-white px-5 py-8 max-w-[600px] mx-auto">
        <button onClick={() => setView("home")} className="text-zinc-400 text-sm">
          ← Volver
        </button>
        <h1 className="text-[28px] font-black mt-4">Mis Lanzamientos</h1>
        <p className="text-zinc-400 text-sm">
          {userEmail}{" "}
          {isAdmin && <span className="text-green-400 font-bold">ADMIN</span>}
        </p>
        <button
          onClick={() => {
            setPaso(1);
            setView("form");
          }}
          className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-6"
        >
          Subir Nuevo Tema
        </button>
        <button
          onClick={() => cargarMis(userEmail)}
          className="w-full border border-zinc-700 py-3 rounded-full mt-2 text-sm"
        >
          Recargar
        </button>

        {misReleases.length === 0 && (
          <p className="text-center text-zinc-500 mt-10">
            Todavía no has subido nada. Sube tu primer tema.
          </p>
        )}

        {misReleases.map((r) => {
          const st = statusUI(r.status || "");
          const abierto = openId === r.id;
          return (
            <div
              key={r.id}
              className="mt-4 bg-zinc-900 border border-zinc-800 rounded-[16px] overflow-hidden"
            >
              <button
                onClick={() => setOpenId(abierto ? null : r.id)}
                className="w-full text-left p-4 flex gap-3 items-center"
              >
                <div className="w-16 h-16 rounded-lg bg-zinc-800 overflow-hidden shrink-0">
                  {r.cover_url ? (
                    <img src={r.cover_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-500">
                      sin foto
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{r.title}</p>
                  <p className="text-zinc-400 text-sm truncate">{r.artist}</p>
                  <p className={`text-xs font-bold mt-1 flex items-center gap-1.5 ${st.color}`}>
                    <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                    {st.label}
                  </p>
                </div>
                <span className="text-zinc-500 text-sm">{abierto ? "▲" : "▼"}</span>
              </button>

              {abierto && (
                <div className="px-4 pb-4 border-t border-zinc-800 space-y-3">
                  {r.cover_url && (
                    <img
                      src={r.cover_url}
                      alt="portada"
                      className="w-full max-w-[280px] mx-auto rounded-xl mt-3 aspect-square object-cover"
                    />
                  )}
                  {r.audio_url ? (
                    <audio controls src={r.audio_url} className="w-full mt-2" />
                  ) : (
                    <p className="text-yellow-400 text-xs">Sin audio en servidor</p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs bg-black/40 rounded-xl p-3">
                    <p>
                      <span className="text-zinc-500">Personal:</span>{" "}
                      {r.nombre_personal || "—"}
                    </p>
                    <p>
                      <span className="text-zinc-500">Género:</span> {r.genre || "—"}
                    </p>
                    <p>
                      <span className="text-zinc-500">Compositor:</span>{" "}
                      {r.compositor || "—"}
                    </p>
                    <p>
                      <span className="text-zinc-500">Productor:</span>{" "}
                      {r.productor || "—"}
                    </p>
                    <p>
                      <span className="text-zinc-500">Explícito:</span>{" "}
                      {r.explicito || "—"}
                    </p>
                    <p>
                      <span className="text-zinc-500">Fecha:</span>{" "}
                      {r.release_date || "—"}
                    </p>
                    <p>
                      <span className="text-zinc-500">WhatsApp:</span>{" "}
                      {r.whatsapp || "—"}
                    </p>
                    <p>
                      <span className="text-zinc-500">Fee:</span> ${r.fee || "5"}
                    </p>
                    <p>
                      <span className="text-zinc-500">Portada:</span>{" "}
                      {r.cover_size || "—"}
                    </p>
                    <p>
                      <span className="text-zinc-500">Audio:</span>{" "}
                      {r.file_name || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-zinc-500 mb-2 uppercase tracking-wider">
                      Perfiles del artista
                    </p>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-[#1DB954]">Spotify:</span>{" "}
                        {r.spotify_profile || "No indicado"}
                      </p>
                      <p>
                        <span className="text-[#fc3c44]">Apple Music:</span>{" "}
                        {r.apple_profile || "No indicado"}
                      </p>
                      <p>
                        <span className="text-red-400">YouTube Music:</span>{" "}
                        {r.youtube_profile || "No indicado"}
                      </p>
                      <p>
                        <span className="text-pink-400">Instagram:</span>{" "}
                        {r.instagram || "No indicado"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] text-zinc-500 mb-2 uppercase tracking-wider">
                      Plataformas de distribución
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {PLATAFORMAS.map((p) => (
                        <div
                          key={p}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium"
                        >
                          {p}
                          {(r.status === "listo" || r.status === "enviado_routenote") && (
                            <span className="ml-1 text-green-400">●</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {(r.status === "listo" || r.status === "enviado_routenote") ? (
                      <p className="text-green-400 text-xs mt-2 font-bold">
                        ● Disponible en plataformas (RouteNote)
                      </p>
                    ) : (
                      <p className="text-zinc-500 text-xs mt-2">
                        Cuando esté LISTO verás el punto verde en cada plataforma.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (view === "form") {
    return (
      <div className="min-h-screen bg-black text-white px-5 py-8 max-w-[600px] mx-auto">
        <div className="flex justify-between items-center">
          <button onClick={() => setView("home")} className="text-zinc-400 text-sm">
            ← Volver
          </button>
          <p className="text-xs text-zinc-400">
            {userEmail}{" "}
            {isAdmin && <span className="text-green-400 font-bold">ADMIN</span>}{" "}
            <span
              onClick={async () => {
                await supabase.auth.signOut();
                setUserEmail("");
                setView("home");
              }}
              className="text-red-400 cursor-pointer ml-2"
            >
              Salir
            </span>
          </p>
        </div>
        <p className="text-[#d4af37] tracking-[0.3em] text-[12px] mt-4">
          PASO {paso} DE 4
        </p>
        <h1 className="text-[32px] font-black mt-1">
          Subir Lanzamiento{" "}
          {isAdmin && <span className="text-green-400 text-[16px]">GRATIS</span>}
        </h1>
        <button
          onClick={() => {
            cargarMis(userEmail);
            setView("mis");
          }}
          className="text-sm text-[#d4af37] mt-2"
        >
          → Ver Mis Lanzamientos
        </button>

        {paso === 1 && (
          <>
            <div
              onClick={() => audioRef.current?.click()}
              className="mt-6 border border-dashed border-zinc-500 rounded-[20px] py-8 text-center cursor-pointer"
            >
              <p className="font-bold">Audio * (WAV / FLAC)</p>
              <p className="text-[#d4af37] mt-1">
                {audioFile ? audioFile.name : "Toca para subir"}
              </p>
              <input
                ref={audioRef}
                type="file"
                accept=".wav,.flac,.mp3,audio/*"
                className="hidden"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              />
            </div>
            {audioFile && (
              <audio
                controls
                src={URL.createObjectURL(audioFile)}
                className="w-full mt-3"
              />
            )}
            <div className="mt-4">
              <p className="font-bold">Portada * · 3000×3000</p>
              <div
                onClick={() => coverRef.current?.click()}
                className="mt-2 border border-zinc-700 rounded-[20px] overflow-hidden cursor-pointer bg-zinc-900"
              >
                {coverPreview ? (
                  <>
                    <img
                      src={coverPreview}
                      className="w-full aspect-square object-cover"
                      alt="cover"
                    />
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold">{coverFile?.name}</p>
                        <p
                          className={`text-sm ${
                            coverSize === "3000x3000"
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          Tamaño: {coverSize || "…"}{" "}
                          {coverSize === "3000x3000" ? "✓ Perfecto" : "⚠ Ideal 3000×3000"}
                        </p>
                      </div>
                      <span className="text-[#d4af37] text-sm">Cambiar</span>
                    </div>
                  </>
                ) : (
                  <div className="aspect-square flex items-center justify-center p-8">
                    <p className="text-zinc-500 text-sm text-center">
                      3000 × 3000
                      <br />
                      Toca para subir
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={coverRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onCover(e.target.files?.[0] || null)}
              />
            </div>
            <label className={labelCls}>Título *</label>
            <input
              value={f.titulo}
              onChange={(e) => set("titulo", e.target.value)}
              placeholder="Nombre de tu canción"
              className={inputCls}
            />
            <button
              onClick={() => {
                if (!audioFile || !f.titulo) return alert("Falta audio y título");
                if (!coverFile) return alert("Sube la portada");
                setPaso(2);
              }}
              className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-full mt-6"
            >
              Continuar → Artista
            </button>
          </>
        )}

        {paso === 2 && (
          <>
            <h2 className="font-bold text-lg mt-6">Info del artista</h2>
            <label className={labelCls}>Nombre artístico *</label>
            <input
              value={f.artista}
              onChange={(e) => set("artista", e.target.value)}
              placeholder="Tu nombre artístico"
              className={inputCls}
            />
            <label className={labelCls}>Nombre personal / legal *</label>
            <input
              value={f.nombrePersonal}
              onChange={(e) => set("nombrePersonal", e.target.value)}
              placeholder="Tu nombre real"
              className={inputCls}
            />
            <label className={labelCls}>Cédula (opcional)</label>
            <input
              value={f.cedula}
              onChange={(e) => set("cedula", e.target.value)}
              placeholder="Si no tienes, déjalo vacío"
              className={inputCls}
            />
            <label className={labelCls}>¿Cantas solo? *</label>
            <select
              value={f.cantaSolo}
              onChange={(e) => set("cantaSolo", e.target.value)}
              className={inputCls}
            >
              <option value="Si">Sí - Canto solo</option>
              <option value="No">No - Somos varios</option>
            </select>
            <label className={labelCls}>¿Cuántos artistas?</label>
            <select
              value={f.numArtistas}
              onChange={(e) => set("numArtistas", e.target.value)}
              className={inputCls}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4 o más</option>
            </select>
            {f.cantaSolo === "No" && (
              <>
                <label className={labelCls}>Featuring</label>
                <input
                  value={f.featuring}
                  onChange={(e) => set("featuring", e.target.value)}
                  placeholder="Otros artistas"
                  className={inputCls}
                />
              </>
            )}
            <label className={labelCls}>Instagram</label>
            <input
              value={f.instagram}
              onChange={(e) => set("instagram", e.target.value)}
              placeholder="@tuinstagram"
              className={inputCls}
            />
            <label className={labelCls}>Perfil Spotify (link o nombre)</label>
            <input
              value={f.spotify}
              onChange={(e) => set("spotify", e.target.value)}
              placeholder="https://open.spotify.com/artist/..."
              className={inputCls}
            />
            <label className={labelCls}>Perfil Apple Music</label>
            <input
              value={f.appleMusic}
              onChange={(e) => set("appleMusic", e.target.value)}
              placeholder="Link o nombre en Apple Music"
              className={inputCls}
            />
            <label className={labelCls}>Perfil YouTube Music</label>
            <input
              value={f.youtubeMusic}
              onChange={(e) => set("youtubeMusic", e.target.value)}
              placeholder="Link del canal o artista"
              className={inputCls}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setPaso(1)}
                className="flex-1 border border-zinc-600 py-4 rounded-full"
              >
                Atrás
              </button>
              <button
                onClick={() => {
                  if (!f.artista || !f.nombrePersonal)
                    return alert("Falta artista y nombre personal");
                  setPaso(3);
                }}
                className="flex-1 bg-[#d4af37] text-black font-bold py-4 rounded-full"
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {paso === 3 && (
          <>
            <h2 className="font-bold text-lg mt-6">Derechos y letra</h2>
            <label className={labelCls}>¿Es Cover? *</label>
            <select
              value={f.esCover}
              onChange={(e) => set("esCover", e.target.value)}
              className={inputCls}
            >
              <option value="No">No - Original</option>
              <option value="Si">Sí - Cover</option>
            </select>
            {f.esCover === "Si" && (
              <>
                <label className={labelCls}>¿De quién?</label>
                <input
                  value={f.coverDe}
                  onChange={(e) => set("coverDe", e.target.value)}
                  placeholder="Artista original"
                  className={inputCls}
                />
              </>
            )}
            <label className={labelCls}>Compositor *</label>
            <input
              value={f.compositor}
              onChange={(e) => set("compositor", e.target.value)}
              placeholder="Quién escribió"
              className={inputCls}
            />
            <label className={labelCls}>Productor *</label>
            <input
              value={f.productor}
              onChange={(e) => set("productor", e.target.value)}
              placeholder="Quién hizo el beat"
              className={inputCls}
            />
            <label className={labelCls}>¿Letra explícita? *</label>
            <select
              value={f.explicito}
              onChange={(e) => set("explicito", e.target.value)}
              className={inputCls}
            >
              <option value="No">No - Limpia</option>
              <option value="Si">Sí - Explícita</option>
            </select>
            <label className={labelCls}>Género *</label>
            <select
              value={f.genero}
              onChange={(e) => set("genero", e.target.value)}
              className={inputCls}
            >
              <option value="">Selecciona</option>
              <option>Dembow</option>
              <option>Reggaeton</option>
              <option>Trap</option>
              <option>Merengue</option>
              <option>Bachata</option>
              <option>Otro</option>
            </select>
            <label className={labelCls}>Idioma</label>
            <select
              value={f.idioma}
              onChange={(e) => set("idioma", e.target.value)}
              className={inputCls}
            >
              <option>Español</option>
              <option>Inglés</option>
              <option>Spanglish</option>
            </select>
            <label className={labelCls}>Fecha lanzamiento</label>
            <input
              type="date"
              value={f.fecha}
              onChange={(e) => set("fecha", e.target.value)}
              className={inputCls}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setPaso(2)}
                className="flex-1 border border-zinc-600 py-4 rounded-full"
              >
                Atrás
              </button>
              <button
                onClick={() => setPaso(4)}
                className="flex-1 bg-[#d4af37] text-black font-bold py-4 rounded-full"
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {paso === 4 && (
          <>
            <h2 className="font-bold text-lg mt-6">Pago y regalías</h2>
            <label className={labelCls}>WhatsApp *</label>
            <input
              value={f.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
              placeholder="8091234567"
              className={inputCls}
            />
            <label className={labelCls}>Email regalías *</label>
            <input
              value={f.emailRegalias}
              onChange={(e) => set("emailRegalias", e.target.value)}
              placeholder="tu@email.com"
              className={inputCls}
            />
            <div className="mt-5 bg-zinc-900 rounded-[16px] p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Tema</span>
                <span>{f.titulo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Artista</span>
                <span>{f.artista}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Portada</span>
                <span>{coverSize || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Audio</span>
                <span className="truncate max-w-[180px]">{audioFile?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total</span>
                <span className="text-[#d4af37] font-bold">
                  {isAdmin ? "GRATIS - ADMIN" : "$5 USD"}
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-500 mt-3 text-center">
              Al confirmar se sube audio + portada, queda en{" "}
              <span className="text-yellow-400 font-bold">PENDIENTE</span> y se abre
              PayPal.
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setPaso(3)}
                className="flex-1 border border-zinc-600 py-4 rounded-full"
              >
                Atrás
              </button>
              <button
                onClick={guardarYPagar}
                disabled={saving}
                className="flex-1 bg-[#d4af37] text-black font-bold py-4 rounded-full disabled:opacity-60"
              >
                {saving
                  ? "Subiendo archivos…"
                  : isAdmin
                  ? "Guardar gratis"
                  : "Guardar y pagar $5"}
              </button>
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
          <div className="text-7xl leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6d2b]">
            U
          </div>
          <h1 className="mt-2 text-2xl tracking-[0.35em] font-light">UNICO DISTRO</h1>
          <p className="mt-1 text-[10px] tracking-[0.45em] text-[#d4af37]">
            MUSIC DISTRIBUTION
          </p>
          {userEmail && (
            <p className="mt-2 text-xs text-green-400">
              Logueado: {userEmail} {isAdmin && "ADMIN"}
            </p>
          )}
        </div>
        <h2 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
          Distribuye tu música al <span className="text-[#d4af37]">mundo</span>
        </h2>
        <p className="mt-5 max-w-2xl text-base text-gray-400 md:text-lg">
          La distribuidora de RD para nuevos talentos. Sube tu tema, paga{" "}
          <span className="font-semibold text-[#f5d37f]">$5 USD</span> por lanzamiento y
          nosotros lo llevamos a las plataformas.
        </p>
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={() => {
              if (userEmail) setView("form");
              else {
                setAuthTab("crear");
                setView("auth");
              }
            }}
            className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black"
          >
            Subir Música
          </button>
          <button
            onClick={() => {
              setAuthTab("login");
              setView("auth");
            }}
            className="rounded-full border border-white/40 px-8 py-3.5 text-sm font-medium"
          >
            Iniciar Sesión
          </button>
        </div>
        {userEmail && (
          <button
            onClick={() => {
              cargarMis(userEmail);
              setView("mis");
            }}
            className="mt-3 text-sm text-[#d4af37]"
          >
            Ver Mis Lanzamientos →
          </button>
        )}
        <a
          href={`https://wa.me/${WHATSAPP_SOPORTE}?text=Hola%20UNICO%20DISTRO%2C%20necesito%20soporte`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#25D366]/50 bg-[#25D366]/10 px-5 py-2.5 text-sm font-medium text-[#25D366]"
        >
          Contactar con soporte (WhatsApp)
        </a>
        <p className="mt-2 text-xs text-gray-600">829-543-5381</p>
        <div className="mt-14 w-full">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-gray-500">
            Disponible en las principales plataformas
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {PLATAFORMAS.map((name) => (
              <div
                key={name}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4"
              >
                <p className="font-semibold text-white text-sm">{name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 grid w-full gap-4 text-left md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <p className="text-xs tracking-widest text-[#d4af37]">01</p>
            <h3 className="mt-2 text-lg font-bold">Sube tu tema</h3>
            <p className="mt-2 text-sm text-gray-400">
              WAV/FLAC + portada 3000×3000 y tus perfiles.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <p className="text-xs tracking-widest text-[#d4af37]">02</p>
            <h3 className="mt-2 text-lg font-bold">Paga $5 USD</h3>
            <p className="mt-2 text-sm text-gray-400">
              Queda en pendiente hasta que esté en plataformas.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <p className="text-xs tracking-widest text-[#d4af37]">03</p>
            <h3 className="mt-2 text-lg font-bold">Va a las plataformas</h3>
            <p className="mt-2 text-sm text-gray-400">
              Spotify, Apple, YouTube Music y más vía RouteNote.
            </p>
          </div>
        </div>
        <p className="mt-16 text-xs text-gray-600">© 2026 UNICO DISTRO</p>
      </div>
    </div>
  );
}
