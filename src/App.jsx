import AppRoutes from "./app/app.Routes";
import { AuthProvider } from "./features/auth/auth.context";
import { PostProvider } from "./features/posts/post.context";
import { ProfileProvider } from "./features/profile/profile.context";
import { ReelsProvider } from "./features/reels/reel.context";
import { FollowProvider } from "./features/follows/follow.context";

function App() {
  return (
    <>
      <AuthProvider>
        <PostProvider>
          <ProfileProvider>
            <ReelsProvider>
              <FollowProvider>
                <AppRoutes />
              </FollowProvider>
            </ReelsProvider>
          </ProfileProvider>
        </PostProvider>
      </AuthProvider>
    </>
  );
}

export default App;
