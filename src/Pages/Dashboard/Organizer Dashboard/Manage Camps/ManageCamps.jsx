import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hook/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";// adjust path based on your app
import { use } from "react";
import { AuthContext } from "../../../../Auth/AuthContext";

const ManageCamps = () => {
 const axiosSecure = useAxiosSecure();
  const { user } = use(AuthContext);
  const userEmail = user?.email;
  const [selectedCamp, setSelectedCamp] = useState(null);

  //  Load data
  const { data: myCamps = [], refetch } = useQuery({
    queryKey: ["myCamps", userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(`/camps/created-by/${userEmail}`);
      return res.data;
    },
  });

  //  Delete camp
  const handleDelete = (id) => {
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
          const res = await axiosSecure.delete(`/camps/${id}`);
          if (res.data.deletedCount > 0) {
            Swal.fire("Deleted!", "Camp has been deleted.", "success");
            refetch(); // ✅ Refresh the camp list
          } else {
            Swal.fire("Failed", "Could not delete the camp.", "error");
          }
        } catch (error) {
          Swal.fire("Error", "Something went wrong!", "error");
          console.error("Delete error:", error);
        }
      }
    });
  };

  // ✅ Update camp
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      campName: form.campName.value,
      image: form.image.value,
      campFees: parseFloat(form.campFees.value),
      dateTime: form.dateTime.value,
      location: form.location.value,
      healthcareProfessional: form.healthcareProfessional.value,
      description: form.description.value,
    };

    try {
      const res = await axiosSecure.put(`/camps/update-camp/${selectedCamp._id}`, updated);
      if (res.data.modifiedCount > 0) {
        Swal.fire("Updated!", "Camp updated successfully.", "success");
        setSelectedCamp(null);
        refetch(); // ✅ Refresh the camp list
      } else {
        Swal.fire("No Change", "No updates were made.", "info");
      }
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire("Error", "Update failed!", "error");
    }
  };

return (
    <div className="min-h-screen bg-white px-4 py-10">
        <h2 className="text-3xl font-bold text-indigo-500 mb-8 text-center">
            Manage Your Camps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCamps.map((camp) => (
                <div
                    key={camp._id}
                    className="bg-white rounded-2xl shadow-2xl shadow-indigo-100 overflow-hidden hover:shadow-lg transition-shadow duration-[2000ms]"
                >
                    <div className="relative group">
                        <img
                            src={camp.image}
                            alt={camp.campName}
                            className="h-48 w-full object-cover"
                        />
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-[1500ms] bg-indigo-400 bg-opacity-40">
                            <span className="text-white text-lg font-semibold">{camp.campName}</span>
                        </div>
                    </div>
                    <div className="p-4 space-y-2">
                        <h3 className="text-xl font-bold text-indigo-600">
                            {camp.campName}
                        </h3>
                        <p className="text-sm text-gray-600">
                            <strong>Fees:</strong> ৳{camp.campFees}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Date:</strong> {new Date(camp.dateTime).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Location:</strong> {camp.location}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Doctor:</strong> {camp.healthcareProfessional}
                        </p>
                        <p className="text-sm">{camp.description}</p>

                        <div className="mt-4 flex justify-between gap-2">
                            <button
                                onClick={() => setSelectedCamp(camp)}
                                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete(camp._id)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Modal */}
        {selectedCamp && (
            <>
                <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm z-40"></div>
                <div className="fixed inset-0 z-50 flex justify-center items-center">
                    <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg relative">
                        <h3 className="text-xl font-bold text-indigo-600 mb-4">Update Camp</h3>
                        <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="campName" defaultValue={selectedCamp.campName} className="border p-2 rounded" />
                            <input name="image" defaultValue={selectedCamp.image} className="border p-2 rounded" />
                            <input name="campFees" type="number" defaultValue={selectedCamp.campFees} className="border p-2 rounded" />
                            <input name="dateTime" type="datetime-local" defaultValue={selectedCamp.dateTime?.slice(0, 16)} className="border p-2 rounded" />
                            <input name="location" defaultValue={selectedCamp.location} className="border p-2 rounded" />
                            <input name="healthcareProfessional" defaultValue={selectedCamp.healthcareProfessional} className="border p-2 rounded" />
                            <textarea name="description" defaultValue={selectedCamp.description} rows="3" className="md:col-span-2 border p-2 rounded" />
                            <div className="md:col-span-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedCamp(null)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )}
    </div>
);
};

export default ManageCamps;

