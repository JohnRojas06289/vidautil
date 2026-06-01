import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

// ArUco marker IDs available (4x4 dictionary, IDs 0-9)
const MARKER_IDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export interface SessionData {
  markerId: number;
  modelName: string;
  years: number;
  co2: number;
  annualFootprint: number;
  medal: string;
  costOfChangeNow: number;
  monthsEquivalent: number;
  equivalenceKmCar: number;
  equivalenceTrees: number;
  createdAt: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Pick least-recently-used marker ID
    const counts = await Promise.all(
      MARKER_IDS.map((id) => kv.get<number>(`marker:${id}:ts`))
    );
    const oldest = counts
      .map((ts, i) => ({ id: MARKER_IDS[i], ts: ts ?? 0 }))
      .sort((a, b) => a.ts - b.ts)[0];

    const markerId = oldest.id;
    const now = Date.now();

    const session: SessionData = {
      markerId,
      modelName: body.modelName,
      years: body.years,
      co2: body.co2,
      annualFootprint: body.annualFootprint,
      medal: body.medal,
      costOfChangeNow: body.costOfChangeNow,
      monthsEquivalent: body.monthsEquivalent,
      equivalenceKmCar: body.equivalenceKmCar,
      equivalenceTrees: body.equivalenceTrees,
      createdAt: new Date().toISOString(),
    };

    // Store session and update marker timestamp — expire after 1 hour
    await kv.set(`marker:${markerId}`, session, { ex: 3600 });
    await kv.set(`marker:${markerId}:ts`, now, { ex: 3600 });

    return NextResponse.json({ ok: true, markerId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const markerId = searchParams.get("markerId");

  if (markerId === null) {
    return NextResponse.json({ ok: false, error: "markerId required" }, { status: 400 });
  }

  try {
    const session = await kv.get<SessionData>(`marker:${markerId}`);
    if (!session) {
      return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, session });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
