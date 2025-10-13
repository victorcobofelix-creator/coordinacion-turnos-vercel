"use client";

import React, { useEffect, useState } from "react";

export default function Page() {
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detectar si la app ya está instalada / en modo standalone
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;
    setIsStandalone(standalone);

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(console.error);
      });
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setCanInstall(false);
  };

  return (
    <div style={{ fontFamily: "system-ui", color: "#e5e7eb", background: "#0b1220", minHeight: "100vh", padding: "2rem" }}>
      <h1>Coordinación de Turnos</h1>
      <p>App y web para coordinar turnos, registrar incidencias y exportar reportes.</p>

      {/* Mostrar el botón solo si NO está instalada */}
      {!isStandalone && canInstall && (
        <button
          onClick={onInstall}
          style={{
            background: "#0ea5e9",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Instalar como App
        </button>
      )}
    </div>
  );
}
// ...queda igual arriba

  return (
    <div style={{ fontFamily: "system-ui", color: "#e5e7eb", background: "#0b1220", minHeight: "100vh", padding: "2rem" }}>
      <h1>Coordinación de Turnos</h1>
      <p>App y web para coordinar turnos, registrar incidencias y exportar reportes.</p>

      {/* Botón de instalar (se oculta si ya está instalada) */}
      {!isStandalone && canInstall && (
        <button
          onClick={onInstall}
          style={{ background: "#0ea5e9", color: "white", padding: "10px 16px", border: "none", borderRadius: "8px", cursor: "pointer", marginRight: 12 }}
        >
          Instalar como App
        </button>
      )}

      {/* Navegación rápida */}
      <a href="/incidencias" style={{ display: "inline-block", marginRight: 12, color: "#0ea5e9" }}>➜ Incidencias</a>
      <a href="/trabajadores" style={{ display: "inline-block", color: "#0ea5e9" }}>➜ Trabajadores</a>
    </div>
  );
}
