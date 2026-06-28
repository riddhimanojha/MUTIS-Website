import { Link } from "react-router";

export function NotFound() {
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        <div>
          <div className="crumb"><Link to="/">MUTIS</Link><span>/</span><span>404</span></div>
          <div className="page-eyebrow"><span className="bar" />Error 404</div>
          <h1 className="page-title">Page not<br /><span className="accent">found</span></h1>
        </div>
        <p className="page-sub">
          The page you're looking for has moved or never existed.{" "}
          <Link to="/" style={{ color: "var(--accent)" }}>Head back home →</Link>
        </p>
      </div>
    </section>
  );
}
