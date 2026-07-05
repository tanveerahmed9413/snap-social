import { supabase } from "../../../app/supabase";

/**
 * Register new user
 */
export const signUp = async ({ username, fullName, email, password }) => {
  // Step 1 : Create auth account
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName,
      },
    },
  });

  

  if (error) {
    throw new Error(error.message);
  }

  // Step 2 : Check user exists
  if (!data.user) {
    throw new Error("User creation failed.");
  }

  // Step 3 : Create profile
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    username,
    full_name: fullName,
  });


  

  if (profileError) {
    throw new Error(profileError.message);
  }

  return data.user;
};

/**
 * Login existing user
 */

export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if(error){
    throw new Error(error.message)
  }

  


  return data.user
};



/**
 * Logout existing user
 */

export const logOut = async ()=>{
  const {error} = supabase.auth.signOut()

  if(error){
    throw new Error(error.message)
  }
}



