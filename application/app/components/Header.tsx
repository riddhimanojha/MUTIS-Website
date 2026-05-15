import { Link } from "react-router";

export function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "#08122e",
        borderBottom: "1px solid #1e3878",
      }}
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

        <nav
          className="hidden md:flex items-center gap-5"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <Link
            to="/"
            className="text-white/80 hover:text-white transition-colors duration-200"
            style={{ fontSize: "0.95rem" }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-white/80 hover:text-white transition-colors duration-200"
            style={{ fontSize: "0.95rem" }}
          >
            About
          </Link>
          <Link
            to="/events"
            className="text-white/80 hover:text-white transition-colors duration-200"
            style={{ fontSize: "0.95rem" }}
          >
            Events
          </Link>
          <Link
            to="/meif"
            className="text-white/80 hover:text-white transition-colors duration-200"
            style={{ fontSize: "0.95rem" }}
          >
            MEIF
          </Link>
          <Link
            to="/sponsors"
            className="text-white/80 hover:text-white transition-colors duration-200"
            style={{ fontSize: "0.95rem" }}
          >
            Sponsors
          </Link>
          <Link
            to="/team"
            className="text-white/80 hover:text-white transition-colors duration-200"
            style={{ fontSize: "0.95rem" }}
          >
            Team
          </Link>
          <Link
            to="/articles"
            className="text-white/80 hover:text-white transition-colors duration-200"
            style={{ fontSize: "0.95rem" }}
          >
            Articles
          </Link>
          <Link
            to="/contact"
            className="text-white/80 hover:text-white transition-colors duration-200"
            style={{ fontSize: "0.95rem" }}
          >
            Contact
          </Link>
          <Link
            to="/join"
            className="px-4 py-2 rounded-md font-medium transition-all duration-200"
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
      </div>
    </header>
  );
}
