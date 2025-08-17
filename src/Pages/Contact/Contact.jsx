import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { CheckCircle, Loader2 } from "lucide-react";

const Contact = () => {
  useEffect(() => {
    document.title = "Contact Us";
  }, []);

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" }); // website = honeypot

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email";
    if (form.message.trim().length < 10) next.message = "Message should be at least 10 characters";
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.website) return; // bot honeypot
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    setLoading(true);
    try {
      // TODO: replace with your API endpoint if needed:
      // await axios.post('/contact', form)
      await new Promise((r) => setTimeout(r, 900));
      setOk(true);
      setForm({ name: "", email: "", message: "", website: "" });
    } catch {
      // You can also show an error toast here
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  return (
    <div className="relative min-h-screen">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-10 -left-10 h-64 w-64 bg-indigo-200/40 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 h-72 w-72 bg-purple-200/40 blur-3xl rounded-full" />
      </div>

      {/* hero */}
      <div className="w-full max-w-5xl mx-auto px-4 pt-20 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-indigo-700">
          Contact Us
        </h2>
        <p className="mt-3 text-gray-600 md:text-lg">
          Have questions or feedback? We’d love to hear from you.
        </p>
      </div>

      {/* grid */}
      <div className="w-full max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* left: info */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white/90 backdrop-blur border border-indigo-50 shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in touch</h3>

            <div className="flex items-start gap-4 py-3">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                <FaMapMarkerAlt />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">Our Office</div>
                <p className="text-gray-600">123 Main Street, Dhaka, Bangladesh</p>
              </div>
              <button
                onClick={() => copy("123 Main Street, Dhaka, Bangladesh")}
                className="text-sm text-indigo-600 hover:underline"
              >
                Copy
              </button>
            </div>

            <div className="flex items-start gap-4 py-3 border-t">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                <FaPhoneAlt />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">Phone</div>
                <a href="tel:+8801234567890" className="text-gray-600 hover:text-indigo-700">
                  +880 1234 567 890
                </a>
              </div>
              <button
                onClick={() => copy("+8801234567890")}
                className="text-sm text-indigo-600 hover:underline"
              >
                Copy
              </button>
            </div>

            <div className="flex items-start gap-4 py-3 border-t">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                <FaEnvelope />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">Email</div>
                <a
                  href="mailto:info@bootcamp.mcms.com"
                  className="text-gray-600 hover:text-indigo-700 break-all"
                >
                  info@bootcamp.mcms.com
                </a>
              </div>
              <button
                onClick={() => copy("info@bootcamp.mcms.com")}
                className="text-sm text-indigo-600 hover:underline"
              >
                Copy
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-3">
                <div className="text-gray-500">Office Hours</div>
                <div className="text-gray-800 font-medium">Sun–Thu, 9am–6pm</div>
              </div>
              <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-3">
                <div className="text-gray-500">Response Time</div>
                <div className="text-gray-800 font-medium">Within 1 business day</div>
              </div>
            </div>
          </div>

          {/* optional map */}
          <div className="rounded-2xl overflow-hidden bg-white/90 backdrop-blur border border-indigo-50 shadow-xl">
            <iframe
              title="MCMS Location"
              src="https://www.google.com/maps?q=Dhaka,Bangladesh&output=embed"
              className="w-full h-64"
              loading="lazy"
            />
          </div>
        </div>

        {/* right: form */}
        <form
          onSubmit={onSubmit}
          className="rounded-2xl bg-white/90 backdrop-blur border border-indigo-50 shadow-xl p-6"
          noValidate
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Send us a message</h3>

          {/* honeypot */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            className="hidden"
            tabIndex="-1"
            autoComplete="off"
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Your name"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="you@example.com"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              rows="5"
              name="message"
              value={form.message}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.message ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Your message"
              required
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min 10 characters</span>
              <span>{form.message.length}/1000</span>
            </div>
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg transition active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            {loading ? "Sending..." : "Send Message"}
          </button>

          {ok && (
            <div className="mt-4 inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              <CheckCircle size={18} />
              Thanks! We received your message and will get back to you soon.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;
