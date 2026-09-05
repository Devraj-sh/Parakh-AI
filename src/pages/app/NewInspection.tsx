import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Upload, Camera, CheckCircle, ChevronRight, ChevronLeft, AlertCircle, ImagePlus, X } from "lucide-react";

const N = "#0A2540";
const B = "#1769E0";
const BG = "#F6F8FB";
const TXT = "#102A43";
const TXT2 = "#52606D";
const BORDER = "#D9E2EC";

const STEPS = ["Inspection Details", "Capture Product", "Run Analysis"];

const CATEGORIES = ["Packaged Food", "Edible Oil", "Packaged Salt", "Health Drink", "Beverages", "Personal Care", "Household Products", "Other"];
const INS_TYPES = ["Routine Market Inspection", "Complaint-Based", "Special Drive", "Follow-up Inspection"];
const REGIONS = ["Delhi NCR", "South Delhi", "North Delhi", "West Delhi", "East Delhi", "Noida", "Gurugram", "Faridabad"];
const SIDES = ["Front", "Back", "Side A", "Side B", "Top", "Bottom"];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
              style={{
                background: i < current ? "#16803C" : i === current ? B : "#E2E8F0",
                color: i <= current ? "white" : TXT2,
              }}
            >
              {i < current ? <CheckCircle size={13} /> : i + 1}
            </div>
            <span className="hidden md:block text-xs font-medium" style={{ color: i === current ? TXT : TXT2 }}>
              {label}
            </span>
          </div>
          {i < total - 1 && (
            <div className="w-8 md:w-16 h-px mx-1" style={{ background: i < current ? "#16803C" : BORDER }} />
          )}
        </div>
      ))}
    </div>
  );
}

