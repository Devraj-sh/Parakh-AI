import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Clock, Shield, FileText } from "lucide-react";
import { demoInspection } from "../../mock/data";
import type { ReviewStatus } from "../../types";

const N = "#0A2540";
const B = "#1769E0";
const BG = "#F6F8FB";
const TXT = "#102A43";
const TXT2 = "#52606D";
const BORDER = "#D9E2EC";

type Decision = ReviewStatus | null;

function DecisionButton({ value, current, onSelect, icon: Icon, label, desc, color, bg }: { value: ReviewStatus; current: Decision; onSelect: (v: ReviewStatus) => void; icon: any; label: string; desc: string; color: string; bg: string }) {
  const active = current === value;
  return (
    <button
      onClick={() => onSelect(value)}
      className="w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer hover:shadow-sm active:scale-[0.99]"
      style={{
        borderColor: active ? color : "#CBD5E1",
        background: active ? bg : "white",
        boxShadow: active ? `inset 0 1px 0 #FFFFFF, 0 2px 8px ${color}22` : "inset 0 1px 0 #FFFFFF, 0 1px 2px rgba(10,37,64,0.04)",
      }}
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: active ? color : "#F1F5F9", border: `1px solid ${active ? color : "#CBD5E1"}` }}>
        <Icon size={15} style={{ color: active ? "white" : "#64748B" }} />
      </div>
      <div>
        <div className="font-bold text-sm" style={{ color: active ? color : TXT }}>{label}</div>
        <div className="text-xs mt-0.5 font-medium" style={{ color: TXT2 }}>{desc}</div>
      </div>
    </button>
  );
}

export default function InspectorReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const inspection = demoInspection;
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [globalNote, setGlobalNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate(`/app/report/${id}`), 1500);
  };

  const allDecided = inspection.findings.every(f => decisions[f.id]);

  if (submitted) {
    return (
      <div className="p-8 flex items-center justify-center" style={{ minHeight: "100%", background: BG }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#DCFCE7" }}>
            <CheckCircle size={28} style={{ color: "#16803C" }} />
          </div>
          <h2 className="text-lg font-bold mb-2" style={{ color: N }}>Review Submitted</h2>
          <p className="text-sm mb-4" style={{ color: TXT2 }}>Redirecting to inspection report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6" style={{ background: BG, minHeight: "100%" }}>
      <Link to={`/app/compliance/${id}`} className="inline-flex items-center gap-1 text-xs font-medium no-underline" style={{ color: TXT2 }}>
        <ArrowLeft size={13} /> Compliance Results
      </Link>

      <div>
        <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: TXT2 }}>INSPECTOR REVIEW</div>
        <h1 className="text-xl font-bold mb-1" style={{ color: N }}>Human-in-the-Loop Review</h1>
        <p className="text-sm" style={{ color: TXT2 }}>{id} · {inspection.product.name}</p>
      </div>

      <div className="solid-card rounded-2xl p-4 flex items-center gap-3" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
        <Shield size={16} style={{ color: B }} />
        <p className="text-xs font-semibold" style={{ color: B }}>
          As the authorized inspector, your review and verification is required before any official action. AI findings are decision-support only.
        </p>
      </div>

      {/* Findings to review */}
      <div className="space-y-5">
        {inspection.findings.map((finding) => (
          <div key={finding.id} className="solid-card rounded-2xl overflow-hidden">
            {/* Finding summary */}
            <div className="px-5 py-4 border-b" style={{ borderColor: "#E2E8F0", background: "#F8FAFC" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} style={{ color: "#C62828" }} />
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: TXT }}>AI Finding #{finding.id}</span>
                </div>
                <span className="solid-tag text-xs font-mono font-bold px-2 py-0.5 inline-block">
                  {finding.rule_reference}
                </span>
              </div>
              <div className="grid md:grid-cols-3 gap-3 text-xs">
                <div>
                  <span style={{ color: TXT2 }}>Field: </span>
                  <span className="font-semibold" style={{ color: TXT }}>{finding.field_label}</span>
                </div>
                <div>
                  <span style={{ color: TXT2 }}>Confidence: </span>
                  <span className="font-semibold" style={{ color: "#C62828" }}>{Math.round(finding.confidence * 100)}%</span>
                </div>
                <div>
                  <span style={{ color: TXT2 }}>Status: </span>
                  <span className="font-semibold" style={{ color: "#C62828" }}>{finding.status.replace("_", " ")}</span>
                </div>
              </div>
              <p className="text-xs mt-2 leading-relaxed" style={{ color: TXT2 }}>{finding.reason}</p>
            </div>

            {/* Inspector decision */}
            <div className="p-5">
              <div className="text-xs font-semibold mb-3" style={{ color: TXT2 }}>INSPECTOR DECISION</div>
              <div className="space-y-2 mb-4">
                <DecisionButton
                  value="VERIFIED"
                  current={decisions[finding.id]}
                  onSelect={(v) => setDecisions(p => ({ ...p, [finding.id]: v }))}
                  icon={CheckCircle}
                  label="Verified — Issue Confirmed"
                  desc="Inspector confirms the AI finding is accurate and warrants action."
                  color="#16803C"
                  bg="#F0FDF4"
                />
                <DecisionButton
                  value="NOT_CONFIRMED"
                  current={decisions[finding.id]}
                  onSelect={(v) => setDecisions(p => ({ ...p, [finding.id]: v }))}
                  icon={XCircle}
                  label="Not Confirmed — Finding Dismissed"
                  desc="Inspector has reviewed and determines the finding does not apply."
                  color="#52606D"
                  bg="#F8FAFC"
                />
                <DecisionButton
                  value="NEEDS_FURTHER"
                  current={decisions[finding.id]}
                  onSelect={(v) => setDecisions(p => ({ ...p, [finding.id]: v }))}
                  icon={Clock}
                  label="Needs Further Inspection"
                  desc="Additional physical inspection or documentation review required."
                  color="#C77C02"
                  bg="#FFFBEB"
                />
              </div>

              {/* Finding-level note */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: TXT }}>Inspector Note (Optional)</label>
                <textarea
                  placeholder="Add specific notes for this finding..."
                  rows={2}
                  className="w-full text-xs px-3 py-2 rounded-lg border outline-none"
                  style={{ borderColor: BORDER, color: TXT, resize: "none" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Global review section */}
      <div className="rounded-xl p-5" style={{ background: "white", border: `1px solid ${BORDER}` }}>
        <div className="text-xs font-semibold mb-3" style={{ color: TXT2 }}>OVERALL INSPECTOR NOTES</div>
        <textarea
          value={globalNote}
          onChange={e => setGlobalNote(e.target.value)}
          placeholder="Overall inspection notes, observations, or actions taken..."
          rows={3}
          className="w-full text-sm px-3 py-2.5 rounded-lg border outline-none"
          style={{ borderColor: BORDER, color: TXT, resize: "none" }}
          onFocus={e => (e.target.style.borderColor = B)}
          onBlur={e => (e.target.style.borderColor = BORDER)}
        />
      </div>

      {/* Submit */}
      <div className="flex flex-col md:flex-row gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allDecided}
          className="btn-primary flex-1 py-3 text-sm"
        >
          <Shield size={16} /> Confirm Review & Proceed to Report
        </button>
        <Link
          to={`/app/evidence/${id}`}
          className="btn-secondary px-5 py-3 text-sm"
        >
          View Evidence
        </Link>
      </div>

      {!allDecided && (
        <p className="text-xs text-center" style={{ color: TXT2 }}>
          Please provide a decision for all {inspection.findings.length} finding(s) before confirming review.
        </p>
      )}
    </div>
  );
}
