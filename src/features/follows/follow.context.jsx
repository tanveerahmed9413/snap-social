import { FolderMinus } from "lucide-react";
import { createContext, useState } from "react";

export const FollowContext = createContext();
export function FollowProvider({ children  }) {
  const [followingMap, setFollowingMap] = useState({});
//   const [followerCount, setFollowerCount] = useState({});
//   const [followingCount, setFollowingCount] = useState({});
  const [loading, setLoading] = useState(false)

  return (
    <FollowContext.Provider
      value={{
        followingMap,
        setFollowingMap,
        // followerCount,
        // setFollowerCount,
        // followingCount,
        // setFollowingCount,
        loading,
        setLoading
      }}
    >
      {children }
    </FollowContext.Provider>
  );
}
