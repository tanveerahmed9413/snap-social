import { useEffect } from "react";
import { Grid3X3 } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { usePost } from "../../posts/hooks/usePost";
import { useAuth } from "../../auth/hooks/useAuth";
import ProfileHeader from "./ProfileHeader";
import ProfilePostsGrid from "./ProfilePostsGrid";

const ProfileCard = () => {
  const {
    profile,
    posts,
    followers,
    following,
    status,
    loadProfile,
    removePostFromProfile,
  } = useProfile();

  const { handleDeletePost } = usePost();
  const { signout } = useAuth();

  // Page khulte hi load. Data pehle se ho aur fresh ho to network call nahi hoti.
  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeletePost = async (postId) => {
    const deleted = await handleDeletePost(postId);
    if (deleted) removePostFromProfile(postId);
  };

  // Sirf pehli baar spinner. Uske baad purana data dikhta rehta hai.
  if (status === "idle" || status === "loading") {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-black animate-spin" />
        <p className="text-gray-500 text-sm">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-3">
        <p className="text-lg text-gray-500">Profile load nahi ho payi.</p>
        <button
          onClick={() => loadProfile({ force: true })}
          className="cursor-pointer rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <ProfileHeader
        profile={profile}
        postCount={posts.length}
        followers={followers}
        following={following}
        onLogout={signout}
      />

      <div className="border-t my-8 sm:my-10" />

      <div className="flex justify-center mb-6 sm:mb-8">
        <span className="flex items-center gap-2 border-b-2 border-black pb-2 font-semibold text-sm sm:text-base">
          <Grid3X3 size={18} />
          Posts
        </span>
      </div>

      <ProfilePostsGrid posts={posts} onDelete={onDeletePost} />
    </section>
  );
};

export default ProfileCard;
