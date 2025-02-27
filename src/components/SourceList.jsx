import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SourceList() {
  const navigate = useNavigate();
  const [sources, setSources] = useState([]);

  useEffect(() => {
    const storedSources = JSON.parse(localStorage.getItem("sources")) || [];
    setSources(storedSources);
  }, []);

  const handleEdit = (source) => {
    navigate(`/setup`, { state: source });
  };

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
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
