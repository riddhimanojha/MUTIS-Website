import { Link } from "react-router";
import { ArrowRight, FileText } from "lucide-react";

export function Articles() {
  const articles = [
    {
      title: "Macro Outlook: Inflation and Rate Pathways",
      team: "Macro Research",
      summary: "A student-led analysis of central bank policy scenarios and portfolio implications.",
    },
    {
      title: "Consumer Staples Resilience in Volatile Markets",
      team: "Consumer Goods",
      summary: "Coverage on demand defensiveness, margin durability, and valuation re-rating risk.",
    },
    {
      title: "European Banks: Capital Strength vs Growth Limits",
      team: "Financials",
      summary: "A framework for assessing capital return, credit trends, and earnings quality.",
    },
  ];

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-8">
      <div className="max-w-[1400px] mx-auto">
        <h1
          className="mb-6"
          style={{
            fontSize: "clamp(2.6rem, 6vw, 4.8rem)",
            fontWeight: "700",
            color: "white",
            lineHeight: "1.08",
            fontFamily: "var(--font-nav)",
          }}
        >
          Articles & Research
        </h1>

        <p className="text-lg max-w-4xl mb-14" style={{ color: "#c8d8f2", lineHeight: "1.72" }}>
          Explore student-written market commentary, thematic deep dives, and sector notes produced across MUTIS research teams.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {articles.map((article) => (
            <article
              key={article.title}
              className="p-7 rounded-lg"
              style={{ background: "#111827", border: "1px solid #374151" }}
            >
              <div className="inline-flex items-center gap-2 mb-4 text-sm" style={{ color: "#9ab8dc" }}>
                <FileText className="w-4 h-4" />
                {article.team}
              </div>
              <h2 className="text-xl text-white font-semibold mb-3" style={{ fontFamily: "var(--font-nav)" }}>
                {article.title}
              </h2>
              <p className="text-sm mb-6" style={{ color: "#c8d8f2", lineHeight: "1.7" }}>
                {article.summary}
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-medium"
                style={{ background: "#1a3370", color: "white", border: "1px solid #374151" }}
              >
                Read article
                <ArrowRight className="w-4 h-4" />
              </a>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/meif"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-medium"
            style={{ background: "#0e2052", color: "white", border: "1px solid #2d5090" }}
          >
            Back to MEIF
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
