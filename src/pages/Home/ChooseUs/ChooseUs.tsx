import "./ChooseUs.scss";
import { Container } from "react-bootstrap";

const ChooseUs = () => {
  return (
    <section className="section choose_us">
      <Container>
        <h1 className="choose_us_title">Чому Meet Link такий популярний</h1>

        <ul>
          <li>
            Простота використання: Наш інтуїтивно зрозумілий інтерфейс дозволяє
            кожному без зусиль приєднатися до відеоконференції.
          </li>
          <li>
            Надійність: Ми працюємо над тим, щоб Meet Link був завжди на
            зв'язку. Забудьте про технічні проблеми - ми гарантуємо
            стабільність.
          </li>

          <li>
            Безпека та конфіденційність: Ми покладаємо особливий акцент на
            захист вашої конфіденційності. Ваші дані залишаються тільки у вас.
          </li>
          <li>
            Розширені можливості: Meet Link не обмежується лише
            відеоконференціями. Ми пропонуємо широкий спектр інструментів для
            спільної роботи та ефективного взаємодії.
          </li>
        </ul>

        <p className="choose_us_footer">
          Приєднуйтеся до Meet Link сьогодні та долучайтесь до спільноти
          задоволених користувачів, які обрали найкраще рішення для своїх
          онлайн-зустрічей. Створюйте зв'язки, працюйте ефективно та залишайтеся
          на зв'язку з Meet Link!
        </p>
      </Container>
    </section>
  );
};

export default ChooseUs;
