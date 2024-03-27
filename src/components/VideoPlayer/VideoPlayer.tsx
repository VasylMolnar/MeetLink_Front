import { useEffect, useRef } from "react";

const VideoPlayer: React.FC<{ stream?: MediaStream | null }> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      className="video"
      // width="100%"
      // height="100%"
    />
  );
};

export default VideoPlayer;
