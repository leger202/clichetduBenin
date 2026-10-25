import Link from "next/link";
import { Camera, Heart } from "lucide-react";
import FlagStrip from "./FlagStrip";
import Logo from "./Logo";
import { DEPARTMENTS } from "@/lib/departments";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      <FlagStrip />
      <div className="motif-zigzag-light">
        <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr] lg:py-20">
          <div>
            <Logo light />
            <p className="mt-6 max-w-sm font-display text-2xl leading-snug text-cream/90 italic">
              Une archive vivante des plus belles images du Bénin,
              photographiée par celles et ceux qui l&apos;aiment.
            </p>
            <Link
              href="/contribuer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-soleil px-6 py-3 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5"
            >
              <Camera className="size-4" />
              Ajouter votre cliché
            </Link>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.3em] text-cream/50 uppercase">
              Départements
            </h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {DEPARTMENTS.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/departements/${d.slug}`}
                    className="text-sm text-cream/75 transition-colors hover:text-soleil"
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.3em] text-cream/50 uppercase">
              Explorer
            </h3>
            <ul className="mt-5 space-y-2.5">
              <li>
                <Link
                  href="/galerie"
                  className="text-sm text-cream/75 transition-colors hover:text-soleil"
                >
                  La galerie complète
                </Link>
              </li>
              <li>
                <Link
                  href="/galerie?sort=popular"
                  className="text-sm text-cream/75 transition-colors hover:text-soleil"
                >
                  Les plus aimés
                </Link>
              </li>
              <li>
                <Link
                  href="/contribuer"
                  className="text-sm text-cream/75 transition-colors hover:text-soleil"
                >
                  Partager un cliché
                </Link>
              </li>
            </ul>
            <p className="mt-10 text-xs leading-relaxed text-cream/40">
              12 départements · Des centaines de villes et villages ·
              Une seule passion : le 229.
            </p>
          </div>
        </div>

        <div className="border-t border-cream/10">
          <div className="mx-auto flex max-w-[90rem] flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-cream/45 sm:flex-row sm:px-8">
            <p>
              © {new Date().getFullYear()} Clichés du Bénin — Tous droits
              réservés aux photographes.
            </p>
            <p className="flex items-center gap-1.5">
              Fait avec
              <Heart className="size-3.5 fill-flamme text-flamme" />
              entre Cotonou et Parakou
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
