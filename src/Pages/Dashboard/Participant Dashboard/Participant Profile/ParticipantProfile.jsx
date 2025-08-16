import React, { useState, useEffect, useMemo } from 'react';
import useAuth from '../../../../Hook/useAuth';
import useAxiosSecure from '../../../../Hook/useAxiosSecure';
import {
  User as UserIcon,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Image as ImageIcon,
  Pencil,
  X,
  Save,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fallbackAvatar =
  'https://cdn-icons-png.freepik.com/512/6858/6858485.png';

const Skeleton = () => (
  <div className="max-w-md mx-auto mt-16 p-6 rounded-2xl bg-white/60 backdrop-blur-md shadow-2xl">
    <div className="flex flex-col items-center gap-4">
      <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
      <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-56 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-44 bg-gray-200 rounded animate-pulse" />
      <div className="mt-3 h-10 w-40 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  </div>
);

const Field = ({ icon: Icon, children }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
      <Icon size={18} />
    </span>
    {children}
  </div>
);

const Chip = ({ children, tone = 'indigo' }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-medium bg-${tone}-50 text-${tone}-600 border border-${tone}-200`}
  >
    {children}
  </span>
);

/* Tailwind’s JIT can miss dynamic classes; ensure these exist in your app:
bg-indigo-50 text-indigo-600 border-indigo-200
bg-pink-50 text-pink-600 border-pink-200
bg-emerald-50 text-emerald-600 border-emerald-200
*/

const ParticipantProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [fetchUser, setFetchUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    image: '',
    address: '',
    age: '',
    gender: '',
    phone: '',
  });

  // Fetch
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/users?email=${user?.email}`);
        // handle array or object payloads
        const payload = Array.isArray(res.data) ? res.data[0] : res.data;
        setFetchUser(payload || null);
      } catch (err) {
        console.error('Failed to fetch user', err);
        toast.error('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchUserData();
  }, [user?.email, axiosSecure]);

  // Seed form from fetched user
  useEffect(() => {
    if (fetchUser) {
      setForm({
        name: fetchUser.name || '',
        image: fetchUser.image || '',
        address: fetchUser.address || '',
        age: fetchUser.age || '',
        gender: fetchUser.gender || '',
        phone: fetchUser.phone || '',
      });
    }
  }, [fetchUser]);

  const pristineSnapshot = useMemo(
    () =>
      JSON.stringify({
        name: fetchUser?.name || '',
        image: fetchUser?.image || '',
        address: fetchUser?.address || '',
        age: fetchUser?.age || '',
        gender: fetchUser?.gender || '',
        phone: fetchUser?.phone || '',
      }),
    [fetchUser]
  );
  const currentSnapshot = JSON.stringify(form);
  const isDirty = currentSnapshot !== pristineSnapshot;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Simple validation
  const phoneOk =
    !form.phone || /^01[3-9]\d{8}$/.test(form.phone.trim()); // BD format helper
  const ageOk = !form.age || (+form.age >= 1 && +form.age <= 120);

  const handleUpdate = async () => {
    if (!isDirty) {
      toast.info('No changes to save.');
      return;
    }
    if (!phoneOk) {
      toast.warn('Please enter a valid Bangladeshi phone number (e.g., 017XXXXXXXX).');
      return;
    }
    if (!ageOk) {
      toast.warn('Please enter a valid age (1–120).');
      return;
    }
    try {
      setSaving(true);
      const res = await axiosSecure.patch(`/users/${fetchUser._id}`, form);
      const updated = res.data || form;

      // Update local copies (no hard reload)
      setFetchUser((prev) => ({ ...prev, ...updated }));
      setForm((prev) => ({ ...prev, ...updated }));

      toast.success('Profile updated successfully.');
      setEditMode(false);
    } catch (err) {
      console.error('Failed to update user', err);
      toast.error('Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !fetchUser) {
    return (
      <div className="flex justify-center items-center mt-12">
        <Skeleton />
        <ToastContainer position="top-center" />
      </div>
    );
  }

  const joined =
    fetchUser.created_at ? new Date(fetchUser.created_at).toLocaleDateString() : '—';

  // Choose chip tone by gender
  const genderTone =
    form.gender === 'male'
      ? 'indigo'
      : form.gender === 'female'
      ? 'pink'
      : 'emerald';

  return (
    <div className="relative">
      <ToastContainer position="top-center" />

      {/* Decorative background blob */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="mx-auto mt-20 h-56 w-56 blur-3xl opacity-30 bg-gradient-to-tr from-indigo-300 via-purple-200 to-pink-200 rounded-full" />
      </div>

      {/* Profile Card */}
      <div className="max-w-md mx-auto mt-16 p-6 rounded-2xl bg-white/70 backdrop-blur-md shadow-[0_10px_40px_-10px_rgba(79,70,229,0.35)] border border-white/50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={fetchUser.image || fallbackAvatar}
              onError={(e) => (e.currentTarget.src = fallbackAvatar)}
              alt="Profile"
              className="rounded-full w-24 h-24 ring-4 ring-indigo-100 object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
            <button
              onClick={() => setEditMode(true)}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-500 text-white shadow hover:bg-indigo-600"
              title="Edit Profile"
            >
              <Pencil size={16} />
            </button>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
            <UserRound size={20} className="text-indigo-500" />
            {fetchUser.name || 'No Name'}
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-gray-600 text-sm">
              <Mail size={16} className="text-indigo-500" />
              {fetchUser.email}
            </span>
            {fetchUser.age ? <Chip tone="indigo">Age: {fetchUser.age}</Chip> : null}
            {fetchUser.gender ? <Chip tone={genderTone}>{fetchUser.gender}</Chip> : null}
          </div>

          {fetchUser.phone ? (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Phone size={16} className="text-indigo-500" />
              {fetchUser.phone}
            </p>
          ) : null}

          {fetchUser.address ? (
            <p className="text-sm text-gray-600 flex items-center gap-2 text-center">
              <MapPin size={16} className="text-indigo-500" />
              {fetchUser.address}
            </p>
          ) : null}

          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar size={14} />
            Joined: {joined}
          </p>

          <button
            onClick={() => setEditMode(true)}
            className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition active:scale-[0.98]"
          >
            <ShieldCheck size={16} />
            Update Profile
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-indigo-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Edit Profile</h3>
              <button
                onClick={() => setEditMode(false)}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <Field icon={UserIcon}>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-white"
                />
              </Field>

              <Field icon={ImageIcon}>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="Image URL (read-only here)"
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-50 shadow-sm placeholder-gray-400 focus:outline-none border"
                  readOnly
                />
              </Field>

              <Field icon={ShieldCheck}>
                <input
                  name="age"
                  type="number"
                  value={form.age || ''}
                  onChange={handleChange}
                  placeholder="Age"
                  className={`w-full pl-10 pr-3 py-3 rounded-xl bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 border ${ageOk ? 'focus:ring-indigo-400 border-gray-200' : 'border-red-300 focus:ring-red-300'}`}
                />
              </Field>

              <div className="relative">
                <select
                  name="gender"
                  value={form.gender || ''}
                  onChange={handleChange}
                  className="w-full pl-3 pr-10 py-3 rounded-xl bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-200"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <Field icon={Phone}>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone 017XXXXXXXX"
                  className={`w-full pl-10 pr-3 py-3 rounded-xl bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 border ${phoneOk ? 'focus:ring-indigo-400 border-gray-200' : 'border-red-300 focus:ring-red-300'}`}
                />
              </Field>

              <Field icon={MapPin}>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-200"
                />
              </Field>

              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  onClick={handleUpdate}
                  disabled={!isDirty || saving || !phoneOk || !ageOk}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-white shadow-md transition ${
                    !isDirty || saving || !phoneOk || !ageOk
                      ? 'bg-indigo-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99]'
                  }`}
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>

              {/* Tiny helper messages */}
              {!phoneOk && (
                <p className="text-xs text-red-500 mt-1">
                  Phone must match Bangladeshi format (e.g., 017XXXXXXXX).
                </p>
              )}
              {!ageOk && (
                <p className="text-xs text-red-500">
                  Age should be between 1 and 120.
                </p>
              )}
              {!isDirty && (
                <p className="text-xs text-gray-500">
                  Make a change to enable <b>Save Changes</b>.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantProfile;
