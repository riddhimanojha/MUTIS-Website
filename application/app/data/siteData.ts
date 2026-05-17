// ============================================================
// MUTIS SITE DATA — Update these values as needed
// ============================================================

// ---- STATISTICS (replace with accurate numbers) ----
export const stats = [
  { number: "5,000+", label: "Members" },
  { number: "19", label: "Industry Partners" },
  { number: "10+", label: "Flagship Events" },
];

// ---- TEAM / COMMITTEE ----
// Replace `headshot` with the path to each member's photo, e.g. "/assets/team/aisha.jpg"
// Replace `linkedin` with the real profile URL
export const committee = [
  {
    name: "Aisha Khan",
    role: "President",
    initials: "AK",
    headshot: "", // e.g. "/assets/team/aisha-khan.jpg"
    linkedin: "#",
  },
  {
    name: "Rohan Patel",
    role: "Vice President",
    initials: "RP",
    headshot: "",
    linkedin: "#",
  },
  {
    name: "Emily Li",
    role: "Head of MEIF",
    initials: "EL",
    headshot: "",
    linkedin: "#",
  },
  {
    name: "Daniel Smith",
    role: "Head of Events",
    initials: "DS",
    headshot: "",
    linkedin: "#",
  },
  {
    name: "Hannah Jones",
    role: "Head of Careers",
    initials: "HJ",
    headshot: "",
    linkedin: "#",
  },
  {
    name: "Omar Ibrahim",
    role: "Head of Sponsorship",
    initials: "OI",
    headshot: "",
    linkedin: "#",
  },
];

// ---- ARTICLES ----
// Add new articles here; `pdfUrl` can be a real URL or "#" as placeholder
export const articles = [
  {
    title: "Macro Outlook: Inflation and Rate Pathways",
    team: "Macro Research",
    date: "March 2026",
    summary:
      "A student-led analysis of central bank policy scenarios and portfolio implications.",
    pdfUrl: "#",
  },
  {
    title: "Consumer Staples Resilience in Volatile Markets",
    team: "Consumer Goods",
    date: "February 2026",
    summary:
      "Coverage on demand defensiveness, margin durability, and valuation re-rating risk.",
    pdfUrl: "#",
  },
  {
    title: "European Banks: Capital Strength vs Growth Limits",
    team: "Financials",
    date: "January 2026",
    summary:
      "A framework for assessing capital return, credit trends, and earnings quality.",
    pdfUrl: "#",
  },
];

// ---- EVENTS ----
export const upcomingEvents = [
  {
    title: "Women in Finance Conference",
    date: "2026-10-12",
    venue: "Alliance Manchester Business School",
    register: "#",
  },
  {
    title: "UK Student Finance Summit (with Career26)",
    date: "2026-11-21",
    venue: "University of Manchester",
    register: "#",
  },
  {
    title: "M&A Challenge",
    date: "2027-01-24",
    venue: "Hybrid",
    register: "#",
  },
  {
    title: "Dare Trading Championship",
    date: "2027-02-13",
    venue: "AMBS Trading Lab",
    register: "#",
  },
  {
    title: "Business Ball",
    date: "2027-03-20",
    venue: "Manchester City Centre",
    register: "#",
  },
];

