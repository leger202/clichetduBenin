"use client";

import { useEffect, useRef, useState } from "react";
import { Flame, Loader2, Search, Sparkles } from "lucide-react";
import type { PhotoMeta } from "@/db/schema";
import { DEPARTMENTS, isDepartment } from "@/lib/departments";
import PhotoGrid from "./PhotoGrid";

type SortMode = "recent" | "popular";

export default function GalleryBrowser({
  counts,
  initialDepartment,
  initialSort,
}: {
  counts: Record<string, number>;
  initialDepartment?: string | null;
  initialSort?: string | null;
}) {
  const [dept, setDept] = useState<string>(
    isDepartment(initialDepartment) ? (initialDepartment as string) : "all"
  );
  const [sort, setSort] = useState<SortMode>(
    initialSort === "popular" ? "popular" : "recent"
  );
  const [q, setQ] = useState("");
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    const timer = setTimeout(
      async () => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        setLoading(true);
        setError(null);
        try {
          const params = new URLSearchParams();
          if (dept !== "all") params.set("department", dept);
          if (q.trim()) params.set("q", q.trim());
          params.set("sort", sort);
          const res = await fetch(`/api/photos?${params.toString()}`, {
            signal: controller.signal,
          });
          if (!res.ok) throw new Error();
          const data = (await res.json()) as { photos: PhotoMeta[] };
          setPhotos(data.photos);
        } catch (err) {
          if ((err as Error).name !== "AbortError") {
            setError("Impossible de charger les clichés. Réessayez.");
          }
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      },
      firstRun.current ? 0 : 280
    );
    firstRun.current = false;
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dept, q, sort, reload]);

  const activeDept = DEPARTMENTS.find((d) => d.slug === dept);

  return (
    <div>
      {/* ——— Filtres ——— */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="edge-fade -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
          <button
            className="chip"
            data-active={dept === "all"}
            onClick={() => setDept("all")}
          >
            Tout le Bénin
            <span className="rounded-full bg-current/10 px-1.5 text-[0.65rem] opacity-70">
              {Object.values(counts).reduce((a, b) => a + b, 0)}
            </span>
          </button>
          {DEPARTMENTS.map((d) => (
            <button
              key={d.slug}
              className="chip"
              data-active={dept === d.slug}
              onClick={() => setDept(d.slug)}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              {d.name}
              {(counts[d.slug] ?? 0) > 0 && (
                <span className="rounded-full bg-current/10 px-1.5 text-[0.65rem] opacity-70">
                  {counts[d.slug]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="relative flex-1 lg:w-60 lg:flex-none">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink/40" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ville, titre, photographe…"
              className="field py-2.5 pl-10 text-sm"
              aria-label="Rechercher un cliché"
            />
          </div>
          <div className="flex shrink-0 rounded-full border-[1.5px] border-ink/15 bg-parchment/60 p-1">
            {(
              [
                { id: "recent", label: "Récents", icon: Sparkles },
                { id: "popular", label: "Les plus aimés", icon: Flame },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSort(id)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  sort === id
                    ? "bg-ink text-cream shadow"
                    : "text-ink/55 hover:text-ink"
                }`}
                aria-pressed={sort === id}
              >
                <Icon className="size-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ——— Résultats ——— */}
      <div className="mt-8">
        {loading ? (
          <div className="masonry">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-full animate-pulse rounded-2xl bg-sand/80"
                style={{ aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "4/3" : "1/1" }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-flamme/25 bg-flamme/5 px-6 py-16 text-center">
            <p className="font-display text-xl text-flamme italic">{error}</p>
            <button
              onClick={() => setReload((r) => r + 1)}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-cream"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <PhotoGrid
            photos={photos}
            eagerCount={3}
            emptyMessage={
              activeDept
                ? `Pas encore de cliché dans ${activeDept.name}.${
                    q ? " Essayez une autre recherche." : ""
                  }`
                : q
                  ? "Aucun cliché ne correspond à votre recherche."
                  : "La galerie attend vos plus belles images."
            }
          />
        )}
      </div>

      {!loading && !error && (
        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs font-semibold tracking-[0.22em] text-ink/40 uppercase">
          {loading && <Loader2 className="size-3 animate-spin" />}
          {photos.length} cliché{photos.length > 1 ? "s" : ""}
          {activeDept ? ` dans ${activeDept.name}` : " à travers le Bénin"}
        </p>
      )}
    </div>
  );
}
