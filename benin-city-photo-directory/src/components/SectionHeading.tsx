import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function SectionHeading({
  kicker,
  title,
  description,
  align = "center",
  dark = false,
}: {
  kicker: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <Reveal
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      <p
        className={`flex items-center gap-2 text-xs font-bold tracking-[0.32em] uppercase ${
          align === "center" ? "justify-center" : ""
        } ${dark ? "text-soleil" : "text-benin"}`}
      >
        <span
          className={`inline-block size-2 rounded-full ${
            dark ? "bg-flamme" : "bg-flamme"
          }`}
        />
        {kicker}
      </p>
      <h2
        className={`mt-4 font-display text-4xl leading-[1.05] font-medium tracking-tight text-balance sm:text-5xl ${
          dark ? "text-cream" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 text-base leading-relaxed ${
            dark ? "text-cream/65" : "text-ink/60"
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
