import "./AboutChat.scss";
import { Container } from "react-bootstrap";
import chat from "../../../assets/chat.png";

const AboutChat = () => {
  return (
    <section className="about_chat">
      <Container>
        <div className="about_chat_tex">
          <span className="about_chat_tex_header">Особливості</span>

          <h1 className="about_chat_tex_title">
            Можливості чату дозволяють вам ефективніше керувати своєю
            онлайн-активністю.
          </h1>

          <span className="about_chat_tex_footer">
            Використання функцій чату дозволяє вам регулювати свою присутність.
            Надавайте своєму чат-профілю більш індивідуальний вигляд завдяки
            зображенню та спеціальному повідомленню про статус.
          </span>
        </div>

        <div className="about_chat_img">
          <img src={chat} alt="chat" className="chat_img" />
        </div>
      </Container>
    </section>
  );
};

export default AboutChat;
