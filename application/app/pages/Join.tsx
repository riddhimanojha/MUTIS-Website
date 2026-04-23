import { ArrowRight } from "lucide-react";

export function Join() {
  const benefits = [
    "Open membership for students from all academic backgrounds.",
    "Weekly meetings on trading, investing, and investment banking.",
    "Entry to competitions including stock pitch, private equity, and trading challenges.",
    "Access to MUTIS Ethical Investment Fund (MEIF) opportunities.",
    "Career support: CV, cover letter, and interview preparation.",
    "Networking with alumni and professionals across top financial institutions.",
  ];

  const contactChannels = [
    { label: "Instagram", value: "@mutisfinancesoc" },
    { label: "Discord", value: "Main MUTIS communication channel" },
    { label: "Email", value: "mutis@manchesterstudentsunion.com" },
    { label: "LinkedIn", value: "MUTIS Finance Society" },
  ];

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-8">
      <div className="max-w-[940px] mx-auto text-center">
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
          Join MUTIS
        </h1>

        <p
          className="text-lg max-w-3xl mx-auto mb-12"
          style={{ color: "#c8d8f2", lineHeight: "1.72" }}
        >
          MUTIS membership is open to all University of Manchester students. You can join anytime by attending events or registering through Students' Union channels.
        </p>

        <div
          className="rounded-lg p-10 mb-10 text-left"
          style={{
            background: "#111827",
            border: "1px solid #374151",
          }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: "var(--font-nav)" }}>
            What you get
          </h2>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-2 w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#5e9cda" }} />
                <span className="text-base" style={{ color: "#c8d8f2" }}>
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="rounded-lg p-8 mb-12 text-left"
          style={{
            background: "#1a1f2e",
            border: "1px solid #2d3748",
          }}
        >
          <h3 className="text-xl text-white mb-4" style={{ fontFamily: "var(--font-nav)", fontWeight: 600 }}>
            Contact & Updates
          </h3>
          <ul className="space-y-3">
            {contactChannels.map((item, index) => (
              <li key={index} className="flex gap-2 text-sm md:text-base" style={{ color: "#c8d8f2" }}>
                <span className="text-white" style={{ minWidth: "90px" }}>{item.label}:</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <a
          href="mailto:mutis@manchesterstudentsunion.com"
          className="inline-flex items-center gap-3 px-14 py-6 rounded-md font-semibold text-xl transition-all duration-300 hover:opacity-90"
          style={{
            background: "#0e2052",
            color: "white",
            border: "1px solid #2d5090",
          }}
        >
          Contact MUTIS to Join
          <ArrowRight className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}
