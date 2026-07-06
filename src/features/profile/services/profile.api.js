import { data } from "react-router-dom";
import { supabase } from "../../../app/supabase";

export const getCurrentUserProfile = async () => {
  // current user nikalna
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not logged in");
  }

  //   current logged user ke profile table se data nikalna

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...data,
    email: user.email,
  };
};

export const getCurrentUserPosts = async () => {
  // sabse pahle current user nikalna
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not logged in");
  }

  //   current user ke posts nikalna user_id ke basis pe

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateProfile = async ({
  username,
  full_name,
  bio,
  avatar,
}) => {
  // Current User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not logged in");
  }

  // Current Profile
  const { data: currentProfile, error: profileError } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const oldAvatarUrl = currentProfile?.avatar_url;

  let avatarUrl = oldAvatarUrl;
  let uploadedFileName = null;

  // Upload New Avatar
  if (avatar) {
    uploadedFileName = `${user.id}-${Date.now()}-${avatar.name}`;

    const { error: uploadError } = await supabase.storage
      .from("Avatars")
      .upload(uploadedFileName, avatar);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("Avatars")
      .getPublicUrl(uploadedFileName);

    avatarUrl = publicUrl;
  }

  // Update Database
  const { data, error } = await supabase
    .from("profiles")
    .update({
      username,
      full_name,
      bio,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single();

  // Rollback
  if (error) {
    if (uploadedFileName) {
      await supabase.storage
        .from("Avatars")
        .remove([uploadedFileName]);
    }

    throw new Error(error.message);
  }

  // Delete Old Avatar
  if (avatar && oldAvatarUrl) {
    try {
      const oldFileName = oldAvatarUrl.split("/").pop();

      if (oldFileName) {
        await supabase.storage
          .from("Avatars")
          .remove([oldFileName]);
      }
    } catch (err) {
      console.error("Old avatar delete failed:", err);
    }
  }

  return data;
};