import "../styles/globals.css";

export const viewport = { themeColor: "#0ea5e9" };

export const metadata = {
  title: "Coordinación de Turnos — MVP",
  description: "App y web para coordinar turnos, registrar incidencias y exportar reportes."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
