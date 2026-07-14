import { createBrowserRouter, Navigate, Outlet, ScrollRestoration, useLocation } from "react-router";
import { useTiltOnSelectors } from "./hooks/useTilt";
import { usePageMeta } from "./hooks/usePageMeta";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { BackToTop } from "./components/BackToTop";
import { Home } from "./pages/Home";
import { MEIF } from "./pages/MEIF";
import { About } from "./pages/About";
import { Team } from "./pages/Team";
import { Events } from "./pages/Events";
import { Sponsors } from "./pages/Sponsors";
import { Articles } from "./pages/Articles";
import { Join } from "./pages/Join";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";
import { PreviousPresidents } from "./pages/PreviousPresidents";
import { OurNetwork } from "./pages/OurNetwork";
import { PastSpeakers } from "./pages/PastSpeakers";
import { Attendance } from "./pages/Attendance";
import { Media } from "./pages/Media";
import { Gallery } from "./pages/Gallery";
import { Recordings } from "./pages/Recordings";
import { Podcast } from "./pages/Podcast";

// NOTE: We intentionally avoid wrapping <Outlet/> in a transformed motion.div.
// The cinematic homepage relies on `position: sticky` inside `pin-wrap`, which
// is broken by any ancestor that creates a transform/filter containing block.
function Root() {
  const { pathname } = useLocation();
  // Re-wire selector-based tilt whenever the route changes so any newly
  // rendered static markup gets the same hover behaviour as page-shell.js.
  useTiltOnSelectors([pathname]);
  // Apply per-route SEO metadata (title, description, Open Graph, canonical).
  usePageMeta(pathname);
  // The home page keeps the dark cinematic theme; all interior pages render on a
  // clean light surface (see mutis-light.css, scoped under .subpage-light).
  const isHome = pathname === "/";
  return (
    <>
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
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "team", Component: Team },
      { path: "events", Component: Events },
      { path: "sponsors", Component: Sponsors },
      { path: "articles", Component: Articles },
      // The Alumni page was folded into Our Network; Past Sponsors now lives
      // at the bottom of the Sponsors page. Old URLs redirect.
      { path: "alumni", element: <Navigate to="/network" replace /> },
      { path: "previous-presidents", Component: PreviousPresidents },
      { path: "network", Component: OurNetwork },
      { path: "past-sponsors", element: <Navigate to="/sponsors" replace /> },
      { path: "past-speakers", Component: PastSpeakers },
      { path: "attendance", Component: Attendance },
      { path: "media", Component: Media },
      { path: "gallery", Component: Gallery },
      { path: "recordings", Component: Recordings },
      { path: "podcast", Component: Podcast },
      { path: "join", Component: Join },
      { path: "contact", Component: Contact },
      { path: "meif", Component: MEIF },
      { path: "*", Component: NotFound },
    ],
  },
]);
