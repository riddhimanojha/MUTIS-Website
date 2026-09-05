// ============================================================
// MUTIS SITE DATA  -  low-churn static content only. Most site content now
// lives in Supabase (see /admin) and is managed through the admin panel;
// this file covers copy that doesn't need a database row.
// ============================================================

// ---- MEIF SECTOR TEAMS ----
export const meifTeams = [
  {
    id: "financials",
    short: "Financials",
    name: "Financials",
    desc: "Analyses banks, insurers, and diversified financials across valuation, regulation, and capital returns.",
    focus: ["Capital strength", "Credit quality", "Valuation"],
    profile: "Great for students exploring banking, risk, and market structure.",
    articles: true,
  },
  {
    id: "consumer",
    short: "Consumer",
    name: "Consumer",
    desc: "Covers staples and discretionary names with emphasis on demand trends, pricing power, and category leadership.",
    focus: ["Demand cycle", "Brand durability", "Margins"],
    profile: "Ideal for members interested in business quality and long-term compounding.",
    articles: true,
  },
  {
    id: "tmt",
    short: "TMT",
    name: "TMT",
    desc: "Covers technology, media, and telecom names with focus on growth durability and platform economics.",
    focus: ["Moats", "Unit economics", "Growth quality"],
    profile: "Suited to members interested in innovation-led sectors.",
    articles: true,
  },
  {
    id: "industrials",
    short: "Industrials",
    name: "Industrials",
    desc: "Researches cyclicals and infrastructure-linked businesses across operating leverage and capex cycles.",
    focus: ["Order books", "Capex cycle", "Execution quality"],
    profile: "Useful for members covering real-economy businesses.",
    articles: true,
  },
  {
    id: "energy",
    short: "Energy",
    name: "Energy",
    desc: "Analyses traditional and transition energy names across commodity sensitivity and balance sheet resilience.",
    focus: ["Commodity exposure", "Transition risk", "FCF quality"],
    profile: "Ideal for members interested in commodities and transition themes.",
    articles: true,
  },
  {
    id: "macro",
    short: "Macro",
    name: "Macro",
    desc: "Builds top-down research on rates, inflation, FX, and growth to support portfolio positioning decisions.",
    focus: ["Central banks", "Macro regimes", "Cross-asset signals"],
    profile: "Useful for members developing broad market context and investment judgment.",
    articles: true,
  },
];
