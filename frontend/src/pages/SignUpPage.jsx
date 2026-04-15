import { useState } from "react";
import { Send, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();

  const {
    mutate: signupMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #1a1f2e 0%, #16213e 100%)",
      }}
    >
      <BorderAnimatedContainer>
        <div className="flex w-full rounded-2xl overflow-hidden">
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
                className="text-4xl font-bold tracking-normal"
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
                Create Account
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Sign up for a new account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-slate-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Jaap Haartsen"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-sky-500/50"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    value={signupData.fullName}
                    onChange={(e) =>
                      setSignupData({ ...signupData, fullName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-slate-400">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="hello@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-sky-500/50"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
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
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-sky-500/50"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
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
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white mt-1"
                style={{ background: "#0ea5e9" }}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-xs" />
                    Loading...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="text-sky-400 hover:underline">
                  Login
                </Link>
              </p>

              {error && (
                <div className="alert alert-error">
                  <span>{error.response?.data?.message}</span>
                </div>
              )}
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
                alt="People connecting"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-center space-y-3">
              <h3 className="text-slate-400 text-sm font-semibold">
                Connect with people worldwide
              </h3>
              <div className="flex gap-2 justify-center">
                {["Free", "Easy Setup", "Private"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-slate-500 rounded-full px-3 py-1"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
};

export default SignUpPage;
