import { supabase } from "../../../app/supabase";

export const getCurrentUserProfile = async () => {
  // current user nikalna
  const { data: { user },} = await supabase.auth.getUser() ;

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
  const { data: { user },} = await supabase.auth.getUser() ;

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


