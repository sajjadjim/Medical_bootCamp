import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router";

const Section3 = () => {
  const [bootcamps, setBootcamps] = useState([]);

  useEffect(() => {
    // Simulated API call: Replace with your API endpoint
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/camps"); // <-- your API
        const sorted = res.data
          .sort((a, b) => b.totalParticipant - a.totalParticipant)
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
      <h2 className="text-3xl font-bold mb-6 text-center">
        Top Bootcamps
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2  lg:grid-cols-3">
        {bootcamps.map((camp) => (
          <div
            key={camp._id}
            className="bg-white shadow-2xl rounded-2xl shadow-indigo-200 overflow-hidden transform hover:scale-105 hover:shadow-xl transition duration-300"
          >
            <img
              src={camp.image}
              alt={camp.campName}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">
                {camp.campName}
              </h3>
              <p className="text-gray-600">
                {dayjs(camp.dateTime).format("MMMM D, YYYY h:mm A")}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="items-center grid justify-center"><Link to='/availableBootcamp' className="btn mt-5 rounded-3xl shadow-2xl bg-indigo-400 text-white hover:text-indigo-600 hover:bg-white">Show All</Link></div>
    </section>
  );
};

export default Section3;
