import { useState, useEffect } from "react";
import { Link } from "react-router";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
      style={{
        background: scrolled
          ? "rgba(255, 255, 255, 0.06)"
          : "rgba(255, 255, 255, 0.02)",
        backdropFilter: scrolled ? "blur(40px) saturate(180%)" : "blur(20px) saturate(150%)",
        WebkitBackdropFilter: scrolled ? "blur(40px) saturate(180%)" : "blur(20px) saturate(150%)",
        borderBottom: scrolled
          ? "1px solid rgba(255, 255, 255, 0.15)"
          : "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: scrolled
          ? "0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.12)"
          : "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
            }}
          >
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <span
            className="font-bold text-xl text-white tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            MUTIS
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-1"
          style={{ fontFamily: "var(--font-nav)" }}
        >
          <Link
            to="/"
            className="px-5 py-2.5 text-white/80 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5"
            style={{ fontSize: "1.05rem" }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="px-5 py-2.5 text-white/80 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5"
            style={{ fontSize: "1.05rem" }}
          >
            About
          </Link>
          <Link
            to="/events"
            className="px-5 py-2.5 text-white/80 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5"
            style={{ fontSize: "1.05rem" }}
          >
            Events
          </Link>
          <Link
            to="/sponsors"
            className="px-5 py-2.5 text-white/80 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5"
            style={{ fontSize: "1.05rem" }}
          >
            Sponsors
          </Link>
          <Link
            to="/alumni"
            className="px-5 py-2.5 text-white/80 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5"
            style={{ fontSize: "1.05rem" }}
          >
            Alumni
          </Link>
          <a
            href="mailto:contact@mutis.co.uk"
            className="px-5 py-2.5 text-white/80 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5"
            style={{ fontSize: "1.05rem" }}
          >
            Contact
          </a>
          <Link
            to="/join"
            className="ml-4 px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            style={{
              color: "white",
              background: "linear-gradient(135deg, rgba(15, 15, 25, 0.9) 0%, rgba(25, 25, 45, 0.85) 100%)",
              border: "1px solid rgba(139, 69, 172, 0.4)",
              boxShadow: "0 8px 30px rgba(139, 69, 172, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
              fontFamily: "var(--font-display)",
            }}
          >
            Join MUTIS
          </Link>
        </nav>
      </div>
    </header>
  );
}
