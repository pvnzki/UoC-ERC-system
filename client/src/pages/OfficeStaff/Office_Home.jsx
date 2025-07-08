import React from "react";

const Office_Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <h1 className="text-3xl font-bold mb-4 text-blue-800">
        Office Staff Dashboard
      </h1>
      <p className="text-lg text-gray-600">
        Welcome to your dashboard. Use the sidebar to view and manage
        applications.
      </p>
      {/* Add dashboard widgets, stats, or quick links here if desired */}
    </div>
  );
};

export default Office_Home;
