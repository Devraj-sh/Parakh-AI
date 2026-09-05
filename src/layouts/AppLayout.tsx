import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import {
  LayoutDashboard, Plus, Clock, History, FileSearch, BarChart3,
  Bell, Settings, HelpCircle, User, Search, Menu, X, ChevronRight,
  LogOut, Shield, FileText, AlertTriangle,
} from "lucide-react";
import { mockInspector, mockNotifications } from "../mock/data";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/app/dashboard" },
  { icon: Plus, label: "New Inspection", path: "/app/new-inspection" },
  { icon: Clock, label: "Inspection Queue", path: "/app/history?status=pending" },
  { icon: History, label: "Inspection History", path: "/app/history" },
  { icon: FileSearch, label: "Reports", path: "/app/reports" },
  { icon: BarChart3, label: "Analytics", path: "/app/analytics" },
];

const secondaryNav = [
  { icon: Bell, label: "Notifications", path: "/app/notifications" },
  { icon: Settings, label: "Settings", path: "/app/settings" },
  { icon: HelpCircle, label: "Help & Support", path: "/app/help" },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "?");

  const NavLink = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => {
    const active = isActive(path);
    return (
      <Link
        to={path}
        onClick={() => setSidebarOpen(false)}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all no-underline"
        style={{
          background: active ? "#EBF2FF" : "transparent",
          color: active ? "#1769E0" : "#52606D",
        }}
      >
        <Icon size={17} style={{ color: active ? "#1769E0" : "#7B8A97" }} />
        {label}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-4 border-b" style={{ borderColor: "#D9E2EC" }}>
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <img src="/parakh-logo.png" alt="PARAKH AI" className="h-8 w-auto object-contain" />
        </Link>
      </div>

      {/* Inspector Badge */}
      <div className="px-4 py-3 border-b" style={{ borderColor: "#D9E2EC", background: "#F6F8FB" }}>
        <div className="text-xs font-medium mb-0.5" style={{ color: "#7B8A97" }}>Inspection Workspace</div>
        <div className="text-xs font-semibold" style={{ color: "#0A2540" }}>{mockInspector.location}</div>
      </div>

      {/* Primary Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => <NavLink key={item.path} {...item} />)}
      </nav>

      {/* Secondary Nav */}
      <div className="px-3 py-3 border-t space-y-0.5" style={{ borderColor: "#D9E2EC" }}>
        {secondaryNav.map((item) => (
          <div key={item.path} className="relative">
            <NavLink {...item} />
            {item.label === "Notifications" && unreadCount > 0 && (
              <span className="absolute top-2 right-3 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold" style={{ background: "#C62828", fontSize: "10px" }}>
                {unreadCount}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Inspector Profile */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "#D9E2EC" }}>
        <Link to="/app/profile" className="flex items-center gap-3 no-underline group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ background: "#0A2540" }}>
            {mockInspector.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate" style={{ color: "#102A43" }}>{mockInspector.name}</div>
            <div className="text-xs truncate" style={{ color: "#7B8A97" }}>{mockInspector.designation.split(" ").slice(0, 2).join(" ")}</div>
          </div>
          <ChevronRight size={14} style={{ color: "#9CAAB5" }} />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F6F8FB" }}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r bg-white flex-shrink-0" style={{ borderColor: "#D9E2EC" }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 w-64 bg-white h-full shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b h-14 flex items-center px-4 md:px-6 gap-4 flex-shrink-0" style={{ borderColor: "#D9E2EC" }}>
          {/* Mobile menu */}
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1.5 rounded" style={{ color: "#52606D" }}>
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9CAAB5" }} />
              <input
                type="text"
                placeholder="Search inspection ID, product..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none transition-colors"
                style={{ borderColor: "#D9E2EC", background: "#F6F8FB", color: "#102A43" }}
                onFocus={(e) => (e.target.style.borderColor = "#1769E0")}
                onBlur={(e) => (e.target.style.borderColor = "#D9E2EC")}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <Link to="/app/notifications" className="relative p-2 rounded-lg transition-colors no-underline hover:bg-gray-50" style={{ color: "#52606D" }}>
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "#C62828" }} />
              )}
            </Link>

            {/* Profile */}
            <Link to="/app/profile" className="flex items-center gap-2 p-1.5 rounded-lg transition-colors no-underline hover:bg-gray-50">
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ background: "#0A2540" }}>
                {mockInspector.name.split(" ").map(n => n[0]).join("")}
              </div>
              <span className="hidden md:block text-sm font-medium" style={{ color: "#102A43" }}>
                {mockInspector.name.split(" ")[0]}
              </span>
            </Link>

            {/* Logout */}
            <button
              onClick={() => navigate("/")}
              className="hidden md:flex items-center gap-1.5 p-1.5 rounded-lg transition-colors text-sm"
              style={{ color: "#7B8A97" }}
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
