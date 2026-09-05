import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { CheckCircle, Loader2, AlertCircle, ChevronRight, Cpu } from "lucide-react";

const N = "#0A2540";
const B = "#1769E0";
const BG = "#F6F8FB";
const TXT = "#102A43";
const TXT2 = "#52606D";
const BORDER = "#D9E2EC";

const STAGES = [
  { id: "quality", label: "Image Quality Check", duration: 800 },
  { id: "detection", label: "Label Detection", duration: 1200 },
  { id: "ocr", label: "OCR Extraction", duration: 1600 },
  { id: "identification", label: "Field Identification", duration: 1000 },
  { id: "compliance", label: "Compliance Analysis", duration: 1800 },
  { id: "risk", label: "Risk Assessment", duration: 900 },
];

type StageStatus = "pending" | "running" | "done" | "error";

export default function AIAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stages, setStages] = useState<StageStatus[]>(Array(STAGES.length).fill("pending"));
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let elapsed = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    STAGES.forEach((stage, i) => {
      const startAt = elapsed;
      elapsed += stage.duration;
      const endAt = elapsed;

      timeouts.push(
        setTimeout(() => {
          setCurrentIdx(i);
          setStages(prev => prev.map((s, idx) => idx === i ? "running" : s));
        }, startAt + 100)
      );

      timeouts.push(
        setTimeout(() => {
          setStages(prev => prev.map((s, idx) => idx === i ? "done" : s));
          if (i === STAGES.length - 1) {
            setTimeout(() => setComplete(true), 600);
          }
        }, endAt)
      );
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  const progress = stages.filter(s => s === "done").length / STAGES.length;

  return (
    <div className="p-6 md:p-8 flex items-start justify-center" style={{ background: BG, minHeight: "100%" }}>
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl solid-icon-badge badge-blue mx-auto mb-4">
            <Cpu size={26} strokeWidth={2} style={{ color: B }} />
          </div>
          <h1 className="text-lg font-bold mb-1" style={{ color: N }}>Running PARAKH AI Analysis</h1>
          <p className="text-sm" style={{ color: TXT2 }}>Inspection ID: <span className="font-semibold" style={{ color: N }}>{id}</span></p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs mb-2" style={{ color: TXT2 }}>
            <span>Analysis Progress</span>
            <span className="font-semibold" style={{ color: B }}>{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${B}, #00B8D9)` }}
            />
          </div>
        </div>

        {/* Stage List */}
        <div className="rounded-xl overflow-hidden" style={{ background: "white", border: `1px solid ${BORDER}` }}>
          {STAGES.map((stage, i) => {
            const status = stages[i];
            return (
              <div
                key={stage.id}
                className="flex items-center gap-4 px-5 py-4 border-b last:border-0 transition-colors"
                style={{
                  borderColor: "#F0F4F8",
                  background: status === "running" ? "#EBF2FF" : "transparent",
                }}
              >
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  {status === "done" && <CheckCircle size={18} style={{ color: "#16803C" }} />}
                  {status === "running" && <Loader2 size={18} style={{ color: B }} className="animate-spin" />}
                  {status === "pending" && (
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold" style={{ borderColor: BORDER, color: TXT2 }}>
                      {i + 1}
                    </div>
                  )}
                  {status === "error" && <AlertCircle size={18} style={{ color: "#C62828" }} />}
                </div>

                <span
                  className="text-sm font-medium flex-1"
                  style={{
                    color: status === "done" ? TXT2 : status === "running" ? B : "#C0CBD6",
                  }}
                >
                  {stage.label}
                </span>

                <span className="text-xs font-medium">
                  {status === "done" && <span style={{ color: "#16803C" }}>✓ Complete</span>}
                  {status === "running" && <span style={{ color: B }}>Processing...</span>}
                  {status === "pending" && <span style={{ color: "#C0CBD6" }}>Queued</span>}
                </span>
              </div>
            );
          })}
        </div>

        {/* AI Note */}
        <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: "#FEF9EC", border: "1px solid #FDE68A", color: TXT2 }}>
          <strong style={{ color: "#C77C02" }}>Analysis Note: </strong>
          AI results are decision-support indicators. All findings require inspector review and verification.
        </div>

        {/* Complete action */}
        {complete && (
          <div className="mt-6 animate-fade-in">
            <div className="rounded-xl p-5 mb-4 text-center" style={{ background: "#DCFCE7", border: "1px solid #86EFAC" }}>
              <CheckCircle size={22} style={{ color: "#16803C", margin: "0 auto 8px" }} />
              <div className="font-semibold text-sm mb-0.5" style={{ color: "#15803D" }}>Analysis Complete</div>
              <div className="text-xs" style={{ color: "#22c55e" }}>2 potential findings identified — Inspector review required</div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Confidence", val: "94%", color: "#16803C" },
                { label: "Findings", val: "02", color: "#C62828" },
                { label: "Risk Level", val: "HIGH", color: "#C62828" },
              ].map(({ label, val, color }) => (
                <div key={label} className="rounded-lg p-3 text-center" style={{ background: "white", border: `1px solid ${BORDER}` }}>
                  <div className="font-bold text-lg" style={{ color }}>{val}</div>
                  <div className="text-xs" style={{ color: TXT2 }}>{label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate(`/app/compliance/${id}`)}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: B }}
            >
              Review Compliance Findings <ChevronRight size={16} />
            </button>
          </div>
        )}

        {!complete && (
          <div className="mt-6 text-center text-xs" style={{ color: TXT2 }}>
            Analysis in progress — please wait...
          </div>
        )}
      </div>
    </div>
  );
}
