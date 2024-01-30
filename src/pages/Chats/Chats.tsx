import "./Chats.scss";
import { Container } from "react-bootstrap";
import ChatCard from "../../components/ChatCard/ChatCard";

const Chats = () => {
  {
    /*fetch all chats*/
  }
  const data = [
    {
      id: "1",
      name: "Sniff",
      logo: "",
      lastMessage: "ok",
    },
    {
      id: "2",
      name: "Фізика",
      logo: "",
      lastMessage: "by",
    },
    {
      id: "3",
      name: "Математика",
      logo: "",
      lastMessage: "ok see you later",
    },
    {
      id: "4",
      name: "meet name",
      logo: "",
      lastMessage: "ok see you later",
    },
    {
      id: "5",
      name: "meet name",
      logo: "",
      lastMessage: "ok see you later",
    },
    {
      id: "6",
      name: "meet name",
      logo: "",
      lastMessage: "ok see you later",
    },
    {
      id: "7",
      name: "meet name",
      logo: "",
      lastMessage: "ok see you later",
    },
    {
      id: "8",
      name: "meet name",
      logo: "",
      lastMessage: "ok see you later",
    },
    {
      id: "9",
      name: "meet name",
      logo: "",
      lastMessage: "Hello",
    },
    {
      id: "10",
      name: "meet name",
      logo: "",
      lastMessage: "ok see you later",
    },
  ];

  return (
    <main className="meet-link-chats">
      <Container>
        <input
          className="message-finder"
          type="text"
          placeholder="Введіть ім'я або прізвище:"
        />
        <div className="chats">
          {data.map((item) => (
            <ChatCard item={item} key={item.id} />
          ))}
        </div>
      </Container>
    </main>
  );
};

export default Chats;
