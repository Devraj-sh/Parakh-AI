import { useState } from "react";
import { useParams, Link, useSearchParams } from "react-router";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react";
import { demoInspection } from "../../mock/data";

const N = "#0A2540";
const B = "#1769E0";
const BG = "#F6F8FB";
const TXT = "#102A43";
const TXT2 = "#52606D";
const BORDER = "#D9E2EC";

export default function EvidenceLens() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const activeFindingId = searchParams.get("finding") || "F001";
  const [zoom, setZoom] = useState(1);
  const [selectedFinding, setSelectedFinding] = useState(activeFindingId);

  const inspection = demoInspection;
  const findings = inspection.findings;
  const activeFinding = findings.find(f => f.id === selectedFinding) || findings[0];

  return (
    <div className="p-6 md:p-8 space-y-6" style={{ background: BG, minHeight: "100%" }}>
      {/* Back */}
      <Link to={`/app/compliance/${id}`} className="inline-flex items-center gap-1 text-xs font-medium no-underline" style={{ color: TXT2 }}>
        <ArrowLeft size={13} /> Compliance Results
      </Link>

      {/* Header */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: TXT2 }}>EVIDENCE LENS</div>
        <h1 className="text-xl font-bold" style={{ color: N }}>Visual Evidence Review</h1>
        <p className="text-sm mt-0.5" style={{ color: TXT2 }}>{id} · {inspection.product.name}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Evidence Viewer */}
        <div className="md:col-span-2">
          <div className="rounded-xl overflow-hidden" style={{ background: "white", border: `1px solid ${BORDER}` }}>
            {/* Toolbar */}
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: BORDER, background: BG }}>
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: TXT }}>
                Evidence Region — {activeFinding?.field_label}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="p-1.5 rounded hover:bg-gray-100 transition-colors" style={{ color: TXT2 }}>
                  <ZoomOut size={14} />
                </button>
                <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: "#EBF2FF", color: B }}>
                  {Math.round(zoom * 100)}%
                </span>
                <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} className="p-1.5 rounded hover:bg-gray-100 transition-colors" style={{ color: TXT2 }}>
                  <ZoomIn size={14} />
                </button>
                <button onClick={() => setZoom(1)} className="p-1.5 rounded hover:bg-gray-100 transition-colors" style={{ color: TXT2 }}>
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Image canvas */}
            <div className="overflow-hidden relative" style={{ minHeight: "380px", background: "#0F1923" }}>
              <div
                className="transition-transform duration-200 ease-out"
                style={{ transform: `scale(${zoom})`, transformOrigin: "center center", position: "relative" }}
              >
                {/* Simulated package image */}
                <div className="relative mx-auto" style={{ width: "340px", margin: "40px auto" }}>
                  {/* Package representation */}
                  <div
                    className="rounded-lg overflow-hidden relative"
                    style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", padding: "24px", minHeight: "280px" }}
                  >
                    {/* Package content */}
                    <div className="text-white font-bold text-xl mb-1">PARLE-G</div>
                    <div className="text-orange-100 text-sm mb-4">GOLD BISCUITS</div>
                    <div className="space-y-2 text-xs text-orange-100">
                      <div>Net Qty: 800 g</div>
                      <div>MRP: ₹50 (Incl. of all taxes)</div>
                      <div>Mfr: Parle Products Pvt. Ltd., Mumbai - 400 001</div>
                      <div>Batch: B24SEP-009</div>
                      <div>MFG: 09/2024 | BEST BEFORE: 09/2025</div>
                      <div className="mt-6 text-orange-300 italic text-xs">[Consumer Information Field]</div>
                    </div>

                    {/* Detected regions overlay */}
                    {/* MRP */}
                    <div className="absolute" style={{ top: "28px", right: "24px", border: "2px solid #00B8D9", borderRadius: "4px", padding: "2px 6px" }}>
                      <div className="text-white font-bold text-sm">₹50</div>
                      <div className="absolute -top-3 left-0 text-white text-xs px-1 rounded font-bold" style={{ background: "#00B8D9", fontSize: "9px" }}>MRP · 96%</div>
                    </div>

                    {/* Net Qty */}
                    <div className="absolute" style={{ top: "78px", left: "24px", border: "2px solid #1769E0", borderRadius: "4px", padding: "1px 4px" }}>
                      <div className="text-white text-xs">800 g</div>
                      <div className="absolute -top-3 left-0 text-white text-xs px-1 rounded font-bold" style={{ background: "#1769E0", fontSize: "9px" }}>NET QTY · 98%</div>
                    </div>

                    {/* Evidence highlight for active finding */}
                    {activeFinding && (
                      <div
                        className="absolute"
                        style={{
                          bottom: "48px",
                          left: "24px",
                          right: "24px",
                          border: "2px dashed #C62828",
                          borderRadius: "4px",
                          background: "rgba(198,40,40,0.15)",
                          padding: "8px",
                          animation: "pulse 2s infinite",
                        }}
                      >
                        <div className="text-orange-200 text-xs italic">[Consumer Information — Not Detected]</div>
                        <div className="absolute -top-3.5 left-2 text-white text-xs px-1.5 py-0.5 rounded font-bold flex items-center gap-1" style={{ background: "#C62828", fontSize: "9px" }}>
                          ⚠ {activeFinding.field_label} · {Math.round(activeFinding.confidence * 100)}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Finding selector */}
          <div className="rounded-xl overflow-hidden" style={{ background: "white", border: `1px solid ${BORDER}` }}>
            <div className="px-4 py-3 border-b text-xs font-semibold" style={{ borderColor: BORDER, color: TXT2, background: BG }}>
              FINDINGS ({findings.length})
            </div>
            {findings.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFinding(f.id)}
                className="w-full px-4 py-3 border-b text-left transition-colors hover:bg-blue-50 last:border-0"
                style={{
                  borderColor: "#F0F4F8",
                  background: selectedFinding === f.id ? "#EBF2FF" : "white",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={12} style={{ color: "#C62828" }} />
                  <span className="text-xs font-semibold" style={{ color: selectedFinding === f.id ? B : TXT }}>
                    Finding #{f.id}
                  </span>
                </div>
                <div className="text-xs" style={{ color: TXT2 }}>{f.field_label}</div>
                <div className="text-xs mt-1 font-semibold" style={{ color: "#C62828" }}>
                  {Math.round(f.confidence * 100)}% confidence
                </div>
              </button>
            ))}
          </div>

          {/* Active finding detail */}
          {activeFinding && (
            <div className="rounded-xl p-4 space-y-4" style={{ background: "white", border: `1px solid ${BORDER}` }}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-bold uppercase tracking-wide" style={{ color: TXT2 }}>FINDING DETAIL</div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#FEE2E2", color: "#C62828" }}>
                    {activeFinding.status.replace("_", " ")}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="font-semibold mb-0.5" style={{ color: TXT2 }}>Field</div>
                    <div className="font-bold" style={{ color: TXT }}>{activeFinding.field_label}</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-0.5" style={{ color: TXT2 }}>Confidence</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
                        <div style={{ width: `${Math.round(activeFinding.confidence * 100)}%`, height: "100%", background: "#C62828", borderRadius: "999px" }} />
                      </div>
                      <span className="font-bold" style={{ color: "#C62828" }}>{Math.round(activeFinding.confidence * 100)}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-0.5" style={{ color: TXT2 }}>Rule Reference</div>
                    <span className="font-mono px-1.5 py-0.5 rounded text-xs" style={{ background: "#EBF2FF", color: B }}>
                      {activeFinding.rule_reference}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold mb-1" style={{ color: TXT2 }}>Reason</div>
                    <p className="leading-relaxed" style={{ color: TXT2 }}>{activeFinding.reason}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t flex flex-col gap-2" style={{ borderColor: BORDER }}>
                <Link
                  to={`/app/review/${id}`}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-semibold no-underline transition-opacity hover:opacity-90"
                  style={{ background: B }}
                >
                  <CheckCircle size={12} /> Inspector Review
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
