import React, { useState, useEffect } from 'react';
import useAuth from '../../../../Hook/useAuth';
import useAxiosSecure from '../../../../Hook/useAxiosSecure';

const ParticipantProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [fetchUser, setFetchUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: '',
    image: '',
    address: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosSecure.get(`/users?email=${user?.email}`);
        setFetchUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    if (user?.email) {
      fetchUserData();
    }
  }, [user?.email, axiosSecure]);

  useEffect(() => {
    if (fetchUser) {
      setForm({
        name: fetchUser.name || '',
        image: fetchUser.image || '',
        address: fetchUser.address || '',
        age: fetchUser.age || '',
        gender: fetchUser.gender || ''
      });
    }
  }, [fetchUser]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await axiosSecure.patch(`/users/${fetchUser._id}`, form);
      setFetchUser(res.data);
      window.location.reload();
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  if (!fetchUser) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="relative">

      <div className="max-w-md mx-auto mt-10 p-6 rounded-xl shadow-2xl shadow-indigo-100 bg-white text-black z-0">
        <div className="flex flex-col items-center gap-4">
          <img
            src={fetchUser.image}
            alt="Profile"
            className="rounded-full w-24 h-24 border transition-all duration-300"
          />
          <h2 className="text-xl font-semibold">{fetchUser.name}</h2>
          <p className="text-sm text-gray-600">{fetchUser.email}</p>
          <p className="text-sm text-gray-600">User Role : {fetchUser.role}</p>
          <p className="text-sm text-gray-600">
            Joined: {new Date(fetchUser.created_at).toLocaleDateString()}
          </p>
          {/* <p className="text-sm text-gray-600">
            Last login: {new Date(fetchUser.last_log_in).toLocaleString()}
          </p> */}
          {fetchUser.age && (
            <p className="text-sm text-gray-600">Age: {fetchUser.age}</p>
          )}
          {fetchUser.gender && (
            <p className="text-sm text-gray-600 capitalize">Gender: {fetchUser.gender}</p>
          )}
          {fetchUser.address && (
            <p className="text-sm text-gray-600">Address: {fetchUser.address}</p>
          )}

          <button
            onClick={() => setEditMode(true)}
            className="mt-4 bg-indigo-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-indigo-600 transition-all duration-300"
          >
            Update Profile
          </button>
        </div>
      </div>


      {editMode && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative transition-all duration-300">
            <h3 className="text-lg font-bold mb-4 text-center">Edit Profile</h3>
            <div className="flex flex-col gap-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                readOnly
              />
              <input
                name="age"
                type="number"
                value={form.age || ''}
                onChange={handleChange}
                placeholder="Age"
                className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <select
                name="gender"
                value={form.gender || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                onClick={handleUpdate}
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-all duration-300"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="text-red-500 border-red-600 text-center py-2 rounded-lg border cursor-pointer text-sm hover:text-white hover:bg-red-600 hover:border-0 mt-2 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantProfile;
