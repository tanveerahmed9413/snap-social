import { createContext, useRef, useState } from "react";

export const ReelsContext = createContext();

export function ReelsProvider({ children }) {
  const [reels, setReels] = useState([]);

  // status: "idle" (kabhi load nahi hua) | "loading" | "ready" | "error"
  const [status, setStatus] = useState("idle");
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Browser sound ke saath autoplay block karta hai (isi se black screen aati thi),
  // isliye reels muted shuru hoti hain. User unmute kare to baaki reels unmuted chalti hain.
  const [muted, setMuted] = useState(true);

  // Refs: re-render nahi karte
  const queueRef = useRef([]); // abhi tak na dikhaye gaye reel ids (shuffled)
  const requestIdRef = useRef(0); // purane (stale) response ignore karne ke liye
  const loadingMoreRef = useRef(false);
  const pendingLikesRef = useRef(new Set());

  return (
    <ReelsContext.Provider
      value={{
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
      }}
    >
      {children}
    </ReelsContext.Provider>
  );
}
