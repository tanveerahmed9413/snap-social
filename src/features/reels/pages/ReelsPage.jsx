import { useEffect, useRef } from "react";
import { RefreshCw, VideoOff } from "lucide-react";
import ReelCard from "../components/ReelCard";
import { useReels } from "../hooks/useReels";
import { useFollow } from "../../follows/hooks/useFollow";
import { useAuth } from "../../auth/hooks/useAuth";
import { sharePost } from "../../../utils/sharePost";

// Poori screen ka simple message (loading / error / empty)
const FullScreenMessage = ({ children }) => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white px-6 text-center text-black">
    {children}
  </div>
);

const ReelsPage = () => {
  const { user } = useAuth();

  const {
    reels,
    status,
    refreshing,
    loadingMore,
    hasMore,
    muted,
    loadReels,
    loadMoreReels,
    handleToggleLike,
    toggleMute,
  } = useReels();

  const { followingMap, checkFollowingMany, handleToggleFollow } = useFollow();

  const scrollerRef = useRef(null);
  const loadMoreRef = useRef(null);

  // Latest function ko ref me rakhte hain, taaki observer baar-baar na banana pade
  const loadMoreFnRef = useRef(loadMoreReels);
  loadMoreFnRef.current = loadMoreReels;

  // 1) Pehli baar hi load. Dusri baar aane par purani reels wahi dikhti hain (reload nahi).
  useEffect(() => {
    if (status === "idle") loadReels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Reels ke creators ka follow status ek hi query me
  useEffect(() => {
    const missing = [
      ...new Set(
        reels
          .map((reel) => reel.profiles?.id)
          .filter((id) => id && id !== user?.id && followingMap[id] === undefined),
      ),
    ];

    if (missing.length > 0) checkFollowingMany(missing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reels, user?.id]);

  // 3) Last ke paas pahunchte hi agli reels laao (infinite scroll)
  useEffect(() => {
    const sentinel = loadMoreRef.current;
    const scroller = scrollerRef.current;
    if (!sentinel || !scroller) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMoreFnRef.current();
      },
      // root = scroll container (window nahi), 1 screen pehle hi load shuru
      { root: scroller, rootMargin: "0px 0px 100% 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [reels.length, status]);

  const handleRefresh = async () => {
    scrollerRef.current?.scrollTo({ top: 0 });
    await loadReels({ silent: true });
  };

  // ---------- Loading / error / empty ----------
  if (status === "idle" || status === "loading") {
    return (
      <FullScreenMessage>
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
        <p className="text-sm text-white/70">Reels load ho rahi hain...</p>
      </FullScreenMessage>
    );
  }

  if (status === "error") {
    return (
      <FullScreenMessage>
        <VideoOff size={40} className="text-white/60" />
        <p className="text-lg font-semibold">Reels load nahi ho payi</p>
        <button
          onClick={() => loadReels()}
          className="cursor-pointer rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium hover:bg-indigo-700"
        >
          Retry
        </button>
      </FullScreenMessage>
    );
  }

  if (reels.length === 0) {
    return (
      <FullScreenMessage>
        <VideoOff size={40} className="text-white/60" />
        <p className="text-lg font-semibold">Abhi koi reel nahi hai</p>
        <p className="text-sm text-white/60">Koi video post upload karo, wo yahan dikhegi.</p>
        <button
          onClick={() => loadReels()}
          className="cursor-pointer rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium hover:bg-indigo-700"
        >
          Refresh
        </button>
      </FullScreenMessage>
    );
  }

  // ---------- Reels ----------
  return (
    <div className="relative h-full w-full bg-black">
      {/* Upar ka header: title + refresh */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-4 py-3 text-white">
        <h1 className="text-lg font-bold text-black drop-shadow">Reels</h1>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          aria-label="Refresh reels"
          className="pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition active:scale-90 disabled:opacity-60"
        >
          <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Scroll container: har reel poori height leti hai (snap)
          pb-20 sirf mobile pe, taaki bottom navbar ke peeche reel na chhupe */}
      <div
        ref={scrollerRef}
        className="h-full w-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain pb-20 no-scrollbar lg:pb-0"
      >
        {reels.map((reel) => {
          const authorId = reel.profiles?.id;

          return (
            <ReelCard
              key={reel.id}
              reel={reel}
              muted={muted}
              isLiked={reel.likes?.some((like) => like.user_id === user?.id) || false}
              isOwnReel={authorId === user?.id}
              isFollowing={followingMap[authorId] || false}
              onToggleLike={() => handleToggleLike(reel.id)}
              onToggleFollow={() => handleToggleFollow(authorId)}
              onToggleMute={toggleMute}
              onShare={() => sharePost(reel)}
            />
          );
        })}

        {/* Ye khaali div dikhte hi agli reels load hoti hain */}
        <div ref={loadMoreRef} className="h-px" />

        {loadingMore && (
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          </div>
        )}

        {!hasMore && (
          <p className="py-6 text-center text-sm text-white/50">
            Aap sab reels dekh chuke ho
          </p>
        )}
      </div>
    </div>
  );
};

export default ReelsPage;
