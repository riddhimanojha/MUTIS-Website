import { Link } from "react-router";
import { TrendingUp, Users, Award, Briefcase, ArrowRight } from "lucide-react";

export function About() {
  const offerings = [
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Trading Competitions",
      description:
        "Compete in simulated markets with real-time analytics. Our competitions use institutional-grade platforms and are judged by industry professionals from top trading firms.",
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Networking Events",
      description:
        "Connect with industry leaders and alumni working at top firms across banking, asset management, and fintech. We host panel discussions, fireside chats, and career fairs every term.",
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: "Educational Workshops",
      description:
        "Master technical analysis, financial modeling, and valuation techniques through hands-on workshops led by experienced analysts and former investment bankers.",
    },
    {
      icon: <Briefcase className="w-10 h-10" />,
      title: "Career Resources",
      description:
        "Access exclusive internships, recruitment pipelines, CV reviews, and mock interview sessions tailored to break into the most competitive finance roles.",
    },
  ];

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-[1400px] mx-auto">
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
          About MUTIS
        </h1>

        <p
          className="text-xl max-w-3xl mb-20"
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            lineHeight: "1.7",
            textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          Manchester University Trading & Investment Society is the UK's leading
          student investment society. With over 6,000 members, we empower
          students to master finance, trading, and investment through world-class
          opportunities, industry exposure, and hands-on experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1100px] mb-20">
          {offerings.map((offering, index) => (
            <div
              key={index}
              className="group relative p-10 rounded-3xl transition-all duration-500 hover:scale-[1.02]"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(30px) saturate(180%)",
                WebkitBackdropFilter: "blur(30px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow:
                  "0 20px 50px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.15)",
              }}
            >
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(139, 69, 172, 0.08) 0%, transparent 70%)",
                }}
              />
              <div className="relative z-10">
                <div
                  className="mb-6 transition-all duration-300"
                  style={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  {offering.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {offering.title}
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "rgba(255, 255, 255, 0.65)" }}
                >
                  {offering.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/join"
            className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-medium text-lg transition-all duration-500 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(25, 25, 45, 0.9) 100%)",
              color: "white",
              border: "1px solid rgba(139, 69, 172, 0.4)",
              boxShadow:
                "0 20px 60px rgba(139, 69, 172, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              Become a Member
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
