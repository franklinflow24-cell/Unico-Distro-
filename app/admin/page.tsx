"use client";
import { useState } from "react";

export default function Admin() {
  const [clave, setClave] = useState("");
  const [ok, setOk] = useState(false);

  if (!ok) {
    return (
      <div style={{ background: "black", minHeight: "100vh", padding: 20, textAlign: "center" }}>
        <h1 style={{ color: "#FFD700" }}>UNICO DISTRO - ADMIN</h1>
        <p style={{ color: "white" }}>Solo Franklin</p>
        <input
          type="password"
          placeholder="Clave"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          style={{ padding: 12, borderRadius: 10, marginTop: 20, width: 250, textAlign: "center" }}
        />
        <br />
        <button
          onClick={() => {
            if (clave === "unico2026") setOk(true);
            else alert("Clave mal");
          }}
          style={{ background: "#FFD700", padding: "12px 30px", borderRadius: 10, marginTop: 15, fontWeight: "bold" }}
        >
          ENTRAR
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "black", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ color: "#FFD700" }}>PENDIENTES POR APROBAR</h1>
      <p style={{ color: "white" }}>Te llega a: 8295435381 y franklinflow24@gmail.com</p>
      <div style={{ background: "#222", padding: 20, borderRadius: 12, marginTop: 20 }}>
        <p style={{ color: "white" }}>Artista Prueba - Mi Primer Dembow</p>
        <p style={{ color: "#aaa" }}>WhatsApp: 8295435381</p>
        <button style={{ background: "green", color: "white", padding: "10px 20px", borderRadius: 10, marginRight: 10 }}>APROBAR</button>
        <button style={{ background: "red", color: "white", padding: "10px 20px", borderRadius: 10 }}>RECHAZAR</button>
      </div>
    </div>
  );
}
