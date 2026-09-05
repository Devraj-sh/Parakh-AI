import { Link } from "react-router";
import {
  Camera, Package, Search, CheckCircle, AlertTriangle, FileText,
  Shield, ClipboardList, BarChart3, ChevronRight, ArrowRight,
  Scan, Scale, MapPin, Calendar, ChevronDown, FileSearch,
} from "lucide-react";
import { useState } from "react";
import { getSolidIconBadgeProps } from "../../utils/iconBadge";

const N = "#0A2540";
const ND = "#061A2E";
const B = "#1769E0";
const C = "#00B8D9";
const BG = "#F6F8FB";
const TXT = "#102A43";
const TXT2 = "#52606D";
const BORDER = "#D9E2EC";

// ─── Shared Components ───────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200/90 font-mono">
      {children}
    </span>
  );
}

function Badge({ level }: { level: "HIGH" | "MEDIUM" | "LOW" | "REVIEW" }) {
  const map = {
    HIGH: "bg-rose-50 text-rose-700 border-rose-200/80",
    MEDIUM: "bg-amber-50 text-amber-700 border-amber-200/80",
    LOW: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    REVIEW: "bg-blue-50 text-blue-700 border-blue-200/80",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${map[level]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {level}
    </span>
  );
}



// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: BORDER }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left gap-4">
        <span className="text-sm font-semibold" style={{ color: TXT }}>{q}</span>
        <ChevronDown size={16} style={{ color: TXT2, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && <p className="pb-5 text-sm leading-relaxed" style={{ color: TXT2 }}>{a}</p>}
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[85vh] lg:min-h-[90vh] flex items-center" style={{ backgroundColor: "#061A2E" }}>
        {/* Desktop Hero Background Image */}
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/hero-bg.jpg?v=3')",
            backgroundPosition: "right top",
            opacity: 0.95,
          }}
        />
        {/* Desktop Gradient: horizontal */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to right, rgba(6, 26, 46, 0.92) 0%, rgba(6, 26, 46, 0.75) 45%, rgba(6, 26, 46, 0.1) 70%, transparent 100%)",
          }}
        />

        {/* Mobile Hero Background Image */}
        <div
          className="md:hidden absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/hero-bg-mobile.jpg?v=1')",
            backgroundPosition: "center top",
            opacity: 0.95,
          }}
        />
        {/* Mobile Gradient: soft vertical overlay for crisp text readability */}
        <div
          className="md:hidden absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(6, 26, 46, 0.92) 0%, rgba(6, 26, 46, 0.82) 48%, rgba(6, 26, 46, 0.4) 75%, rgba(6, 26, 46, 0.88) 100%)",
          }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-6 pt-36 pb-28 md:pt-48 md:pb-40">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="space-y-8">
              <div>
                <h1 className="font-bold leading-tight mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "white" }}>
                  Smarter Inspections.<br />
                  <span style={{ color: C }}>Stronger Compliance.</span>
                </h1>
                <p className="text-base leading-relaxed" style={{ color: "#D9E2EC" }}>
                  PARAKH AI assists inspectors in analyzing package labels, identifying potential declaration issues, highlighting visual evidence, prioritizing inspection risk and generating structured inspection reports.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  to="/app/new-inspection"
                  className="btn-primary px-7 py-3.5 text-sm"
                >
                  <span>Start Inspection</span>
                  <ChevronRight size={16} />
                </Link>
                <a
                  href="#how-it-works"
                  className="btn-dark-glass px-6 py-3.5 text-sm"
                >
                  Explore PARAKH AI
                </a>
              </div>
            </div>

            {/* Right side spacer to showcase the inspector in the photo */}
            <div className="hidden md:block" />
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
      <section style={{ background: "white", borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#9CAAB5" }}>
            Built for smarter inspection workflows
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Scan, label: "AI-Assisted Inspection" },
              { icon: FileSearch, label: "Evidence-Based Findings" },
              { icon: Shield, label: "Rule-Based Compliance" },
              { icon: BarChart3, label: "Risk Prioritization" },
              { icon: ClipboardList, label: "Human-in-the-Loop" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 py-3 text-center">
                <div className="w-10 h-10 solid-icon-badge badge-blue mb-1">
                  <Icon size={18} strokeWidth={2} style={{ color: B }} />
                </div>
                <span className="text-xs font-semibold" style={{ color: TXT2 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ───────────────────────────────────────────── */}
      <section id="about" style={{ background: BG }} className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <SectionLabel>The Challenge</SectionLabel>
            <h2 className="mt-4 font-bold text-2xl md:text-3xl" style={{ color: TXT }}>
              Traditional vs. AI-Assisted Inspection
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Problems */}
            <div className="solid-card rounded-2xl p-8">
              <h3 className="font-semibold text-base mb-6 flex items-center gap-2.5" style={{ color: TXT }}>
                <span className="w-6 h-6 rounded-md solid-icon-badge badge-red text-xs font-bold">✕</span>
                Traditional Inspection Challenges
              </h3>
              <div className="space-y-3">
                {[
                  "Manual verification of each package declaration field",
                  "Large inspection volumes difficult to manage consistently",
                  "Time-consuming label checking and cross-referencing",
                  "Difficult evidence documentation and record-keeping",
                  "Inconsistent risk prioritization across inspectors",
                  "Repetitive human-readable checks with no digital trail",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 py-2.5 border-b text-sm" style={{ borderColor: "#F0F4F8", color: TXT2 }}>
                    <span style={{ color: "#C62828", marginTop: "2px", flexShrink: 0 }}>—</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div className="solid-dark-box p-8">
              <h3 className="font-semibold text-base mb-6 flex items-center gap-2.5 text-white">
                <span className="solid-dark-icon w-6 h-6 text-xs font-bold" style={{ color: "#38BDF8" }}>✓</span>
                PARAKH AI Assistance
              </h3>
              <div className="space-y-3">
                {[
                  "AI-assisted label analysis with confidence scoring",
                  "Structured declaration extraction for all mandated fields",
                  "Rule-based compliance checks against configured requirements",
                  "Visual evidence highlighting with exact region identification",
                  "Risk-based prioritization with transparent scoring factors",
                  "Digital inspection reports with structured findings records",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 py-2.5 border-b text-sm" style={{ borderColor: "#153A63", color: "#A8BDD3" }}>
                    <CheckCircle size={14} style={{ color: "#38BDF8", marginTop: "2px", flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ background: "white" }} className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <SectionLabel>Inspection Workflow</SectionLabel>
            <h2 className="mt-4 font-bold text-2xl md:text-3xl" style={{ color: TXT }}>
              How PARAKH AI Works
            </h2>
            <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: TXT2 }}>
              A structured five-stage workflow from image capture to inspector report — transparent at every step.
            </p>
          </div>

          <div className="relative">
            {/* Timeline connector */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, ${B}40, ${B}, ${B}40)` }} />

            <div className="grid md:grid-cols-5 gap-4 relative">
              {[
                { num: "01", icon: Camera, title: "Capture", desc: "Inspector captures or uploads package images from front, back, and sides." },
                { num: "02", icon: Scan, title: "Detect", desc: "AI identifies relevant label regions and text areas on the package." },
                { num: "03", icon: Search, title: "Extract", desc: "OCR extracts MRP, Net Quantity, Manufacturer, Batch, Date and Consumer Information." },
                { num: "04", icon: Shield, title: "Check", desc: "Compliance Engine compares extracted data against configured legal requirements." },
                { num: "05", icon: FileText, title: "Review & Report", desc: "Inspector reviews AI findings, evidence and risk before final action and report." },
              ].map(({ num, icon: Icon, title, desc }) => (
                <div key={num} className="group relative flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-200">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 bg-slate-50 border border-slate-200/70 text-blue-600 group-hover:scale-105 group-hover:bg-blue-50 transition-all duration-200 shadow-xs">
                    <Icon size={19} strokeWidth={1.75} />
                  </div>
                  <span className="inline-block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1 font-mono">
                    STAGE {num}
                  </span>
                  <div className="font-semibold text-sm mb-1 text-slate-900">{title}</div>
                  <p className="text-xs leading-relaxed text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" style={{ background: BG }} className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel>Core Capabilities</SectionLabel>
            <h2 className="mt-4 font-bold text-2xl md:text-3xl" style={{ color: TXT }}>
              Built for the Inspection Workflow
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Scan,
                title: "AI Label Scanner",
                desc: "Detect and extract relevant package declarations from images using computer vision and OCR.",
                detail: "Package image + OCR detection",
                color: B,
              },
              {
                icon: Shield,
                title: "Compliance Engine",
                desc: "Evaluate extracted information against structured, versioned legal metrology requirements.",
                detail: "Rule → Data → Result",
                color: "#16803C",
              },
              {
                icon: Search,
                title: "Evidence Lens",
                desc: "Show exactly where a potential issue was detected — with zoom, pan, and region highlighting.",
                detail: "Zoomed evidence region",
                color: C,
              },
              {
                icon: BarChart3,
                title: "Risk Engine",
                desc: "Prioritize inspections using transparent risk indicators across multiple scoring factors.",
                detail: "LOW / MEDIUM / HIGH",
                color: "#C77C02",
              },
              {
                icon: ClipboardList,
                title: "Inspector Workflow",
                desc: "Move from capture to review and reporting through a single structured digital workflow.",
                detail: "Step-by-step guided process",
                color: B,
              },
              {
                icon: FileText,
                title: "Digital Reports",
                desc: "Generate structured inspection records with findings, evidence, risk scores and supporting data.",
                detail: "PDF-ready report output",
                color: "#7B3FE4",
              },
            ].map(({ icon: Icon, title, desc, detail, color }) => {
              const badge = getSolidIconBadgeProps(color);
              return (
                <div key={title} className="rounded-2xl p-6 solid-card p-card-hover cursor-default">
                  <div className={`w-10 h-10 solid-icon-badge ${badge.className} mb-4`}>
                    <Icon size={19} strokeWidth={2} style={{ color: badge.text }} />
                  </div>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: TXT }}>{title}</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: TXT2 }}>{desc}</p>
                  <div className="solid-tag text-xs px-2.5 py-1 inline-block">{detail}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AI LABEL SCANNER ─────────────────────────────────────────────── */}
      <section id="technology" style={{ background: "white" }} className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel>AI Label Scanner</SectionLabel>
              <h2 className="mt-4 font-bold text-2xl md:text-3xl mb-4" style={{ color: TXT }}>
                See What the Inspector Sees
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: TXT2 }}>
                PARAKH AI detects and extracts package declarations using computer vision and OCR. Every extracted field carries a confidence score, and low-confidence results are automatically flagged for inspector review.
              </p>
              <div className="space-y-3">
                {[
                  { field: "MRP", val: "₹50", conf: 96, ok: true },
                  { field: "NET QUANTITY", val: "800 g", conf: 98, ok: true },
                  { field: "MANUFACTURER", val: "ABC Foods Pvt. Ltd.", conf: 91, ok: true },
                  { field: "DATE", val: "Detected", conf: 89, ok: true },
                  { field: "CONSUMER INFO", val: "Needs Review", conf: 41, ok: false },
                ].map(({ field, val, conf, ok }) => (
                  <div key={field} className="solid-card flex items-center gap-4 p-3.5 rounded-xl">
                    <div className="flex items-center gap-2.5 w-38 flex-shrink-0">
                      {ok ? (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-green-50 border border-green-200 text-green-700 shadow-xs">
                          <CheckCircle size={13} strokeWidth={2.5} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-red-50 border border-red-200 text-red-700 shadow-xs">
                          <AlertTriangle size={13} strokeWidth={2.5} />
                        </div>
                      )}
                      <span className="text-xs font-bold" style={{ color: TXT }}>{field}</span>
                    </div>
                    <div className="flex-1 text-xs font-semibold" style={{ color: ok ? TXT : "#C62828" }}>{val}</div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-20 h-2 rounded-full overflow-hidden border border-slate-200" style={{ background: "#E2E8F0" }}>
                        <div className="h-full rounded-full" style={{ width: `${conf}%`, background: ok ? "linear-gradient(90deg, #22C55E, #16A34A)" : "linear-gradient(90deg, #EF4444, #DC2626)" }} />
                      </div>
                      <span className="text-xs font-bold w-9 text-right" style={{ color: ok ? "#16803C" : "#C62828" }}>{conf}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs" style={{ color: "#9CAAB5" }}>
                * AI detection requires inspector verification. Confidence indicators assist human review — they do not constitute legal determination.
              </p>
            </div>

            {/* Compliance Engine Visual */}
            <div className="solid-card rounded-2xl p-6" style={{ background: "#F8FAFC" }}>
              <div className="text-xs font-bold mb-4 flex items-center gap-2 text-slate-800">
                <div className="w-6 h-6 rounded-md solid-icon-badge badge-blue">
                  <Shield size={13} strokeWidth={2} />
                </div>
                COMPLIANCE ENGINE — ANALYSIS FLOW
              </div>
              <div className="space-y-3">
                <div className="solid-card rounded-xl p-3.5">
                  <div className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">EXTRACTED DATA</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[["MRP", "₹50"], ["Net Qty", "800 g"], ["Manufacturer", "Detected"], ["Date", "Detected"]].map(([k, v]) => (
                      <div key={k} className="text-xs"><span className="text-slate-500">{k}: </span><span className="font-semibold text-slate-900">{v}</span></div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center"><ArrowRight size={16} style={{ color: B }} /></div>
                <div className="solid-card rounded-xl p-3.5">
                  <div className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">APPLICABLE REQUIREMENTS</div>
                  <div className="text-xs space-y-1.5">
                    {["RULE-LM-2011-S7(1) — Consumer Information", "RULE-LM-2011-S6(2) — Date Declaration", "RULE-LM-2011-S4 — MRP & Net Quantity"].map(r => (
                      <div key={r} className="flex items-center gap-2 text-slate-700 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: B }} /> {r}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center"><ArrowRight size={16} style={{ color: B }} /></div>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: "COMPLIANT", className: "stat-box-compliant", color: "#15803D", count: "05" },
                    { label: "POTENTIAL ISSUE", className: "stat-box-issue", color: "#B91C1C", count: "02" },
                    { label: "NEEDS REVIEW", className: "stat-box-review", color: "#B45309", count: "01" },
                  ].map(({ label, className, color, count }) => (
                    <div key={label} className={`${className} rounded-xl p-2.5 text-center transition-transform hover:scale-102`}>
                      <div className="font-bold text-lg" style={{ color }}>{count}</div>
                      <div className="text-xs font-bold tracking-tight leading-tight" style={{ color }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RISK ENGINE ──────────────────────────────────────────────────── */}
      <section style={{ background: BG }} className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Risk visual */}
            <div className="rounded-xl p-8" style={{ background: "white", border: `1px solid ${BORDER}` }}>
              <div className="text-xs font-bold mb-6" style={{ color: TXT2 }}>INSPECTION RISK DASHBOARD</div>
              <div className="flex items-center gap-6 mb-8">
                <div className="relative w-28 h-28">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#F0F4F8" strokeWidth="10" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#C62828" strokeWidth="10" strokeDasharray="251" strokeDashoffset={251 - (251 * 72) / 100} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-bold text-2xl" style={{ color: TXT }}>72</span>
                    <span className="text-xs font-semibold" style={{ color: "#C62828" }}>HIGH</span>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  {[
                    { label: "Potential Findings", val: "03", color: "#C62828" },
                    { label: "Low Confidence Fields", val: "01", color: "#C77C02" },
                    { label: "High Priority Findings", val: "01", color: "#C62828" },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                      <span style={{ color: TXT2 }}>{label}</span>
                      <span className="font-bold" style={{ color }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Risk bar */}
              <div>
                <div className="flex justify-between text-xs mb-2" style={{ color: TXT2 }}>
                  <span>LOW</span><span>MEDIUM</span><span>HIGH</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F0F4F8" }}>
                  <div className="h-full rounded-full" style={{ width: "72%", background: "linear-gradient(90deg, #16803C, #C77C02, #C62828)" }} />
                </div>
                <div className="text-right mt-1 text-xs font-semibold" style={{ color: "#C62828" }}>Score: 72</div>
              </div>
              <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: "#FEF9EC", border: "1px solid #FDE68A" }}>
                <span className="font-semibold" style={{ color: "#C77C02" }}>Scoring Note: </span>
                <span style={{ color: TXT2 }}>Risk scores are calculated from AI findings and should be treated as decision-support indicators, not legal determinations.</span>
              </div>
            </div>

            <div>
              <SectionLabel>Risk Engine</SectionLabel>
              <h2 className="mt-4 font-bold text-2xl md:text-3xl mb-4" style={{ color: TXT }}>
                Prioritize Inspections with Transparent Risk Scoring
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: TXT2 }}>
                The PARAKH AI Risk Engine calculates an inspection risk score based on the number and severity of potential findings, low-confidence extracted fields, and applicable rule priorities.
              </p>
              <div className="space-y-3">
                {[
                  { label: "HIGH RISK (70–100)", desc: "Immediate inspector review required. Potential significant findings detected.", color: "#B91C1C", className: "stat-box-issue" },
                  { label: "MEDIUM RISK (40–69)", desc: "Inspector review recommended. Some fields require verification.", color: "#B45309", className: "stat-box-review" },
                  { label: "LOW RISK (0–39)", desc: "Routine compliance. All declarations detected with high confidence.", color: "#15803D", className: "stat-box-compliant" },
                ].map(({ label, desc, color, className }) => (
                  <div key={label} className={`${className} flex items-start gap-3 p-3.5 rounded-xl text-xs transition-transform hover:scale-101`}>
                    <div className="w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0" style={{ background: color }} />
                    <div>
                      <div className="font-bold mb-0.5" style={{ color }}>{label}</div>
                      <div className="font-medium" style={{ color: TXT2 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" style={{ background: "white" }} className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="mt-4 font-bold text-2xl" style={{ color: TXT }}>Frequently Asked Questions</h2>
          </div>
          <div>
            {[
              { q: "Is PARAKH AI an official government system?", a: "PARAKH AI is a decision-support platform designed for Legal Metrology inspection assistance. It is not an officially certified government system and its AI findings require appropriate human review and inspector verification before any official action." },
              { q: "Does PARAKH AI make legal determinations?", a: "No. PARAKH AI generates AI-assisted findings and risk indicators as decision-support. All findings are labeled as 'Potential Issue' or 'Needs Review' and require inspector verification. The final legal determination rests with the authorized inspector." },
              { q: "What information does PARAKH AI extract?", a: "PARAKH AI attempts to extract MRP, Net Quantity, Manufacturer details, Batch number, Date information, and Consumer information from package label images using OCR and computer vision. Each field carries a confidence score." },
              { q: "What happens if AI confidence is low?", a: "Fields with low confidence scores are automatically flagged as 'Needs Review'. The system will not treat a low-confidence result as a confirmed finding — it surfaces it for inspector attention and allows the inspector to make the final determination." },
              { q: "Can PARAKH AI be used on mobile devices?", a: "Yes. PARAKH AI is designed to be fully responsive and usable on mobile devices. Inspectors can capture package images using their mobile camera and complete the inspection workflow including evidence review and report generation on mobile." },
              { q: "How is evidence stored and documented?", a: "PARAKH AI records evidence regions on package images and links them to specific findings in the inspection record. All inspector decisions, notes, and findings are stored in structured digital inspection records for audit trail purposes." },
            ].map((faq) => <FAQItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(135deg, ${ND} 0%, ${N} 100%)` }} className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-bold text-white mb-4" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>
            Make Every Inspection Smarter.
          </h2>
          <p className="mb-8 text-base" style={{ color: "#A8BDD3" }}>
            Use AI to assist inspection, organize evidence and prioritize review — while keeping the inspector firmly in control.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/app/new-inspection" className="btn-primary px-8 py-3.5 text-sm">
              <span>Start Inspection</span>
              <ChevronRight size={16} />
            </Link>
            <Link to="/app/dashboard" className="btn-dark-glass px-8 py-3.5 text-sm">
              View Demo Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ background: ND, borderTop: "1px solid #14375F" }} className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="mb-5">
                <img src="/parakh-logo-light.png" alt="PARAKH AI" className="h-8 w-auto object-contain" />
              </div>
              <p className="text-sm mb-4" style={{ color: "#7B9CB8" }}>
                AI-Powered Legal Metrology Compliance & Inspector Assistance Platform
              </p>
              <div className="solid-dark-box p-4 text-xs leading-relaxed" style={{ color: "#8EABCA" }}>
                <strong style={{ color: "#E2E8F0" }}>Disclaimer: </strong>
                PARAKH AI is designed as an inspector-assistance and decision-support platform. AI-generated findings require appropriate human review and verification. This platform does not make legal determinations.
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#4B6280" }}>Platform</div>
              <div className="space-y-2">
                {["About", "Features", "How It Works", "Technology", "FAQ"].map(l => (
                  <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} className="block text-sm no-underline hover:opacity-80 transition-opacity" style={{ color: "#7B9CB8" }}>{l}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#4B6280" }}>Legal</div>
              <div className="space-y-2">
                {["Privacy Policy", "Terms of Use", "Disclaimer", "Contact / Support"].map(l => (
                  <a key={l} href="#" className="block text-sm no-underline hover:opacity-80 transition-opacity" style={{ color: "#7B9CB8" }}>{l}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between gap-4 text-xs" style={{ borderColor: "#14375F", color: "#4B6280" }}>
            <span>© 2026 PARAKH AI. AI-assisted inspection decision-support platform.</span>
            <span>Built for Legal Metrology Inspection Workflow — SIH 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
