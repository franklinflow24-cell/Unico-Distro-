"use client";
import { useState } from "react";

export default function AdminUnico() {
  const [pass, setPass] = useState("");
  const [entro, setEntro] = useState(false);

  // Datos de ejemplo - luego se conectan a Supabase
  const [temas] = useState([
    { artista: "Artista Prueba", tema: "Mi Primer Dembow", whatsapp: "8295435381", fecha: "Hace 2 min" }
  ]);

  if (!entro) {
    return (
      <div style={{ background: "#000", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <h1 style={{ color: "#FFD700", fontSize: 28, fontWeight: "bold" }}>UNICO DISTRO - ADMIN</h1>
        <p style={{ color: "#fff", marginTop: 10 }}>Solo Franklin</p>
        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          style={{ marginTop: 20, padding: 12, borderRadius: 10, width: 280, textAlign: "center" }}
        />
        <button
          onClick={() => { if (pass === "unico2026") setEntro(true); else alert("Clave mal"); }}
          style={{ marginTop: 15, background: "#FFD700", color: "#000", padding: "12px 40px", borderRadius: 10, fontWeight: "bold" }}
        >
          ENTRAR
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ color: "#FFD700", fontSize: 24, fontWeight: "bold" }}>PENDIENTES POR APROBAR</h1>
      <p style={{ color: "#aaa" }}>Notificaciones a: 8295435381 • franklinflow24@gmail.com</p>

      {temas.map((t, i) => (
        <div key={i} style={{ background: "#1a1a1a", padding: 20, borderRadius: 15, marginTop: 20 }}>
          <p style={{ color: "#fff", fontSize: 18 }}>Artista: {t.artista} • Tema: {t.tema}</p>
          <p style={{ color: "#aaa" }}>WhatsApp: {t.whatsapp} • {t.fecha}</p>
          <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
            <button style={{ background: "#444", color: "#fff", padding: "10px 20px", borderRadius: 10 }}>ESCUCHAR</button>
            <button onClick={() => alert("Aprobado! Ahora súbelo a RouteNote como UNICO DISTRO")} style={{ background: "#00C853", color: "#fff", padding: "10px 20px", borderRadius: 10, fontWeight: "bold" }}>APROBAR</button>
            <button style={{ background: "#FF1744", color: "#fff", padding: "10px 20px", borderRadius: 10 }}>RECHAZAR</button>
          </div>
        </div>
      ))}
    </div>
  );
}
