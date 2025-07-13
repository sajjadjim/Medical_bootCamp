import React from "react";
import { Stethoscope, CalendarCheck2, MapPin, ShieldPlus } from "lucide-react";
import { Link } from "react-router";

const features = [
  {
    title: "Expert Mentors",
    description: "Learn from certified medical professionals and trainers.",
    icon: <Stethoscope className="w-6 h-6 text-indigo-600" />,
  },
  {
    title: "Flexible Schedule",
    description: "Weekend and evening sessions for all types of learners.",
    icon: <CalendarCheck2 className="w-6 h-6 text-indigo-600" />,
  },
  {
    title: "Hands-On Training",
    description: "Real-time simulations and practical learning.",
    icon: <ShieldPlus className="w-6 h-6 text-indigo-600" />,
  },
  {
    title: "Nationwide Locations",
    description: "Join in your city or attend virtually.",
    icon: <MapPin className="w-6 h-6 text-indigo-600" />,
  },
];

const Section4 = () => {
  return (
    <section className="bg-white py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-indigo-600 mb-4">
          Medical Bootcamp
        </h2>
        <p className="text-gray-600 mb-10 text-lg max-w-3xl mx-auto">
          Boost your medical knowledge, hands-on experience, and career with our expert-led bootcamps designed for aspiring and practicing professionals.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex cursor-pointer flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="mb-4">{item.icon}</div>
              <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        <Link to="/availableBootcamp">
          <button className="px-6 py-3 cursor-pointer bg-indigo-600 text-white text-lg font-medium rounded-lg hover:bg-indigo-700 transition">
            Explore Bootcamps
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Section4;
