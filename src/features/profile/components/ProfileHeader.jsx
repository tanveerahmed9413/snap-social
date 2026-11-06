import { Link as LinkIcon, LogOut, UserRoundPen } from "lucide-react";
import { Link } from "react-router-dom";

const FALLBACK_AVATAR = "https://i.pravatar.cc/300";

// Profile ka upar wala hissa: photo, naam, counts, bio, website
const ProfileHeader = ({
  profile,
  postCount,
  followers,
  following,
  onLogout,
}) => {
  const stats = [
    { label: "Posts", value: postCount },
    { label: "Followers", value: followers },
    { label: "Following", value: following },
  ];

  return (
    <div className="flex flex-col items-center md:flex-row md:items-start gap-6 md:gap-10">
      <img
        src={profile.avatar_url || FALLBACK_AVATAR}
        alt={profile.username}
        className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-white shadow-lg shrink-0"
      />

      <div className="flex-1 w-full text-center md:text-left">
        {/* Username + buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">@{profile.username}</h1>

          <div className="flex gap-2">
            <Link
              to="edit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition text-sm sm:text-base"
            >
              <UserRoundPen size={18} />
              Edit Profile
            </Link>

            {/* Mobile pe Navbar me logout nahi dikhta, isliye yahan */}
            <button
              onClick={onLogout}
              className="flex lg:hidden cursor-pointer items-center gap-2 px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition text-sm sm:text-base"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Counts */}
        <div className="flex justify-center md:justify-start gap-8 sm:gap-12 mt-4">
          {stats.map(({ label, value }) => (
            <div key={label}>
              <p className="font-bold text-xl sm:text-2xl">{value}</p>
              <p className="text-gray-500 text-sm sm:text-base">{label}</p>
            </div>
          ))}
        </div>

        {/* Bio etc. */}
        <div className="mt-4 space-y-2">
          {profile.full_name && (
            <h2 className="font-semibold text-lg">{profile.full_name}</h2>
          )}

          {profile.bio && (
            <p className="text-gray-600 max-w-xl mx-auto md:mx-0 whitespace-pre-wrap">
              {profile.bio}
            </p>
          )}

          {profile.email && (
            <p className="text-blue-600 break-all">{profile.email}</p>
          )}

          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
            >
              <LinkIcon size={16} />
              {profile.website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
