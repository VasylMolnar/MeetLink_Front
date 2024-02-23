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

const PrivateRoute = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  useEffect(() => {
    navigate("/");
    window.document.body.style.backgroundColor = "#e8ebef";

    return () => {
      window.document.body.style.backgroundColor = "";
    };
  }, []);

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

            {/*CreateMeet */}
            <Route path="create-meet" element={<CreateMeet />} />

            {/*Access Message */}
            <Route path="access-message" element={<AccessMessage />} />

            <Route path=":id">
              <Route index element={<CurrentMeet />} />
              <Route path="info-meet" element={<InfoMeet />} />
              <Route path=":id" element={<Meet />} />
            </Route>
          </Route>

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

          {/* user info */}
          <Route path="info-user/:id" element={<InfoUser />} />

          {/* myAccount */}
          <Route path="myAccount" element={<PersonalInformation />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default PrivateRoute;
