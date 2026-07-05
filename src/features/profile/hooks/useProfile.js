import { useContext } from "react";
import { ProfileContext } from "../profile.context";
import {
  getCurrentUserProfile,
  getCurrentUserPosts,
} from "../services/profile.api";

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

  return {
    profile,
    handleGetProfile,
    handleGetPosts,
    setProfile,
    loading,
    posts,
    setPosts
  };
}
