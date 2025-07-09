import React from "react";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-6">About MCMS Bootcamp</h1>

      <p className="text-lg mb-6 text-center">
        MedBootcamp is a hands-on learning platform designed to empower aspiring
        medical professionals. Whether you're a student or a curious learner,
        our programs help you build real-world clinical skills and knowledge.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">🎯 What We Offer</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Structured Bootcamp Programs</li>
          <li>Practical Lab & Skill-Based Training</li>
          <li>Online Lectures + In-Person Workshops</li>
          <li>Certificate Upon Completion</li>
          <li>Easy Registration & Secure Online Payments</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">👥 Who Can Join?</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Medical students</li>
          <li>Pre-med students</li>
          <li>Nursing & paramedical students</li>
          <li>Anyone passionate about healthcare</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">💡 How It Works</h2>
        <ol className="list-decimal ml-6 space-y-1">
          <li>Register Online</li>
          <li>Make Secure Payment</li>
          <li>Join the Bootcamp & Learn</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">🌐 Why Choose Us?</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Trusted by 500+ students</li>
          <li>Affordable pricing & scholarships</li>
          <li>Access to learning materials</li>
          <li>Expert mentors & instructors</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">📍 Location</h2>
        <p>We host both <strong>online and offline</strong> bootcamps across major cities and remote learning platforms.</p>
      </section>

      <div className="text-center mt-10">
        <p className="text-lg">📞 Need help? <a href="/contact" className="text-blue-600 underline">Contact us</a> or chat with support.</p>
      </div>
    </div>
  );
};

export default About;
