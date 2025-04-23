import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SourceList() {
  const navigate = useNavigate();
  const [sources, setSources] = useState([]);

  useEffect(() => {
    const storedSources = JSON.parse(localStorage.getItem("sources")) || [];
    setSources(storedSources);
  }, []);

  const handleDeleteSource = async (id) => {
    try {
      // **Delete from CosmosDB**
      const response = await fetch(`http://localhost:8000/sources/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete source");

      // **Update Local State**
      const updatedSources = sources.filter((source) => source.id !== id);
      saveSources(updatedSources);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete source!");
    }
  };

  const saveSources = (newSources) => {
    setSources(newSources);
    localStorage.setItem("sources", JSON.stringify(newSources));
  };

  const handleEdit = (source) => {
    navigate(`/setup`, { state: source });
  };

  // useEffect(() => {
  //   const getSources = async () => {
  //     const data = await fetchSources();
  //     setSources(data);
  //     saveSources(data);
  //   };
  //   getSources();
  // }, []);

  // const fetchSources = async () => {
  //   try {
  //     const response = await fetch("http://127.0.0.1:8000/sources");
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching sources:", error);
  //     return [];
  //   }
  // };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-bold">Source List</h3>
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Credential Type</th>
            <th className="p-2 border">Auth Type</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sources?.map((source) => (
            <tr key={source.id} className="text-center">
              <td className="p-2 border">{source.sourceName}</td>
              <td className="p-2 border">{source.type}</td>
              <td className="p-2 border">{source.credentialType}</td>
              <td className="p-2 border">{source.authType}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(source)}
                  className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSource(source.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
