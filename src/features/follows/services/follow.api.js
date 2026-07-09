
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
    throw new Error(error);
  }

  return !!data;
};
