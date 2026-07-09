import React from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff,HandCoins } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const SignInForm = ({ form, handleSubmit, handleChange,handleEyeButton,showPassword }) => {

  const { loading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-5">
      <div className="w-full max-w-md rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-2xl p-8">
        {/* Heading */}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome Back 👋</h1>

          <p className="text-gray-500 mt-3">
            Sign in to continue to your account.
          </p>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Email Address
            </label>

            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
              type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 outline-none transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </div>

          {/* Password */}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>

              {/* <button
                type="button"
                className="text-sm font-medium text-violet-600 hover:text-violet-700"
              >
                Forgot Password?
              </button> */}
            </div>

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-12 outline-none transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />

              <button
                type="button"
                onClick={handleEyeButton}
                className="absolute  cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 transition"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />} 
              </button>
            </div>
          </div>

          {/* Sign In Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-100"
          >
            { loading ?  "Signing..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}

        <div className="mt-8 text-center text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-violet-600 hover:text-violet-700"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