function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: TXT }}>
        {label} {required && <span style={{ color: "#C62828" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all font-medium";
const inputStyle = { borderColor: "#CBD5E1", color: TXT, background: "white", boxShadow: "inset 0 1px 2px rgba(10, 37, 64, 0.04), 0 1px 0 #FFFFFF" };
const focusStyle = { borderColor: B };

export default function NewInspection() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [images, setImages] = useState<{ side: string; url: string }[]>([]);
  const [selectedSide, setSelectedSide] = useState("Front");
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    location: "Delhi NCR",
    category: "Packaged Food",
    type: "Routine Market Inspection",
    notes: "",
  });

  const inspectionId = "INS-10025";

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImages(prev => [...prev.filter(i => i.side !== selectedSide), { side: selectedSide, url }]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleAnalyze = () => {
    navigate(`/app/analysis/${inspectionId}`);
  };

  const Step0 = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <FormField label="Inspection ID">
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border text-sm font-medium" style={{ borderColor: "#CBD5E1", background: "#F1F5F9", color: TXT2, boxShadow: "inset 0 1px 2px rgba(10, 37, 64, 0.03)" }}>
            <span className="font-semibold text-slate-800">{inspectionId}</span>
            <span className="text-xs ml-auto font-medium text-slate-500">Auto-generated</span>
          </div>
        </FormField>
        <FormField label="Inspection Date">
          <input
            type="text"
            defaultValue="05 Sep 2026"
            readOnly
            className={inputClass}
            style={{ ...inputStyle, background: "#F1F5F9", color: "#475569" }}
          />
        </FormField>
        <FormField label="Inspection Type" required>
          <select
            value={form.type}
            onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
            className={inputClass}
            style={inputStyle}
            onFocus={e => Object.assign(e.target.style, focusStyle)}
            onBlur={e => (e.target.style.borderColor = BORDER)}
          >
            {INS_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Region / Location" required>
          <select
            value={form.location}
            onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
            className={inputClass}
            style={inputStyle}
            onFocus={e => Object.assign(e.target.style, focusStyle)}
            onBlur={e => (e.target.style.borderColor = BORDER)}
          >
            {REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </FormField>
        <FormField label="Product Category" required>
          <select
            value={form.category}
            onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            className={inputClass}
            style={inputStyle}
            onFocus={e => Object.assign(e.target.style, focusStyle)}
            onBlur={e => (e.target.style.borderColor = BORDER)}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </FormField>
        <FormField label="Market / Establishment">
          <input
            type="text"
            placeholder="e.g. Sector 18 Market, Noida"
            className={inputClass}
            style={inputStyle}
            onFocus={e => Object.assign(e.target.style, focusStyle)}
            onBlur={e => (e.target.style.borderColor = BORDER)}
          />
        </FormField>
      </div>
      <FormField label="Preliminary Notes">
        <textarea
          value={form.notes}
          onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
          placeholder="Any preliminary observations or context for this inspection..."
          rows={3}
          className={inputClass}
          style={inputStyle}
          onFocus={e => Object.assign(e.target.style, focusStyle)}
          onBlur={e => (e.target.style.borderColor = BORDER)}
        />
      </FormField>
    </div>
  );

  const Step1 = () => (
    <div className="space-y-6">
      <div className="rounded-xl p-4" style={{ background: "#EBF2FF", border: "1px solid #C7DCFF" }}>
        <div className="flex items-center gap-2 text-sm font-medium" style={{ color: B }}>
          <AlertCircle size={14} />
          Capture all relevant sides of the package for best AI analysis results.
        </div>
      </div>

      {/* Side selector */}
      <div>
        <label className="block text-xs font-semibold mb-2" style={{ color: TXT }}>Select Package Side</label>
        <div className="flex flex-wrap gap-2">
          {SIDES.map(side => (
            <button
              key={side}
              onClick={() => setSelectedSide(side)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
              style={{
                background: selectedSide === side ? B : "white",
                color: selectedSide === side ? "white" : TXT2,
                borderColor: selectedSide === side ? B : BORDER,
              }}
            >
              {side}
              {images.find(i => i.side === side) && (
                <span className="ml-1.5 w-1.5 h-1.5 rounded-full inline-block" style={{ background: selectedSide === side ? "rgba(255,255,255,0.7)" : "#16803C" }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Upload area */}
      <div
        onClick={() => fileRef.current?.click()}
        className="rounded-xl border-2 border-dashed p-10 flex flex-col items-center gap-3 cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50/30"
        style={{ borderColor: BORDER }}
      >
        <div className="w-12 h-12 solid-icon-badge badge-blue">
          <Upload size={22} strokeWidth={2} style={{ color: B }} />
        </div>
        <div className="text-sm font-semibold" style={{ color: TXT }}>Upload or drag {selectedSide} view</div>
        <div className="text-xs" style={{ color: TXT2 }}>JPG, PNG up to 10MB — or use camera below</div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageAdd} />
      </div>

      {/* Camera button */}
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full py-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:bg-gray-50"
        style={{ borderColor: BORDER, color: TXT2 }}
      >
        <Camera size={16} /> Use Camera
      </button>

      {/* Captured thumbnails */}
      {images.length > 0 && (
        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: TXT }}>Captured Images ({images.length})</div>
          <div className="flex flex-wrap gap-3">
            {images.map(img => (
              <div key={img.side} className="relative">
                <div className="w-20 h-20 rounded-lg overflow-hidden border" style={{ borderColor: BORDER }}>
                  <img src={img.url} alt={img.side} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 left-0 right-0 text-center text-xs font-semibold px-1 py-0.5 rounded" style={{ background: N, color: "white", fontSize: "9px" }}>
                  {img.side}
                </div>
                <button
                  onClick={() => setImages(prev => prev.filter(i => i.side !== img.side))}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: "#C62828", color: "white" }}
                >
                  <X size={9} />
                </button>
              </div>
            ))}
            <div
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
              style={{ borderColor: BORDER }}
            >
              <ImagePlus size={18} style={{ color: TXT2 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6">
      <div className="rounded-xl p-4" style={{ background: BG, border: `1px solid ${BORDER}` }}>
        <div className="text-xs font-semibold mb-3" style={{ color: TXT2 }}>INSPECTION SUMMARY</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {[
            ["Inspection ID", inspectionId],
            ["Category", form.category],
            ["Type", form.type],
            ["Location", form.location],
            ["Images", `${images.length} captured`],
            ["Date", "05 Sep 2026"],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ color: TXT2 }}>{k}</div>
              <div className="font-semibold" style={{ color: TXT }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold mb-3" style={{ color: TXT }}>PARAKH AI Analysis Pipeline</div>
        <div className="space-y-2">
          {[
            "Image Quality Check",
            "Label Detection",
            "OCR Extraction",
            "Declaration Identification",
            "Compliance Analysis",
            "Risk Assessment",
          ].map((stage, i) => (
            <div key={stage} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "white", border: `1px solid ${BORDER}` }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#EBF2FF", color: B }}>
                {i + 1}
              </div>
              <span className="text-sm" style={{ color: TXT }}>{stage}</span>
              <div className="ml-auto text-xs" style={{ color: TXT2 }}>Queued</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "#EBF2FF", border: "1px solid #C7DCFF" }}>
        <div className="text-xs font-medium" style={{ color: B }}>
          AI analysis results are decision-support indicators. All findings require inspector review and verification before any official action.
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8" style={{ background: BG, minHeight: "100%" }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-lg font-bold mb-1" style={{ color: N }}>New Inspection</h1>
          <p className="text-sm" style={{ color: TXT2 }}>Inspection ID: <span className="font-semibold" style={{ color: N }}>{inspectionId}</span></p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator current={step} total={3} />
        </div>

        {/* Card */}
        <div className="solid-card rounded-2xl p-6 md:p-8">
          <div className="mb-6 pb-4 border-b" style={{ borderColor: "#E2E8F0" }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: TXT2 }}>
              STEP {step + 1} OF {STEPS.length}
            </div>
            <h2 className="font-semibold text-base" style={{ color: N }}>{STEPS[step]}</h2>
          </div>

          {step === 0 && <Step0 />}
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: BORDER }}>
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="btn-secondary px-4 py-2 text-sm"
            >
              <ChevronLeft size={15} /> Previous
            </button>

            {step < 2 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="btn-primary px-6 py-2.5 text-sm"
              >
                <span>Continue</span>
                <ChevronRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAnalyze}
                className="btn-primary px-6 py-2.5 text-sm"
              >
                <span>Run PARAKH AI Analysis</span>
                <ChevronRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
