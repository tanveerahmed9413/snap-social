import { useEffect, useRef, useState } from "react";
import { ArrowUp, RefreshCw, Shuffle, Clock, WifiOff } from "lucide-react";
import { usePost } from "../hooks/usePost";
import { useFollow } from "../../follows/hooks/useFollow";
import { useAuth } from "../../auth/hooks/useAuth";
import PostCard from "./PostCard";

const POLL_INTERVAL = 45_000; // 45s me naye posts check
const PULL_THRESHOLD = 70;

// Skeleton component ko Feed ke bahar rakha hai, warna har render pe remount hota tha
const SkeletonPost = () => (
  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300" />
        <div className="space-y-2">
          <div className="w-32 h-3 bg-gray-300 rounded" />
          <div className="w-20 h-2 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="w-6 h-6 rounded-full bg-gray-200" />
    </div>

    <div className="px-4 pb-3 space-y-1">
      <div className="w-full h-3 bg-gray-200 rounded" />
      <div className="w-2/3 h-3 bg-gray-200 rounded" />
    </div>

    <div className="w-full aspect-square bg-gray-200" />

    <div className="flex justify-between items-center px-4 py-3">
      <div className="flex gap-5">
        <div className="w-7 h-7 rounded-full bg-gray-200" />
        <div className="w-7 h-7 rounded-full bg-gray-200" />
        <div className="w-7 h-7 rounded-full bg-gray-200" />
      </div>
      <div className="w-7 h-7 rounded-full bg-gray-200" />
    </div>
  </div>
);

