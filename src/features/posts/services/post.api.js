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
      caption,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return post;
};

export const getAllPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles(
        username,
        full_name,
        avatar_url
      ),
       likes(
        user_id
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
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
    .single()
    ;

  if (insertError) {
    throw insertError;
  }

  return true;
};

export const  getPostById = async (postId) =>{
  const {data,error} = await supabase
  .from("posts") 
  .select(`
    *,
    profiles(
    id,
    username,
    avatar_url
    ),
    likes(count)
    `)
    .eq("id",postId)
    .single()

    if(error){
      throw new Error(error.message)
    }

    return data
}