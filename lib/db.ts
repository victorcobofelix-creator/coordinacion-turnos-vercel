// lib/db.ts
import { sql } from "@vercel/postgres";

/** Crea tablas si no existen */
export async function ensureTables() {
  await sql/*sql*/`
    CREATE TABLE IF NOT EXISTS workers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql/*sql*/`
    CREATE TABLE IF NOT EXISTS incidents (
      id TEXT PRIMARY KEY,
      worker_id TEXT REFERENCES workers(id) ON DELETE SET NULL,
      type TEXT NOT NULL,
      date DATE NOT NULL,
      hours NUMERIC NOT NULL DEFAULT 0,
      notes TEXT,
      evidence_url TEXT,
      paid BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}
