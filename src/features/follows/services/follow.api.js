import { supabase } from "../../../app/supabase";

export const followUser = async (userId) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User Not Authenticate");

  const { error } = await supabase.from("follows").insert({
    follower_id: user.id,
    following_id: userId,
  });

  if (error) throw new Error(error.message);
};

export const unFollowUser = async (userId) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User Not Authorize");

  if (user.id === userId) {
    throw new Error("You can't follow yourself"); 
  }

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", userId);

  if (error) throw new Error(error.message);
};

export const isFollowing = async (userId) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return !!data;
};

// Ek hi query me bahut saare users ka follow status (N+1 queries se bachne ke liye)
export const getFollowingStatuses = async (userIds = []) => {
  if (userIds.length === 0) return {};

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return {};

  const { data, error } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", user.id)
    .in("following_id", userIds);

  if (error) throw new Error(error.message);

  const followed = new Set((data || []).map((row) => row.following_id));

  return Object.fromEntries(userIds.map((id) => [id, followed.has(id)]));
};

export const getFollowersCount = async (userId) => {
  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", userId);

  if (error) throw error;

  return count;
};

export const getFollowingCount = async (userId) => {
  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId);

  if (error) throw error;

  return count;
};