const Feed = () => {
  const {
    handleGetPosts,
    handleRefreshFeed,
    handleChangeMode,
    handleLoadMorePosts,
    checkForNewPosts,
    posts,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    feedMode,
    newPostsCount,
    scrollTopRef,
    initializedRef,
  } = usePost();

  const { followingMap, checkFollowingMany } = useFollow();
  const { user } = useAuth();

  const sectionRef = useRef(null);
  const loadMoreRef = useRef(null);
  const [pull, setPull] = useState(0);

  // Latest handlers ko ref me rakho taaki observers/timers baar baar reconnect na hon
  const handlersRef = useRef({});
  handlersRef.current = {
    loadMore: handleLoadMorePosts,
    refresh: handleRefreshFeed,
    checkNew: checkForNewPosts,
  };

  const getScroller = () => sectionRef.current?.closest("main") || null;

  const scrollToTop = () =>
    getScroller()?.scrollTo({ top: 0, behavior: "smooth" });

  const refreshNow = async () => {
    if (refreshing || loading) return;
    scrollToTop();
    await handleRefreshFeed();
  };

  // ---------- Initial load (sirf pehli baar, ya jab feed khaali ho) ----------
  useEffect(() => {
    if (!initializedRef.current) {
      handleGetPosts();
    } else {
      // Wapas Home pe aaye: purana scroll position restore
      const scroller = getScroller();
      requestAnimationFrame(() => {
        if (scroller) scroller.scrollTop = scrollTopRef.current;
      });
    }

    const scroller = getScroller();
    return () => {
      if (scroller) scrollTopRef.current = scroller.scrollTop;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Infinite scroll ----------
  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handlersRef.current.loadMore();
        }
      },
      { root: getScroller(), rootMargin: "400px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
    // posts.length badalne par dobara observe: agar sentinel abhi bhi visible hai to
    // agla page turant load ho jaye
  }, [posts.length, loading]);

  // ---------- Follow status: poore feed ke liye ek hi query ----------
  useEffect(() => {
    if (!user?.id) return;

    const missing = [
      ...new Set(
        posts
          .map((post) => post.profiles?.id)
          .filter((id) => id && id !== user.id && followingMap[id] === undefined),
      ),
    ];

    if (missing.length > 0) {
      checkFollowingMany(missing);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, user?.id]);

  // ---------- Naye posts ke liye polling ----------
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") {
        handlersRef.current.checkNew();
      }
    };

    const timer = setInterval(tick, POLL_INTERVAL);
    document.addEventListener("visibilitychange", tick);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);

  // ---------- Pull to refresh (mobile) ----------
  useEffect(() => {
    const scroller = getScroller();
    if (!scroller) return;

    let startY = null;
    let distance = 0;

    const onStart = (e) => {
      startY = scroller.scrollTop <= 0 ? e.touches[0].clientY : null;
      distance = 0;
    };

    const onMove = (e) => {
      if (startY === null) return;
      const dy = e.touches[0].clientY - startY;
      if (dy <= 0) {
        distance = 0;
        setPull(0);
        return;
      }
      distance = Math.min(dy * 0.5, 110);
      setPull(distance);
    };

    const onEnd = () => {
      if (startY !== null && distance >= PULL_THRESHOLD) {
        handlersRef.current.refresh();
      }
      startY = null;
      distance = 0;
      setPull(0);
    };

    scroller.addEventListener("touchstart", onStart, { passive: true });
    scroller.addEventListener("touchmove", onMove, { passive: true });
    scroller.addEventListener("touchend", onEnd);
    scroller.addEventListener("touchcancel", onEnd);

    return () => {
      scroller.removeEventListener("touchstart", onStart);
      scroller.removeEventListener("touchmove", onMove);
      scroller.removeEventListener("touchend", onEnd);
      scroller.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  const showNewBanner = newPostsCount > 0 && !refreshing && !loading;

  const header = (
    <div className="sticky top-0 z-30 -mx-1 mb-1 px-1 py-2 bg-gray-100/90 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div
          className="flex rounded-full bg-white p-1 shadow-sm border border-gray-200"
          role="tablist"
          aria-label="Feed type"
        >
          {[
            { key: "random", label: "For You", Icon: Shuffle },
            { key: "latest", label: "Latest", Icon: Clock },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              role="tab"
              aria-selected={feedMode === key}
              onClick={() => handleChangeMode(key)}
              disabled={loading || refreshing}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed ${
                feedMode === key
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={refreshNow}
          disabled={loading || refreshing}
          aria-label="Refresh feed"
          title={feedMode === "random" ? "Shuffle new posts" : "Refresh"}
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          <span className="hidden sm:inline">
            {refreshing ? "Refreshing" : "Refresh"}
          </span>
        </button>
      </div>

      {showNewBanner && (
        <div className="mt-3 flex justify-center">
          <button
            onClick={() => handleRefreshFeed("latest")}
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-indigo-700 active:scale-95 cursor-pointer"
          >
            <ArrowUp size={16} />
            {newPostsCount} new {newPostsCount === 1 ? "post" : "posts"}
          </button>
        </div>
      )}
    </div>
  );

  const pullIndicator = (
    <div
      className="flex justify-center overflow-hidden transition-[height] duration-150"
      style={{ height: pull > 0 ? pull : 0 }}
      aria-hidden="true"
    >
      <RefreshCw
        size={22}
        className={`mt-2 text-indigo-600 ${
          pull >= PULL_THRESHOLD ? "opacity-100" : "opacity-50"
        }`}
        style={{ transform: `rotate(${pull * 4}deg)` }}
      />
    </div>
  );

  if (loading) {
    return (
      <section ref={sectionRef} className="max-w-[470px] mx-auto py-2">
        {header}
        <div className="space-y-6 mt-3">
          {[1, 2, 3].map((item) => (
            <SkeletonPost key={item} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="max-w-[470px] sm:max-w-[400px] mx-auto mb-20 lg:mb-8 py-2"
    >
      {pullIndicator}
      {header}

      {/* Error (kuch posts already ho to sirf inline dikhao) */}
      {error && (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <WifiOff className="text-red-500" size={28} />
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => handleRefreshFeed()}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!error && posts.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-gray-800">No posts yet</p>
          <p className="text-sm text-gray-500">
            Pehli post tum create karo, ya feed refresh karke dekho.
          </p>
          <button
            onClick={refreshNow}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer"
          >
            Refresh
          </button>
        </div>
      )}

      <div
        className={`space-y-6 mt-3 transition-opacity duration-200 ${
          refreshing ? "opacity-60" : "opacity-100"
        }`}
      >
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div ref={loadMoreRef} className="h-10" />

      {loadingMore && (
        <div className="flex justify-center py-6">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      )}

      {!hasMore && posts.length > 0 && !error && (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-sm font-medium text-gray-500">
            🎉 You&apos;re all caught up
          </p>
          <button
            onClick={refreshNow}
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 active:scale-95 cursor-pointer"
          >
            <Shuffle size={16} />
            {feedMode === "random" ? "Shuffle for new posts" : "Check for new posts"}
          </button>
        </div>
      )}
    </section>
  );
};

export default Feed;
