import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";
import useAuth from "../../../../Hook/useAuth.jsx";
import {
  Calendar,
  MapPin,
  User2,
  Image as ImageIcon,
  DollarSign,
  FileText as FileTextIcon,
  Mail,
  Check,
  X,
} from "lucide-react";

const Field = ({ icon: Icon, children }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      <Icon size={18} />
    </span>
    <div className="pl-10">{children}</div>
  </div>
);

const AddBootcamp = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      campName: "",
      image: "",
      campFees: "",
      dateTime: "",
      location: "",
      healthcareProfessional: "",
      created_by: user?.email || "",
      description: "",
    },
  });

  const [preview, setPreview] = useState("");

  const imageUrl = watch("image");
  const description = watch("description") || "";
  const fee = watch("campFees");

  // Update image preview
  useMemo(() => {
    if (imageUrl && /^https?:\/\//i.test(imageUrl)) setPreview(imageUrl);
    else setPreview("");
  }, [imageUrl]);

  // Min date-time: now (local)
  const minDateTimeLocal = useMemo(() => {
    const pad = (n) => String(n).padStart(2, "0");
    const d = new Date();
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const h = pad(d.getHours());
    const mm = pad(d.getMinutes());
    return `${y}-${m}-${day}T${h}:${mm}`;
  }, []);

  const onSubmit = async (data) => {
    try {
      // Basic transform
      const payload = {
        ...data,
        campFees: Number(data.campFees),
      };

      const res = await axiosSecure.post("/camps", payload);
      if (res?.data?.insertedId) {
        await Swal.fire({
          icon: "success",
          title: "Bootcamp Added!",
          text: "New bootcamp has been added successfully.",
          timer: 1800,
          showConfirmButton: false,
        });
        reset({
          campName: "",
          image: "",
          campFees: "",
          dateTime: "",
          location: "",
          healthcareProfessional: "",
          created_by: user?.email || "",
          description: "",
        });
        setPreview("");
      } else {
        throw new Error("No insertedId returned");
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add bootcamp.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="rounded-2xl overflow-hidden shadow-xl mb-6 border border-indigo-100">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <LayoutMark />
              Add New Bootcamp
            </h2>
            <p className="text-indigo-100 mt-1">
              Create a new medical bootcamp with all the necessary details.
            </p>
          </div>

          {/* Quick summary row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white">
            <div className="rounded-xl border border-gray-100 p-3">
              <div className="text-xs text-gray-500">Organizer</div>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-indigo-500" />
                <span className="truncate">{user?.email || "—"}</span>
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 p-3">
              <div className="text-xs text-gray-500">Currency</div>
              <div className="text-sm font-medium text-gray-800">BDT (৳)</div>
            </div>
            <div className="rounded-xl border border-gray-100 p-3">
              <div className="text-xs text-gray-500">Status</div>
              <div className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Check size={14} /> Ready to Create
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-indigo-50 p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Camp Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Camp Name</label>
            <Field icon={FileTextIcon}>
              <input
                type="text"
                {...register("campName", { required: "Camp name is required", minLength: { value: 3, message: "At least 3 characters" } })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="Enter Camp Name"
              />
            </Field>
            {errors.campName && <p className="text-red-500 text-sm mt-1">{errors.campName.message}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Image URL</label>
            <Field icon={ImageIcon}>
              <input
                type="url"
                {...register("image", {
                  required: "Image URL is required",
                  pattern: { value: /^https?:\/\/.+/i, message: "Enter a valid URL starting with http/https" },
                })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="https://example.com/image.jpg"
                onBlur={(e) => setPreview(e.target.value)}
              />
            </Field>
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
            {/* Preview */}
            {preview ? (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg border border-gray-100"
                  onError={() => setPreview("")}
                />
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-2">Image preview appears here.</p>
            )}
          </div>

          {/* Camp Fees */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Camp Fees (৳)</label>
            <Field icon={DollarSign}>
              <input
                type="number"
                step="1"
                min="0"
                {...register("campFees", {
                  required: "Fees are required",
                  min: { value: 0, message: "Must be ≥ 0" },
                })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="1000"
              />
            </Field>
            <div className="flex justify-between text-xs mt-1 text-gray-500">
              <span>Currency: BDT</span>
              <span>Preview: {fee ? `৳${Number(fee).toLocaleString()}` : "৳0"}</span>
            </div>
            {errors.campFees && <p className="text-red-500 text-sm mt-1">{errors.campFees.message}</p>}
          </div>

          {/* Date and Time */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Date & Time</label>
            <Field icon={Calendar}>
              <input
                type="datetime-local"
                min={minDateTimeLocal}
                {...register("dateTime", { required: "Date and time are required" })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </Field>
            <p className="text-xs text-gray-500 mt-1">Must be today or later.</p>
            {errors.dateTime && <p className="text-red-500 text-sm mt-1">{errors.dateTime.message}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Location</label>
            <Field icon={MapPin}>
              <input
                type="text"
                {...register("location", { required: "Location is required", minLength: { value: 3, message: "At least 3 characters" } })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="Lung Foundation, Dhaka"
              />
            </Field>
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
          </div>

          {/* Healthcare Professional */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Healthcare Professional</label>
            <Field icon={User2}>
              <input
                type="text"
                {...register("healthcareProfessional", { required: "Healthcare professional is required" })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="Dr. Masuma Khan"
              />
            </Field>
            {errors.healthcareProfessional && (
              <p className="text-red-500 text-sm mt-1">{errors.healthcareProfessional.message}</p>
            )}
          </div>

          {/* Organizer Email (read-only) */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Organizer Email</label>
            <Field icon={Mail}>
              <input
                type="email"
                {...register("created_by", { required: true })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 focus:outline-none"
                defaultValue={user?.email}
                readOnly
              />
            </Field>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-gray-700">Description</label>
            <textarea
              {...register("description", { required: "Description is required", maxLength: { value: 800, message: "Max 800 characters" } })}
              rows="5"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Write a short description about the camp..."
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Make it concise but informative.</span>
              <span>{description.length}/800</span>
            </div>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                reset({
                  campName: "",
                  image: "",
                  campFees: "",
                  dateTime: "",
                  location: "",
                  healthcareProfessional: "",
                  created_by: user?.email || "",
                  description: "",
                });
                setPreview("");
              }}
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 active:scale-[0.99] transition"
              disabled={isSubmitting}
            >
              <X size={16} /> Clear
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 shadow
                ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700 active:scale-[0.99]"}`}
            >
              <Check size={16} />
              {isSubmitting ? "Adding..." : "Add Bootcamp"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Tiny visual mark in header
const LayoutMark = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" className="text-white">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="white" />
        <stop offset="100%" stopColor="#c7d2fe" />
      </linearGradient>
    </defs>
    <rect x="3" y="4" width="8" height="6" rx="2" fill="url(#g)" />
    <rect x="13" y="4" width="8" height="6" rx="2" fill="url(#g)" opacity="0.85" />
    <rect x="3" y="12" width="18" height="8" rx="2" fill="url(#g)" opacity="0.7" />
  </svg>
);

export default AddBootcamp;
