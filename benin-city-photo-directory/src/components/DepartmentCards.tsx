"use client";

import Link from "next/link";
import { ArrowUpRight, ImagePlus, Landmark } from "lucide-react";
import { DEPARTMENTS } from "@/lib/departments";
import type { DepartmentStat } from "@/lib/queries";
import Reveal from "./Reveal";

export default function DepartmentCards({
  stats,
}: {
  stats: DepartmentStat[];
}) {
  const statMap = new Map(stats.map((s) => [s.department, s]));

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {DEPARTMENTS.map((dept, i) => {
        const stat = statMap.get(dept.slug);
        const count = stat?.count ?? 0;

        return (
          <Reveal key={dept.slug} delay={Math.min(i * 0.05, 0.4)}>
            <Link
              href={`/departements/${dept.slug}`}
              className="group relative block h-64 overflow-hidden rounded-3xl ring-1 ring-ink/10 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-ink/20"
            >
              {stat?.coverId ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={`/api/photos/${stat.coverId}/image`}
                  alt={`Cliché du département ${dept.name}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(150deg, ${dept.color} 0%, #14231a 130%)`,
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/10 transition-opacity duration-500 group-hover:from-ink/95" />

              <div className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-cream/15 text-cream backdrop-blur-sm transition-all duration-500 group-hover:bg-soleil group-hover:text-ink">
                <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" />
              </div>

              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-ink/45 px-3 py-1.5 text-[0.65rem] font-bold tracking-[0.18em] text-cream uppercase backdrop-blur-sm">
                {count > 0 ? (
                  <>
                    <span
                      className="size-1.5 rounded-full bg-soleil"
                    />
                    {count} cliché{count > 1 ? "s" : ""}
                  </>
                ) : (
                  <>
                    <ImagePlus className="size-3" />
                    À découvrir
                  </>
                )}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-3xl font-medium text-cream">
                  {dept.name}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-cream/70">
                  <Landmark className="size-3.5" />
                  Chef-lieu : {dept.capital} · {dept.region}
                </p>
                <p className="mt-2 max-w-[90%] font-display text-sm text-cream/60 italic">
                  {dept.tagline}
                </p>
              </div>

              <span
                className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{ backgroundColor: dept.color }}
              />
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
