import { useEffect, useState } from "react";
import axios from "axios";
import { use } from "react";
import { AuthContext } from "../../../Auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";

const RegisterManage = () => {
  const [participants, setParticipants] = useState([]);
  const axiosSecure = useAxiosSecure()

  const { user } = use(AuthContext);
  const userEmail = user?.email;

  const { data: registerCamps = [] } = useQuery({
    queryKey: ['registrations'],
    queryFn: async () => {
      const res = await axiosSecure.get(`/registrations`);
      return res.data;
    },
  });

  // setParticipants(registerCamps)
  // console.log("All the Data Register Camps", registerCamps);
  useEffect(() => {
    const filtered = registerCamps.filter(camp => camp.ownerEmail === userEmail);
    setParticipants(filtered);
  }, [registerCamps, userEmail]);
  // console.log("object", selectCapsDataFiltered);


  // Delete participant
  const handleDelete = async (id) => {
    console.log("object", id);
    try {

      Swal.fire({
        title: "Are you sure?",
        text: "This parcel will be permanently deleted.",
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
              Swal.fire("Deleted!", "Camp has been deleted.", "success");
              // refetch(); // ✅ Refresh the camp list
            } else {
              Swal.fire("Failed", "Could not delete the camp.", "error");
            }
          } catch (error) {
            Swal.fire("Error", "Something went wrong!", "error");
            console.error("Delete error:", error);
          }
        }
      });
      ;
      // Remove from UI
      setParticipants(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error("Error deleting participant:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="md:text-3xl text-xl font-semibold text-center mb-4">Registered Participants</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Participant Name</th>
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
                    <button disabled className=" text-white px-3 py-1 rounded cursor-not-allowed">
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
