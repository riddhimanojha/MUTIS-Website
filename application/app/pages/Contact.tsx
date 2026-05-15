import { Mail, MessageSquare, Linkedin, Instagram } from "lucide-react";

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: "mutis@manchesterstudentsunion.com",
    href: null,
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@mutisfinancesoc",
    href: "https://instagram.com/mutisfinancesoc",
  },
  {
    icon: MessageSquare,
    label: "Discord",
    value: "Main MUTIS communication channel",
    href: null,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "MUTIS Finance Society",
    href: "https://linkedin.com/company/mutis",
  },
];

export function Contact() {
  return (
    <div className="relative min-h-screen pt-24 pb-20 px-8">
      <div className="max-w-[860px] mx-auto text-center">
        <h1
          className="mb-6"
          style={{
            fontSize: "clamp(2.6rem, 6vw, 4.8rem)",
            fontWeight: "700",
            color: "white",
            lineHeight: "1.08",
            fontFamily: "var(--font-nav)",
          }}
        >
          Contact Us
        </h1>

        <p
          className="text-lg max-w-2xl mx-auto mb-14"
          style={{ color: "#c8d8f2", lineHeight: "1.72" }}
        >
          Reach out to MUTIS through any of the channels below. We're happy to answer questions about membership, events, sponsorship, or anything else.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {contactItems.map(({ icon: Icon, label, value, href }) => (
            <div
              key={label}
              className="rounded-lg p-8 text-left flex gap-5 items-start"
              style={{
                background: "#111827",
                border: "1px solid #374151",
              }}
            >
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-md w-11 h-11"
                style={{ background: "#1a3370" }}
              >
                <Icon size={20} color="white" />
              </div>
              <div>
                <p
                  className="font-semibold text-white mb-1"
                  style={{ fontFamily: "var(--font-nav)", fontSize: "1rem" }}
                >
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors duration-200"
                    style={{ color: "#93b4ef" }}
                    onMouseEnter={e => ((e.target as HTMLAnchorElement).style.color = "#c8d8f2")}
                    onMouseLeave={e => ((e.target as HTMLAnchorElement).style.color = "#93b4ef")}
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-sm" style={{ color: "#93b4ef" }}>
                    {value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-lg p-10 mt-10 text-left"
          style={{
            background: "#111827",
            border: "1px solid #374151",
          }}
        >
          <h2
            className="text-xl font-semibold text-white mb-3"
            style={{ fontFamily: "var(--font-nav)" }}
          >
            Send us an Email
          </h2>
          <p className="text-sm mb-1" style={{ color: "#c8d8f2" }}>
            For general enquiries, sponsorship opportunities, or membership questions:
          </p>
          <p
            className="text-base font-medium mt-3"
            style={{ color: "#93b4ef", fontFamily: "var(--font-body)" }}
          >
            mutis@manchesterstudentsunion.com
          </p>
        </div>
      </div>
    </div>
  );
}
