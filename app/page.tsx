export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-[#d4af37]/15 blur-[100px] animate-pulse" />
        <div className="absolute -right-20 bottom-10 h-[380px] w-[380px] rounded-full bg-purple-700/20 blur-[110px] animate-pulse" />
        <div className="absolute left-1/3 top-1/3 h-[260px] w-[260px] rounded-full bg-cyan-500/10 blur-[90px] animate-pulse" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 pb-16 pt-14 text-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="text-7xl leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6d2b]">
            U
          </div>
          <h1 className="mt-2 text-2xl tracking-[0.35em] font-light">UNICO</h1>
          <p className="mt-1 text-[10px] tracking-[0.45em] text-[#d4af37]">
            DISTRO · MUSIC DISTRIBUTION
          </p>
        </div>

        <h2 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
          Distribuye tu música al{" "}
          <span className="text-[#d4af37]">mundo</span>
        </h2>

        <p className="mt-5 max-w-2xl text-base text-gray-400 md:text-lg">
          La distribuidora de RD para nuevos talentos. Sube tu tema, paga{" "}
          <span className="font-semibold text-[#d4af37]">$5 USD</span> y nosotros
          lo llevamos a las plataformas. Tú te quedas con el{" "}
          <span className="font-medium text-white">100% de tus regalías</span>.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="/login"
            className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black"
          >
            Subir Música
          </a>
          <a
            href="/login"
            className="rounded-full border border-white/40 px-8 py-3.5 text-sm font-medium"
          >
            Iniciar Sesión
          </a>
        </div>

        <a
          href="https://wa.me/18295435381?text=Hola%20UNICO%20DISTRO%2C%20necesito%20soporte"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#25D366]/50 bg-[#25D366]/10 px-5 py-2.5 text-sm font-medium text-[#25D366]"
        >
          Contactar con soporte (WhatsApp)
        </a>
        <p className="mt-2 text-xs text-gray-600">829-543-5381</p>

        <div className="mt-14 w-full">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-gray-500">
            Disponible en las principales plataformas
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {[
              "Spotify",
              "Apple Music",
              "Deezer",
              "TikTok",
              "YouTube Music",
              "Amazon Music",
              "Instagram",
              "+150 más",
            ].map((name) => (
              <div
                key={name}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4"
              >
                <p className="font-semibold text-white">{name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid w-full gap-4 text-left md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <p className="text-xs tracking-widest text-[#d4af37]">01</p>
            <h3 className="mt-2 text-lg font-bold">Sube tu tema</h3>
            <p className="mt-2 text-sm text-gray-400">
              Audio, portada y datos del lanzamiento.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <p className="text-xs tracking-widest text-[#d4af37]">02</p>
            <h3 className="mt-2 text-lg font-bold">Paga $5 USD</h3>
            <p className="mt-2 text-sm text-gray-400">
              Un pago por lanzamiento. Regalías 100% tuyas.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <p className="text-xs tracking-widest text-[#d4af37]">03</p>
            <h3 className="mt-2 text-lg font-bold">Va a las plataformas</h3>
            <p className="mt-2 text-sm text-gray-400">
              Nosotros lo subimos a Spotify, Apple y más.
            </p>
          </div>
        </div>

        <p className="mt-16 text-xs text-gray-600">© 2026 UNICO DISTRO</p>
      </div>
    </main>
  );
}
