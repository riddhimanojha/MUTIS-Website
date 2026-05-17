
import { FileText, ExternalLink } from "lucide-react";
import { articles } from "../data/siteData";

// Team badge colour mapping
const teamColors: Record<string, string> = {
  "Macro Research": "#1a3a6a",
  "Consumer Goods": "#1a4a3a",
  "Financials": "#3a2a5a",
  "Cross-Team": "#3a3a1a",
};

export function Articles() {
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
          Student-written market commentary, thematic deep dives, and sector notes produced across MUTIS research teams.
        </p>

        {articles.length === 0 ? (
          <div
            className="rounded-lg p-12 text-center"
            style={{ background: "#111827", border: "1px solid #374151" }}
          >
            <FileText className="w-10 h-10 mx-auto mb-4" style={{ color: "#9ab8dc" }} />
            <p className="text-white font-semibold mb-2">No articles yet</p>
            <p className="text-sm" style={{ color: "#9ab8dc" }}>
              Articles will appear here as MEIF teams publish research. Add them to{" "}
              <code className="px-1 py-0.5 rounded" style={{ background: "#1a1f2e" }}>
                application/app/data/siteData.ts
              </code>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {articles.map((article) => (
              <article
                key={article.title}
                className="p-7 rounded-lg flex flex-col"
                style={{ background: "#111827", border: "1px solid #374151" }}
              >
                {/* Team badge */}
                <div
                  className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-medium w-fit"
                  style={{
                    background: teamColors[article.team] ?? "#1a3370",
                    color: "#c8d8f2",
                  }}
                >
                  <FileText className="w-3 h-3" />
                  {article.team}
                </div>

                <h2 className="text-xl text-white font-semibold mb-2 flex-1" style={{ fontFamily: "var(--font-nav)" }}>
                  {article.title}
                </h2>

                <p className="text-xs mb-3" style={{ color: "#7090b8" }}>
                  {article.date}
                </p>

                <p className="text-sm mb-6" style={{ color: "#c8d8f2", lineHeight: "1.7" }}>
                  {article.summary}
                </p>

                {article.pdfUrl && article.pdfUrl !== "#" ? (
                  <a
                    href={article.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-medium text-sm mt-auto"
                    style={{ background: "#1a3370", color: "white", border: "1px solid #374151" }}
                  >
                    Read article
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <span
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-medium text-sm mt-auto"
                    style={{ background: "#1a1f2e", color: "#7090b8", border: "1px solid #2d3748" }}
                  >
                    Coming soon
                  </span>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
