import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, Outlet } from "react-router";
import useUserRole from "../Hook/useUserRole";
import useAuth from "../Hook/useAuth";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role, roleLoading } = useUserRole()
  const { loading } = useAuth()

  console.log("user role", role)

  const navItems = [
    { name: "Home", path: "/" },
    // Only show these 3 routes if role is 'admin'
    ...(role === "admin"
      ? [
        { name: "Organizer Profile", path: "/dashboard/organizer-profile" },
        { name: "Add BootCamp", path: "/dashboard/addNewBootcamp" },
        { name: "Manage Camps", path: "/dashboard/manageCamps" },
        { name: "Manage Registered Camps", path: "/dashboard/manage_registered_camps" },
      ]
      : []),
    ...(role !== "admin"
      ? [
        { name: "Analytics", path: "/dashboard/analytics" },
        { name: "Participant Profile", path: "/dashboard/participant-profile" },
        { name: "Registered Camps", path: "/dashboard/registered-camps" },
        { name: "Payment History", path: "/dashboard/payment-history" },
      ]
      : []),
  ];

  if (loading) {
    const [showSpinner, setShowSpinner] = React.useState(true);

    React.useEffect(() => {
      const timer = setTimeout(() => setShowSpinner(false), 1000);
      return () => clearTimeout(timer);
    }, []);

    if (showSpinner || roleLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      );
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-20 h-full w-64 bg-white p-5 shadow-md transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <h2 className="mb-6 text-2xl font-bold text-indigo-600">Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-md px-4 py-2 transition ${isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {item.name}
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
        <header className="flex items-center justify-between bg-white p-4 shadow-md md:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-semibold">My Dashboard</h1>
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
