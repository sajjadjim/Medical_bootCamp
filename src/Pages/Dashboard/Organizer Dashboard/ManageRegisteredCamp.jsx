import React, { useState } from 'react';
import useAxiosSecure from '../../../Hook/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { FaUsers, FaMoneyBillWave, FaClipboardList, FaMoneyCheckAlt } from "react-icons/fa";
import { use } from 'react';
import { AuthContext } from '../../../Auth/AuthContext';
import ManageCamps from './Manage Camps/ManageCamps';
import RegisterManage from './RegisterManage';

const ManageRegisteredCamp = () => {
  const { user } = use(AuthContext);
  const userEmail = user?.email;
  // console.log(userEmail);
  const [selectedCamps, setSelectedCamps] = useState(null);

  const axiosSecure = useAxiosSecure();
  const { data: paymentsAll = [] } = useQuery({
    queryFn: async () => {
      const res = await axiosSecure.get(`/registrations`);
      return res.data;
    }
  });
  // console.log("All bootCamp Paymnent", paymentsAll)
  const paidPayments = paymentsAll.filter(payment => payment.payment_status === "paid");
  const unpaidPayments = paymentsAll.filter(payment => payment.payment_status === "unpaid");
  const data = [
    { "name": 'Paid', value: paidPayments.length },
    { "name": 'Unpaid', value: unpaidPayments.length },
  ];
  const COLORS = ['#00C49F', '#FF8042'];

  // Fetch all camps data To the show here :
  const { data: camps = [] } = useQuery({
    queryKey: ['camps'],
    queryFn: async () => {
      const res = await axiosSecure.get('/camps');
      return res.data;
    }
  });

  const [selectName, setSelectedName] = useState("");
  // on console show that name 
  const handleCampSelect = (e) => {
    const selectedCampId = e.target.value;
    const selectedCamp = camps.find(camp => camp._id === selectedCampId);
    // console.log("Selected camp id:", selectedCampId);
    if (selectedCamp) {
      // console.log("Selected camp name:", selectedCamp.campName);
      setSelectedName(selectedCamp.campName);
    }

  };

  // assume selectName is state
  const { data: selectCapsData = [] } = useQuery({
    queryKey: ['selectedCampStats', selectName],
    queryFn: async () => {
      const res = await axiosSecure.get(`/registrations/stats/${selectName}`);
      return res.data;
    },
  });

  return (
    <div className="w-full px-4 md:px-8 py-6">
      {/* Header & Pie Chart */}
      <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-4 sm:p-6 mb-10">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-center text-blue-600 mb-6">
          Payment Status Overview
        </h2>
        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Select Dropdown */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center space-y-2 sm:space-y-3 mb-8">
        <label
          htmlFor="camp-select"
          className="text-base sm:text-lg font-semibold text-gray-700 text-center"
        >
          Select Camp:
        </label>
        <select
          id="camp-select"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          onChange={handleCampSelect}
        >
          <option value="">All Camps</option>
          {camps.map((camp) => (
            <option key={camp._id} value={camp._id}>
              {camp.campName}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Camp Stats Card */}
      {selectName && selectCapsData && (
        <div className="w-full flex justify-center px-2">
          <div className="w-full max-w-sm p-4 sm:p-6 bg-white border border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300">
            <h3 className="text-xl sm:text-2xl font-bold text-center text-blue-600 mb-5 flex items-center justify-center gap-2">
              <FaClipboardList className="text-blue-500" />
              {selectCapsData.campName}
            </h3>

            {/* Total Registrations */}
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg mb-3 text-sm sm:text-base">
              <div className="flex items-center gap-2 sm:gap-3 text-blue-700 font-medium">
                <FaUsers className="text-base sm:text-lg" />
                Total:
              </div>
              <span className="font-bold text-blue-900">
                {selectCapsData.totalRegistrations}
              </span>
            </div>

            {/* Paid Registrations */}
            <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg mb-3 text-sm sm:text-base">
              <div className="flex items-center gap-2 sm:gap-3 text-green-700 font-medium">
                <FaMoneyBillWave className="text-base sm:text-lg" />
                Paid:
              </div>
              <span className="font-bold text-green-900">
                {selectCapsData.paidRegistrations}
              </span>
            </div>

            {/* Unpaid Registrations */}
            <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg text-sm sm:text-base">
              <div className="flex items-center gap-2 sm:gap-3 text-red-700 font-medium">
                <FaMoneyCheckAlt className="text-base sm:text-lg" />
                Unpaid:
              </div>
              <span className="font-bold text-red-900">
                {selectCapsData.totalRegistrations - selectCapsData.paidRegistrations}
              </span>
            </div>
          </div>
        </div>
      )}
      <RegisterManage />
    </div>


  );
};

export default ManageRegisteredCamp;