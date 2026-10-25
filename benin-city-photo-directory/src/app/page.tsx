import Link from "next/link";
import { Camera, Compass, CloudUpload, ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import FlagStrip from "@/components/FlagStrip";
import SectionHeading from "@/components/SectionHeading";
import DepartmentCards from "@/components/DepartmentCards";
import PhotoGrid from "@/components/PhotoGrid";
import Reveal from "@/components/Reveal";
import { getRecentPhotos, getSiteStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

const CITIES = [
  "Cotonou",
  "Porto-Novo",
  "Parakou",
  "Abomey",
  "Natitingou",
  "Ouidah",
  "Grand-Popo",
  "Kandi",
  "Djougou",
  "Lokossa",
  "Bohicon",
  "Savalou",
  "Kétou",
  "Tanguiéta",
];

const STEPS = [
  {
    number: "01",
    icon: Camera,
    title: "Photographiez",
    color: "#0a7a46",
    text: "Un marché qui s'anime, une case aux toits de chaume, un coucher de soleil sur la lagune — chaque coin du Bénin mérite son image.",
  },
  {
    number: "02",
    icon: CloudUpload,
    title: "Partagez",
    color: "#f2b90d",
    text: "Choisissez votre fichier PNG ou JPEG, indiquez le département et la ville, racontez l'histoire : c'est en ligne en quelques secondes.",
  },
  {
    number: "03",
    icon: Compass,
    title: "Explorez",
    color: "#cf3a2a",
    text: "Parcourez la galerie ville par ville, aimez vos clichés préférés et redécouvrez le pays à travers les yeux des autres.",
  },
];

export default async function HomePage() {
  const [stats, recent] = await Promise.all([
    getSiteStats(),
    getRecentPhotos(8),
  ]);

  return (
    <>
      <Hero
        totalPhotos={stats.totalPhotos}
        totalDepartments={stats.totalDepartments}
        totalLikes={stats.totalLikes}
      />

      <FlagStrip />

      {/* ——— Défilé des villes ——— */}
      <div className="border-b border-ink/10 bg-cream py-7">
        <Marquee items={CITIES} />
      </div>

      {/* ——— Le concept ——— */}
      <section className="motif-mud relative overflow-hidden py-24 lg:py-32">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
          <SectionHeading
            kicker="Le concept"
            title={
              <>
                Une archive vivante,
                <em className="text-benin"> ouverte à tous</em>.
              </>
            }
            description="Pas besoin de compte, pas de formulaire interminable. Vous photographiez, vous partagez, le Bénin s'expose au monde entier."
          />

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.number} delay={i * 0.12}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-ink/10 bg-cream p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-ink/10">
                  <span
                    className="absolute -top-6 -right-3 font-display text-[7rem] leading-none font-semibold select-none"
                    style={{ color: `${step.color}14` }}
                  >
                    {step.number}
                  </span>
                  <span
                    className="relative grid size-14 place-items-center rounded-2xl text-cream shadow-lg transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110"
                    style={{ backgroundColor: step.color }}
                  >
                    <step.icon className="size-6" />
                  </span>
                  <h3 className="relative mt-6 font-display text-2xl font-medium">
                    {step.title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-ink/60">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Départements ——— */}
      <section id="departements" className="scroll-mt-24 py-24 lg:py-32">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
          <SectionHeading
            kicker="Exploration territoriale"
            title={
              <>
                Douze départements,
                <em className="text-flamme"> mille merveilles</em>.
              </>
            }
            description="De l'Alibori au Littoral, chaque département raconte sa propre histoire. Choisissez une terre, laissez les images parler."
          />
          <div className="mt-16">
            <DepartmentCards stats={stats.perDepartment} />
          </div>
        </div>
      </section>

      <FlagStrip />

      {/* ——— Derniers clichés ——— */}
      <section className="bg-parchment/60 py-24 lg:py-32">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              align="left"
              kicker="Fraîchement arrivés"
              title={
                <>
                  Les derniers <em className="underline-swoosh italic">clichés</em>
                </>
              }
            />
            <Reveal delay={0.1}>
              <Link
                href="/galerie"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-ink px-6 py-3 text-sm font-bold transition-all hover:bg-ink hover:text-cream"
              >
                Voir toute la galerie
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-12">
            <PhotoGrid
              photos={recent}
              eagerCount={4}
              emptyMessage="La galerie n'attend que votre premier cliché."
            />
          </div>
        </div>
      </section>

      {/* ——— Appel à contribution ——— */}
      <section className="relative overflow-hidden bg-foret py-24 text-cream lg:py-32">
        <div className="motif-zigzag-light absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.32em] text-soleil uppercase">
              À vous de jouer
            </p>
            <h2 className="mt-5 font-display text-4xl leading-[1.05] font-medium tracking-tight text-balance sm:text-6xl">
              Votre Bénin mérite
              <em className="text-soleil"> d&apos;être vu</em>.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/70">
              Que vous soyez à Cotonou, Kétou ou Kandi : un seul cliché peut
              faire rayonner votre quartier sur la carte du pays.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contribuer"
                className="group inline-flex items-center gap-2.5 rounded-full bg-soleil px-8 py-4 text-sm font-bold text-ink shadow-xl shadow-black/20 transition-all hover:-translate-y-1"
              >
                <Camera className="size-4 transition-transform duration-300 group-hover:rotate-12" />
                Partager un cliché
              </Link>
              <span className="text-xs font-semibold tracking-[0.2em] text-cream/50 uppercase">
                Gratuit · Sans compte · En 30 secondes
              </span>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
