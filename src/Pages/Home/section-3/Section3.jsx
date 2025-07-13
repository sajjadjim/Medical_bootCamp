import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router";
import { FaCalendarAlt, FaUsers } from 'react-icons/fa';

const Section3 = () => {
  const [bootcamps, setBootcamps] = useState([]);

  useEffect(() => {
    // Simulated API call: Replace with your API endpoint
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/camps"); // <-- your API
        const sorted = res.data
          .sort((a, b) => b.totalCount - a.totalCount)
          .slice(0, 6);
        setBootcamps(sorted);
      } catch (err) {
        console.error("Failed to fetch bootcamps", err);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
  <h2 className="md:text-4xl text-2xl font-bold mb-15 text-center">
    Top BootCamps Registrations
  </h2>
  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    {bootcamps.map((camp) => (
      <div
        key={camp._id}
        className="bg-white shadow-2xl rounded-2xl shadow-indigo-200 overflow-hidden transform hover:scale-105 hover:shadow-indigo-500 transition duration-300"
      >
        <img
          src={camp.image}
          alt={camp.campName}
          className="w-full h-48 object-cover"
        />
        <div className="p-5">
          <h3 className="text-xl font-semibold mb-3">{camp.campName}</h3>
          <div className="flex justify-between items-center text-gray-600 mb-2">
            <p className="flex items-center gap-2 text-gray-600">
              <FaCalendarAlt className="text-indigo-500" />
              {dayjs(camp.dateTime).format("MMMM D, YYYY h:mm A")}
            </p>
            <p className="flex items-center gap-2 text-gray-600 font-semibold">
              <FaUsers className="text-indigo-500" />
              {camp.totalCount}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
  <div className="grid justify-center mt-5">
    <Link
      to="/availableBootcamp"
      className="btn rounded-3xl shadow-2xl bg-indigo-400 text-white hover:text-indigo-600 hover:bg-white transition"
    >
      Show All
    </Link>
  </div>
</section>
  );
};

export default Section3;
