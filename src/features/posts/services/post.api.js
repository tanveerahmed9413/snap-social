import { supabase } from "../../../app/supabase";

export const createPost = async ({ media, caption }) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not logged in");
  }

  const fileName = `${crypto.randomUUID()}.${media.name.split(".").pop()}`;

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
