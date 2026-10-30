import "./globals.css";
export const metadata = { title: "UBICALO DISTRO", description: "Distribuye tu musica" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body>{children}</body></html>
}
