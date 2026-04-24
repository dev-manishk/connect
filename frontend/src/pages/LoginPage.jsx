import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { login } from "../lib/api";
import { Send, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#070b14]">
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
        {/* Blob 1 — Sky blue, top-left anchor */}
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

        {/* Blob 2 — Indigo, bottom-right anchor */}
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

        {/* Blob 3 — Violet, center soft glow */}
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

        {/* Blob 4 — Cyan accent, bottom-left */}
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

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl">
        <BorderAnimatedContainer>
          <div className="flex w-full rounded-2xl overflow-hidden backdrop-blur-[32px] bg-slate-950/50 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {/* LEFT — Form */}
            <div className="w-full lg:w-1/2 p-10 flex flex-col gap-8">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-sky-500/30 transition-transform hover:rotate-6 duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(56,189,248,0.3), rgba(56,189,248,0.1))",
                  }}
                >
                  <Send className="w-7 h-7 text-sky-400" />
                </div>
                <span
                  className="text-4xl font-bold font-mono tracking-tighter"
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

              {/* Header */}
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-slate-400 mt-2 text-sm font-medium">
                  Login to rejoin the global conversation.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="flex flex-col gap-6">
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:bg-white/5"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:ring-2 ring-sky-500/20 focus:bg-white/5"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-sky-400 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-4 rounded-xl text-sm font-black text-white mt-2 transition-all hover:brightness-125 hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] active:scale-[0.97] disabled:opacity-50"
                  style={{
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
                  }}
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      LOGGING IN...
                    </span>
                  ) : (
                    "SIGN IN"
                  )}
                </button>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg text-xs font-bold text-center">
                    {error.response?.data?.message || "AUTHENTICATION FAILED"}
                  </div>
                )}

                {/* Footer */}
                <p className="text-center text-sm text-slate-500 font-medium">
                  Need an account?{" "}
                  <Link
                    to="/signup"
                    className="text-sky-400 hover:text-sky-300 underline decoration-sky-500/30 underline-offset-4"
                  >
                    Create one here
                  </Link>
                </p>
              </form>
            </div>

            {/* RIGHT — Illustration */}
            <div
              className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative"
              style={{
                background: "rgba(56,189,248,0.03)",
                borderLeft: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="absolute inset-0 bg-sky-500/10 blur-[120px] rounded-full scale-75" />
              <div className="relative z-10 w-full max-w-sm drop-shadow-[0_35px_60px_rgba(0,0,0,0.6)] transform transition-transform duration-700 hover:scale-110">
                <img
                  src="/i.png"
                  alt="Connect Illustration"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="relative z-10 text-center mt-12 max-w-xs">
                <h3 className="text-xl font-black text-slate-100 mb-3 tracking-tight">
                  GLOBAL REACH
                </h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  Join thousands of users across the globe and transform how you
                  communicate.
                </p>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
};

export default LoginPage;
