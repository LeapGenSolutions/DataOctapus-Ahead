import { useState, useEffect } from "react";

const ControlPanel = () => {
  const [pipelines, setPipelines] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    const storedPipelines =
      JSON.parse(localStorage.getItem("pipelineHistory")) || [];
    setPipelines(storedPipelines);
  }, []);

  const updateStatus = (index, newStatus) => {
    const updatedPipelines = [...pipelines];
    updatedPipelines[index].status = newStatus;
    localStorage.setItem("pipelineHistory", JSON.stringify(updatedPipelines));
    setPipelines(updatedPipelines);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Control Panel</h1>
      <div className="border rounded-lg p-4 shadow-md bg-white">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Pipeline Name</th>
              <th className="border border-gray-300 p-2">Start Time</th>
              <th className="border border-gray-300 p-2">End Time</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
              <th className="border border-gray-300 p-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {pipelines.map((pipeline, index) => (
              <tr key={index} className="border border-gray-300 text-center">
                <td className="p-2">{pipeline.name}</td>
                <td className="p-2">{pipeline.start}</td>
                <td className="p-2">{pipeline.end}</td>
                <td className="p-2">{pipeline.status}</td>
                <td className="p-2 flex gap-2 justify-center">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => updateStatus(index, "Completed")}
                  >
                    Refresh
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => updateStatus(index, "Cancelled")}
                  >
                    Cancel
                  </button>
                </td>
                <td className="p-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => {
                      setMessageContent(pipeline.message);
                      setShowMessage(true);
                    }}
                  >
                    View Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold">Pipeline Message</h2>
            <p className="mt-2">{messageContent}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => setShowMessage(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
