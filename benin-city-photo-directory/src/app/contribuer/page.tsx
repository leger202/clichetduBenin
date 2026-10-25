import type { Metadata } from "next";
import { Camera, Lightbulb, MapPin, ShieldCheck, Users } from "lucide-react";
import UploadForm from "@/components/UploadForm";
import Reveal from "@/components/Reveal";
import FlagStrip from "@/components/FlagStrip";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Partager un cliché",
  description:
    "Envoyez votre plus belle photo du Bénin : PNG ou JPEG, classée par département et par ville, visible par le monde entier en quelques secondes.",
};

const TIPS = [
  {
    icon: Lightbulb,
    title: "Une image qui respire",
    text: "Privilégiez la netteté et la lumière naturelle — les heures dorées subliment toujours la terre rouge du pays.",
  },
  {
    icon: MapPin,
    title: "Un lieu précis",
    text: "Ville, quartier, marché ou monument : plus le lieu est précis, plus le cliché aide à cartographier le Bénin.",
  },
  {
    icon: Users,
    title: "Le respect des personnes",
    text: "Si des visages sont visibles, assurez-vous d'avoir l'accord des personnes photographiées.",
  },
  {
    icon: ShieldCheck,
    title: "Vos photos uniquement",
    text: "Ne partagez que des images dont vous êtes l'auteur. Chaque cliché reste votre fierté.",
  },
];

export default async function ContributePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const dept = typeof sp.dept === "string" ? sp.dept : null;

  return (
    <div className="motif-mud min-h-screen">
      <div className="border-b border-ink/10 pt-32 pb-12">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
          <Reveal>
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.32em] text-benin uppercase">
              <Camera className="size-4" />
              Contribution ouverte à tous
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.02] font-medium tracking-tight sm:text-7xl">
              Montrez votre
              <em className="underline-swoosh"> Bénin</em> au monde.
            </h1>
            <p className="mt-5 max-w-xl text-base text-ink/60">
              Un seul fichier — PNG, JPEG ou WebP — et quelques mots. Votre
              cliché rejoint la galerie de son département en quelques
              secondes.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-[90rem] px-5 py-14 sm:px-8">
        <div className="grid gap-10 xl:grid-cols-[1.6fr_1fr]">
          <Reveal>
            <div className="rounded-3xl border border-ink/10 bg-cream/80 p-6 shadow-xl shadow-ink/5 backdrop-blur-sm sm:p-9">
              <UploadForm preselectedDepartment={dept} />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <aside className="sticky top-28 overflow-hidden rounded-3xl bg-ink p-8 text-cream">
              <div className="motif-zigzag-light absolute inset-0" />
              <div className="relative">
                <p className="text-xs font-bold tracking-[0.3em] text-soleil uppercase">
                  La charte du beau cliché
                </p>
                <h2 className="mt-3 font-display text-3xl font-medium">
                  Quatre règles
                  <em className="text-soleil"> en or</em>
                </h2>
                <ul className="mt-8 space-y-6">
                  {TIPS.map((tip, i) => (
                    <li key={tip.title} className="flex gap-4">
                      <span className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-cream/10">
                        <tip.icon className="size-5 text-soleil" />
                        <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-soleil text-[0.6rem] font-black text-ink">
                          {i + 1}
                        </span>
                      </span>
                      <div>
                        <h3 className="text-sm font-bold">{tip.title}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-cream/60">
                          {tip.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-9 rounded-2xl border border-cream/15 bg-cream/5 p-5">
                  <p className="font-display text-sm text-cream/80 italic">
                    « Une image vaut mille mots — un cliché du Bénin en vaut
                    mille et un. »
                  </p>
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>

      <FlagStrip />
    </div>
  );
}
