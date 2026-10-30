export default function UploadPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6d2b]">
              U
            </div>
            <div>
              <h1 className="text-xl tracking-[0.2em] font-light leading-none">UNICO</h1>
              <p className="text-[9px] tracking-[0.3em] text-[#d4af37]">DISTRO</p>
            </div>
          </div>
          <a href="/" className="text-sm text-gray-500 hover:text-white transition">
            ← Inicio
          </a>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-2">Subir Música</h2>
        <p className="text-gray-400 mb-10">
          Completa la información de tu lanzamiento. Te llevaremos a todas las plataformas.
        </p>

        <form className="space-y-8">
          {/* Zona de drag & drop */}
          <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-12 text-center hover:border-[#d4af37]/50 transition cursor-pointer group">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-[#d4af37]/10 transition">
              <svg
                className="w-8 h-8 text-gray-500 group-hover:text-[#d4af37] transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-lg font-medium mb-1">Arrastra tu audio aquí</p>
            <p className="text-sm text-gray-500 mb-4">
              o haz clic para seleccionar (WAV, FLAC, MP3 • máx. 200 MB)
            </p>
            <button
              type="button"
              className="text-sm text-[#d4af37] border border-[#d4af37]/40 px-5 py-2 rounded-full hover:bg-[#d4af37]/10 transition"
            >
              Seleccionar archivo
            </button>
          </div>

          {/* Información del track */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Título de la canción *</label>
              <input
                type="text"
                placeholder="Ej: Mi Mejor Canción"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#d4af37] transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Artista principal *</label>
              <input
                type="text"
                placeholder="Tu nombre artístico"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#d4af37] transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Género *</label>
              <select className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#d4af37] transition appearance-none">
                <option value="">Selecciona un género</option>
                <option>Reggaetón</option>
                <option>Dembow</option>
                <option>Bachata</option>
                <option>Merengue</option>
                <option>Trap Latino</option>
                <option>Pop</option>
                <option>Hip-Hop</option>
                <option>Electrónica</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Fecha de lanzamiento</label>
              <input
                type="date"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#d4af37] transition"
              />
            </div>
          </div>

          {/* Cover art */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Portada (Cover Art) *</label>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-3">
                  JPG o PNG • mínimo 3000×3000 px • proporción 1:1
                </p>
                <button
                  type="button"
                  className="text-sm border border-zinc-600 px-4 py-2 rounded-full hover:border-[#d4af37] hover:text-[#d4af37] transition"
                >
                  Subir portada
                </button>
              </div>
            </div>
          </div>

          {/* Idioma / Explicit */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Idioma de la letra</label>
              <select className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#d4af37] transition appearance-none">
                <option>Español</option>
                <option>Inglés</option>
                <option>Instrumental</option>
                <option>Otro</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-8">
              <input type="checkbox" id="explicit" className="accent-[#d4af37] w-5 h-5" />
              <label htmlFor="explicit" className="text-sm text-gray-300 cursor-pointer">
                Contenido explícito (letras fuertes)
              </label>
            </div>
          </div>

          {/* Botones finales */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-zinc-800">
            <button
              type="button"
              className="flex-1 border border-zinc-600 py-3.5 rounded-full font-medium hover:bg-zinc-900 transition"
            >
              Guardar como borrador
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#d4af37] text-black font-bold py-3.5 rounded-full hover:bg-[#e5c04a] transition"
            >
              Continuar →
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
