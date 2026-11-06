import { createContext, useRef, useState } from "react";

export const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // "random" = For You (shuffled), "latest" = newest first
  const [feedMode, setFeedMode] = useState("random");

  // "N new posts" banner
  const [newPostsCount, setNewPostsCount] = useState(0);

  const [isMuted, setIsMuted] = useState(true);

  // Refs: ye re-render nahi karte, race conditions rokne ke liye
  const queueRef = useRef([]); // random mode me bacha hua shuffled queue
  const requestIdRef = useRef(0); // stale response ignore karne ke liye
  const loadingMoreRef = useRef(false);
  const newestAtRef = useRef(null); // feed me sabse naya created_at
  const scrollTopRef = useRef(0); // Home pe wapas aane par scroll restore
  const initializedRef = useRef(false);

  return (
    <PostContext.Provider
      value={{
        posts,
        setPosts,

        loading,
        setLoading,

        refreshing,
        setRefreshing,

        error,
        setError,

        isMuted,
        setIsMuted,

        loadingMore,
        setLoadingMore,

        cursor,
        setCursor,

        hasMore,
        setHasMore,

        feedMode,
        setFeedMode,

        newPostsCount,
        setNewPostsCount,

        queueRef,
        requestIdRef,
        loadingMoreRef,
        newestAtRef,
        scrollTopRef,
        initializedRef,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
