import { createBrowserRouter, Outlet, ScrollRestoration, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { MEIF } from "./pages/MEIF";
import { About } from "./pages/About";
import { Events } from "./pages/Events";
import { Sponsors } from "./pages/Sponsors";
import { Alumni } from "./pages/Alumni";
import { Join } from "./pages/Join";

function Root() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 24, scale: 0.995, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -18, scale: 0.995, filter: "blur(4px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "events", Component: Events },
      { path: "sponsors", Component: Sponsors },
      { path: "alumni", Component: Alumni },
      { path: "join", Component: Join },
      { path: "meif", Component: MEIF },
      { path: "*", Component: () => <div className="p-20 text-center text-2xl font-semibold">404 - Not Found</div> },
    ],
  },
]);
