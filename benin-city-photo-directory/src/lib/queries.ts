import { db } from "@/db";
import { photos, type PhotoMeta } from "@/db/schema";
import {
  and,
  count,
  desc,
  eq,
  ilike,
  or,
  sql,
  type SQL,
} from "drizzle-orm";

const metaColumns = {
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
  commentCount:
    sql<number>`(select count(*)::int from "comments" where "comments"."photo_id" = "photos"."id")`.mapWith(
      Number
    ),
} as const;

export type PhotoListOptions = {
  department?: string | null;
  q?: string | null;
  sort?: "recent" | "popular";
  limit?: number;
};

export async function getPhotos(
  opts: PhotoListOptions = {}
): Promise<PhotoMeta[]> {
  const { department, q, sort = "recent", limit = 80 } = opts;

  const conditions = [];
  if (department) conditions.push(eq(photos.department, department));
  if (q && q.trim()) {
    const pattern = `%${q.trim()}%`;
    conditions.push(
      or(
        ilike(photos.title, pattern),
        ilike(photos.city, pattern),
        ilike(photos.author, pattern),
        ilike(photos.description, pattern)
      )
    );
  }

  const where = conditions.length ? and(...conditions) : undefined;
  const orderBy: SQL[] =
    sort === "popular"
      ? [desc(photos.likes), desc(photos.createdAt)]
      : [desc(photos.createdAt)];

  return db
    .select(metaColumns)
    .from(photos)
    .where(where)
    .orderBy(...orderBy)
    .limit(limit);
}

export async function getRecentPhotos(limit = 8): Promise<PhotoMeta[]> {
  return getPhotos({ sort: "recent", limit });
}

export async function getPhotosByDepartment(
  slug: string,
  limit = 80
): Promise<PhotoMeta[]> {
  return getPhotos({ department: slug, limit });
}

export type DepartmentStat = {
  department: string;
  count: number;
  coverId: string | null;
};

export type SiteStats = {
  totalPhotos: number;
  totalDepartments: number;
  totalLikes: number;
  perDepartment: DepartmentStat[];
};

export async function getSiteStats(): Promise<SiteStats> {
  const [counts, covers, totals] = await Promise.all([
    db
      .select({ department: photos.department, count: count(photos.id) })
      .from(photos)
      .groupBy(photos.department),
    // Latest photo per department (PostgreSQL DISTINCT ON)
    db.execute<{ id: string; department: string }>(
      sql`select distinct on (department) id, department from photos order by department, created_at desc`
    ),
    db
      .select({
        total: count(photos.id),
        likes: sql<number>`coalesce(sum(${photos.likes}), 0)::int`,
        depts: sql<number>`count(distinct ${photos.department})::int`,
      })
      .from(photos),
  ]);

  const coverMap = new Map(
    covers.rows.map((r) => [r.department, r.id] as const)
  );
  const countMap = new Map(counts.map((c) => [c.department, c.count] as const));

  const perDepartment: DepartmentStat[] = Array.from(
    new Set([...counts.map((c) => c.department)])
  ).map((dept) => ({
    department: dept,
    count: countMap.get(dept) ?? 0,
    coverId: coverMap.get(dept) ?? null,
  }));

  return {
    totalPhotos: totals[0]?.total ?? 0,
    totalDepartments: totals[0]?.depts ?? 0,
    totalLikes: totals[0]?.likes ?? 0,
    perDepartment,
  };
}
