import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const CyberCrimeWarning = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-[27%] left-0 right-0 bg-white bg-opacity-10 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl max-w-md w-full relative overflow-hidden animate-fade-in-up">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 to-red-500"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-yellow-100 opacity-30"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-red-100 opacity-30"></div>

        <div className="relative p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertTriangle className="text-yellow-600 w-8 h-8" strokeWidth={2} />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-red-600">
              Security Alert!
            </span>
          </h3>

          <div className="space-y-4 mb-6">
            <p className="text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-700">
                Sri Venkateshwara Agros And Herbs
              </span>{' '}
              will never ask for money in exchange for employment or investment opportunities.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-r text-left">
              <p className="text-sm text-yellow-700 font-medium">
                If you receive suspicious requests, please report immediately at:
              </p>
              <a
                href="https://www.cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-1 text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                www.cybercrime.gov.in
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleClose}
              className="bg-gradient-to-r from-yellow-500 to-red-500 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            >
              I Understand
            </button>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          aria-label="Close warning"
        >
          <X size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default CyberCrimeWarning;
