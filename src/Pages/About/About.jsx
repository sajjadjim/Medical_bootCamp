import React, { useEffect, useState } from "react";
import {
  Stethoscope,
  GraduationCap,
  ShieldCheck,
  CreditCard,
  Users2,
  BookOpen,
  Clock,
  MapPin,
  Sparkles,
  HeartPulse,
  ChevronDown,
} from "lucide-react";

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white/80 backdrop-blur">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-left px-4 py-3 md:px-5 md:py-4 hover:bg-indigo-50/50 transition"
      >
        <span className="font-medium text-gray-800">{q}</span>
        <ChevronDown
          className={`text-indigo-600 transition-transform ${open ? "rotate-180" : ""}`}
          size={18}
        />
      </button>
      {open && <div className="px-4 pb-4 md:px-5 md:pb-5 text-gray-600">{a}</div>}
    </div>
  );
};

const About = () => {
  useEffect(() => {
    document.title = "About MCMS BootCamp";
  }, []);

  return (
    <div className="relative">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-12 -left-10 h-64 w-64 bg-indigo-200/40 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 h-72 w-72 bg-purple-200/40 blur-3xl rounded-full" />
      </div>

      {/* hero */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-16 md:pt-20">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white p-6 md:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/10 rounded-full" />
          <div className="absolute right-10 bottom-6 h-24 w-24 bg-white/10 rounded-full" />
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                About <span className="text-white/90">MCMS Bootcamp</span>
              </h1>
              <p className="mt-3 md:mt-4 text-white/90 md:text-lg">
                Hands-on programs designed to empower aspiring medical professionals with
                real-world clinical skills—delivered by expert mentors through a blend of
                practical labs, workshops, and guided learning.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full text-sm">
                  <ShieldCheck size={16} /> Trusted • Student-first
                </span>
                <span className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full text-sm">
                  <HeartPulse size={16} /> Clinically aligned
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white/90 text-gray-900 rounded-2xl p-5 shadow-lg border border-white/60">
                <div className="grid grid-cols-3 divide-x divide-gray-200 text-center">
                  <div className="px-3">
                    <div className="text-2xl md:text-3xl font-bold">500+</div>
                    <div className="text-sm text-gray-600">Students</div>
                  </div>
                  <div className="px-3">
                    <div className="text-2xl md:text-3xl font-bold">30+</div>
                    <div className="text-sm text-gray-600">Bootcamps</div>
                  </div>
                  <div className="px-3">
                    <div className="text-2xl md:text-3xl font-bold">4.8★</div>
                    <div className="text-sm text-gray-600">Avg. Rating</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-indigo-500" />
                  Flexible schedules • Online & In-person
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* what we offer */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mt-12 md:mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="text-indigo-600" /> What We Offer
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          {[
            {
              icon: <GraduationCap className="text-indigo-600" size={22} />,
              title: "Structured Programs",
              desc: "Curated curricula that build core clinical skills step-by-step.",
            },
            {
              icon: <Stethoscope className="text-indigo-600" size={22} />,
              title: "Practical Training",
              desc: "Hands-on labs, demos, and guided simulations to cement learning.",
            },
            {
              icon: <BookOpen className="text-indigo-600" size={22} />,
              title: "Blended Learning",
              desc: "Live sessions + workshops + accessible materials you can revisit.",
            },
            {
              icon: <ShieldCheck className="text-indigo-600" size={22} />,
              title: "Certification",
              desc: "Receive a certificate upon successful completion.",
            },
            {
              icon: <CreditCard className="text-indigo-600" size={22} />,
              title: "Easy Enrollment",
              desc: "Simple registration with secure online payment options.",
            },
            {
              icon: <Users2 className="text-indigo-600" size={22} />,
              title: "Mentor Access",
              desc: "Get guidance and feedback from practicing clinicians.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/90 backdrop-blur p-5 border border-indigo-50 shadow hover:shadow-lg transition"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-50">{f.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{f.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* who can join + how it works */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white/90 backdrop-blur p-6 border border-indigo-50 shadow">
          <h2 className="text-xl md:text-2xl font-bold mb-3">Who Can Join?</h2>
          <ul className="grid gap-2 text-gray-700">
            {[
              "Medical students",
              "Pre-med students",
              "Nursing & paramedical students",
              "Anyone passionate about healthcare",
            ].map((t, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white/90 backdrop-blur p-6 border border-indigo-50 shadow">
          <h2 className="text-xl md:text-2xl font-bold mb-4">How It Works</h2>
          <ol className="relative border-s border-indigo-100 ms-3 space-y-5">
            {[
              { t: "Register Online", d: "Pick your bootcamp and fill in your details." },
              { t: "Make Secure Payment", d: "Reserve your spot quickly and safely." },
              { t: "Join & Learn", d: "Attend sessions, practice skills, and earn a certificate." },
            ].map((s, i) => (
              <li key={i} className="ms-4">
                <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-xs">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-gray-900">{s.t}</h3>
                <p className="text-sm text-gray-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* why choose us */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mt-12 md:mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-6">
          {[
            { n: "500+", l: "Students" },
            { n: "Affordable", l: "Pricing & Scholarships" },
            { n: "Materials", l: "Lifetime Access" },
            { n: "Experts", l: "Mentors & Instructors" },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/90 backdrop-blur p-5 border border-indigo-50 shadow text-center hover:shadow-lg transition"
            >
              <div className="text-xl font-bold text-indigo-700">{s.n}</div>
              <div className="text-sm text-gray-600 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* location */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mt-12 md:mt-16">
        <div className="rounded-2xl bg-white/90 backdrop-blur p-6 border border-indigo-50 shadow flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <MapPin size={22} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Where We Operate</h3>
            <p className="text-gray-700">
              We host both <strong>online</strong> and <strong>offline</strong> bootcamps across major cities and remote
              learning platforms.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mt-12 md:mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-5">FAQ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FAQItem
            q="Do I need prior medical experience?"
            a="Not necessarily. Many of our programs start from fundamentals and build up to intermediate skills."
          />
          <FAQItem
            q="Are there scholarships or discounts?"
            a="Yes—need-based scholarships and early-bird discounts are available on select bootcamps."
          />
          <FAQItem
            q="Will I get a certificate?"
            a="Absolutely. Upon successful completion, you’ll receive a recognized certificate."
          />
          <FAQItem
            q="Are sessions recorded?"
            a="Many online sessions are recorded and shared, so you can review at your own pace."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mt-12 md:mt-16 pb-16">
        <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold">Ready to level up your clinical skills?</h3>
              <p className="text-white/90 mt-1">
                Explore upcoming bootcamps, secure your seat, and learn with mentors.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/availableBootcamp"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-white text-indigo-700 font-semibold hover:bg-white/90 active:scale-[0.98] transition"
              >
                Browse Bootcamps
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-white/15 text-white border border-white/30 hover:bg-white/20 active:scale-[0.98] transition"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* footer note */}
      <div className="text-center px-4 pb-16 -mt-6">
        <p className="text-gray-700">
          Need help?{" "}
          <a href="/contact" className="text-indigo-600 underline underline-offset-4">
            Chat with support
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default About;
