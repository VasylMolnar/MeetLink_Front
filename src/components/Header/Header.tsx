import { Link, NavLink } from "react-router-dom";
import "./Header.scss";
import { Button } from "primereact/button";
import { Container, Nav, Navbar } from "react-bootstrap";
import logoImg from "../../assets/logo.svg";

const Header = () => {
  const isAuth = false;

  return (
    <header className="header">
      <Navbar>
        <Container>
          <Navbar.Brand className="sniff-navbar-brand">
            <Nav.Link as={NavLink} to="/">
              <img src={logoImg} alt="Logo" height="40" width="64" />
            </Nav.Link>
          </Navbar.Brand>

          {isAuth ? (
            <Link to="/myAccount">
              <Button severity="info" outlined className="myAccount">
                Твій профіль
              </Button>
            </Link>
          ) : (
            <div className="auth-btn-list">
              <Link to="/auth-form">
                <Button severity="success" outlined className="success">
                  Увійти
                </Button>
              </Link>
              <Link to="/reg-form">
                <Button severity="warning" outlined className="warning">
                  Зареєструватись
                </Button>
              </Link>
            </div>
          )}
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
