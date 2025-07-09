import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../Hook/useAuth";
import { useParams } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hook/useAxiosSecure";

const CampRegistrationForm = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure()
  const { user } = useAuth() // Assume user has `displayName` and `email`
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [camp, setCamp] = useState([]);
  useEffect(() => {
    const fetchCamp = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/camps/${id}`); // <-- your API
        setCamp(res.data);
      } catch (err) {
        console.error("Failed to fetch camp details", err);
      }
    };

    fetchCamp();
  }, [id]);

  // console.log(camp)

  const onSubmit = (data) => {
    // console.log("Form submitted:", data);
    const registrationData = {
      ...data,
      payment_status: "unpaid",
      // campId: id,
      participantName: user?.displayName || "",
      participantEmail: user?.email || "",
      campName: camp.campName || "",
      campFees: camp.campFees || "",
      location: camp.location || "",
    }
    // Open a feedback and rating modal using SweetAlert2
    Swal.fire({
      title: "Registration Successful!",
      text: "You have successfully registered for the camp. Please rate your registration experience.",
      icon: "success",
      confirmButtonColor: "#6366f1",
      html: `
      <label for="rating">Rating:</label>
      <select id="rating" class="swal2-input">
        <option value="">Select</option>
        <option value="5">⭐⭐⭐⭐⭐</option>
        <option value="4">⭐⭐⭐⭐</option>
        <option value="3">⭐⭐⭐</option>
        <option value="2">⭐⭐</option>
        <option value="1">⭐</option>
      </select>
      <label for="feedback">Feedback:</label>
      <textarea id="feedback" class="swal2-textarea" placeholder="Your feedback"></textarea>
      `,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: "Submit",
      allowOutsideClick: false,
      preConfirm: () => {
        const rating = document.getElementById('rating').value;
        const feedback = document.getElementById('feedback').value;
        if (!rating) {
          Swal.showValidationMessage('Please select a rating');
        }
        return { rating, feedback };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Store feedback and rating to the database
        try {
          await axios.post("http://localhost:3000/feedbacks", {
            campId: id,
            participantName: user?.displayName || "",
            participantEmail: user?.email || "",
            rating: result.value.rating,
            feedback: result.value.feedback,
            date: new Date().toISOString()
          });
          Swal.fire({
            icon: "success",
            title: "Thank you!",
            text: "Your feedback has been submitted.",
            confirmButtonColor: "#6366f1"
          }).then(() => {
            // Redirect to dashboard after feedback
            window.location.href = "/dashboard";
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to submit feedback. Please try again.",
            confirmButtonColor: "#6366f1"
          });
        }
      }
    });

    // store registration on the Database 
    const response = axiosSecure.post("/registrations", registrationData)
    console.log(response.data)

    // Increment totalParticipant for the camp after registration
    const registerForCamp = async (campId) => {
      try {
        const res = await axios.post(`http://localhost:5000/camps/${campId}`);
        console.log(res.data.message);
        console.log(res.data.camp); // updated camp data
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    registerForCamp(id);
    // console.log("Registration from data:", registrationData);
    // Here you can call your API to submit data
  };

  return (
    <div className="md:w-9/12 mx-auto p-4 my-25 bg-white shadow-2xl rounded-xl">
      <h2 className="md:text-3xl text-2xl  text-center font-bold mb-4">Register for BootCamp</h2>
      <p className="text-center my-5">Registration the BootCamp and grab a oportunity works with people.</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1  lg:grid-cols-2 gap-4"
      >
        {/* Read-only fields */}
        <div>
          <label className="block text-sm font-medium">Camp Name</label>
          <input
            type="text"
            value={camp.campName}
            readOnly
            className="w-full px-4 py-3 mt-2 text-gray-400 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Camp Fees</label>
          <input
            type="text"
            value={`Taka ${camp.campFees}`}
            readOnly
            className="w-full px-4 py-3 mt-2 rounded-xl text-gray-400 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            value={camp.location}
            readOnly
            className="w-full px-4 py-3 mt-2 rounded-xl text-gray-400 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Healthcare Professional</label>
          <input
            type="text"
            value={camp.healthcareProfessional}
            readOnly
            className="w-full px-4 py-3 mt-2 rounded-xl text-gray-400 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Logged-in user info */}
        <div>
          <label className="block text-sm font-medium">Participant Name</label>
          <input
            type="text"
            value={user?.displayName || ""}
            readOnly
            className="w-full px-4 py-3 mt-2 text-gray-400 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Participant Email</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full px-4 py-3 mt-2 text-gray-400 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Editable fields */}
        <div>
          <label className="block text-sm font-medium">Age</label>
          <input
            type="number"
            {...register("age", { required: "Age is required", min: 1 })}
            className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
          {errors.age && (
            <p className="text-red-500 text-sm">{errors.age.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="text"
            {...register("phone", { required: "Phone number is required" })}
            className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select
            {...register("gender", { required: "Gender is required" })}
            className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Emergency Contact</label>
          <input
            type="text"
            {...register("emergencyContact", {
              required: "Emergency contact is required",
            })}
            className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
          {errors.emergencyContact && (
            <p className="text-red-500 text-sm">
              {errors.emergencyContact.message}
            </p>
          )}
        </div>

        {/* Submit button: full width */}
        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 my-5 cursor-pointer shadow-xl shadow-indigo-200  text-white py-3 rounded-xl hover:bg-indigo-700 "
          >
            {isSubmitting ? "Submitting..." : "Register"}
          </button>
        </div>
      </form>

    </div>
  );
};

export default CampRegistrationForm;
