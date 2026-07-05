import { House, Compass, Bell, Bookmark, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    icon: House,
    path: "home",
  },
  {
    icon: Compass,
    path: "explore",
  },
  {
    icon: Bell,
    path: "notification",
  },
  {
    icon: Bookmark,
    path: "saved",
  },
  {
    icon: User,
    path: "profile",
  },
];

const MobileNavbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-white py-3 shadow-lg lg:hidden">
      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "text-indigo-600" : "text-gray-500"
            }
          >
            <Icon size={26} />
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileNavbar;
