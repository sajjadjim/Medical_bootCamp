import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaQuoteLeft, FaStar } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const FeedBack = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    axios
      .get("https://b11a12-server-side-sajjadjim.vercel.app/feedbacks/top/10")
      .then((res) => setFeedbacks(res.data || []))
      .catch((err) => console.error("Fetch failed:", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 4) % feedbacks.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [feedbacks]);

  const displayed = feedbacks.slice(currentIndex, currentIndex + 4);

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: { duration: 0.5 },
    }),
  };

  return (
    <div className="overflow-hidden p-6 md:w-10/12 mx-auto">
      <h1 className="md:text-4xl text-2xl font-bold my-8 text-center text-indigo-700">
        What Our Users Say 💬
      </h1>

      <AnimatePresence custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {displayed.map((item) => (
            <div
              key={item._id}
              className="bg-white text-gray-800 rounded-xl shadow-xl border border-indigo-400 hover:shadow-indigo-400/50 transition-all duration-300 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <FaUserCircle className="text-3xl text-indigo-600" />
                  <div>
                    <h3 className="text-lg font-semibold">{item.participantName}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <MdEmail className="mr-1" /> {item.participantEmail}
                    </div>
                  </div>
                </div>
                <p className="text-sm italic text-gray-600 mt-3 relative pl-6">
                  <FaQuoteLeft className="absolute left-0 top-1 text-indigo-300" />
                  {item.feedback}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-indigo-600 font-bold text-sm bg-indigo-100 px-3 py-1 rounded-full">
                  <FaStar className="text-yellow-500" />
                  {item.rating}/5
                </span>
                <span className="text-xs text-gray-400">#Feedback</span>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FeedBack;
