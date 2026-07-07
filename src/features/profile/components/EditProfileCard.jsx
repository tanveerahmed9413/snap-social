import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, User, AtSign, FileText, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";

const EditProfileCard = () => {
  const fileInputRef = useRef(null);

  const { handleProfileUpdate, loading, profile, handleGetProfile } =
    useProfile();

  useEffect(() => {
    if (!profile) {
      handleGetProfile();
    }
  }, []);

  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    bio: "",
    profilePic: "",
  });

  useEffect(() => {
    if (!profile) return;

    setFormData({
      username: profile.username || "",
      fullName: profile.full_name || "",
      bio: profile.bio || "",
      profilePic: profile.avatar_url || "",
    });
  }, [profile]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setFormData((prev) => ({
      ...prev,
      profilePic: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await handleProfileUpdate({
        username: formData.username,
        full_name: formData.fullName,
        bio: formData.bio,
        avatar: imageFile,
      });
      navigate("/app/profile");
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Header */}

        <div className="flex items-center justify-between border-b px-8 py-6">
          <div className="flex items-start gap-4">
            <Link
              to="/app/profile"
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ArrowLeft />
            </Link>

            <h1 className="text-3xl font-bold text-gray-800">Edit Profile</h1>
          </div>
        </div>

        {/* Body */}

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {/* Profile */}

          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={formData.profilePic}
                alt="profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-indigo-100"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute cursor-pointer bottom-1 right-1 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full"
              >
                <Camera size={18} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleImage}
              />
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="mt-5 cursor-pointer text-indigo-600 font-semibold hover:underline"
            >
              Change Profile Photo
            </button>
          </div>

          {/* Username */}

          <div>
            <label className="font-semibold text-gray-700 mb-2 block">
              Username
            </label>

            <div className="relative">
              <AtSign
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Name */}

          <div>
            <label className="font-semibold text-gray-700 mb-2 block">
              Full Name
            </label>

            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Bio */}

          <div>
            <label className="font-semibold text-gray-700 mb-2 block">
              Bio
            </label>

            <div className="relative">
              <FileText
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />

              <textarea
                rows={5}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                maxLength={160}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />

              <p className="text-right text-sm text-gray-400 mt-2">
                {formData.bio.length}/160
              </p>
            </div>
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-4 border-t pt-8">
            <Link
              to="/profile"
              className="px-6 py-3 rounded-xl border hover:bg-gray-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 cursor-pointer rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {loading ? "Updating Profile..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileCard;
