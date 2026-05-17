import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LogIn, LogOut, Plus, Trash2, Lock, Eye, EyeOff } from "lucide-react";

// ---- Types ----
type AdminEvent = {
  id: string;
  title: string;
  date: string;
  venue: string;
  register: string;
};

type AdminArticle = {
  id: string;
  title: string;
  team: string;
  date: string;
  summary: string;
  pdfUrl: string;
};

// ---- Login form ----
function LoginForm() {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(password);
    if (!ok) setError("Incorrect password. Please try again.");
    else setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8 pt-24 pb-20">
      <div
        className="w-full max-w-md rounded-lg p-10"
        style={{ background: "#111827", border: "1px solid #374151" }}
      >
        <div className="flex items-center gap-3 mb-8">
          <Lock className="w-6 h-6" style={{ color: "#9ab8dc" }} />
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-nav)" }}>
            Committee Login
          </h1>
        </div>
        <p className="text-sm mb-8" style={{ color: "#9ab8dc" }}>
          This area is restricted to MUTIS committee members.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-white">Password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter committee password"
              className="w-full px-4 py-2 rounded bg-[#222c3a] text-white border border-[#374151] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ab8dc]"
              onClick={() => setShowPw((v) => !v)}
              tabIndex={-1}
            >
              {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button
            type="submit"
            className="mt-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded transition-colors"
          >
            <LogIn className="inline w-4 h-4 mr-2 -mt-1" /> Login
          </button>
        </form>
      </div>
    </div>
  );
}

// ---- Main Admin Page ----
export function Admin() {
  const { isAdmin, logout } = useAuth();

  if (!isAdmin) return <LoginForm />;

  return (
    <div className="min-h-screen pt-24 pb-20 px-8">
      <div className="max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-nav)" }}>
            Admin Panel
          </h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
        <div className="bg-[#1a2233] rounded-lg p-8 border border-[#374151]">
          <h2 className="text-xl font-semibold mb-4 text-white">Welcome, Committee Member!</h2>
          <p className="text-[#9ab8dc] mb-4">
            This is a placeholder admin panel. Add event/article management here as needed.
          </p>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded transition-colors">
              <Plus className="w-4 h-4" /> Add Event
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded transition-colors">
              <Plus className="w-4 h-4" /> Add Article
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded transition-colors">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
