import React, { useState } from "react";
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

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        Frequently Asked Questions 💬
      </h2>

      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="border border-none rounded-xl p-4 shadow-xl">
            <button
              onClick={() => toggle(index)}
              className="flex justify-between items-center w-full text-left font-semibold text-gray-800"
            >
              {faq.question}
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  openIndex === index ? "rotate-180 text-indigo-600" : ""
                }`}
              />
            </button>
            {openIndex === index && (
              <p className="mt-3 text-gray-600 text-sm">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
