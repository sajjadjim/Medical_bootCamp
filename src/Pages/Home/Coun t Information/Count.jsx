import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { FaUsers, FaChalkboardTeacher, FaClipboardList } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import useFreeAxios from '../../../Hook/useAxios';

const Count = () => {
    const [userCount, setUserCount] = useState(0);
    const [bootcampCount, setBootcampCount] = useState(0);
    const [registrationCount, setRegistrationCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const axiosInstance = useFreeAxios();

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setUserCount(3000);
            setBootcampCount(25);
            setRegistrationCount(780);
            setLoading(false);
        }, 1000);
    }, []);

    const { data: campsData } = useQuery({
        queryKey: ['camps'],
        queryFn: async () => {
            const res = await axiosInstance.get('/camps/stats/count');
            return res.data;
        },
    });

    const { data: registrationData } = useQuery({
        queryKey: ['registrations'],
        queryFn: async () => {
            const res = await axiosInstance.get('/registrations/stats/count');
            return res.data;
        },
    });

    const { data: usersData } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosInstance.get('/users/stats/count');
            return res.data;
        },
    });

    const userNumbers = usersData?.totalUsers || 0;
    const campsNumber = campsData?.totalCamps || 0;
    const registrationNumbers = registrationData?.totalRegistrations || 0;

    const cardData = [
        {
            label: 'Users',
            count: userNumbers,
            icon: <FaUsers className="text-white w-8 h-8" />,
            bg: 'bg-indigo-600',
        },
        {
            label: 'BootCamps',
            count: campsNumber,
            icon: <FaChalkboardTeacher className="text-white w-8 h-8" />,
            bg: 'bg-green-600',
        },
        {
            label: 'Registrations',
            count: registrationNumbers,
            icon: <FaClipboardList className="text-white w-8 h-8" />,
            bg: 'bg-pink-600',
        },
    ];

    return (
        <div className="2xl:max-w-7xl md:max-w-6xl mx-auto md:mb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {cardData.map(({ label, count, icon, bg }) => (
                <div
                    key={label}
                    className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center text-center border border-gray-200 hover:shadow-indigo-300 transition-all duration-300 group"
                >
                    {/* Decorative Icon Badge */}
                    <div className={`rounded-full p-4 ${bg} mb-4 shadow-lg group-hover:scale-110 transition`}>
                        {icon}
                    </div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">{label}</h2>
                    {loading ? (
                        <div className="text-3xl font-extrabold text-indigo-600 animate-pulse">Loading...</div>
                    ) : (
                        <CountUp
                            start={0}
                            end={count}
                            duration={3}
                            separator=","
                            className="text-4xl font-extrabold text-indigo-700"
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default Count;
