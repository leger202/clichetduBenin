"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Camera, Images, MapPin } from "lucide-react";

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{display}</>;
}

const fadeUp = {
  initial: { opacity: 0, y: 34 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero({
  totalPhotos,
  totalDepartments,
  totalLikes,
}: {
  totalPhotos: number;
  totalDepartments: number;
  totalLikes: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink"
    >
      {/* ——— Image de fond : éléphants de la Pendjari ——— */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/seed/pendjari.jpg"
          alt="Éléphants dans la savane du parc national de la Pendjari, Atacora, Bénin"
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />

      {/* ——— Texte vertical décoratif ——— */}
      <p className="vertical-rl absolute top-1/2 right-6 hidden -translate-y-1/2 text-[0.6rem] font-bold tracking-[0.5em] text-cream/50 uppercase lg:block">
        Latitude 9.3° N · Longitude 2.3° E — République du Bénin
      </p>

      {/* ——— Contenu ——— */}
      <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-end px-5 pt-36 pb-10 sm:px-8">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 flex flex-wrap items-center gap-3"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/25 bg-cream/10 px-4 py-2 text-[0.65rem] font-bold tracking-[0.28em] text-cream uppercase backdrop-blur-md">
            <MapPin className="size-3.5 text-soleil" />
            12 départements · Une seule galerie
          </span>
          <span className="hidden rounded-full border border-cream/25 bg-cream/10 px-4 py-2 text-[0.65rem] font-bold tracking-[0.28em] text-cream uppercase backdrop-blur-md sm:inline-block">
            Ouvert à tous les photographes
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl font-display text-[13vw] leading-[0.98] font-medium tracking-tight text-balance text-cream sm:text-[9vw] lg:text-[7.2rem]"
        >
          Les plus beaux
          <em className="text-soleil not-italic">
            <span className="italic"> clichés </span>
          </em>
          du Bénin,
          <span className="block text-cream/85">
            ville <em className="text-cream">par</em> ville.
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg"
        >
          De la Pendjari aux plages de Grand-Popo, partagez vos photos et
          explorez le pays comme jamais — département par département,
          quartier par quartier.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/galerie"
            className="group inline-flex items-center gap-2.5 rounded-full bg-soleil px-7 py-4 text-sm font-bold text-ink shadow-xl shadow-soleil/25 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-soleil/35"
          >
            <Images className="size-4 transition-transform duration-300 group-hover:scale-110" />
            Explorer la galerie
          </Link>
          <Link
            href="/contribuer"
            className="group inline-flex items-center gap-2.5 rounded-full border-2 border-cream/35 px-7 py-[0.85rem] text-sm font-bold text-cream backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-soleil hover:text-soleil"
          >
            <Camera className="size-4 transition-transform duration-300 group-hover:rotate-12" />
            Partager un cliché
          </Link>
        </motion.div>

        {/* ——— Statistiques ——— */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 border-t border-cream/15 pt-6"
        >
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            {[
              { value: totalPhotos, label: "Clichés partagés", suffix: "" },
              { value: totalDepartments, label: "Départements couverts", suffix: "/12" },
              { value: totalLikes, label: "Coups de cœur", suffix: "" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-4xl font-medium text-cream sm:text-5xl">
                  <CountUp value={s.value} />
                  <span className="text-soleil">{s.suffix}</span>
                </p>
                <p className="mt-1 text-[0.65rem] font-bold tracking-[0.28em] text-cream/50 uppercase">
                  {s.label}
                </p>
              </div>
            ))}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="ml-auto hidden items-end gap-3 self-end text-cream/60 sm:flex"
            >
              <span className="text-[0.6rem] font-bold tracking-[0.3em] uppercase">
                Défiler pour explorer
              </span>
              <span className="grid size-10 place-items-center rounded-full border border-cream/25">
                <ArrowDown className="size-4" />
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ——— Badge circulaire tournant ——— */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.7 }}
        className="absolute top-24 right-8 z-10 hidden lg:top-32 lg:right-16 lg:block"
      >
        <div className="relative grid place-items-center">
          <svg
            viewBox="0 0 100 100"
            className="size-32 animate-spin-slower text-cream/80"
          >
            <defs>
              <path
                id="hero-circle"
                d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
              />
            </defs>
            <text className="fill-current text-[8px] font-bold tracking-[0.22em] uppercase">
              <textPath href="#hero-circle">
                Clichés du Bénin · Fièrement 229 ·
              </textPath>
            </text>
          </svg>
          <span className="absolute grid size-12 place-items-center rounded-full bg-soleil text-ink shadow-lg shadow-soleil/30">
            <Camera className="size-5" />
          </span>
        </div>
      </motion.div>
    </section>
  );
}
