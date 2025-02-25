import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ControlPanel = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  const pipelines = [
    {
      name: "Pipeline 1",
      start: "10:00 AM",
      end: "10:30 AM",
      status: "Completed",
      message: "Pipeline executed successfully",
    },
    {
      name: "Pipeline 2",
      start: "11:00 AM",
      end: "11:45 AM",
      status: "Failed",
      message: "Error: Database connection lost",
    },
    {
      name: "Pipeline 3",
      start: "12:30 PM",
      end: "1:00 PM",
      status: "Running",
      message: "Processing...",
    },
  ];

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
