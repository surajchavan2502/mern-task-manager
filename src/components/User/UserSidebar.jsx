import React from "react";
import { FaHome, FaCog, FaTasks } from "react-icons/fa";
import { Link } from "react-router";

const UserSidebar = ({ isSidebarOpen }) => {
  return (
    <aside
      className={`h-screen w-64 bg-red text-gray-800 fixed top-0 left-0 shadow-md flex flex-col border-r border-gray-200 transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-64"
      } md:translate-x-0 mt-16`}
    >
      <div className="p-4 text-xl font-semibold text-center border-b border-gray-300">
        User Dashboard
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-3">
          <li className="hover:bg-gray-100 p-3 rounded-lg">
            <Link to="/user" className="flex items-center gap-3">
              <FaHome className="text-blue-500" /> Home
            </Link>
          </li>

          <li className="hover:bg-gray-100 p-3 rounded-lg">
            <Link to="/user/tasks" className="flex items-center gap-3">
              <FaTasks className="text-red-500" /> Tasks
            </Link>
          </li>

          <li className="hover:bg-gray-100 p-3 rounded-lg">
            <Link to="/user/settings" className="flex items-center gap-3">
              <FaCog className="text-gray-600" /> Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default UserSidebar;
