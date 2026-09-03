import { createContext, useEffect, useState } from "react";

export const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [isMuted, setIsMuted] = useState(true);

  return (
    <PostContext.Provider
      value={{
        posts,
        setPosts,

        loading,
        setLoading,

        isMuted,
        setIsMuted,

        loadingMore,
        setLoadingMore,

        cursor,
        setCursor,

        hasMore,
        setHasMore,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
