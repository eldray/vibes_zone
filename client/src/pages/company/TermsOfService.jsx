import React from "react";

const TermsOfService = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold gradient-text mb-4">
        Terms of Service
      </h1>
      <p className="text-gray-600 mb-6">
        By using VibeZone, you agree to our Terms of Service. These terms
        outline your rights and responsibilities as a user of our platform.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            User Conduct
          </h2>
          <p className="text-gray-600">
            You are responsible for your content and interactions on VibeZone.
            Follow our Community Guidelines to avoid account suspension.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Privacy</h2>
          <p className="text-gray-600">
            We collect and use your data as described in our Privacy Policy. You
            control your privacy settings through your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
