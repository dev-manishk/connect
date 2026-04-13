import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { CameraIcon, ShuffleIcon, LoaderIcon, PencilIcon } from "lucide-react";
import { completeOnboarding } from "../lib/api";
import { LANGUAGES } from "../constants";

const EditProfileModal = ({ authUser }) => {
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: updateProfileMutation, isPending: isUpdating } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      document.getElementById("edit_profile_modal").close();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleRandomAvatar = () => {
    const avatarSeed = encodeURIComponent(formState.fullName + Date.now());
    const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random avatar generated");
  };

  const handleOpen = () => {
    setFormState({
      fullName: authUser?.fullName || "",
      bio: authUser?.bio || "",
      nativeLanguage: authUser?.nativeLanguage || "",
      location: authUser?.location || "",
      profilePic: authUser?.profilePic || "",
    });
    document.getElementById("edit_profile_modal").showModal();
  };

  return (
    <>
      {/* Clickable avatar trigger */}
      <div
        className="tooltip tooltip-bottom cursor-pointer ml-1"
        data-tip="Edit Profile"
        onClick={handleOpen}
      >
        <div className="avatar">
          <div className="w-9 rounded-full ring ring-base-300 hover:ring-primary transition-all duration-200">
            <img
              src={authUser?.profilePic}
              alt="User Avatar"
              rel="noreferrer"
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box max-w-lg">
          <h3 className="font-bold text-xl mb-6">Edit Profile</h3>

          <div className="space-y-5">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="size-24 rounded-full bg-base-300 overflow-hidden ring ring-base-300">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-10 text-base-content opacity-40" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleRandomAvatar}
                className="btn btn-accent btn-sm"
              >
                <ShuffleIcon className="size-4 mr-1" />
                Random Avatar
              </button>
            </div>

            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* Bio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered h-20 w-full"
                placeholder="Tell others about yourself..."
              />
            </div>

            {/* Native Language */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Native Language</span>
              </label>
              <select
                value={formState.nativeLanguage}
                onChange={(e) =>
                  setFormState({ ...formState, nativeLanguage: e.target.value })
                }
                className="select select-bordered w-full"
              >
                <option value="">Select your native language</option>
                {LANGUAGES.map((lang) => (
                  <option key={`native-${lang}`} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input
                type="text"
                value={formState.location}
                onChange={(e) =>
                  setFormState({ ...formState, location: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Cancel</button>
            </form>
            <button
              className="btn btn-primary"
              disabled={isUpdating}
              onClick={() => updateProfileMutation(formState)}
            >
              {isUpdating ? (
                <>
                  <LoaderIcon className="animate-spin size-4 mr-1" />
                  Saving...
                </>
              ) : (
                <>
                  <PencilIcon className="size-4 mr-1" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditProfileModal;
