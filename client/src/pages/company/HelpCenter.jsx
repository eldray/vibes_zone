import React from "react";

const HelpCenter = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold gradient-text mb-4">Help Center</h1>
      <p className="text-gray-600 mb-6">
        Find answers to common questions or get in touch with our support team
        for assistance with your VibeZone account.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">FAQs</h2>
          <ul className="list-disc pl-5 text-gray-600">
            <li>How do I reset my password?</li>
            <li>How can I report a post?</li>
            <li>What are VibeZone Stories?</li>
          </ul>
          <a
            href="#"
            className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600"
          >
            View All FAQs
          </a>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Contact Support
          </h2>
          <p className="text-gray-600">
            Email:
            <a
              href="mailto:support@vibezone.com"
              className="text-pink-500 hover:underline"
            >
              support@vibezone.com
            </a>
            <br />
            Live Chat: Available 24/7
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
