import { useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, Play, Trash2 } from "lucide-react";

// Ek post ka tile: image ya video thumbnail + delete menu
const PostTile = ({ post, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = async () => {
    setMenuOpen(false);

    if (!window.confirm("Ye post delete karni hai?")) return;

    await onDelete(post.id);
  };

  return (
    <div className="relative aspect-square overflow-hidden rounded-xl bg-black group">
      {/* Tile pe click karo to post page khulta hai */}
      <Link to={`/post/${post.id}`} className="block h-full w-full">
        {post.media_type === "image" ? (
          <img
            src={post.media_url}
            alt={post.caption || "Post"}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <>
            {/* Grid me poora player nahi, sirf first frame (#t=0.1) dikhate hain, bahut halka */}
            <video
              src={`${post.media_url}#t=0.1`}
              preload="metadata"
              muted
              playsInline
              className="h-full w-full object-cover"
            />
            <div className="absolute left-2 top-2 rounded-full bg-black/50 p-1.5 text-white">
              <Play size={14} fill="currentColor" />
            </div>
          </>
        )}
      </Link>

      {/* Three-dot menu */}
      <div className="absolute right-2 top-2 z-10">
        <button
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Post options"
          className="cursor-pointer rounded-full bg-white/90 p-1.5 shadow-md backdrop-blur-sm transition hover:bg-white"
        >
          <MoreHorizontal size={18} className="text-gray-700" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-32 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
            <button
              onClick={handleDelete}
              className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfilePostsGrid = ({ posts, onDelete }) => {
  if (posts.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p>No posts yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 mb-10">
      {posts.map((post) => (
        <PostTile key={post.id} post={post} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ProfilePostsGrid;
