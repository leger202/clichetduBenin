"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MessageCircle, Send, User } from "lucide-react";
import type { Comment } from "@/db/schema";

type CommentItem = Pick<Comment, "id" | "author" | "content" | "createdAt">;

const rtf = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });

function relativeDate(iso: string | Date): string {
  const then = new Date(iso).getTime();
  const diffSec = Math.round((then - Date.now()) / 1000);
  const abs = Math.abs(diffSec);
  if (abs < 60) return "à l'instant";
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), "hour");
  if (abs < 2592000) return rtf.format(Math.round(diffSec / 86400), "day");
  if (abs < 31536000)
    return rtf.format(Math.round(diffSec / 2592000), "month");
  return rtf.format(Math.round(diffSec / 31536000), "year");
}

const AVATAR_COLORS = [
  "bg-benin",
  "bg-terra",
  "bg-flamme",
  "bg-lagoon",
  "bg-gold",
];

export default function Comments({
  photoId,
  initialCount,
}: {
  photoId: string;
  initialCount: number;
}) {
  const [items, setItems] = useState<CommentItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const count = items?.length ?? initialCount;

  useEffect(() => {
    let cancelled = false;
    setItems(null);
    setError(null);
    fetch(`/api/photos/${photoId}/comments`)
      .then(async (res) => {
        if (!res.ok) throw new Error();
        return (await res.json()) as { comments: CommentItem[] };
      })
      .then((data) => {
        if (!cancelled) setItems(data.comments);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger les commentaires.");
      });
    return () => {
      cancelled = true;
    };
  }, [photoId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || content.trim().length < 2) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/photos/${photoId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          author: author.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Une erreur est survenue.");
      }
      setItems((prev) => [data.comment as CommentItem, ...(prev ?? [])]);
      setContent("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section aria-label="Commentaires" className="mt-8 border-t border-cream/15 pt-6">
      <h4 className="flex items-center gap-2 text-sm font-bold tracking-[0.18em] text-cream/80 uppercase">
        <MessageCircle className="size-4 text-soleil" />
        Commentaires · {count}
      </h4>

      {/* ——— Formulaire ——— */}
      <form onSubmit={submit} className="mt-5 space-y-3">
        <div className="relative">
          <User className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-cream/35" />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={80}
            placeholder="Votre nom (facultatif)"
            className="w-full rounded-xl border border-cream/15 bg-cream/5 py-2.5 pr-4 pl-10 text-sm text-cream placeholder:text-cream/35 focus:border-soleil/60 focus:ring-2 focus:ring-soleil/20 focus:outline-none"
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          rows={3}
          required
          placeholder="Partagez votre impression sur ce cliché…"
          className="w-full resize-none rounded-xl border border-cream/15 bg-cream/5 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:border-soleil/60 focus:ring-2 focus:ring-soleil/20 focus:outline-none"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-[0.65rem] text-cream/35">
            {content.length}/500
          </span>
          <button
            type="submit"
            disabled={submitting || content.trim().length < 2}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
              content.trim().length >= 2 && !submitting
                ? "bg-soleil text-ink hover:-translate-y-0.5"
                : "cursor-not-allowed bg-cream/10 text-cream/40"
            }`}
          >
            {submitting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Send className="size-3.5" />
            )}
            Publier
          </button>
        </div>
        {error && (
          <p className="rounded-xl border border-flamme/40 bg-flamme/15 px-3.5 py-2.5 text-xs font-semibold text-flamme">
            {error}
          </p>
        )}
      </form>

      {/* ——— Liste ——— */}
      <div className="mt-6 space-y-4">
        {items === null && !error && (
          <div className="flex items-center gap-2 py-4 text-sm text-cream/45">
            <Loader2 className="size-4 animate-spin" />
            Chargement des commentaires…
          </div>
        )}
        {items !== null && items.length === 0 && (
          <p className="rounded-2xl border border-dashed border-cream/20 px-4 py-6 text-center font-display text-sm text-cream/50 italic">
            Soyez la première voix sur ce cliché.
          </p>
        )}
        <AnimatePresence initial={false}>
          {(items ?? []).map((c) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-3"
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-black text-cream ${
                  AVATAR_COLORS[
                    (c.author ?? "?").charCodeAt(0) % AVATAR_COLORS.length
                  ]
                }`}
              >
                {(c.author?.trim()[0] ?? "A").toUpperCase()}
              </span>
              <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm bg-cream/[0.07] px-4 py-3">
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-xs font-bold text-cream">
                    {c.author ?? "Anonyme"}
                  </span>
                  <span className="text-[0.65rem] text-cream/40">
                    {relativeDate(c.createdAt)}
                  </span>
                </p>
                <p className="mt-1 text-sm leading-relaxed break-words text-cream/80">
                  {c.content}
                </p>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
