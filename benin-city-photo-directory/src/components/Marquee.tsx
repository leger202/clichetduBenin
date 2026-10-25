import { Asterisk } from "lucide-react";

export default function Marquee({
  items,
  dark = false,
  fast = false,
  className = "",
}: {
  items: string[];
  dark?: boolean;
  fast?: boolean;
  className?: string;
}) {
  const row = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center"
    >
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center">
          <span
            className={`font-display text-2xl font-medium tracking-tight whitespace-nowrap italic sm:text-3xl ${
              dark ? "text-cream" : "text-ink"
            }`}
          >
            {item}
          </span>
          <Asterisk
            className={`mx-6 size-6 shrink-0 ${
              dark ? "text-soleil" : "text-benin"
            }`}
          />
        </span>
      ))}
    </div>
  );

  return (
    <div className={`edge-fade overflow-hidden ${className}`}>
      <div
        className={`flex w-max ${fast ? "animate-marquee-fast" : "animate-marquee"}`}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
