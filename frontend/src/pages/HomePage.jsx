import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
  BellIcon,
} from "lucide-react";

import { capitialize } from "../lib/utils";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  // ← fetch incoming friend requests
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  // ← accept friend request mutation
  const { mutate: acceptRequestMutation, isPending: isAccepting } = useMutation(
    {
      mutationFn: acceptFriendRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
        queryClient.invalidateQueries({ queryKey: ["friends"] });
      },
    },
  );

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  const incomingRequests = friendRequests?.incomingReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-base-100 to-base-200 min-h-screen">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>

          {/* ← Replace the Link with a dropdown */}
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-outline btn-sm indicator">
              {incomingRequests.length > 0 && (
                <span className="indicator-item badge badge-primary badge-xs">
                  {incomingRequests.length}
                </span>
              )}
              <BellIcon className="size-4 mr-1" />
              Friend Requests
            </button>

            <div
              tabIndex={0}
              className="dropdown-content z-50 mt-2 w-80 rounded-box bg-base-100 shadow-xl border border-base-300"
            >
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                <h3 className="font-semibold text-sm text-base-content/60 uppercase tracking-wide">
                  Incoming Requests
                </h3>

                {incomingRequests.length === 0 ? (
                  <div className="flex flex-col items-center py-6 text-center">
                    <UsersIcon className="size-8 opacity-30 mb-2" />
                    <p className="text-sm opacity-50">No pending requests</p>
                  </div>
                ) : (
                  incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-base-200 transition"
                    >
                      <div className="flex items-center gap-2">
                        <div className="avatar size-10 rounded-full">
                          <img
                            src={request.sender.profilePic}
                            alt={request.sender.fullName}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            {request.sender.fullName}
                          </p>
                          <p className="text-xs opacity-60">
                            {capitialize(request.sender.nativeLanguage)}
                          </p>
                        </div>
                      </div>

                      <button
                        className="btn btn-primary btn-xs"
                        onClick={() => acceptRequestMutation(request._id)}
                        disabled={isAccepting}
                      >
                        Accept
                      </button>
                    </div>
                  ))
                )}

                {/* Link to full notifications page */}
                {incomingRequests.length > 0 && (
                  <Link
                    to="/notifications"
                    className="btn btn-ghost btn-sm w-full mt-2"
                  >
                    View All Notifications
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Discover People
                </h2>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                No recommendations available
              </h3>
              <p className="text-base-content opacity-70">
                We're working on finding the right people for you.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                      </div>

                      {user.bio && (
                        <p className="text-sm opacity-70">{user.bio}</p>
                      )}

                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
