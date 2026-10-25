"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  CheckCircle2,
  CloudUpload,
  FileImage,
  Loader2,
  MapPin,
  RefreshCw,
  Send,
  TriangleAlert,
  User,
  X,
} from "lucide-react";
import { DEPARTMENTS, getDepartment, isDepartment } from "@/lib/departments";
import type { PhotoMeta } from "@/db/schema";

const ACCEPTED = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 12 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

async function compressImage(
  file: File
): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const maxDim = 1920;
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.86)
  );
  if (!blob) throw new Error("Compression impossible");
  return { blob, width, height };
}

type Status =
  | { phase: "choosing" }
  | { phase: "ready" }
  | { phase: "submitting"; label: string }
  | { phase: "success"; photo: PhotoMeta };

export default function UploadForm({
  preselectedDepartment,
}: {
  preselectedDepartment?: string | null;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [compressed, setCompressed] = useState<{
    blob: Blob;
    width: number;
    height: number;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState(
    isDepartment(preselectedDepartment) ? (preselectedDepartment as string) : ""
  );
  const [city, setCity] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>({ phase: "choosing" });
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const ready = !!compressed && title.trim().length >= 2 && !!department;
  const selectedDept = useMemo(
    () => (department ? getDepartment(department) : undefined),
    [department]
  );

  async function handleFile(next: File | null) {
    setError(null);
    if (!next) return;
    if (!ACCEPTED.includes(next.type)) {
      setError(
        "Format non pris en charge — choisissez une image PNG, JPEG ou WebP."
      );
      return;
    }
    if (next.size > MAX_BYTES) {
      setError("Cette image dépasse 12 Mo. Choisissez un fichier plus léger.");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(next);
    setCompressed(null);
    setPreviewUrl(URL.createObjectURL(next));
    setStatus({ phase: "submitting", label: "Préparation de l'image…" });
    try {
      const result = await compressImage(next);
      setCompressed(result);
      setStatus({ phase: "ready" });
    } catch {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setFile(null);
      setStatus({ phase: "choosing" });
      setError("Impossible de lire cette image. Essayez un autre fichier.");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || !compressed || !file) return;
    setError(null);
    setStatus({ phase: "submitting", label: "Envoi vers la galerie…" });
    try {
      const fd = new FormData();
      fd.append("file", compressed.blob, "cliche-bienvenue.jpg");
      fd.append("title", title.trim());
      fd.append("department", department);
      if (city.trim()) fd.append("city", city.trim());
      if (author.trim()) fd.append("author", author.trim());
      if (description.trim()) fd.append("description", description.trim());

      const res = await fetch("/api/photos", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Une erreur est survenue.");
      }
      setStatus({ phase: "success", photo: data.photo as PhotoMeta });
    } catch (err) {
      setStatus({ phase: "ready" });
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue pendant l'envoi."
      );
    }
  }

  function reset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setCompressed(null);
    setPreviewUrl(null);
    setTitle("");
    setCity("");
    setDescription("");
    setError(null);
    setStatus({ phase: "choosing" });
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status.phase === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-3xl bg-ink p-8 text-center text-cream sm:p-12"
          >
            <motion.span
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
              className="mx-auto grid size-20 place-items-center rounded-full bg-benin shadow-xl shadow-benin/30"
            >
              <CheckCircle2 className="size-10 text-cream" />
            </motion.span>
            <h2 className="mt-7 font-display text-3xl font-medium sm:text-4xl">
              Wε̌nù ! <em className="text-soleil">Merci.</em>
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream/65">
              «&nbsp;{status.photo.title}&nbsp;» rejoint la galerie
              {selectedDept ? ` du département ${selectedDept.name}` : ""}.
              Votre cliché est désormais visible par tout le Bénin — et le
              monde entier.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/departements/${status.photo.department}`}
                className="inline-flex items-center gap-2 rounded-full bg-soleil px-6 py-3.5 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                <MapPin className="size-4" />
                Voir dans {selectedDept?.name ?? "la galerie"}
              </Link>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full border-2 border-cream/25 px-6 py-3 text-sm font-bold text-cream transition-colors hover:border-soleil hover:text-soleil"
              >
                <RefreshCw className="size-4" />
                Partager un autre cliché
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onSubmit={submit}
            className="grid gap-8 lg:grid-cols-[1.05fr_1fr]"
          >
            {/* ——— Zone de dépôt ——— */}
            <div>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED.join(",")}
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />

              {previewUrl ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative overflow-hidden rounded-3xl ring-1 ring-ink/15"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Aperçu de votre cliché"
                    className="max-h-[30rem] w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/85 to-transparent p-5 pt-16">
                    <div className="min-w-0 text-cream">
                      <p className="flex items-center gap-2 text-sm font-bold">
                        <FileImage className="size-4 shrink-0 text-soleil" />
                        <span className="truncate">{file?.name}</span>
                      </p>
                      <p className="mt-1 text-xs text-cream/70">
                        {compressed
                          ? `${compressed.width} × ${compressed.height} px · ${formatBytes(
                              compressed.blob.size
                            )} après optimisation`
                          : "Préparation…"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={reset}
                      className="grid size-10 shrink-0 place-items-center rounded-full bg-cream/15 text-cream backdrop-blur transition-colors hover:bg-flamme"
                      aria-label="Retirer l'image"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => inputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      inputRef.current?.click();
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    handleFile(e.dataTransfer.files?.[0] ?? null);
                  }}
                  className={`group grid min-h-[22rem] cursor-pointer place-items-center rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                    dragging
                      ? "scale-[1.01] border-benin bg-benin/10"
                      : "border-ink/20 bg-parchment/60 hover:border-benin/60 hover:bg-benin/5"
                  }`}
                >
                  <div>
                    <motion.span
                      animate={dragging ? { scale: 1.15 } : { scale: 1 }}
                      className={`mx-auto grid size-20 place-items-center rounded-full transition-colors ${
                        dragging ? "bg-benin text-cream" : "bg-ink/[0.07] text-ink/60"
                      }`}
                    >
                      <CloudUpload className="size-9" />
                    </motion.span>
                    <p className="mt-6 font-display text-2xl font-medium text-ink">
                      Glissez votre photo ici
                    </p>
                    <p className="mt-2 text-sm text-ink/55">
                      ou{" "}
                      <span className="font-bold text-benin underline underline-offset-4">
                        cliquez pour la choisir
                      </span>
                    </p>
                    <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-ink/40 uppercase">
                      PNG · JPEG · WebP — 12 Mo max
                    </p>
                    {status.phase === "submitting" && (
                      <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-benin">
                        <Loader2 className="size-4 animate-spin" />
                        {status.label}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ——— Détails du cliché ——— */}
            <div className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="title"
                  className="mb-1.5 block text-xs font-bold tracking-[0.18em] text-ink/60 uppercase"
                >
                  Titre du cliché <span className="text-flamme">*</span>
                </label>
                <input
                  id="title"
                  className="field"
                  placeholder="Ex : Coucher de soleil sur Ganvié"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={140}
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="department"
                    className="mb-1.5 block text-xs font-bold tracking-[0.18em] text-ink/60 uppercase"
                  >
                    Département <span className="text-flamme">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="department"
                      className="field appearance-none pr-10"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                      style={
                        selectedDept
                          ? { borderColor: `${selectedDept.color}66` }
                          : undefined
                      }
                    >
                      <option value="" disabled>
                        Choisir…
                      </option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d.slug} value={d.slug}>
                          {d.name} — {d.capital}
                        </option>
                      ))}
                    </select>
                    <MapPin
                      className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
                      style={{
                        color: selectedDept?.color ?? "var(--color-ink)",
                        opacity: selectedDept ? 1 : 0.4,
                      }}
                    />
                  </div>
                  {selectedDept && (
                    <p className="mt-1.5 font-display text-xs text-ink/50 italic">
                      {selectedDept.tagline}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="mb-1.5 block text-xs font-bold tracking-[0.18em] text-ink/60 uppercase"
                  >
                    Ville / lieu
                  </label>
                  <input
                    id="city"
                    className="field"
                    placeholder="Ex : Cotonou, Kétou, Tanguiéta…"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    maxLength={80}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="author"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] text-ink/60 uppercase"
                >
                  <User className="size-3.5" />
                  Votre nom ou pseudo
                </label>
                <input
                  id="author"
                  className="field"
                  placeholder="Ex : Aïcha D."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  maxLength={80}
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-xs font-bold tracking-[0.18em] text-ink/60 uppercase"
                >
                  Racontez l&apos;histoire du cliché{" "}
                  <span className="font-medium normal-case opacity-60">
                    (facultatif)
                  </span>
                </label>
                <textarea
                  id="description"
                  className="field min-h-28 resize-y"
                  placeholder="Le contexte, l'anecdote, l'émotion du moment…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={600}
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 rounded-2xl border border-flamme/30 bg-flamme/10 px-4 py-3 text-sm font-semibold text-flamme"
                >
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={!ready || status.phase === "submitting"}
                className={`group mt-1 inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-4 text-sm font-bold transition-all ${
                  ready && status.phase !== "submitting"
                    ? "bg-ink text-cream shadow-xl shadow-ink/25 hover:-translate-y-0.5 hover:bg-benin"
                    : "cursor-not-allowed bg-ink/15 text-ink/40"
                }`}
              >
                {status.phase === "submitting" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {status.label}
                  </>
                ) : (
                  <>
                    <Send className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    Publier dans la galerie
                  </>
                )}
              </button>
              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ink/45">
                <Camera className="size-3.5" />
                Votre image est optimisée automatiquement avant l&apos;envoi.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
