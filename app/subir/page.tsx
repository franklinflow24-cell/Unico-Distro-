"use client";
import { useState } from "react";

export default function Subir() {
  const [artista, setArtista] = useState("");
  const [cancion, setCancion] = useState("");
  const [wa, setWa] = useState("");

  const enviar = () => {
    const texto = `NUEVO TEMA UNICO DISTRO: Artista ${artista} - Tema ${cancion} - WhatsApp ${wa}`;
    window.open(`https://wa.me/18295435381?text=${encodeURIComponent(texto)}`, "_blank");
    alert("Te llego a tu WhatsApp 8295435381 y a franklinflow24@gmail.com - Revisa tu admin");
  };

  return (
    <div style={{ background: "black", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ color: "#FFD700", textAlign: "center" }}>SUBE TU MUSICA - UNICO DISTRO</h1>
      <p style={{ color: "white", textAlign: "center" }}>Distribución para RD - Dembow, Trap, Drill</p>
      <input placeholder="Nombre Artista" value={artista} onChange={(e)=>setArtista(e.target.value)} style={{ width: "100%", padding: 15, marginTop: 15, borderRadius: 10 }} />
      <input placeholder="Nombre de la canción" value={cancion} onChange={(e)=>setCancion(e.target.value)} style={{ width: "100%", padding: 15, marginTop: 10, borderRadius: 10 }} />
      <input placeholder="Tu WhatsApp" value={wa} onChange={(e)=>setWa(e.target.value)} style={{ width: "100%", padding: 15, marginTop: 10, borderRadius: 10 }} />
      <button onClick={enviar} style={{ width: "100%", background: "#FFD700", padding: 15, borderRadius: 10, marginTop: 15, fontWeight: "bold" }}>ENVIAR A REVISION</button>
      <p style={{ color: "#aaa", textAlign: "center", marginTop: 15 }}>Al enviar te llega directo a Franklin - 8295435381</p>
    </div>
  );
}
