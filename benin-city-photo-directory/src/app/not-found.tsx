import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="motif-mud grid min-h-screen place-items-center px-5 pt-20">
      <div className="text-center">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-ink/5">
          <Compass className="size-9 text-ink/50" />
        </span>
        <p className="mt-8 font-display text-8xl font-semibold text-ink/10 select-none">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium sm:text-4xl">
          Ce coin du Bénin n&apos;existe pas
          <em className="text-benin">… encore</em>.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm text-ink/55">
          La page que vous cherchez s&apos;est égarée entre deux collines.
          Retournons sur les terres connues.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-cream transition-colors hover:bg-benin"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/galerie"
            className="rounded-full border-2 border-ink px-6 py-2.5 text-sm font-bold transition-colors hover:bg-ink hover:text-cream"
          >
            Voir la galerie
          </Link>
        </div>
      </div>
    </div>
  );
}
