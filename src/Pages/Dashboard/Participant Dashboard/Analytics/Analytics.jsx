import React, { useMemo } from "react";
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
} from "recharts";
import useAuth from "../../../../Hook/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hook/useAxiosSecure";

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

  // 🔄 Group camps by campName
  const groupedEvents = useMemo(() => {
    const grouped = {};

    registeredCamps.forEach((reg) => {
      if (!grouped[reg.campName]) {
        grouped[reg.campName] = {
          campName: reg.campName,
          campId: reg.campId,
          dateTime: reg.dateTime, // optional: include if available
          registrations: [],
        };
      }
      grouped[reg.campName].registrations.push(reg);
    });

    return Object.values(grouped);
  }, [registeredCamps]);

  const totalUpcomingRegistrations = registeredCamps.length;

  // 📊 Chart data
  const chartData = groupedEvents.map((event) => {
    const paid = event.registrations.filter(r => r.payment_status === "paid").length;
    const unpaid = event.registrations.length - paid;
    return {
      name: event.campName,
      total: event.registrations.length,
      paid,
      unpaid,
    };
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Summary Card */}
      <div className="bg-indigo-500 text-white rounded-lg p-6 mb-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Your Registrations Summary</h2>
        <p className="text-xl">{totalUpcomingRegistrations} Bootcamp Registrations</p>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4 text-center">Payment Status per Bootcamp</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="paid" stackId="a" fill="#4f46e5" name="Paid" />
              <Bar dataKey="unpaid" stackId="a" fill="#a78bfa" name="Unpaid" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No registrations to display.</p>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {groupedEvents.map((event) => (
          <div
            key={event.campId}
            className="bg-white shadow-2xl rounded-lg border-r-4 border-b-2 border-indigo-500  p-5 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{event.campName}</h3>
            <p className="text-gray-600 mb-2">
              Total: {event.registrations.length}
            </p>
            <p className="mb-2">
              Paid:{" "}
              <span className="text-green-600 font-semibold">
                {event.registrations.filter((r) => r.payment_status === "paid").length}
              </span>{" "}
              | Unpaid:{" "}
              <span className="text-red-600 font-semibold">
                {event.registrations.filter((r) => r.payment_status === "unpaid").length}
              </span>
            </p>
            <ul className="mt-3 text-sm text-gray-700 list-disc list-inside max-h-28 overflow-auto">
              {event.registrations.map((reg, idx) => (
                <li key={idx}>
                  {reg.participantName} —{" "}
                  <span
                    className={
                      reg.payment_status === "paid" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {reg.payment_status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
