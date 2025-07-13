import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router";
import { LayoutGrid, Table } from "lucide-react";

const AvailableBootcamp = () => {
  const [bootcamps, setBootcamps] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'card'

  const rowsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/camps");
        setBootcamps(res.data);
      } catch (err) {
        console.error("Failed to fetch bootcamps", err);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(bootcamps.length / rowsPerPage);

  const currentData = bootcamps.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="py-25 px-4 max-w-10/12 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Available Bootcamps</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 border cursor-pointer rounded ${viewMode === "table" ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            title="Table View"
          >
            <Table size={20} />
          </button>
          <button
            onClick={() => setViewMode("card")}
            className={`p-2 border rounded cursor-pointer ${viewMode === "card" ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
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
              className="bg-white rounded-lg shadow-2xl p-4 hover:shadow-lg border-r-6 border-b-3 border-indigo-400 transition"
            >
              <img
                src={camp.image}
                alt={camp.campName}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                {camp.campName}
              </h3>
              <p className="text-gray-600 mb-1">
                <strong>Fees:</strong> ৳{camp.campFees}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Date:</strong>{" "}
                {dayjs(camp.dateTime).format("MMMM D, YYYY h:mm A")}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Location:</strong> {camp.location}
              </p>
              <Link to={`/camps/${camp._id}`}>
                <button className="px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
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
