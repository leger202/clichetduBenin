import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Camera, Landmark, MapPin } from "lucide-react";
import PhotoGrid from "@/components/PhotoGrid";
import Reveal from "@/components/Reveal";
import FlagStrip from "@/components/FlagStrip";
import { DEPARTMENTS, getDepartment, isDepartment } from "@/lib/departments";
import { getPhotosByDepartment } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dept = getDepartment(slug);
  if (!dept) return { title: "Département introuvable" };
  return {
    title: `Clichés du ${dept.name}`,
    description: `Les plus belles photos du département ${dept.name} (${dept.capital}) — ${dept.tagline}. Partagez vos propres clichés !`,
  };
}

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isDepartment(slug)) notFound();
  const dept = getDepartment(slug)!;
  const photos = await getPhotosByDepartment(slug);

  const siblings = DEPARTMENTS.filter((d) => d.slug !== slug).slice(0, 5);

  return (
    <div className="min-h-screen">
      {/* ——— En-tête du département ——— */}
      <div
        className="relative overflow-hidden pt-32 pb-14 text-cream"
        style={{
          background: `linear-gradient(135deg, ${dept.color} 0%, #14231a 95%)`,
        }}
      >
        <div className="motif-zigzag-light absolute inset-0" />
        <div className="relative mx-auto max-w-[90rem] px-5 sm:px-8">
          <Reveal>
            <Link
              href="/galerie"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-cream/60 uppercase transition-colors hover:text-soleil"
            >
              <ArrowLeft className="size-3.5" />
              Toute la galerie
            </Link>
            <p className="mt-8 flex items-center gap-2 text-xs font-bold tracking-[0.32em] text-cream/70 uppercase">
              <MapPin className="size-4 text-soleil" />
              Département · {dept.region} du Bénin
            </p>
            <h1 className="mt-4 font-display text-6xl leading-none font-medium tracking-tight sm:text-8xl">
              {dept.name}
            </h1>
            <p className="mt-5 max-w-lg font-display text-xl text-cream/80 italic">
              {dept.tagline}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-cream/20 pt-6 text-sm">
              <span className="flex items-center gap-2 text-cream/85">
                <Landmark className="size-4 text-soleil" />
                Chef-lieu : <strong>{dept.capital}</strong>
              </span>
              <span className="flex items-center gap-2 text-cream/85">
                <Camera className="size-4 text-soleil" />
                <strong>
                  {photos.length} cliché{photos.length > 1 ? "s" : ""}
                </strong>{" "}
                partagé{photos.length > 1 ? "s" : ""}
              </span>
              <Link
                href={`/contribuer?dept=${slug}`}
                className="ml-auto inline-flex items-center gap-2 rounded-full bg-soleil px-5 py-2.5 text-xs font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                <Camera className="size-3.5" />
                Ajouter un cliché du {dept.name}
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      <FlagStrip />

      {/* ——— Les clichés ——— */}
      <div className="mx-auto max-w-[90rem] px-5 py-14 sm:px-8">
        <PhotoGrid
          photos={photos}
          eagerCount={4}
          emptyMessage={`Le ${dept.name} attend son premier cliché.`}
        />
      </div>

      {/* ——— Autres départements ——— */}
      <div className="border-t border-ink/10 bg-parchment/60 py-14">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.32em] text-benin uppercase">
              Continuer l&apos;exploration
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {siblings.map((d) => (
                <Link
                  key={d.slug}
                  href={`/departements/${d.slug}`}
                  className="chip"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  {d.name}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
