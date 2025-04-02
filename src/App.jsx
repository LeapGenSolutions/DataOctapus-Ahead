import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getSources = async () => {
      const data = await fetchSources();
      saveSources(data);
    };
    getSources();
    fetchPipelines();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/sources");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching sources:", error);
      return [];
    }
  };

  const saveSources = (newSources) => {
    localStorage.setItem("sources", JSON.stringify(newSources));
  };

  const fetchPipelines = async () => {
    try {
      const response = await fetch("http://localhost:8000/pipelines");
      if (!response.ok) throw new Error("Failed to fetch pipelines");
      const data = await response.json();
      localStorage.setItem("pipelines", JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Router>
      <div className="h-screen flex">
        {!isLoggedIn ? (
          <Login setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <Dashboard setIsLoggedIn={setIsLoggedIn} />
        )}
      </div>
    </Router>
  );
}
