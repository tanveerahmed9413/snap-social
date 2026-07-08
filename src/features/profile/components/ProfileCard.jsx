import {
  Grid3X3,
  UserRoundPen,
  Link as LinkIcon,
  MoreHorizontal,
  Trash2,
  LogOut,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { useEffect, useState } from "react";
import MediaPlayer from "../../../components/MediaPlayer";
import { usePost } from "../../posts/hooks/usePost";


import { useAuth } from "../../auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ProfileCard = () => {
  const { profile, handleGetProfile, handleGetPosts, loading, posts } =
    useProfile();

  const { handleDeletePost, deleting } = usePost();

  const [openMenuId, setOpenMenuId] = useState(null);


// signoutFeature
  const { signout, } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signout();
    navigate("/signin");
  };


  useEffect(() => {
    const fetchProfile = async () => {
      await handleGetProfile();
      await handleGetPosts();
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-black animate-spin" />
        <p className="text-gray-500 text-sm">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-lg text-gray-500">Profile not found.</p>
      </div>
    );
  }

  const postCount = posts?.length || 0;
  const followerCount = profile.followers_count ?? 12800;
  const followingCount = profile.following_count ?? 0;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Profile Header */}
      <div className="flex flex-col items-center md:flex-row md:items-start gap-6 md:gap-10">
        <div className="flex-shrink-0">
          <img
            src={profile.avatar_url || "https://i.pravatar.cc/300"}
            alt={profile.username}
            className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>

        <div className="flex-1 w-full text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-center md:justify-start gap-3 sm:gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">
              @{profile.username}
            </h1>
            <div className="flex  gap-2">
              <Link to="edit">
                <button className="flex  cursor-pointer items-center gap-2 px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition text-sm sm:text-base">
                  <UserRoundPen size={18} />
                  <span className=" sm:inline">Edit Profile</span>
                </button>
              </Link>
              <button
              onClick={handleLogout}
               className="flex sm:hidden cursor-pointer items-center gap-2 px-5 py-2 rounded-xl   bg-red-400 text-white hover:bg-red-800 transition text-sm sm:text-base">
                
                <LogOut size={18}/>
                <span className=" ">Logout</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center md:justify-start gap-8 sm:gap-12 mt-4">
            <div>
              <h2 className="font-bold text-xl sm:text-2xl">{postCount}</h2>
              <p className="text-gray-500 text-sm sm:text-base">Posts</p>
            </div>
            <div>
              <h2 className="font-bold text-xl sm:text-2xl">
                {followerCount.toLocaleString()}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">Followers</p>
            </div>
            <div>
              <h2 className="font-bold text-xl sm:text-2xl">
                {followingCount.toLocaleString()}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">Following</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {profile.full_name && (
              <h2 className="font-semibold text-lg">{profile.full_name}</h2>
            )}
            {profile.bio && (
              <p className="text-gray-600 max-w-xl mx-auto md:mx-0">
                {profile.bio}
              </p>
            )}
            {profile.email && (
              <p className="text-gray-600 break-all">{profile.email}</p>
            )}
            {profile.website && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600 font-medium">
                <LinkIcon size={16} />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {profile.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t my-8 sm:my-10" />

      {/* Tabs */}
      <div className="flex justify-center gap-8 sm:gap-12 mb-6 sm:mb-8">
        <button className="flex items-center gap-2 border-b-2 border-black pb-2 font-semibold text-sm sm:text-base">
          <Grid3X3 size={18} />
          Posts
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 mb-10 ">
        {posts.map((post) => (
          <div
            key={post.id}
            className="relative lg:aspect-square overflow-hidden rounded-xl bg-black group"
          >
            {/* Media */}
            {post.media_type === "image" ? (
              <img
                src={post.media_url}
                alt={post.caption || "Post"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <MediaPlayer
                src={post.media_url}
                fullWidth
                alwaysShowControls
                className="w-full h-full rounded-xl"
              />
            )}

            {/* Three-dot menu */}
            <div className="absolute top-2 right-2 z-10 cursor-pointer">
              <button
                onClick={() => {
                  setOpenMenuId(openMenuId === post.id ? null : post.id);
                }}
                className="bg-white/90 cursor-pointer backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-white transition"
              >
                <MoreHorizontal size={18} className="text-gray-700" />
              </button>

              {openMenuId === post.id && (
                <div className="absolute cursor-pointer right-0 mt-2 lg:w-40 sm:w-20 bg-white rounded-xl shadow-xl border border-gray-100 py-0 z-20">
                  <button
                    disabled={loading}
                    onClick={async () => {
                      await handleDeletePost(post.id);
                      await handleGetPosts();
                      setOpenMenuId(null);
                    }}
                    className="flex cursor-pointer items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition"
                  >
                    <Trash2 size={16} />
                    {deleting ? "Deleting" : "Delete"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p>No posts yet.</p>
        </div>
      )}
    </section>
  );
};

export default ProfileCard;
