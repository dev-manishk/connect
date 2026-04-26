import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  CameraIcon,
  ShuffleIcon,
  MapPinIcon,
  LoaderIcon,
  Send,
  User,
  FileText,
  Globe,
} from "lucide-react";
import { completeOnboarding } from "../lib/api";
import { LANGUAGES } from "../constants";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const avatarSeed = encodeURIComponent(formState.fullName + Date.now());
    const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated");
  };

  return (
    <div className="h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#070b14]">
      {/* ── BACKGROUND ANIMATION ── */}
      <style>{`
        @keyframes drift1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          40%       { transform: translate(40px, 30px) scale(1.06); }
          70%       { transform: translate(-25px, 50px) scale(0.96); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          35%       { transform: translate(-50px, -35px) scale(1.08); }
          65%       { transform: translate(30px, -55px) scale(0.94); }
        }
        @keyframes drift3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50%       { transform: translate(-50%, -50%) scale(1.12); }
        }
        @keyframes drift4 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50%       { transform: translate(20px, -30px) scale(1.05); }
        }
      `}</style>

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full blur-[130px]"
          style={{
            width: "65%",
            height: "65%",
            top: "-10%",
            left: "-8%",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.22) 0%, transparent 70%)",
            animation: "drift1 14s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full blur-[140px]"
          style={{
            width: "70%",
            height: "70%",
            bottom: "-15%",
            right: "-8%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)",
            animation: "drift2 17s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full blur-[160px]"
          style={{
            width: "50%",
            height: "50%",
            top: "50%",
            left: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 70%)",
            animation: "drift3 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full blur-[110px]"
          style={{
            width: "35%",
            height: "35%",
            bottom: "8%",
            left: "4%",
            background:
              "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
            animation: "drift4 11s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/*MAIN CARD*/}
      <div className="relative z-10 w-full max-w-2xl">
        <BorderAnimatedContainer>
          <div className="rounded-2xl overflow-hidden backdrop-blur-[32px] bg-slate-950/50 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6">
            {/* Logo + Header */}
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/30 transition-transform hover:rotate-6 duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(56,189,248,0.3), rgba(56,189,248,0.1))",
                }}
              >
                <Send className="w-5 h-5 text-sky-400" />
              </div>
              <span
                className="text-2xl font-bold font-mono tracking-tighter"
                style={{
                  background: "linear-gradient(90deg, #38bdf8, #818cf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Connect
              </span>
            </div>

            <h2 className="text-base font-extrabold text-white tracking-tight">
              Complete Your Profile
            </h2>
            <p className="text-slate-400 mt-1 text-xs font-medium mb-5">
              Set up your profile to start connecting with people
              worldwide.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/*  horizontal layout to save vertical space */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "2px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <CameraIcon className="w-7 h-7 text-slate-500" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-sky-400 transition-all hover:brightness-125 hover:shadow-[0_0_16px_rgba(14,165,233,0.3)]"
                  style={{
                    background: "rgba(56,189,248,0.08)",
                    border: "1px solid rgba(56,189,248,0.25)",
                  }}
                >
                  <ShuffleIcon className="w-3.5 h-3.5" />
                  Generate Random Avatar
                </button>
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                  <input
                    type="text"
                    name="fullName"
                    value={formState.fullName}
                    onChange={(e) =>
                      setFormState({ ...formState, fullName: e.target.value })
                    }
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:ring-2 ring-sky-500/20 focus:bg-white/5"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Bio
                </label>
                <div className="relative group">
                  <FileText className="absolute left-3.5 top-3 w-3.5 h-3.5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                  <textarea
                    name="bio"
                    value={formState.bio}
                    onChange={(e) =>
                      setFormState({ ...formState, bio: e.target.value })
                    }
                    placeholder="Tell others about yourself"
                    rows={2}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:ring-2 ring-sky-500/20 focus:bg-white/5 resize-none"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  />
                </div>
              </div>

              {/* Language + Location side by side */}
              <div className="grid grid-cols-2 gap-3">
                {/* Native Language */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Native Language
                  </label>
                  <div className="relative group">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-sky-400 transition-colors pointer-events-none" />
                    <select
                      name="nativeLanguage"
                      value={formState.nativeLanguage}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          nativeLanguage: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm text-slate-100 outline-none transition-all focus:ring-2 ring-sky-500/20 appearance-none cursor-pointer"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      <option value="" className="bg-slate-900">
                        Select...
                      </option>
                      {LANGUAGES.map((lang) => (
                        <option
                          key={`native-${lang}`}
                          value={lang.toLowerCase()}
                          className="bg-slate-900"
                        >
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Location
                  </label>
                  <div className="relative group">
                    <MapPinIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                    <input
                      type="text"
                      name="location"
                      value={formState.location}
                      onChange={(e) =>
                        setFormState({ ...formState, location: e.target.value })
                      }
                      placeholder="City, Country"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:ring-2 ring-sky-500/20 focus:bg-white/5"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 rounded-xl text-sm font-black text-white mt-1 transition-all hover:brightness-125 hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] active:scale-[0.97] disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
                }}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    SETTING UP...
                  </span>
                ) : (
                  "COMPLETE ONBOARDING"
                )}
              </button>
            </form>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
};

export default OnboardingPage;
