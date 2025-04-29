import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTiktok,
  faTwitter,
  faDiscord,
} from "@fortawesome/free-brands-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* VibeZone Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-vibe-pink to-vibe-orange bg-clip-text text-transparent">
                VibeZone
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/brand"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Brand
                  </Link>
                </li>
                <li>
                  <Link
                    to="/press"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Help</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/help"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/safety"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Safety
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guidelines"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Community Guidelines
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>

            {/* Features Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/stories"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Vibe Stories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/live"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Vibe Live
                  </Link>
                </li>
                <li>
                  <Link
                    to="/reels"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Vibe Reels
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Vibe Events
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4 mb-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-xl"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-xl"
                >
                  <FontAwesomeIcon icon={faTiktok} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-xl"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-xl"
                >
                  <FontAwesomeIcon icon={faDiscord} />
                </a>
              </div>
              <p className="text-gray-400 text-sm mb-2">Download the app:</p>
              <div className="flex space-x-2">
                <a
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  App Store
                </a>
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  Google Play
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-400 text-sm text-center">
              © {new Date().getFullYear()} VibeZone. All rights reserved. Made
              with ❤️ for Gen Z
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <Link
        to="/create-post"
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-r from-vibe-pink to-vibe-orange shadow-lg flex items-center justify-center text-white text-2xl z-50 transition-all duration-300 hover:scale-110 hover:shadow-xl"
        aria-label="Create new post"
      >
        <FontAwesomeIcon icon={faPlus} />
      </Link>
    </>
  );
};

export default Footer;
