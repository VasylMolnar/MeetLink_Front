import "./JointWork.scss";
import { Container } from "react-bootstrap";
import work from "../../../assets/work2.png";

const JointWork = () => {
  return (
    <section className="joint-work">
      <Container>
        <div className="joint-work_img">
          <img src={work} alt="chat" className="chat_img" />
        </div>

        <div className="joint-work_tex">
          <h1 className="joint-work_tex_title">Спільна робота</h1>

          <span className="joint-work_tex_footer">
            Запрошуйте людей зі схожими інтересами до вашої спільноти, де ви
            зможете вільно ділитися ідеями, висловлювати думки та розробляти
            плани разом. Разом з вашими однодумцями ви зможете створити
            продуктивне середовище для обговорень і спільної роботи.
          </span>
        </div>
      </Container>
    </section>
  );
};

export default JointWork;

//Створюйте спільноти з користувачами-однодумцями, щоб обмінюватись
//ідеями та будувати плани.
