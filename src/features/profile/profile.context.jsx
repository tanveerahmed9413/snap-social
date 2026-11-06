import { createContext, useContext, useRef, useState } from "react";
import { AuthContext } from "../auth/auth.context";

export const ProfileContext = createContext();

// Jab tak profile load nahi hui, tab tak ye khaali data use hota hai
const EMPTY = {
  ownerId: null, // ye data kis user ka hai
  profile: null,
  posts: [],
  followers: 0,
  following: 0,
};

export function ProfileProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [stored, setStored] = useState(EMPTY);

  // status: "idle" (kabhi load nahi hua) | "loading" (pehli baar) | "ready" | "error"
  const [status, setStatus] = useState("idle");
  const [saving, setSaving] = useState(false);

  // Refs: re-render nahi karte, bas "kab load hua / abhi load ho raha hai" yaad rakhte hain
  const inFlightRef = useRef(false);
  const loadedAtRef = useRef(0);

  // Agar logout karke dusra user aaye to purane user ka data kabhi dikhna nahi chahiye
  const isCurrentUsersData = stored.ownerId !== null && stored.ownerId === user?.id;
  const data = isCurrentUsersData ? stored : EMPTY;

  return (
    <ProfileContext.Provider
      value={{
        data,
        setStored,
        status: isCurrentUsersData ? status : "idle",
        setStatus,
        saving,
        setSaving,
        inFlightRef,
        loadedAtRef,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
