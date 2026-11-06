import { useContext } from "react";
import { ReelsContext } from "../reel.context";
import { getReelIds } from "../services/reels.api";
import { getPostsByIds, toggleLike } from "../../posts/services/post.api";
import { useAuth } from "../../auth/hooks/useAuth";
import { shuffle } from "../../../utils/shuffle";
import { showError } from "../../../utils/toast";

const PAGE_SIZE = 5;

/**
 * Reels ka saara logic yahan hai:
 *   loadReels      -> pehli baar load ya refresh (naya shuffle)
 *   loadMoreReels  -> neeche scroll karne par agle reels
 *   toggleLike     -> like / unlike
 *   toggleMute     -> sound on / off
 */
export function useReels() {
  const { user } = useAuth();

  const {
    reels,
    setReels,
    status,
    setStatus,
    refreshing,
    setRefreshing,
    loadingMore,
    setLoadingMore,
    hasMore,
    setHasMore,
    muted,
    setMuted,
    queueRef,
    requestIdRef,
    loadingMoreRef,
    pendingLikesRef,
  } = useContext(ReelsContext);

  // Queue me se agle PAGE_SIZE reels laata hai.
  // (Agar kuch reels delete ho chuki hon to khaali page na aaye, isliye loop)
  const takeNextPage = async () => {
    let items = [];

    while (items.length === 0 && queueRef.current.length > 0) {
      const ids = queueRef.current.splice(0, PAGE_SIZE);
      items = await getPostsByIds(ids);
    }

    return { items, hasMore: queueRef.current.length > 0 };
  };

  // silent = true: purani reels screen pe rehti hain, bas refresh spinner dikhta hai
  const loadReels = async ({ silent = false } = {}) => {
    const requestId = ++requestIdRef.current;

    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setStatus("loading");
      }

      const ids = await getReelIds();
      queueRef.current = shuffle(ids);

      const page = await takeNextPage();

      // Beech me naya refresh start ho gaya to ye response ignore
      if (requestId !== requestIdRef.current) return;

      setReels(page.items);
      setHasMore(page.hasMore);
      setStatus("ready");
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      console.error(error);

      if (silent) {
        showError("Refresh nahi ho paya, dobara try karo");
      } else {
        setStatus("error");
      }
    } finally {
      if (requestId === requestIdRef.current) setRefreshing(false);
    }
  };

  const loadMoreReels = async () => {
    if (loadingMoreRef.current || refreshing || !hasMore) return;

    const requestId = requestIdRef.current;

    try {
      loadingMoreRef.current = true;
      setLoadingMore(true);

      const page = await takeNextPage();

      if (requestId !== requestIdRef.current) return;

      setReels((prev) => {
        const seen = new Set(prev.map((reel) => reel.id));
        return [...prev, ...page.items.filter((reel) => !seen.has(reel.id))];
      });
      setHasMore(page.hasMore);
    } catch (error) {
      console.error(error);
      showError("Aur reels load nahi hui");
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  };

  // Optimistic like: UI turant badalta hai, fail ho to wapas purani state
  const handleToggleLike = async (reelId) => {
    if (!user?.id || pendingLikesRef.current.has(reelId)) return;

    const reel = reels.find((item) => item.id === reelId);
    if (!reel) return;

    const wasLiked = (reel.likes || []).some((like) => like.user_id === user.id);

    const setLiked = (shouldLike) =>
      setReels((prev) =>
        prev.map((item) => {
          if (item.id !== reelId) return item;

          const othersLikes = (item.likes || []).filter(
            (like) => like.user_id !== user.id,
          );

          return {
            ...item,
            likes: shouldLike ? [...othersLikes, { user_id: user.id }] : othersLikes,
          };
        }),
      );

    pendingLikesRef.current.add(reelId);
    setLiked(!wasLiked);

    try {
      await toggleLike(reelId);
    } catch (error) {
      setLiked(wasLiked);
      showError(error?.message || "Like nahi ho paya");
    } finally {
      pendingLikesRef.current.delete(reelId);
    }
  };

  const toggleMute = () => setMuted((value) => !value);

  return {
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
  };
}
