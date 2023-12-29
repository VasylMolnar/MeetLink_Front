import { Container } from "react-bootstrap";
import "./AboutVideo.scss";
import meetings1 from "../../../assets/meetings1.jpg";
import meetings2 from "../../../assets/meetings2.jpg";
import small_meetings1 from "../../../assets/small_meetings1.png";
import small_meetings2 from "../../../assets/small_meetings2.png";
import frame from "../../../assets/Frame.png";
import vector from "../../../assets/Vector.png";

const AboutVideo = () => {
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

          <div className="tex_content">
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
          <div className="tex_content">
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
