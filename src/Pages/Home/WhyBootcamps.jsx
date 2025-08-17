import {
  Brain,
  Stethoscope,
  Users,
  Award,
  Globe,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router"; // ✅ fix

const benefits = [
  { title: "Expert Mentorship", desc: "Learn directly from certified doctors, trainers, and healthcare professionals.", icon: Stethoscope },
  { title: "Hands-on Practice", desc: "Experience real diagnostics, first-aid procedures, and health simulations.", icon: Brain },
  { title: "Networking & Teams", desc: "Work with peers, collaborate on case studies, and build lifelong connections.", icon: Users },
  { title: "Career Growth", desc: "Add bootcamp certifications to your CV and stand out in medical careers.", icon: Award },
  { title: "Global Standards", desc: "Curriculum aligned with modern healthcare practices across the world.", icon: Globe },
  { title: "Student Friendly", desc: "Affordable, flexible schedules for medical students and young professionals.", icon: GraduationCap },
];

/** prettier, smoother card */
function BenefitCard({ icon: Icon, title, desc }) {
  return (
    <div
      className="
        group relative overflow-hidden rounded-3xl border border-slate-200/80
        bg-white/80 backdrop-blur-sm p-6 shadow-sm
        transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
      "
    >
      {/* subtle gradient wash on hover */}
      <div
        className="
          pointer-events-none absolute inset-0 rounded-3xl
          bg-[radial-gradient(1200px_400px_at_-10%_-20%,rgba(124,58,237,0.10),transparent)]
          opacity-0 transition-opacity duration-300 group-hover:opacity-100
        "
      />
      <div className="flex items-start gap-4">
        {/* gradient icon tile */}
        <div
          className="
            shrink-0 rounded-2xl p-3 text-white
            bg-gradient-to-br from-violet-600 to-fuchsia-600
            shadow-md ring-1 ring-white/30
            transition-transform duration-300 group-hover:scale-105
          "
        >
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
        </div>
      </div>

      {/* tiny callout animates in */}
      <div
        className="
          mt-4 flex items-center gap-2 text-sm font-medium text-violet-700/80
          opacity-0 -translate-x-1 transition-all duration-300
          group-hover:opacity-100 group-hover:translate-x-0
        "
      >
        <span>Learn more</span>
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <path d="M7 12h10m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* soft glow edge */}
      <div
        className="
          pointer-events-none absolute -bottom-20 -right-20 h-40 w-40
          rounded-full bg-violet-500/10 blur-2xl
        "
      />
    </div>
  );
}

export default function WhyBootcamps() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className=" to-white">
        <div className="mx-auto 2xl:max-w-7xl md:max-w-6xl mx-auto py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Why Join <span className="text-violet-600">Medical Bootcamps?</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Medical Bootcamps (MCMS) are your fast-track to practical healthcare skills,
            guided by professionals, and designed for real-world impact.
          </p>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="mx-auto 2xl:max-w-7xl md:max-w-6xl mx-auto py-16">
        <h2 className="mb-10 text-center text-2xl font-bold">Benefits</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <BenefitCard key={b.title} {...b} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto 2xl:max-w-7xl md:max-w-6xl mx-auto pb-20 text-center">
        <h2 className="text-3xl font-bold">Ready to join?</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          Sign up for upcoming camps today and take your first step towards becoming a healthcare leader of tomorrow.
        </p>
        <Link
          to="/availableBootcamp"
          className="
            mt-6 inline-flex items-center justify-center rounded-xl
            bg-violet-600 px-6 py-3 font-semibold text-white
            shadow-sm transition-colors hover:bg-violet-700
          "
        >
          Explore Bootcamps
        </Link>
      </section>
    </div>
  );
}
