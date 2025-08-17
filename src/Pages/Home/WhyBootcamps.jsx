import {
  Brain,
  Stethoscope,
  Users,
  Award,
  Globe,
  GraduationCap,
} from "lucide-react";

const benefits = [
  {
    title: "Expert Mentorship",
    desc: "Learn directly from certified doctors, trainers, and healthcare professionals.",
    icon: Stethoscope,
  },
  {
    title: "Hands-on Practice",
    desc: "Experience real diagnostics, first-aid procedures, and health simulations.",
    icon: Brain,
  },
  {
    title: "Networking & Teams",
    desc: "Work with peers, collaborate on case studies, and build lifelong connections.",
    icon: Users,
  },
  {
    title: "Career Growth",
    desc: "Add bootcamp certifications to your CV and stand out in medical careers.",
    icon: Award,
  },
  {
    title: "Global Standards",
    desc: "Curriculum aligned with modern healthcare practices across the world.",
    icon: Globe,
  },
  {
    title: "Student Friendly",
    desc: "Affordable, flexible schedules for medical students and young professionals.",
    icon: GraduationCap,
  },
];

const testimonials = [
  {
    name: "Alicia Podwojniak",
    text: "Bootcamp was vital to my studying success. I passed Step 1 on my first attempt!",
    role: "Medical Student",
    rating: 5,
  },
  {
    name: "Rahim Uddin",
    text: "The CardioCare bootcamp gave me confidence in handling ECGs and BP monitoring.",
    role: "Final Year MBBS",
    rating: 5,
  },
];

export default function WhyBootcamps() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-violet-50 to-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Why Join <span className="text-violet-600">Medical Bootcamps?</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Medical Bootcamps (MCMS) are your fast-track to practical healthcare skills, 
            guided by professionals, and designed for real-world impact.
          </p>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">Benefits</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border bg-white shadow-sm p-6 hover:shadow-md transition"
            >
              <b.icon className="h-10 w-10 text-violet-600" />
              <h3 className="mt-4 text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-slate-600 text-sm">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-violet-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center">Success Stories</h2>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-6 shadow-sm border hover:shadow-md"
              >
                <p className="text-slate-700 italic">“{t.text}”</p>
                <div className="mt-4">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                  <div className="flex mt-1 text-yellow-400">
                    {"★".repeat(t.rating)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold">Ready to join?</h2>
        <p className="mt-3 text-slate-600 max-w-xl mx-auto">
          Sign up for upcoming camps today and take your first step towards 
          becoming a healthcare leader of tomorrow.
        </p>
        <button className="mt-6 px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700">
          Explore Bootcamps
        </button>
      </section>
    </div>
  );
}
