import { useEffect } from "react";
import VideoPlayer from "../VideoPlayer/VideoPlayer";

const VideoList = ({ streams }: any) => {
  useEffect(() => {
    const videoList = document.querySelector(".video-list");
    const videoScreens = document.querySelectorAll(".video-screen");

    if (streams.length <= 4) {
      // @ts-expect-error: Unreachable code error
      videoList.style.height = "100%";

      if (streams.length === 1) {
        // @ts-expect-error: Unreachable code error
        videoScreens[0].style.flex = "0 0 calc(100% - 15px)";
      } else {
        const flexBasis =
          streams.length <= 2 ? "50%" : streams.length <= 3 ? "33%" : "37%";
        videoScreens.forEach((videoScreen) => {
          // @ts-expect-error: Unreachable code error
          videoScreen.style.flex = `0 0 calc(${flexBasis} - 15px)`;
        });
      }
    } else {
      // @ts-expect-error: Unreachable code error
      videoList.style.height = "auto";

      videoScreens.forEach((videoScreen) => {
        // @ts-expect-error: Unreachable code error
        videoScreen.style.flex = "0 0 calc(25% - 15px)";
      });
    }
  }, [streams]);

  return (
    <div className="video-list">
      {streams.map((stream: any) => (
        <div className="video-screen" key={stream.id}>
          <VideoPlayer stream={stream} />
        </div>
      ))}
    </div>
  );
};

export default VideoList;
