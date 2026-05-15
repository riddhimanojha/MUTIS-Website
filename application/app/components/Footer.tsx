import { Link } from "react-router";
import { Linkedin, Instagram, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="relative py-20 px-8 lg:px-16"
      style={{
        borderTop: "1px solid #1a3268",
      }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
                style={{
                  background: "#1a3370",
                  border: "1px solid #1e3878",
                }}
              >
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                MUTIS
              </span>
            </Link>
            <p
              className="mb-8 leading-relaxed text-sm"
              style={{ color: "#9ab8dc" }}
            >
              Manchester University Trading & Investment Society
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: "https://instagram.com/mutisfinancesoc" },
                { icon: Linkedin, href: "https://www.linkedin.com/company/mutis-finance-society" },
                { icon: MessageCircle, href: "#" },
                { icon: Mail, href: "mailto:mutis@manchesterstudentsunion.com" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    background: "#132a5e",
                    border: "1px solid #1c3570",
                  }}
                >
                  <social.icon className="w-4 h-4 text-white/60" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { label: "About", href: "/about" },
                { label: "Events", href: "/events" },
                { label: "Team", href: "/team" },
                { label: "Articles", href: "/articles" },
                { label: "MEIF", href: "/meif" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "#9ab8dc" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Sponsors", href: "/sponsors" },
                { label: "Join MUTIS", href: "/join" },
                { label: "Latest Articles", href: "/articles" },
                { label: "Meet the Team", href: "/team" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "#9ab8dc" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <a
              href="mailto:mutis@manchesterstudentsunion.com"
              className="block mb-4 text-sm transition-colors hover:text-white"
              style={{ color: "#9ab8dc" }}
            >
              mutis@manchesterstudentsunion.com
            </a>
            <p className="text-sm leading-relaxed" style={{ color: "#9ab8dc" }}>
              Alliance Manchester Business School<br />
              Booth Street West<br />
              Manchester M15 6PB
            </p>
          </div>
        </div>

        <div
          className="pt-8 mt-8"
          style={{
            borderTop: "1px solid #1a3268",
          }}
        >
          <p
            className="text-center text-sm"
            style={{ color: "#7090b8" }}
          >
            &copy; {new Date().getFullYear()} Manchester University Trading & Investment Society. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
