import { Container } from "react-bootstrap";
import "./AboutVideo.scss";
import meetings1 from "../../../assets/meetings1.jpg";
import meetings2 from "../../../assets/meetings2.jpg";
import small_meetings1 from "../../../assets/small_meetings1.png";
import small_meetings2 from "../../../assets/small_meetings2.png";
import frame from "../../../assets/Frame.png";
import vector from "../../../assets/Vector.png";
import { useEffect, useRef, useState } from "react";

const AboutVideo = () => {
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
    <section className="section about_video">
      <Container>
        <div className="first_block_content">
          <div className="wrapper_content">
            <div className="background">
              <div className="img_content">
                <img src={meetings2} alt="img1" className="large_meetings" />
                <img
                  src={small_meetings1}
                  alt="small_meetings1"
                  className="small_meetings"
                />
                <img src={frame} alt="frame" className="frame" />
              </div>
            </div>
          </div>

          <div
            ref={aboutChatRef}
            className={`tex_content ${
              isVisible ? "animate__animated animate__backInRight" : "hidden"
            }`}
          >
            <span className="tex_content_header">
              Безкоштовні відеозустрічі
            </span>
            <h1 className="tex_content_title">
              Спілкуйтеся з будь-ким в інтернеті
            </h1>
            <span className="tex_content_footer">
              Використовуйте відео, щоб установити зв'язок з потенційними
              клієнтами в Інтернеті та проводити привабливі відеодзвінки для
              спілкування з будь-якою аудиторією, незалежно від їхнього місця,
              просто переходячи за посиланням.
            </span>
          </div>
        </div>

        <img src={vector} alt="vector" className="vector" />

        <div className="second_block_content">
          <div
            className={`tex_content ${
              isVisible ? "animate__animated animate__backInLeft" : "hidden"
            }`}
          >
            <span className="tex_content_header">Особливості</span>
            <h1 className="tex_content_title">Обговорюйте ідеї</h1>
            <span className="tex_content_footer">
              Посилюйте спілкування з клієнтами, використовуючи відео, та
              створюйте інтерактивні онлайн-семінари, взаємодіючи з учасниками
              через зручні відеодзвінки, активуючи просте посилання для
              підключення.
            </span>
          </div>

          <div className="wrapper_content">
            <div className="background">
              <div className="img_content">
                <img src={meetings1} alt="img1" className="large_meetings" />
                <img
                  src={small_meetings2}
                  alt="small_meetings2"
                  className="small_meetings"
                />
                <img src={frame} alt="frame" className="frame" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutVideo;
