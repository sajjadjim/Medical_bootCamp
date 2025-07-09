import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router";

const AvailableBootcamp = () => {
  const [bootcamps, setBootcamps] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/camps"); // <-- replace with your API
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
    <section className="py-8 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold my-20 text-center">
        Available Bootcamps
      </h2>

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
                className="border-b shadow-xl hover:bg-indigo-50 transition"
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

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
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
