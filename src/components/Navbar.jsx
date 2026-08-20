import { useEffect, useState } from "react";
import { rajrasConfig } from "../config/rajrasConfig";

const links = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "Why Rajras", href: "#why" },
  { label: "How It Works", href: "#how" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar({ onOrder }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-cream/95 backdrop-blur shadow-[0_1px_0_0_#E7DABE]" : "bg-transparent"
      }`}
    >
      <div className="container-content flex items-center justify-between h-[76px]">
        <a href="#home" className="font-display text-2xl tracking-tight text-ink font-semibold">
          {rajrasConfig.businessName.toUpperCase()}
        </a>

        <nav className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[14.5px] font-medium text-ink-soft hover:text-rajras-red transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <button onClick={onOrder} className="btn-primary !py-2.5 !px-6">
            Order Now
          </button>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block w-6 h-[2px] bg-ink transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block w-6 h-[2px] bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-[2px] bg-ink transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-cream border-t border-cream-line px-6 py-5 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[15px] font-medium text-ink-soft"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              onOrder();
            }}
            className="btn-primary w-full mt-1"
          >
            Order Now
          </button>
        </div>
      )}
    </header>
  );
}
