import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNICO DISTRO | Distribuye tu música al mundo",
  description:
    "La distribuidora #1 de RD. Sube tu música a Spotify, Apple Music, TikTok y 150+ plataformas. Quédate con el 100% de tus regalías.",
  keywords: [
    "distribución musical",
    "RD",
    "República Dominicana",
    "Spotify",
    "Apple Music",
    "TikTok",
    "regalías",
    "UNICO DISTRO",
  ],
  authors: [{ name: "UNICO DISTRO" }],
  openGraph: {
    title: "UNICO DISTRO",
    description:
      "Distribuye tu música al mundo. 100% de tus regalías. Spotify, Apple Music, TikTok y 150+ plataformas.",
    url: "https://unico-distro.vercel.app",
    siteName: "UNICO DISTRO",
    locale: "es_DO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UNICO DISTRO",
    description: "Distribuye tu música al mundo. 100% de tus regalías.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
