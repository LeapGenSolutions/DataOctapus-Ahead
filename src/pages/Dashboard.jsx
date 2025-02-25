import Sidebar from "../components/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Setup from "../components/Setup";
import Report from "../components/Report";
import CoPilot from "../components/Copilot";
import AdminPanel from "../pages/AdminPanel";
import UserPanel from "./UserPanel";
import ControlPanel from "./ControlPanel";

export default function Dashboard({ setIsLoggedIn }) {
  return (
    <div className="flex w-full h-full overflow-hidden">
      <Sidebar setIsLoggedIn={setIsLoggedIn} />
      <div className="flex-1 p-6 bg-gray-100 overflow-x-scroll">
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/user" element={<UserPanel />} />
          <Route path="/control-panel" element={<ControlPanel />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/report" element={<Report />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </div>
      <CoPilot />
    </div>
  );
}
