import React from 'react';
import Lottie from 'lottie-react';
import forbiddenAnimation from './forbidden_network.json'; // Adjust the path as needed

const Forbidden = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-white px-4 py-8">
      <div className="w-full max-w-lg text-center">
        <Lottie
          animationData={forbiddenAnimation}
          loop
          className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] mx-auto"
        />
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mt-4">
          403 - Forbidden
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-2">
          You don’t have permission to access this page.
        </p>
      </div>
    </div>
  );
};

export default Forbidden;
