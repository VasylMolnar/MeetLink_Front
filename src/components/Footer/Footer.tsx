import "./Footer.scss";
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col xs={12} md={5}>
            <span>Ⓒ 2023 Meet Link</span>
          </Col>
          <Col xs={12} md={7}>
            <div className="footer-links pull-right">
              <a href="/" className="footer-link">
                Політика використання cookie
              </a>
              <a href="/" className="footer-link">
                Політика конфіденційності
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
