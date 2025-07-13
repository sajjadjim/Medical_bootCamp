import React from 'react';
import useAxiosSecure from '../../../../Hook/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../../Hook/useAuth';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useNavigate } from 'react-router';
import './style.css'

const RegisteredCamp = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: registeredCamps = [], isLoading } = useQuery({
    queryKey: ['registeredCamps', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/registrations/byEmail/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }
  const handlePayment = (id) => {
    // Navigate to the payment page with the camp ID
    navigate(`/dashboard/payment/${id}`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-primary">My Registered Camps</h2>

      {registeredCamps.length === 0 ? (
        <p className="text-center text-gray-500">No camps registered yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {registeredCamps.map((camp) => (
            <div className="animated-border-wrapper">
              <div
                key={camp._id}
                className="bg-white rounded-2xl shadow-2xl p-5 border border-gray-100 hover:shadow-lg transition duration-300"
              >
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">{camp.campName}</h3>
                <p className="text-gray-600 flex items-center gap-2"><FaUser /> {camp.participantName}</p>
                <p className="text-gray-600 flex items-center gap-2"><FaEnvelope /> {camp.participantEmail}</p>
                <p className="text-gray-600 flex items-center gap-2"><FaPhoneAlt /> {camp.phone}</p>
                <p className="text-gray-600 flex items-center gap-2"><FaMapMarkerAlt /> {camp.location}</p>
                <p className="text-gray-600">Age: <span className="font-medium">{camp.age}</span></p>
                <p className="text-gray-600">Gender: <span className="font-medium">{camp.gender}</span></p>
                <p className="text-gray-600">Camp Fee: <span className="font-semibold text-green-600">৳{camp.campFees}</span></p>
                <div className="mt-3 flex justify-between">
                  <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium
        ${camp.payment_status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {camp.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                  </span>
                  <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium
        ${camp.payment_status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {camp.payment_status === 'paid'
                      ? <p className=''>Done✔️</p>
                      : <span className='cursor-pointer' onClick={() => handlePayment(camp._id)}>Pay Now</span>}
                  </span>
                </div>
              </div>
            </div>

          ))}
        </div>
      )}
    </div>
  );
};

export default RegisteredCamp;
