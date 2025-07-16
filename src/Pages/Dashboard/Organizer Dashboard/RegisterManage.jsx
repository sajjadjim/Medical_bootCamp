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

const RegisterManage = () => {
  const [participants, setParticipants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const axiosSecure = useAxiosSecure();

  // Replace this with your actual auth context hook or logic
  const user = { email: "sajjadjim15@gmail.com" };
  const userEmail = user?.email;

  const { data: registerCamps = [] } = useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/registrations`);
      return res.data;
    },
  });

  useEffect(() => {
    const filtered = registerCamps.filter((camp) => camp.ownerEmail === userEmail);
    setParticipants(filtered);
    setCurrentPage(1); // reset to page 1 when data changes
  }, [registerCamps, userEmail]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return participants.slice(start, start + itemsPerPage);
  }, [participants, currentPage]);

  const totalPages = Math.ceil(participants.length / itemsPerPage);

  const chartData = useMemo(() => {
    const grouped = {};
    participants.forEach(({ campName, payment_status }) => {
      if (!grouped[campName]) {
        grouped[campName] = { name: campName, paid: 0, unpaid: 0 };
      }
      if (payment_status === "paid") {
        grouped[campName].paid += 1;
      } else {
        grouped[campName].unpaid += 1;
      }
    });
    return Object.values(grouped);
  }, [participants]);

  const handleDelete = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "This registration will be permanently deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await axiosSecure.delete(`/registrations/${id}`);
            if (res.data.deletedCount > 0) {
              Swal.fire("Deleted!", "Registration has been deleted.", "success");
              setParticipants((prev) => prev.filter((p) => p._id !== id));
            } else {
              Swal.fire("Failed", "Could not delete the registration.", "error");
            }
          } catch (error) {
            Swal.fire("Error", "Something went wrong!", "error");
            console.error("Delete error:", error);
          }
        }
      });
    } catch (err) {
      console.error("Error deleting participant:", err);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="md:text-3xl text-xl font-semibold text-center mb-4">Registered Participants</h2>

      {/* Responsive table wrapper */}
      <div className="overflow-x-auto mb-10 rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left whitespace-nowrap">Participant Name</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Gender</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Camp Name</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Location</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Confirm</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No registrations found.
                </td>
              </tr>
            ) : (
              paginatedData.map((p) => (
                <tr key={p._id} className="border-t hover:bg-indigo-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">{p.participantName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{p.gender}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{p.campName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{p.location}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        p.payment_status === "paid" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {p.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-semibold">
                    {p.payment_status === "paid" ? (
                      <span className="text-green-600">Confirm</span>
                    ) : (
                      <span className="text-yellow-600">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {p.payment_status === "paid" ? (
                      <button disabled className="text-gray-400 cursor-not-allowed px-3 py-1 rounded">
                        ❌
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 space-x-2 p-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages).keys()].map((n) => (
            <button
              key={n}
              onClick={() => setCurrentPage(n + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === n + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {n + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-center">Payment Status per BootCamp</h3>
        {chartData.length === 0 ? (
          <p className="text-center text-gray-500">No data to display.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300} minWidth={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="paid" stackId="a" fill="#4f46e5" name="Paid" />
              <Bar dataKey="unpaid" stackId="a" fill="#a78bfa" name="Unpaid" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RegisterManage;
