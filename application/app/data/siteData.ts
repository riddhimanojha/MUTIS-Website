// ============================================================
// MUTIS SITE DATA  -  all content is static; no backend or database.
// ============================================================

// ---- STATISTICS (Home page) ----
export const stats = [
  { number: "4,000+", label: "Members" },
  { number: "17", label: "Industry Partners" },
  { number: "10+", label: "Flagship Events" },
];

// ---- INDUSTRY EVENTS (recurring partner sessions, static) ----
export const industryEvents = [
  {
    title: "Fireside Chats: Rothschild & Co",
    date: "Termly",
    location: "University of Manchester",
    description:
      "Exclusive Q&A and career-focused discussions with professionals across advisory and banking.",
  },
  {
    title: "Recruitment & Insight Sessions: UBS",
    date: "Termly",
    location: "Alliance Manchester Business School",
    description:
      "Sessions linked to spring insight programmes, internships, and early-career pathways.",
  },
  {
    title: "Simulation Events: AmplifyME x Morgan Stanley",
    date: "Termly",
    location: "Hybrid",
    description:
      "Trading and market-making simulations designed to build practical market decision-making skills.",
  },
];

// ---- SPONSORS ----
// Replace `logo` with a real URL or a path to a local file
// Replace `vacanciesUrl` with the firm's careers page
const LOCAL_LOGOS = {
  UBS: new URL("../../assets/logos/UBS.jpeg", import.meta.url).href,
  BNY: new URL("../../assets/logos/Bny.jpeg", import.meta.url).href,
  "Houlihan Lokey": new URL("../../assets/logos/Houlihan Lokey.jpeg", import.meta.url).href,
  "Royal London": new URL("../../assets/logos/RoyalLondon.jpeg", import.meta.url).href,
  "Standard Chartered": new URL("../../assets/logos/StandardChartered.jpeg", import.meta.url).href,
  "White & Case": new URL("../../assets/logos/White&Chase.jpeg", import.meta.url).href,
  Volcafe: new URL("../../assets/logos/volcafe.svg", import.meta.url).href,
  "Shade Tree": new URL("../../assets/logos/shade-tree.svg", import.meta.url).href,
  // House-made wordmark logos (self-hosted, no external dependency).
  "Bank of America": new URL("../../assets/logos/bank-of-america.svg", import.meta.url).href,
  Barclays: new URL("../../assets/logos/barclays.svg", import.meta.url).href,
  "Morgan Stanley": new URL("../../assets/logos/morgan-stanley.svg", import.meta.url).href,
  NatWest: new URL("../../assets/logos/natwest.svg", import.meta.url).href,
  RBC: new URL("../../assets/logos/rbc.svg", import.meta.url).href,
  "LGT Wealth Management": new URL("../../assets/logos/lgt.svg", import.meta.url).href,
  Invesco: new URL("../../assets/logos/invesco.svg", import.meta.url).href,
  AmplifyME: new URL("../../assets/logos/amplifyme.svg", import.meta.url).href,
  Trackr: new URL("../../assets/logos/trackr.svg", import.meta.url).href,
};

export const sponsors = [
  {
    tier: "Current Corporate Sponsors & Partners",
    firms: [
      { name: "UBS", logo: LOCAL_LOGOS.UBS, vacanciesUrl: "https://www.ubs.com/global/en/careers.html" },
      { name: "Houlihan Lokey", logo: LOCAL_LOGOS["Houlihan Lokey"], vacanciesUrl: "https://careers.houlihanlokey.com/" },
      { name: "Royal London", logo: LOCAL_LOGOS["Royal London"], vacanciesUrl: "https://www.royallondon.com/careers/" },
      { name: "Standard Chartered", logo: LOCAL_LOGOS["Standard Chartered"], vacanciesUrl: "https://www.sc.com/en/careers/" },
      { name: "White & Case", logo: LOCAL_LOGOS["White & Case"], vacanciesUrl: "https://www.whitecase.com/careers" },
    ],
  },
  {
    tier: "Industry Event Partners",
    firms: [
      { name: "Bank of America", logo: LOCAL_LOGOS["Bank of America"], vacanciesUrl: "https://careers.bankofamerica.com/en-us" },
      { name: "Barclays", logo: LOCAL_LOGOS.Barclays, vacanciesUrl: "https://search.jobs.barclays/" },
      { name: "BNY", logo: LOCAL_LOGOS.BNY, vacanciesUrl: "https://jobs.bny.com/" },
      { name: "Morgan Stanley", logo: LOCAL_LOGOS["Morgan Stanley"], vacanciesUrl: "https://www.morganstanley.com/careers" },
      { name: "NatWest", logo: LOCAL_LOGOS.NatWest, vacanciesUrl: "https://jobs.natwestgroup.com/" },
      { name: "RBC", logo: LOCAL_LOGOS.RBC, vacanciesUrl: "https://jobs.rbc.com/" },
      { name: "LGT Wealth Management", logo: LOCAL_LOGOS["LGT Wealth Management"], vacanciesUrl: "https://www.lgtwm.com/en/careers/" },
      { name: "Invesco", logo: LOCAL_LOGOS.Invesco, vacanciesUrl: "https://careers.invesco.com/" },
      { name: "Volcafe", logo: LOCAL_LOGOS.Volcafe, vacanciesUrl: "https://www.volcafe.com/careers/" },
      { name: "AmplifyME", logo: LOCAL_LOGOS.AmplifyME, vacanciesUrl: "https://www.amplifyme.com/careers" },
    ],
  },
  {
    tier: "Philanthropic & Educational Support",
    firms: [
      { name: "Trackr", logo: LOCAL_LOGOS.Trackr, vacanciesUrl: "https://www.trackr.com/" },
    ],
  },
];

// ---- FLAGSHIP EVENT SUPPORTERS ----
// NOTE: Shade Tree is deliberately NOT listed under sponsorships. It is paired
// with our flagship events instead (see Events page "Flagship" section).
export const flagshipSupporters = [
  { name: "Shade Tree", logo: LOCAL_LOGOS["Shade Tree"], url: "https://shadetreefund.org/" },
];

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
