import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VidaÚtil — Premia lo que ya haces bien",
  description: "Conocé la huella ambiental de tu celular y cuánto CO₂ ya evitaste.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VidaÚtil",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#04342C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" style={{ colorScheme: "dark" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-vu-bg text-vu-textPrimary">
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  );
}
