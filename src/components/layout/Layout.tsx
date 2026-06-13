import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-800 bg-slate-900 text-slate-50 text-slate-50 font-sans transition-colors">
      <Navbar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isMobileOpen={isMobileMenuOpen} closeMobile={() => setIsMobileMenuOpen(false)} />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
}
