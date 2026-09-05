import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  CheckCircle, AlertTriangle, Eye, MessageSquare, ChevronRight,
  FileText, Shield, BarChart3, ArrowLeft,
} from "lucide-react";
import { demoInspection } from "../../mock/data";
import type { Finding, FindingStatus } from "../../types";

const N = "#0A2540";
const B = "#1769E0";
const BG = "#F6F8FB";
const TXT = "#102A43";
const TXT2 = "#52606D";
const BORDER = "#D9E2EC";

function StatusPill({ status }: { status: FindingStatus }) {
  const map: Record<FindingStatus, [string, string]> = {
    POTENTIAL_ISSUE: ["pill-danger", "Potential Issue"],
    NEEDS_REVIEW: ["pill-warning", "Needs Review"],
    CLEAR: ["pill-success", "Clear"],
    NOT_CONFIRMED: ["pill-info", "Not Confirmed"],
  };
  const [pillClass, label] = map[status];
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${pillClass}`}>
      {label}
    </span>
  );
}

function DeclarationRow({ label, value, confidence, status }: { label: string; value: string; confidence: number; status: string }) {
  const conf = Math.round(confidence * 100);
  const isLow = conf < 70;
  return (
    <div className="solid-card flex items-center gap-4 p-3 rounded-xl">
      <div className="w-36 flex-shrink-0">
        <div className="text-xs font-semibold" style={{ color: TXT2 }}>{label}</div>
      </div>
      <div className="flex-1 text-sm font-medium" style={{ color: isLow ? "#C62828" : TXT }}>
        {value}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
          <div className="h-full rounded-full" style={{ width: `${conf}%`, background: isLow ? "#C62828" : "#16803C" }} />
        </div>
        <span className="text-xs font-semibold w-8" style={{ color: isLow ? "#C62828" : "#16803C" }}>{conf}%</span>
      </div>
      {isLow
        ? <span className="pill-danger text-xs font-bold px-2.5 py-0.5 rounded-full">Review</span>
        : <CheckCircle size={14} style={{ color: "#16803C" }} />}
    </div>
  );
}

function FindingCard({ finding, onAction }: { finding: Finding; onAction: (id: string, action: string) => void }) {
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [decided, setDecided] = useState<string | null>(null);

  return (
    <div className="solid-card rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "#E2E8F0", background: "#F8FAFC" }}>
        <div className="flex items-center gap-3">
          <AlertTriangle size={15} style={{ color: "#C62828" }} />
          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: TXT }}>Finding #{finding.id}</span>
        </div>
        <StatusPill status={finding.status} />
      </div>

      <div className="p-5 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: TXT2 }}>Field</div>
            <div className="text-sm font-semibold" style={{ color: TXT }}>{finding.field_label}</div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: TXT2 }}>Confidence</div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
                <div className="h-full rounded-full" style={{ width: `${Math.round(finding.confidence * 100)}%`, background: "#C62828" }} />
              </div>
              <span className="text-sm font-bold" style={{ color: "#C62828" }}>{Math.round(finding.confidence * 100)}%</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: TXT2 }}>Rule Reference</div>
            <div className="text-xs font-mono px-2 py-0.5 rounded inline-block" style={{ background: "#EBF2FF", color: B }}>
              {finding.rule_reference}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: TXT2 }}>Evidence</div>
            <Link to={`/app/evidence/INS-10024?finding=${finding.id}`} className="inline-flex items-center gap-1 text-xs font-medium no-underline" style={{ color: B }}>
              <Eye size={12} /> View Evidence Region
            </Link>
          </div>
        </div>

        <div className="p-3 rounded-lg text-xs leading-relaxed" style={{ background: BG, color: TXT2 }}>
          <strong style={{ color: TXT }}>Reason: </strong>{finding.reason}
        </div>

        {decided && (
          <div className="flex items-center gap-2 p-3 rounded-lg text-xs font-semibold" style={{ background: "#DCFCE7", color: "#16803C" }}>
            <CheckCircle size={13} /> Inspector decision recorded: {decided}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          {!decided && (
            <>
              <button
                type="button"
                onClick={() => { setDecided("Verified"); onAction(finding.id, "VERIFIED"); }}
                className="btn-success px-3 py-1.5 text-xs"
              >
                Mark Verified
              </button>
              <button
                type="button"
                onClick={() => { setDecided("Not Confirmed"); onAction(finding.id, "NOT_CONFIRMED"); }}
                className="btn-secondary px-3 py-1.5 text-xs"
              >
                Not Confirmed
              </button>
              <button
                type="button"
                onClick={() => { setDecided("Needs Further Inspection"); onAction(finding.id, "NEEDS_FURTHER"); }}
                className="btn-secondary px-3 py-1.5 text-xs text-amber-700 border-amber-200 hover:bg-amber-50"
              >
                Further Inspection
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setShowNote(!showNote)}
            className="btn-secondary px-3 py-1.5 text-xs"
          >
            <MessageSquare size={12} /> Add Note
          </button>
          <Link
            to={`/app/evidence/INS-10024?finding=${finding.id}`}
            className="btn-secondary px-3 py-1.5 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Eye size={12} /> View Evidence
          </Link>
        </div>

        {showNote && (
          <div>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add inspector note for audit record..."
              rows={2}
              className="w-full text-xs px-3 py-2 rounded-lg border outline-none"
              style={{ borderColor: BORDER, color: TXT, resize: "none" }}
            />
            <button className="mt-1 px-3 py-1 text-xs font-semibold rounded" style={{ background: B, color: "white" }}>
              Save Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComplianceResults() {
  const { id } = useParams();
  const inspection = demoInspection;
  const [actions, setActions] = useState<Record<string, string>>({});

  const handleAction = (findingId: string, action: string) => {
    setActions(prev => ({ ...prev, [findingId]: action }));
  };

  const declarations = inspection.declarations;
  const findings = inspection.findings;
  const clearCount = Object.keys(declarations).length - findings.length;

  return (
    <div className="p-6 md:p-8 space-y-6" style={{ background: BG, minHeight: "100%" }}>

      {/* Back */}
      <Link to="/app/dashboard" className="inline-flex items-center gap-1 text-xs font-medium no-underline mb-2" style={{ color: TXT2 }}>
        <ArrowLeft size={13} /> Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: TXT2 }}>COMPLIANCE REVIEW</div>
          <h1 className="text-xl font-bold mb-1" style={{ color: N }}>{inspection.product.name}</h1>
          <p className="text-sm" style={{ color: TXT2 }}>{id} · {inspection.date} · {inspection.location}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/app/risk/${id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border no-underline hover:bg-gray-50 transition-colors"
            style={{ borderColor: BORDER, color: TXT2 }}
          >
            <BarChart3 size={14} /> Risk Assessment
          </Link>
          <Link
            to={`/app/report/${id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold no-underline hover:opacity-90 transition-opacity"
            style={{ background: B }}
          >
            <FileText size={14} /> Generate Report
          </Link>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Potential Findings", val: findings.filter(f => f.status === "POTENTIAL_ISSUE").length, color: "#C62828", bg: "#FEE2E2" },
          { label: "Needs Review", val: findings.filter(f => f.status === "NEEDS_REVIEW").length, color: "#C77C02", bg: "#FEF3C7" },
          { label: "Clear", val: clearCount, color: "#16803C", bg: "#DCFCE7" },
        ].map(({ label, val, color, bg }) => (
          <div key={label} className="solid-card rounded-2xl p-4 text-center">
            <div className="font-bold text-2xl mb-0.5" style={{ color }}>{val}</div>
            <div className="text-xs font-medium" style={{ color: TXT2 }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Left — Declarations */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <h2 className="font-semibold text-sm mb-3" style={{ color: N }}>Extracted Declarations</h2>
            <div className="space-y-2">
              <DeclarationRow label="MRP" value={declarations.mrp?.value || "—"} confidence={declarations.mrp?.confidence || 0} status="ok" />
              <DeclarationRow label="Net Quantity" value={declarations.net_quantity?.value || "—"} confidence={declarations.net_quantity?.confidence || 0} status="ok" />
              <DeclarationRow label="Manufacturer" value={declarations.manufacturer?.value || "—"} confidence={declarations.manufacturer?.confidence || 0} status="ok" />
              <DeclarationRow label="Batch No." value={declarations.batch?.value || "—"} confidence={declarations.batch?.confidence || 0} status="ok" />
              <DeclarationRow label="Date Information" value={declarations.date?.value || "—"} confidence={declarations.date?.confidence || 0} status="ok" />
              <DeclarationRow label="Consumer Info" value={declarations.consumer_information?.value || "Not Detected"} confidence={declarations.consumer_information?.confidence || 0} status="review" />
            </div>
          </div>

          {/* Inspector actions */}
          <div className="solid-card rounded-2xl p-4">
            <div className="text-xs font-semibold mb-3" style={{ color: TXT2 }}>INSPECTOR ACTIONS</div>
            <div className="space-y-2">
              <Link to={`/app/review/${id}`} className="flex items-center justify-between p-2.5 rounded-lg no-underline hover:bg-blue-50 transition-colors" style={{ color: B }}>
                <div className="flex items-center gap-2 text-xs font-medium"><Shield size={13} /> Inspector Review</div>
                <ChevronRight size={12} />
              </Link>
              <Link to={`/app/evidence/${id}`} className="flex items-center justify-between p-2.5 rounded-lg no-underline hover:bg-gray-50 transition-colors" style={{ color: TXT2 }}>
                <div className="flex items-center gap-2 text-xs font-medium"><Eye size={13} /> View Evidence Lens</div>
                <ChevronRight size={12} />
              </Link>
              <Link to={`/app/risk/${id}`} className="flex items-center justify-between p-2.5 rounded-lg no-underline hover:bg-gray-50 transition-colors" style={{ color: TXT2 }}>
                <div className="flex items-center gap-2 text-xs font-medium"><BarChart3 size={13} /> Risk Assessment</div>
                <ChevronRight size={12} />
              </Link>
              <Link to={`/app/report/${id}`} className="flex items-center justify-between p-2.5 rounded-lg no-underline hover:bg-gray-50 transition-colors" style={{ color: TXT2 }}>
                <div className="flex items-center gap-2 text-xs font-medium"><FileText size={13} /> Generate Report</div>
                <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Right — Findings */}
        <div className="md:col-span-3 space-y-4">
          <h2 className="font-semibold text-sm" style={{ color: N }}>Compliance Findings</h2>
          {findings.length === 0
            ? (
              <div className="rounded-xl p-10 text-center" style={{ background: "white", border: `1px solid ${BORDER}` }}>
                <CheckCircle size={30} style={{ color: "#16803C", margin: "0 auto 10px" }} />
                <div className="font-semibold text-sm mb-1" style={{ color: "#15803D" }}>No Findings Detected</div>
                <div className="text-xs" style={{ color: TXT2 }}>All declarations extracted with high confidence.</div>
              </div>
            )
            : findings.map(f => <FindingCard key={f.id} finding={f} onAction={handleAction} />)}
        </div>
      </div>
    </div>
  );
}
