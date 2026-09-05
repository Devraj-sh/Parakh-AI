import { Link } from "react-router";
import { Clock, CheckCircle, AlertTriangle, BarChart3, ChevronRight, Eye, Plus, TrendingUp } from "lucide-react";
import { mockInspections, mockDashboardStats, mockInspector } from "../../mock/data";
import type { RiskLevel, InspectionStatus } from "../../types";
import { getSolidIconBadgeProps } from "../../utils/iconBadge";

const N = "#0A2540";
const B = "#1769E0";
const BG = "#F6F8FB";
const TXT = "#102A43";
const TXT2 = "#52606D";
const BORDER = "#D9E2EC";

function RiskBadge({ level }: { level: RiskLevel }) {
  const map: Record<RiskLevel, string> = {
    HIGH: "pill-high",
    MEDIUM: "pill-medium",
    LOW: "pill-low",
  };
  return (
    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${map[level]}`}>
      {level}
    </span>
  );
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
  return (
    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${pillClass}`}>
      {label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, href }: { icon: any; label: string; value: number; sub?: string; color: string; href?: string }) {
  const badge = getSolidIconBadgeProps(color);
  const content = (
    <div className="p-5 rounded-xl p-card-hover" style={{ background: "white", border: `1px solid ${BORDER}` }}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 solid-icon-badge ${badge.className}`}>
          <Icon size={17} strokeWidth={2} style={{ color: badge.text }} />
        </div>
        {href && <ChevronRight size={14} style={{ color: "#C0CBD6" }} />}
      </div>
      <div className="font-bold text-2xl mb-0.5" style={{ color: TXT }}>{value}</div>
      <div className="text-xs font-medium" style={{ color: TXT2 }}>{label}</div>
      {sub && <div className="text-xs mt-1" style={{ color: "#9CAAB5" }}>{sub}</div>}
    </div>
  );
  return href ? <Link to={href} className="no-underline">{content}</Link> : content;
}

export default function Dashboard() {
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="p-6 md:p-8 space-y-8" style={{ background: BG, minHeight: "100%" }}>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm mb-0.5" style={{ color: TXT2 }}>{today}</p>
          <h1 className="text-xl font-bold" style={{ color: N }}>Good morning, Inspector {mockInspector.name.split(" ")[0]}</h1>
          <p className="text-sm mt-0.5" style={{ color: TXT2 }}>Your inspection overview — {mockInspector.location}</p>
        </div>
        <Link
          to="/app/new-inspection"
          className="btn-primary px-5 py-2.5 self-start"
        >
          <Plus size={16} /> New Inspection
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={BarChart3} label="Today's Inspections" value={mockDashboardStats.today_inspections} color={B} href="/app/history" />
        <StatCard icon={Clock} label="Pending Review" value={mockDashboardStats.pending_review} sub="Require attention" color="#C77C02" href="/app/history?status=pending" />
        <StatCard icon={AlertTriangle} label="High Risk" value={mockDashboardStats.high_risk} sub="Immediate review" color="#C62828" href="/app/history?risk=HIGH" />
        <StatCard icon={CheckCircle} label="Completed" value={mockDashboardStats.completed} sub="Today" color="#16803C" href="/app/history?status=completed" />
      </div>

      {/* Demo Inspection Banner */}
      <div className="solid-dark-box rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00B8D9" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#00B8D9" }}>Demo Mode — SIH 2026</span>
          </div>
          <div className="text-white font-semibold text-sm mb-1">Inspection INS-10024 — Parle-G Gold Biscuits</div>
          <div className="text-xs" style={{ color: "#7B9CB8" }}>
            HIGH RISK · 2 Potential Findings · Consumer Information Needs Review
          </div>
        </div>
        <Link
          to="/app/compliance/INS-10024"
          className="btn-primary px-4 py-2 text-xs flex-shrink-0"
        >
          <span>Open Demo Inspection</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Priority Queue */}
      <div className="solid-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "#E2E8F0" }}>
          <div>
            <h2 className="font-semibold text-sm" style={{ color: N }}>Priority Inspection Queue</h2>
            <p className="text-xs mt-0.5" style={{ color: TXT2 }}>Inspections requiring review or action</p>
          </div>
          <Link to="/app/history" className="text-xs font-medium no-underline flex items-center gap-1 hover:opacity-80" style={{ color: B }}>
            View All <ChevronRight size={12} />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}>
                {["Inspection ID", "Product", "Category", "Date", "Risk", "Status", "Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: TXT2 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockInspections.map((ins, i) => (
                <tr
                  key={ins.inspection_id}
                  className="border-b transition-colors hover:bg-blue-50/50 cursor-default"
                  style={{ borderColor: "#F0F4F8" }}
                >
                  <td className="px-4 py-3 font-semibold text-xs" style={{ color: B }}>
                    {ins.inspection_id}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: TXT }}>
                    {ins.product.name}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: TXT2 }}>
                    {ins.product.category}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: TXT2 }}>
                    {ins.date}
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge level={ins.risk.level} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={ins.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/app/compliance/${ins.inspection_id}`}
                      className="btn-secondary px-2.5 py-1 text-xs"
                    >
                      <Eye size={12} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: Plus, title: "New Inspection", desc: "Start a fresh inspection workflow", href: "/app/new-inspection", color: B },
          { icon: BarChart3, title: "View Analytics", desc: "Inspection trends and risk distribution", href: "/app/analytics", color: "#7B3FE4" },
          { icon: TrendingUp, title: "Reports Center", desc: "View, download and print inspection reports", href: "/app/reports", color: "#16803C" },
        ].map(({ icon: Icon, title, desc, href, color }) => {
          const badge = getSolidIconBadgeProps(color);
          return (
            <Link key={title} to={href} className="p-4 rounded-xl flex items-center gap-4 no-underline p-card-hover" style={{ background: "white", border: `1px solid ${BORDER}` }}>
              <div className={`w-10 h-10 solid-icon-badge ${badge.className} flex-shrink-0`}>
                <Icon size={18} strokeWidth={2} style={{ color: badge.text }} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: TXT }}>{title}</div>
                <div className="text-xs" style={{ color: TXT2 }}>{desc}</div>
              </div>
              <ChevronRight size={14} className="ml-auto flex-shrink-0" style={{ color: "#C0CBD6" }} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
