import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound/NotFound";
import PersonalInformation from "../pages/MyAccount/PersonalInformation/PersonalInformation";
import Meetings from "../pages/Meetings/Meetings";
import CurrentMeet from "../pages/Meetings/CurrentMeet/CurrentMeet";
import Meet from "../pages/Meetings/CurrentMeet/Meet/Meet";
import Chats from "../pages/Chats/Chats";
import CurrentChat from "../pages/Chats/CurrentChat/CurrentChat";
import Calls from "../pages/Calls/Calls";
import CurrentCall from "../pages/Calls/CurrentCall/CurrentCall";

const PrivateRoute = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Meetings />}>
          <Route path=":id" element={<CurrentMeet />}>
            <Route path=":id" element={<Meet />} />
          </Route>
        </Route>

        <Route path="/chats" element={<Chats />}>
          <Route path=":id" element={<CurrentChat />}></Route>
        </Route>

        <Route path="/calls" element={<Calls />}>
          <Route path=":id" element={<CurrentCall />}></Route>
        </Route>

        <Route path="/myAccount" element={<PersonalInformation />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default PrivateRoute;
