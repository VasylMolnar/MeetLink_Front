import "./AboutChat.scss";
import { Container } from "react-bootstrap";
import chatVideo from "../../../assets/chatVideo2.mp4";

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

        <div className="about_chat_video_content">
          <video
            src={chatVideo}
            className="chatVideo"
            loop
            autoPlay
            muted
          ></video>
        </div>
      </Container>
    </section>
  );
};

export default AboutChat;
