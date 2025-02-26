import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ComingSoon from "../assets/coming-soon.png";

function CopilotChat() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`fixed right-0 top-0 h-full bg-gray-900 text-white shadow-lg transition-all duration-300 flex flex-col justify-between ${
        isOpen ? "w-80 p-6" : "w-12 p-2"
      }`}
    >
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute left-[-35px] top-4 bg-gray-900 text-white p-2 rounded-full shadow-lg"
        >
          {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        {isOpen && (
          <>
            <h2 className="text-xl font-bold">Co-Pilot</h2>
            <p className="text-gray-400 mt-2">
              AI-powered assistant is coming soon...
            </p>
          </>
        )}
        <img src={ComingSoon} />
      </div>
      <div className="flex flex-row">
        <input
          className="border border-amber-50 py-2 px-4 rounded-xl"
          placeholder="Enter anything..."
        />
        <button className="bg-purple-500 p-2 ml-2 rounded-xl cursor-pointer">
          Send
        </button>
      </div>
    </div>
  );
}

export default CopilotChat;