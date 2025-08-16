import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import useAuth from "../../../../Hook/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hook/useAxiosSecure";

const COLORS = {
  indigo: "#4f46e5",
  purple: "#a78bfa",
  green: "#16a34a",
  red: "#dc2626",
  gray: "#94a3b8",
  bg: "#f8fafc",
};

const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto p-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-28 rounded-xl bg-gray-100" />
      ))}
    </div>
    <div className="h-96 rounded-xl bg-gray-100" />
  </div>
);

const EmptyState = ({ message = "No registrations to display." }) => (
  <div className="bg-white rounded-xl shadow p-10 text-center">
    <div className="mx-auto mb-3 w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 7v6l4 2" stroke={COLORS.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="9" stroke={COLORS.indigo} strokeWidth="2"/>
      </svg>
    </div>
    <p className="text-gray-600">{message}</p>
  </div>
);

const Analytics = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: registeredCamps = [], isLoading } = useQuery({
    queryKey: ["registeredCamps", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/registrations/byEmail/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // ---------- Derived: group by camp ----------
  const groupedEvents = useMemo(() => {
    const grouped = {};
    registeredCamps.forEach((reg) => {
      const key = reg.campName || "Unknown Camp";
      if (!grouped[key]) {
        grouped[key] = {
          campName: key,
          campId: reg.campId,
          dateTime: reg.dateTime,
          registrations: [],
        };
      }
      grouped[key].registrations.push(reg);
    });
    return Object.values(grouped);
  }, [registeredCamps]);

  // ---------- Totals ----------
  const total = registeredCamps.length;
  const paidCount = registeredCamps.filter((r) => r.payment_status === "paid").length;
  const unpaidCount = total - paidCount;

  // ---------- Filters & Sort ----------
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all"); // all | paid | unpaid
  const [sort, setSort] = useState("total_desc"); // total_desc | name_asc

  const filteredGrouped = useMemo(() => {
    let list = groupedEvents.filter((e) =>
      e.campName.toLowerCase().includes(search.toLowerCase())
    );
    if (status !== "all") {
      list = list
        .map((e) => ({
          ...e,
          registrations: e.registrations.filter(
            (r) => r.payment_status === status
          ),
        }))
        .filter((e) => e.registrations.length > 0);
    }
    if (sort === "total_desc") {
      list.sort(
        (a, b) => b.registrations.length - a.registrations.length
      );
    } else if (sort === "name_asc") {
      list.sort((a, b) => a.campName.localeCompare(b.campName));
    }
    return list;
  }, [groupedEvents, search, status, sort]);

  // ---------- Chart Data (per camp) ----------
  const barData = filteredGrouped.map((event) => {
    const paid = event.registrations.filter((r) => r.payment_status === "paid").length;
    const unpaid = event.registrations.length - paid;
    return {
      name: event.campName,
      total: event.registrations.length,
      paid,
      unpaid,
    };
  });

  // ---------- Donut Data (overall) ----------
  const donutData = [
    { name: "Paid", value: paidCount, color: COLORS.indigo },
    { name: "Unpaid", value: unpaidCount, color: COLORS.purple },
  ];

  // ---------- Trend by month (if dateTime available) ----------
  const trendData = useMemo(() => {
    const hasDates = registeredCamps.some((r) => r.dateTime);
    if (!hasDates) return [];

    const bucket = {};
    registeredCamps.forEach((r) => {
      const d = r.dateTime ? dayjs(r.dateTime) : null;
      if (!d) return;
      const k = d.format("YYYY-MM"); // month key
      if (!bucket[k]) bucket[k] = { month: d.format("MMM YYYY"), paid: 0, total: 0 };
      bucket[k].total += 1;
      if (r.payment_status === "paid") bucket[k].paid += 1;
    });
    // Sort by actual date order
    return Object.entries(bucket)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  }, [registeredCamps]);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Analytics Overview
        </h1>
        <p className="text-gray-600">Your bootcamp registration insights at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl p-5 shadow bg-white border-l-4 border-indigo-500">
          <div className="text-sm text-gray-500">Total Registrations</div>
          <div className="mt-1 text-3xl font-bold">{total}</div>
          <div className="mt-2 text-xs text-gray-500">All camps combined</div>
        </div>
        <div className="rounded-xl p-5 shadow bg-white border-l-4 border-green-500">
          <div className="text-sm text-gray-500">Paid</div>
          <div className="mt-1 text-3xl font-bold text-green-600">{paidCount}</div>
          <div className="mt-2 text-xs text-gray-500">
            {(total ? Math.round((paidCount / total) * 100) : 0)}% of total
          </div>
        </div>
        <div className="rounded-xl p-5 shadow bg-white border-l-4 border-red-500">
          <div className="text-sm text-gray-500">Unpaid</div>
          <div className="mt-1 text-3xl font-bold text-red-600">{unpaidCount}</div>
          <div className="mt-2 text-xs text-gray-500">
            {(total ? Math.round((unpaidCount / total) * 100) : 0)}% of total
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search camp name…"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid only</option>
            <option value="unpaid">Unpaid only</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="total_desc">Sort by Total (desc)</option>
            <option value="name_asc">Sort by Name (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Donut */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Paid vs Unpaid</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {donutData.map((item, i) => (
                  <Cell key={i} fill={item.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar */}
        <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-center">Payment Status per Bootcamp</h3>
          {barData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.indigo} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={COLORS.indigo} stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="unpaidGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.purple} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={COLORS.purple} stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="paid" stackId="a" fill="url(#paidGrad)" name="Paid" />
                <Bar dataKey="unpaid" stackId="a" fill="url(#unpaidGrad)" name="Unpaid" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* Trend (optional if dateTime exists) */}
      {trendData.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <h3 className="text-lg font-semibold mb-4 text-center">Monthly Trend (Paid vs Total)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="totalArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.gray} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={COLORS.gray} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="paidArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.indigo} stopOpacity={0.5}/>
                  <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0.15}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="total" stroke={COLORS.gray} fill="url(#totalArea)" name="Total" />
              <Area type="monotone" dataKey="paid" stroke={COLORS.indigo} fill="url(#paidArea)" name="Paid" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredGrouped.map((event) => {
          const paid = event.registrations.filter((r) => r.payment_status === "paid").length;
          const unpaid = event.registrations.length - paid;
          return (
            <div
              key={event.campId || event.campName}
              className="bg-white rounded-xl shadow hover:shadow-lg border border-indigo-50 p-5 transition"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">{event.campName}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {event.registrations.length} total
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Paid: <span className="text-green-600 font-semibold">{paid}</span>{" "}
                | Unpaid: <span className="text-red-600 font-semibold">{unpaid}</span>
              </p>
              <ul className="mt-3 text-sm text-gray-700 list-disc list-inside max-h-28 overflow-auto">
                {event.registrations.map((reg, idx) => (
                  <li key={idx}>
                    {reg.participantName} —{" "}
                    <span className={reg.payment_status === "paid" ? "text-green-600" : "text-red-600"}>
                      {reg.payment_status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Analytics;
