import { supabase } from "../../../app/supabase"


export const getAllReels = async()=>{
    const {data,error} = await supabase
    .from('posts')
    .select(`
        *,
        profiles(
        id,
        username,
        avatar_url
        )
        `)
        .eq('media_type',"video")
        .order('created_at',{ascending: false})

        if(error){
            throw new Error(error.message)
        }

        return data
    
}