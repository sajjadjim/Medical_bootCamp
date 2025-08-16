import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";
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
import {
  Search,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
} from "lucide-react";

const LoadingSkeleton = () => (
  <div className="p-4 max-w-7xl mx-auto">
    <div className="h-10 w-60 bg-gray-200 rounded mb-4 animate-pulse" />
    <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-12 border-b last:border-0 bg-gray-50/60 animate-pulse" />
      ))}
    </div>
    <div className="mt-8 h-72 bg-gray-100 rounded-xl animate-pulse" />
  </div>
);

const EmptyState = ({ label = "No registrations found." }) => (
  <div className="bg-white/90 backdrop-blur rounded-xl border border-indigo-50 shadow p-10 text-center">
    <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-2xl mb-3">📭</div>
    <p className="text-gray-600">{label}</p>
  </div>
);

const StatusChip = ({ status }) => {
  const paid = status === "paid";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
      ${paid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
    >
      {paid ? <CheckCircle2 size={14} /> : <Clock size={14} />}
      {paid ? "Paid" : "Unpaid"}
    </span>
  );
};

const RegisterManage = () => {
  const axiosSecure = useAxiosSecure();

  // Replace with your real auth
  const user = { email: "sajjadjim15@gmail.com" };
  const userEmail = user?.email;

  const itemsPerPage = 10;

  const { data: registerCamps = [], isLoading } = useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/registrations`);
      return res.data || [];
    },
  });

  // Filter to this organizer’s camps
  const myAll = useMemo(
    () => registerCamps.filter((camp) => camp.ownerEmail === userEmail),
    [registerCamps, userEmail]
  );

  // UI state: search/status/pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | paid | unpaid
  const [currentPage, setCurrentPage] = useState(1);

  // Derived: filtering
  const participants = useMemo(() => {
    const s = search.trim().toLowerCase();
    let arr = [...myAll];

    if (s) {
      arr = arr.filter(
        (p) =>
          (p.participantName || "").toLowerCase().includes(s) ||
          (p.campName || "").toLowerCase().includes(s) ||
          (p.location || "").toLowerCase().includes(s)
      );
    }
    if (statusFilter !== "all") {
      arr = arr.filter((p) => (statusFilter === "paid" ? p.payment_status === "paid" : p.payment_status !== "paid"));
    }
    return arr;
  }, [myAll, search, statusFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(participants.length / itemsPerPage));
  useEffect(() => setCurrentPage(1), [search, statusFilter, participants.length]);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return participants.slice(start, start + itemsPerPage);
  }, [participants, currentPage]);

  // Chart data
  const chartData = useMemo(() => {
    const grouped = {};
    participants.forEach(({ campName, payment_status }) => {
      const key = campName || "Unknown";
      if (!grouped[key]) grouped[key] = { name: key, paid: 0, unpaid: 0 };
      payment_status === "paid" ? (grouped[key].paid += 1) : (grouped[key].unpaid += 1);
    });
    return Object.values(grouped);
  }, [participants]);

  // Delete handler
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete this registration?",
      text: "This registration will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        const res = await axiosSecure.delete(`/registrations/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire("Deleted!", "Registration has been deleted.", "success");
          // Optimistic remove
          // (You could refetch with react-query; for simplicity, splice locally)
          const idx = registerCamps.findIndex((r) => r._id === id);
          if (idx !== -1) registerCamps.splice(idx, 1);
        } else {
          Swal.fire("Failed", "Could not delete the registration.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong!", "error");
        console.error("Delete error:", error);
      }
    });
  };

  // CSV export (filtered)
  const exportCSV = () => {
    const rows = [
      ["Participant Name", "Gender", "Camp Name", "Location", "Status", "Registered At", "Owner Email", "Participant Email", "Phone"],
      ...participants.map((p) => [
        p.participantName || "",
        p.gender || "",
        p.campName || "",
        p.location || "",
        p.payment_status || "",
        p.dateTime ? new Date(p.dateTime).toISOString() : "",
        p.ownerEmail || "",
        p.participantEmail || "",
        p.phone || "",
      ]),
    ];
    const csv = rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `registrations_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
        <div>
          <h2 className="md:text-3xl text-xl font-semibold">Registered Participants</h2>
          <p className="text-gray-600 text-sm">{participants.length} result{participants.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, camp, location…"
              className="w-full sm:w-72 pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] transition"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow bg-white">
        <table className="min-w-full">
          <thead className="bg-gray-50 sticky top-0 z-0">
            <tr className="text-left text-gray-700">
              <th className="px-4 py-3 whitespace-nowrap">Participant</th>
              <th className="px-4 py-3 whitespace-nowrap">Gender</th>
              <th className="px-4 py-3 whitespace-nowrap">Camp</th>
              <th className="px-4 py-3 whitespace-nowrap">Location</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Confirm</th>
              <th className="px-4 py-3 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6">
                  <EmptyState />
                </td>
              </tr>
            ) : (
              paginatedData.map((p, i) => (
                <tr
                  key={p._id}
                  className={`transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-indigo-50`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">{p.participantName}</td>
                  <td className="px-4 py-3 whitespace-nowrap capitalize">{p.gender || "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{p.campName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{p.location}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusChip status={p.payment_status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-semibold">
                    {p.payment_status === "paid" ? (
                      <span className="text-green-600">Confirmed</span>
                    ) : (
                      <span className="text-amber-600">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(p._id)}
                      disabled={p.payment_status === "paid"}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border transition
                        ${p.payment_status === "paid"
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-red-200 text-red-600 hover:bg-red-50"}`}
                      title={p.payment_status === "paid" ? "Cannot delete paid registration" : "Delete registration"}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {paginatedData.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-4">
            <div className="text-sm text-gray-600">
              Page <b>{currentPage}</b> of <b>{totalPages}</b> • Showing{" "}
              <b>{paginatedData.length}</b> of <b>{participants.length}</b>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages).keys()].map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n + 1)}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    currentPage === n + 1
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {n + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white mt-10 p-6 rounded-xl shadow border border-indigo-50">
        <h3 className="text-xl font-semibold mb-4 text-center">Payment Status per Bootcamp</h3>
        {chartData.length === 0 ? (
          <p className="text-center text-gray-500">No data to display.</p>
        ) : (
          <ResponsiveContainer width="100%" height={320} minWidth={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="unpaidGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="paid" stackId="a" fill="url(#paidGrad)" name="Paid" />
              <Bar dataKey="unpaid" stackId="a" fill="url(#unpaidGrad)" name="Unpaid" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RegisterManage;
