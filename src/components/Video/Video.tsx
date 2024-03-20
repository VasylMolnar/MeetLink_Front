import { useEffect, useRef } from "react";

const VideoPlayer: React.FC<{ stream?: MediaStream | null }> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <video
      data-testid="peer-video"
      style={{ width: "100%" }}
      ref={videoRef}
      autoPlay
      muted={true}
    />
  );
};

export default VideoPlayer;
