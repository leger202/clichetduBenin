import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { photoLikes, photos } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f-]{36}$/i;
const VOTER_RE = /^[a-z0-9-]{8,64}$/i;

/**
 * Like un cliché — un utilisateur (jeton navigateur) ne peut liker
 * qu'une seule fois : la contrainte d'unicité (photo_id, voter) fait foi.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const voter = req.headers.get("x-voter") ?? "";

  if (!UUID_RE.test(id)) {
    return NextResponse.json(
      { error: "Identifiant invalide" },
      { status: 400 }
    );
  }
  if (!VOTER_RE.test(voter)) {
    return NextResponse.json(
      { error: "Jeton de votant manquant ou invalide" },
      { status: 400 }
    );
  }

  try {
    const [photo] = await db
      .select({ likes: photos.likes })
      .from(photos)
      .where(eq(photos.id, id))
      .limit(1);
    if (!photo) {
      return NextResponse.json(
        { error: "Cliché introuvable" },
        { status: 404 }
      );
    }

    // Tentative d'enregistrement du vote : l'unicité bloque les doublons.
    try {
      await db.insert(photoLikes).values({ photoId: id, voter });
    } catch (err) {
      const pgErr = err as { code?: string } | null;
      if (pgErr && (pgErr.code === "23505" || (pgErr as { cause?: { code?: string } }).cause?.code === "23505")) {
        // Déjà liké → on renvoie le compteur actuel sans incrémenter.
        return NextResponse.json({
          likes: photo.likes,
          alreadyLiked: true,
        });
      }
      throw err;
    }

    const [updated] = await db
      .update(photos)
      .set({ likes: sql`${photos.likes} + 1` })
      .where(eq(photos.id, id))
      .returning({ likes: photos.likes });

    return NextResponse.json({
      likes: updated?.likes ?? photo.likes + 1,
      alreadyLiked: false,
    });
  } catch (err) {
    console.error("POST /api/photos/[id]/like", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
