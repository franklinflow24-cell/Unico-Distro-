export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
      {/* LOGO UNICO - Hecho en código, sin imagen */}
      <div className="flex flex-col items-center mb-10">
        <div className="text-[120px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6d2b]">U</div>
        <div className="-mt-8 w-24 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
        <h1 className="mt-6 text-4xl tracking-[0.3em] font-light">UNICO</h1>
        <h2 className="text-sm tracking-[0.6em] text-[#d4af37]">DISTRO</h2>
        <p className="text-[10px] tracking-[0.5em] text-gray-500 mt-1">MUSIC DISTRIBUTION</p>
      </div>

      <h1 className="text-3xl md:text-5xl font-bold text-center mb-4">
        Distribuye tu música al mundo
      </h1>
      <p className="text-gray-400 text-center max-w-2xl mb-8 text-lg">
        La distribuidora #1 de RD. Sube tu música a Spotify, Apple Music, TikTok y 150+ plataformas. Quédate con el 100% de tus regalías.
      </p>

      <div className="flex gap-4">
        <a href="#" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition">
          Subir Música
        </a>
        <a href="#" className="border border-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition">
          Iniciar Sesión
        </a>
      </div>

      <p className="mt-20 text-xs text-gray-600">© 2026 UNICO DISTRO</p>
    </main>
  );
}
