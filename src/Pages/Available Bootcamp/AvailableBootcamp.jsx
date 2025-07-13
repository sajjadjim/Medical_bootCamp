import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router";
import { LayoutGrid, Table } from "lucide-react";

const AvailableBootcamp = () => {
  const [bootcamps, setBootcamps] = useState([]);
  const [filteredBootcamps, setFilteredBootcamps] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'card'
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const rowsPerPage = 7;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/camps");
        const sorted = res.data.sort((a, b) =>
          a.campName.localeCompare(b.campName)
        );
        setBootcamps(sorted);
        setFilteredBootcamps(sorted);
      } catch (err) {
        console.error("Failed to fetch bootcamps", err);
      }
    };

    fetchData();
  }, []);

  // Update filtered list and suggestions as user types
  useEffect(() => {
    if (!searchTerm) {
      setFilteredBootcamps(bootcamps);
      setShowSuggestions(false);
      setCurrentPage(1);
      return;
    }

    const filtered = bootcamps
      .filter((camp) =>
        camp.campName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.campName.localeCompare(b.campName));

    setFilteredBootcamps(filtered);
    setShowSuggestions(true);
    setCurrentPage(1);
  }, [searchTerm, bootcamps]);

  const totalPages = Math.ceil(filteredBootcamps.length / rowsPerPage);

  const currentData = filteredBootcamps.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSuggestionClick = (campName) => {
    setSearchTerm(campName);
    setShowSuggestions(false);
    setCurrentPage(1);
  };

  // Close suggestions if clicked outside input/suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="py-25 px-4 max-w-10/12 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="md:text-5xl text-2xl font-bold">Available Bootcamps</h2>

        <div className="relative w-full md:w-auto" ref={inputRef}>
          <input
            type="text"
            placeholder="Search by camp name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              setShowSuggestions(true);
            }}
            className="px-3 py-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 w-full md:w-64"
          />

          {showSuggestions && filteredBootcamps.length > 0 && (
            <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded border border-gray-300 bg-white shadow-lg">
              {filteredBootcamps.slice(0, 8).map((camp) => (
                <li
                  key={camp._id}
                  className="cursor-pointer px-4 py-2 hover:bg-indigo-600 hover:text-white"
                  onClick={() => handleSuggestionClick(camp.campName)}
                >
                  {camp.campName}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 border cursor-pointer rounded ${
              viewMode === "table"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            title="Table View"
          >
            <Table size={20} />
          </button>
          <button
            onClick={() => setViewMode("card")}
            className={`p-2 border rounded cursor-pointer ${
              viewMode === "card"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            title="Card View"
          >
            <LayoutGrid size={20} />
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Image</th>
                <th className="text-left p-3">Camp Name</th>
                <th className="text-left p-3">Fees</th>
                <th className="text-left p-3">Date & Time</th>
                <th className="text-left p-3">Location</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((camp) => (
                <tr
                  key={camp._id}
                  className="border-b border-indigo-200 hover:bg-indigo-50 transition"
                >
                  <td className="p-3">
                    <img
                      src={camp.image}
                      alt={camp.campName}
                      className="w-16 h-16 rounded object-cover"
                    />
                  </td>
                  <td className="p-3 font-medium">{camp.campName}</td>
                  <td className="p-3">৳ {camp.campFees}</td>
                  <td className="p-3">
                    {dayjs(camp.dateTime).format("MMMM D, YYYY h:mm A")}
                  </td>
                  <td className="p-3">{camp.location}</td>
                  <td className="p-3">
                    <Link to={`/camps/${camp._id}`}>
                      <button className="px-3 py-1 cursor-pointer bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                        Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentData.map((camp) => (
            <div
              key={camp._id}
              className="relative bg-white border-0 rounded-lg shadow-2xl p-4 hover:shadow-lg  transition overflow-hidden group"
              style={{ zIndex: 1 }}
            >
              {/* Single animated line moving around the card */}
              <span className="pointer-events-none absolute inset-0 z-10">
                <span className="absolute top-0 left-0 w-full h-full">
                  <span className="block absolute bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-400 h-1 w-1/3 animate-border-line" />
                </span>
              </span>
              <img
                src={camp.image}
                alt={camp.campName}
                className="w-full h-48 object-cover rounded mb-4 relative z-20"
              />
              <h3 className="text-xl font-semibold text-indigo-600 mb-2 relative z-20">
                {camp.campName}
              </h3>
              <p className="text-gray-600 mb-1 relative z-20">
                <strong>Fees:</strong> ৳{camp.campFees}
              </p>
              <p className="text-gray-600 mb-1 relative z-20">
                <strong>Date:</strong>{" "}
                {dayjs(camp.dateTime).format("MMMM D, YYYY h:mm A")}
              </p>
              <p className="text-gray-600 mb-4 relative z-20">
                <strong>Location:</strong> {camp.location}
              </p>
              <Link to={`/camps/${camp._id}`}>
                <button className="px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded hover:bg-indigo-700 transition relative z-20">
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Animated border line keyframes */}
      <style>
        {`
        @keyframes border-line {
          0% {
            top: 0; left: 0; width: 33%; height: 4px; 
            transform: none;
          }
          24% {
            top: 0; left: 67%; width: 33%; height: 4px;
            transform: none;
          }
          25% {
            top: 0; left: 100%; width: 4px; height: 33%;
            transform: none;
          }
          49% {
            top: 67%; left: 100%; width: 4px; height: 33%;
            transform: none;
          }
          50% {
            top: 100%; left: 100%; width: 33%; height: 4px;
            transform: rotate(180deg);
          }
          74% {
            top: 100%; left: 0; width: 33%; height: 4px;
            transform: rotate(180deg);
          }
          75% {
            top: 100%; left: 0; width: 4px; height: 33%;
            transform: rotate(180deg);
          }
          99% {
            top: 0; left: 0; width: 4px; height: 33%;
            transform: rotate(180deg);
          }
          100% {
            top: 0; left: 0; width: 33%; height: 4px;
            transform: none;
          }
        }
        .animate-border-line {
          position: absolute;
          background: linear-gradient(90deg, #6366f1, #a5b4fc, #6366f1);
          border-radius: 2px;
          animation: border-line 8s linear infinite;
        }
        `}
      </style>
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 cursor-pointer rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 cursor-pointer rounded ${
              currentPage === page
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default AvailableBootcamp;
