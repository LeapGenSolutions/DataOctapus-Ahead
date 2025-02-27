import { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import { useLocation, useNavigate } from "react-router-dom";

export default function Setup() {
  const location = useLocation();
  const existingData = location.state || {}; // Data from edit
  const navigate = useNavigate();

  const [sourceName, setSourceName] = useState(existingData.sourceName || "");
  const [sourceType, setSourceType] = useState(existingData.type || "SQL");
  const [sourcecredentialType, setsourceCredentialType] = useState(
    existingData.sourcecredentialType || ""
  );
  const [credentialType, setCredentialType] = useState(
    existingData.credentialType || ""
  );
  const [authType, setAuthType] = useState(existingData.authType || "");
  const [step, setStep] = useState(1);
  const [authMethod, setAuthMethod] = useState(existingData.authMethod || "");
  const [sourceOption, setSourceOption] = useState(
    existingData.sourceOption || ""
  );
  const [availableTables, setAvailableTables] = useState([
    "Countries",
    "Departments",
    "Employees",
    "Job History",
    "Locations",
    "Regions",
  ]);
  const [selectedTables, setSelectedTables] = useState(
    existingData.selectedTables || []
  );
  const [ediChecked, setEdiChecked] = useState(
    existingData.ediChecked || false
  );
  const [preserveChecked, setPreserveChecked] = useState(
    existingData.preserveChecked || false
  );
  const [sourceSelected, setSourceSelected] = useState(
    existingData.sourceSelected || ""
  );
  const [fqdn, setFqdn] = useState(existingData.fqdn || "");
  const [databaseName, setDatabaseName] = useState(
    existingData.databaseName || ""
  );
  const [username, setUsername] = useState(existingData.username || "");
  const [password, setPassword] = useState(existingData.password || "");
  const [servicePrincipleId, setServicePrincipleId] = useState(
    existingData.servicePrincipleId || ""
  );
  const [servicePrincipleKey, setServicePrincipleKey] = useState(
    existingData.servicePrincipleKey || ""
  );

  const handleSelectTable = (table) => {
    setAvailableTables(availableTables.filter((t) => t !== table));
    setSelectedTables([...selectedTables, table]);
  };

  const handleDeselectTable = (table) => {
    setSelectedTables(selectedTables.filter((t) => t !== table));
    setAvailableTables([...availableTables, table]);
  };

  const [sources, setSources] = useState([]);

  useEffect(() => {
    const storedSources = JSON.parse(localStorage.getItem("sources")) || [];
    setSources(storedSources);
  }, []);

  const saveSources = (newSources) => {
    setSources(newSources);
    localStorage.setItem("sources", JSON.stringify(newSources));
  };

  const handleCreateSource = () => {
    if (sourceName.trim() === "") return alert("Enter Source Name!");
    const newSource = {
      id: Math.random().toString().slice(2, 6),
      sourceName: sourceName,
      type: sourceType,
      authType: authType,
      sourcecredentialType: sourcecredentialType,
      credentialType: credentialType,
      authMethod: authMethod,
      sourceOption: sourceOption,
      selectedTables: selectedTables,
      ediChecked: ediChecked,
      preserveChecked: preserveChecked,
      sourceSelected: sourceSelected,
      fqdn,
      databaseName,
      username,
      password,
      servicePrincipleId,
      servicePrincipleKey,
    };

    if (existingData.id) {
      // Update existing source
      const updatedSources = sources.map((source) =>
        source.id === existingData.id ? newSource : source
      );
      saveSources(updatedSources);
    } else {
      // Create new source
      saveSources([...sources, newSource]);
    }

    navigate("/admin");
  };

  const handleDeleteSource = (id) => {
    const updatedSources = sources.filter((source) => source.id !== id);
    saveSources(updatedSources);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <AdminHeader />
      <h3 className="text-lg font-bold">Configure</h3>

      {step === 1 && (
        <>
          <label className="flex flex-col">
            Source Name
            <input
              type="text"
              placeholder="Source Name"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              className="border p-2 rounded-lg w-[50%]"
            />
          </label>
          {/* Source Type */}
          <div className="mt-4">
            <h4 className="text-md font-bold">Source Type</h4>
            <select
              className="p-3 border rounded-lg mt-2 w-[50%]"
              onChange={(e) => setSourceType(e.target.value)}
              value={sourceType}
            >
              <option value="">Select Source</option>
              <option value="SQL">SQL</option>
              <option value="Oracle">Oracle</option>
              <option value="Files">Files</option>
            </select>
          </div>
          {sourceType === "Files" && (
            <div className="mt-4">
              <input
                type="checkbox"
                checked={ediChecked}
                onChange={() => setEdiChecked(!ediChecked)}
              />{" "}
              EDI
              {ediChecked && (
                <div className="ml-4 mt-2 flex flex-col items-start">
                  <label>
                    <input
                      type="checkbox"
                      checked={preserveChecked}
                      onChange={() => setPreserveChecked(!preserveChecked)}
                    />{" "}
                    Preserve
                  </label>
                  {preserveChecked && (
                    <label className="flex flex-col">
                      Select Source
                      <select
                        className="border p-2 rounded"
                        value={sourceSelected}
                        onChange={(e) => setSourceSelected(e.target.value)}
                      >
                        <option>Select Source</option>
                        {sources.map((source) => {
                          return <option>{source.sourceName}</option>;
                        })}
                      </select>
                    </label>
                  )}
                </div>
              )}
            </div>
          )}
          {/* Credentials */}
          <div className="mt-4">
            <h4 className="text-md font-bold">Source Credentials</h4>
            <button
              className={`p-2 mr-2 ${
                sourcecredentialType === "On-Prem"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => setsourceCredentialType("On-Prem")}
            >
              On-Prem
            </button>
            <button
              className={`p-2 ${
                sourcecredentialType === "Cloud"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => setsourceCredentialType("Cloud")}
            >
              Cloud
            </button>
          </div>
          {sourcecredentialType && (
            <>
              {/* Fully Qualified Domain Name & Database Name */}
              <div className="mt-4 flex flex-col w-[50%]">
                <label className="flex flex-col">
                  Fully Qualified Domain Name
                  <input
                    type="text"
                    placeholder="FQDN"
                    className="p-3 border rounded-lg mb-2"
                    value={fqdn}
                    onChange={(e) => setFqdn(e.target.value)}
                  />
                </label>
                <label className="flex flex-col">
                  {sourceType == "Files" ? "Host" : "Database Name"}
                  <input
                    type="text"
                    placeholder={
                      sourceType == "Files"
                        ? "eg. \\\\Server Name\\Shared Folder"
                        : "Database Name"
                    }
                    className="p-3 border rounded-lg mb-2"
                    value={databaseName}
                    onChange={(e) => setDatabaseName(e.target.value)}
                  />
                </label>
              </div>

              {/* Authentication Type */}
              <div className="mt-4">
                <h4 className="text-md font-bold">Authentication Type</h4>
                <select
                  className="p-3 border rounded-lg mt-2 w-[50%]"
                  onChange={(e) => setAuthType(e.target.value)}
                  value={authType}
                >
                  <option value="">Select Authentication Type</option>
                  <option value="SQL Auth">SQL Auth</option>
                  <option value="Service Principle">Service Principle</option>
                </select>
              </div>
              {/* Credentials for SQL Auth */}
              {authType === "SQL Auth" && (
                <div className="mt-2">
                  <label className="flex flex-col w-[50%] mt-2">
                    Username
                    <input
                      type="text"
                      placeholder="Username"
                      className="p-3 border rounded-lg mb-2"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </label>
                  <h4 className="text-md font-bold">Authentication Method</h4>
                  <button
                    className={`p-2 mr-2 ${
                      credentialType === "Password"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-300"
                    }`}
                    onClick={() => setCredentialType("Password")}
                  >
                    Password
                  </button>
                  {sourcecredentialType === "Cloud" && (
                    <button
                      className={`p-2 ${
                        credentialType === "Azure Key Vault"
                          ? "bg-purple-500 text-white"
                          : "bg-gray-300"
                      }`}
                      onClick={() => setCredentialType("Azure Key Vault")}
                    >
                      Azure Key Vault
                    </button>
                  )}

                  {credentialType === "Password" && (
                    <div className="mt-4 flex flex-col w-[50%]">
                      <label className="flex flex-col">
                        Password
                        <input
                          type="password"
                          placeholder="Password"
                          className="p-3 border rounded-lg"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </label>
                    </div>
                  )}

                  {credentialType === "Azure Key Vault" && (
                    <div className="mt-4 flex flex-col w-[50%]">
                      <label className="flex flex-col">
                        AVK Linked Service
                        <select className="p-3 border rounded-lg mb-2">
                          <option>Select Linked Service</option>
                        </select>
                      </label>
                      <label className="flex flex-col">
                        Secret Name
                        <select className="p-3 border rounded-lg mb-2">
                          <option>Select Secret Name</option>
                        </select>
                      </label>
                      <label className="flex flex-col">
                        Secret Version
                        <select className="p-3 border rounded-lg">
                          <option>Select Secret Version</option>
                        </select>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Service Principle Authentication */}
              {authType === "Service Principle" && (
                <div className="mt-4">
                  <h4 className="text-md font-bold">
                    Authentication Reference Method
                  </h4>
                  <label>
                    <input
                      type="radio"
                      name="authMethod"
                      value="Inline"
                      checked={authMethod === "Inline"}
                      onChange={() => setAuthMethod("Inline")}
                    />{" "}
                    Inline
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="authMethod"
                      value="Credential"
                      checked={authMethod === "Credential"}
                      onChange={() => setAuthMethod("Credential")}
                    />{" "}
                    Credential
                  </label>

                  {authMethod === "Inline" && (
                    <div className="mt-4 flex flex-col w-[50%]">
                      <label className="flex flex-col">
                        Service Principle ID
                        <input
                          type="text"
                          placeholder="Service Principle ID"
                          className="p-3 border rounded-lg mb-2"
                          value={servicePrincipleId}
                          onChange={(e) =>
                            setServicePrincipleId(e.target.value)
                          }
                        />
                      </label>
                      <h4 className="text-md font-bold">
                        Authentication Method
                      </h4>
                      <div className="flex flex-row gap-1">
                        <button
                          className={`p-2 mr-2 ${
                            credentialType === "Service Principle Key"
                              ? "bg-purple-500 text-white"
                              : "bg-gray-300"
                          }`}
                          onClick={() =>
                            setCredentialType("Service Principle Key")
                          }
                        >
                          Service Principle Key
                        </button>
                        <button
                          className={`p-2 ${
                            credentialType === "Azure Key Vault"
                              ? "bg-purple-500 text-white"
                              : "bg-gray-300"
                          }`}
                          onClick={() => setCredentialType("Azure Key Vault")}
                        >
                          Azure Key Vault
                        </button>
                      </div>
                      {credentialType === "Service Principle Key" && (
                        <input
                          type="text"
                          placeholder="Service Principle Key"
                          className="p-3 border rounded-lg mt-2"
                          value={servicePrincipleKey}
                          onChange={(e) =>
                            setServicePrincipleKey(e.target.value)
                          }
                        />
                      )}

                      {credentialType === "Azure Key Vault" && (
                        <div className="mt-4 flex flex-col w-[50%]">
                          <label className="flex flex-col">
                            AVK Linked Service
                            <select className="p-3 border rounded-lg mb-2">
                              <option>Select Linked Service</option>
                            </select>
                          </label>
                          <label className="flex flex-col">
                            Secret Name
                            <select className="p-3 border rounded-lg mb-2">
                              <option>Select Secret Name</option>
                            </select>
                          </label>
                          <label className="flex flex-col">
                            Secret Version
                            <select className="p-3 border rounded-lg">
                              <option>Select Secret Version</option>
                            </select>
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <button
                className="p-2 bg-blue-500 text-white mt-4"
                onClick={() => {
                  if (sourceType === "Files") {
                    handleCreateSource();
                  } else {
                    setStep(2);
                  }
                }}
              >
                {sourceType === "Files" ? "Create Source" : "Next"}
              </button>
            </>
          )}
        </>
      )}

      {step === 2 && (
        <>
          {sourceType !== "Files" ? (
            <>
              <h3 className="text-lg font-bold">Create Source</h3>

              {/* Radio options for data selection */}
              <div className="mt-4">
                <label className="block">
                  <input
                    type="radio"
                    name="sourceOption"
                    value="all"
                    checked={sourceOption === "all"}
                    onChange={() => setSourceOption("all")}
                  />
                  Select All Tables
                </label>
                <label className="block">
                  <input
                    type="radio"
                    name="sourceOption"
                    value="listTables"
                    checked={sourceOption === "listTables"}
                    onChange={() => setSourceOption("listTables")}
                  />
                  List Specific Tables
                </label>
                <label className="block">
                  <input
                    type="radio"
                    name="sourceOption"
                    value="writeQuery"
                    checked={sourceOption === "writeQuery"}
                    onChange={() => setSourceOption("writeQuery")}
                  />
                  Write a Query
                </label>
              </div>

              {/* Show query input box when "Write a Query" is selected */}
              {sourceOption === "writeQuery" && (
                <div className="mt-4">
                  <h4 className="text-md font-bold">Enter Your Query</h4>
                  <textarea
                    className="w-full p-3 border rounded-lg"
                    placeholder="Write your SQL query here..."
                  />
                </div>
              )}

              {/* Show dual table selection when "List Specific Tables" is selected */}
              {sourceOption === "listTables" && (
                <div className="mt-4 flex gap-6">
                  {/* Available Tables */}
                  <div className="w-1/2">
                    <h4 className="text-md font-bold">Available Tables</h4>
                    <ul className="border p-3 rounded-lg h-40 overflow-auto">
                      {availableTables.map((table) => (
                        <li
                          key={table}
                          className="cursor-pointer p-2 hover:bg-gray-200"
                          onClick={() => handleSelectTable(table)}
                        >
                          {table}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Selected Tables */}
                  <div className="w-1/2">
                    <h4 className="text-md font-bold">Selected Tables</h4>
                    <ul className="border p-3 rounded-lg h-40 overflow-auto">
                      {selectedTables.map((table) => (
                        <li
                          key={table}
                          className="cursor-pointer p-2 hover:bg-gray-200"
                          onClick={() => handleDeselectTable(table)}
                        >
                          {table}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p>Click on the button below to create connection.</p>
          )}

          {/* Navigation Buttons */}
          <button
            className="p-2 bg-blue-500 text-white mt-4"
            onClick={() => setStep(1)}
          >
            Back
          </button>
          <button
            onClick={handleCreateSource}
            className="p-2 bg-green-500 text-white mt-4 ml-2"
          >
            {existingData.id ? "Update Source" : "Create Source"}
          </button>
        </>
      )}
    </div>
  );
}
