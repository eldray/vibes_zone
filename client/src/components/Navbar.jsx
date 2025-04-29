import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faBell, faPlus } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import PostModal from "./PostModal";

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/reels", label: "Reels" },
    { to: "/messages", label: "Messages" },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  const handlePostCreated = () => {
    window.location.reload(); // Replace with state update if needed
  };

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <FontAwesomeIcon
                  icon={faFire}
                  className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-vibe-pink to-vibe-orange"
                />
                <span className="ml-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF9A8B] via-[#FF6B95] to-[#FF8E53]">
                  VibeZone
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex md:items-center md:ml-6 md:space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? "border-indigo-500 text-transparent gradient-text "
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center">
              {user ? (
                <>
                  {/* Create Post Button */}
                  <button
                    onClick={() => setIsPostModalOpen(true)}
                    className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#FF6B95] to-[#FF8E53] hover:from-[#FF4F7F] hover:to-[#FF7C4D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Create Post
                  </button>

                  {/* Notification Bell */}
                  <button className="ml-4 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <FontAwesomeIcon icon={faBell} className="text-xl" />
                  </button>

                  {/* User Menu */}
                  <div className="ml-3 relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.avatar}
                        alt={user.username}
                      />
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <NavLink
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </NavLink>
                        <NavLink
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Settings
                        </NavLink>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-white bg-gradient-to-r from-vibe-pink to-vibe-orange hover:from-pink-600 hover:to-orange-600"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Log In Button */}
                  <NavLink
                    to="/login"
                    className="px-4 py-2 text-bold  text-transparent bg-clip-text bg-gradient-to-r from-[#FF9A8B] via-[#FF6B95] to-[#FF8E53] hover:text-pink-500"
                  >
                    Log In
                  </NavLink>

                  {/* Sign Up Button */}
                  <NavLink
                    to="/register"
                    className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#FF6B95] to-[#FF8E53] hover:from-[#FF4F7F] hover:to-[#FF7C4D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {user && (
        <PostModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </>
  );
};

export default Navbar;
