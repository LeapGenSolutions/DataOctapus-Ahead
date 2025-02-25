import React from "react";
import AdminHeader from "./AdminHeader";

function Report() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <AdminHeader />
      <h2 className="text-xl font-bold">Power BI Report</h2>
      <div className="mt-4 bg-gray-200 p-6 rounded-lg flex justify-center items-center">
        {/* Embedding a Power BI Dummy Report */}
        <iframe
          title="Power BI Report"
          width="100%"
          height="500px"
          src="https://app.powerbi.com/view?r=eyJrIjoiYjQ2NjkzMTMtOGMzNi00Njc1LWI1NzUtODUwYzUzNTgxYmE5IiwidCI6IjFiYWJlYzg5LTcwNjQtNGNjOS1hYjFhLTdiMjYxYjQxZWI5MCIsImMiOjF9"
          allowFullScreen
          className="border rounded-lg"
        ></iframe>
      </div>
    </div>
  );
}

export default Report;
