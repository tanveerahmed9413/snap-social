import { supabase } from "../../../app/supabase";

// Saari video posts (reels) ke sirf ids. Full data baad me getPostsByIds se aata hai.
export const getReelIds = async ({ max = 300 } = {}) => {
  const { data, error } = await supabase
    .from("posts")
    .select("id")
    .eq("media_type", "video")
    .order("created_at", { ascending: false })
    .limit(max);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((row) => row.id);
};
