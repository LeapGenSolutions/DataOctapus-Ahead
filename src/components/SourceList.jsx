import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SourceList() {
  const navigate = useNavigate();
  const [sources, setSources] = useState([
    {
      id: 1,
      name: "Source 1",
      type: "SQL",
      authType: "SQL Auth",
      sourcecredentialType: "On-Prem",
      credentialType: "Password",
      authMethod: "Inline",
      sourceOption: "listTables",
      selectedTables: ["Item 1", "Item 2"],
      ediChecked: true,
      preserveChecked: true,
      sourceSelected: true,
    },
    {
      id: 2,
      name: "Source 2",
      type: "Oracle",
      authType: "Service Principle",
      sourcecredentialType: "Cloud",
      credentialType: "Azure Key Vault",
      authMethod: "Inline",
      sourceOption: "listTables",
      selectedTables: ["Item 1", "Item 2"],
      ediChecked: true,
      preserveChecked: true,
      sourceSelected: true,
    },
  ]);

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
          {sources.map((source) => (
            <tr key={source.id} className="text-center">
              <td className="p-2 border">{source.name}</td>
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
