import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";

/**
 * Published member research. This is the CMS-ready data shape — add real
 * entries here (or wire to a data source) as they are published. Each item
 * may optionally link to a hosted PDF via `pdf`. Until real research is
 * published, the page shows an honest "coming soon" state rather than
 * fabricated authors or articles.
 */
type Article = {
  id: string;
  tag: string;
  title: string;
  author: string;
  when: string;
  image: string;
  pdf: string | null;
};

const ARTICLES: Article[] = [];

export function Articles() {
  useReveal([ARTICLES.length]);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb"><Link to="/">MUTIS</Link><span>/</span><span>Articles</span></div>
            <div className="page-eyebrow r-up"><span className="bar" />Articles</div>
            <h1 className="page-title r-up">Member<br /><span className="accent">research</span></h1>
          </div>
          <p className="page-sub r-up">Original notes, deep-dives, and market commentary from MUTIS analysts and MEIF coverage teams.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Section 01  -  Latest</div>
          <h2 className="r-up">Member research & commentary</h2>

          {ARTICLES.length === 0 ? (
            <p className="lede r-up">
              Our analysts and MEIF coverage teams are preparing the first published notes of the year.
              Research will appear here soon  -  follow us on{" "}
              <a href="https://instagram.com/mutisfinancesoc" target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>Instagram</a>{" "}
              or <Link to="/contact" style={{ color: "var(--accent)" }}>get in touch</Link> to be notified.
            </p>
          ) : (
            <div className="article-grid-2">
              {ARTICLES.map((r) => {
                const inner = (
                  <>
                    <img src={r.image} alt={r.title} className="article-thumb" loading="lazy" decoding="async" />
                    <div className="tag">{r.tag}</div>
                    <div className="title">{r.title}<span className="author">{r.author}</span></div>
                    <div className="when">{r.when}</div>
                  </>
                );
                return r.pdf ? (
                  <a key={r.id} className="article r-up" href={r.pdf} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "inherit" }}>{inner}</a>
                ) : (
                  <div key={r.id} className="article r-up">{inner}</div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
