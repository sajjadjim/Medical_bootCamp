import React, { useContext, useMemo, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hook/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../../Auth/AuthContext";
import {
  Pencil,
  Trash2,
  MapPin,
  Calendar,
  Banknote,
  Stethoscope,
  Image as ImageIcon,
  X,
  Check,
} from "lucide-react";

const Fee = ({ value }) => (
  <span className="font-semibold text-green-600">
    ৳{Number(value || 0).toLocaleString()}
  </span>
);

const ManageCamps = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const userEmail = user?.email;

  const [selectedCamp, setSelectedCamp] = useState(null);
  const [preview, setPreview] = useState("");

  // Min date-time (local now)
  const minDateTimeLocal = useMemo(() => {
    const pad = (n) => String(n).padStart(2, "0");
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
      d.getMinutes()
    )}`;
  }, []);

  // Load data
  const {
    data: myCamps = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["myCamps", userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(`/camps/created-by/${userEmail}`);
      return res.data || [];
    },
  });

  // Delete camp
  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete this camp?",
      text: "This camp will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/camps/${id}`);
          if (res.data.deletedCount > 0) {
            Swal.fire("Deleted!", "Camp has been deleted.", "success");
            refetch();
          } else {
            Swal.fire("Failed", "Could not delete the camp.", "error");
          }
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire("Error", "Something went wrong!", "error");
        }
      }
    });
  };

  // Update camp
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      campName: form.campName.value.trim(),
      image: form.image.value.trim(),
      campFees: parseFloat(form.campFees.value) || 0,
      dateTime: form.dateTime.value,
      location: form.location.value.trim(),
      healthcareProfessional: form.healthcareProfessional.value.trim(),
      description: form.description.value.trim(),
    };
    try {
      const res = await axiosSecure.put(`/camps/update-camp/${selectedCamp._id}`, updated);
      if (res.data.modifiedCount > 0) {
        Swal.fire("Updated!", "Camp updated successfully.", "success");
        setSelectedCamp(null);
        setPreview("");
        refetch();
      } else {
        Swal.fire("No Change", "No updates were made.", "info");
      }
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire("Error", "Update failed!", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-10">
      <h2 className="text-3xl font-bold text-indigo-600 mb-8 text-center">
        Manage Your Camps
      </h2>

      {myCamps.length === 0 ? (
        <div className="max-w-xl mx-auto text-center bg-white/90 backdrop-blur rounded-2xl border border-indigo-50 shadow p-10">
          <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-3">
            📭
          </div>
          <p className="text-gray-600">You haven’t created any camps yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {myCamps.map((camp) => (
            <div key={camp._id} className="relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-indigo-200 via-purple-200 to-emerald-200 opacity-30 blur-lg transition duration-300 group-hover:opacity-40" />
              <div className="relative bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/60 overflow-hidden group">
                {/* Image */}
                <div className="relative">
                  <img
                    src={camp.image}
                    alt={camp.campName}
                    className="h-44 w-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs bg-white/90 text-indigo-700 border border-indigo-100">
                      {new Date(camp.dateTime).toLocaleDateString()}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs bg-white/90 text-green-700 border border-green-100">
                      <Fee value={camp.campFees} />
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-bold text-indigo-700 line-clamp-1">
                    {camp.campName}
                  </h3>

                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-500" />
                    {new Date(camp.dateTime).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin size={16} className="text-indigo-500" />
                    <span className="truncate">{camp.location}</span>
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Stethoscope size={16} className="text-indigo-500" />
                    {camp.healthcareProfessional}
                  </p>

                  <p className="text-sm text-gray-700 line-clamp-3">
                    {camp.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCamp(camp);
                        setPreview(camp.image || "");
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition active:scale-[0.98]"
                    >
                      <Pencil size={16} />
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(camp._id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition active:scale-[0.98]"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      {selectedCamp && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-indigo-50 overflow-hidden">
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <h3 className="text-lg font-bold text-indigo-700">Update Camp</h3>
                <button
                  onClick={() => {
                    setSelectedCamp(null);
                    setPreview("");
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal content */}
              <form onSubmit={handleUpdateSubmit} className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Camp Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Camp Name
                  </label>
                  <input
                    name="campName"
                    defaultValue={selectedCamp.campName}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>

                {/* Image URL & preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <ImageIcon size={18} />
                    </span>
                    <input
                      name="image"
                      defaultValue={selectedCamp.image}
                      onBlur={(e) => setPreview(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-2 w-full h-32 object-cover rounded-lg border"
                      onError={() => setPreview("")}
                    />
                  ) : (
                    <p className="text-xs text-gray-400 mt-2">Image preview appears here.</p>
                  )}
                </div>

                {/* Fees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Camp Fees (৳)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Banknote size={18} />
                    </span>
                    <input
                      name="campFees"
                      type="number"
                      min="0"
                      step="1"
                      defaultValue={selectedCamp.campFees}
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                </div>

                {/* DateTime */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Calendar size={18} />
                    </span>
                    <input
                      name="dateTime"
                      type="datetime-local"
                      min={minDateTimeLocal}
                      defaultValue={selectedCamp.dateTime?.slice(0, 16)}
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <MapPin size={18} />
                    </span>
                    <input
                      name="location"
                      defaultValue={selectedCamp.location}
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                </div>

                {/* Doctor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Healthcare Professional
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Stethoscope size={18} />
                    </span>
                    <input
                      name="healthcareProfessional"
                      defaultValue={selectedCamp.healthcareProfessional}
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={selectedCamp.description}
                    rows="4"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCamp(null);
                      setPreview("");
                    }}
                    className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    <Check size={16} />
                    Save Changes
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
