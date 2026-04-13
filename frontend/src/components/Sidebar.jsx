import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, Send, UsersIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";
import { getSeenAcceptedIds } from "../pages/NotificationsPage";

export const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const seenList = getSeenAcceptedIds();
  const unseenAccepted = (friendRequests?.acceptedReqs || []).filter(
    (n) =>
      !seenList.some(
        (seen) => seen.notifId === n._id || seen.friendId === n.recipient?._id,
      ),
  );
  const notificationCount =
    (friendRequests?.incomingReqs?.length || 0) + unseenAccepted.length;

  const navLinks = [
    { to: "/", icon: HomeIcon, label: "Home" },
    { to: "/friends", icon: UsersIcon, label: "Friends" },
    {
      to: "/notifications",
      icon: BellIcon,
      label: "Notifications",
      badge: notificationCount,
    },
  ];

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
        <div className="p-5 border-b border-base-300 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <Send className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Connect
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ to, icon: Icon, label, badge }) => (
            <Link
              key={to}
              to={to}
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath === to ? "btn-active" : ""
              }`}
            >
              <div className="relative">
                <Icon className="size-5 text-base-content opacity-70" />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 badge badge-primary badge-xs">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </div>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* User profile */}
        <div className="p-4 border-t border-base-300 mt-auto">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{authUser?.fullName}</p>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="size-2 rounded-full bg-success inline-block" />
                Online
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-base-200 border-t border-base-300 flex items-center justify-around h-16 px-2">
        {navLinks.map(({ to, icon: Icon, label, badge }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors ${
              currentPath === to
                ? "text-primary"
                : "text-base-content opacity-50"
            }`}
          >
            <div className="relative">
              <Icon className="size-5" />
              {badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 badge badge-primary badge-xs">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </div>
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
