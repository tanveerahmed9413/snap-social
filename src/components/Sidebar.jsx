import {
  House,
  Compass,
  Bell,
  MessageCircle,
  Bookmark,
  User,
  SquarePen,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Home",
    icon: House,
    active: true,
    path: "home",
  },
  {
    title: "Explore",
    icon: Compass,
    path: "explore",
  },
  {
    title: "Notifications",
    icon: Bell,
    path: "notification",
  },
  {
    title: "Messages",
    icon: MessageCircle,
    path: "message",
  },
  {
    title: "Saved",
    icon: Bookmark,
    path: "saved",
  },
  {
    title: "Profile",
    icon: User,
    path: "profile",
  },
];

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex w-72 bg-white border-r border-gray-200 flex-col justify-between p-6">
      {/* Logo */}
      <div>
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-indigo-600">Lumina</h1>

          <p className="text-xs tracking-[4px] text-gray-400 mt-1">
            PREMIUM NETWORK
          </p>
        </div>

        {/* Navigation */}

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-xl px-4 py-3 transition
        ${
          isActive
            ? "bg-indigo-50 text-indigo-600 font-semibold"
            : "text-gray-700 hover:bg-gray-100"
        }`
                }
              >
                <Icon size={20} />
                {item.title}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
