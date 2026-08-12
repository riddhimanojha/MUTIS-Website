import { useEffect, useState } from "react";
import { Link } from "react-router";
import { meifTeams } from "@/app/data/siteData";
import { useReveal } from "@/app/hooks/useReveal";
import type { Tables } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";

type FundManagerRow = Tables<"fund_managers">;

function fundManagerPhotoUrl(id: string) {
  return supabase.storage.from("fund_manager_photos").getPublicUrl(`${id}.jpeg`).data.publicUrl;
}

function FundManagerPortrait({ name, id }: { name: string; id: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span aria-hidden="true">{name.charAt(0)}</span>;
  }

  return (
    <img
      src={fundManagerPhotoUrl(id)}
      alt={name}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export function MEIF() {
  const [fundManagers, setFundManagers] = useState<FundManagerRow[]>([]);
  const [managersLoading, setManagersLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("fund_managers")
      .select("*")
      .eq("is_published", true)
      .order("start_year", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error("Failed to load fund managers", error);
        setFundManagers(data ?? []);
        setManagersLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useReveal([meifTeams.length, fundManagers.length, managersLoading]);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb"><Link to="/">MUTIS</Link><span>/</span><span>MEIF</span></div>
            <div className="page-eyebrow r-up"><span className="bar" />Ethical Investment Fund</div>
            <h1 className="page-title r-up">A real fund<br />Student <span className="accent">run</span></h1>
          </div>
          <p className="page-sub r-up">The MUTIS Ethical Investment Fund is a student-managed global equity fund with five equity coverage teams and one macro team.</p>
        </div>
      </section>

      <section className="page-section meif-fund-section">
        <div className="inner">
          <div className="split">
            <div className="split-text"><h2 className="r-up">The Fund</h2></div>
            <div className="split-text r-up">
              <p><strong>The MUTIS Ethical Investment Fund is a student-managed global equity fund.</strong> Members pitch, debate, and vote on long-only positions across Financials, Consumer, TMT, Industrials, Energy, and Macro.</p>
              <p>MEIF analysts produce written research  -  initiations, updates, and quarterly outlooks  -  and present at pitch nights judged by the committee and industry mentors.</p>
              <p>Every position must pass an ethical screen. Every member writes at least one note per term.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section" style={{ background: "var(--base)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Section 02  -  Sectors</div>
          <h2 className="r-up">Six compact coverage desks</h2>
          <div className="team-compact-grid">
            {meifTeams.map((s) => (
              <article className="team-compact-card r-up" key={s.id}>
                <div>
                  <div className="sname">{s.name}</div>
                  <div className="sdesc">{s.desc} {s.profile}</div>
                </div>
                <div className="focus">
                  <div className="l">Focus areas</div>
                  <ul>{s.focus.map((f) => <li key={f}>{f}</li>)}</ul>
                </div>
                <div className="team-pdfs">
                  <span className="team-pdf-soon">Coverage notes: coming soon</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Investments & performance — PENDING live data source (see Sandra).
          A ~£20/month market-data tool/plugin can feed holdings + returns here;
          options to be proposed before integrating. Until then this is a clearly
          marked placeholder rather than fabricated figures. */}
      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Section 03  -  Portfolio</div>
          <h2 className="r-up">Investments &amp; performance</h2>
          <p className="lede r-up">
            {/* PENDING: wire up holdings + performance from the chosen data source. */}
            A live view of the fund&apos;s holdings and performance is coming soon. We&apos;re
            evaluating a data source so members can track positions and returns here.
          </p>
          <div className="perf-placeholder r-up" aria-hidden="true">
            <div className="perf-card"><span className="l">Holdings</span><span className="v">—</span></div>
            <div className="perf-card"><span className="l">YTD Return</span><span className="v">—</span></div>
            <div className="perf-card"><span className="l">NAV</span><span className="v">—</span></div>
            <div className="perf-card"><span className="l">Benchmark</span><span className="v">—</span></div>
          </div>
        </div>
      </section>

      {/* Previous Fund Managers */}
      <section className="page-section" style={{ background: "var(--base)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Section 04  -  Leadership</div>
          <h2 className="r-up">Previous Fund Managers</h2>
          <p className="lede r-up">The students who have led the MUTIS Ethical Investment Fund.</p>
          {managersLoading ? (
            <p className="lede r-up" role="status">Loading…</p>
          ) : fundManagers.length === 0 ? (
            <p className="lede r-up">
              We&apos;re compiling a record of past fund managers. Check back soon.
            </p>
          ) : (
          <div className="network-grid r-up">
            {fundManagers.map((m) => (
              <article className="network-card" key={m.id}>
                <div className="network-portrait">
                  <FundManagerPortrait name={m.name} id={m.id} />
                </div>
                <div className="network-name">{m.name}</div>
                <div className="network-role">{m.year_label}</div>
                {m.linkedin_url && (
                  <a className="network-linkedin" href={m.linkedin_url} target="_blank" rel="noreferrer">LinkedIn →</a>
                )}
              </article>
            ))}
          </div>
          )}
        </div>
      </section>
    </>
  );
}
