import { NextResponse } from "next/server";
import { ensureTables } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureTables();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
