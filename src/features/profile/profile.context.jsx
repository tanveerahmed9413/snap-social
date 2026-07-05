import { createContext, useState } from "react";

export const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState([])

  return (
    <ProfileContext.Provider value={{ profile, setProfile,loading,setLoading,posts,setPosts}}>
      {children}
    </ProfileContext.Provider>
  );
}
