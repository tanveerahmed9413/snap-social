import { useContext } from "react";
import { ProfileContext } from "../profile.context";
import {
  getCurrentUserProfile,
  getCurrentUserPosts,
  updateProfile,
} from "../services/profile.api";
import { AuthSessionMissingError } from "@supabase/supabase-js";
import { dismissToast, showError, showLoading, showSuccess } from "../../../utils/toast";

export function useProfile() {
  const { profile, setProfile, loading, setLoading, posts, setPosts } =
    useContext(ProfileContext);

  const handleGetProfile = async () => {
    try {
      setLoading(true);
      const profile = await getCurrentUserProfile();

      setProfile(profile);

      return profile;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetPosts = async () => {
    try {
      setLoading(true);
      const posts = await getCurrentUserPosts();
      setPosts(posts);
      return posts;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (formData) => {
    const id = showLoading("Profile Updating...");
    try {
      setLoading(true);

      const updateprofile = await updateProfile(formData);
      setProfile(updateprofile);
      showSuccess("Profile Updated");
      return updateprofile;
    } catch (error) {
      showError(error?.message || "Something went wrong");
      throw err;
    } finally {
      dismissToast(id);
      setLoading(false);
    }
  };

  return {
    profile,
    handleGetProfile,
    handleGetPosts,
    handleProfileUpdate,
    setProfile,
    loading,
    posts,
    setPosts,
  };
}
