import React from "react";
import { Link } from "react-router-dom";
import { User, AtSign, Mail, Lock, Camera } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const SignUpForm = ({ form, onChange, onSubmit }) => {
  const { loading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-5">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Camera className="text-white" size={30} />
          </div>
        </div>

        {/* Heading */}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>

          <p className="text-gray-500 mt-2">Join our community today 🚀</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Full Name */}

          <div>
            <label className="text-sm font-medium text-gray-600">
              Full Name
            </label>

            <div className="mt-2 flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-violet-500">
              <User size={20} className="text-gray-400 mr-3" />

              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={onChange}
                placeholder="John Doe"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Username */}

          <div>
            <label className="text-sm font-medium text-gray-600">
              Username
            </label>

            <div className="mt-2 flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-violet-500">
              <AtSign size={20} className="text-gray-400 mr-3" />

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={onChange}
                placeholder="username123"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Email */}

          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>

            <div className="mt-2 flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-violet-500">
              <Mail size={20} className="text-gray-400 mr-3" />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="name@example.com"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Password */}

          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>

            <div className="mt-2 flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-violet-500">
              <Lock size={20} className="text-gray-400 mr-3" />

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}

        <p className="text-center mt-7 text-gray-500">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-violet-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
