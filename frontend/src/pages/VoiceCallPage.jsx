import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  StreamTheme,
  CallingState,
  useCallStateHooks,
  useCall,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const VoiceCallPage = () => {
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
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        const audioClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = audioClient.call("default", callId);

        await callInstance.join({ create: true });
        await callInstance.camera.disable();

        setClient(audioClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining audio call:", error);
        toast.error("Could not join the call.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    return () => {
      call?.leave();
    };
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      {client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <AudioCallContent />
          </StreamCall>
        </StreamVideo>
      ) : (
        <div className="text-slate-400">Failed to connect call</div>
      )}
    </div>
  );
};

const AudioCallContent = () => {
  const call = useCall();
  const navigate = useNavigate();

  const { useCallCallingState, useParticipants, useMicrophoneState } =
    useCallStateHooks();

  const callingState = useCallCallingState();
  const participants = useParticipants();
  const { microphone, isMute } = useMicrophoneState();

  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Speaker control (basic)
  useEffect(() => {
    const audios = document.querySelectorAll("audio");
    audios.forEach((a) => (a.muted = isSpeakerMuted));
  }, [isSpeakerMuted]);

  const handleLeave = async () => {
    await call.leave();
    navigate("/");
  };

  if (callingState === CallingState.LEFT) {
    navigate("/");
    return null;
  }

  const remoteParticipants = participants.filter((p) => !p.isLocalParticipant);
  const localParticipant = participants.find((p) => p.isLocalParticipant);

  const formatTime = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <StreamTheme>
      <div className="flex flex-col justify-between h-screen p-6 text-white">
        {/* Top */}
        <div className="text-center">
          <p className="text-sm text-green-400">
            {callingState === CallingState.JOINED
              ? "Connected"
              : "Connecting..."}
          </p>
          <p className="text-xs text-gray-400">{formatTime(duration)}</p>
        </div>

        {/* Participants */}
        <div className="flex flex-col items-center gap-8">
          {remoteParticipants.length > 0 ? (
            remoteParticipants.map((p) => (
              <ParticipantTile key={p.sessionId} participant={p} />
            ))
          ) : (
            <p className="text-gray-400">Waiting for others...</p>
          )}

          {localParticipant && (
            <ParticipantTile
              participant={localParticipant}
              isLocal
              isMuted={isMute}
            />
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-6">
          {/* Mic */}
          <button onClick={() => microphone.toggle()}>
            {isMute ? <MicOff /> : <Mic />}
          </button>

          {/* Speaker */}
          <button onClick={() => setIsSpeakerMuted((v) => !v)}>
            {isSpeakerMuted ? <VolumeX /> : <Volume2 />}
          </button>

          {/* End */}
          <button onClick={handleLeave}>
            <PhoneOff className="text-red-500" />
          </button>
        </div>
      </div>
    </StreamTheme>
  );
};

const ParticipantTile = ({ participant, isLocal, isMuted }) => {
  const muted = isLocal ? isMuted : !participant.audioEnabled;

  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
        {participant.image ? (
          <img src={participant.image} alt="" />
        ) : (
          <span>{participant.name?.[0]}</span>
        )}
      </div>

      <p className="text-sm mt-2">
        {participant.name} {isLocal && "(You)"}
      </p>

      <p className="text-xs text-gray-400">{muted ? "Muted" : "Speaking"}</p>
    </div>
  );
};

export default VoiceCallPage;
