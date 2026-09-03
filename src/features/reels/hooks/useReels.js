import { useContext } from "react";
import { getReels } from "../services/reels.api";
import { ReelsContext } from "../reel.context";

export function useReels() {
  const {
    loading,
    setLoading,

    reels,
    setReels,

    loadingMore,
    setLoadingMore,

    cursor,
    setCursor,

    hasMore,
    setHasMore,

    reelsMuted,
    setReelsMuted,
  } = useContext(ReelsContext);

  const handleGetReels = async () => {
    try {
      setLoading(true);

      const result = await getReels({
        limit: 5,
        cursor: null,
      });

      setReels(result.reels);

      setCursor(result.nextCursor);

      setHasMore(result.hasMore);

      return result.reels;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMoreReels = async () => {
    if (loadingMore || !hasMore || !cursor) {
      return;
    }

    try {
      setLoadingMore(true);

      const result = await getReels({
        limit: 5,
        cursor,
      });

      setReels((prev) => [...prev, ...result.reels]);

      setCursor(result.nextCursor);

      setHasMore(result.hasMore);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingMore(false);
    }
  };

  return {
    reels,

    loading,
    loadingMore,

    hasMore,

    handleGetReels,
    handleLoadMoreReels,

    reelsMuted,
    setReelsMuted,
  };
}
