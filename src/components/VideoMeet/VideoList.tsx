import VideoPlayer from "../VideoPlayer/VideoPlayer";

const VideoList = ({ streams }: any) => {
  return (
    <div className="video-list">
      {streams.map((stream: any) => (
        <div className="video-screen">
          <VideoPlayer stream={stream} />
        </div>
      ))}
    </div>
  );
};

export default VideoList;
