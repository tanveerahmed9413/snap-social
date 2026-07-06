import { useContext } from "react";
import { ProfileContext } from "../profile.context";
import {
  getCurrentUserProfile,
  getCurrentUserPosts,
  updateProfile,
} from "../services/profile.api";
import { AuthSessionMissingError } from "@supabase/supabase-js";

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
    try {
      setLoading(true);

      const updateprofile = await updateProfile(formData);
      setProfile(updateprofile);
      return updateprofile;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
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
