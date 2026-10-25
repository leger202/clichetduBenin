"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, MessageCircle } from "lucide-react";
import type { PhotoMeta } from "@/db/schema";
import { getDepartment } from "@/lib/departments";
import { getVoterToken } from "@/lib/voter";

const STORAGE_KEY = "cliches-benin-liked";

function readLiked(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function markLiked(id: string) {
  try {
    const list = readLiked();
    if (!list.includes(id)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...list, id]));
    }
  } catch {
    /* stockage indisponible */
  }
}

export function useLike(photo: PhotoMeta) {
  const [likes, setLikes] = useState(photo.likes);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(readLiked().includes(photo.id));
  }, [photo.id]);

  const like = async () => {
    if (liked) return;
    // Optimiste : on affiche tout de suite, le serveur arbitre ensuite.
    setLiked(true);
    setLikes((l) => l + 1);
    markLiked(photo.id);
    try {
      const res = await fetch(`/api/photos/${photo.id}/like`, {
        method: "POST",
        headers: { "x-voter": getVoterToken() },
      });
      if (res.ok) {
        const data = (await res.json()) as {
          likes: number;
          alreadyLiked?: boolean;
        };
        // Le serveur est la source de vérité (un like par utilisateur).
        setLikes(data.likes);
        if (data.alreadyLiked) markLiked(photo.id);
      }
    } catch {
      /* le like local reste affiché */
    }
  };

  return { likes, liked, like };
}

export default function PhotoCard({
  photo,
  index = 0,
  eager = false,
  onOpen,
}: {
  photo: PhotoMeta;
  index?: number;
  eager?: boolean;
  onOpen?: () => void;
}) {
  const { likes, liked, like } = useLike(photo);
  const dept = getDepartment(photo.department);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.05, 0.5),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="photo-card group relative overflow-hidden rounded-2xl bg-sand shadow-sm ring-1 ring-ink/10 transition-shadow duration-500 hover:shadow-xl hover:shadow-ink/15"
    >
      <button
        onClick={onOpen}
        className="relative block w-full cursor-zoom-in text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-benin"
        aria-label={`Agrandir : ${photo.title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/photos/${photo.id}/image`}
          alt={photo.title}
          loading={eager ? "eager" : "lazy"}
          className="w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.045]"
        />
        <span className="card-veil absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 pr-32">
          <span className="min-w-0">
            <span className="block truncate font-display text-lg leading-tight font-medium text-cream">
              {photo.title}
            </span>
            <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-cream/75">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">
                {photo.city ? `${photo.city} · ` : ""}
                {dept?.name ?? photo.department}
              </span>
            </span>
          </span>
        </figcaption>
        <span
          className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ink/55 px-3 py-1 text-[0.65rem] font-bold tracking-[0.14em] text-cream uppercase backdrop-blur-sm"
        >
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: dept?.color ?? "#f2b90d" }}
          />
          {dept?.name ?? photo.department}
        </span>
      </button>

      <div className="absolute right-3 bottom-3 z-10 flex items-center gap-1.5">
        <button
          onClick={onOpen}
          aria-label={`Voir les ${photo.commentCount} commentaire${photo.commentCount > 1 ? "s" : ""} de ${photo.title}`}
          className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold backdrop-blur-sm transition-all duration-300 ${
            photo.commentCount > 0
              ? "bg-cream/90 text-ink hover:scale-105 hover:bg-soleil"
              : "bg-ink/45 text-cream/80 hover:scale-105 hover:bg-ink/60"
          }`}
        >
          <MessageCircle className="size-3.5" />
          {photo.commentCount}
        </button>
        <button
          onClick={like}
          aria-pressed={liked}
          aria-label={
            liked ? "Vous aimez déjà ce cliché" : `Aimer ${photo.title}`
          }
          className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold backdrop-blur-sm transition-all duration-300 ${
            liked
              ? "bg-flamme text-white shadow-lg shadow-flamme/40"
              : "bg-cream/90 text-ink hover:scale-105 hover:bg-soleil"
          }`}
        >
          <motion.span
            key={likes}
            initial={{ scale: liked ? 1.6 : 1 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.6, duration: 0.5 }}
            className="grid place-items-center"
          >
            <Heart
              className={`size-3.5 ${liked ? "fill-white" : "fill-transparent"}`}
            />
          </motion.span>
          {likes}
        </button>
      </div>
    </motion.figure>
  );
}
