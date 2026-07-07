import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
} from "lucide-react";
import { usePost } from "../hooks/usePost";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import MediaPlayer from "../../../components/MediaPlayer";

const SinglePost = () => {
  const [post, setPost] = useState(null);

  const { postId } = useParams();
  const { handleSinglePost } = usePost();

  console.log(post);

  useEffect(() => {
    loadPost();
  }, [postId]);

  async function loadPost() {
    const data = await handleSinglePost(postId);
    setPost(data);
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-slate-100 to-zinc-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-black flex items-center justify-center p-6">
      <div className="w-full max-w-6xl rounded-3xl overflow-hidden bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col lg:flex-row">
        {/* IMAGE or VIDEO*/}

        <div className="lg:w-3/5 bg-black flex items-center justify-center">
          {post.media_type === "image" ? (
            <img
              src={post.media_url}
              alt="Post"
              className="w-full h-[80vh] object-contain"
            />
          ) : (
            <MediaPlayer
              src={post.media_url}
              className="w-full h-[80vh] object-contain"
            />
          )}
        </div>

        {/* RIGHT */}

        <div className="lg:w-2/5 flex flex-col">
          {/* HEADER */}

          <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <img
                src={post.profiles.avatar_url}
                alt=""
                className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500"
              />

              <div>
                <h2 className="font-semibold text-zinc-900 dark:text-white">
                  {post.profiles.full_name || post.profiles.username}
                </h2>

                <p className="text-sm text-zinc-500">
                  @{post.profiles.username}
                </p>
              </div>
            </div>

            <button className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full p-2 transition">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* BODY */}

          <div className="flex-1 overflow-y-auto p-6">
            <p className="text-[15px] leading-7 text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap">
              {post.caption}
            </p>
          </div>

          {/* ACTIONS */}

          <div className="border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between items-center px-6 py-4">
              <div className="flex gap-6">
                <button className="flex items-center gap-2 group">
                  <Heart
                    size={23}
                    className="group-hover:text-red-500 text-white transition"
                  />

                  <span className="font-medium text-white">
                    {post.likes?.[0]?.count || 0}
                  </span>
                </button>

                <button className="flex items-center gap-2 group">
                  <MessageCircle
                    size={23}
                    className="group-hover:text-blue-500 text-white transition"
                  />

                  <span>0</span>
                </button>

                <button className="group">
                  <Share2
                    size={23}
                    className="group-hover:text-indigo-500 text-white transition"
                  />
                </button>
              </div>

              <button className="group">
                <Bookmark
                  size={23}
                  className="group-hover:text-yellow-500 text-white transition"
                />
              </button>
            </div>

            <div className="px-6 pb-5">
              <p className="font-semibold text-sm">
                {post.likes?.[0]?.count || 0} Likes
              </p>

              <p className="text-xs text-zinc-500 mt-2">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
