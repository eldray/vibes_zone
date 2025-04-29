import React from "react";
import "./pages.css";

function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold gradient-text mb-4">About VibeZone</h1>
      <p className="text-gray-600 mb-6">
        VibeZone is a vibrant social media platform designed for Gen Z to
        connect, share, and express themselves. Our mission is to create a safe,
        inclusive space where creativity thrives, and authentic connections are
        made.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Our Story
          </h2>
          <p className="text-gray-600">
            Founded in 2023, VibeZone started as a passion project to bring
            young people together through stories, reels, and live moments.
            Today, we’re a global community of creators, dreamers, and
            vibe-setters.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Our Values
          </h2>
          <ul className="list-disc pl-5 text-gray-600">
            <li>
              Creativity: Empower self-expression through innovative features.
            </li>
            <li>Inclusivity: Celebrate diversity in all its forms.</li>
            <li>Safety: Prioritize user trust and well-being.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
