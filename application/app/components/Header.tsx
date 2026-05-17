import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "MEIF", href: "/meif" },
  { label: "Articles", href: "/articles" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "#08122e", borderBottom: "1px solid #1e3878" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span
            className="font-semibold text-lg text-white tracking-tight"
            style={{ fontFamily: "var(--font-nav)" }}
          >
            MUTIS
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-5" style={{ fontFamily: "var(--font-body)" }}>
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className="transition-colors duration-200"
                style={{
                  fontSize: "0.95rem",
                  color: active ? "white" : "rgba(255,255,255,0.7)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            to="/join"
            className="px-4 py-2 rounded-md font-medium transition-colors duration-200"
            style={{
              color: "white",
              background: "#1a3370",
              border: "1px solid #1e3878",
              fontFamily: "var(--font-body)",
              fontSize: "0.92rem",
            }}
          >
            Join
          </Link>
        </nav>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-5 pt-2 flex flex-col gap-3"
          style={{ background: "#08122e", borderTop: "1px solid #1e3878" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-white/80 hover:text-white py-1 text-base"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/join"
            onClick={() => setMobileOpen(false)}
            className="px-4 py-2 rounded-md font-medium mt-2"
            style={{
              color: "white",
              background: "#1a3370",
              border: "1px solid #1e3878",
              fontFamily: "var(--font-body)",
              fontSize: "0.92rem",
            }}
          >
            Join
          </Link>
        </div>
      )}
    </header>
  );
}
