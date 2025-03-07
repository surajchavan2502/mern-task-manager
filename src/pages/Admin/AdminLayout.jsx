import React, { useState } from "react";
import AdminHeader from "../../components/Admin/AdminHeader";
import { Outlet } from "react-router";
import Sidebar from "../../components/Admin/Sidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar - Fixed on the left */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header - Fixed at the top */}
        <AdminHeader
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

export default AdminLayout;
