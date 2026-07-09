import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import MediaPlayer from "../../../components/MediaPlayer";
import { usePost } from "../hooks/usePost";
import { useAuth } from "../../auth/hooks/useAuth";
import { showSuccess } from "../../../utils/toast";
import { useRef, useEffect } from "react";
import useVideoVisibility from "../../../shared/hooks/useVideoVisibility";
import { useFollow } from "../../follows/hooks/useFollow";

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const { handleToggleLike, isMuted, setIsMuted } = usePost();
  const { handleToggleFollow, followingMap, checkFollowing } = useFollow();

  const isOwnProfile = user?.id === post.profiles.id;
  const isFollowing = followingMap[post.profiles.id] || false;

  useEffect(() => {
    if (!post?.profiles?.id) return;

    if (followingMap[post.profiles.id] === undefined) {
      checkFollowing(post.profiles.id);
    }
  }, [post?.profiles?.id]);


  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useVideoVisibility(containerRef, playerRef);

  const handleShare = async () => {
    try {
      const shareURL = `${window.location.origin}/post/${post.id}`;

      if (navigator.share) {
        await navigator.share({
          title: `${post.profiles.username}'s Post`,
          text: post.caption,
          url: shareURL,
        });
        console.log(navigator.share);

        showSuccess("Post shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareURL);
        showSuccess("Link copied!");
      }
    } catch (error) {
      console.log(error);
      console.error("Share Error:", error);
    }
  };

  const isLiked =
    post.likes?.some((like) => like.user_id === user?.id) || false;

  return (
    <article
      ref={containerRef}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header */}

      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <img
            src={
              post?.profiles?.avatar_url ??
              "https://img.icons8.com/?size=100&id=60023&format=png&color=000000"
            }
            alt={post?.profiles?.username}
            className="w-12 h-12 rounded-full object-cover"
          />

          <div>
            <h3 className="font-semibold text-gray-900">
              {post?.profiles?.full_name}
            </h3>

            <p className="text-sm text-gray-500">@{post?.profiles?.username}</p>
          </div>
        </div>

        {!isOwnProfile && (
          <button
            onClick={() => handleToggleFollow(post.profiles.id)}
            className={`px-5 py-2 active:scale-95 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer
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

      <div className="px-5 pb-4">
        <p className="text-gray-700 leading-7">{post?.caption}</p>
      </div>

      {/* Image or Video */}

      <div className="bg-black flex justify-center min-h-[500px]">
        {post.media_type === "image" ? (
          <img
            src={post.media_url}
            alt="Post"
            className="block w-full max-w-[400px] max-h-[500px] object-contain"
          />
        ) : (
          <MediaPlayer
            ref={playerRef}
            src={post.media_url}
            className="block w-full max-w-[400px] max-h-[500px]"
            autoPlay
            loop
            defaultMuted={true}
            showPlayBtn
            showMuteBtn
            muted={isMuted}
            onMuteToggle={setIsMuted}
          />
        )}
      </div>

      {/* Footer */}

      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleToggleLike(post.id)}
            className="flex cursor-pointer items-center gap-2 text-gray-700 hover:text-red-500 transition"
          >
            <Heart
              size={22}
              className={isLiked ? "fill-red-500 text-red-500" : ""}
            />

            <span>{post.likes?.length || 0}</span>
          </button>

          <button className="flex cursor-pointer items-center gap-2 text-gray-700 hover:text-indigo-600 transition">
            <MessageCircle size={22} />

            <span>{22}</span>
          </button>

          <button
            onClick={handleShare}
            className="hover:text-indigo-600 cursor-pointer transition"
          >
            <Send size={22} />
          </button>
        </div>

        <button className="hover:text-indigo-600 cursor-pointer transition">
          <Bookmark size={22} />
        </button>
      </div>
    </article>
  );
};

export default PostCard;
