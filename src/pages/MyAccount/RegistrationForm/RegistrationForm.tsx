import "./RegistrationForm.scss";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import charity from "../../../assets/ charity.png";
import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

const RegistrationForm = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 854); //1135

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 854);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main className="meet-link-registration">
      <Row>
        <Col className="meet-link-registration-form">
          <div className="return-home">
            <Link to="/">
              <i className="icon-arrow-left"></i>
              <span>Повернутися на головну сторінку</span>
            </Link>
          </div>

          <div className="content">
            <h1 className="title">Створити аккаунт</h1>
            <Formik
              initialValues={{ email: "", password: "" }}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  // @ts-expect-error: Unreachable code error
                  errors.email = "Введіть електронну пошту";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  // @ts-expect-error: Unreachable code error
                  errors.email = "Невірна адреса електронної пошти";
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2));
                  setSubmitting(false);
                }, 400);
              }}
            >
              {() => (
                <Form className="form">
                  <label className="form-label">
                    Ім'я
                    <Field type="text" name="name" className="form-control" />
                    <ErrorMessage name="name" component="div" />
                  </label>

                  <label className="form-label">
                    Прізвище
                    <Field
                      type="text"
                      name="surname"
                      className="form-control"
                    />
                    <ErrorMessage name="surname" component="div" />
                  </label>

                  <label className="form-label">
                    Електрона пошта
                    <Field type="email" name="email" className="form-control" />
                    <ErrorMessage name="email" component="div" />
                  </label>

                  <label className="form-label">
                    Пароль
                    <Field
                      type="password"
                      name="password"
                      className="form-control"
                    />
                    <ErrorMessage name="password" component="div" />
                  </label>

                  <button type="submit" className="login-btn">
                    Реєстрація
                  </button>

                  <Link to="/auth-form">
                    <span className="register-page">
                      Вже маєте обліковий запис?
                      <span>Увійти</span>
                    </span>
                  </Link>
                </Form>
              )}
            </Formik>
          </div>
        </Col>

        {isDesktop && (
          <Col className="meet-link-registration-wrapper">
            <div className="content">
              <p className="title">Приєднайся до нас</p>
              <span>Втілимо вашу мрію в реальність</span>
              <img src={charity} alt="charity" className="charity-img" />
            </div>
          </Col>
        )}
      </Row>
    </main>
  );
};

export default RegistrationForm;
