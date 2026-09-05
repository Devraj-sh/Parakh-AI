import { useState } from "react";
import { Link } from "react-router";
import { Bell, AlertTriangle, CheckCircle, Info, X, Check } from "lucide-react";
import { mockNotifications } from "../../mock/data";
import type { Notification } from "../../types";

const N = "#0A2540";
const B = "#1769E0";
const BG = "#F6F8FB";
const TXT = "#102A43";
const TXT2 = "#52606D";
const BORDER = "#D9E2EC";

function NotifItem({ notif, onRead, onDismiss }: { notif: Notification; onRead: (id: string) => void; onDismiss: (id: string) => void }) {
  const typeConfig = {
    info: { icon: Info, color: B, bg: "#EBF2FF", border: "#C7DCFF" },
    warning: { icon: AlertTriangle, color: "#C77C02", bg: "#FFFBEB", border: "#FDE68A" },
    danger: { icon: AlertTriangle, color: "#C62828", bg: "#FEF2F2", border: "#FECACA" },
    success: { icon: CheckCircle, color: "#16803C", bg: "#F0FDF4", border: "#86EFAC" },
  };
  const { icon: Icon, color, bg, border } = typeConfig[notif.type];

  return (
    <div
      className="rounded-xl p-4 flex items-start gap-3 relative"
      style={{
        background: notif.read ? "white" : bg,
        border: `1px solid ${notif.read ? BORDER : border}`,
        opacity: notif.read ? 0.85 : 1,
      }}
    >
      {!notif.read && <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ background: color }} />}

      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: notif.read ? BG : bg }}>
        <Icon size={15} style={{ color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-0.5">
          <div className="font-semibold text-sm" style={{ color: TXT }}>{notif.title}</div>
          <span className="text-xs flex-shrink-0" style={{ color: TXT2 }}>{notif.timestamp}</span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: TXT2 }}>{notif.message}</p>
        <div className="flex items-center gap-3 mt-2">
          {notif.inspection_id && (
            <Link
              to={`/app/compliance/${notif.inspection_id}`}
              className="text-xs font-medium no-underline hover:opacity-80"
              style={{ color: B }}
            >
              View Inspection →
            </Link>
          )}
          {!notif.read && (
            <button onClick={() => onRead(notif.id)} className="text-xs" style={{ color: TXT2 }}>
              Mark as read
            </button>
          )}
        </div>
      </div>

      <button
        onClick={() => onDismiss(notif.id)}
        className="p-1 rounded hover:bg-gray-100 transition-colors flex-shrink-0 ml-1"
        style={{ color: TXT2 }}
      >
        <X size={12} />
      </button>
    </div>
  );
}

export default function Notifications() {
  const [notifs, setNotifs] = useState(mockNotifications);
  const unread = notifs.filter(n => !n.read).length;

  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id: string) => setNotifs(prev => prev.filter(n => n.id !== id));
  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div className="p-6 md:p-8 space-y-6" style={{ background: BG, minHeight: "100%" }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold" style={{ color: N }}>Notifications</h1>
            {unread > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#C62828" }}>
                {unread} Unread
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: TXT2 }}>Inspection alerts, AI analysis updates, and system notifications</p>
        </div>
        {unread > 0 && (
          <button onClick={markAll} className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border transition-colors hover:bg-gray-50" style={{ borderColor: BORDER, color: TXT2 }}>
            <Check size={13} /> Mark All Read
          </button>
        )}
      </div>

      {/* Unread */}
      {notifs.filter(n => !n.read).length > 0 && (
        <div>
          <div className="text-xs font-semibold mb-3" style={{ color: TXT2 }}>UNREAD ({unread})</div>
          <div className="space-y-3">
            {notifs.filter(n => !n.read).map(n => (
              <NotifItem key={n.id} notif={n} onRead={markRead} onDismiss={dismiss} />
            ))}
          </div>
        </div>
      )}

      {/* Read */}
      {notifs.filter(n => n.read).length > 0 && (
        <div>
          <div className="text-xs font-semibold mb-3" style={{ color: TXT2 }}>EARLIER</div>
          <div className="space-y-3">
            {notifs.filter(n => n.read).map(n => (
              <NotifItem key={n.id} notif={n} onRead={markRead} onDismiss={dismiss} />
            ))}
          </div>
        </div>
      )}

      {notifs.length === 0 && (
        <div className="text-center py-16">
          <Bell size={32} style={{ color: "#C0CBD6", margin: "0 auto 12px" }} />
          <div className="font-semibold text-sm mb-1" style={{ color: TXT2 }}>No notifications</div>
          <div className="text-xs" style={{ color: "#9CAAB5" }}>You're all caught up.</div>
        </div>
      )}
    </div>
  );
}
