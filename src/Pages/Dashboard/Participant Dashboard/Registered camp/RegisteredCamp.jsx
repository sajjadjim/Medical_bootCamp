import React from 'react';
import useAxiosSecure from '../../../../Hook/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../../Hook/useAuth';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import './style.css';

const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100 shadow animate-pulse p-5">
          <div className="h-6 w-2/3 bg-gray-200 rounded mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
          </div>
          <div className="mt-4 h-8 w-24 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const EmptyState = ({ onExplore }) => (
  <div className="max-w-xl mx-auto text-center bg-white rounded-2xl border border-indigo-50 shadow p-10">
    <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-3">
      <span className="text-indigo-600 text-2xl">🧭</span>
    </div>
    <h3 className="text-xl font-semibold mb-1">No camps registered yet</h3>
    <p className="text-gray-600 mb-5">Browse available bootcamps and claim your spot.</p>
    <button
      onClick={onExplore}
      className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md active:scale-[0.98] transition"
    >
      Explore Camps
    </button>
  </div>
);

const RegisteredCamp = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: registeredCamps = [], isLoading } = useQuery({
    queryKey: ['registeredCamps', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/registrations/byEmail/${user?.email}`);
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  const handlePayment = (id) => {
    navigate(`/dashboard/payment/${id}`);
  };

  const goExplore = () => navigate('/availableBootcamp');

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col items-center gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-center tracking-tight">
          My Registered Camps
        </h2>
        <p className="text-gray-600 text-center">
          Keep track of your registrations and payments at a glance.
        </p>
      </div>

      {registeredCamps.length === 0 ? (
        <EmptyState onExplore={goExplore} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {registeredCamps.map((camp) => {
            const isPaid = camp.payment_status === 'paid';
            const fee = Number(camp.campFees) || 0;
            return (
              <div key={camp._id} className="animated-border-wrapper">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-5 hover:shadow-2xl transition duration-300 relative overflow-hidden">
                  {/* Ribbon */}
                  <div
                    className={`absolute -right-10 top-4 rotate-45 px-10 py-1 text-xs font-semibold text-white shadow ${
                      isPaid ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {isPaid ? 'PAID' : 'UNPAID'}
                  </div>

                  <h3 className="text-xl font-semibold text-indigo-600 mb-3 pr-12">
                    {camp.campName || 'Untitled Camp'}
                  </h3>

                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center gap-2">
                      <FaUser className="text-indigo-500" />
                      <span className="truncate">{camp.participantName || '—'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaEnvelope className="text-indigo-500" />
                      <span className="truncate">{camp.participantEmail || '—'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaPhoneAlt className="text-indigo-500" />
                      <span>{camp.phone || '—'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-indigo-500" />
                      <span className="truncate">{camp.location || '—'}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <span className="text-sm text-gray-600">
                        Age: <span className="font-medium">{camp.age || '—'}</span>
                      </span>
                      <span className="text-sm text-gray-600">
                        Gender: <span className="font-medium capitalize">{camp.gender || '—'}</span>
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-gray-600">
                        Camp Fee:{' '}
                        <span className="font-semibold text-green-600">৳{fee.toLocaleString()}</span>
                      </span>

                      <span
                        className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                          isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <button
                      onClick={() => navigate(`/camp/${camp.campId || ''}`)}
                      className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50 active:scale-[0.98] transition"
                    >
                      Details
                    </button>

                    <button
                      onClick={() => handlePayment(camp._id)}
                      disabled={isPaid}
                      className={`px-4 py-2 rounded-lg text-white shadow-md active:scale-[0.98] transition ${
                        isPaid
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                      }`}
                    >
                      {isPaid ? 'Payment Done ✔' : 'Pay Now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RegisteredCamp;
