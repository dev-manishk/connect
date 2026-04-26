import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData.token || !authUser || !callId) return;

      try {
        console.log("Initializing Stream video client...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        console.log("Joined call successfully");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0b0f1a] relative overflow-hidden">
      {/* ── Animated background ── */}
      <style>{`
        @keyframes floatBlob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(40px, 30px) scale(1.05); }
          66%       { transform: translate(-20px, 50px) scale(0.95); }
        }
        @keyframes floatBlob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(-50px, -30px) scale(1.08); }
          66%       { transform: translate(20px, -50px) scale(0.97); }
        }
        @keyframes floatBlob3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50%       { transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes shimmer {
          0%   { opacity: 0.03; }
          50%  { opacity: 0.06; }
          100% { opacity: 0.03; }
        }
        @keyframes rotateConic {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 0.15; transform: scale(1);   }
          50%       { opacity: 0.35; transform: scale(1.4); }
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none">
        {/* Blob 1 — indigo, top-left */}
        <div
          className="absolute w-[520px] h-[520px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
            opacity: 0.18,
            top: "-12%",
            left: "-10%",
            animation: "floatBlob1 13s ease-in-out infinite",
          }}
        />

        {/* Blob 2 — violet, bottom-right */}
        <div
          className="absolute w-[620px] h-[620px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
            opacity: 0.14,
            bottom: "-18%",
            right: "-12%",
            animation: "floatBlob2 16s ease-in-out infinite",
          }}
        />

        {/* Blob 3 — cyan, center */}
        <div
          className="absolute w-[420px] h-[420px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
            opacity: 0.09,
            top: "42%",
            left: "42%",
            animation: "floatBlob3 19s ease-in-out infinite",
          }}
        />

        {/* Blob 4 — rose accent, top-right */}
        <div
          className="absolute w-[300px] h-[300px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #e879f9 0%, transparent 70%)",
            opacity: 0.08,
            top: "5%",
            right: "8%",
            animation: "floatBlob2 20s ease-in-out infinite reverse",
          }}
        />

        {/* Slow-rotating conic ring — subtle colour sweep */}
        <div
          className="absolute w-[900px] h-[900px] rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 60%, rgba(99,102,241,0.06) 70%, rgba(124,58,237,0.08) 80%, transparent 90%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "rotateConic 28s linear infinite",
          }}
        />

        {/* Fine grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            animation: "shimmer 8s ease-in-out infinite",
          }}
        />

        {/* Scattered dot accents */}
        {[
          { top: "18%", left: "22%", delay: "0s", size: 5 },
          { top: "72%", left: "15%", delay: "1.2s", size: 4 },
          { top: "35%", left: "78%", delay: "2.5s", size: 6 },
          { top: "80%", left: "65%", delay: "0.8s", size: 4 },
          { top: "55%", left: "48%", delay: "3.1s", size: 3 },
          { top: "10%", left: "55%", delay: "1.7s", size: 5 },
          { top: "90%", left: "40%", delay: "0.4s", size: 4 },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-indigo-400"
            style={{
              width: dot.size,
              height: dot.size,
              top: dot.top,
              left: dot.left,
              animation: `pulseDot ${3 + i * 0.4}s ease-in-out infinite`,
              animationDelay: dot.delay,
            }}
          />
        ))}
      </div>

      {/* ── Call UI (sits above background) ── */}
      <div className="relative z-10 w-full h-full">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 font-medium">
              Could not initialize call. Please refresh or try again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;
