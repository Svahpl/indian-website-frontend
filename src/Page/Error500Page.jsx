import React from "react";
import { useNavigate } from "react-router-dom";

const Error500Page = () => {
  const navigate = useNavigate();
  const handleRefresh = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    // In a real app, you'd use your router's navigation
    window.location.href = "/";
  };

  return (
    <div className="w-screen h-screen bg-green-50 flex justify-center items-center">
      <div className="rounded-lg w-[600px] min-h-48 bg-green-800 text-white shadow-lg">
        <div className="flex flex-col gap-6 justify-center items-center px-8 py-8">
          {/* Icon and Main Message */}
          <div className="flex flex-row w-full gap-5 justify-center items-center">
            <div className="my-auto text-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-sprout"
                width="50"
                height="50"
              >
                <path d="M7 20h10"></path>
                <path d="M10 20c5.5-2.5.8-6.4 3-10"></path>
                <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"></path>
                <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"></path>
              </svg>
            </div>
            <div>
              <div className="font-bold text-xl">
                Oops! Something went wrong
              </div>
              <div className="text-base mt-1">
                Our garden needs a little tending. We're working to get things
                growing again!
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center text-green-100">
            <p className="text-sm">
              Don't worry - this happens sometimes. Our team has been notified
              and we're working on a fix.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-2">
            <button
              onClick={handleRefresh}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-refresh-cw"
                width="16"
                height="16"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M3 21v-5h5"></path>
              </svg>
              Try Again
            </button>
            <button
              onClick={handleGoHome}
              className="px-6 py-2 bg-green-900 hover:bg-green-950 rounded-md text-white font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-home"
                width="16"
                height="16"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9,22 9,12 15,12 15,22"></polyline>
              </svg>
              Go Home
            </button>
          </div>

          {/* Error Code */}
          <div className="text-green-200 text-xs mt-2">
            Error Code: 500 - Internal Server Error
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error500Page;
