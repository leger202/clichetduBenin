import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { photos } from "@/db/schema";
import { getPhotos } from "@/lib/queries";
import { isDepartment } from "@/lib/departments";
import { imageSize } from "image-size";

export const dynamic = "force-dynamic";

const MAX_BYTES = 12 * 1024 * 1024; // 12 Mo
const ACCEPTED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const department = searchParams.get("department");
  const q = searchParams.get("q");
  const sort = searchParams.get("sort") === "popular" ? "popular" : "recent";
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") ?? "80", 10) || 80, 1),
    200
  );

  try {
    const list = await getPhotos({
      department: isDepartment(department) ? department : null,
      q,
      sort,
      limit,
    });
    return NextResponse.json({ photos: list });
  } catch (err) {
    console.error("GET /api/photos", err);
    return NextResponse.json(
      { error: "Impossible de charger les clichés." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Requête invalide (multipart attendu)." },
      { status: 400 }
    );
  }

  const file = form.get("file");
  const title = String(form.get("title") ?? "").trim();
  const department = String(form.get("department") ?? "").trim();
  const author = String(form.get("author") ?? "").trim() || null;
  const city = String(form.get("city") ?? "").trim() || null;
  const description =
    String(form.get("description") ?? "").trim() || null;

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Aucun fichier reçu." },
      { status: 400 }
    );
  }
  if (!ACCEPTED_TYPES.has(file.type)) {
    return NextResponse.json(
      {
        error:
          "Format non pris en charge. Utilisez une image PNG, JPEG ou WebP.",
      },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image trop lourde (maximum 12 Mo)." },
      { status: 413 }
    );
  }
  if (title.length < 2 || title.length > 140) {
    return NextResponse.json(
      { error: "Le titre doit contenir entre 2 et 140 caractères." },
      { status: 400 }
    );
  }
  if (!isDepartment(department)) {
    return NextResponse.json(
      { error: "Veuillez choisir un département valide." },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    let width: number | null = null;
    let height: number | null = null;
    try {
      const dim = imageSize(buffer);
      width = dim.width ?? null;
      height = dim.height ?? null;
    } catch {
      // dimensions non critiques
    }

    const [created] = await db
      .insert(photos)
      .values({
        title,
        author,
        city,
        description,
        department,
        mimeType: file.type,
        imageData: buffer.toString("base64"),
        width,
        height,
      })
      .returning({
        id: photos.id,
        title: photos.title,
        author: photos.author,
        description: photos.description,
        department: photos.department,
        city: photos.city,
        mimeType: photos.mimeType,
        width: photos.width,
        height: photos.height,
        likes: photos.likes,
        createdAt: photos.createdAt,
      });

    return NextResponse.json(
      { photo: { ...created, commentCount: 0 } },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/photos", err);
    return NextResponse.json(
      { error: "Une erreur est survenue pendant l'envoi du cliché." },
      { status: 500 }
    );
  }
}
