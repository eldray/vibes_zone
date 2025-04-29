import React from "react";

const CommunityGuidelines = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold gradient-text mb-4">
        Community Guidelines
      </h1>
      <p className="text-gray-600 mb-6">
        Our Community Guidelines ensure VibeZone remains a positive and
        respectful space for all users. Please follow these rules to keep the
        vibes high.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            What’s Allowed
          </h2>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Creative, authentic content.</li>
            <li>Respectful interactions.</li>
            <li>Supportive comments and messages.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            What’s Not Allowed
          </h2>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Hate speech or harassment.</li>
            <li>Explicit or harmful content.</li>
            <li>Spam or misleading posts.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
