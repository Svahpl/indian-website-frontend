import React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Animation Container */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            {/* Animated Success Icon */}
            <div className="animate-bounce">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            </div>

            {/* Celebratory Rings */}
            <div className="absolute inset-0 -m-4">
              <div className="w-28 h-28 border-4 border-green-200 rounded-full animate-ping opacity-30"></div>
            </div>
            <div className="absolute inset-0 -m-2">
              <div className="w-24 h-24 border-2 border-green-300 rounded-full animate-ping opacity-40 animation-delay-200"></div>
            </div>
          </div>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Payment Complete!
          </h1>

          <p className="text-gray-600 mb-8 text-lg">
            Thank you for your purchase. Your payment has been processed
            successfully.
          </p>

          {/* View Order Button */}
          <button
            onClick={() => navigate("/my-account/orders")}
            className="group w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-200"
          >
            <span className="flex items-center justify-center">
              View Your Order
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </button>

          {/* Decorative Elements */}
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse animation-delay-100"></div>
            <div className="w-2 h-2 bg-teal-300 rounded-full animate-pulse animation-delay-200"></div>
          </div>
        </div>

        {/* Subtle Footer Message */}
        <p className="text-center text-gray-500 text-sm mt-6">
          A confirmation email has been sent to your inbox
        </p>
      </div>
    </div>
  );
}
