import { Button } from "react-bootstrap";
import "./About.scss";
import video from "../../../assets/background.mp4";

const About = () => {
  return (
    <section className="section about">
      <div className="video_content">
        <video src={video} className="video" loop autoPlay muted></video>
      </div>

      <div className="tex_content">
        <h1 className="title">Віртуальні зустрічі на новому рівні</h1>

        <span className="footer_text">
          Перетворіть ваші комунікації з колегами та партнерами завдяки нашій
          передовій платформі для відеоконференцій. Зручний інтерфейс, висока
          якість зображення та безпека на першому місці.
        </span>

        <Button className="btn">Спробуйте безкоштовно</Button>
      </div>
    </section>
  );
};

export default About;
