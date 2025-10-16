"use client";
import React, { useEffect, useState } from "react";

type Worker = { id: string; nombre: string; email?: string; activo: boolean };
const K = "turnos_trabajadores_v1";

export default function TrabajadoresPage() {
  const [items, setItems] = useState<Worker[]>([]);
  const [nombre, setNombre] = useState("");

  // cargar y guardar en localStorage
  useEffect(() => {
    try { const raw = localStorage.getItem(K); if (raw) setItems(JSON.parse(raw)); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(K, JSON.stringify(items)); } catch {}
  }, [items]);

  const add = () => {
    if (!nombre.trim()) return alert("Escribe un nombre");
    setItems([{ id: crypto.randomUUID(), nombre: nombre.trim(), activo: true }, ...items]);
    setNombre("");
  };

  const remove = (id: string) => {
    if (!confirm("¿Eliminar trabajador?")) return;
    setItems(items.filter(w => w.id !== id));
  };

  return (
    <div style={{ fontFamily: "system-ui", color: "#e5e7eb", background: "#0b1220", minHeight: "100vh", padding: "2rem" }}>
      <h1>Trabajadores</h1>

      <div style={{ marginBottom: 16 }}>
        <input
          value={nombre}
          onChange={(e)=>setNombre(e.target.value)}
          placeholder="Nombre"
          style={{ padding: 10, borderRadius: 8, border: "1px solid #1f2937", marginRight: 8 }}
        />
        <button
          onClick={add}
          style={{ background: "#0ea5e9", color: "white", padding: "10px 16px", border: "none", borderRadius: 8, cursor: "pointer" }}
        >
          Añadir
        </button>
        <a href="/" style={{ marginLeft: 10, color: "#0ea5e9" }}>Volver a inicio</a>
      </div>

      {items.length === 0 ? (
        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 12, padding: 12 }}>
          No hay trabajadores todavía.
        </div>
      ) : (
        <ul style={{ marginTop: 0, padding: 0, listStyle: "none" }}>
          {items.map(w => (
            <li key={w.id} style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 12, padding: 12, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{w.nombre}</span>
              <button onClick={() => remove(w.id)} style={{ background: "transparent", color: "#ef4444", border: "1px solid #1f2937", padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
