import React from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";
import  useAuth from "../../../../Hook/useAuth.jsx";

const AddBootcamp = () => {
  const {user} = useAuth();
  // console.log(user?.email)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const axiosSecure = useAxiosSecure();

 const onSubmit = async (data) => {
  try {
  
    const res = await axiosSecure.post("/camps", data);
    if (res.data.insertedId) {
      Swal.fire({
        icon: "success",
        title: "Bootcamp Added!",
        text: "New bootcamp has been added successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      reset(); // only reset after success
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to add bootcamp.",
    });
  }
};


  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-indigo-500 text-center mb-8">
          Add New Bootcamp
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-md"
        >
          {/* Camp Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Camp Name
            </label>
            <input
              type="text"
              {...register("campName", { required: true })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter Camp Name"
            />
            {errors.campName && (
              <p className="text-red-500 text-sm">Camp name is required</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="text"
              {...register("image", { required: true })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && (
              <p className="text-red-500 text-sm">Image URL is required</p>
            )}
          </div>

          {/* Camp Fees */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Camp Fees (৳)
            </label>
            <input
              type="number"
              {...register("campFees", { required: true })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="1000"
            />
            {errors.campFees && (
              <p className="text-red-500 text-sm">Fees are required</p>
            )}
          </div>

          {/* Date and Time */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Date & Time
            </label>
            <input
              type="datetime-local"
              {...register("dateTime", { required: true })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.dateTime && (
              <p className="text-red-500 text-sm">Date and time are required</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              {...register("location", { required: true })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Lung Foundation, Dhaka"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">Location is required</p>
            )}
          </div>

          {/* Healthcare Professional */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Healthcare Professional
            </label>
            <input
              type="text"
              {...register("healthcareProfessional", { required: true })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Dr. Masuma Khan"
            />
            {errors.healthcareProfessional && (
              <p className="text-red-500 text-sm">
                Healthcare professional is required
              </p>
            )}
          </div>
           {/* Created Organizer  */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Organizer Email 
            </label>
            <input
              type="text"
              {...register("created_by", { required: true })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:outline-none"
              defaultValue={user?.email}
              readOnly
            />
          </div>
          {/* Description (Full Width) */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("description", { required: true })}
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Write a short description about the camp..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm">Description is required</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
            >
              Add Bootcamp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBootcamp;
