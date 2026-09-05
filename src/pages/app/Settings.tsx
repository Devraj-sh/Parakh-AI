import { useState } from "react";
import { Bell, Monitor, Globe, Shield, Database, Save } from "lucide-react";

const N = "#0A2540";
const B = "#1769E0";
const BG = "#F6F8FB";
const TXT = "#102A43";
const TXT2 = "#52606D";
const BORDER = "#D9E2EC";

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      onClick={() => setOn(!on)}
      className="relative w-10 h-5 rounded-full transition-colors"
      style={{ background: on ? B : "#D9E2EC" }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform"
        style={{ transform: on ? "translateX(22px)" : "translateX(2px)" }}
      />
    </button>
  );
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="solid-card rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "#E2E8F0", background: "#F8FAFC" }}>
        <Icon size={14} style={{ color: B }} />
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: TXT2 }}>{title}</span>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function ToggleRow({ label, desc, defaultOn }: { label: string; desc: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-medium" style={{ color: TXT }}>{label}</div>
        <div className="text-xs" style={{ color: TXT2 }}>{desc}</div>
      </div>
      <Toggle defaultChecked={defaultOn} />
    </div>
  );
}

export default function Settings() {
  return (
    <div className="p-6 md:p-8 space-y-6" style={{ background: BG, minHeight: "100%" }}>
      <div>
        <h1 className="text-xl font-bold mb-1" style={{ color: N }}>Settings</h1>
        <p className="text-sm" style={{ color: TXT2 }}>Notification, display, language, and security preferences</p>
      </div>

      <div className="max-w-2xl space-y-5">
        <Section icon={Bell} title="Notification Preferences">
          <ToggleRow label="High-Risk Inspection Alerts" desc="Receive alerts when a HIGH risk inspection is detected" defaultOn />
          <ToggleRow label="AI Analysis Completed" desc="Notify when analysis is ready for review" defaultOn />
          <ToggleRow label="Pending Review Reminders" desc="Daily reminders for inspections awaiting review" defaultOn />
          <ToggleRow label="Report Generation Notifications" desc="Notify when a report is successfully generated" />
          <ToggleRow label="System Notifications" desc="Platform updates and maintenance notices" />
        </Section>

        <Section icon={Monitor} title="Display Preferences">
          <ToggleRow label="Compact Table View" desc="Show more rows in inspection tables" />
          <ToggleRow label="Show Confidence Bars" desc="Display visual confidence indicators in results" defaultOn />
          <ToggleRow label="Highlight High-Risk Items" desc="Visually emphasize high-risk findings in lists" defaultOn />
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium" style={{ color: TXT }}>Items Per Page</div>
              <div className="text-xs" style={{ color: TXT2 }}>Rows per table page</div>
            </div>
            <select className="text-xs px-3 py-2 rounded-lg border outline-none" style={{ borderColor: BORDER, color: TXT }}>
              <option>10</option><option>25</option><option>50</option><option>100</option>
            </select>
          </div>
        </Section>

        <Section icon={Globe} title="Language & Region">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: TXT }}>Interface Language</label>
              <select className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: BORDER, color: TXT }}>
                <option>English</option>
                <option>हिंदी (Hindi)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: TXT }}>Date Format</label>
              <select className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: BORDER, color: TXT }}>
                <option>DD MMM YYYY</option>
                <option>DD/MM/YYYY</option>
              </select>
            </div>
          </div>
        </Section>

        <Section icon={Shield} title="Security">
          <ToggleRow label="Two-Factor Authentication" desc="Require OTP on login (recommended)" />
          <ToggleRow label="Session Timeout" desc="Auto-logout after 30 minutes of inactivity" defaultOn />
          <div>
            <button className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50" style={{ borderColor: BORDER, color: TXT2 }}>
              Change Password
            </button>
          </div>
        </Section>

        <Section icon={Database} title="Data Settings">
          <ToggleRow label="Auto-Save Inspection Data" desc="Automatically save inspection progress" defaultOn />
          <ToggleRow label="Evidence Image Compression" desc="Compress images to save storage" defaultOn />
          <div className="p-3 rounded-lg text-xs" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#C62828" }}>
            Clearing local data is irreversible. Contact your system administrator before deleting inspection records.
          </div>
        </Section>

        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90" style={{ background: B }}>
            <Save size={14} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
