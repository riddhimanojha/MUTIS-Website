import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Instagram, Linkedin } from "lucide-react";

type NavItem = { to: string; label: string; children?: { to: string; label: string }[] };

const navLinks: NavItem[] = [
  {
    to: "/about",
    label: "About",
    children: [
      { to: "/previous-presidents", label: "Previous Presidents" },
      { to: "/network", label: "Our Network" },
      { to: "/alumni", label: "Alumni" },
    ],
  },
  { to: "/team", label: "Team" },
  {
    to: "/events",
    label: "Events",
    children: [{ to: "/past-speakers", label: "Past Speakers" }],
  },
  { to: "/meif", label: "MEIF" },
  { to: "/articles", label: "Articles" },
  {
    to: "/sponsors",
    label: "Sponsors",
    children: [{ to: "/past-sponsors", label: "Past Sponsors" }],
  },
  {
    to: "/media",
    label: "Media",
    children: [
      { to: "/gallery", label: "Gallery" },
      { to: "/recordings", label: "Recordings" },
      { to: "/podcast", label: "Podcast" },
    ],
  },
  { to: "/contact", label: "Contact" },
];

const SOCIALS = [
  {
    label: "MUTIS on Instagram",
    href: "https://instagram.com/mutisfinancesoc",
    Icon: Instagram,
  },
  {
    label: "MUTIS on LinkedIn",
    href: "https://www.linkedin.com/company/manchester-university-trading-&-investment-society/",
    Icon: Linkedin,
  },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 60);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const focusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        ) ?? []
      );
    focusable()[0]?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); setMenuOpen(false); return; }
      if (e.key === "Tab") {
        const items = focusable();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      (previouslyFocused ?? toggleRef.current)?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      <nav className={"pm-nav" + (scrolled ? " pm-nav--scrolled" : "")}>
        <Link to="/" className="pm-nav-logo" style={{ textDecoration: "none" }}>
          <img src="/mutislogo.jpg" alt="MUTIS home" className="pm-nav-logo-img" />
        </Link>

        {/* Desktop nav: flat top-level links only — no hover dropdowns. */}
        <div className="pm-nav-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => "pm-nav-link" + (isActive ? " pm-nav-link--active" : "")}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="pm-nav-right">
          <div className="pm-nav-socials">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" aria-label={label} className="pm-nav-social">
                <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
              </a>
            ))}
          </div>
          <Link to="/join" className="pm-nav-cta" style={{ textDecoration: "none" }}>
            Join MUTIS
          </Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className={"pm-nav-burger" + (menuOpen ? " pm-nav-burger--open" : "")}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </nav>

      {/* Overlay + mobile panel live OUTSIDE <nav> so the scrolled nav's
          backdrop-filter doesn't trap their position: fixed. */}
      <div
        className={"pm-nav-overlay" + (menuOpen ? " pm-nav-overlay--show" : "")}
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
      />

      <div
        id="mobile-nav"
        ref={panelRef}
        className={"pm-mobile-nav" + (menuOpen ? " pm-mobile-nav--show" : "")}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!menuOpen}
      >
        <div className="pm-mobile-nav-links">
          {navLinks.map((link) => (
            <div key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  "pm-mobile-link" + (isActive ? " pm-mobile-link--active" : "")
                }
              >
                {link.label}
              </NavLink>
              {link.children?.map((c) => (
                <NavLink
                  key={c.to}
                  to={c.to}
                  className={({ isActive }) =>
                    "pm-mobile-link pm-mobile-link--sub" + (isActive ? " pm-mobile-link--active" : "")
                  }
                >
                  {c.label}
                </NavLink>
              ))}
            </div>
          ))}
          <NavLink
            to="/join"
            className={({ isActive }) =>
              "pm-mobile-link pm-mobile-link--join" + (isActive ? " pm-mobile-link--active" : "")
            }
          >
            Join MUTIS
          </NavLink>
          <div className="pm-mobile-socials">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" aria-label={label} className="pm-nav-social">
                <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
