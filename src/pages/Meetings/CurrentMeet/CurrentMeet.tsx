import "./CurrentMeet.scss";
import Chat from "./Chat/Chat";
import { Container } from "react-bootstrap";
import CallActionsBar from "../../../components/CallActionsBar/CallActionsBar";

const CurrentMeet = () => {
  //information about current meet
  const data = {
    name: "test meet name",
    numberOfUsers: 20,
    deskription: "desk description",
    meetId: "21s.dsa231",
    chatId: "2s8afsl2k3",
  };

  return (
    <main className="meet-link-current-meet">
      <Container>
        <CallActionsBar meetName={data.name} meetId={data.meetId} />

        <Chat chatId={data.chatId} />
      </Container>
    </main>
  );
};

export default CurrentMeet;

// in top must be a navigation with 2 buttons Call(if clicked link to
//   Meet.tsx) and settings
