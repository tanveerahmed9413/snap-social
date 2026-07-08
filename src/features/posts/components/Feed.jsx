import { useEffect } from "react";
import { usePost } from "../hooks/usePost";
import PostCard from "./PostCard";

const Feed = () => {
  const { handleGetAllPost, posts, loading } = usePost();

  useEffect(() => {
    handleGetAllPost();
  }, []);

  // Skeleton loader (Instagram-like shimmer)
  const SkeletonPost = () => (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
      {/* Header */}
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

      {/* Caption */}
      <div className="px-4 pb-3 space-y-1">
        <div className="w-full h-3 bg-gray-200 rounded" />
        <div className="w-2/3 h-3 bg-gray-200 rounded" />
      </div>

      {/* Image */}
      <div className="w-full aspect-square bg-gray-200" />

      {/* Actions */}
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

  if (loading) {
    return (
      <section className="max-w-[470px] mx-auto space-y-6 py-4">
        {[1, 2, 3].map((item) => (
          <SkeletonPost key={item} />
        ))}
      </section>
    );
  }

  return (
    <section className="max-w-[470px] mx-auto mb-20 lg:mb-8  space-y-6 py-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
};

export default Feed;