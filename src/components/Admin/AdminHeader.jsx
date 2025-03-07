import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("#profile-dropdown")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("User signed out");
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  return (
    <nav className="bg-red p-4 shadow-md fixed w-full z-10 border-b border-gray-200 ">
      <div className="flex justify-between items-center w-full px-4 md:px-8">
        {/* Sidebar Toggle Button */}
        <button
          className="text-gray-700 text-2xl md:hidden focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} // ✅ FIXED
        >
          <FaBars />
        </button>

        {/* Title */}
        <div className="text-gray-900 text-xl md:text-2xl font-semibold tracking-wide">
          Task Management
        </div>

        {/* Search & Profile Section */}
        <div className="flex items-center gap-4">
          <div className="relative w-full sm:w-64 hidden sm:block">
            <input
              type="text"
              placeholder="Search medicines..."
              className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400 shadow-sm text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute right-4 top-3 text-gray-500 hover:text-gray-700 cursor-pointer" />
          </div>

          {/* Profile Dropdown */}
          <div className="relative" id="profile-dropdown">
            <button
              className="text-gray-700 text-3xl focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
            >
              <FaUserCircle />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-md border border-gray-200 overflow-hidden">
                <a
                  href="#"
                  className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-gray-100 cursor-pointer"
                >
                  <FaUser className="text-blue-500" />
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-gray-100 cursor-pointer"
                >
                  <FaSignOutAlt className="text-red-500" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
