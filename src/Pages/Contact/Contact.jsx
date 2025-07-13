import React from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-20 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-indigo-500 mb-4">
          Contact Us
        </h2>
        <p className="text-gray-600 text-lg">
          Have questions or feedback? We'd love to hear from you.
        </p>
      </div>

      {/* Contact Info and Form Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left - Contact Info */}
        <div className="space-y-6 bg-indigo-50  p-8 rounded-2xl shadow-xl">
          <div className="flex items-start gap-4">
            <FaMapMarkerAlt className="text-indigo-500 text-xl mt-1" />
            <div>
              <h4 className="text-lg font-semibold">Our Office</h4>
              <p className="text-gray-600">123 Main Street, Dhaka, Bangladesh</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FaPhoneAlt className="text-indigo-500 text-xl mt-1" />
            <div>
              <h4 className="text-lg font-semibold">Phone</h4>
              <p className="text-gray-600">+880 1234 567 890</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FaEnvelope className="text-indigo-500 text-xl mt-1" />
            <div>
              <h4 className="text-lg font-semibold">Email</h4>
              <p className="text-gray-600">info@example.com</p>
            </div>
          </div>
        </div>

        {/* Right - Contact Form */}
        <form className="space-y-6 bg-white p-8 rounded-2xl shadow-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your message"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
