"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const CLAVE_ADMIN = "unico2026";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uxaupuajpfdvswnttysv.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YXVwdWFqcGZkdnN3bnR0eXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MTYxMjIsImV4cCI6MjEwODk5MjEyMn0.cFINxKq7WCHWjCCFSiYQJRht4AyP80MA8A2xiRyBRjM"
);

function waLink(raw: string) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "#";
  if (digits.startsWith("1") && digits.length >= 11) return `https://wa.me/${digits}`;
  if (digits.length === 10) return `https://wa.me/1${digits}`;
  return `https://wa.me/${digits}`;
}

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [releases, setReleases] = useState<any[]>([]);
  const [editando, setEditando] = useState<any | null>(null);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("unico_admin") === "ok") {
      setAuth(true);
    }
  }, []);

  useEffect(() => {
    if (auth) cargar();
  }, [auth]);

  const cargar = async () => {
    const { data, error: err } = await supabase
      .from("releases")
      .select("*")
      .order("id", { ascending: false });
    if (err) setError(err.message);
    else {
      setError("");
      setReleases(data || []);
    }
  };

  const login = () => {
    if (clave === CLAVE_ADMIN) {
      localStorage.setItem("unico_admin", "ok");
      setAuth(true);
      setError("");
    } else setError("Clave incorrecta");
  };

  const setStatus = async (id: number, s: string) => {
    await supabase.from("releases").update({ status: s }).eq("id", id);
    cargar();
  };

  const borrar = async (id: number) => {
    if (!confirm("¿Borrar este pedido?")) return;
    await supabase.from("releases").delete().eq("id", id);
    cargar();
  };

  const guardarEdicion = async () => {
    if (!editando) return;
    const { id, ...resto } = editando;
    await supabase.from("releases").update(resto).eq("id", id);
    setEditando(null);
    cargar();
    alert("Guardado");
  };

  const statusColor = (s: string) => {
    if (s === "listo" || s === "enviado_routenote") return "bg-green-500 text-black";
    if (s === "subiendo" || s === "subiendo_routenote" || s === "pagado_revisar")
      return "bg-blue-500 text-white";
    return "bg-yellow-500 text-black";
  };

  const statusLabel = (s: string) => {
    if (s === "listo" || s === "enviado_routenote") return "● LISTO";
    if (s === "subiendo" || s === "subiendo_routenote") return "● SUBIENDO";
    if (s === "pagado_revisar") return "● PAGADO";
    return "● PENDIENTE";
  };

  const filtrados = releases.filter((r) => {
    const s = r.status || "pendiente";
    if (filtro === "todos") return true;
    if (filtro === "pendiente")
      return (
        s === "pendiente" ||
        s === "esperando_paypal" ||
        s === "pagado_revisar" ||
        !r.status
      );
    if (filtro === "subiendo") return s === "subiendo" || s === "subiendo_routenote";
    if (filtro === "listo") return s === "listo" || s === "enviado_routenote";
    return true;
  });

  if (!auth) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[24px] p-6 text-center">
          <div className="h-14 w-14 mx-auto rounded-full bg-[#d4af37] text-black flex items-center justify-center font-black text-xl">
            U
          </div>
          <p className="text-[11px] tracking-[0.3em] text-[#d4af37] font-bold mt-4">
            UNICO DISTRO
          </p>
          <h1 className="text-[22px] font-black mt-1">Admin</h1>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Clave"
            className="w-full mt-6 bg-black border border-white/20 rounded-full px-4 py-3.5 text-center outline-none focus:border-[#d4af37]"
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <button
            onClick={login}
            className="w-full mt-3 bg-[#d4af37] text-black rounded-full py-3.5 font-black"
          >
            ENTRAR
          </button>
          <a href="/" className="block text-sm text-gray-500 mt-4">
            ← Inicio
          </a>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 max-w-[700px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[11px] tracking-[0.3em] text-[#d4af37] font-bold">
            UNICO DISTRO
          </p>
          <h1 className="text-[28px] font-black">Admin</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={cargar}
            className="border border-zinc-700 rounded-full px-3 py-1.5 text-sm"
          >
            Actualizar
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("unico_admin");
              setAuth(false);
            }}
            className="bg-red-600 rounded-full px-4 py-1.5 text-sm font-bold"
          >
            Salir
          </button>
        </div>
      </div>
      <p className="text-zinc-500 text-sm">{releases.length} pedidos totales</p>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
        {[
          ["todos", `Todos (${releases.length})`],
          ["pendiente", "Pendientes"],
          ["subiendo", "Subiendo"],
          ["listo", "Listo"],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFiltro(k)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
              filtro === k ? "bg-white text-black font-bold" : "border border-zinc-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtrados.map((r) => {
        const es3000 = r.cover_size === "3000x3000";
        return (
          <div
            key={r.id}
            className="mt-4 bg-[#151515] border border-zinc-800 rounded-[18px] p-4"
          >
            <div className="flex justify-between gap-2">
              <h2 className="font-bold text-[17px]">
                {r.title} - {r.artist}
              </h2>
              <span
                className={`text-[11px] font-bold px-2 py-1 rounded-full h-fit ${statusColor(
                  r.status
                )}`}
              >
                {statusLabel(r.status)}
              </span>
            </div>

            <div className="flex gap-3 mt-3">
              <div className="w-[110px] h-[110px] bg-zinc-800 rounded-xl overflow-hidden shrink-0">
                {r.cover_url ? (
                  <img src={r.cover_url} className="w-full h-full object-cover" alt="" />
                ) : (
                  <p className="text-[11px] text-center p-2 text-zinc-500">
                    {r.cover_name}
                    <br />
                    {r.cover_size}
                  </p>
                )}
              </div>
              <div className="text-[13px] flex-1 space-y-0.5">
                <p>Personal: {r.nombre_personal || "—"}</p>
                <p>Cédula: {r.cedula || "— (opcional)"}</p>
                <p>
                  Portada: {r.cover_size || "—"} {es3000 ? "✓" : ""}
                </p>
                <p>Audio: {r.file_name || "—"}</p>
                <p>Fee: ${r.fee}</p>
              </div>
            </div>

            {r.audio_url ? (
              <audio controls src={r.audio_url} className="w-full mt-3" />
            ) : (
              <p className="text-yellow-400 text-xs mt-2">⚠ Sin audio en Storage</p>
            )}

            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3 text-[13px] bg-black/40 rounded-xl p-3">
              <p>
                <span className="text-zinc-500">Género:</span> {r.genre}
              </p>
              <p>
                <span className="text-zinc-500">WhatsApp:</span> {r.whatsapp}
              </p>
              <p>
                <span className="text-zinc-500">Email:</span> {r.user_email}
              </p>
              <p>
                <span className="text-zinc-500">Compositor:</span> {r.compositor}
              </p>
              <p>
                <span className="text-zinc-500">Productor:</span> {r.productor}
              </p>
              <p>
                <span className="text-zinc-500">Spotify:</span>{" "}
                {r.spotify_profile || "—"}
              </p>
              <p>
                <span className="text-zinc-500">Apple:</span> {r.apple_profile || "—"}
              </p>
              <p>
                <span className="text-zinc-500">YT Music:</span>{" "}
                {r.youtube_profile || "—"}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-[11px] text-zinc-500 mb-2">ESTADO (RouteNote):</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatus(r.id, "pendiente")}
                  className="bg-yellow-500 text-black text-xs font-bold px-3 py-2 rounded-full"
                >
                  ● Pendiente
                </button>
                <button
                  onClick={() => setStatus(r.id, "subiendo")}
                  className="bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-full"
                >
                  ● Subiendo RN
                </button>
                <button
                  onClick={() => setStatus(r.id, "listo")}
                  className="bg-green-500 text-black text-xs font-bold px-4 py-2 rounded-full"
                >
                  ● LISTO (en plataformas)
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3 border-t border-zinc-800 pt-3">
              <button
                onClick={() => setEditando(r)}
                className="bg-white text-black text-xs font-bold px-3 py-2 rounded-full"
              >
                Editar
              </button>
              <a
                href={`\( {waLink(r.whatsapp)}?text= \){encodeURIComponent(
                  `Hola ${r.artist}, soy UNICO DISTRO. Sobre tu tema ${r.title}: `
                )}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] text-black text-xs font-bold px-3 py-2 rounded-full"
              >
                WhatsApp artista
              </a>
              <button
                onClick={() => borrar(r.id)}
                className="border border-red-900 text-red-400 text-xs px-3 py-2 rounded-full"
              >
                Borrar
              </button>
            </div>

            {editando?.id === r.id && (
              <div className="mt-4 bg-zinc-900 rounded-xl p-3 space-y-2">
                <p className="font-bold text-sm">Editando</p>
                <input
                  value={editando.title || ""}
                  onChange={(e) => setEditando({ ...editando, title: e.target.value })}
                  placeholder="Título"
                  className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  value={editando.artist || ""}
                  onChange={(e) => setEditando({ ...editando, artist: e.target.value })}
                  placeholder="Artista"
                  className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  value={editando.cover_size || ""}
                  onChange={(e) =>
                    setEditando({ ...editando, cover_size: e.target.value })
                  }
                  placeholder="Cover size ej 3000x3000"
                  className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={guardarEdicion}
                    className="flex-1 bg-green-500 text-black font-bold py-2 rounded-full text-sm"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditando(null)}
                    className="flex-1 border border-zinc-600 py-2 rounded-full text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
