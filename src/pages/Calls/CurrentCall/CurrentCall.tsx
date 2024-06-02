import { useParams } from "react-router-dom";
import "./CurrentCall.scss";
// import VideoMeet from "../../../components/VideoMeet/VideoMeet";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../features/auth/authSlice";
import { useGetMyInfoQuery } from "../../../features/user/userApiSlice";
import { IUser } from "../../../types/authTypes";
import { Socket, io } from "socket.io-client";
import Peer from "peerjs";
import { Loading } from "notiflix";
import { Container } from "react-bootstrap";
import VideoList from "../../../components/VideoMeet/VideoList";

const CurrentCall = () => {
  const { id: callRoomId } = useParams();

  const userId = useSelector(selectCurrentUserId);
  const { data, isSuccess } = useGetMyInfoQuery(userId);
  const myInfo = data as IUser;

  const [socket, setSocket] = useState<Socket<any, any> | null>(null);
  const [isConferenceJoined, setIsConferenceJoined] = useState(false);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  const [control, setControl] = useState({
    screen: false,
    sound: true,
  });

  const toggleControl = (id: string) => {
    // @ts-expect-error: Unreachable code error
    setControl((prevControl) => ({ ...prevControl, [id]: !prevControl[id] }));

    if (id === "sound") {
      const audioElements = document.querySelectorAll("audio");
      const videoElements = document.querySelectorAll("video");

      audioElements.forEach(function (audio) {
        audio.muted = control[id];
      });

      videoElements.forEach(function (video) {
        video.muted = control[id];
      });
    }
  };

  const toggleCamera = () => {
    if (!myStream || !socket) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    myStream[userId].stream.getVideoTracks()[0].enabled = !isCameraOn;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    myStream[userId].metadata.isCameraOn = !isCameraOn;

    setIsCameraOn(!isCameraOn);
    socket.emit("callToggleCamera", callRoomId, userId, !isCameraOn);
  };

  const toggleMicrophone = () => {
    if (!myStream || !socket) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    myStream[userId].stream.getAudioTracks()[0].enabled = !isMicrophoneOn;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    myStream[userId].metadata.isMicrophoneOn = !isMicrophoneOn;

    setIsMicrophoneOn(!isMicrophoneOn);

    socket.emit("callToggleMicrophone", callRoomId, userId, !isMicrophoneOn);
  };

  useEffect(() => {
    const newSocket = io("http://localhost:3500");
    setSocket(newSocket);

    const newPeer = new Peer(userId);
    setPeer(newPeer);

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          setMyStream({
            [userId]: {
              stream,
              metadata: {
                userId: userId,
                username: myInfo.username,
                surname: myInfo.surname,
                avatar: myInfo.avatar || null,
                isCameraOn,
                isMicrophoneOn,
              },
            },
          });
        });
    } catch (e) {
      // console.log(e);
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }

      if (newPeer) {
        newPeer.destroy();
      }
    };
  }, [userId]);

  useEffect(() => {
    if (!socket || !peer || !myStream || !isSuccess) return;

    if (!isConferenceJoined) {
      socket.emit("joinCallRoom", callRoomId, userId, {
        username: myInfo.username,
        surname: myInfo.surname,
        avatar: myInfo.avatar,
        isCameraOn,
        isMicrophoneOn,
      });
      setIsConferenceJoined(true);
    }

    //I listen when new user connected to conference. And send my Stream and call them
    socket.on("user connected to call", (peerId: any, metadataUser: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const call = peer.call(peerId, myStream[userId].stream, {
        metadata: {
          username: myInfo.username,
          surname: myInfo.surname,
          avatar: myInfo.avatar,
          isCameraOn,
          isMicrophoneOn,
        },
      });

      call.on("stream", (remoteStream: any) => {
        setRemoteStream((prevUsers: any) => ({
          ...prevUsers,

          [peerId]: {
            stream: remoteStream,
            metadata: metadataUser,
          },
        }));
      });
    });

    //I listen call to me
    peer.on("call", (call: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      call.answer(myStream[userId].stream);

      //I listen answer from user
      call.on("stream", (remoteStream: any) => {
        const peerId = call.peer;

        setRemoteStream((prevUsers: any) => ({
          ...prevUsers,
          [peerId]: {
            stream: remoteStream,
            metadata: call.metadata,
          },
        }));
      });
    });

    socket.on("user disconnected", (peerId: string) => {
      setRemoteStream((prevUsers: any) => {
        const updatedUsers = { ...prevUsers };
        delete updatedUsers[peerId];
        return updatedUsers;
      });
    });

    socket.on("userToggleCameraCall", (userId: any, isCameraOn: boolean) => {
      if (!remoteStream) return;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const userStream = remoteStream[userId];

      if (!userStream) return;
      userStream.stream.getVideoTracks()[0].enabled = isCameraOn;
      // userStream.metadata.isCameraOn = isCameraOn;

      setRemoteStream((prevUsers: any) => ({
        ...prevUsers,
        [userId]: {
          ...prevUsers[userId],
          metadata: { ...prevUsers[userId].metadata, isCameraOn: isCameraOn },
        },
      }));
    });

    socket.on("userToggleMicroCall", (userId: any, isMicrophoneOn: boolean) => {
      if (!remoteStream) return;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const userStream = remoteStream[userId];

      if (!userStream) return;
      userStream.stream.getAudioTracks()[0].enabled = isMicrophoneOn;
      // userStream.metadata.isMicrophoneOn = isMicrophoneOn;

      setRemoteStream((prevUsers: any) => ({
        ...prevUsers,
        [userId]: {
          ...prevUsers[userId],
          metadata: {
            ...prevUsers[userId].metadata,
            isMicrophoneOn: isMicrophoneOn,
          },
        },
      }));
    });

    socket.on("error", () => {
      //console.error("Socket error:", error.message);
    });

    return () => {
      socket.off("user connected to call");
      socket.off("user disconnected");
      socket.off("userToggleCamera");
      socket.off("userToggleMicro");
      socket.off("error");
    };
  }, [socket, peer, myStream, remoteStream]);

  useEffect(() => {
    if (!myStream) {
      Loading.pulse();
    } else {
      Loading.remove();
    }
  }, [myStream]);

  useEffect(() => {
    const navigation = document.querySelector(".meet-link-nav");
    const privateRoute = document.querySelector(".privateRoute");

    if (navigation && privateRoute) {
      // @ts-expect-error: Unreachable code error
      navigation.style.display = "none";

      // @ts-expect-error: Unreachable code error
      privateRoute.style.paddingInlineStart = "0px";
    }

    return () => {
      // @ts-expect-error: Unreachable code error
      navigation.style.display = "flex";

      // @ts-expect-error: Unreachable code error
      privateRoute.style.paddingInlineStart = "17rem";
    };
  }, []);

  return (
    <main className="meet-link-current-call">
      {myStream && (
        <Container>
          <VideoList
            streams={
              myStream && remoteStream
                ? [...Object.values(myStream), ...Object.values(remoteStream)]
                : [...Object.values(myStream)]
            }
          />

          <div className="video-control">
            <ul className="list">
              <li
                className={isCameraOn ? "item video active" : "item video"}
                onClick={() => toggleCamera()}
              >
                {isCameraOn ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33"
                    height="33"
                    viewBox="0 0 33 33"
                  >
                    <path d="M29.0976 10.6185C28.5389 10.2666 27.8522 10.2354 27.2669 10.5332L25.2909 11.5309C24.5602 11.8991 24.1069 12.6436 24.1069 13.472V21.25C24.1069 22.0784 24.5602 22.8216 25.2909 23.1925L27.2656 24.1887C27.5336 24.3268 27.8202 24.3931 28.1069 24.3931C28.4509 24.3931 28.7922 24.2957 29.0976 24.1048C29.6562 23.7542 29.9896 23.1464 29.9896 22.4804V12.2442C29.9896 11.5782 29.6562 10.9705 29.0976 10.6185Z" />
                    <path d="M16.5297 27.3619H8.80693C5.57756 27.3619 3.32288 25.1352 3.32288 21.9474V12.7765C3.32288 9.58732 5.57756 7.36194 8.80693 7.36194H16.5297C19.759 7.36194 22.0137 9.58732 22.0137 12.7765V21.9474C22.0137 25.1352 19.759 27.3619 16.5297 27.3619Z" />
                  </svg>
                ) : (
                  <svg
                    stroke="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 640 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-86.4-67.7 13.8 9.2c9.8 6.5 22.4 7.2 32.9 1.6s16.9-16.4 16.9-28.2V128c0-11.8-6.5-22.6-16.9-28.2s-23-5-32.9 1.6l-96 64L448 174.9V192 320v5.8l-32-25.1V128c0-35.3-28.7-64-64-64H113.9L38.8 5.1zM407 416.7L32.3 121.5c-.2 2.1-.3 4.3-.3 6.5V384c0 35.3 28.7 64 64 64H352c23.4 0 43.9-12.6 55-31.3z"></path>
                  </svg>
                )}
              </li>

              <li
                className={isMicrophoneOn ? "item voice active" : "item voice "}
                onClick={() => toggleMicrophone()}
              >
                {isMicrophoneOn ? (
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
              </li>

              <a href="/">
                <li className="item closed">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19.9948 19.0476C11.9254 19.0488 15.677 24.6312 10.5403 24.633C5.58709 24.6337 3.66734 25.5612 3.66821 19.2855C3.7454 18.5765 2.44228 12.2782 19.9946 12.2758C37.5492 12.2733 36.2508 18.572 36.3278 19.281C36.328 25.5729 34.4085 24.6286 29.4553 24.6293C24.3175 24.63 28.0641 19.0465 19.9948 19.0476Z"
                      fill="white"
                    />
                  </svg>
                </li>
              </a>

              <li
                className={
                  control.screen ? "item screen active" : "item screen"
                }
                onClick={() => toggleControl("screen")}
              >
                {control.screen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3 9C3 6.79086 4.79086 5 7 5H25C27.2091 5 29 6.79086 29 9V23C29 25.2091 27.2091 27 25 27H7C4.79086 27 3 25.2091 3 23V9ZM16.1332 9.0088C16.3132 9.0328 16.488 9.10589 16.6364 9.22807L22.303 13.8947C22.7293 14.2458 22.7903 14.876 22.4392 15.3024C22.0882 15.7287 21.4579 15.7897 21.0316 15.4386L17 12.1184V21.3333C17 21.8856 16.5523 22.3333 16 22.3333C15.4477 22.3333 15 21.8856 15 21.3333V12.1195L10.9697 15.4386C10.5434 15.7897 9.91315 15.7287 9.56205 15.3024C9.21096 14.876 9.27195 14.2458 9.69828 13.8947L15.342 9.24697C15.5178 9.09318 15.748 9 16 9C15.9998 9 16.0002 9 16 9C16.0443 8.99999 16.0892 9.00293 16.1332 9.0088Z"
                    />
                  </svg>
                ) : (
                  <svg
                    stroke="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M21.79 18l2 2H24v-2h-2.21zM1.11 2.98l1.55 1.56c-.41.37-.66.89-.66 1.48V16c0 1.1.9 2 2.01 2H0v2h18.13l2.71 2.71 1.41-1.41L2.52 1.57 1.11 2.98zM4 6.02h.13l4.95 4.93C7.94 12.07 7.31 13.52 7 15c.96-1.29 2.13-2.08 3.67-2.46l3.46 3.48H4v-10zm16 0v10.19l1.3 1.3c.42-.37.7-.89.7-1.49v-10a2 2 0 00-2-2H7.8l2 2H20zm-7.07 3.13l2.79 2.78 1.28-1.2L13 7v2.13l-.07.02z"></path>
                  </svg>
                )}
              </li>

              <li
                className={control.sound ? "item sound active" : "item sound "}
                onClick={() => toggleControl("sound")}
              >
                {control.sound ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="27"
                    height="20"
                    viewBox="0 0 27 20"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.335847 10.0001C0.332127 11.6397 0.258966 13.876 1.27329 14.7119C2.21942 15.4916 2.8853 15.2907 4.61264 15.4174C6.34121 15.5454 9.98931 20.6266 12.8017 19.0194C14.2525 17.8785 14.3603 15.4868 14.3603 10.0001C14.3603 4.5135 14.2525 2.12176 12.8017 0.980903C9.98931 -0.62754 6.34121 4.4549 4.61264 4.58286C2.8853 4.70962 2.21942 4.50871 1.27329 5.28842C0.258966 6.12433 0.332127 8.36061 0.335847 10.0001Z"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M22.5421 1.05045C22.9957 0.735363 23.6189 0.847641 23.9339 1.30123C27.5717 6.53805 27.5842 13.4498 23.9336 18.6982C23.6182 19.1516 22.995 19.2635 22.5416 18.9481C22.0882 18.6327 21.9764 18.0095 22.2917 17.5562C25.4636 12.996 25.4538 6.9948 22.2914 2.44225C21.9763 1.98866 22.0886 1.36553 22.5421 1.05045Z"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19.2784 4.21795C19.7577 3.94357 20.3687 4.1097 20.6431 4.589C22.5674 7.95054 22.5682 12.0591 20.6424 15.4126C20.3674 15.8916 19.7562 16.0569 19.2773 15.7818C18.7983 15.5068 18.633 14.8956 18.9081 14.4167C20.4791 11.6808 20.4799 8.32958 18.9074 5.58262C18.633 5.10331 18.7991 4.49233 19.2784 4.21795Z"
                    />
                  </svg>
                ) : (
                  <svg
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    data-testid="VolumeMuteIcon"
                  >
                    <path d="M7 9v6h4l5 5V4l-5 5z"></path>
                  </svg>
                )}
              </li>
            </ul>
          </div>
        </Container>
      )}
    </main>
  );
};

export default CurrentCall;
