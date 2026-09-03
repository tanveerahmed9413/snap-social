import { useEffect, useRef } from "react";
import ReelCard from "../components/ReelCard";
import { useReels } from "../hooks/useReels";

const ReelsPage = () => {
  const {
    reels,
    loading,
    loadingMore,
    hasMore,
    handleGetReels,
    handleLoadMoreReels,
  } = useReels();

  const loadMoreRef = useRef(null);

  useEffect(() => {
    handleGetReels();
  }, []);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleLoadMoreReels();
        }
      },
      {
        rootMargin: "800px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [handleLoadMoreReels]);

  if (loading) {
    return <h1>Loading....</h1>;
  }
  return (
    <main className="h-[100dvh] w-full bg-zinc-200 flex justify-center items-center overflow-hidden">
      <div className="h-[100dvh] w-full overflow-y-auto snap-y snap-mandatory scroll-smooth scrollbar-none pb-16">
        {reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}

        <div ref={loadMoreRef} className="h-20 snap-none" />

        {loadingMore && (
          <div className="py-6 text-center text-gray-500 snap-none">
            Loading more reels...
          </div>
        )}

        {!hasMore && reels.length > 0 && (
          <div className="py-6 text-center text-gray-400 snap-none">
            No more reels
          </div>
        )}
      </div>
    </main>
  );
};

export default ReelsPage;
