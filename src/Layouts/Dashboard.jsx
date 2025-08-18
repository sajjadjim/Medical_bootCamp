import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  Home,
  User,
  LayoutDashboard,
  ClipboardList,
  BarChart2,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink, Outlet } from "react-router"; // if you use react-router-dom, import from 'react-router-dom'
import useUserRole from "../Hook/useUserRole";
import useAuth from "../Hook/useAuth";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile open/close
  const [collapsed, setCollapsed] = useState(false); // desktop collapse/expand

  const { role, roleLoading } = useUserRole();
  const { loading } = useAuth();

  const [showSpinner, setShowSpinner] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || roleLoading || showSpinner) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-xl text-indigo-600"></span>
      </div>
    );
  }

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    ...(role === "admin"
      ? [
          { name: "Organizer Profile", path: "/dashboard/organizer-profile", icon: User },
          { name: "Add BootCamp", path: "/dashboard/addNewBootcamp", icon: LayoutDashboard },
          { name: "Manage Camps", path: "/dashboard/manageCamps", icon: ClipboardList },
          { name: "Manage Registered Camps", path: "/dashboard/manage_registered_camps", icon: FileText },
        ]
      : [
          { name: "Analytics", path: "/dashboard/analytics", icon: BarChart2 },
          { name: "Participant Profile", path: "/dashboard/participant-profile", icon: User },
          { name: "Registered Camps", path: "/dashboard/registered-camps", icon: ClipboardList },
          { name: "Payment History", path: "/dashboard/payment-history", icon: FileText },
        ]),
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  // small helper for tooltip when collapsed
  const itemLabel = (label) =>
    collapsed ? <span className="sr-only">{label}</span> : <span>{label}</span>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-20 h-full bg-white/80 backdrop-blur-md border-r border-indigo-50 shadow-xl
          transition-all duration-300 ease-in-out
          md:sticky md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "md:w-20 w-64" : "md:w-72 w-64"}
        `}
        aria-label="Sidebar"
      >
        {/* Sidebar header */}
        <div className={`flex items-center justify-between px-4 py-4 ${collapsed ? "md:px-3" : ""}`}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
              JIM
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <h2 className="text-xl font-bold text-indigo-600">Dashboard</h2>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  Role:
                  <span
                    className={`px-2 py-0.5 rounded-full border text-[11px] ${
                      role === "admin"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {role}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden md:inline-flex items-center justify-center p-2 rounded-lg hover:bg-indigo-50 text-indigo-600"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-indigo-50 text-indigo-600"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-2 px-2">
          <ul className="flex flex-col gap-1">
            {navItems.map(({ name, path, icon: Icon }) => (
              <li key={name}>
                <NavLink
                  to={path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `
                    group relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-colors
                    ${isActive
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `
                  }
                  title={collapsed ? name : undefined}
                >
                  {/* Active accent bar */}
                  <span
                    className={`
                      absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r
                      ${collapsed ? "md:block hidden" : "hidden"}
                    `}
                    aria-hidden="true"
                  />
                  <Icon size={18} />
                  {itemLabel(name)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer inside sidebar */}
        <div className={`mt-auto p-3 absolute bottom-0 left-0 right-0 ${collapsed ? "md:px-2" : ""}`}>
          <div
            className={`
              bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100
              ${collapsed ? "rounded-full p-2" : "rounded-xl p-3"}
            `}
          >
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Settings size={16} className="text-indigo-500" />
              {!collapsed && <span>Quick tip: Use the chevron to collapse.</span>}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar (mobile & desktop) */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-indigo-50">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Mobile open button */}
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-indigo-50 text-indigo-600"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            <h1 className="text-lg md:text-xl font-semibold text-indigo-700 tracking-tight">
              My Dashboard
            </h1>

            {/* Desktop collapse quick toggle (mirrored) */}
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="hidden md:inline-flex items-center justify-center p-2 rounded-lg hover:bg-indigo-50 text-indigo-600"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
