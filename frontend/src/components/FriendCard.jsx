import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFriend } from "../lib/api";
import { UserMinusIcon } from "lucide-react";

export const FriendCard = ({ friend }) => {
  const queryClient = useQueryClient();

  const { mutate: removeFriendMutation, isPending } = useMutation({
    mutationFn: () => removeFriend(friend._id),
    onSuccess: () => {
      const seenList = JSON.parse(
        localStorage.getItem("seenAcceptedReqs") || "[]",
      );
      const filtered = seenList.filter((seen) => seen.friendId !== friend._id);
      localStorage.setItem("seenAcceptedReqs", JSON.stringify(filtered));

      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const modalId = `remove_friend_modal_${friend._id}`; // ← unique modal ID per friend card

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
        </div>

        <Link
          to={`/chat/${friend._id}`}
          className="btn btn-outline w-full mb-2"
        >
          Message
        </Link>

        {/* Remove friend button — opens modal */}
        <button
          className="btn btn-error btn-outline w-full btn-sm"
          onClick={() => document.getElementById(modalId).showModal()}
        >
          <UserMinusIcon className="size-4 mr-1" />
          Remove Friend
        </button>
      </div>

      {/* Remove friend confirmation modal */}
      <dialog id={modalId} className="modal">
        <div className="modal-box max-w-sm">
          <h3 className="font-bold text-lg mb-2">Remove Friend</h3>
          <p className="text-base-content/70">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-base-content">
              {friend.fullName}
            </span>{" "}
            from your friends?
          </p>
          <div className="modal-action">
            {/* Cancel button */}
            <form method="dialog">
              <button className="btn btn-ghost">Cancel</button>
            </form>
            {/* Confirm remove button */}
            <button
              className="btn btn-error"
              disabled={isPending}
              onClick={() => {
                document.getElementById(modalId).close();
                removeFriendMutation();
              }}
            >
              {isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <>
                  <UserMinusIcon className="size-4 mr-1" />
                  Remove
                </>
              )}
            </button>
          </div>
        </div>
        {/* Click outside to close */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
