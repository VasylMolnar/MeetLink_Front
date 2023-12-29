import { Button } from "react-bootstrap";
import "./About.scss";
import video from "../../../assets/background.mp4";
import mobileVideo from "../../../assets/background1.2.mp4";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const About = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = windowWidth <= 430;

  return (
    <section className="section about">
      <div className="video_content">
        <video
          src={isMobile ? mobileVideo : video}
          className="video"
          loop
          autoPlay
          muted
        ></video>
      </div>

      <div className="tex_content">
        <h1 className="title">Віртуальні зустрічі на новому рівні</h1>

        <span className="footer_text">
          Перетворіть ваші комунікації з колегами та партнерами завдяки нашій
          передовій платформі для відеоконференцій. Зручний інтерфейс, висока
          якість зображення та безпека на першому місці.
        </span>

        <Link to="/auth-form">
          <Button className="btn">Спробуйте безкоштовно</Button>
        </Link>
      </div>
    </section>
  );
};

export default About;
