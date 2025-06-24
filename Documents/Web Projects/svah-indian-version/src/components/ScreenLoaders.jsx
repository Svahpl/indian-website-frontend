import React from "react";

const ScreenLoaders = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4 border border-gray-100">
        <div className="h-20 flex justify-center items-center">
          <div className="relative">
            <div
              className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"
              style={{ borderTopColor: "#1d3825" }}
            ></div>
            <div
              className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-pulse"
              style={{ borderTopColor: "#1d382580" }}
            ></div>
          </div>
        </div>
        <p className="text-gray-600 font-medium text-sm">{text}</p>
      </div>
    </div>
  );
};

export default ScreenLoaders;
