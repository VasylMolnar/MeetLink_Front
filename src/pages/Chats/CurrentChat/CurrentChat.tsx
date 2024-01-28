import "./CurrentChat.scss";
import Chat from "../../../components/Chat/Chat";
import { Container } from "react-bootstrap";
import CallActionsBar from "../../../components/CallActionsBar/CallActionsBar";

const CurrentChat = () => {
  //information about current chat
  const data = {
    name: "Elina",
    numberOfUsers: 20,
    deskription: "desk description",
    meetId: "21s.dsa231",
    chatId: "2s8afsl2k3",
  };

  return (
    <main className="meet-link-current-chat">
      <Container>
        <CallActionsBar meetName={data.name} meetId={data.meetId} />

        <Chat chatId={data.chatId} />
      </Container>
    </main>
  );
};

export default CurrentChat;

//>Individual Chat 2 perso
