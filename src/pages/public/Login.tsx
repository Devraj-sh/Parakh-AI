import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Shield, AlertCircle, Loader2, ScanLine, Scale, ClipboardCheck } from "lucide-react";
import { authService } from "../../services/api";

const N = "#0A2540";
const ND = "#061A2E";
const B = "#1769E0";
const C = "#00B8D9";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter your credentials."); return; }
    setLoading(true);
    setError("");
    try {
      await authService.login(email, password);
      navigate("/app/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    setEmail("r.sharma@legalmetrology.gov.in");
    setPassword("demo@2026");
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden" style={{ background: `linear-gradient(145deg, ${ND} 0%, ${N} 60%, #0D3160 100%)` }}>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* Top */}
        <div className="relative">
          <Link to="/" className="inline-flex items-center no-underline mb-14 transition-opacity hover:opacity-90">
            <img src="/parakh-logo-light.png" alt="PARAKH AI" className="h-8 md:h-9 w-auto object-contain" />
          </Link>

          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            AI-assisted inspection<br />and compliance.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#A8BDD3" }}>
            Legal Metrology Inspection Workspace — Capture, Analyze, Verify, Report.
          </p>
        </div>

        {/* Feature badges */}
        <div className="relative space-y-3.5 my-8">
          {[
            { icon: ScanLine, label: "AI Label Scanner", desc: "Detect package declarations automatically" },
            { icon: Scale, label: "Compliance Engine", desc: "Rule-based analysis against legal requirements" },
            { icon: ClipboardCheck, label: "Inspector Workflow", desc: "End-to-end digital inspection process" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="solid-dark-box flex items-center gap-3.5 p-3.5">
              <div className="solid-dark-icon w-10 h-10">
                <Icon size={19} strokeWidth={2} />
              </div>
              <div>
                <div className="text-sm font-semibold text-white tracking-tight">{label}</div>
                <div className="text-xs text-slate-300">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom disclaimer */}
        <div className="relative">
          <p className="text-xs leading-relaxed" style={{ color: "#4B6280" }}>
            PARAKH AI is an inspector-assistance platform. AI findings require human review.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12" style={{ background: "#F6F8FB" }}>
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Link to="/" className="inline-flex items-center">
              <img src="/parakh-logo.png" alt="PARAKH AI" className="h-8 w-auto object-contain" />
            </Link>
          </div>

          <div className="solid-card rounded-2xl p-8">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} style={{ color: B }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: B }}>Inspection Workspace</span>
              </div>
              <h1 className="text-xl font-bold mb-1" style={{ color: N }}>Inspector Sign In</h1>
              <p className="text-sm" style={{ color: "#7B8A97" }}>Access your Legal Metrology inspection workspace.</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg mb-4 text-sm" style={{ background: "#FEE2E2", color: "#C62828" }}>
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#102A43" }}>
                  Official Email / User ID
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="inspector@legalmetrology.gov.in"
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#102A43" }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 pr-10 rounded-lg text-sm outline-none transition-all"
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#9CAAB5" }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-xs" style={{ color: "#52606D" }}>Keep me signed in</span>
                </label>
                <a href="#" className="text-xs font-medium no-underline" style={{ color: B }}>Forgot Password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm"
              >
                {loading ? <><Loader2 size={15} className="animate-spin" /> Signing in...</> : "Sign In"}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t" style={{ borderColor: "#F0F4F8" }}>
              <button
                type="button"
                onClick={handleDemo}
                className="btn-secondary w-full py-2.5 text-sm"
              >
                Load Demo Credentials — SIH 2026
              </button>
            </div>

            <div className="mt-6 text-center">
              <a href="#" className="text-xs no-underline" style={{ color: "#9CAAB5" }}>Help & Support</a>
              <span className="mx-2 text-xs" style={{ color: "#D9E2EC" }}>·</span>
              <Link to="/" className="text-xs no-underline" style={{ color: "#9CAAB5" }}>← Back to Home</Link>
            </div>
          </div>

          <p className="mt-6 text-xs text-center leading-relaxed" style={{ color: "#9CAAB5" }}>
            By signing in, you agree to use PARAKH AI for authorized inspection activities only.<br />
            AI findings require inspector review and verification.
          </p>
        </div>
      </div>
    </div>
  );
}
