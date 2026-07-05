import React from "react";
import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-6">
      <div className="max-w-md w-full text-center bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10">

        {/* Icon */}
        <div className="mx-auto flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6">
          <SearchX size={50} className="text-red-500" />
        </div>

        {/* Error Code */}
        <h1 className="text-7xl font-extrabold text-gray-900">
          404
        </h1>

        {/* Heading */}
        <h2 className="mt-4 text-2xl font-bold text-gray-800">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-gray-500 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          <Home size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;