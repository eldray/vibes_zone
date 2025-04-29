import React from "react";

const Safety = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold gradient-text mb-4">
        Safety at VibeZone
      </h1>
      <p className="text-gray-600 mb-6">
        Your safety is our priority. We’re committed to creating a secure
        environment where everyone can share and connect without fear.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Our Safety Features
          </h2>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Content moderation to remove harmful posts.</li>
            <li>Privacy controls for stories and profiles.</li>
            <li>Reporting tools for users to flag issues.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Safety Tips
          </h2>
          <p className="text-gray-600">
            Protect your account by using a strong password, enabling two-factor
            authentication, and being cautious about sharing personal
            information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Safety;
