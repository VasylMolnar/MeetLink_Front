import "./Meet.scss";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import Peer from "peerjs";
import ChatAndParticipants from "../../../../components/ChatAndParticipants/ChatAndParticipants";
import VideoMeet from "../../../../components/VideoMeet/VideoMeet";
import { selectCurrentUserId } from "../../../../features/auth/authSlice";
import { Loading } from "notiflix";
import { IUser } from "../../../../types/authTypes";
import { useGetMyInfoQuery } from "../../../../features/user/userApiSlice";

const Meet = () => {
  const { pathname } = useLocation();
  const meetId = pathname.split("/")[1];
  const conferenceId = useParams();
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

  const toggleCamera = () => {
    if (!myStream || !socket) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    myStream[userId].stream.getVideoTracks()[0].enabled = !isCameraOn;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    myStream[userId].metadata.isCameraOn = !isCameraOn;

    setIsCameraOn(!isCameraOn);
    socket.emit("toggleCamera", meetId, conferenceId.id, userId, !isCameraOn);
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

    socket.emit(
      "toggleMicrophone",
      meetId,
      conferenceId.id,
      userId,
      !isMicrophoneOn
    );
  };

  useEffect(() => {
    const newSocket = io("http://localhost:3500");
    setSocket(newSocket);

    const newPeer = new Peer(userId);
    setPeer(newPeer);

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
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
      console.log(e);
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
      socket.emit("joinConference", meetId, conferenceId.id, userId, {
        username: myInfo.username,
        surname: myInfo.surname,
        avatar: myInfo.avatar,
        isCameraOn,
        isMicrophoneOn,
      });
      setIsConferenceJoined(true);
    }

    //I listen when new user connected to conference. And send my Stream and call them
    socket.on("user connected", (peerId: any, metadataUser: any) => {
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

    socket.on("userToggleCamera", (userId: any, isCameraOn: boolean) => {
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

    socket.on("userToggleMicro", (userId: any, isMicrophoneOn: boolean) => {
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

    socket.on("userChangeMetaData", (userId: any, newMetaData: any) => {
      if (!remoteStream) return;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const userStream = remoteStream[userId];

      if (!userStream) return;

      setRemoteStream((prevUsers: any) => ({
        ...prevUsers,
        [userId]: {
          ...prevUsers[userId],
          metadata: { ...prevUsers[userId].metadata, ...newMetaData },
        },
      }));
    });

    socket.on("error", (error: any) => {
      console.error("Socket error:", error.message);
    });

    return () => {
      socket.off("user connected");
      socket.off("user disconnected");
      socket.off("joinConference");
      socket.off("userToggleCamera");
      socket.off("userToggleMicro");
      socket.off("userChangeMetaData");
      socket.off("error");
    };
  }, [socket, peer, myStream, remoteStream]);

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

  useEffect(() => {
    if (!myStream) {
      Loading.pulse();
    } else {
      Loading.remove();
    }
  }, [myStream]);

  return (
    <main className="meet-link-meet">
      {/* Component with Video */}
      {myStream && (
        <VideoMeet
          setMyStream={setMyStream}
          myStream={myStream}
          remoteStream={remoteStream}
          isCameraOn={isCameraOn}
          toggleCamera={toggleCamera}
          isMicrophoneOn={isMicrophoneOn}
          toggleMicrophone={toggleMicrophone}
          socket={socket}
          userId={userId}
          meetId={meetId}
          conferenceId={conferenceId.id}
          myInfo={myInfo}
        />
      )}

      {/*Bar with All users and Chat */}
      <ChatAndParticipants />
    </main>
  );
};

export default Meet;
