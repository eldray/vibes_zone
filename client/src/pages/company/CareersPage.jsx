import "./pages.css";

function CareersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold gradient-text mb-4">
        Careers at VibeZone
      </h1>
      <p className="text-gray-600 mb-6">
        Join our team and help shape the future of social media for Gen Z! At
        VibeZone, we’re looking for passionate, creative individuals to build a
        platform that inspires and connects.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Open Positions
          </h2>
          <p className="text-gray-600">
            We’re hiring for roles in engineering, design, marketing, and more.
            Check out our careers page for the latest opportunities.
          </p>
          <a
            href="#"
            className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600"
          >
            View Job Listings
          </a>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Why Work With Us?
          </h2>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Dynamic, inclusive culture.</li>
            <li>Opportunities for growth and impact.</li>
            <li>Flexible, remote-friendly work environment.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CareersPage;
