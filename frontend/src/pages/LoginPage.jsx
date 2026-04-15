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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #1a1f2e 0%, #16213e 100%)",
      }}
    >
      <BorderAnimatedContainer>
        <div className="flex w-full max-w-4xl rounded-2xl overflow-hidden">
          {/* LEFT — Form */}
          <div className="w-full lg:w-1/2 p-10 flex flex-col gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(56,189,248,0.15)" }}
              >
                <Send className="w-8 h-8 text-sky-400" />
              </div>
              <span
                className="text-4xl font-bold font-mono tracking-normal"
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

            {/* Heading */}
            <div>
              <h2 className="text-xl font-semibold text-slate-100">
                Welcome Back
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Sign in to your account to continue your journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-slate-400">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="hello@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-slate-200 placeholder-slate-600 outline-none"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
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
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-slate-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-sky-500/50"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white mt-1"
                style={{ background: "#0ea5e9" }}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-xs" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              {error && (
                <div className="alert alert-error">
                  <span>{error.response?.data?.message}</span>
                </div>
              )}

              <p className="text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link to="/signup" className="text-sky-400 hover:underline">
                  Create one
                </Link>
              </p>
            </form>
          </div>

          {/* RIGHT — Illustration */}
          <div
            className="hidden lg:flex w-1/2 flex-col items-center justify-center gap-6 p-10"
            style={{
              background: "rgba(56,189,248,0.04)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="relative aspect-square max-w-xs w-full">
              <img
                src="/i.png"
                alt="Language connection illustration"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-center space-y-3">
              <h3 className="text-sm font-semibold text-slate-400">
                Connect with people worldwide and turn conversations into real
                friendships
              </h3>
            </div>
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
};

export default LoginPage;
