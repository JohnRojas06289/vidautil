import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const dirPath = join(process.cwd(), "..", "data");
    const filePath = join(dirPath, "state.json");
    await mkdir(dirPath, { recursive: true });
    await writeFile(
      filePath,
      JSON.stringify({ ...data, timestamp: new Date().toISOString() }, null, 2),
      "utf-8"
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error writing state:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
