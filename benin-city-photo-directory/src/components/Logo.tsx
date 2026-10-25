import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 outline-none"
      aria-label="Clichés du Bénin — Accueil"
    >
      <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg shadow-sm transition-transform duration-300 group-hover:rotate-6">
        <span className="absolute inset-0 grid grid-cols-[44%_56%] grid-rows-2">
          <span className="row-span-2 bg-benin" />
          <span className="bg-soleil" />
          <span className="bg-flamme" />
        </span>
        <span className="absolute inset-[3px] rounded-[6px] ring-1 ring-white/25" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-lg font-semibold tracking-tight ${
            light ? "text-cream" : "text-ink"
          }`}
        >
          Clichés du Bénin
        </span>
        <span
          className={`mt-1 text-[0.6rem] font-bold tracking-[0.28em] uppercase ${
            light ? "text-cream/60" : "text-ink/50"
          }`}
        >
          Ville par ville
        </span>
      </span>
    </Link>
  );
}
