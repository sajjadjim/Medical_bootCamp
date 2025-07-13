import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useParams } from "react-router";
import { Link } from "react-router";

const CampDetails = () => {
  const  campId  = useParams() // get id from route param
  const [camp, setCamp] = useState(null);

  useEffect(() => {
    const fetchCamp = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/camps/${campId.id}`); // <-- your API
        setCamp(res.data);
      } catch (err) {
        console.error("Failed to fetch camp details", err);
      }
    };
    fetchCamp();
  }, [campId]);

  if (!camp) {
    return (
      <div className="flex justify-center items-center h-64">
      <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      </div>
    );
  }

  const isExpired = dayjs(camp.dateTime).isBefore(dayjs());

  return (
    <section className="py-10 px-4 max-w-4xl mx-auto">
      <div className="bg-white shadow-xl shadow-indigo-100 mt-20 rounded-xl overflow-hidden">
        <img
          src={camp.image}
          alt={camp.campName}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{camp.campName}</h1>
          <p className="text-gray-600 mb-4">
            {dayjs(camp.dateTime).format("MMMM D, YYYY h:mm A")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p>
                <span className="font-semibold">Fees:</span> ৳{camp.campFees}
              </p>
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {camp.location}
              </p>
              <p>
                <span className="font-semibold">Healthcare Professional:</span>{" "}
                {camp.healthcareProfessional}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Total Participants:</span>{" "}
                {camp.totalParticipant}
              </p>
              <p className="mt-2 text-gray-700">{camp.description}</p>
            </div>
          </div>

          {isExpired ? (
            <button
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded cursor-not-allowed"
              disabled
            >
              Unavailable (Expired)
            </button>
          ) : (
            <button className="mt-4 px-6 py-2 cursor-pointer bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
              <Link to={`/registration/${campId.id}`}>Join Now</Link>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CampDetails;
