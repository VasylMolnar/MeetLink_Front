import { useEffect } from "react";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import AudioPlayer from "../AudioPlayer/AudioPlayer";

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
      {streams.map((stream: any) => {
        console.log("stream", stream);

        return (
          <div className="video-screen" key={stream.stream.id}>
            {stream.metadata.isCameraOn === false ? (
              <div className="user-info">
                <div className="micro-status">
                  <div className="micro-status-container">
                    {stream.metadata.isMicrophoneOn ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                      >
                        <path d="M26.0417 13.1012C25.3287 13.1012 24.75 13.6714 24.75 14.3767C24.75 19.1408 20.8248 23.0172 16.0006 23.0172C11.1751 23.0172 7.24987 19.1408 7.24987 14.3767C7.24987 13.6714 6.67122 13.1012 5.95825 13.1012C5.24527 13.1012 4.66663 13.6714 4.66663 14.3767C4.66663 20.1166 9.06589 24.8552 14.709 25.4917V28.0581C14.709 28.7622 15.2863 29.3336 16.0006 29.3336C16.7136 29.3336 17.2922 28.7622 17.2922 28.0581V25.4917C22.934 24.8552 27.3333 20.1166 27.3333 14.3767C27.3333 13.6714 26.7546 13.1012 26.0417 13.1012Z" />
                        <path d="M15.7663 20.2894H16.2339C19.4371 20.2894 22.0359 17.7243 22.0359 14.561V8.39632C22.0359 5.23045 19.4371 2.66663 16.2339 2.66663H15.7663C12.5631 2.66663 9.96438 5.23045 9.96438 8.39632V14.561C9.96438 17.7243 12.5631 20.2894 15.7663 20.2894Z" />
                      </svg>
                    ) : (
                      <svg
                        stroke="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 512 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M367.951 354.654l-26.616-26.562-9.568-9.548-4.698-4.706L187 174.041v.346L76.112 63.531 51.921 87.572 187 222.47v28.816c0 37.79 31.121 68.714 68.91 68.714a68.6 68.6 0 0 0 24.565-4.545l32.389 32.274c-17.333 8.793-36.812 13.86-56.782 13.86-62.986 0-121.365-48.59-121.365-116.59H95.773C95.773 322 158 387.701 233 398.013V480h46v-81.987c22-3.352 43.066-11.222 61.627-22.622l95.278 95.078 24.033-24-33.847-33.785-58.216-57.959 58.224 57.959-58.148-58.03zM325 251.286V100.714C325 62.924 293.791 32 256 32s-69 30.924-69 68.714v25.244l137.109 136.968c.67-3.791.891-7.679.891-11.64zM416.439 245h-38.941c0 20.496-5.498 39.676-14.931 56.197l27.572 27.516c16.523-24.11 26.3-52.787 26.3-83.713zM459.999 446.427l-33.897-33.743 33.855 33.785z"></path>
                      </svg>
                    )}
                  </div>
                </div>

                <div className="user-avatar">
                  <img
                    className="img"
                    src={stream.metadata.avatar}
                    alt={stream.metadata.username}
                  />
                </div>

                <p className="user-name">
                  {stream.metadata.username + " " + stream.metadata.surname}
                </p>

                <AudioPlayer
                  stream={stream.stream}
                  userId={stream.metadata.userId}
                />
              </div>
            ) : (
              <VideoPlayer
                stream={stream.stream}
                userId={stream.metadata.userId}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VideoList;
// fix grid layout
