import { ArrowRight } from "lucide-react";

export function Join() {
  const benefits = [
    "Access to 100+ events per academic year",
    "Exclusive recruitment pipelines to top firms",
    "Free educational workshops and training",
    "Join the MUTIS Equity Investment Fund",
    "Network with 6,000+ members and alumni",
    "CV reviews and mock interview sessions",
  ];

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-[900px] mx-auto text-center">
        <h1
          className="mb-6"
          style={{
            fontSize: "clamp(3rem, 7vw, 6rem)",
            fontWeight: "900",
            color: "white",
            lineHeight: "1.05",
            textShadow: "0 4px 40px rgba(0, 0, 0, 0.5)",
          }}
        >
          Join MUTIS
        </h1>

        <p
          className="text-xl max-w-2xl mx-auto mb-16"
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            lineHeight: "1.7",
            textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          Membership is free and open to all University of Manchester students.
          Sign up to unlock everything MUTIS has to offer.
        </p>

        <div
          className="rounded-3xl p-10 mb-16 text-left max-w-[700px] mx-auto"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(30px) saturate(180%)",
            WebkitBackdropFilter: "blur(30px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow:
              "0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.15)",
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            What you get
          </h3>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <span
                  className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139, 69, 172, 0.8) 0%, rgba(219, 39, 119, 0.8) 100%)",
                  }}
                />
                <span
                  className="text-base"
                  style={{ color: "rgba(255, 255, 255, 0.75)" }}
                >
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <a
          href="https://forms.gle/mutis-join"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-3 px-14 py-6 rounded-2xl font-medium text-xl transition-all duration-500 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(25, 25, 45, 0.9) 100%)",
            color: "white",
            border: "1px solid rgba(139, 69, 172, 0.5)",
            boxShadow:
              "0 30px 80px rgba(139, 69, 172, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500"
            style={{
              background:
                "radial-gradient(circle at center, rgba(139, 69, 172, 0.5) 0%, transparent 70%)",
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          />
          <span className="relative z-10 flex items-center gap-3">
            Join MUTIS Now
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </span>
        </a>

        <style>{`
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
        `}</style>
      </div>
    </div>
  );
}
