import { useState, useRef, useEffect } from "react";
import { X, ImagePlus, Upload, RefreshCw } from "lucide-react";
import { usePost } from "../hooks/usePost";
import { showError } from "../../../utils/toast";

const MAX_SIZE_MB = 50;

const CreatePostModal = ({ isOpen, onClose }) => {
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const { handleCreatePost } = usePost();

  const resetForm = () => {
    setMedia(null);
    setMediaType("");
    setCaption("");
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Preview URL ko memory leak se bachane ke liye revoke karna zaroori hai
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Modal band hone par form reset
  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      resetForm();
      setLoading(false);
    }
  }, [isOpen]);

  const requestClose = () => {
    if (loading) return; // upload ke beech me close nahi
    onClose();
  };

  // Escape se close
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") requestClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, loading]);

  const handleSubmit = async () => {
    if (loading) return;

    if (!media) {
      showError("Please select an image or video.");
      return;
    }

    setLoading(true);

    // handleCreatePost ab true/false return karta hai (error pe modal band nahi hota,
    // taaki user ka selected media aur caption na khoye)
    const success = await handleCreatePost({ media, caption });

    setLoading(false);

    if (success) {
      resetForm();
      onClose();
    }
  };

  const handleMedia = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      showError("Sirf image ya video select karo.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      showError(`File ${MAX_SIZE_MB}MB se choti honi chahiye.`);
      e.target.value = "";
      return;
    }

    setMedia(file);
    setMediaType(isImage ? "image" : "video");
    setPreview(URL.createObjectURL(file));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Create new post"
    >
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
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">Create New Post</h2>
          <button
            onClick={requestClose}
            disabled={loading}
            aria-label="Close"
            className="rounded-full p-2 transition hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
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
                <>
                  {mediaType === "image" ? (
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
                  )}

                  {/* Pehle ek baar media chun liya to badalne ka koi tareeka nahi tha */}
                  <button
                    onClick={triggerFileInput}
                    disabled={loading}
                    className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-black/80 disabled:opacity-40 cursor-pointer"
                  >
                    <RefreshCw size={14} />
                    Change
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <ImagePlus size={40} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                    Add media
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Image ya video, max {MAX_SIZE_MB}MB
                  </p>

                  <button
                    onClick={triggerFileInput}
                    className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-2.5 text-white hover:bg-violet-700 transition cursor-pointer"
                  >
                    <Upload size={18} />
                    Select from device
                  </button>
                </div>
              )}

              {/* Input hamesha render hota hai taaki Change button bhi kaam kare */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleMedia}
              />
            </div>

            {/* Caption & Submit */}
            <div className="flex flex-col p-5 md:p-6 bg-white">
              <div className="flex-1">
                <label
                  htmlFor="caption"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Caption
                </label>
                <textarea
                  id="caption"
                  maxLength={200}
                  rows={4}
                  value={caption}
                  disabled={loading}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full resize-none rounded-xl border border-gray-300 p-4 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition h-32 md:h-48 disabled:bg-gray-50"
                />
                <div className="mt-1 text-right text-xs text-gray-400">
                  {caption.length}/200
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !media}
                className={`
                  mt-4 w-full rounded-xl py-3 font-semibold text-white transition
                  ${
                    loading || !media
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 active:scale-95 cursor-pointer"
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
