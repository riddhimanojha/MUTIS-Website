import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";

export function Join() {
  useReveal();
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb"><Link to="/">MUTIS</Link><span>/</span><span>Join</span></div>
            <div className="page-eyebrow r-up"><span className="bar" />Join MUTIS</div>
            <h1 className="page-title r-up">Become a<br /><span className="accent">member</span></h1>
          </div>
          <p className="page-sub r-up">Membership is open to every University of Manchester student  -  every faculty, every year group. Sign up via the Students' Union, then come to your first weekly meeting.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Section 01  -  How it works</div>
          <h2 className="r-up">Three steps to get involved</h2>
          <div className="numlist">
            <div className="numlist-item r-up">
              <div className="n">01</div>
              <div>
                <div className="t">Buy a membership</div>
                <div className="d">Standard membership runs the full academic year and includes access to all weekly meetings, workshops, and partner events.</div>
              </div>
              <div className="arrow">→</div>
            </div>
            <div className="numlist-item r-up">
              <div className="n">02</div>
              <div>
                <div className="t">Come to a weekly meeting</div>
                <div className="d">Tuesdays at Alliance MBS  -  no prep needed. We cover market events, technical concepts, and live deal discussions.</div>
              </div>
              <div className="arrow">→</div>
            </div>
            <div className="numlist-item r-up">
              <div className="n">03</div>
              <div>
                <div className="t">Apply to MEIF, IBC, or a sub-committee</div>
                <div className="d">Applications open early in Autumn term. You don't need experience  -  you need to want to do the work.</div>
              </div>
              <div className="arrow">→</div>
            </div>
          </div>

          <div className="r-up" style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link to="/contact" className="btn btn-primary" style={{ textDecoration: "none" }}>
              Get in touch <span className="arrow" />
            </Link>
            <a
              className="btn btn-ghost"
              href="https://manchesterstudentsunion.com"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}
            >
              Students' Union <span className="arrow" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
