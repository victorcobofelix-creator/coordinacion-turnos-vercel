"use client";

import React, { useEffect, useMemo, useState } from "react";

type IncidentType = "retraso" | "ausencia" | "hora_extra" | "otra";

type Incident = {
  id: string;
  trabajador: string;
  tipo: IncidentType;
  fecha: string;      // ISO yyyy-mm-dd
  horas: number;      // puede ser 0 si ausencia
  notas?: string;
  evidenciaUrl?: string; // opcional (drive/url)
  pagadaNomina: boolean;
  createdAt: string;  // ISO
};

const STORAGE_KEY = "turnos_incidencias_v1";

export default function IncidenciasPage() {
  const [items, setItems] = useState<Incident[]>([]);
  const [form, setForm] = useState<Omit<Incident, "id" | "createdAt" | "pagadaNomina">>({
    trabajador: "",
    tipo: "retraso",
    fecha: new Date().toISOString().slice(0, 10),
    horas: 1,
    notas: "",
    evidenciaUrl: "",
  } as any);

  // cargar/guardar en localStorage (MVP sin servidor)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.trabajador.trim()) return alert("Introduce el nombre del trabajador");
    if (!form.fecha) return alert("Selecciona una fecha");
    const nuevo: Incident = {
      id: crypto.randomUUID(),
      trabajador: form.trabajador.trim(),
      tipo: form.tipo,
      fecha: form.fecha,
      horas: Number(form.horas) || 0,
      notas: form.notas?.trim() || "",
      evidenciaUrl: form.evidenciaUrl?.trim() || "",
      pagadaNomina: false,
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [nuevo, ...prev]);
    setForm({ ...form, notas: "", evidenciaUrl: "" });
  };

  const marcarNomina = (id: string, value: boolean) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, pagadaNomina: value } : i)));
  };

  const eliminar = (id: string) => {
    if (!confirm("¿Eliminar esta incidencia?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const exportCSV = () => {
    const headers = ["id","trabajador","tipo","fecha","horas","notas","evidenciaUrl","pagadaNomina","createdAt"];
    const rows = items.map(i => [
      i.id, i.trabajador, i.tipo, i.fecha, i.horas, (i.notas||"").replace(/\n/g," "),
      i.evidenciaUrl||"", i.pagadaNomina ? "sí" : "no", i.createdAt
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `incidencias_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalHoras = useMemo(() => items.reduce((acc, i) => acc + (i.tipo === "hora_extra" ? i.horas : 0), 0), [items]);

  // estilos inline sencillos (seguimos tu paleta)
  const card: React.CSSProperties = { background: "#111827", border: "1px solid #1f2937", borderRadius: 12, padding: 16, marginBottom: 16 };

  return (
    <div style={{ fontFamily: "system-ui", color: "#e5e7eb", background: "#0b1220", minHeight: "100vh", padding: "2rem" }}>
      <h1 style={{ marginTop: 0 }}>Incidencias</h1>
      <p>Registra retrasos, ausencias y horas extra. Se guardan en tu dispositivo (MVP).</p>

      <form onSubmit={onSubmit} style={card}>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
          <input
            placeholder="Trabajador"
            value={form.trabajador}
            onChange={(e) => setForm({ ...form, trabajador: e.target.value })}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #1f2937", gridColumn: "span 2" }}
          />
          <select
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value as IncidentType })}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #1f2937" }}
          >
            <option value="retraso">Retraso</option>
            <option value="ausencia">Ausencia</option>
            <option value="hora_extra">Hora extra</option>
            <option value="otra">Otra</option>
          </select>
          <input
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #1f2937" }}
          />
        </div>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 2fr 2fr", marginTop: 12 }}>
          <input
            type="number" step="0.25" min={0}
            placeholder="Horas"
            value={form.horas}
            onChange={(e) => setForm({ ...form, horas: Number(e.target.value) })}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #1f2937" }}
          />
          <input
            placeholder="URL evidencia (Drive/Foto opcional)"
            value={form.evidenciaUrl}
            onChange={(e) => setForm({ ...form, evidenciaUrl: e.target.value })}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #1f2937" }}
          />
          <input
            placeholder="Notas"
            value={form.notas}
            onChange={(e) => setForm({ ...form, notas: e.target.value })}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #1f2937" }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit" style={{ background: "#0ea5e9", color: "white", padding: "10px 16px", border: "none", borderRadius: 8, cursor: "pointer" }}>
            Guardar incidencia
          </button>
          <button type="button" onClick={exportCSV} style={{ marginLeft: 10, background: "transparent", color: "#0ea5e9", padding: "10px 16px", border: "1px solid #1f2937", borderRadius: 8, cursor: "pointer" }}>
            Exportar CSV
          </button>
          <a href="/" style={{ marginLeft: 10, color: "#0ea5e9" }}>Volver a inicio</a>
        </div>
      </form>

      <div style={card}>
        <strong>Total horas extra:</strong> {totalHoras}
      </div>

      {items.length === 0 ? (
        <div style={card}>No hay incidencias todavía.</div>
      ) : (
        items.map((i) => (
          <div key={i.id} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{i.trabajador}</div>
                <div style={{ color: "#9ca3af" }}>{i.tipo} · {i.fecha} · {i.horas} h</div>
                {i.notas ? <div style={{ marginTop: 6 }}>{i.notas}</div> : null}
                {i.evidenciaUrl ? <div style={{ marginTop: 6 }}>
                  <a target="_blank" href={i.evidenciaUrl} style={{ color: "#0ea5e9" }}>Ver evidencia</a>
                </div> : null}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="checkbox"
                    checked={i.pagadaNomina}
                    onChange={(e) => marcarNomina(i.id, e.target.checked)}
                  />
                  Pasada a nómina
                </label>
                <button onClick={() => eliminar(i.id)} style={{ background: "transparent", color: "#ef4444", border: "1px solid #1f2937", padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
