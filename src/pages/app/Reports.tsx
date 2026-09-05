import { useState } from "react";
import { Link } from "react-router";
import { FileText, Download, Printer, Eye, Filter } from "lucide-react";
import { mockInspections } from "../../mock/data";

const N = "#0A2540";
const B = "#1769E0";
const BG = "#F6F8FB";
const TXT = "#102A43";
const TXT2 = "#52606D";
const BORDER = "#D9E2EC";

const REPORT_TYPES = [
  { id: "inspection", label: "Inspection Reports", desc: "Individual inspection records with findings and decisions", count: 24 },
  { id: "daily", label: "Daily Reports", desc: "Aggregated daily inspection summary", count: 7 },
  { id: "weekly", label: "Weekly Reports", desc: "Weekly trend analysis and statistics", count: 4 },
  { id: "risk", label: "Risk Reports", desc: "High-risk inspection flagging and prioritization", count: 3 },
  { id: "finding", label: "Finding Reports", desc: "Category-wise compliance findings breakdown", count: 8 },
];

export default function Reports() {
  const [activeType, setActiveType] = useState("inspection");

  return (
    <div className="p-6 md:p-8 space-y-6" style={{ background: BG, minHeight: "100%" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold mb-1" style={{ color: N }}>Reports Center</h1>
          <p className="text-sm" style={{ color: TXT2 }}>Inspection reports, daily summaries, risk analysis and findings</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Report type selector */}
        <div className="md:col-span-1">
          <div className="solid-card rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b text-xs font-bold uppercase tracking-wider" style={{ borderColor: "#E2E8F0", color: TXT2, background: "#F8FAFC" }}>
              REPORT TYPES
            </div>
            {REPORT_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className="w-full px-4 py-3 border-b text-left transition-colors hover:bg-blue-50 last:border-0"
                style={{
                  borderColor: "#F0F4F8",
                  background: activeType === type.id ? "#EFF6FF" : "white",
                }}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold" style={{ color: activeType === type.id ? B : TXT }}>
                    {type.label}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeType === type.id ? "pill-blue" : "solid-tag"}`}>
                    {type.count}
                  </span>
                </div>
                <div className="text-xs" style={{ color: TXT2 }}>{type.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Report list */}
        <div className="md:col-span-3 space-y-4">
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "Date Range", opts: ["All Dates", "Today", "This Week", "This Month"] },
              { label: "Category", opts: ["All Categories", "Packaged Food", "Edible Oil"] },
              { label: "Risk", opts: ["All Risk", "High", "Medium", "Low"] },
              { label: "Status", opts: ["All Status", "Completed", "Needs Review"] },
            ].map(({ label, opts }) => (
              <select key={label} className="text-xs px-3 py-2 rounded-lg border outline-none" style={{ borderColor: BORDER, color: TXT2, background: "white" }}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            ))}
          </div>

          {/* Report entries */}
          <div className="space-y-3">
            {mockInspections.map((ins) => (
              <div key={ins.inspection_id} className="solid-card rounded-2xl p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 solid-icon-badge badge-blue flex-shrink-0">
                    <FileText size={18} strokeWidth={2} style={{ color: B }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold" style={{ color: TXT }}>{ins.product.name}</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${ins.risk.level === "HIGH" ? "pill-high" : ins.risk.level === "MEDIUM" ? "pill-medium" : "pill-low"}`}>
                        {ins.risk.level}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: TXT2 }}>
                      {ins.inspection_id} · {ins.product.category} · {ins.date}
                    </div>
                    <div className="text-xs mt-1" style={{ color: ins.findings.length > 0 ? "#C62828" : "#16803C" }}>
                      {ins.findings.length > 0 ? `${ins.findings.length} finding(s)` : "No findings"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/app/report/${ins.inspection_id}`}
                    className="p-1.5 rounded border no-underline transition-colors hover:bg-blue-50"
                    style={{ borderColor: BORDER, color: B }}
                    title="View Report"
                  >
                    <Eye size={13} />
                  </Link>
                  <button className="p-1.5 rounded border transition-colors hover:bg-gray-50" style={{ borderColor: BORDER, color: TXT2 }} title="Download">
                    <Download size={13} />
                  </button>
                  <button className="p-1.5 rounded border transition-colors hover:bg-gray-50" style={{ borderColor: BORDER, color: TXT2 }} title="Print">
                    <Printer size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
