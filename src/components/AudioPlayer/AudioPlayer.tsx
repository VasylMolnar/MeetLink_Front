import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../features/auth/authSlice";

const AudioPlayer = ({ stream, userId }: any) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const id = useSelector(selectCurrentUserId);

  useEffect(() => {
    if (stream && audioRef.current && userId !== id) {
      audioRef.current.srcObject = stream;
    } else {
      if (audioRef.current) {
        audioRef.current.srcObject = null;
      }
    }
  }, [stream, userId, id]);

  return <audio ref={audioRef} autoPlay className="audio" />;
};

export default AudioPlayer;
