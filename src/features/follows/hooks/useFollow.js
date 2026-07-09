import { use, useContext } from "react";
import { FollowContext } from "../follow.context";
import { followUser, isFollowing, unFollowUser,getFollowersCount,getFollowingCount } from "../services/follow.api";

export function useFollow() {
  const {
  followingMap,
  setFollowingMap,
  
  loading,
  setLoading,
} = useContext(FollowContext);

  const handleToggleFollow = async (userId) => {
    try {
      setLoading(true);
      const following = followingMap[userId];

      setFollowingMap((prev) => ({
        ...prev,
        [userId]: !following,
      }));

      if (following) {
        await unFollowUser(userId);
      } else {
        await followUser(userId);
      }
    } catch (error) {
      console.error(error.message);
      setFollowingMap((prev) => ({
        ...prev,
        [userId]: !prev[userId],
      }));
    } finally {
      setLoading(false);
    }
  };

  const checkFollowing = async (userId) => {
    try {
      const result = await isFollowing(userId);

      setFollowingMap((prev) => ({
        ...prev,
        [userId]: result,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const getCounts = async (userId) => {
  try {
    const followers = await getFollowersCount(userId);
    const following = await getFollowingCount(userId);

    return {
      followers,
      following,
    };
  } catch (error) {
    console.error(error);
  }
};


  return {
    loading,
    followingMap,
    handleToggleFollow,
    checkFollowing,
    getCounts,
  };
}
