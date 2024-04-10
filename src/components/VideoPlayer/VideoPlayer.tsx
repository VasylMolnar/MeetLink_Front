import { useEffect, useRef } from "react";
import { selectCurrentUserId } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";

const VideoPlayer: React.FC<{ stream?: MediaStream | null; userId: any }> = ({
  stream,
  userId,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const id = useSelector(selectCurrentUserId);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      className="video"
      muted={userId === id ? true : false}
      // width="100%"
      // height="100%"
    />
  );
};

export default VideoPlayer;
