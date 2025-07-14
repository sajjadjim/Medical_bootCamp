import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { FaUsers, FaChalkboardTeacher, FaClipboardList } from 'react-icons/fa';
import useAuth from '../../../Hook/useAuth';

const Count = () => {
    const [userCount, setUserCount] = useState(0);
    const [bootcampCount, setBootcampCount] = useState(0);
    const [registrationCount, setRegistrationCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setUserCount(3000);
            setBootcampCount(25);
            setRegistrationCount(780);
            setLoading(false);
        }, 1000);
    }, []);
    const [dbUser, setDbUser] = useState([])
    // Filter Data From the Database From  userDatabase Information  Show the name
    useEffect(() => {
        const accessToken = user?.accessToken;
        // console.log(accessToken)
        if (accessToken) {
            fetch('https://b11a12-server-side-sajjadjim.vercel.app/users',
                {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
                }
            )
                .then(res => res.json())
                .then(data => {
                    setDbUser(data);
                    // console.log(data)
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
        }
    }, [user]);
    const userNumbers = dbUser.length;

    const [registrations, setRegistrations] = useState([])
    // Filter Data From the Database From  userDatabase Information  Show the name
    useEffect(() => {
        const accessToken = user?.accessToken;
        // console.log(accessToken)
        if (accessToken) {
            fetch('https://b11a12-server-side-sajjadjim.vercel.app/registrations',
                {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
                }
            )
                .then(res => res.json())
                .then(data => {
                    setRegistrations(data);
                    // console.log(data)
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
        }
    }, [user]);
    const registrationNumbers = registrations.length;

    const [camps, setCamps] = useState([])
    // Filter Data From the Database From  userDatabase Information  Show the name
    useEffect(() => {
        const accessToken = user?.accessToken;
        // console.log(accessToken)
        if (accessToken) {
            fetch('https://b11a12-server-side-sajjadjim.vercel.app/camps',
                {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
                }
            )
                .then(res => res.json())
                .then(data => {
                    setCamps(data);
                    // console.log(data)
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
        }
    }, [user]);
    const campsNumber = camps.length;


    const cardData = [
        {
            label: 'Users',
            count: userNumbers, // use the dynamic usersNumber from db
            icon: <FaUsers className="text-indigo-600 w-12 h-12 mb-4" />,
        },
        {
            label: 'BootCamps',
            count: registrationNumbers,
            icon: <FaChalkboardTeacher className="text-indigo-600 w-12 h-12 mb-4" />,
        },
        {
            label: 'Registrations',
            count: campsNumber,
            icon: <FaClipboardList className="text-indigo-600 w-12 h-12 mb-4" />,
        },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 md:mb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {cardData.map(({ label, count, icon }) => (
                <div
                    key={label}
                    className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center text-center border border-indigo-200 hover:shadow-indigo-400 transition-shadow hover:border-r-6  hover:border-b-3 hover:border-indigo-400 duration-300"
                >
                    {icon}
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
