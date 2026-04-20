import { createBrowserRouter, Outlet, ScrollRestoration } from "react-router";
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
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
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
