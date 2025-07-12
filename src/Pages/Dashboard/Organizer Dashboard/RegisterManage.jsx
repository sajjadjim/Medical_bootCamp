import { useEffect, useState } from "react";
import axios from "axios";

const RegisterManage = () => {
  const [participants, setParticipants] = useState([]);

  // Load data from server
  useEffect(() => {
    axios.get("/registrations") // update this URL based on your backend
      .then(res => setParticipants(res.data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  // Delete participant
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/registrations/${id}`);
      // Remove from UI
      setParticipants(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error("Error deleting participant:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Registered Participants</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Gender</th>
              <th className="px-4 py-2">Camp Name</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Confirm</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p._id} className="text-center border-t">
                <td className="px-4 py-2">{p.participantName}</td>
                <td className="px-4 py-2">{p.gender}</td>
                <td className="px-4 py-2">{p.campName}</td>
                <td className="px-4 py-2">{p.location}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-white ${p.payment_status === 'paid' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {p.payment_status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {p.payment_status === 'paid' ? (
                    <span className="text-green-600 font-semibold">Confirm</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">Pending</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {p.payment_status === 'paid' ? (
                    <button disabled className="bg-gray-300 text-white px-3 py-1 rounded cursor-not-allowed">
                      Unavailable
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
            ))}
            {participants.length === 0 && (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">No registrations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisterManage;
