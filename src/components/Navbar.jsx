import { useState } from "react";

import { useAuth } from "../features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";



const Navbar = ({ onCreateClick }) => {


  const { signout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signout();
    navigate("/signin");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
  <div className="flex items-center justify-between lg:justify-end px-4 py-4 lg:px-8">

    {/* Logo */}
    <h1 className="text-2xl lg:hidden  font-bold text-indigo-600">
      Lumina
    </h1>

    {/* Actions */}
    <div className="flex items-center gap-3">
      <button
        onClick={onCreateClick}
        className="rounded-lg bg-indigo-600 cursor-pointer px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
      >
        + Create Post
      </button>

      <button
        onClick={handleLogout}
        disabled={loading}
        className="hidden lg:block cursor-pointer rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
    </div>

  </div>
</header>
  );
};

export default Navbar;
