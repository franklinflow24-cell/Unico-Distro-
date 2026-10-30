"use client";
import { useState } from "react";

export default function Page() {
  const [showForm, setShowForm] = useState(false);
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="flex justify-between items-center p-6 border-b border-white/10">
        <h1 className="text-2xl font-black">UBICALO DISTRO</h1>
        <span className="text-xs bg-white text-black px-3 py-1 rounded-full font-bold">80/20</span>
      </header>

      <section className="px-6 py-20 text-center">
        <h2 className="text-5xl font-black leading-tight">DISTRIBUYE TU MUSICA<br/><span className="text-zinc-500">EN TODO EL MUNDO</span></h2>
        <p className="mt-6 text-zinc-400 max-w-xl mx-auto">Spotify, Apple Music, YouTube Music, TikTok y 150+ tiendas. Te quedas con el 80% de las ganancias. Pago por PayPal.</p>
        <button onClick={()=>setShowForm(!showForm)} className="mt-8 bg-white text-black px-8 py-4 rounded-full font-bold text-lg">Empezar Ahora - Gratis</button>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto text-left">
          <div className="border border-white/10 p-4 rounded-2xl"><p className="font-bold">80% Para Ti</p><p className="text-xs text-zinc-500">Tu ganas el 80%</p></div>
          <div className="border border-white/10 p-4 rounded-2xl"><p className="font-bold">Pago PayPal</p><p className="text-xs text-zinc-500">Directo a tu cuenta</p></div>
          <div className="border border-white/10 p-4 rounded-2xl"><p className="font-bold">150+ Tiendas</p><p className="text-xs text-zinc-500">Mundial</p></div>
          <div className="border border-white/10 p-4 rounded-2xl"><p className="font-bold">Contrato Simple</p><p className="text-xs text-zinc-500">Sin letras pequeñas</p></div>
        </div>
      </section>

      {showForm && (
        <section className="px-6 pb-20 max-w-xl mx-auto">
          <div className="bg-white text-black p-8 rounded-[2rem]">
            <h3 className="text-2xl font-bold">Registro de Artista</h3>
            <p className="text-sm text-zinc-600 mt-2">Contrato 80/20 - Distribucion Musical</p>
            <form className="mt-6 space-y-4">
              <input placeholder="Nombre Artistico" className="w-full border p-3 rounded-xl"/>
              <input placeholder="Email" className="w-full border p-3 rounded-xl"/>
              <input placeholder="PayPal para pagos" className="w-full border p-3 rounded-xl"/>
              <input placeholder="Nombre de tu cancion" className="w-full border p-3 rounded-xl"/>
              <div className="text-xs bg-zinc-100 p-4 rounded-xl">
                <p className="font-bold">CONTRATO 80/20:</p>
                <p>El artista recibe 80% de regalias. Ubicalo Distro 20% por distribucion. Pago mensual via PayPal.</p>
              </div>
              <button type="button" className="w-full bg-black text-white p-4 rounded-xl font-bold">Aceptar y Distribuir</button>
            </form>
          </div>
        </section>
      )}

      <footer className="text-center p-8 text-zinc-600 text-xs border-t border-white/10">UBICALO DISTRO © 2026 - Santo Domingo, RD - PayPal: franklinflow24@gmail.com</footer>
    </main>
  );
}
