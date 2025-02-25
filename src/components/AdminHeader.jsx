import React from "react";
import { Link, useLocation } from "react-router-dom";

function AdminHeader() {
  const location = useLocation();

  return (
    <div className="flex flex-row gap-2 mb-2">
      <Link
        to="/setup"
        className={`block p-3 px-4 rounded-lg ${
          location.pathname === "/setup"
            ? "bg-purple-500 text-white"
            : "bg-purple-200 hover:bg-purple-500"
        }`}
      >
        Setup
      </Link>
      <Link
        to="/report"
        className={`block p-3 px-4 rounded-lg ${
          location.pathname === "/report"
            ? "bg-purple-500 text-white"
            : "bg-purple-200 hover:bg-purple-500"
        }`}
      >
        Report
      </Link>
    </div>
  );
}

export default AdminHeader;
