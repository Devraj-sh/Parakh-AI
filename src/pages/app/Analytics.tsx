import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { mockAnalyticsData } from "../../mock/data";
import { TrendingUp, CheckCircle, AlertTriangle, Clock, BarChart3, Zap } from "lucide-react";
import { getSolidIconBadgeProps } from "../../utils/iconBadge";

const N = "#0A2540";
const B = "#1769E0";
const BG = "#F6F8FB";
const TXT = "#102A43";
const TXT2 = "#52606D";
const BORDER = "#D9E2EC";

const { inspections_over_time, risk_distribution, finding_categories, compliance_status, totals } = mockAnalyticsData;

function StatTile({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  const badge = getSolidIconBadgeProps(color);
  return (
    <div className="solid-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 solid-icon-badge ${badge.className}`}>
          <Icon size={16} strokeWidth={2} style={{ color: badge.text }} />
        </div>
      </div>
      <div className="font-bold text-2xl mb-0.5" style={{ color: TXT }}>{value}</div>
      <div className="text-xs font-medium" style={{ color: TXT2 }}>{label}</div>
    </div>
  );
}

const customTooltipStyle = {
  background: "white",
  border: `1px solid ${BORDER}`,
  borderRadius: "8px",
  fontSize: "12px",
  color: TXT,
  boxShadow: "0 4px 12px rgba(10,37,64,0.08)",
};

export default function Analytics() {
  return (
    <div className="p-6 md:p-8 space-y-6" style={{ background: BG, minHeight: "100%" }}>
      <div>
        <h1 className="text-xl font-bold mb-1" style={{ color: N }}>Inspection Analytics</h1>
        <p className="text-sm" style={{ color: TXT2 }}>Inspection trends, risk distribution, and compliance overview — Mar 2026 to Sep 2026</p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatTile icon={BarChart3} label="Total Inspections" value={totals.total} color={B} />
        <StatTile icon={CheckCircle} label="Completed" value={totals.completed} color="#16803C" />
        <StatTile icon={Clock} label="Pending Review" value={totals.pending_review} color="#C77C02" />
        <StatTile icon={AlertTriangle} label="Potential Issues" value={totals.potential_issues} color="#C62828" />
        <StatTile icon={TrendingUp} label="High Risk" value={totals.high_risk} color="#C62828" />
        <StatTile icon={Zap} label="Avg. Processing" value={totals.avg_processing} color="#7B3FE4" />
      </div>

      {/* Charts row 1 */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Inspections over time */}
        <div className="md:col-span-2 solid-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-sm" style={{ color: N }}>Inspections Over Time</h2>
              <p className="text-xs mt-0.5" style={{ color: TXT2 }}>Completed vs. pending review</p>
            </div>
            <select className="text-xs px-2 py-1.5 rounded border outline-none" style={{ borderColor: BORDER, color: TXT2 }}>
              <option>Last 7 months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={inspections_over_time} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <defs>
                <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={B} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={B} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C77C02" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#C77C02" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: TXT2 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: TXT2 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Area type="monotone" dataKey="completed" stroke={B} strokeWidth={2} fill="url(#gradCompleted)" name="Completed" />
              <Area type="monotone" dataKey="pending" stroke="#C77C02" strokeWidth={2} fill="url(#gradPending)" name="Pending" />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution Pie */}
        <div className="solid-card rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-1" style={{ color: N }}>Risk Distribution</h2>
          <p className="text-xs mb-5" style={{ color: TXT2 }}>Across all inspections</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={risk_distribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                {risk_distribution.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={customTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {risk_distribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.fill }} />
                  <span style={{ color: TXT2 }}>{item.name}</span>
                </div>
                <span className="font-semibold" style={{ color: TXT }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Finding Categories */}
        <div className="solid-card rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-1" style={{ color: N }}>Finding Categories</h2>
          <p className="text-xs mb-5" style={{ color: TXT2 }}>Most common compliance finding types</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={finding_categories} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: TXT2 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: TXT2 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="count" name="Findings" fill={B} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Compliance Status */}
        <div className="solid-card rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-1" style={{ color: N }}>Compliance Review Status</h2>
          <p className="text-xs mb-5" style={{ color: TXT2 }}>Overall compliance outcome distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={compliance_status} margin={{ top: 0, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: TXT2 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: TXT2 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar
                dataKey="value"
                name="Inspections"
                radius={[4, 4, 0, 0]}
              >
                {compliance_status.map((entry, i) => (
                  <Cell key={i} fill={i === 0 ? "#16803C" : i === 1 ? "#C62828" : "#C77C02"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary note */}
      <div className="rounded-xl p-4 text-xs leading-relaxed" style={{ background: "white", border: `1px solid ${BORDER}`, color: TXT2 }}>
        <strong style={{ color: TXT }}>Analytics Note: </strong>
        Data shown covers Mar 2026 – Sep 2026. Risk and compliance indicators are AI-assisted and require inspector verification. Analytics are provided for inspection planning and workflow optimization purposes.
      </div>
    </div>
  );
}
