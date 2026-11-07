"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export default function Admin() {
  const [releases, setReleases] = useState<any[]>([]);
  const cargar = async () => {
    const { data } = await supabase.from("releases").select("*").order("id", { ascending: false });
    if (data) setReleases(data);
  };
  useEffect(()=>{ cargar(); },[]);
  const setStatus = async (id:number, s:string) => { await supabase.from("releases").update({ status: s }).eq("id", id); cargar(); };
  const check = (c:boolean) => c ? "✅" : "❌";
  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 max-w-[700px] mx-auto">
      <h1 className="text-[28px] font-black">Admin - Requiar</h1>
      <button onClick={cargar} className="border border-zinc-700 rounded-full px-4 py-1.5 text-sm">Actualizar</button>
      {releases.map((r)=>{
        const es3000 = r.cover_size === "3000x3000";
        const esWav = r.file_name?.toLowerCase().endsWith(".wav") || r.file_name?.toLowerCase().endsWith(".flac");
        return (
          <div key={r.id} className="mt-4 bg-[#151515] border border-zinc-800 rounded-[18px] p-4">
            <h2 className="font-bold">{r.title} - {r.artist}</h2>
            <div className="flex gap-3 mt-3">
              <div className="w-[110px] h-[110px] bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
                {r.cover_url ? <img src={r.cover_url} className="w-full h-full object-cover" /> : <p className="text-[11px] text-center p-2">{r.cover_name}<br/>{r.cover_size}</p>}
              </div>
              <div className="text-[13px]">
                <p>{check(!!r.title)} Titulo: {r.title}</p>
                <p>{check(!!r.artist)} Artista: {r.artist}</p>
                <p>{check(!!r.nombre_personal)} Personal: {r.nombre_personal || "FALTA"}</p>
                <p>{check(!!r.cedula)} Cedula: {r.cedula || "FALTA"}</p>
                <p>{check(esWav)} Audio: {r.file_name}</p>
                <p>{check(es3000)} Portada: {r.cover_size}</p>
              </div>
            </div>
            {r.audio_url && <audio controls src={r.audio_url} className="w-full mt-3" />}
            <p className="text-xs text-zinc-400 mt-2">Email: {r.user_email} WA: {r.whatsapp} Comp: {r.compositor} Prod: {r.productor}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={()=>setStatus(r.id,"pagado_revisar")} className="bg-[#d4af37] text-black text-xs font-bold px-3 py-2 rounded-full">Pagado</button>
              <button onClick={()=>setStatus(r.id,"enviado_routenote")} className="bg-green-600 text-xs px-3 py-2 rounded-full">Enviado RN</button>
            </div>
            <p className="text-[11px] text-zinc-600 mt-1">{r.status}</p>
          </div>
        );
      })}
    </div>
  );
}
