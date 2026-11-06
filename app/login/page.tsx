<div className="flex justify-end -mt-2">
            <button
              type="button"
              onClick={async () => {
                if (!email) {
                  setError("Escribe tu correo arriba para recuperar la contraseña.");
                  return;
                }
                const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
                  redirectTo: "https://unico-distro.vercel.app/login",
                });
                if (err) setError(err.message);
                else setGoogleMsg("Te enviamos un correo para restablecer la contraseña.");
              }}
              className="text-sm text-[#d4af37] hover:underline"
            >
              ¿Olvidé mi contraseña?
            </button>
          </div>
