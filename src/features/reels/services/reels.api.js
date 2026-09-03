import { supabase } from "../../../app/supabase";

export const getReels = async ({
  limit = 5,
  cursor = null,
} = {}) => {
  let query = supabase
    .from("posts")
    .select(`
      *,
      profiles(
        id,
        username,
        avatar_url
      )
    `)
    .eq("media_type", "video")
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const hasMore = data.length > limit;

  const reels = hasMore
    ? data.slice(0, limit)
    : data;

  const nextCursor =
    reels.length > 0
      ? reels[reels.length - 1].created_at
      : null;

  return {
    reels,
    nextCursor,
    hasMore,
  };
};