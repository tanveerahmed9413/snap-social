import { createContext, useState } from "react";

export const ReelsContext = createContext();

export function ReelsProvider({ children  }) {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reelsMuted, setReelsMuted] = useState(false);

  return (
   
      <ReelsContext.Provider value={{ reels, setReels, loading, setLoading,reelsMuted,setReelsMuted }}>
        {children }
      </ReelsContext.Provider>
    
  );
}
