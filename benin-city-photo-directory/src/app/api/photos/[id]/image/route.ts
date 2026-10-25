import { NextResponse } from "next/server";
import { db } from "@/db";
import { photos } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return new NextResponse("Identifiant invalide", { status: 400 });
  }

  try {
    const rows = await db
      .select({ mimeType: photos.mimeType, imageData: photos.imageData })
      .from(photos)
      .where(eq(photos.id, id))
      .limit(1);

    const row = rows[0];
    if (!row) {
      return new NextResponse("Cliché introuvable", { status: 404 });
    }

    const buffer = Buffer.from(row.imageData, "base64");
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": row.mimeType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("GET /api/photos/[id]/image", err);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}
