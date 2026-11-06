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

  const doLogout = () => {
    localStorage.removeItem("unico_user");
    setIsLogged(false);
    setUserEmail("");
    setShowForm(false);
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
            <div onClick={() => coverRef.current?.click()} className="mt-3 border border-zinc-700 rounded-[20px] p-4 flex justify-between items-center cursor-pointer">
              <div><p className="font-bold">2. Portada *</p><p className="text-zinc-500 text-sm">3000x3000 {coverFile ? "- " + coverFile.name : ""}</p></div>
              <span class
