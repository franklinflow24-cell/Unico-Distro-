"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Admin() {
  const [releases, setReleases] = useState<any[]>([]);
  const [editando, setEditando] = useState<any | null>(null);
  const [filtro, setFiltro] = useState("todos");

  const cargar = async () => {
    const { data } = await supabase.from("releases").select("*").order("id", { ascending: false });
    if (data) setReleases(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const salir = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const setStatus = async (id: number, s: string) => {
    await supabase.from("releases").update({ status: s }).eq("id", id);
    cargar();
  };

  const borrar = async (id: number) => {
    if (!confirm("Borrar?")) return;
    await supabase.from("releases").delete().eq("id", id);
    cargar();
  };

  const guardarEdicion = async () => {
    if (!editando) return;
    const { id, ...resto } = editando;
    await supabase.from("releases").update(resto).eq("id", id);
    setEditando(null);
    cargar();
    alert("Arreglado!");
  };

  const check = (c: boolean) => (c ? "✅" : "❌");

  const statusColor = (s: string) => {
    if (s === "listo" || s === "enviado_routenote") return "bg-green-500 text-black";
    if (s === "subiendo" || s === "subiendo_routenote" || s === "pagado_revisar") return "bg-blue-500 text-white";
    return "bg-yellow-500 text-black";
  };

  const statusLabel = (s: string) => {
    if (s === "listo" || s === "enviado_routenote") return "🟢 SUBIDO / LISTO";
    if (s === "subiendo" || s === "subiendo_routenote") return "🔵 SUBIENDO...";
    if (s === "pagado_revisar") return "🟡 PAGADO - REVISAR";
    return "🟡 PENDIENTE";
  };

  const filtrados = releases.filter((r) => {
    if (filtro === "todos") return true;
    if (filtro === "pendiente")
      return !r.status || r.status === "pendiente" || r.status === "enviado" || r.status === "pagado_revisar";
    if (filtro === "subiendo") return r.status === "subiendo" || r.status === "subiendo_routenote";
    if (filtro === "listo") return r.status === "listo" || r.status === "enviado_routenote";
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 max-w-[700px] mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-[28px] font-black">Admin - Requiar</h1>
        <div className="flex gap-2">
          <button onClick={cargar} className="border border-zinc-700 rounded-full px-3 py-1.5 text-sm">
            Actualizar
          </button>
          <button onClick={salir} className="bg-red-600 rounded-full px-4 py-1.5 text-sm font-bold">
            Salir
          </button>
        </div>
      </div>

      <p className="text-zinc-500 text-sm">{releases.length} pedidos totales</p>

      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
        <button
          onClick={() => setFiltro("todos")}
          className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
            filtro === "todos" ? "bg-white text-black font-bold" : "border border-zinc-700"
          }`}
        >
          Todos ({releases.length})
        </button>
        <button
          onClick={() => setFiltro("pendiente")}
          className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
            filtro === "pendiente" ? "bg-yellow-500 text-black font-bold" : "border border-zinc-700"
          }`}
        >
          🟡 Pendientes
        </button>
        <button
          onClick={() => setFiltro("subiendo")}
          className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
            filtro === "subiendo" ? "bg-blue-500 text-white font-bold" : "border border-zinc-700"
          }`}
        >
          🔵 Subiendo
        </button>
        <button
          onClick={() => setFiltro("listo")}
          className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
            filtro === "listo" ? "bg-green-500 text-black font-bold" : "border border-zinc-700"
          }`}
        >
          🟢 Subidos / Listo
        </button>
      </div>

      {filtrados.map((r) => {
        const es3000 = r.cover_size === "3000x3000";
        const esWav =
          r.file_name?.toLowerCase().endsWith(".wav") || r.file_name?.toLowerCase().endsWith(".flac");

        return (
          <div key={r.id} className="mt-4 bg-[#151515] border border-zinc-800 rounded-[18px] p-4">
            <div className="flex justify-between gap-2">
              <h2 className="font-bold text-[17px]">
                {r.title} - {r.artist}
              </h2>
              <span className={`text-[11px] font-bold px-2 py-1 rounded-full h-fit ${statusColor(r.status)}`}>
                {statusLabel(r.status)}
              </span>
            </div>

            <div className="flex gap-3 mt-3">
              <div className="w-[110px] h-[110px] bg-zinc-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                {r.cover_url ? (
                  <img src={r.cover_url} className="w-full h-full object-cover" />
                ) : (
                  <p className="text-[11px] text-center p-2">
                    {r.cover_name}
                    <br />
                    {r.cover_size}
                  </p>
                )}
              </div>
              <div className="text-[13px] flex-1 space-y-0.5">
                <p>{check(!!r.title)} Titulo: {r.title}</p>
                <p>{check(!!r.artist)} Artista: {r.artist}</p>
                <p>{check(!!r.nombre_personal)} Personal: {r.nombre_personal || "FALTA"}</p>
                <p>{check(!!r.cedula)} Cedula: {r.cedula || "FALTA"}</p>
                <p>{check(esWav)} Audio: {r.file_name}</p>
                <p>{check(es3000)} Portada: {r.cover_size}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3 text-[13px] bg-black/40 rounded-xl p-3">
              <p><span className="text-zinc-500">Canta solo:</span> {r.canta_solo} ({r.num_artistas || "1"})</p>
              <p><span className="text-zinc-500">Featuring:</span> {r.featuring || "-"}</p>
              <p><span className="text-zinc-500">Es Cover:</span> {r.es_cover} {r.cover_de}</p>
              <p><span className="text-zinc-500">Compositor:</span> {r.compositor}</p>
              <p><span className="text-zinc-500">Productor:</span> {r.productor}</p>
              <p><span className="text-zinc-500">Explicito:</span> {r.explicito}</p>
              <p><span className="text-zinc-500">Genero:</span> {r.genre}</p>
              <p><span className="text-zinc-500">Idioma:</span> {r.idioma}</p>
              <p><span className="text-zinc-500">Fecha:</span> {r.release_date}</p>
              <p><span className="text-zinc-500">Instagram:</span> {r.instagram}</p>
              <p><span className="text-zinc-500">Email regalias:</span> {r.email_regalias}</p>
              <p><span className="text-zinc-500">WhatsApp:</span> {r.whatsapp}</p>
              <p><span className="text-zinc-500">User email:</span> {r.user_email}</p>
              <p><span className="text-zinc-500">Fee:</span> ${r.fee}</p>
            </div>

            {r.audio_url ? (
              <audio controls src={r.audio_url} className="w-full mt-3" />
            ) : (
              <p className="text-yellow-400 text-xs mt-2">⚠ Sin audio subido</p>
            )}

            <div className="mt-4">
              <p className="text-[11px] text-zinc-500 mb-2">PONLE EL ESTADO:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatus(r.id, "pendiente")}
                  className="bg-yellow-500 text-black text-xs font-bold px-3 py-2 rounded-full"
                >
                  🟡 Pendiente
                </button>
                <button
                  onClick={() => setStatus(r.id, "subiendo")}
                  className="bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-full"
                >
                  🔵 Subiendo
                </button>
                <button
                  onClick={() => setStatus(r.id, "listo")}
                  className="bg-green-500 text-black text-xs font-bold px-4 py-2 rounded-full"
                >
                  🟢 SUBIDO / LISTO
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3 border-t border-zinc-800 pt-3">
              <button
                onClick={() => setEditando(r)}
                className="bg-white text-black text-xs font-bold px-3 py-2 rounded-full"
              >
                ✏️ Editar
              </button>
              <a
                href={"https://wa.me/" + r.whatsapp + "?text=" + encodeURIComponent("Hola " +r.artist + ", soy UNICO DISTRO. Tu tema " + r.title + " tiene un error: ")}`}
                target="_blank"
                className="bg-[#25D366] text-black text-xs font-bold px-3 py-2 rounded-full"
              >
                WhatsApp Artista
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
                  placeholder="Titulo"
                  className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  value={editando.artist || ""}
                  onChange={(e) => setEditando({ ...editando, artist: e.target.value })}
                  placeholder="Artista"
                  className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  value={editando.nombre_personal || ""}
                  onChange={(e) => setEditando({ ...editando, nombre_personal: e.target.value })}
                  placeholder="Nombre personal"
                  className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  value={editando.cedula || ""}
                  onChange={(e) => setEditando({ ...editando, cedula: e.target.value })}
                  placeholder="Cedula"
                  className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  value={editando.compositor || ""}
                  onChange={(e) => setEditando({ ...editando, compositor: e.target.value })}
                  placeholder="Compositor"
                  className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  value={editando.productor || ""}
                  onChange={(e) => setEditando({ ...editando, productor: e.target.value })}
                  placeholder="Productor"
                  className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  value={editando.cover_size || ""}
                  onChange={(e) => setEditando({ ...editando, cover_size: e.target.value })}
                  placeholder="Cover size"
                  className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={guardarEdicion}
                    className="flex-1 bg-green-500 text-black font-bold py-2 rounded-full text-sm"
                  >
                    Guardar arreglo
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
