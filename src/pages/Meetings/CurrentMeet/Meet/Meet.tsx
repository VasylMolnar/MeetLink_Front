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

const Meet = () => {
  const { pathname } = useLocation();
  const meetId = pathname.split("/")[1];
  const conferenceId = useParams();
  const userId = useSelector(selectCurrentUserId);

  const [socket, setSocket] = useState<Socket<any, any> | null>(null);
  const [isConferenceJoined, setIsConferenceJoined] = useState(false);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  const toggleCamera = () => {
    if (!myStream) return;
    myStream.getVideoTracks()[0].enabled = !isCameraOn;
    setIsCameraOn(!isCameraOn);
  };

  const toggleMicrophone = () => {
    if (!myStream) return;
    myStream.getAudioTracks()[0].enabled = !isMicrophoneOn;
    setIsMicrophoneOn(!isMicrophoneOn);
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
          setMyStream(stream);
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
    if (!socket || !peer || !myStream) return;

    if (!isConferenceJoined) {
      socket.emit("joinConference", meetId, conferenceId.id, userId);
      setIsConferenceJoined(true);
    }

    //I listen when new user connected to conference. And send my Stream and call them
    socket.on("user connected", (peerId: any) => {
      const call = peer.call(peerId, myStream);

      call.on("stream", (remoteStream) => {
        setRemoteStream((prevUsers: any) => ({
          ...prevUsers,
          [peerId]: remoteStream,
        }));
      });
    });

    //I listen call to me
    peer.on("call", (call) => {
      call.answer(myStream);

      //I listen answer from user
      call.on("stream", (remoteStream) => {
        const peerId = call.peer;

        setRemoteStream((prevUsers: any) => ({
          ...prevUsers,
          [peerId]: remoteStream,
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

    socket.on("error", (error: any) => {
      console.error("Socket error:", error.message);
    });

    return () => {
      socket.off("user connected");
      socket.off("user disconnected");
      socket.off("joinConference");
      socket.off("error");
    };
  }, [socket, peer, myStream]);

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
          myStream={myStream}
          remoteStream={remoteStream}
          toggleCamera={toggleCamera}
          toggleMicrophone={toggleMicrophone}
        />
      )}

      {/*Bar with All users and Chat */}
      <ChatAndParticipants />
    </main>
  );
};

export default Meet;
