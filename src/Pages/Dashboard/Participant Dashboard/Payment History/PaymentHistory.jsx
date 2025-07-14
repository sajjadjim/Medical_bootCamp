import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaMoneyBillWave, FaHashtag, FaCreditCard, FaBoxOpen, FaClock } from 'react-icons/fa';
import useAuth from '../../../../Hook/useAuth';
import useAxiosSecure from '../../../../Hook/useAxiosSecure';

const PaymentHistory = () => {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()

    const { data: paymentsAll = [], isLoading } = useQuery({
        queryKey: ['/payments', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user?.email}`);
            return res.data;
        }
    });

    if (isLoading)  return (
    <div className="flex justify-center items-center mt-20">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

   return (
  <div className="p-4 max-w-7xl mx-auto font-inter">
    <h2 className="text-4xl font-extrabold text-center mb-10 text-indigo-700 tracking-tight drop-shadow-md">
      💳 Payment History
    </h2>

    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {paymentsAll.map((pay) => (
        <div
          key={pay._id}
          className="bg-white/80 backdrop-blur-md border border-indigo-100 shadow-xl rounded-3xl hover:shadow-indigo-300 transition-all duration-300 ease-in-out p-6 flex flex-col gap-4 relative overflow-hidden group"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-indigo-100 rounded-full opacity-30 group-hover:scale-110 transition duration-300"></div>

          {/* Amount */}
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaMoneyBillWave className="text-green-500" /> ${pay.amount}
            </h3>
            <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full capitalize font-medium shadow-sm">
              {pay.paymentMethod}
            </span>
          </div>

          {/* Transaction ID */}
          <div className="text-gray-600 text-sm flex items-center gap-2">
            <FaHashtag className="text-gray-400" />
            <span className="font-medium">TxID:</span>
            <span className="text-xs break-all">{pay.transactionId}</span>
          </div>

          {/* Parcel Info */}
          <div className="text-gray-600 text-sm flex items-center gap-2">
            <FaBoxOpen className="text-purple-500" />
            <span className="font-medium">Parcel:</span>
            <span className="text-xs font-semibold text-gray-800">{pay.campName}</span>
          </div>
          <div className="text-gray-600 text-sm flex items-center gap-2">
            <FaBoxOpen className="text-teal-400" />
            <span className="font-medium">ID:</span>
            <span className="text-xs">{pay.campId}</span>
          </div>

          {/* Email */}
          <div className="text-gray-600 text-sm flex items-center gap-2">
            <FaCreditCard className="text-yellow-500" />
            <span className="font-medium">Email:</span>
            <span className="text-xs break-all">{pay.email}</span>
          </div>

          {/* Paid At */}
          <div className="text-gray-600 text-sm flex items-center gap-2">
            <FaClock className="text-pink-500" />
            <span className="font-medium">Date:</span>
            <span className="text-xs">{new Date(pay.paid_at).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>

    {paymentsAll.length === 0 && (
      <p className="text-center mt-12 text-gray-400 text-lg">No payment records found.</p>
    )}
  </div>
);

};

export default PaymentHistory;