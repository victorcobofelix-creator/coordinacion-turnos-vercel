"use client";

import React, { useEffect, useState } from "react";

export default function Page() {
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
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
      <button
        onClick={onInstall}
        disabled={!canInstall}
        style={{ background: "#0ea5e9", color: "white", padding: "10px 16px", border: "none", borderRadius: "8px", cursor: "pointer" }}
      >
        Instalar como App
      </button>
    </div>
  );
}
