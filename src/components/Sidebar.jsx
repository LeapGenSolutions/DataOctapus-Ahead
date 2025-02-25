import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logo.avif";

export default function Sidebar({ setIsLoggedIn }) {
  const location = useLocation();

  return (
    <div className="w-64 bg-black text-white h-full p-6 flex flex-col justify-between">
      <div>
        <img src={Logo} alt="Logo" className="w-24 h-24 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
        <p className="mb-4 text-2xl">Hi, John Doe</p>
        {[
          { name: "Admin", path: "/admin" },
          { name: "User", path: "/user" },
          { name: "Control Panel", path: "/control-panel" },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block p-3 mb-2 rounded-lg transition-colors ${
              location.pathname === item.path
                ? "bg-purple-500"
                : "bg-gray-700 hover:bg-purple-500"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <button
        onClick={() => setIsLoggedIn(false)}
        className="block p-2 mb-2 rounded-lg transition-colors bg-red-300 text-black cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}
