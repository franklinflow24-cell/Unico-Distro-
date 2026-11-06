export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Fondo urbano animado */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-[#d4af37]/15 blur-[100px] animate-pulse" />
        <div
          className="absolute -right-20 bottom-10 h-[380px] w-[380px] rounded-full bg-purple-700/20 blur-[110px]"
          style={{ animation: "float 8s ease-in-out infinite" }}
        />
        <div
          className="absolute left-1/3 top-1/3 h-[260px] w-[260px] rounded-full bg-cyan-500/10 blur-[90px]"
          style={{ animation: "float 11s ease-in-out infinite reverse" }}
        />
        {/* Textura tipo ciudad / luces */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.25) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-22px); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 pb-16 pt-14 text-center">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="text-7xl leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6d2b]">
            U
          </div>
          <h1 className="mt-2 text-2xl tracking-[0.35em] font-light">UNICO</h1>
          <p className="mt-1 text-[10px] tracking-[0.45em] text-[#d4af37]">
            DISTRO · MUSIC DISTRIBUTION
          </p>
        </div>

        {/* Hero */}
        <h2 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
          Distribuye tu música al{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f0d78c]">
            mundo
          </span>
        </h2>
        <p className="mt-5 max-w-2xl text-base text-gray-400 md:text-lg">
          La distribuidora de RD para nuevos talentos. Sube tu tema, paga{" "}
          <span className="text-[#d4af37] font-semibold">$5 USD</span> y nosotros lo
          llevamos a las plataformas. Tú te quedas con el{" "}
          <span className="text-white font-medium">100% de tus regalías</span>.
        </p>

        {/* CTA */}
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="/upload"
            className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black transition hover:bg-gray-100"
          >
            Subir Música
          </a>
          <a
            href="/login"
            className="rounded-full border border-white/40 px-8 py-3.5 text-sm font-medium transition hover:bg-white/10"
          >
            Iniciar Sesión
          </a>
        </div>

        {/* Soporte WhatsApp */}
        <a
          href="https://wa.me/18295435381?text=Hola%20UNICO%20DISTRO%2C%20necesito%20soporte"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#25D366]/50 bg-[#25D366]/10 px-5 py-2.5 text-sm font-medium text-[#25D366] transition hover:bg-[#25D366]/20"
        >
          <span className="text-lg leading-none">💬</span>
          Contactar con soporte (WhatsApp)
        </a>
        <p className="mt-2 text-xs text-gray-600">829-543-5381</p>

        {/* Plataformas */}
        <div className="mt-14 w-full">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-gray-500">
            Disponible en las principales plataformas
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {[
              { name: "Spotify", color: "#1DB954", big: true },
              { name: "Apple Music", color: "#FC3C44", big: true },
              { name: "Deezer", color: "#A238FF", big: true },
              { name: "TikTok", color: "#ff0050", big: true },
              { name: "YouTube Music", color: "#FF0000", big: false },
              { name: "Amazon Music", color: "#25D1DA", big: false },
              { name: "Instagram", color: "#E1306C", big: false },
              { name: "Facebook", color: "#1877F2", big: false },
              { name: "Pandora", color: "#00A0EE", big: false },
              { name: "Tidal", color: "#000000", big: false },
              { name: "Shazam", color: "#0088FF", big: false },
              { name: "+150 más", color: "#d4af37", big: false },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border border-white/10 bg-white/5 px-3 py-4 backdrop-blur-sm transition hover:border-[#d4af37]/40 hover:bg-white/10 ${
                  p.big ? "md:col-span-1" : ""
                }`}
                style={{ animation: "float 7s ease-in-out infinite" }}
              >
                <div
                  className="mx-auto mb-2 h-2 w-2 rounded-full"
                  style={{ backgroundColor: p.color, boxShadow: `0 0 12px ${p.color}` }}
                />
                <p
                  className={`font-semibold ${
                    ["Spotify", "Apple Music", "Deezer", "TikTok"].includes(p.name)
                      ? "text-white"
                      : "text-gray-300"
                  }`}
                >
                  {p.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cómo funciona */}
        <div className="mt-16 grid w-full gap-4 text-left md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Sube tu tema",
              d: "Audio, portada y datos del lanzamiento en minutos.",
            },
            {
              n: "02",
              t: "Paga $5 USD",
              d: "Un solo pago por lanzamiento. Las regalías son tuyas.",
            },
            {
              n: "03",
              t: "Va a las plataformas",
              d: "Nosotros lo subimos (RouteNote) a Spotify, Apple y más.",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5"
            >
              <p className="text-xs tracking-widest text-[#d4af37]">{s.n}</p>
              <h3 className="mt-2 text-lg font-bold">{s.t}</h3>
              <p className="mt-2 text-sm text-gray-400">{s.d}</p>
            </div>
          ))}
        </div>

        <p className="mt-16 text-xs text-gray-600">© 2026 UNICO DISTRO</p>
      </div>
    </main>
  );
}
