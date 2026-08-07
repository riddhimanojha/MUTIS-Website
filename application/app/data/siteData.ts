// ============================================================
// MUTIS SITE DATA  -  all content is static; no backend or database.
// ============================================================

// ---- STATISTICS (Home page) ----
export const stats = [
  { number: "1,000+", label: "Members" },
  { number: "17", label: "Industry Partners" },
  { number: "5+", label: "Flagship Events" },
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
// Replace `vacanciesUrl` with the firm's careers page
const LOCAL_LOGOS = {
  UBS: "https://ktleyfwpcuyvvyxpvipp.supabase.co/storage/v1/object/public/sponsor_logos/ubslogo.png",
  BNY: "https://ktleyfwpcuyvvyxpvipp.supabase.co/storage/v1/object/public/sponsor_logos/bny.png",
  "Houlihan Lokey": "https://ktleyfwpcuyvvyxpvipp.supabase.co/storage/v1/object/public/sponsor_logos/houlihanlokey.jpeg",
  "Royal London": "https://ktleyfwpcuyvvyxpvipp.supabase.co/storage/v1/object/public/sponsor_logos/royallondongroup.svg",
  "Standard Chartered": "https://ktleyfwpcuyvvyxpvipp.supabase.co/storage/v1/object/public/sponsor_logos/standcharted.png",
  "White & Case": "https://ktleyfwpcuyvvyxpvipp.supabase.co/storage/v1/object/public/sponsor_logos/whiteandcase.png",
  Volcafe: "https://ktleyfwpcuyvvyxpvipp.supabase.co/storage/v1/object/public/sponsor_logos/volcafe.png",
  "Shade Tree": "https://ktleyfwpcuyvvyxpvipp.supabase.co/storage/v1/object/public/sponsor_logos/shade-tree.svg",
  // Supabase-hosted brand assets.
  "Bank of America": "https://ktleyfwpcuyvvyxpvipp.supabase.co/storage/v1/object/public/sponsor_logos/bofa.png",
  Barclays: "https://ktleyfwpcuyvvyxpvipp.supabase.co/storage/v1/object/public/sponsor_logos/barclays.svg",
  "Morgan Stanley": "https://ktleyfwpcuyvvyxpvipp.supabase.co/storage/v1/object/public/sponsor_logos/morganstanley.png",
  NatWest: "https://ktleyfwpcuyvvyxpvipp.supabase.co/storage/v1/object/public/sponsor_logos/natwest.png",
  RBC: "https://ktleyfwpcuyvvyxpvipp.supabase.co/storage/v1/object/public/sponsor_logos/rbccapitalbig.png",
  "LGT Wealth Management": "https://ktleyfwpcuyvvyxpvipp.supabase.co/storage/v1/object/public/sponsor_logos/lgtwealth.png",
  Invesco: "https://ktleyfwpcuyvvyxpvipp.supabase.co/storage/v1/object/public/sponsor_logos/invesco1.png",
  AmplifyME: "https://ktleyfwpcuyvvyxpvipp.supabase.co/storage/v1/object/public/sponsor_logos/amplifyme.jpeg",
  Trackr: "https://ktleyfwpcuyvvyxpvipp.supabase.co/storage/v1/object/public/sponsor_logos/trackrlogo.png",
};

export const sponsors = [
  {
    tier: "Gold",
    firms: [
      { name: "UBS", logo: LOCAL_LOGOS.UBS, vacanciesUrl: "https://www.ubs.com/global/en/careers.html" },
    ],
  },
  {
    tier: "Silver",
    firms: [
      { name: "Houlihan Lokey", logo: LOCAL_LOGOS["Houlihan Lokey"], vacanciesUrl: "https://careers.houlihanlokey.com/" },
      { name: "Royal London", logo: LOCAL_LOGOS["Royal London"], vacanciesUrl: "https://www.royallondon.com/careers/" },
      { name: "Standard Chartered", logo: LOCAL_LOGOS["Standard Chartered"], vacanciesUrl: "https://www.sc.com/en/careers/" },
      { name: "White & Case", logo: LOCAL_LOGOS["White & Case"], vacanciesUrl: "https://www.whitecase.com/careers" },
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
