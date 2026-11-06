import { useRef, useState } from "react";
import { Heart, MessageCircle, Send, Volume2, VolumeX } from "lucide-react";
import MediaPlayer from "../../../components/MediaPlayer";
import useVideoVisibility from "../../../shared/hooks/useVideoVisibility";
import { showSuccess } from "../../../utils/toast";

const FALLBACK_AVATAR =
  "https://img.icons8.com/?size=100&id=60023&format=png&color=000000";

// Right side ka ek round action button (like, share, ...)
const ActionButton = ({ icon: Icon, label, onClick, active = false, fill = false }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="flex flex-col items-center gap-1 text-white cursor-pointer active:scale-90 transition-transform"
  >
    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/35 backdrop-blur-sm">
      <Icon
        size={24}
        className={active ? "text-red-500" : ""}
        fill={fill ? "currentColor" : "none"}
      />
    </span>
  </button>
);

/**
 * Ek reel (full screen video). Ye sirf UI dikhata hai.
 * Data aur actions ReelsPage se props me aate hain, isliye samajhna aasan hai.
 */
const ReelCard = ({
  reel,
  isLiked,
  isOwnReel,
  isFollowing,
  muted,
  onToggleLike,
  onToggleFollow,
  onToggleMute,
  onShare,
}) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  const [captionOpen, setCaptionOpen] = useState(false);
  const [heartPop, setHeartPop] = useState(false);

  // Screen pe jo reel dikh rahi hai wahi chalegi, baaki pause
  useVideoVisibility(containerRef, playerRef);

  const author = reel.profiles;
  const likeCount = reel.likes?.length || 0;

  // Double tap = like (Instagram jaisa)
  const handleDoubleTap = () => {
    if (!isLiked) onToggleLike();

    setHeartPop(true);
    setTimeout(() => setHeartPop(false), 700);
  };

  return (
    <article
      ref={containerRef}
      className="flex h-full w-full snap-start snap-always items-center justify-center bg-gray-300 lg:py-4"
    >
      {/* Video frame: mobile pe poori screen, desktop pe beech me phone jaisa */}
      <div
        onDoubleClick={handleDoubleTap}
        className="relative h-full w-full max-w-[440px] overflow-hidden bg-black lg:rounded-2xl"
      >
        <MediaPlayer
          ref={playerRef}
          src={reel.media_url}
          loop
          fullWidth
          rounded={false}
          preload="auto"
          showProgress
          showMuteBtn={false}
          muted={muted}
          className="h-full"
        />

        {/* Neeche aur upar halka gradient taaki text saaf dikhe */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

        {/* Double tap pe bada heart */}
        {heartPop && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Heart size={110} className="heart-pop fill-white text-white drop-shadow-xl" />
          </div>
        )}

        {/* Right side actions */}
        <div className="absolute bottom-6 right-3 z-20 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center">
            <ActionButton
              icon={Heart}
              label={isLiked ? "Unlike" : "Like"}
              active={isLiked}
              fill={isLiked}
              onClick={onToggleLike}
            />
            <span className="mt-1 text-xs font-medium text-white">{likeCount}</span>
          </div>

          <ActionButton
            icon={MessageCircle}
            label="Comments"
            onClick={() => showSuccess("Comments jaldi aa rahe hain")}
          />

          <ActionButton icon={Send} label="Share" onClick={onShare} />

          <ActionButton
            icon={muted ? VolumeX : Volume2}
            label={muted ? "Unmute" : "Mute"}
            onClick={onToggleMute}
          />
        </div>

        {/* Bottom left: user + follow + caption */}
        <div className="absolute bottom-6 left-4 right-20 z-20 text-white">
          <div className="flex items-center gap-3">
            <img
              src={author?.avatar_url || FALLBACK_AVATAR}
              alt={author?.username || "user"}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_AVATAR;
              }}
              className="h-10 w-10 rounded-full border border-white object-cover"
            />

            <span className="truncate text-sm font-semibold">
              @{author?.username || "unknown"}
            </span>

            {author && !isOwnReel && (
              <button
                onClick={onToggleFollow}
                className={`h-8 shrink-0 cursor-pointer rounded-lg px-4 text-sm font-semibold transition active:scale-95 ${
                  isFollowing
                    ? "bg-white/90 text-gray-900"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>

          {reel.caption && (
            <button
              onClick={() => setCaptionOpen((open) => !open)}
              className="mt-3 block w-full cursor-pointer text-left"
            >
              <p
                className={`text-sm leading-5 whitespace-pre-wrap break-words ${
                  captionOpen ? "" : "line-clamp-2"
                }`}
              >
                {reel.caption}
              </p>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ReelCard;
