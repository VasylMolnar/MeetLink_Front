import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NotFound from "../pages/NotFound/NotFound";
import PersonalInformation from "../pages/MyAccount/PersonalInformation/PersonalInformation";
import Meetings from "../pages/Meetings/Meetings";
import CurrentMeet from "../pages/Meetings/CurrentMeet/CurrentMeet";
import Meet from "../pages/Meetings/CurrentMeet/Meet/Meet";
import Navigation from "../components/Navigation/Navigation";
import Chats from "../pages/Chats/Chats";
import CurrentChat from "../pages/Chats/CurrentChat/CurrentChat";
import Calls from "../pages/Calls/Calls";
import CurrentCall from "../pages/Calls/CurrentCall/CurrentCall";
import CreateMeet from "../pages/CreateMeet/CreateMeet";
import InfoMeet from "../pages/InfoMeet/InfoMeet";
import AccessMessage from "../pages/AccessMessage/AccessMessage";
import InfoUser from "../pages/InfoUser/InfoUser";
import MyFriends from "../pages/MyFriends/MyFriends";
import io, { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import {
  selectCurrentPublicRoomId,
  selectCurrentUserId,
} from "../features/auth/authSlice";
import { useGetMyInfoQuery } from "../features/user/userApiSlice";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

const PrivateRoute = () => {
  const navigate = useNavigate();
  const userId = useSelector(selectCurrentUserId);
  const publicRoomId = useSelector(selectCurrentPublicRoomId);

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [publicSocket, setPublicSocket] = useState<Socket<any, any> | null>(
    null
  );
  const [isRoomJoined, setIsRoomJoined] = useState(false);

  const { refetch } = useGetMyInfoQuery(userId);

  useEffect(() => {
    navigate("/");
    window.document.body.style.backgroundColor = "#e8ebef";

    return () => {
      window.document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    const newSocket = io("http://localhost:3500");
    setPublicSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!publicSocket || !userId || !publicRoomId) return;

    if (!isRoomJoined) {
      publicSocket.emit("joinPublicRoom", publicRoomId, userId);
      setIsRoomJoined(true);
    }

    publicSocket.on("reloadState", async (data: any) => {
      await refetch();

      if (data.state === "message") {
        toast.success(
          `Нове повідомлення від ${data.username} ${data.surname}.`,
          { duration: 4000 }
        );

        Cookies.set("state", "message");
      }
    });

    publicSocket.on("error", () => {
      //console.error("Socket error:", error.message);
    });

    return () => {
      publicSocket.off("joinPublicRoom");
      publicSocket.off("reloadState");
      publicSocket.off("error");
    };
  }, [publicSocket, userId, publicRoomId, isRoomJoined]);

  return (
    <div className="privateRoute">
      <Routes>
        <Route
          path="/"
          element={
            <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          }
        >
          {/* meetings */}
          <Route path="/">
            <Route index element={<Meetings isMenuOpen={isMenuOpen} />} />

            <Route path=":id">
              <Route index element={<CurrentMeet />} />
              <Route path="info-meet" element={<InfoMeet />} />
              <Route path=":id" element={<Meet />} />
            </Route>
          </Route>

          {/*CreateMeet */}
          <Route path="create-meet" element={<CreateMeet />} />

          {/*Access Message */}
          <Route path="access-message" element={<AccessMessage />} />

          {/* user info */}
          <Route path="info-user/:id" element={<InfoUser />} />

          {/* myAccount */}
          <Route path="myAccount" element={<PersonalInformation />} />

          {/* myFriends */}
          <Route path="myFriends" element={<MyFriends />} />

          {/* chats */}
          <Route path="chats">
            <Route index element={<Chats />} />
            <Route path=":id" element={<CurrentChat />} />
          </Route>

          {/* calls */}
          <Route path="calls">
            <Route index element={<Calls />} />
            <Route path=":id" element={<CurrentCall />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default PrivateRoute;
