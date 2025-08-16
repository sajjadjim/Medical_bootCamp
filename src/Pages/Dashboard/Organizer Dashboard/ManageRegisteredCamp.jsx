import React, { useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { FaUsers, FaMoneyBillWave, FaClipboardList, FaMoneyCheckAlt } from "react-icons/fa";
import { AuthContext } from "../../../Auth/AuthContext";
import RegisterManage from "./RegisterManage";

const COLORS = ["#4f46e5", "#a78bfa"]; // indigo, purple

const LoadingCard = () => (
  <div className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur rounded-2xl p-6 border border-indigo-50 shadow-xl">
    <div className="h-8 w-72 bg-gray-200 rounded mb-6 animate-pulse" />
    <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
  </div>
);

const EmptyCard = ({ text = "No data available." }) => (
  <div className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur rounded-2xl p-10 border border-indigo-50 shadow-xl text-center">
    <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-2xl mb-3">📭</div>
    <p className="text-gray-600">{text}</p>
  </div>
);

const CenterLabel = ({ viewBox, total }) => {
  const { cx, cy } = viewBox || {};
  return (
    <g>
      <text x={cx} y={cy - 6} textAnchor="middle" className="fill-gray-800" fontSize="16" fontWeight="700">
        Total
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" className="fill-indigo-600" fontSize="20" fontWeight="800">
        {total}
      </text>
    </g>
  );
};

const ManageRegisteredCamp = () => {
  const { user } = useContext(AuthContext);
  const userEmail = user?.email;

  const axiosSecure = useAxiosSecure();

  // All registrations
  const { data: registrations = [], isLoading: regsLoading } = useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/registrations`);
      return res.data || [];
    },
  });

  // All camps
  const { data: camps = [], isLoading: campsLoading } = useQuery({
    queryKey: ["camps"],
    queryFn: async () => {
      const res = await axiosSecure.get("/camps");
      return res.data || [];
    },
  });

  // Selected camp (by _id)
  const [selectedCampId, setSelectedCampId] = useState("");

  // Filtered registrations for selected camp (or all)
  const filteredRegs = useMemo(() => {
    if (!selectedCampId) return registrations;
    const camp = camps.find((c) => c._id === selectedCampId);
    if (!camp) return [];
    // Filter by camp name (if your stats endpoint uses name); otherwise by id if your data has campId
    return registrations.filter((r) => r.campName === camp.campName || r.campId === selectedCampId);
  }, [registrations, camps, selectedCampId]);

  const paid = filteredRegs.filter((p) => p.payment_status === "paid").length;
  const unpaid = filteredRegs.length - paid;

  const pieData = useMemo(
    () => [
      { name: "Paid", value: paid },
      { name: "Unpaid", value: unpaid },
    ],
    [paid, unpaid]
  );

  // Selected camp stats (from API that expects campName)
  const selectedCampName = useMemo(() => {
    if (!selectedCampId) return "";
    const c = camps.find((x) => x._id === selectedCampId);
    return c?.campName || "";
  }, [selectedCampId, camps]);

  const { data: selectedStats, isLoading: statsLoading } = useQuery({
    queryKey: ["selectedCampStats", selectedCampName],
    enabled: !!selectedCampName,
    queryFn: async () => {
      const res = await axiosSecure.get(`/registrations/stats/${selectedCampName}`);
      return res.data;
    },
  });

  if (regsLoading || campsLoading) return <LoadingCard />;

  if (!registrations.length) return <EmptyCard text="No registrations found yet." />;

  return (
    <div className="w-full px-4 md:px-8 py-6">
      {/* Header & Donut Chart */}
      <div className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur rounded-2xl p-6 sm:p-8 border border-indigo-50 shadow-xl mb-10">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-indigo-600 mb-6">
          Payment Status Overview
        </h2>
        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS[0]} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={COLORS[0]} stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="unpaidGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS[1]} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={COLORS[1]} stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="80%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                isAnimationActive
              >
                <Cell fill="url(#paidGrad)" />
                <Cell fill="url(#unpaidGrad)" />
              </Pie>
              <CenterLabel total={filteredRegs.length} />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Camp Selector */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-2 mb-8">
        <label htmlFor="camp-select" className="text-lg font-semibold text-gray-700 text-center">
          Select Camp:
        </label>
        <select
          id="camp-select"
          value={selectedCampId}
          onChange={(e) => setSelectedCampId(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All Camps</option>
          {camps.map((camp) => (
            <option key={camp._id} value={camp._id}>
              {camp.campName}
            </option>
          ))}
        </select>
        <p className="text-gray-500 text-sm">
          Showing: <b>{selectedCampId ? (selectedCampName || "—") : "All Camps"}</b>
        </p>
      </div>

      {/* Selected Camp Stats Card */}
      {selectedCampName && !statsLoading && selectedStats && (
        <div className="w-full flex justify-center px-2 mb-10">
          <div className="w-full max-w-sm p-6 bg-white/90 backdrop-blur border border-indigo-50 rounded-2xl shadow-xl hover:shadow-2xl transition">
            <h3 className="text-2xl font-bold text-center text-indigo-600 mb-5 flex items-center justify-center gap-2">
              <FaClipboardList className="text-indigo-500" />
              {selectedStats.campName}
            </h3>

            <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg mb-3">
              <div className="flex items-center gap-3 text-indigo-700 font-medium">
                <FaUsers />
                Total:
              </div>
              <span className="font-bold text-indigo-900">
                {selectedStats.totalRegistrations}
              </span>
            </div>

            <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg mb-3">
              <div className="flex items-center gap-3 text-green-700 font-medium">
                <FaMoneyBillWave />
                Paid:
              </div>
              <span className="font-bold text-green-900">
                {selectedStats.paidRegistrations}
              </span>
            </div>

            <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
              <div className="flex items-center gap-3 text-red-700 font-medium">
                <FaMoneyCheckAlt />
                Unpaid:
              </div>
              <span className="font-bold text-red-900">
                {Math.max(
                  0,
                  (selectedStats.totalRegistrations || 0) -
                    (selectedStats.paidRegistrations || 0)
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Detailed table & chart below */}
      <RegisterManage />
    </div>
  );
};

export default ManageRegisteredCamp;
