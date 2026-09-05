import { useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Download, Printer, Share2, CheckCircle, AlertTriangle, FileText, Shield } from "lucide-react";
import { demoInspection, mockInspector } from "../../mock/data";

const N = "#0A2540";
const B = "#1769E0";
const BG = "#F6F8FB";
const TXT = "#102A43";
const TXT2 = "#52606D";
const BORDER = "#D9E2EC";

export default function InspectionReport() {
  const { id } = useParams();
  const inspection = demoInspection;
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1500);
  };

  return (
    <div className="p-6 md:p-8 space-y-6" style={{ background: BG, minHeight: "100%" }}>
      <Link to={`/app/compliance/${id}`} className="inline-flex items-center gap-1 text-xs font-medium no-underline" style={{ color: TXT2 }}>
        <ArrowLeft size={13} /> Compliance Results
      </Link>

      {/* Action bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: TXT2 }}>INSPECTION REPORT</div>
          <h1 className="text-xl font-bold" style={{ color: N }}>Report Preview</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary px-4 py-2 text-sm"
          >
            <FileText size={14} />
            <span>{generating ? "Generating..." : generated ? "Re-generate PDF" : "Generate PDF"}</span>
          </button>
          {generated && (
            <>
              <button
                type="button"
                className="btn-secondary px-4 py-2 text-sm"
              >
                <Download size={14} /> Download
              </button>
              <button
                type="button"
                className="btn-secondary px-4 py-2 text-sm"
              >
                <Printer size={14} /> Print
              </button>
              <button
                type="button"
                className="btn-secondary px-4 py-2 text-sm"
              >
                <Share2 size={14} /> Share
              </button>
            </>
          )}
        </div>
      </div>

      {/* Report document */}
      <div className="max-w-3xl mx-auto solid-card rounded-2xl overflow-hidden shadow-lg">
        {/* Report Header — government document style */}
        <div className="px-8 py-6 border-b" style={{ borderColor: "#E2E8F0", background: N }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/parakh-logo-light.png" alt="PARAKH AI" className="h-7 w-auto object-contain" />
              <div className="pl-3 border-l border-white/20">
                <div className="text-white font-semibold text-sm">Official Inspection Record</div>
                <div className="text-xs" style={{ color: "#7B9CB8" }}>AI-Powered Legal Metrology Platform</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-sm">INSPECTION REPORT</div>
              <div className="text-xs" style={{ color: "#7B9CB8" }}>AI-Assisted — Inspector Verified</div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Inspection Info */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b" style={{ color: TXT2, borderColor: BORDER }}>
              INSPECTION INFORMATION
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {[
                ["Inspection ID", inspection.inspection_id],
                ["Date", inspection.date],
                ["Inspector", mockInspector.name],
                ["Designation", "Sr. Legal Metrology Inspector"],
                ["Location", inspection.location],
                ["Inspection Type", inspection.inspection_type],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: TXT2 }}>{k}</div>
                  <div className="font-medium" style={{ color: TXT }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b" style={{ color: TXT2, borderColor: BORDER }}>
              PRODUCT INFORMATION
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {[
                ["Product Name", inspection.product.name],
                ["Category", inspection.product.category],
                ["Pack Size", inspection.product.pack_size],
                ["Brand", inspection.product.brand || "—"],
                ["MRP", inspection.declarations.mrp?.value || "—"],
                ["Net Quantity", inspection.declarations.net_quantity?.value || "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: TXT2 }}>{k}</div>
                  <div className="font-medium" style={{ color: TXT }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Declarations */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b" style={{ color: TXT2, borderColor: BORDER }}>
              EXTRACTED DECLARATIONS (AI-ASSISTED)
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: BG }}>
                  {["Field", "Extracted Value", "AI Confidence", "Status"].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-semibold" style={{ color: TXT2 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries({
                  "MRP": inspection.declarations.mrp,
                  "Net Quantity": inspection.declarations.net_quantity,
                  "Manufacturer": inspection.declarations.manufacturer,
                  "Batch No.": inspection.declarations.batch,
                  "Date Information": inspection.declarations.date,
                  "Consumer Info": inspection.declarations.consumer_information,
                }).map(([label, decl]) => {
                  const conf = Math.round((decl?.confidence || 0) * 100);
                  const low = conf < 70;
                  return (
                    <tr key={label} className="border-b" style={{ borderColor: "#F0F4F8" }}>
                      <td className="px-3 py-2 text-xs font-semibold" style={{ color: TXT }}>{label}</td>
                      <td className="px-3 py-2 text-xs" style={{ color: low ? "#C62828" : TXT }}>{decl?.value || "Not Detected"}</td>
                      <td className="px-3 py-2 text-xs font-semibold" style={{ color: low ? "#C62828" : "#16803C" }}>{conf}%</td>
                      <td className="px-3 py-2">
                        {low
                          ? <span className="pill-danger text-xs font-bold px-2.5 py-0.5 rounded-full">Needs Review</span>
                          : <span className="pill-success text-xs font-bold px-2.5 py-0.5 rounded-full">Detected</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Findings */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b" style={{ color: TXT2, borderColor: BORDER }}>
              COMPLIANCE FINDINGS
            </div>
              {inspection.findings.length === 0
              ? <div className="text-sm" style={{ color: "#16803C" }}><CheckCircle size={14} className="inline mr-1" />No compliance findings identified.</div>
              : inspection.findings.map((f) => (
                <div key={f.id} className="mb-3 p-4 rounded-xl stat-box-issue">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={13} style={{ color: "#C62828" }} />
                    <span className="text-xs font-bold" style={{ color: "#C62828" }}>FINDING #{f.id} — {f.field_label.toUpperCase()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span style={{ color: TXT2 }}>Status: </span><span className="font-semibold" style={{ color: "#C62828" }}>{f.status.replace("_", " ")}</span></div>
                    <div><span style={{ color: TXT2 }}>Confidence: </span><span className="font-semibold">{Math.round(f.confidence * 100)}%</span></div>
                    <div><span style={{ color: TXT2 }}>Rule: </span><span className="font-mono">{f.rule_reference}</span></div>
                  </div>
                  <p className="text-xs mt-2" style={{ color: TXT2 }}>{f.reason}</p>
                </div>
              ))}
          </div>

          {/* Risk */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b" style={{ color: TXT2, borderColor: BORDER }}>
              RISK ASSESSMENT
            </div>
            <div className="flex items-center gap-4">
              <div className="stat-box-issue rounded-xl px-5 py-3 text-center">
                <div className="font-bold text-2xl" style={{ color: "#C62828" }}>{inspection.risk.score}</div>
                <div className="font-bold text-xs" style={{ color: "#C62828" }}>{inspection.risk.level} RISK</div>
              </div>
              <div className="text-xs leading-relaxed" style={{ color: TXT2 }}>
                Risk score: {inspection.risk.score}/100 ({inspection.risk.level})<br />
                Potential Findings: {inspection.risk.breakdown.potential_findings}<br />
                High Priority Findings: {inspection.risk.breakdown.high_priority_findings}
              </div>
            </div>
          </div>

          {/* Inspector Decision */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b" style={{ color: TXT2, borderColor: BORDER }}>
              INSPECTOR DECISION & VERIFICATION
            </div>
            <div className="p-4 rounded-lg" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
              <div className="flex items-center gap-2 mb-2">
                <Shield size={13} style={{ color: "#C77C02" }} />
                <span className="text-xs font-semibold" style={{ color: "#C77C02" }}>PENDING INSPECTOR VERIFICATION</span>
              </div>
              <p className="text-xs" style={{ color: TXT2 }}>Inspector review and final decision pending. No official action may be taken until the inspector completes verification.</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border" style={{ borderColor: BORDER }}>
                <div className="text-xs font-semibold mb-1" style={{ color: TXT2 }}>Inspector Name</div>
                <div className="text-sm font-medium" style={{ color: TXT }}>{mockInspector.name}</div>
              </div>
              <div className="p-3 rounded-lg border" style={{ borderColor: BORDER }}>
                <div className="text-xs font-semibold mb-1" style={{ color: TXT2 }}>Signature</div>
                <div className="text-sm" style={{ color: "#C0CBD6" }}>— Pending —</div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-lg text-xs leading-relaxed" style={{ background: BG, border: `1px solid ${BORDER}`, color: TXT2 }}>
            <strong style={{ color: TXT }}>Disclaimer: </strong>
            This report is generated with AI assistance. All findings are labeled as potential issues and require inspector verification. PARAKH AI does not make legal determinations. This report is for inspection assistance and record-keeping purposes only.
          </div>
        </div>
      </div>
    </div>
  );
}
