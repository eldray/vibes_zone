import React from "react";

const Press = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold gradient-text mb-4">VibeZone Press</h1>
      <p className="text-gray-600 mb-6">
        Stay updated on VibeZone’s latest news, milestones, and media coverage.
        For press inquiries, contact our media team.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Recent Press Releases
          </h2>
          <ul className="list-disc pl-5 text-gray-600">
            <li>VibeZone Launches New Reels Feature - June 2024</li>
            <li>VibeZone Reaches 1M Users - March 2024</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Media Contact
          </h2>
          <p className="text-gray-600">
            Email:
            <a
              href="mailto:press@vibezone.com"
              className="text-pink-500 hover:underline"
            >
              press@vibezone.com
            </a>
            <br />
            Phone: +1-555-123-4567
          </p>
        </div>
      </div>
    </div>
  );
};

export default Press;
