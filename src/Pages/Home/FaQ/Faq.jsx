import React, { useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqData = [
  {
    question: "How do I create an account on Medical BootCamps?",
    answer:
      "Click on the 'Login' button in the top right corner, then sign in using your email and password. If you're new, you’ll be prompted to register your account.",
  },
  {
    question: "Is logging in mandatory to access BootCamp details?",
    answer:
      "Yes, you need to be logged in to view bootcamp details and register for any events. It helps us track your participation and progress.",
  },
  {
    question: "How can I register for a BootCamp?",
    answer:
      "Once logged in, go to the 'Available BootCamps' section and click the 'Register' button under your desired camp. You will receive a confirmation email upon successful registration.",
  },
  {
    question: "Can I register for multiple camps at the same time?",
    answer:
      "Absolutely! You can register for as many bootcamps as you like, as long as their schedules don't overlap.",
  },
  {
    question: "What happens after I register for a BootCamp?",
    answer:
      "You will receive a confirmation email with all camp details. Closer to the event, reminders and access links/resources will be sent to your email.",
  },
  {
    question: "Can I cancel or change my BootCamp registration?",
    answer:
      "Yes. Go to 'My Registrations' page and you’ll find options to cancel or reschedule your camp if allowed by the organizer.",
  },
];

/** Single item with height animation */
function FaqItem({ i, q, a, open, onToggle }) {
  const panelRef = useRef(null);

  return (
    <div
      className="
        group relative rounded-2xl border border-slate-200/70 bg-white/90
        shadow-sm backdrop-blur-sm transition-all duration-300
        hover:shadow-md
      "
    >
      {/* subtle gradient glow */}
      <div
        className={`
          pointer-events-none absolute inset-0 rounded-2xl
          bg-[radial-gradient(600px_200px_at_-10%_-20%,rgba(124,58,237,0.08),transparent)]
          ${open ? "opacity-100" : "opacity-0"} transition-opacity duration-300
        `}
      />

      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`faq-panel-${i}`}
        className="
          relative z-[1] flex w-full items-center justify-between gap-4
          rounded-2xl px-5 py-4 text-left focus:outline-none
          focus-visible:ring-2 focus-visible:ring-violet-500
        "
      >
        <span className="text-base font-semibold text-slate-900">
          {q}
        </span>

        <span
          className={`
            grid h-8 w-8 place-items-center rounded-xl
            bg-violet-50 text-violet-700 transition-transform duration-300
            ${open ? "rotate-180" : ""}
          `}
        >
          <FaChevronDown className="h-4 w-4" />
        </span>
      </button>

      {/* animated panel */}
      <div
        id={`faq-panel-${i}`}
        ref={panelRef}
        style={{
          maxHeight: open && panelRef.current ? panelRef.current.scrollHeight : 0,
        }}
        className="
          overflow-hidden transition-[max-height] duration-300 ease-in-out
        "
      >
        <div className="relative z-[1] px-5 pb-5 pt-0">
          <div className="my-3 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <p className="text-sm leading-relaxed text-slate-600">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="mx-auto max-w-4xl px-4 py-14">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Frequently Asked Questions <span className="text-violet-600">💬</span>
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-slate-600">
          Quick answers about accounts, registration, and managing your Medical BootCamps.
        </p>
      </div>

      {/* List */}
      <div className="mt-8 space-y-4">
        {faqData.map((item, i) => (
          <FaqItem
            key={i}
            i={i}
            q={item.question}
            a={item.answer}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>

      {/* Small footer tip */}
      <p className="mt-8 text-center text-sm text-slate-500">
        Still need help? <span className="text-violet-700 font-medium">Contact support</span>.
      </p>
    </section>
  );
}
