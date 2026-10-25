"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import type { PhotoMeta } from "@/db/schema";
import { getDepartment } from "@/lib/departments";
import PhotoCard, { useLike } from "./PhotoCard";
import Comments from "./Comments";

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function LightboxLikeButton({ photo }: { photo: PhotoMeta }) {
  const { likes, liked, like } = useLike(photo);
  return (
    <button
      onClick={like}
      className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
        liked
          ? "bg-flamme text-white shadow-lg shadow-flamme/40"
          : "bg-soleil text-ink hover:-translate-y-0.5"
      }`}
    >
      <Heart className={`size-4 ${liked ? "fill-white" : ""}`} />
      {liked ? "Aimé" : "J'aime"} · {likes}
    </button>
  );
}

export default function PhotoGrid({
  photos,
  eagerCount = 0,
  emptyMessage = "Aucun cliché pour le moment.",
  showEmptyCta = true,
}: {
  photos: PhotoMeta[];
  eagerCount?: number;
  emptyMessage?: string;
  showEmptyCta?: boolean;
}) {
  const [idx, setIdx] = useState<number | null>(null);
  const open = idx !== null;
  const current = open ? photos[idx] : null;

  const close = useCallback(() => setIdx(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setIdx((i) =>
        i === null ? i : (i + dir + photos.length) % photos.length
      ),
    [photos.length]
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target && (target.tagName === "TEXTAREA" || target.tagName === "INPUT");
      if (typing) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-ink/15 bg-parchment/50 px-6 py-20 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-ink/5">
          <Camera className="size-7 text-ink/40" />
        </span>
        <p className="mt-5 font-display text-2xl text-ink/80 italic">
          {emptyMessage}
        </p>
        {showEmptyCta && (
          <Link
            href="/contribuer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-cream transition-colors hover:bg-benin"
          >
            <Camera className="size-4" />
            Partager le premier cliché
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="masonry">
        {photos.map((photo, i) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={i}
            eager={i < eagerCount}
            onOpen={() => setIdx(i)}
          />
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex flex-col bg-ink/95 backdrop-blur-md"
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 z-20 grid size-12 place-items-center rounded-full border border-cream/20 bg-ink/50 text-cream transition-colors hover:bg-flamme"
              aria-label="Fermer"
            >
              <X className="size-5" />
            </button>

            <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
              {/* ——— Zone image ——— */}
              <div
                className="relative flex h-[42svh] shrink-0 cursor-zoom-out items-center justify-center p-4 sm:p-6 lg:h-auto lg:flex-1"
                onClick={close}
              >
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        step(-1);
                      }}
                      className="absolute top-1/2 left-3 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-cream/20 bg-ink/50 text-cream transition-colors hover:bg-benin sm:left-5"
                      aria-label="Cliché précédent"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        step(1);
                      }}
                      className="absolute top-1/2 right-3 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-cream/20 bg-ink/50 text-cream transition-colors hover:bg-benin sm:right-5"
                      aria-label="Cliché suivant"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  </>
                )}
                <motion.img
                  key={current.id}
                  src={`/api/photos/${current.id}/image`}
                  alt={current.title}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-full max-w-full cursor-default rounded-xl object-contain shadow-2xl shadow-black/50 ring-1 ring-cream/15"
                />
              </div>

              {/* ——— Panneau d'infos + commentaires ——— */}
              <motion.aside
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="min-h-0 flex-1 overflow-y-auto border-t border-cream/10 bg-ink/40 lg:max-w-md lg:flex-none lg:border-t-0 lg:border-l"
              >
                <div className="p-6 sm:p-8">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-cream/5 px-3 py-1 text-[0.62rem] font-bold tracking-[0.18em] text-cream/75 uppercase">
                    <span
                      className="size-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          getDepartment(current.department)?.color ??
                          "#f2b90d",
                      }}
                    />
                    {getDepartment(current.department)?.name ??
                      current.department}
                  </span>

                  <h3 className="mt-4 font-display text-3xl leading-tight font-medium text-cream">
                    {current.title}
                  </h3>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-cream/65">
                    {current.city && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-4 text-soleil" />
                        {current.city}
                      </span>
                    )}
                    {current.author && (
                      <span className="flex items-center gap-1.5">
                        <User className="size-4 text-soleil" />
                        {current.author}
                      </span>
                    )}
                    <span className="text-cream/40">
                      {dateFmt.format(new Date(current.createdAt))}
                    </span>
                  </div>

                  {current.description && (
                    <p className="mt-5 border-l-2 border-soleil/50 pl-4 font-display text-sm leading-relaxed text-cream/70 italic">
                      {current.description}
                    </p>
                  )}

                  <div className="mt-6">
                    <LightboxLikeButton photo={current} />
                    <p className="mt-2 text-[0.65rem] text-cream/35">
                      Un seul coup de cœur par personne — choisissez bien !
                    </p>
                  </div>

                  <Comments
                    photoId={current.id}
                    initialCount={current.commentCount}
                  />
                </div>
              </motion.aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
