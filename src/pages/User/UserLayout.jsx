import React, { useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import UserHeader from "../../components/User/UserHeader";
import { Outlet } from "react-router";

const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="flex">
      {/* Sidebar - Fixed on the left */}
      <UserSidebar isSidebarOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header - Fixed at the top */}
        <UserHeader
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Page Content (Fixed Position & Adjusted Margins) */}
        <main
          className={`p-20 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
