import { createBrowserRouter, Outlet, ScrollRestoration, useLocation } from "react-router";
import { useTiltOnSelectors } from "./hooks/useTilt";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { BackToTop } from "./components/BackToTop";
import { PageMeta } from "./components/PageMeta";
import { OrganizationJsonLd } from "./components/OrganizationJsonLd";
import { Home } from "./pages/Home";
import { MEIF } from "./pages/MEIF";
import { About } from "./pages/About";
import { Team } from "./pages/Team";
import { Events } from "./pages/Events";
import { Sponsors } from "./pages/Sponsors";
import { Articles } from "./pages/Articles";
import { ArticleDetail } from "./pages/ArticleDetail";
import { Join } from "./pages/Join";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";
import { Alumni } from "./pages/Alumni";
import { PreviousPresidents } from "./pages/PreviousPresidents";
import { OurNetwork } from "./pages/OurNetwork";
import { PastSpeakers } from "./pages/PastSpeakers";
import { Attendance } from "./pages/Attendance";
import { Media } from "./pages/Media";
import { Gallery } from "./pages/Gallery";
import { Recordings } from "./pages/Recordings";

// NOTE: We intentionally avoid wrapping <Outlet/> in a transformed motion.div.
// The cinematic homepage relies on `position: sticky` inside `pin-wrap`, which
// is broken by any ancestor that creates a transform/filter containing block.
function Root() {
  const { pathname } = useLocation();
  // Re-wire selector-based tilt whenever the route changes so any newly
  // rendered static markup gets the same hover behaviour as page-shell.js.
  useTiltOnSelectors([pathname]);
  // The home page keeps the dark cinematic theme; all interior pages render on a
  // clean light surface (see mutis-light.css, scoped under .subpage-light).
  const isHome = pathname === "/";
  return (
    <>
      {/* Per-route SEO metadata (title, description, Open Graph, canonical).
          Pages with dynamic content (e.g. ArticleDetail) render their own
          nested <PageMeta override={...}> that takes precedence. */}
      <PageMeta pathname={pathname} />
      <OrganizationJsonLd />
      <div className="grain" aria-hidden="true" />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main id="main-content" className={isHome ? undefined : "subpage-light"}>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <ScrollRestoration />
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: "/admin",
    lazy: () => import("./admin/AdminRoot").then((m) => ({ Component: m.AdminRoot })),
    children: [
      { path: "login", lazy: () => import("./admin/pages/Login").then((m) => ({ Component: m.Login })) },
      { path: "set-password", lazy: () => import("./admin/pages/SetPassword").then((m) => ({ Component: m.SetPassword })) },
      { path: "__preview-dashboard", lazy: () => import("./admin/pages/Dashboard").then((m) => ({ Component: m.Dashboard })) },
      { path: "__preview-admins", lazy: () => import("./admin/pages/ManageAdmins").then((m) => ({ Component: m.ManageAdmins })) },
      { path: "__preview-sponsors", lazy: () => import("./admin/pages/Sponsors").then((m) => ({ Component: m.Sponsors })) },
      { path: "__preview-committee", lazy: () => import("./admin/pages/Committee").then((m) => ({ Component: m.Committee })) },
      { path: "__preview-events", lazy: () => import("./admin/pages/Events").then((m) => ({ Component: m.Events })) },
      { path: "__preview-alumni", lazy: () => import("./admin/pages/Alumni").then((m) => ({ Component: m.Alumni })) },
      { path: "__preview-presidents", lazy: () => import("./admin/pages/PreviousPresidents").then((m) => ({ Component: m.PreviousPresidents })) },
      { path: "__preview-articles", lazy: () => import("./admin/pages/Articles").then((m) => ({ Component: m.Articles })) },
      { path: "__preview-podcast", lazy: () => import("./admin/pages/PodcastSettings").then((m) => ({ Component: m.PodcastSettingsPage })) },
      { path: "__preview-submissions", lazy: () => import("./admin/pages/Submissions").then((m) => ({ Component: m.Submissions })) },
      { path: "__preview-audit-log", lazy: () => import("./admin/pages/AuditLog").then((m) => ({ Component: m.AuditLog })) },
      { path: "__preview-gallery", lazy: () => import("./admin/pages/Gallery").then((m) => ({ Component: m.Gallery })) },
      { path: "__preview-recordings", lazy: () => import("./admin/pages/Recordings").then((m) => ({ Component: m.Recordings })) },
      { path: "__preview-past-speakers", lazy: () => import("./admin/pages/PastSpeakers").then((m) => ({ Component: m.PastSpeakers })) },
      { path: "__preview-fund-managers", lazy: () => import("./admin/pages/FundManagers").then((m) => ({ Component: m.FundManagers })) },
      { path: "__preview-site-settings", lazy: () => import("./admin/pages/SiteSettings").then((m) => ({ Component: m.SiteSettings })) },
      { path: "__preview-home-programs", lazy: () => import("./admin/pages/HomePrograms").then((m) => ({ Component: m.HomePrograms })) },
      { path: "__preview-sponsorship-packages", lazy: () => import("./admin/pages/SponsorshipPackages").then((m) => ({ Component: m.SponsorshipPackages })) },
      { path: "__preview-integrations", lazy: () => import("./admin/pages/Integrations").then((m) => ({ Component: m.Integrations })) },
      { path: "__preview-documents", lazy: () => import("./admin/pages/Documents").then((m) => ({ Component: m.Documents })) },
      {
        lazy: () => import("./admin/ProtectedRoute").then((m) => ({ Component: m.ProtectedRoute })),
        children: [
          {
            lazy: () => import("./admin/AdminLayout").then((m) => ({ Component: m.AdminLayout })),
            children: [
              {
                index: true,
                lazy: () => import("./admin/pages/Dashboard").then((m) => ({ Component: m.Dashboard })),
              },
              {
                path: "admins",
                lazy: () => import("./admin/pages/ManageAdmins").then((m) => ({ Component: m.ManageAdmins })),
              },
              {
                path: "sponsors",
                lazy: () => import("./admin/pages/Sponsors").then((m) => ({ Component: m.Sponsors })),
              },
              {
                path: "committee",
                lazy: () => import("./admin/pages/Committee").then((m) => ({ Component: m.Committee })),
              },
              {
                path: "events",
                lazy: () => import("./admin/pages/Events").then((m) => ({ Component: m.Events })),
              },
              {
                path: "alumni",
                lazy: () => import("./admin/pages/Alumni").then((m) => ({ Component: m.Alumni })),
              },
              {
                path: "presidents",
                lazy: () => import("./admin/pages/PreviousPresidents").then((m) => ({ Component: m.PreviousPresidents })),
              },
              {
                path: "articles",
                lazy: () => import("./admin/pages/Articles").then((m) => ({ Component: m.Articles })),
              },
              {
                path: "gallery",
                lazy: () => import("./admin/pages/Gallery").then((m) => ({ Component: m.Gallery })),
              },
              {
                path: "recordings",
                lazy: () => import("./admin/pages/Recordings").then((m) => ({ Component: m.Recordings })),
              },
              {
                path: "past-speakers",
                lazy: () => import("./admin/pages/PastSpeakers").then((m) => ({ Component: m.PastSpeakers })),
              },
              {
                path: "fund-managers",
                lazy: () => import("./admin/pages/FundManagers").then((m) => ({ Component: m.FundManagers })),
              },
              {
                path: "home-programs",
                lazy: () => import("./admin/pages/HomePrograms").then((m) => ({ Component: m.HomePrograms })),
              },
              {
                path: "sponsorship-packages",
                lazy: () => import("./admin/pages/SponsorshipPackages").then((m) => ({ Component: m.SponsorshipPackages })),
              },
              {
                path: "documents",
                lazy: () => import("./admin/pages/Documents").then((m) => ({ Component: m.Documents })),
              },
              {
                path: "podcast",
                lazy: () => import("./admin/pages/PodcastSettings").then((m) => ({ Component: m.PodcastSettingsPage })),
              },
              {
                path: "submissions",
                lazy: () => import("./admin/pages/Submissions").then((m) => ({ Component: m.Submissions })),
              },
              {
                path: "site-settings",
                lazy: () => import("./admin/pages/SiteSettings").then((m) => ({ Component: m.SiteSettings })),
              },
              {
                path: "integrations",
                lazy: () => import("./admin/pages/Integrations").then((m) => ({ Component: m.Integrations })),
              },
              {
                path: "audit-log",
                lazy: () => import("./admin/pages/AuditLog").then((m) => ({ Component: m.AuditLog })),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "team", Component: Team },
      { path: "events", Component: Events },
      { path: "sponsors", Component: Sponsors },
      { path: "articles", Component: Articles },
      { path: "articles/:id", Component: ArticleDetail },
      { path: "alumni", Component: Alumni },
      { path: "previous-presidents", Component: PreviousPresidents },
      { path: "network", Component: OurNetwork },
      { path: "past-speakers", Component: PastSpeakers },
      { path: "attendance", Component: Attendance },
      { path: "media", Component: Media },
      { path: "gallery", Component: Gallery },
      { path: "recordings", Component: Recordings },
      { path: "join", Component: Join },
      { path: "contact", Component: Contact },
      { path: "meif", Component: MEIF },
      { path: "*", Component: NotFound },
    ],
  },
]);
