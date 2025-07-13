import React, { useState, useEffect } from "react";
import { Menu, X, Home, User, LayoutDashboard, ClipboardList, BarChart2, FileText, Settings } from "lucide-react";
import { NavLink, Outlet } from "react-router";
import useUserRole from "../Hook/useUserRole";
import useAuth from "../Hook/useAuth";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    { name: "Home", path: "/", icon: <Home size={18} /> },
    ...(role === "admin"
      ? [
          { name: "Organizer Profile", path: "/dashboard/organizer-profile", icon: <User size={18} /> },
          { name: "Add BootCamp", path: "/dashboard/addNewBootcamp", icon: <LayoutDashboard size={18} /> },
          { name: "Manage Camps", path: "/dashboard/manageCamps", icon: <ClipboardList size={18} /> },
          { name: "Manage Registered Camps", path: "/dashboard/manage_registered_camps", icon: <FileText size={18} /> },
        ]
      : [
          { name: "Analytics", path: "/dashboard/analytics", icon: <BarChart2 size={18} /> },
          { name: "Participant Profile", path: "/dashboard/participant-profile", icon: <User size={18} /> },
          { name: "Registered Camps", path: "/dashboard/registered-camps", icon: <ClipboardList size={18} /> },
          { name: "Payment History", path: "/dashboard/payment-history", icon: <FileText size={18} /> },
        ]),
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-20 h-full w-64 bg-white p-5 shadow-xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
            D
          </div>
          <h2 className="text-2xl font-bold text-indigo-600">Dashboard</h2>
        </div>

        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2 font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header for mobile */}
        <header className="flex items-center justify-between bg-white p-4 shadow-md md:hidden sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-semibold text-indigo-600">My Dashboard</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
