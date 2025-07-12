import React, { useState } from 'react';
import useAxiosSecure from '../../../Hook/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { FaUsers, FaMoneyBillWave, FaClipboardList, FaMoneyCheckAlt } from "react-icons/fa";
import { use } from 'react';
import { AuthContext } from '../../../Auth/AuthContext';

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
    // console.log(camps)

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

    // console.log("Selected camp name:", selectName);

    // assume selectName is state
    const { data: selectCapsData = [] } = useQuery({
        queryKey: ['selectedCampStats', selectName],
        queryFn: async () => {
            const res = await axiosSecure.get(`/registrations/stats/${selectName}`);
            return res.data;
        },
    });

    const { data: registerCamps = [] } = useQuery({
        queryKey: ['registrations'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/registrations`);
            return res.data;
        },
    });

    // console.log("All the Data Register Camps", registerCamps);
    const selectCapsDataFiltered = registerCamps.filter(camp => camp.ownerEmail == userEmail);
    // setSelectedCamps(selectCapsDataFiltered);
    console.log(selectCapsDataFiltered)


    return (
       <div className="w-full px-4 md:px-8 py-6">
  {/* Header & Pie Chart */}
  <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 mb-10">
    <h2 className="text-2xl md:text-4xl font-bold text-center text-blue-600 mb-6">
      Payment Status Overview
    </h2>
    <div className="w-full h-72">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
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
  <div className="w-full max-w-md mx-auto flex flex-col items-center space-y-3 mb-8">
    <label
      htmlFor="camp-select"
      className="text-lg font-semibold text-gray-700"
    >
      Select Camp:
    </label>
    <select
      id="camp-select"
      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
    <div className="w-full flex justify-center">
      <div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300">
        <h3 className="text-2xl font-bold text-center text-blue-600 mb-5 flex items-center justify-center gap-2">
          <FaClipboardList className="text-blue-500" />
          {selectCapsData.campName}
        </h3>

        {/* Total Registrations */}
        <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg mb-3">
          <div className="flex items-center gap-3 text-blue-700 font-medium">
            <FaUsers className="text-lg" />
            Total:
          </div>
          <span className="font-bold text-lg text-blue-900">
            {selectCapsData.totalRegistrations}
          </span>
        </div>

        {/* Paid Registrations */}
        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg mb-3">
          <div className="flex items-center gap-3 text-green-700 font-medium">
            <FaMoneyBillWave className="text-lg" />
            Paid:
          </div>
          <span className="font-bold text-lg text-green-900">
            {selectCapsData.paidRegistrations}
          </span>
        </div>

        {/* Unpaid Registrations */}
        <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
          <div className="flex items-center gap-3 text-red-700 font-medium">
            <FaMoneyCheckAlt className="text-lg" />
            Unpaid:
          </div>
          <span className="font-bold text-lg text-red-900">
            {selectCapsData.totalRegistrations -
              selectCapsData.paidRegistrations}
          </span>
        </div>
      </div>
    </div>
  )}
</div>

    );
};

export default ManageRegisteredCamp;