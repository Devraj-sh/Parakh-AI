import { Outlet, Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Technology", href: "#technology" },
  { label: "FAQ", href: "#faq" },
];

export default function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (isLoginPage) return <Outlet />;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(6, 26, 46, 0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center no-underline transition-opacity hover:opacity-90">
            <img src="/parakh-logo-light.png" alt="PARAKH AI" className="h-7 md:h-8 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-[#00B8D9] no-underline"
                style={{ color: "#A8BDD3" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium px-4 py-2 rounded transition-colors no-underline text-white hover:text-[#00B8D9]"
            >
              Login
            </Link>
            <Link
              to="/app/new-inspection"
              className="btn-primary px-4 py-2 text-xs"
            >
              Start Inspection
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded text-white"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div
            className="md:hidden border-t px-6 py-4 flex flex-col gap-4"
            style={{ borderColor: "rgba(255, 255, 255, 0.08)", background: "#061A2E" }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium no-underline hover:text-[#00B8D9]"
                style={{ color: "#A8BDD3" }}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
              <Link to="/login" className="text-sm font-medium py-2 no-underline text-white">Login</Link>
              <Link
                to="/app/new-inspection"
                onClick={() => setMobileOpen(false)}
                className="btn-primary py-2.5 text-sm w-full"
              >
                Start Inspection
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
