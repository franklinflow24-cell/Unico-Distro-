"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const CLAVE_ADMIN = "unico2026";

const supabase = createClient(
  "https://uxaupuajpfdvswnttysv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YXVwdWFqcGZkdnN3bnR0eXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MTYxMjIsImV4cCI6MjEwODk5MjEyMn0.cFINxKq7WCHWjCCFSiYQJRht4AyP80MA8A2xiRyBRjM"
);

type Release = {
  id: string;
  created_at: string;
  title: string | null;
  artist: string | null;
  nombre_personal: string | null;
  genre: string | null;
  release_date: string | null;
  file_name: string | null;
  cover_name: string | null;
  cover_size: string | null;
  user_email: string | null;
  whatsapp: string | null;
  email_regalias: string | null;
  compositor: string | null;
  productor: string | null;
  explicito: string | null;
  canta_solo: string | null;
  featuring: string | null;
  fee: string | null;
  status: string | null;
};

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [items, setItems] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    if (localStorage.getItem("unico_admin") === "ok") setAuth(true);
  }, []);

  useEffect(() => {
    if (auth) load();
  }, [auth]);

  async function load() {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("releases")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) {
      setError(err.message);
      setItems([]);
    } else {
      setError("");
      setItems((data as Release[]) || []);
    }
    setLoading(false);
  }

  function login() {
    if (clave === CLAVE_ADMIN) {
      localStorage.setItem("unico_admin", "ok");
      setAuth(true);
      setError("");
    } else setError("Clave incorrecta");
  }

  async function setStatus(id: string, status: string) {
    await supabase.from("releases").update({ status }).eq("id", id);
    await load();
  }

  const filtered = items.filter((r) => {
    if (filter === "todos") return true;
    return (r.status || "") === filter;
  });

  const count = (s: string) => items.filter((r) => r.status === s).length;

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
    <main className="min-h-screen bg-black text-white px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[11px] tracking-[0.3em] text-[#d4af37] font-bold">
              UNICO DISTRO · ADMIN
            </p>
            <h1 className="text-2xl font-black mt-1">Pedidos reales</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={load}
              className="text-xs px-3 py-1.5 rounded-full border border-white/20"
            >
              Actualizar
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("unico_admin");
                setAuth(false);
              }}
              className="text-xs px-3 py-1.5 rounded-full border border-red-500/40 text-red-400"
            >
              Salir
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-6 text-center text-xs">
          <div className="bg-zinc-900 rounded-2xl py-3 border border-white/10">
            <p className="font-black text-lg">{items.length}</p>
            <p className="text-gray-400">Total</p>
          </div>
          <div className="bg-zinc-900 rounded-2xl py-3 border border-white/10">
            <p className="font-black text-lg text-yellow-300">
              {count("esperando_paypal")}
            </p>
            <p className="text-gray-400">PayPal</p>
          </div>
          <div className="bg-zinc-900 rounded-2xl py-3 border border-white/10">
            <p className="font-black text-lg text-blue-300">
              {count("pagado_revisar") + count("subiendo_routenote")}
            </p>
            <p className="text-gray-400">En proceso</p>
          </div>
          <div className="bg-zinc-900 rounded-2xl py-3 border border-white/10">
            <p className="font-black text-lg text-green-400">
              {count("enviado_routenote")}
            </p>
            <p className="text-gray-400">Enviado</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {[
            ["todos", "Todos"],
            ["esperando_paypal", "Esperando PayPal"],
            ["pagado_revisar", "Pagado"],
            ["subiendo_routenote", "Subiendo RN"],
            ["enviado_routenote", "Enviado RN"],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                filter === k
                  ? "bg-white text-black"
                  : "bg-zinc-900 border border-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400">
            Error Supabase: {error}. ¿Corriste el SQL del PASO 1?
          </p>
        )}
        {loading && <p className="mt-6 text-gray-500">Cargando…</p>}
        {!loading && filtered.length === 0 && (
          <p className="mt-8 text-center text-gray-500">
            No hay pedidos todavía.
          </p>
        )}

        <div className="mt-4 space-y-4">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4"
            >
              <div className="flex justify-between gap-2">
                <div>
                  <p className="font-bold text-lg">{r.title || "Sin título"}</p>
                  <p className="text-sm text-gray-400">
                    {r.artist} · {r.genre || "—"}
                  </p>
                </div>
                <span className="text-[10px] h-fit px-2 py-1 rounded-full bg-white/10 font-bold">
                  {r.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-300">
                <p>
                  <span className="text-gray-500">Email:</span> {r.user_email}
                </p>
                <p>
                  <span className="text-gray-500">WhatsApp:</span>{" "}
                  {r.whatsapp || "—"}
                </p>
                <p>
                  <span className="text-gray-500">Personal:</span>{" "}
                  {r.nombre_personal || "—"}
                </p>
                <p>
                  <span className="text-gray-500">Fee:</span> ${r.fee || "5"}
                </p>
                <p>
                  <span className="text-gray-500">Audio:</span>{" "}
                  {r.file_name || "—"}
                </p>
                <p>
                  <span className="text-gray-500">Portada:</span>{" "}
                  {r.cover_name || "—"} ({r.cover_size || "?"})
                </p>
                <p>
                  <span className="text-gray-500">Compositor:</span>{" "}
                  {r.compositor || "—"}
                </p>
                <p>
                  <span className="text-gray-500">Productor:</span>{" "}
                  {r.productor || "—"}
                </p>
                <p className="col-span-2 text-gray-500">
                  {r.created_at
                    ? new Date(r.created_at).toLocaleString("es-DO")
                    : ""}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => setStatus(r.id, "pagado_revisar")}
                  className="text-xs px-3 py-2 rounded-full bg-yellow-500/20 text-yellow-300 font-bold"
                >
                  Marcar pagado
                </button>
                <button
                  onClick={() => setStatus(r.id, "subiendo_routenote")}
                  className="text-xs px-3 py-2 rounded-full bg-blue-500/20 text-blue-300 font-bold"
                >
                  Subiendo RouteNote
                </button>
                <button
                  onClick={() => setStatus(r.id, "enviado_routenote")}
                  className="text-xs px-3 py-2 rounded-full bg-green-500/20 text-green-300 font-bold"
                >
                  Enviado RouteNote
                </button>
                {r.whatsapp && (
                  <a
                    href={`https://wa.me/1${String(r.whatsapp).replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-3 py-2 rounded-full border border-[#25D366]/50 text-[#25D366]"
                  >
                    WhatsApp artista
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
