import { Link, useLocation } from "react-router";
import { logout } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, Send } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";
import { getSeenAcceptedIds } from "../pages/NotificationsPage";
import EditProfileModal from "./EditProfileModel";

export const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const queryClient = useQueryClient();

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("seenAcceptedReqs");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

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

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center w-full gap-3">
          {/* Logo — visible on mobile (sidebar hidden), hidden on desktop */}
          <div className="lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <Send className="size-7 text-primary" />
              <span className="text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Connect
              </span>
            </Link>
          </div>

          {/* Chat page logo on desktop */}
          {isChatPage && (
            <div className="hidden lg:block pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <Send className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Connect
                </span>
              </Link>
            </div>
          )}

          <div className="ml-auto flex items-center gap-3">
            {/* Bell — hidden on mobile since bottom nav has it */}
            <div className="hidden lg:block">
              <Link to="/notifications">
                <button className="btn btn-ghost btn-circle indicator">
                  {notificationCount > 0 && (
                    <span className="indicator-item badge badge-primary badge-xs">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                  <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                </button>
              </Link>
            </div>

            <ThemeSelector />
            <EditProfileModal authUser={authUser} />

            <button
              className="btn btn-ghost btn-sm btn-square"
              onClick={() =>
                document.getElementById("logout_modal").showModal()
              }
            >
              <LogOutIcon className="h-5 w-5 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <dialog id="logout_modal" className="modal">
        <div className="modal-box max-w-sm">
          <h3 className="font-bold text-lg mb-2">Confirm Logout</h3>
          <p className="text-base-content/70">
            Are you sure you want to log out?
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Cancel</button>
            </form>
            <button
              className="btn btn-error"
              onClick={() => {
                document.getElementById("logout_modal").close();
                logoutMutation();
              }}
            >
              <LogOutIcon className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </nav>
  );
};

export default Navbar;
