import React, { useState, useRef,useEffect } from "react";
import { X, ImagePlus, Upload } from "lucide-react";
import { usePost } from "../hooks/usePost";
import { useAuth } from "../../auth/hooks/useAuth";
import { supabase } from "../../../app/supabase";

const CreatePostModal = ({ isOpen, onClose }) => {
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const { handleCreatePost } = usePost();

  useEffect(() => {
    if (!isOpen) {
      setMedia(null);
      setMediaType("");
      setCaption("");
      setPreview("");
      setLoading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!media) return alert("Please select an image or video.");

    try {
      setLoading(true);
      await handleCreatePost({ media, caption });
      // Reset form
      setCaption("");
      setMedia(null);
      setPreview("");
      setMediaType("");
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMedia = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMedia(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    if (file.type.startsWith("image")) {
      setMediaType("image");
    } else if (file.type.startsWith("video")) {
      setMediaType("video");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="
          bg-white
          w-full
          max-w-4xl
          rounded-2xl
          shadow-2xl
          overflow-hidden
          flex
          flex-col
          max-h-[90vh]
          md:max-h-[90vh]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">Create New Post</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            {/* Media Preview / Upload Area */}
            <div className="relative flex items-center justify-center bg-gray-50 min-h-[200px] md:min-h-[400px] p-4">
              {preview ? (
                mediaType === "image" ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-[70vh] md:max-h-[500px] w-full object-contain rounded-lg"
                  />
                ) : (
                  <video
                    src={preview}
                    controls
                    className="max-h-[70vh] md:max-h-[500px] w-full object-contain rounded-lg"
                  />
                )
              ) : (
                <div className="flex flex-col items-center text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <ImagePlus size={40} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">Add media</h3>
                  <p className="text-sm text-gray-400 mt-1 mb-4">
                    Drag and drop or click to select
                  </p>
                  <button
                    onClick={triggerFileInput}
                    className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-2.5 text-white hover:bg-violet-700 transition"
                  >
                    <Upload size={18} />
                    Select from device
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleMedia}
                  />
                </div>
              )}
            </div>

            {/* Caption & Submit */}
            <div className="flex flex-col p-5 md:p-6 bg-white">
              <div className="flex-1">
                <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
                  Caption
                </label>
                <textarea
                  id="caption"
                  maxLength={200}
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full resize-none rounded-xl border border-gray-300 p-4 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition h-32 md:h-48"
                />
                <div className="mt-1 text-right text-xs text-gray-400">
                  {caption.length}/200
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`
                  mt-4 w-full rounded-xl py-3 font-semibold text-white transition
                  ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 active:scale-95"
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  "Share Post"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;