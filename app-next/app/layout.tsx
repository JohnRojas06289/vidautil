import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VidaÚtil — Premia lo que ya haces bien",
  description: "Conoce la huella ambiental de tu celular y cuánto CO₂ has evitado.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-vu-bg text-vu-textPrimary min-h-screen">
        {children}
      </body>
    </html>
  );
}
