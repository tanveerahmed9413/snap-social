import { BrowserRouter, Routes, Route,} from "react-router-dom";
import { lazy, Suspense } from "react";

import ProtectedRoute from "../shared/components/ProtectedRoute";

const SignIn = lazy(() => import("../features/auth/pages/SignIn"));
const SignUp = lazy(() => import("../features/auth/pages/SignUp"));
const MainLayout = lazy(() => import("../layouts/MainLayouts"));
const FeedPage = lazy(() => import("../features/posts/pages/FeedPage"));
const RootRedirect = lazy(() => import("../shared/components/RootRedirect"));
const NotFound = lazy(() => import("../shared/pages/NotFound"));
const Profile = lazy(() => import("../features/profile/pages/Profile"));
const EditProfile = lazy(()=> import("../features/profile/pages/EditProfile"))


import PageLoader from "../shared/components/PageLoader";

import { Toaster } from "react-hot-toast";

const AppRoutes = () => {
  return (
    <BrowserRouter>

    <Toaster position="top-center" reverseOrder={false} toastOptions={{duration: 3000}}/>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />

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
              <Route path="profile/edit" element={<EditProfile />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
