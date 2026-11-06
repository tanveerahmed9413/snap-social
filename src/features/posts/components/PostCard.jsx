import { Heart, MessageCircle, Send, Bookmark, ImageOff } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { memo, useRef, useState } from "react";
import MediaPlayer from "../../../components/MediaPlayer";
import { usePost } from "../hooks/usePost";
import { useAuth } from "../../auth/hooks/useAuth";
import { showSuccess } from "../../../utils/toast";
import { sharePost } from "../../../utils/sharePost";
import useVideoVisibility from "../../../shared/hooks/useVideoVisibility";
import { useFollow } from "../../follows/hooks/useFollow";

const FALLBACK_AVATAR =
  "https://img.icons8.com/?size=100&id=60023&format=png&color=000000";

const timeAgo = (date) => {
  try {
    return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
  } catch {
    return "";
  }
};

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const { handleToggleLike, isMuted, setIsMuted } = usePost();
  const {
    handleToggleFollow,
    followingMap,
    loading: followLoading,
  } = useFollow();

  const [mediaFailed, setMediaFailed] = useState(false);
  const [heartPop, setHeartPop] = useState(false);

  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useVideoVisibility(containerRef, playerRef);

  const author = post.profiles;
  const isOwnProfile = !!author && user?.id === author.id;
  const isFollowing = (author && followingMap[author.id]) || false;

  const isLiked =
    post.likes?.some((like) => like.user_id === user?.id) || false;

  // Double tap / double click se like (Instagram style)
  const handleDoubleTap = () => {
    if (!isLiked) handleToggleLike(post.id);
    setHeartPop(true);
    setTimeout(() => setHeartPop(false), 700);
  };

  return (
    <article
      ref={containerRef}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={author?.avatar_url || FALLBACK_AVATAR}
            alt={author?.username || "user"}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_AVATAR;
            }}
            className="w-12 h-12 rounded-full object-cover shrink-0"
          />

          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {author?.full_name || author?.username || "Unknown user"}
            </h3>

            <p className="text-sm text-gray-500 truncate">
              {author?.username ? `@${author.username}` : ""}
            </p>
          </div>
        </div>

        {author && !isOwnProfile && (
          <button
            onClick={() => handleToggleFollow(author.id)}
            disabled={followLoading}
            className={`px-5 py-2 active:scale-95 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-60 shrink-0
      ${
        isFollowing
          ? "bg-gray-100 text-gray-800 hover:bg-red-50 hover:text-red-600 border border-gray-200"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-5 pb-4">
          <p className="text-gray-700 leading-7 whitespace-pre-wrap break-words">
            {post.caption}
          </p>
        </div>
      )}

      {/* Image or Video */}
      <div
        className="relative bg-black flex justify-center items-center min-h-[350px] lg:min-h-[400px]"
        onDoubleClick={
          post.media_type === "image" ? handleDoubleTap : undefined
        }
      >
        {mediaFailed ? (
          <div className="flex flex-col items-center gap-2 text-gray-400 py-16">
            <ImageOff size={36} />
            <p className="text-sm">Media load nahi hua</p>
          </div>
        ) : post.media_type === "image" ? (
          <img
            src={post.media_url}
            alt={post.caption || "Post"}
            loading="lazy"
            decoding="async"
            onError={() => setMediaFailed(true)}
            className="block w-full max-w-[400px] lg:max-w-[340px] max-h-[350px] lg:max-h-[400px] object-contain select-none"
          />
        ) : (
          // autoPlay nahi: visibility manager sirf screen pe dikhne wali video chalata hai
          <MediaPlayer
            ref={playerRef}
            src={post.media_url}
            className="block w-full max-w-[400px] lg:max-w-[340px] max-h-[350px] lg:max-h-[400px]"
            loop
            showPlayBtn
            showMuteBtn
            muted={isMuted}
            onMuteToggle={setIsMuted}
          />
        )}

        {heartPop && (
          <Heart
            size={96}
            className="heart-pop pointer-events-none absolute fill-white text-white drop-shadow-lg"
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleToggleLike(post.id)}
            aria-label={isLiked ? "Unlike" : "Like"}
            aria-pressed={isLiked}
            className="flex cursor-pointer items-center gap-2 text-gray-700 hover:text-red-500 transition active:scale-90"
          >
            <Heart
              size={22}
              className={`transition-transform ${
                isLiked ? "fill-red-500 text-red-500 scale-110" : ""
              }`}
            />

            <span>{post.likes?.length || 0}</span>
          </button>

          <button
            onClick={() => showSuccess("Comments jaldi aa rahe hain")}
            aria-label="Comments"
            className="flex cursor-pointer items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
          >
            <MessageCircle size={22} />
          </button>

          <button
            onClick={() => sharePost(post)}
            aria-label="Share"
            className="text-gray-700 hover:text-indigo-600 cursor-pointer transition"
          >
            <Send size={22} />
          </button>
        </div>

        <div>
          {post.created_at && (
            <span className="text-gray-400"> · {timeAgo(post.created_at)}</span>
          )}
        </div>

        <button
          onClick={() => showSuccess("Save feature jaldi aa raha hai")}
          aria-label="Save"
          className="text-gray-700 hover:text-indigo-600 cursor-pointer transition"
        >
          <Bookmark size={22} />
        </button>
      </div>
    </article>
  );
};

export default memo(PostCard);
