import React from 'react';
import heroVideo from '../../../assets/image-2.mp4';
import { Link } from 'react-router';

const Section1 = () => {
  return (
    <section className="relative w-full h-screen text-white overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full  bg-opacity-60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center items-start h-full px-6 md:px-12 max-w-6xl mx-auto">
        <p className="text-yellow-400 font-semibold text-sm md:text-base mb-2">
          2025 campaings
        </p>

        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-snug md:leading-tight">
           Medical Camp Management System  <br className="hidden md:block" />(MCMS)
        </h1>

        <p className="text-base md:text-lg mb-6 max-w-xl">
          Med School Bootcamp is your all-in-one resource to learn medicine and pass Step 1. Start studying for free.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Link to='/auth/register' className="bg-indigo-500 cursor-pointer hover:bg-indigo-600 text-white px-6 py-3 rounded-full text-base font-semibold transition">
            Sign up registration
          </Link>
          <button className="bg-white cursor-pointer text-gray-900 px-6 py-3 rounded-full text-base font-semibold transition hover:bg-gray-200">
            ▶ How it Works
          </button>
        </div>

        {/* Testimonial */}
        <div className="bg-white bg-opacity-10 p-4 text-black rounded-lg backdrop-blur-sm max-w-md w-full text-sm">
          <div className="flex items-center gap-2 mb-2">
            <img
              src="https://randomuser.me/api/portraits/women/65.jpg"
              alt="user"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-yellow-300 text-lg">★★★★★</span>
          </div>
          <p className="italic">
            "Bootcamp was vital to my studying success. I cannot thank Bootcamp enough for their incredible resource!"
          </p>
          <p className="font-semibold mt-2">
            Alicia Podwojniak, Passed - 1st Attempt
          </p>
        </div>
      </div>
    </section>
  );
};

export default Section1;
