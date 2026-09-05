import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Search, Filter, Eye, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { mockInspections } from "../../mock/data";
import type { RiskLevel, InspectionStatus } from "../../types";

const N = "#0A2540";
const B = "#1769E0";
const BG = "#F6F8FB";
const TXT = "#102A43";
const TXT2 = "#52606D";
const BORDER = "#D9E2EC";

function RiskBadge({ level }: { level: RiskLevel }) {
  const map: Record<RiskLevel, string> = { HIGH: "pill-high", MEDIUM: "pill-medium", LOW: "pill-low" };
  return <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${map[level]}`}>{level}</span>;
}

function StatusBadge({ status }: { status: InspectionStatus }) {
  const map: Record<InspectionStatus, [string, string]> = {
    NEEDS_REVIEW: ["pill-medium", "Needs Review"],
    COMPLETED: ["pill-low", "Completed"],
    PENDING: ["pill-blue", "Pending"],
    IN_PROGRESS: ["pill-cyan", "In Progress"],
    FAILED: ["pill-high", "Failed"],
  };
  const [pillClass, label] = map[status];
  return <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${pillClass}`}>{label}</span>;
}

const SEL_CLASS = "text-xs px-3 py-2 rounded-lg border outline-none";
const SEL_STYLE = { borderColor: BORDER, color: TXT2, background: "white" };

export default function InspectionHistory() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");

  const filtered = useMemo(() => mockInspections.filter(ins => {
    if (search && !ins.inspection_id.toLowerCase().includes(search.toLowerCase()) && !ins.product.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (riskFilter !== "ALL" && ins.risk.level !== riskFilter) return false;
    if (statusFilter !== "ALL" && ins.status !== statusFilter) return false;
    return true;
  }), [search, riskFilter, statusFilter]);

  return (
    <div className="p-6 md:p-8 space-y-6" style={{ background: BG, minHeight: "100%" }}>
      <div>
        <h1 className="text-xl font-bold mb-1" style={{ color: N }}>Inspection History</h1>
        <p className="text-sm" style={{ color: TXT2 }}>Complete record of all inspections — searchable and filterable</p>
      </div>

      {/* Filters */}
      <div className="solid-card rounded-2xl p-4 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9CAAB5" }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search inspection ID, product name..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none"
            style={{ borderColor: BORDER, color: TXT }}
            onFocus={e => (e.target.style.borderColor = B)}
            onBlur={e => (e.target.style.borderColor = BORDER)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className={SEL_CLASS} style={SEL_STYLE}>
            <option value="ALL">All Risks</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={SEL_CLASS} style={SEL_STYLE}>
            <option value="ALL">All Status</option>
            <option value="NEEDS_REVIEW">Needs Review</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
          </select>
          <select className={SEL_CLASS} style={SEL_STYLE}>
            <option>All Dates</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <select className={SEL_CLASS} style={SEL_STYLE}>
            <option>All Categories</option>
            <option>Packaged Food</option>
            <option>Edible Oil</option>
            <option>Health Drink</option>
          </select>
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium" style={{ color: TXT2 }}>
          Showing <span className="font-bold" style={{ color: TXT }}>{filtered.length}</span> inspections
        </p>
        <div className="text-xs" style={{ color: TXT2 }}>Sorted by: Date (newest first)</div>
      </div>

      {/* Table */}
      <div className="solid-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}>
                {["Inspection ID", "Product", "Category", "Date", "Risk", "Findings", "Status", "Inspector", "Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: TXT2 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm" style={{ color: TXT2 }}>
                    No inspections match your filters.
                  </td>
                </tr>
              ) : filtered.map((ins) => (
                <tr key={ins.inspection_id} className="border-b hover:bg-blue-50/30 transition-colors" style={{ borderColor: "#F0F4F8" }}>
                  <td className="px-4 py-3 font-semibold text-xs" style={{ color: B }}>{ins.inspection_id}</td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: TXT }}>{ins.product.name}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: TXT2 }}>{ins.product.category}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: TXT2 }}>{ins.date}</td>
                  <td className="px-4 py-3"><RiskBadge level={ins.risk.level} /></td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: ins.findings.length > 0 ? "#C62828" : "#16803C" }}>
                    {ins.findings.length > 0 ? `${ins.findings.length} Finding(s)` : "None"}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={ins.status} /></td>
                  <td className="px-4 py-3 text-xs" style={{ color: TXT2 }}>{ins.inspector}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/app/compliance/${ins.inspection_id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium no-underline px-2.5 py-1 rounded border hover:bg-blue-50 transition-colors"
                      style={{ color: B, borderColor: "#C7DCFF" }}
                    >
                      <Eye size={11} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: BORDER }}>
          <span className="text-xs" style={{ color: TXT2 }}>Page 1 of 1</span>
          <div className="flex items-center gap-1">
            <button disabled className="p-1.5 rounded border disabled:opacity-40" style={{ borderColor: BORDER, color: TXT2 }}>
              <ChevronLeft size={13} />
            </button>
            <span className="px-2.5 py-1 rounded text-xs font-semibold" style={{ background: B, color: "white" }}>1</span>
            <button disabled className="p-1.5 rounded border disabled:opacity-40" style={{ borderColor: BORDER, color: TXT2 }}>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