export const previousEvents = [
  { title: "Stock Pitch Competition", date: "2026-03-06" },
  { title: "Trading Simulation Bootcamp", date: "2026-02-14" },
  { title: "Holiday Social", date: "2025-12-11" },
];

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
export const sponsors = [
  {
    tier: "Current Corporate Sponsors & Partners",
    firms: [
      { name: "UBS", logo: "https://logo.clearbit.com/ubs.com", vacanciesUrl: "https://www.ubs.com/global/en/careers.html" },
      { name: "Rothschild & Co", logo: "https://logo.clearbit.com/rothschildandco.com", vacanciesUrl: "https://www.rothschildandco.com/en/careers/" },
      { name: "Goldman Sachs", logo: "https://logo.clearbit.com/goldmansachs.com", vacanciesUrl: "https://www.goldmansachs.com/careers/" },
      { name: "Wall Street Oasis", logo: "https://logo.clearbit.com/wallstreetoasis.com", vacanciesUrl: "https://www.wallstreetoasis.com/jobs" },
      { name: "TradingView", logo: "https://logo.clearbit.com/tradingview.com", vacanciesUrl: "https://www.tradingview.com/careers/" },
      { name: "Career26", logo: "https://logo.clearbit.com/career26.com", vacanciesUrl: "https://career26.com/" },
      { name: "Prima Ekuiti", logo: "https://logo.clearbit.com/primaekuiti.com", vacanciesUrl: "https://primaekuiti.com/" },
    ],
  },
  {
    tier: "Industry Event Partners",
    firms: [
      { name: "Bank of America", logo: "https://logo.clearbit.com/bankofamerica.com", vacanciesUrl: "https://careers.bankofamerica.com/en-us" },
      { name: "Barclays", logo: "https://logo.clearbit.com/barclays.com", vacanciesUrl: "https://search.jobs.barclays/" },
      { name: "BNY", logo: "https://logo.clearbit.com/bny.com", vacanciesUrl: "https://jobs.bny.com/" },
      { name: "Morgan Stanley", logo: "https://logo.clearbit.com/morganstanley.com", vacanciesUrl: "https://www.morganstanley.com/careers" },
      { name: "NatWest", logo: "https://logo.clearbit.com/natwest.com", vacanciesUrl: "https://jobs.natwestgroup.com/" },
      { name: "RBC", logo: "https://logo.clearbit.com/rbc.com", vacanciesUrl: "https://jobs.rbc.com/" },
      { name: "LGT Wealth Management", logo: "https://logo.clearbit.com/lgt.com", vacanciesUrl: "https://www.lgtwm.com/en/careers/" },
      { name: "Invesco", logo: "https://logo.clearbit.com/invesco.com", vacanciesUrl: "https://careers.invesco.com/" },
      { name: "Volcafe", logo: "https://logo.clearbit.com/volcafe.com", vacanciesUrl: "https://www.volcafe.com/careers/" },
      { name: "AmplifyME", logo: "https://logo.clearbit.com/amplifyme.com", vacanciesUrl: "https://www.amplifyme.com/careers" },
    ],
  },
  {
    tier: "Philanthropic & Educational Support",
    firms: [
      { name: "Shade Tree Fund", logo: "https://logo.clearbit.com/shadetreefund.org", vacanciesUrl: "https://shadetreefund.org/" },
      { name: "Trackr", logo: "https://logo.clearbit.com/trackr.com", vacanciesUrl: "https://www.trackr.com/" },
    ],
  },
];

// ---- MEIF SECTOR TEAMS ----
export const meifTeams = [
  {
    id: "macro",
    short: "Macro",
    name: "Macro Research",
    desc: "Builds top-down research on rates, inflation, FX, and growth to support portfolio positioning decisions.",
    focus: ["Central banks", "Macro regimes", "Cross-asset signals"],
    profile: "Useful for members developing broad market context and investment judgment.",
    articles: true,
  },
  {
    id: "consumer",
    short: "Consumer",
    name: "Consumer Goods",
    desc: "Covers global consumer staples and discretionary names with emphasis on demand trends and pricing power.",
    focus: ["Brand durability", "Margins", "Demand cycle"],
    profile: "Ideal for members interested in business quality and long-term compounding.",
    articles: false,
  },
  {
    id: "financials",
    short: "Financials",
    name: "Financials",
    desc: "Analyses banks, insurers, and diversified financials across valuation, regulation, and capital returns.",
    focus: ["Capital strength", "Credit quality", "Valuation"],
    profile: "Great for students exploring banking, risk, and market structure.",
    articles: false,
  },
];

// ---- MEIF PRESENTATIONS ----
// Replace `url` with real PDF links
export const meifPresentations = [
  { title: "Consumer Goods Primer", team: "Consumer Goods", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  { title: "European Financials Overview", team: "Financials", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  { title: "Macro Regime Playbook", team: "Macro Research", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  { title: "Sector Rotation Framework", team: "Cross-Team", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
];
