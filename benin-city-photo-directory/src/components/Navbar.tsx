"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Images, Map, Menu, Plus, X } from "lucide-react";
import Logo from "./Logo";

const LINKS = [
  { href: "/", label: "Accueil", icon: Camera },
  { href: "/galerie", label: "Galerie", icon: Images },
  { href: "/#departements", label: "Départements", icon: Map },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-ink/10 bg-cream/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-[90rem] items-center justify-between px-5 sm:px-8">
          <Logo />

          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map(({ href, label }) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href.split("#")[0]) &&
                    href.split("#")[0] !== "/";
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    active ? "text-ink" : "text-ink/60 hover:text-ink"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-ink/[0.06] ring-1 ring-ink/10"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contribuer"
              className="group hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-cream shadow-lg shadow-ink/20 transition-all hover:-translate-y-0.5 hover:bg-benin hover:shadow-benin/30 md:inline-flex"
            >
              <Plus className="size-4 transition-transform duration-300 group-hover:rotate-90" />
              Partager un cliché
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="grid size-11 place-items-center rounded-full border border-ink/15 bg-cream/70 backdrop-blur md:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-ink/95 backdrop-blur-md"
          >
            <div className="flex h-full flex-col px-6 py-5">
              <div className="flex items-center justify-between">
                <Logo light />
                <button
                  onClick={() => setOpen(false)}
                  className="grid size-11 place-items-center rounded-full border border-cream/20 text-cream"
                  aria-label="Fermer le menu"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="mt-14 flex flex-col gap-2">
                {LINKS.map(({ href, label, icon: Icon }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.07 }}
                  >
                    <Link
                      href={href}
                      className="group flex items-center gap-4 border-b border-cream/10 py-5"
                    >
                      <Icon className="size-5 text-soleil" />
                      <span className="font-display text-3xl font-medium text-cream transition-transform duration-300 group-hover:translate-x-2">
                        {label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <Link
                    href="/contribuer"
                    className="mt-8 flex items-center justify-center gap-2 rounded-full bg-soleil px-6 py-4 text-base font-bold text-ink"
                  >
                    <Plus className="size-5" />
                    Partager un cliché
                  </Link>
                </motion.div>
              </nav>

              <p className="mt-auto pb-4 text-center text-xs tracking-[0.3em] text-cream/40 uppercase">
                Cotonou · Porto-Novo · Parakou · Abomey
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
