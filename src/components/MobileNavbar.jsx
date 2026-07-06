import { House, Compass, Bell, Bookmark, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { icon: House, label: "Home", path: "home" },
  { icon: Compass, label: "Explore", path: "explore" },
  { icon: Bell, label: "Notifications", path: "notification" },
  { icon: Bookmark, label: "Saved", path: "saved" },
  { icon: User, label: "Profile", path: "profile" },
];

const MobileNavbar = () => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-gray-200 bg-white/90 py-2 backdrop-blur-sm shadow-lg lg:hidden safe-bottom"
      aria-label="Mobile navigation"
    >
      {menuItems.map(({ icon: Icon, label, path }) => (
        <NavLink
          key={path}
          to={path}
          end={path === "home"} // exact match for home
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors ${
              isActive
                ? "text-indigo-600 bg-indigo-50"
                : "text-gray-500 hover:text-gray-700"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                size={26}
                strokeWidth={isActive ? 2.5 : 2}
                className="transition-all"
                aria-hidden="true"
              />
              <span
                className={`text-[10px] font-medium leading-none ${
                  isActive ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNavbar;