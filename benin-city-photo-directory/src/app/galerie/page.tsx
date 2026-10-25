import type { Metadata } from "next";
import { Images } from "lucide-react";
import GalleryBrowser from "@/components/GalleryBrowser";
import Reveal from "@/components/Reveal";
import FlagStrip from "@/components/FlagStrip";
import { getSiteStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "La galerie",
  description:
    "Explorez tous les clichés du Bénin : filtrez par département, recherchez une ville, découvrez les photos les plus aimées.",
};

export default async function GaleriePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const stats = await getSiteStats();
  const counts = Object.fromEntries(
    stats.perDepartment.map((s) => [s.department, s.count])
  );

  return (
    <div className="motif-mud min-h-screen">
      {/* ——— En-tête ——— */}
      <div className="border-b border-ink/10 pt-32 pb-12">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
          <Reveal>
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.32em] text-benin uppercase">
              <Images className="size-4" />
              La galerie nationale
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.02] font-medium tracking-tight sm:text-7xl">
              Tout le Bénin,
              <em className="text-flamme"> en images</em>.
            </h1>
            <p className="mt-5 max-w-xl text-base text-ink/60">
              {stats.totalPhotos} cliché{stats.totalPhotos > 1 ? "s" : ""}{" "}
              partagé{stats.totalPhotos > 1 ? "s" : ""} à travers{" "}
              {stats.totalDepartments} département
              {stats.totalDepartments > 1 ? "s" : ""}. Cliquez sur une image
              pour l&apos;agrandir, aimez vos préférées.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ——— Filtres + grille ——— */}
      <div className="mx-auto max-w-[90rem] px-5 py-12 sm:px-8">
        <GalleryBrowser
          counts={counts}
          initialDepartment={
            typeof sp.department === "string" ? sp.department : null
          }
          initialSort={typeof sp.sort === "string" ? sp.sort : null}
        />
      </div>

      <FlagStrip />
    </div>
  );
}
