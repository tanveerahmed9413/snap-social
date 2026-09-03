import { createContext, useState } from "react";

export const ReelsContext = createContext();

export function ReelsProvider({ children }) {
  const [reels, setReels] = useState([]);

  const [loading, setLoading] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [cursor, setCursor] = useState(null);

  const [hasMore, setHasMore] = useState(true);

  const [reelsMuted, setReelsMuted] = useState(false);

  return (
    <ReelsContext.Provider
      value={{
        reels,
        setReels,

        loading,
        setLoading,

        loadingMore,
        setLoadingMore,

        cursor,
        setCursor,

        hasMore,
        setHasMore,

        reelsMuted,
        setReelsMuted,
      }}
    >
      {children}
    </ReelsContext.Provider>
  );
}
