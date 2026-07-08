import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import AppRoutes from "./app/app.Routes";
import { AuthProvider } from "./features/auth/auth.context";
import { PostProvider } from "./features/posts/post.context";
import { ProfileProvider } from "./features/profile/profile.context";
import { ReelsProvider } from "./features/reels/reel.context";

function App() {
  return (
    <>
      <AuthProvider>
        <PostProvider>
          <ProfileProvider>
            <ReelsProvider>
              <AppRoutes />
            </ReelsProvider>
          </ProfileProvider>
        </PostProvider>
      </AuthProvider>
    </>
  );
}

export default App;
