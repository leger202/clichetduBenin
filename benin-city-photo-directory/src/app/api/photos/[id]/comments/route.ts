import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { comments, photos } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f-]{36}$/i;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json(
      { error: "Identifiant invalide" },
      { status: 400 }
    );
  }

  try {
    const list = await db
      .select({
        id: comments.id,
        author: comments.author,
        content: comments.content,
        createdAt: comments.createdAt,
      })
      .from(comments)
      .where(eq(comments.photoId, id))
      .orderBy(desc(comments.createdAt))
      .limit(150);

    return NextResponse.json({ comments: list });
  } catch (err) {
    console.error("GET /api/photos/[id]/comments", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json(
      { error: "Identifiant invalide" },
      { status: 400 }
    );
  }

  let body: { author?: unknown; content?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête JSON attendu." },
      { status: 400 }
    );
  }

  const author =
    typeof body.author === "string" && body.author.trim()
      ? body.author.trim().slice(0, 80)
      : null;
  const content =
    typeof body.content === "string" ? body.content.trim() : "";

  if (content.length < 2 || content.length > 500) {
    return NextResponse.json(
      { error: "Le commentaire doit contenir entre 2 et 500 caractères." },
      { status: 400 }
    );
  }

  try {
    const [photo] = await db
      .select({ id: photos.id })
      .from(photos)
      .where(eq(photos.id, id))
      .limit(1);
    if (!photo) {
      return NextResponse.json(
        { error: "Cliché introuvable" },
        { status: 404 }
      );
    }

    const [created] = await db
      .insert(comments)
      .values({ photoId: id, author, content })
      .returning({
        id: comments.id,
        author: comments.author,
        content: comments.content,
        createdAt: comments.createdAt,
      });

    return NextResponse.json({ comment: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/photos/[id]/comments", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
