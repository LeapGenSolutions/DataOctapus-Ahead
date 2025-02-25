import React from "react";
import { Link } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import SourceList from "../components/SourceList";

function AdminPanel() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">Admin Panel</h2>
      <AdminHeader />
      <p className="text-gray-600 mt-2">
        Manage system settings and users here.
      </p>
      <SourceList />
    </div>
  );
}

export default AdminPanel;
