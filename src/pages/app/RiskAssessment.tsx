import { useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, ChevronRight, Info, Shield, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { demoInspection } from "../../mock/data";
import type { RiskLevel } from "../../types";

const N = "#0A2540";
const B = "#1769E0";
const BG = "#F6F8FB";
const TXT = "#102A43";
const TXT2 = "#52606D";
const BORDER = "#D9E2EC";

function RiskGauge({ score, level }: { score: number; level: RiskLevel }) {
  const colorMap: Record<RiskLevel, string> = { HIGH: "#C62828", MEDIUM: "#C77C02", LOW: "#16803C" };
  const color = colorMap[level];
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (circumference * score) / 100;

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#F0F4F8" strokeWidth="10" />
        <circle
          cx="50" cy="50" r="42"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-4xl leading-none" style={{ color: TXT }}>{score}</span>
        <span className="font-bold text-sm" style={{ color }}>{level}</span>
        <span className="text-xs" style={{ color: TXT2 }}>Risk Score</span>
      </div>
    </div>
  );
}

export default function RiskAssessment() {
  const { id } = useParams();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const inspection = demoInspection;
  const risk = inspection.risk;

  const levelConfig: Record<RiskLevel, { bg: string; color: string; border: string; desc: string }> = {
    HIGH: { bg: "#FEF2F2", color: "#C62828", border: "#FECACA", desc: "Immediate inspector review required. Potential significant declaration issues detected." },
    MEDIUM: { bg: "#FFFBEB", color: "#C77C02", border: "#FDE68A", desc: "Inspector review recommended. Some fields require verification." },
    LOW: { bg: "#F0FDF4", color: "#16803C", border: "#86EFAC", desc: "Routine compliance. All declarations detected with high confidence." },
  };
  const lc = levelConfig[risk.level];

  return (
    <div className="p-6 md:p-8 space-y-6" style={{ background: BG, minHeight: "100%" }}>
      <Link to={`/app/compliance/${id}`} className="inline-flex items-center gap-1 text-xs font-medium no-underline" style={{ color: TXT2 }}>
        <ArrowLeft size={13} /> Compliance Results
      </Link>

      <div>
        <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: TXT2 }}>RISK ASSESSMENT</div>
        <h1 className="text-xl font-bold mb-1" style={{ color: N }}>Inspection Risk Analysis</h1>
        <p className="text-sm" style={{ color: TXT2 }}>{id} · {inspection.product.name}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Risk Score Card */}
        <div className="md:col-span-1">
          <div className="solid-card rounded-2xl p-6 text-center">
            <div className="text-xs font-bold uppercase tracking-wider mb-5" style={{ color: TXT2 }}>INSPECTION RISK SCORE</div>
            <RiskGauge score={risk.score} level={risk.level} />

            {/* Level indicator */}
            <div className={`mt-5 p-3 rounded-xl text-sm font-bold ${risk.level === "HIGH" ? "stat-box-issue" : risk.level === "MEDIUM" ? "stat-box-review" : "stat-box-compliant"}`} style={{ color: lc.color }}>
              {risk.level} RISK
            </div>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: TXT2 }}>{lc.desc}</p>

            {/* Risk scale */}
            <div className="mt-5">
              <div className="flex justify-between text-xs mb-1.5" style={{ color: TXT2 }}>
                <span>0</span><span>LOW</span><span>MEDIUM</span><span>HIGH</span><span>100</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
                <div style={{ width: `${risk.score}%`, height: "100%", background: "linear-gradient(90deg, #16803C 33%, #C77C02 66%, #C62828 100%)", borderRadius: "999px" }} />
              </div>
              <div className="relative mt-1">
                <div
                  className="absolute w-1 h-3 rounded-full"
                  style={{ left: `calc(${risk.score}% - 2px)`, background: N, top: 0 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-2 space-y-4">
          {/* Breakdown */}
          <div className="solid-card rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b" style={{ borderColor: "#E2E8F0", background: "#F8FAFC" }}>
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: TXT2 }}>RISK FACTOR BREAKDOWN</div>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "Potential Findings", val: risk.breakdown.potential_findings, max: 5, color: "#C62828", icon: AlertTriangle },
                { label: "Low Confidence Fields", val: risk.breakdown.low_confidence_fields, max: 6, color: "#C77C02", icon: Info },
                { label: "High Priority Findings", val: risk.breakdown.high_priority_findings, max: 3, color: "#C62828", icon: AlertTriangle },
              ].map(({ label, val, max, color, icon: Icon }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm" style={{ color: TXT }}>
                      <Icon size={13} style={{ color }} />
                      {label}
                    </div>
                    <span className="font-bold text-sm" style={{ color }}>{val} / {max}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(val / max) * 100}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why this risk */}
          <div className="solid-card rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full px-5 py-4 flex items-center justify-between text-sm font-semibold transition-colors hover:bg-gray-50"
              style={{ color: N }}
            >
              <div className="flex items-center gap-2">
                <HelpCircle size={15} style={{ color: B }} />
                Why this risk score?
              </div>
              <ChevronRight size={14} style={{ transform: showBreakdown ? "rotate(90deg)" : "none", transition: "transform 0.2s", color: TXT2 }} />
            </button>
            {showBreakdown && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: BORDER }}>
                <div className="text-xs font-semibold mb-3 mt-3" style={{ color: TXT2 }}>CONTRIBUTING FACTORS</div>
                <div className="space-y-2">
                  {risk.factors.map((factor, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs p-3 rounded-lg" style={{ background: BG, color: TXT2 }}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white" style={{ background: "#C62828", fontSize: "9px" }}>{i + 1}</span>
                      {factor}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: "#FEF9EC", border: "1px solid #FDE68A", color: "#C77C02" }}>
                  Risk scores are calculated from AI findings and are provided as decision-support indicators. They do not constitute legal determinations.
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              to={`/app/review/${id}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold no-underline hover:opacity-90 transition-opacity"
              style={{ background: B }}
            >
              <Shield size={15} /> Inspector Review
            </Link>
            <Link
              to={`/app/evidence/${id}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold no-underline border hover:bg-gray-50 transition-colors"
              style={{ borderColor: BORDER, color: TXT2 }}
            >
              View Evidence
            </Link>
          </div>

          {/* Other inspections at risk */}
          <div className="solid-card rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: TXT2 }}>OVERALL RISK CONTEXT</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "High Risk", val: 3, color: "#B91C1C", className: "stat-box-issue" },
                { label: "Medium Risk", val: 4, color: "#B45309", className: "stat-box-review" },
                { label: "Low Risk", val: 17, color: "#15803D", className: "stat-box-compliant" },
              ].map(({ label, val, color, className }) => (
                <div key={label} className={`${className} p-2.5 rounded-xl`}>
                  <div className="font-bold text-lg" style={{ color }}>{val}</div>
                  <div className="text-xs font-bold" style={{ color }}>{label}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs" style={{ color: TXT2 }}>Today's inspection risk distribution across {24} total inspections.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
