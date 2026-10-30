import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="mb-8">
        <img src="/logo.png" alt="Unico Distro" className="w-[320px] md:w-[450px] object-contain" />
      </div>

      {/* Texto */}
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-4">
        Distribuye tu música al mundo
      </h1>
      <p className="text-gray-400 text-center max-w-2xl mb-8 text-lg">
        La distribuidora #1 de RD. Sube tu música a Spotify, Apple Music, TikTok y 150+ plataformas. Quédate con el 100% de tus regalías.
      </p>

      {/* Botones */}
      <div className="flex gap-4">
        <a href="#" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition">
          Subir Música
        </a>
        <a href="#" className="border border-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition">
          Iniciar Sesión
        </a>
      </div>

      {/* Footer */}
      <p className="mt-20 text-xs text-gray-600">© 2026 UNICO DISTRO - MUSIC DISTRIBUTION</p>
    </main>
  );
}
