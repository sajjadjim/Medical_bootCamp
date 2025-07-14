import React from 'react';
import { Link } from 'react-router';
import { Typewriter } from 'react-simple-typewriter';
import { FaMicroscope, FaUsers, FaLaptopMedical, FaChevronRight } from 'react-icons/fa';

const Section2 = () => {
  const handleExploreMore = () => {
    const nextSection = document.getElementById('explore-more-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="hero bg-white md:py-20">
      <div className="hero-content flex flex-col lg:flex-row items-center gap-10 px-6 md:px-16">
        {/* Fixed image column */}
        <div className="lg:w-1/2 w-full">
          <img
            src="https://hms.harvard.edu/sites/default/files/media/Students-1.png"
            alt="Medical Camp"
            className="w-full max-w-xl rounded-xl shadow-lg border border-indigo-200"
          />
        </div>

        {/* Text content column */}
        <div className="lg:w-1/2 w-full text-left">
          <h1 className="md:text-4xl text-2xl font-extrabold text-gray-800  leading-tight">
            Medical BootCamp:{" "}
            <span className="text-indigo-600 block mt-1">
              <Typewriter
                words={['Research', 'Team Work', 'Real World Experience', 'Gain Experience']}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </span>
          </h1>

          <p className="py-4 text-gray-600 text-base">
            Dive into real-world medical scenarios, collaborate in teams, and get hands-on experience guided by professionals. Our bootcamps empower students to explore, learn, and grow in the medical field with confidence and curiosity.
          </p>

          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <FaMicroscope className="text-indigo-500" />
              Hands-on medical experiments and diagnostics
            </li>
            <li className="flex items-center gap-2">
              <FaUsers className="text-indigo-500" />
              Team collaboration with real case studies
            </li>
            <li className="flex items-center gap-2">
              <FaLaptopMedical className="text-indigo-500" />
              Access to digital tools and health tech
            </li>
          </ul>

          <div className="mt-6">
            <Link
              to="/availableBootcamp"
              onClick={handleExploreMore}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-white hover:text-indigo-600 border border-indigo-600 transition-all duration-300"
            >
              Get Started <FaChevronRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section2;
