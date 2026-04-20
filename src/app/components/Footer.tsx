import { Link } from "react-router";
import { Twitter, Linkedin, Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="relative py-20 px-8 lg:px-16"
      style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
      }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.12)",
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
              style={{ color: "rgba(255, 255, 255, 0.6)" }}
            >
              Manchester University Trading & Investment Society
            </p>
            <div className="flex gap-3">
              {[
                { icon: Twitter, href: "https://twitter.com/mutis" },
                { icon: Linkedin, href: "https://linkedin.com/company/mutis" },
                { icon: Instagram, href: "https://instagram.com/mutis" },
                { icon: Mail, href: "mailto:contact@mutis.co.uk" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.08)",
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
                { label: "Alumni", href: "/alumni" },
                { label: "MEIF", href: "/meif" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255, 255, 255, 0.6)" }}
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
                { label: "Constitution", href: "#" },
                { label: "Privacy", href: "#" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255, 255, 255, 0.6)" }}
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
              href="mailto:contact@mutis.co.uk"
              className="block mb-4 text-sm transition-colors hover:text-white"
              style={{ color: "rgba(255, 255, 255, 0.6)" }}
            >
              contact@mutis.co.uk
            </a>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
              Alliance Manchester Business School<br />
              Booth Street West<br />
              Manchester M15 6PB
            </p>
          </div>
        </div>

        <div
          className="pt-8 mt-8"
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <p
            className="text-center text-sm"
            style={{ color: "rgba(255, 255, 255, 0.4)" }}
          >
            &copy; {new Date().getFullYear()} Manchester University Trading & Investment Society. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
