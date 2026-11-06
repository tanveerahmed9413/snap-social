import { useContext } from "react";
import { ProfileContext } from "../profile.context";
import { useAuth } from "../../auth/hooks/useAuth";
import { getProfilePageData, updateProfile } from "../services/profile.api";
import {
  dismissToast,
  showError,
  showLoading,
  showSuccess,
} from "../../../utils/toast";

// Itne seconds ke andar dobara profile kholo to network call nahi hoti
const FRESH_FOR_MS = 30_000;

export function useProfile() {
  const { user } = useAuth();

  const {
    data,
    setStored,
    status,
    setStatus,
    saving,
    setSaving,
    inFlightRef,
    loadedAtRef,
  } = useContext(ProfileContext);

  /**
   * Profile + posts + followers/following ek saath load karta hai.
   *
   * - Pehli baar: full-page spinner dikhta hai.
   * - Uske baad: purana data turant dikhta hai, naya data background me aata hai
   *   (spinner nahi, flicker nahi).
   * - force: true => cache ignore karke dobara load.
   */
  const loadProfile = async ({ force = false } = {}) => {
    if (!user?.id || inFlightRef.current) return;

    const hasCache = !!data.profile;
    const isFresh = Date.now() - loadedAtRef.current < FRESH_FOR_MS;

    if (hasCache && isFresh && !force) return;

    try {
      inFlightRef.current = true;

      if (!hasCache) setStatus("loading");

      const result = await getProfilePageData();

      setStored({ ownerId: user.id, ...result });
      loadedAtRef.current = Date.now();
      setStatus("ready");
    } catch (error) {
      console.error(error);

      // Cache hai to chup-chaap purana data dikhate rahenge
      if (!hasCache) setStatus("error");
    } finally {
      inFlightRef.current = false;
    }
  };

  const handleProfileUpdate = async (formData) => {
    const toastId = showLoading("Profile Updating...");

    try {
      setSaving(true);

      const updatedProfile = await updateProfile(formData);

      // email profiles table me nahi hota, isliye purana wala saath rakhte hain
      setStored((prev) => ({
        ...prev,
        ownerId: user.id,
        profile: { ...prev.profile, ...updatedProfile },
      }));

      showSuccess("Profile Updated");
      return true;
    } catch (error) {
      showError(error?.message || "Something went wrong");
      return false;
    } finally {
      dismissToast(toastId);
      setSaving(false);
    }
  };

  // Post delete hone ke baad dobara fetch nahi karte, bas list se hata dete hain
  const removePostFromProfile = (postId) => {
    setStored((prev) => ({
      ...prev,
      posts: prev.posts.filter((post) => post.id !== postId),
    }));
  };

  return {
    profile: data.profile,
    posts: data.posts,
    followers: data.followers,
    following: data.following,

    status,
    saving,

    loadProfile,
    handleProfileUpdate,
    removePostFromProfile,
  };
}
