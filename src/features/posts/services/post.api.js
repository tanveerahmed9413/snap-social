import { supabase } from "../../../app/supabase";
import { v4 as uuidv4 } from "uuid";

export const createPost = async ({ media, caption }) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not logged in");
  }

  const fileName = `${uuidv4()}.${media.name.split(".").pop()}`;

  const { error: uploadError } = await supabase.storage
    .from("AllPosts")
    .upload(fileName, media);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = await supabase.storage
    .from("AllPosts")
    .getPublicUrl(fileName);

  const mediaType = media.type.startsWith("image") ? "image" : "video";

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      media_url: data.publicUrl,
      media_type: mediaType,
      caption: caption?.trim() || "",
    })
    .select()
    .single();

  if (error) {
    // DB insert fail hua to upload ki hui file orphan reh jaati hai, usse hata do
    await supabase.storage.from("AllPosts").remove([fileName]);
    throw new Error(error.message);
  }

  return post;
};

const POST_SELECT = `
  *,
  profiles(
    id,
    username,
    full_name,
    avatar_url
  ),
  likes(
    user_id
  )
`;

// Latest feed: newest first, cursor based pagination
export const getAllPosts = async ({ limit = 10, cursor = null } = {}) => {
  let query = supabase
    .from("posts")
    .select(POST_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  // Next page ke liye
  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const hasMore = data.length > limit;

  const posts = hasMore ? data.slice(0, limit) : data;

  const nextCursor =
    posts.length > 0 ? posts[posts.length - 1].created_at : null;

  return {
    posts,
    nextCursor,
    hasMore,
  };
};

// Random feed step 1: recent posts ke sirf id + created_at (light query)
export const getFeedPostIds = async ({ max = 500 } = {}) => {
  const { data, error } = await supabase
    .from("posts")
    .select("id, created_at")
    .order("created_at", { ascending: false })
    .limit(max);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

// Random feed step 2: given ids ke full posts, same order me
export const getPostsByIds = async (ids = []) => {
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .in("id", ids);

  if (error) {
    throw new Error(error.message);
  }

  const byId = new Map((data || []).map((post) => [post.id, post]));

  // Deleted posts skip ho jayenge, baaki ka order maintain
  return ids.map((id) => byId.get(id)).filter(Boolean);
};

// "N new posts" banner ke liye
export const getNewPostsCount = async ({ since, excludeUserId } = {}) => {
  if (!since) return 0;

  let query = supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .gt("created_at", since);

  if (excludeUserId) {
    query = query.neq("user_id", excludeUserId);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return count || 0;
};

export const deletePost = async (postId) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not logged in");
  }

  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("media_url")
    .eq("id", postId)
    .eq("user_id", user.id)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (post.media_url) {
    const filePath = post.media_url.split("/AllPosts/")[1];

    const { error: storageError } = await supabase.storage
      .from("AllPosts")
      .remove([filePath]);

    if (storageError) {
      throw new Error(storageError.message);
    }
  }

  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const toggleLike = async (postId) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not logged in");
  }

  // Check existing like
  const { data: existingLike, error } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  // Unlike
  if (existingLike) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("id", existingLike.id);

    if (error) {
      throw error;
    }

    return false;
  }

  // Like
  const { error: insertError } = await supabase
    .from("likes")
    .insert({
      post_id: postId,
      user_id: user.id,
    })
    .select()
    .single();
  if (insertError) {
    throw insertError;
  }

  return true;
};

export const getPostById = async (postId) => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
    *,
    profiles(
    id,
    username,
    avatar_url
    ),
    likes(count)
    `,
    )
    .eq("id", postId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
