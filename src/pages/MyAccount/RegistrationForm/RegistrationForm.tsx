import "./RegistrationForm.scss";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import charity from "../../../assets/ charity.png";
import { Row, Col } from "react-bootstrap";
import { useRegisterUserMutation } from "../../../features/auth/authApiSlice";
import { Report } from "notiflix/build/notiflix-report-aio";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import { IErrorResponse, IUser } from "../../../types/authTypes";

const RegistrationForm = () => {
  const navigate = useNavigate();
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

  //fn Api
  const [registerUser] = useRegisterUserMutation();

  const handleRegistration = async (values: IUser) => {
    Loading.dots();

    try {
      const response = await registerUser(values);

      if ("error" in response) {
        const errorResponse = response as IErrorResponse;

        Report.failure(
          `Помилка реєстрації ${errorResponse.error.status.toString()}`,
          errorResponse.error.data.message,
          "OK"
        );
      } else {
        Report.success(
          "Реєстрація успішна.",
          "Можете увійти до свого обл. запису",
          "OK"
        );

        setTimeout(() => {
          navigate("/auth-form");
        }, 1000);
      }
    } catch (error) {
      //console.error("Помилка реєстрації:", error);
    } finally {
      Loading.remove();
    }
  };

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
              initialValues={{
                username: "",
                surname: "",
                email: "",
                password: "",
              }}
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
                handleRegistration(values);
                setSubmitting(false);
              }}
            >
              {() => (
                <Form className="form">
                  <label className="form-label">
                    Ім'я
                    <Field
                      type="text"
                      name="username"
                      className="form-control"
                      required
                    />
                    <ErrorMessage name="username" component="div" />
                  </label>

                  <label className="form-label">
                    Прізвище
                    <Field
                      type="text"
                      name="surname"
                      className="form-control"
                      required
                    />
                    <ErrorMessage name="surname" component="div" />
                  </label>

                  <label className="form-label">
                    Електрона пошта
                    <Field
                      type="email"
                      name="email"
                      className="form-control"
                      required
                    />
                    <ErrorMessage name="email" component="div" />
                  </label>

                  <label className="form-label">
                    Пароль
                    <Field
                      type="password"
                      name="password"
                      className="form-control"
                      required
                      minLength="10"
                      maxLength="20"
                      pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$"
                      title="Додайте принаймні 1 символ у верхньому регістрі, 1 символ у нижньому регістрі та 1 цифру."
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
