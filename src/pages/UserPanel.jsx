import { useEffect, useState } from "react";
import {
  Loader,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Trash,
  Play,
  Clock,
  List,
  Edit,
} from "lucide-react";

export default function UserPanel() {
  // State variables to manage different functionalities
  const [pipelineName, setPipelineName] = useState("");
  const [selectedTechniques, setSelectedTechniques] = useState([]);
  const [ediChecked, setEdiChecked] = useState(false);
  const [preserveChecked, setPreserveChecked] = useState(false);
  const [sourceSelected, setSourceSelected] = useState("");
  const [sourceSelectedDB, setSourceSelectedDB] = useState("");
  const [step, setStep] = useState(1);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [piiAnalyzed, setPiiAnalyzed] = useState(false);
  const [piiColumns, setPiiColumns] = useState([]);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Function to toggle selection of data techniques
  const toggleTechnique = (technique) => {
    setSelectedTechniques((prev) =>
      prev.includes(technique)
        ? prev.filter((t) => t !== technique)
        : [...prev, technique]
    );
  };

  const handleAnalysePII = () => {
    setPiiAnalyzed(false);
    setTimeout(() => setPiiAnalyzed(true), 2000);
  };

  const handleShowPIIColumns = () => {
    setPiiColumns([
      {
        type: "Aadhar No",
        original: "1234-5678-9101",
        masked: "XXXX-XXXX-9101",
      },
      { type: "PAN", original: "ABCDE1234F", masked: "XXXXX1234F" },
      { type: "SSN", original: "987-65-4321", masked: "XXX-XX-4321" },
    ]);
  };

  const handleRunPipeline = () => {
    setPipelineRunning(true);
    setTimeout(() => {
      setPipelineRunning(false);
      setShowSummary(true);
      addPipelineToHistory({
        name: pipelines[pipelines.length - 1].name, // Pipeline name from User Panel input
        start: new Date().toLocaleTimeString(),
        end: "Pending",
        status: "Running",
        message: "Processing...",
      });
    }, 3000);
  };

  const [pipelines, setPipelines] = useState([]);
  const [savedConfig, setSavedConfig] = useState(null);

  useEffect(() => {
    const storedPipelines = JSON.parse(localStorage.getItem("pipelines")) || [];
    setPipelines(storedPipelines);
    const storedConfig = JSON.parse(localStorage.getItem("savedConfig"));
    setSavedConfig(storedConfig);
  }, []);

  const savePipelines = (newPipelines) => {
    setPipelines(newPipelines);
    localStorage.setItem("pipelines", JSON.stringify(newPipelines));
  };

  const handleCreatePipeline = async () => {
    if (pipelineName.trim() === "") return;
    const pipelineId = Math.random().toString().slice(2, 9);

    const newPipeline = {
      id: pipelineId,
      name: pipelineName,
      runID: `RUN${Date.now()}`,
    };

    try {
      const response = await fetch("http://localhost:8000/pipelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPipeline),
      });

      if (!response.ok) throw new Error("Failed to create pipeline");

      const createdPipeline = await response.json();
      savePipelines([...pipelines, createdPipeline]); // Update local state
      setPipelineName("");
      setStep(2);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePipeline = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/pipelines/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete pipeline");

      const updatedPipelines = pipelines.filter(
        (pipeline) => pipeline.id !== id
      );
      savePipelines(updatedPipelines); // Update local state
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveConfiguration = () => {
    const config = {
      selectedTechniques,
      ediChecked,
      preserveChecked,
      sourceSelected,
      piiColumns,
    };
    localStorage.setItem("savedConfig", JSON.stringify(config));
    setSavedConfig(config);
  };

  // ✅ Save Pipeline History Locally & to Backend
  const addPipelineToHistory = async (newPipeline) => {
    try {
      // Update Local Storage
      const existingHistory =
        JSON.parse(localStorage.getItem("pipelineHistory")) || [];
      const updatedHistory = [newPipeline, ...existingHistory];
      localStorage.setItem("pipelineHistory", JSON.stringify(updatedHistory));

      // Send to Backend
      const response = await fetch("http://localhost:8000/pipelines/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPipeline),
      });

      if (!response.ok) throw new Error("Failed to save pipeline history");

      fetchPipelineHistory(); // Refresh history list
    } catch (error) {
      console.error("Error saving pipeline history:", error);
    }
  };

  const [sources, setSources] = useState([]);

  useEffect(() => {
    const storedSources = JSON.parse(localStorage.getItem("sources")) || [];
    setSources(storedSources);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mr-12">
      <h2 className="text-2xl font-bold">Create Data Pipeline</h2>
      <p className="text-gray-600 mt-2">
        Secure your data with privacy techniques.
      </p>

      {/* Step 1: Create Pipeline */}
      {step === 1 && (
        <div className="mt-12">
          <h3 className="text-lg font-semibold">Existing Pipelines</h3>
          <ul className="mt-2">
            {pipelines.map((pipeline) => (
              <li
                key={pipeline.id}
                className="flex justify-between bg-gray-100 p-2 rounded-lg mt-2"
              >
                <span>
                  {pipeline.name} ({pipeline.runID})
                </span>
                <div className="space-x-2">
                  <button
                    className="text-red-600 cursor-pointer"
                    title="Delete"
                    onClick={() => handleDeletePipeline(pipeline.id)}
                  >
                    <Trash size={16} />
                  </button>
                  <button
                    className="text-blue-600 cursor-pointer"
                    title="Trigger Pipeline"
                    onClick={() => {
                      addPipelineToHistory({
                        name: pipeline.name, // Pipeline name from User Panel input
                        start: new Date().toLocaleTimeString(),
                        end: "Pending",
                        status: "Running",
                        message: "Processing...",
                      });
                    }}
                  >
                    <Play size={16} />
                  </button>
                  <button
                    className="text-green-600 cursor-pointer"
                    title="Schedule Pipeline"
                  >
                    <Clock size={16} />
                  </button>
                  <button
                    className="text-gray-600 cursor-pointer"
                    title="Edit Pipeline ID"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <hr className="my-4 border-[0.5px] border-[#ccc]" />
          <label>
            Enter Pipeline
            <input
              type="text"
              placeholder="Enter pipeline name"
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </label>
          <button
            className="bg-blue-600 text-white px-6 py-3 mt-4 rounded-lg hover:bg-blue-700"
            onClick={() => {
              handleCreatePipeline();
              setStep(2);
            }}
          >
            Create Pipeline
          </button>
        </div>
      )}

      {/* Step 2: Select Data Technique */}
      {step === 2 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">
            Step 1: Select Data Security Techniques
          </h3>
          {/* <p className="text-gray-600">
            Source DB: <span className="text-black font-bold">Database_01</span>
          </p> */}
          <label className="flex flex-col w-[50%]">
            Select Source DB
            <select
              className="border p-2 rounded"
              value={sourceSelectedDB}
              onChange={(e) => setSourceSelectedDB(e.target.value)}
            >
              <option>Select Source</option>
              {sources.map((source) => {
                return <option>{source.sourceName}</option>;
              })}
            </select>
          </label>
          <div className="flex flex-wrap mt-4 gap-2">
            {["Masking", "Tokenization", "Anonymization", "Generate"].map(
              (technique) => (
                <button
                  key={technique}
                  className={`px-4 py-2 rounded-lg ${
                    selectedTechniques.includes(technique)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => toggleTechnique(technique)}
                >
                  {technique}
                </button>
              )
            )}
          </div>
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
          <div className="mt-4 flex space-x-2">
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded-lg"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              onClick={() => setStep(3)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Analyse PII or Show Columns */}
      {step === 3 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Step 2: PII Analysis</h3>
          <div className="flex space-x-4 mt-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer"
              onClick={handleAnalysePII}
            >
              Analyse PII
            </button>
          </div>

          {/* Loading Effect */}
          {piiAnalyzed && (
            <>
              <p className="text-green-600 font-semibold mt-3 flex items-center">
                <CheckCircle className="mr-2" size={20} /> PII Analysis Complete
              </p>
              <label className="flex flex-col w-[50%]">
                Destination Source DB
                <select
                  className="border p-2 rounded"
                  value={sourceSelectedDB}
                  onChange={(e) => setSourceSelectedDB(e.target.value)}
                >
                  <option>Select Source</option>
                  {sources.map((source) => {
                    return <option>{source.sourceName}</option>;
                  })}
                </select>
              </label>
            </>
          )}
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded-lg"
            onClick={() => setStep(2)}
          >
            Back
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-lg cursor-pointer"
            onClick={() => {
              const config = {
                selectedTechniques,
                ediChecked,
                preserveChecked,
                sourceSelected,
                piiColumns,
              };
              setSavedConfig(config);
              setStep(4);
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Step 4: Finish Setup */}
      {step === 4 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Step 3: Save Configuration</h3>
          <p className="text-gray-600">
            Review your configuration before running the pipeline.
          </p>
          <h3 className="text-lg font-semibold">Saved Configuration</h3>
          <p>Techniques: {savedConfig?.selectedTechniques.join(", ")}</p>
          <p>EDI: {savedConfig?.ediChecked ? "Enabled" : "Disabled"}</p>
          <p>Preserve: {savedConfig?.preserveChecked ? "Yes" : "No"}</p>
          <p>Source Selected: {savedConfig?.sourceSelected}</p>
          {/* <p>PII Columns: {savedConfig?.piiColumns.length}</p> */}
          <button
            className="bg-gray-700 text-white px-4 py-2 mt-4 rounded-lg"
            onClick={handleSaveConfiguration}
          >
            Save Configuration
          </button>
          <div className="mt-4 flex space-x-2">
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded-lg"
              onClick={() => setStep(3)}
            >
              Back
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              onClick={() => setStep(5)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Run Pipeline */}
      {step === 5 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Step 4: Run Pipeline</h3>
          <div className="flex gap-2">
            <button
              className="bg-red-600 text-white px-4 py-2 mt-4 rounded-lg cursor-pointer"
              onClick={handleRunPipeline}
            >
              Run Pipeline
            </button>
            <button
              className="bg-gray-600 text-white px-4 py-2 mt-4 rounded-lg cursor-pointer"
              onClick={() => setStep(1)}
            >
              Back To Home
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Pipeline Running */}
      {pipelineRunning && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Pipeline Running...</h3>
          <Loader className="animate-spin text-blue-600 mt-2" size={24} />
        </div>
      )}

      {/* Step 7: Summary */}
      {showSummary && step === 5 && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowSummary(!showSummary)}
          >
            <h3 className="text-lg font-semibold">
              Pipeline Configuration Summary
            </h3>
            {showSummary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {showSummary && (
            <div className="mt-4">
              <p className="text-gray-700">✔ Security Techniques Applied</p>
              <p className="text-gray-700">✔ PII Columns Analyzed</p>
              <p className="text-gray-700">✔ Status: Pipeline Completed</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
