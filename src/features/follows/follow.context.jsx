
import { createContext, useState } from "react";

export const FollowContext = createContext();
export function FollowProvider({ children  }) {
  const [followingMap, setFollowingMap] = useState({});
  const [loading, setLoading] = useState(false)

  return (
    <FollowContext.Provider
      value={{
        followingMap,
        setFollowingMap,
        loading,
        setLoading
      }}
    >
      {children }
    </FollowContext.Provider>
  );
}
