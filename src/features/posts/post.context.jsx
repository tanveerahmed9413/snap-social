import { createContext, useEffect, useState } from "react";

export const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
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
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
