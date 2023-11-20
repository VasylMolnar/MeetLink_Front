import "./AboutChat.scss";
import { Container } from "react-bootstrap";
import chatVideo from "../../../assets/chatVideo.mp4";
import { useEffect, useRef, useState } from "react";

const AboutChat = () => {
  const [isVisible, setIsVisible] = useState(false);
  const aboutChatRef = useRef(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (aboutChatRef.current) {
      observer.observe(aboutChatRef.current);
    }

    return () => {
      if (aboutChatRef.current) {
        observer.unobserve(aboutChatRef.current);
      }
    };
  }, []);

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

        <div
          ref={aboutChatRef}
          className={`about_chat_video_content ${
            isVisible ? "animate__animated animate__zoomInRight" : "hidden"
          }`}
        >
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
//animate__backInRight
