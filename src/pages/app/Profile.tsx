import { mockInspector } from "../../mock/data";
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2 } from "lucide-react";

const N = "#0A2540";
const B = "#1769E0";
const BG = "#F6F8FB";
const TXT = "#102A43";
const TXT2 = "#52606D";
const BORDER = "#D9E2EC";

export default function Profile() {
  const insp = mockInspector;
  const initials = insp.name.split(" ").map(n => n[0]).join("");

  return (
    <div className="p-6 md:p-8 space-y-6" style={{ background: BG, minHeight: "100%" }}>
      <div>
        <h1 className="text-xl font-bold mb-1" style={{ color: N }}>Inspector Profile</h1>
        <p className="text-sm" style={{ color: TXT2 }}>Your account information and credentials</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="md:col-span-1">
          <div className="solid-card rounded-2xl p-6 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4" style={{ background: N }}>
              {initials}
            </div>
            <h2 className="font-bold text-base mb-0.5" style={{ color: TXT }}>{insp.name}</h2>
            <p className="text-xs mb-3" style={{ color: TXT2 }}>{insp.designation}</p>
            <span className="pill-blue text-xs font-bold px-3 py-1 rounded-full">
              Active Inspector
            </span>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "#E2E8F0" }}>
              <div className="text-xs mb-0.5" style={{ color: TXT2 }}>Employee ID</div>
              <div className="font-mono text-sm font-semibold" style={{ color: TXT }}>{insp.employee_id}</div>
            </div>
            <div className="mt-3">
              <div className="text-xs mb-0.5" style={{ color: TXT2 }}>Last Login</div>
              <div className="text-xs" style={{ color: TXT }}>{insp.last_login}</div>
            </div>
            <button className="btn-secondary mt-4 px-4 py-2 text-xs w-full justify-center">
              <Edit2 size={12} /> Edit Profile
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-4">
          <div className="solid-card rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b text-xs font-bold uppercase tracking-wider" style={{ borderColor: "#E2E8F0", color: TXT2, background: "#F8FAFC" }}>
              INSPECTOR INFORMATION
            </div>
            <div className="p-5 space-y-4">
              {[
                { icon: User, label: "Full Name", value: insp.name },
                { icon: Shield, label: "Designation", value: insp.designation },
                { icon: Shield, label: "Department", value: insp.department },
                { icon: Mail, label: "Official Email", value: insp.email },
                { icon: Phone, label: "Contact", value: insp.phone },
                { icon: MapPin, label: "Region", value: insp.location },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-9 h-9 solid-icon-badge badge-blue flex-shrink-0">
                    <Icon size={16} strokeWidth={2} style={{ color: B }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold mb-0.5" style={{ color: TXT2 }}>{label}</div>
                    <div className="text-sm font-medium" style={{ color: TXT }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Summary */}
          <div className="rounded-xl p-5" style={{ background: "white", border: `1px solid ${BORDER}` }}>
            <div className="text-xs font-semibold mb-4" style={{ color: TXT2 }}>INSPECTION ACTIVITY SUMMARY</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Inspections", val: "507", color: B },
                { label: "Completed", val: "449", color: "#16803C" },
                { label: "Pending Review", val: "38", color: "#C77C02" },
                { label: "High Risk Handled", val: "47", color: "#C62828" },
              ].map(({ label, val, color }) => (
                <div key={label} className="text-center p-3 rounded-lg" style={{ background: BG }}>
                  <div className="font-bold text-xl" style={{ color }}>{val}</div>
                  <div className="text-xs mt-0.5" style={{ color: TXT2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
