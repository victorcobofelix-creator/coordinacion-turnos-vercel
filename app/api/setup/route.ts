// app/api/setup/route.ts
import { NextResponse } from "next/server";
import { ensureTables } from "../../../lib/db"; // ← 3 niveles arriba

export async function GET() {
  try {
    await ensureTables();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}
