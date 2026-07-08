import Sidebar from "../components/Sidebar";
import Topbar from "../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import CreatePostModal from "../features/posts/components/CreatePostModel";
import { useState } from "react";
import MobileNavbar from "../components/MobileNavbar";
import useStatus from "../shared/hooks/useStatus";

const MainLayout = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const online = useStatus();

  const location = useLocation();
  const isReelsPage = location.pathname === "/app/reels";

  return (
    <>
      {/* Internet Status */}
      {!online && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white text-center py-2 shadow-lg">
          🚫 No Internet Connection
        </div>
      )}

      <div className={`${!online ? "pt-10" : ""} flex h-screen bg-gray-100`}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {!isReelsPage && (
            <Topbar onCreateClick={() => setIsCreateOpen(true)} />
          )}

          <main
            className={`flex-1 overflow-y-auto ${
              isReelsPage ? "p-0 bg-black" : "p-6"
            }`}
          >
            <Outlet />
          </main>
        </div>

        {/* Mobile Navbar */}
        <MobileNavbar />

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      </div>
    </>
  );
};

export default MainLayout;
