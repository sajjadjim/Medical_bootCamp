import React, { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router"; // keep as-is; switch to react-router-dom if needed
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import {
  LayoutGrid,
  Table as TableIcon,
  Search,
  X,
  Calendar,
  MapPin,
  Banknote,
  Filter,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";

const Fee = ({ value }) => (
  <span className="font-semibold">{`৳${Number(value || 0).toLocaleString()}`}</span>
);

const StatusChip = ({ expired }) => {
  return expired ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-rose-200 bg-rose-50 text-rose-700">
      <AlertCircle size={14} /> Expired
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-emerald-200 bg-emerald-50 text-emerald-700">
      <BadgeCheck size={14} /> Open
    </span>
  );
};

const Skeleton = () => (
  <div className="space-y-4">
    <div className="h-10 w-60 bg-gray-200 rounded animate-pulse" />
    <div className="h-12 bg-gray-100 rounded animate-pulse" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  </div>
);

const EmptyState = ({ label = "No bootcamps match your filters." }) => (
  <div className="bg-white/90 backdrop-blur rounded-xl border border-indigo-50 shadow p-10 text-center">
    <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-2xl mb-3">📭</div>
    <p className="text-gray-600">{label}</p>
  </div>
);

const AvailableBootcamp = () => {
  useEffect(() => {
    document.title = "Available BootCamps";
  }, []);

  const axiosSecure = useAxiosSecure();

  // UI state
  const [viewMode, setViewMode] = useState("table"); // "table" | "card"
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("dateAsc"); // dateAsc | dateDesc | feeAsc | feeDesc | nameAsc | nameDesc
  const [showPast, setShowPast] = useState(false);
  const rowsPerPage = 7;
  const inputRef = useRef(null);

  const { data: AllBootCamps = [], isLoading, isSuccess } = useQuery({
    queryKey: ["bootcamps"],
    queryFn: async () => {
      const res = await axiosSecure.get("/camps");
      return res.data || [];
    },
  });

  // Search + filter + sort
  const filteredBootcamps = useMemo(() => {
    let arr = [...AllBootCamps];

    // search
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      arr = arr.filter((c) => (c.campName || "").toLowerCase().includes(s));
    }

    // hide past by default
    if (!showPast) {
      arr = arr.filter((c) => !dayjs(c.dateTime).isBefore(dayjs()));
    }

    // sort
    const cmp = {
      dateAsc: (a, b) => dayjs(a.dateTime).valueOf() - dayjs(b.dateTime).valueOf(),
      dateDesc: (a, b) => dayjs(b.dateTime).valueOf() - dayjs(a.dateTime).valueOf(),
      feeAsc: (a, b) => Number(a.campFees || 0) - Number(b.campFees || 0),
      feeDesc: (a, b) => Number(b.campFees || 0) - Number(a.campFees || 0),
      nameAsc: (a, b) => (a.campName || "").localeCompare(b.campName || ""),
      nameDesc: (a, b) => (b.campName || "").localeCompare(a.campName || ""),
    }[sortBy];

    if (cmp) arr.sort(cmp);
    return arr;
  }, [AllBootCamps, searchTerm, sortBy, showPast]);

  const totalPages = Math.max(1, Math.ceil(filteredBootcamps.length / rowsPerPage));
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredBootcamps.slice(start, start + rowsPerPage);
  }, [filteredBootcamps, currentPage]);

  // click outside to close suggestions
  useEffect(() => {
    const handle = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, showPast]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto relative">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-10 -left-10 h-64 w-64 bg-indigo-200/40 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 h-72 w-72 bg-purple-200/40 blur-3xl rounded-full" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="md:text-5xl text-2xl font-bold tracking-tight">Available Bootcamps</h2>

        {/* search with suggestions */}
        <div className="relative w-full md:w-auto" ref={inputRef}>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by camp name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="pl-9 pr-10 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full md:w-72 bg-white/90"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {showSuggestions && searchTerm && filteredBootcamps.length > 0 && (
            <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-xl">
              {filteredBootcamps.slice(0, 8).map((camp) => (
                <li
                  key={camp._id}
                  className="cursor-pointer px-4 py-2 hover:bg-indigo-600 hover:text-white"
                  onClick={() => {
                    setSearchTerm(camp.campName || "");
                    setShowSuggestions(false);
                  }}
                >
                  {camp.campName}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* sort + view mode + filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 rounded-2xl border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              title="Sort"
            >
              <option value="dateAsc">Date ↑</option>
              <option value="dateDesc">Date ↓</option>
              <option value="feeAsc">Fees ↑</option>
              <option value="feeDesc">Fees ↓</option>
              <option value="nameAsc">Name A–Z</option>
              <option value="nameDesc">Name Z–A</option>
            </select>
          </div>

          <label className="inline-flex items-center gap-2 text-sm bg-white/80 border border-gray-200 rounded-2xl px-3 py-2">
            <input
              type="checkbox"
              checked={showPast}
              onChange={(e) => setShowPast(e.target.checked)}
              className="accent-indigo-600"
            />
            Show past camps
          </label>

          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 border rounded ${
                viewMode === "table"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white/80 hover:bg-gray-100 border-gray-200"
              }`}
              title="Table View"
            >
              <TableIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 border rounded ${
                viewMode === "card"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white/80 hover:bg-gray-100 border-gray-200"
              }`}
              title="Card View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* content */}
      {isLoading ? (
        <Skeleton />
      ) : !isSuccess || filteredBootcamps.length === 0 ? (
        <EmptyState />
      ) : viewMode === "table" ? (
        <div className="overflow-x-auto rounded-xl border border-indigo-50 shadow bg-white/90 backdrop-blur">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-700">
                <th className="p-3">Image</th>
                <th className="p-3">Camp Name</th>
                <th className="p-3">Fees</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Location</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {currentData.map((camp, i) => {
                const expired = dayjs(camp.dateTime).isBefore(dayjs());
                return (
                  <tr
                    key={camp._id}
                    className={`transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-indigo-50`}
                  >
                    <td className="p-3">
                      <img
                        src={camp.image}
                        alt={camp.campName}
                        className="w-16 h-16 rounded object-cover border"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    </td>
                    <td className="p-3 font-medium">{camp.campName}</td>
                    <td className="p-3"><Fee value={camp.campFees} /></td>
                    <td className="p-3">{dayjs(camp.dateTime).format("MMMM D, YYYY h:mm A")}</td>
                    <td className="p-3">{camp.location}</td>
                    <td className="p-3"><StatusChip expired={expired} /></td>
                    <td className="p-3">
                      <Link to={`/camps/${camp._id}`}>
                        <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 active:scale-[0.98] transition">
                          Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* pagination */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-4">
            <div className="text-sm text-gray-600">
              Page <b>{currentPage}</b> of <b>{totalPages}</b> • Showing{" "}
              <b>{currentData.length}</b> of <b>{filteredBootcamps.length}</b>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    currentPage === page
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        // CARD VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentData.map((camp) => {
            const expired = dayjs(camp.dateTime).isBefore(dayjs());
            return (
              <div
                key={camp._id}
                className="relative bg-white/90 backdrop-blur border border-indigo-50 rounded-2xl shadow-xl p-4 hover:shadow-2xl transition group overflow-hidden"
              >
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-indigo-200 via-purple-200 to-emerald-200 opacity-30 blur-lg transition duration-300 group-hover:opacity-40" />
                <div className="relative">
                  <img
                    src={camp.image}
                    alt={camp.campName}
                    className="w-full h-44 object-cover rounded-xl mb-4"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className="absolute top-3 left-3">
                    <StatusChip expired={expired} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-indigo-700 mb-1">{camp.campName}</h3>

                <p className="text-gray-700 flex items-center gap-2">
                  <Banknote size={16} className="text-indigo-600" />
                  <Fee value={camp.campFees} />
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-600" />
                  {dayjs(camp.dateTime).format("MMMM D, YYYY h:mm A")}
                </p>
                <p className="text-gray-700 flex items-center gap-2 mb-3">
                  <MapPin size={16} className="text-indigo-600" />
                  {camp.location}
                </p>

                <Link to={`/camps/${camp._id}`}>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition">
                    View Details
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AvailableBootcamp;
