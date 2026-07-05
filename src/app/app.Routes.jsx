import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "../features/auth/pages/SignIn";
import SignUp from "../features/auth/pages/SignUp";
import MainLayout from "../layouts/MainLayouts";
import FeedPage from "../features/posts/pages/FeedPage";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import RootRedirect from "../shared/components/RootRedirect";
import NotFound from "../shared/pages/NotFound";
import Profile from "../features/profile/pages/Profile";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect  />} />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<MainLayout />}>
            <Route path="home" element={<FeedPage />} />
            <Route path="explore" element={<FeedPage />} />
            <Route path="notification" element={<FeedPage />} />
            <Route path="message" element={<FeedPage />} />
            <Route path="saved" element={<FeedPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      <Route  path="*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
