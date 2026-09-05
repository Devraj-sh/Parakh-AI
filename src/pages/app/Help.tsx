import { useState } from "react";
import { HelpCircle, Search, ChevronDown, MessageSquare, FileText, Phone } from "lucide-react";
import { getSolidIconBadgeProps } from "../../utils/iconBadge";

const N = "#0A2540";
const B = "#1769E0";
const BG = "#F6F8FB";
const TXT = "#102A43";
const TXT2 = "#52606D";
const BORDER = "#D9E2EC";

const FAQS = [
  { q: "How do I start a new inspection?", a: "Click 'New Inspection' in the sidebar or the button on your dashboard. You'll be guided through a 3-step workflow: enter inspection details, upload package images, then run AI analysis." },
  { q: "What image quality is required for best AI results?", a: "Capture clear, well-lit images of the package label. Ensure all text is visible and the image is in focus. The system will check image quality before running analysis and alert you if the image is unsuitable." },
  { q: "What do AI confidence scores mean?", a: "Confidence scores (0–100%) indicate how certain the AI is about a detected value. Scores below 70% trigger a 'Needs Review' flag and require inspector verification before any action is taken." },
  { q: "Can I accept AI findings without reviewing them?", a: "No. PARAKH AI requires inspector review for all findings before any official action. The system is designed as a decision-support tool — the inspector makes the final determination." },
  { q: "How are risk scores calculated?", a: "Risk scores are calculated from the number and severity of potential findings, low-confidence fields, and rule priorities. The methodology is configurable and scores are decision-support indicators, not legal determinations." },
  { q: "How do I generate and download inspection reports?", a: "Navigate to the Compliance Results or Inspector Review page and click 'Generate Report'. Once generated, you can download as PDF, print, or share." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: BORDER }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left gap-4">
        <span className="text-sm font-medium" style={{ color: TXT }}>{q}</span>
        <ChevronDown size={15} style={{ color: TXT2, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
      </button>
      {open && <p className="pb-4 text-sm leading-relaxed" style={{ color: TXT2 }}>{a}</p>}
    </div>
  );
}

export default function Help() {
  const [search, setSearch] = useState("");
  const filtered = FAQS.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 md:p-8 space-y-6" style={{ background: BG, minHeight: "100%" }}>
      <div>
        <h1 className="text-xl font-bold mb-1" style={{ color: N }}>Help & Support</h1>
        <p className="text-sm" style={{ color: TXT2 }}>Guidance, FAQ, and inspector support resources</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#9CAAB5" }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search help topics..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm"
          style={{ borderColor: BORDER, background: "white", color: TXT }}
          onFocus={e => (e.target.style.borderColor = B)}
          onBlur={e => (e.target.style.borderColor = BORDER)}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* FAQ */}
        <div className="md:col-span-2 rounded-xl p-6" style={{ background: "white", border: `1px solid ${BORDER}` }}>
          <h2 className="font-semibold text-sm mb-5" style={{ color: N }}>Frequently Asked Questions</h2>
          {filtered.length === 0
            ? <p className="text-sm" style={{ color: TXT2 }}>No results for "{search}"</p>
            : filtered.map(f => <FAQItem key={f.q} {...f} />)}
        </div>

        {/* Contact */}
        <div className="space-y-4">
          {[
            { icon: MessageSquare, title: "Technical Support", desc: "Contact system administrator for technical issues.", action: "Send Message", color: B },
            { icon: Phone, title: "Help Desk", desc: "Call the Legal Metrology department help desk during working hours.", action: "1800-XXX-XXXX", color: "#16803C" },
            { icon: FileText, title: "Inspector Manual", desc: "Download the complete PARAKH AI inspector user guide.", action: "Download PDF", color: "#7B3FE4" },
          ].map(({ icon: Icon, title, desc, action, color }) => {
            const badge = getSolidIconBadgeProps(color);
            return (
              <div key={title} className="rounded-xl p-4" style={{ background: "white", border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-8 h-8 solid-icon-badge ${badge.className}`}>
                    <Icon size={15} strokeWidth={2} style={{ color: badge.text }} />
                  </div>
                  <span className="font-semibold text-sm" style={{ color: TXT }}>{title}</span>
                </div>
                <p className="text-xs mb-3" style={{ color: TXT2 }}>{desc}</p>
                <button className="text-xs font-semibold hover:underline cursor-pointer" style={{ color: badge.text }}>{action} →</button>
              </div>
            );
          })}

          <div className="solid-dark-box p-4">
            <div className="text-xs font-bold mb-1.5 tracking-wider" style={{ color: "#38BDF8" }}>DISCLAIMER</div>
            <p className="text-xs leading-relaxed" style={{ color: "#93ADC8" }}>
              PARAKH AI is a decision-support platform. AI findings require inspector verification. For official legal metrology guidance, refer to the applicable statutes and department circulars.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
