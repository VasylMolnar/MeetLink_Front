import "./RegistrationForm.scss";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import charity from "../../../assets/ charity.png";
import { Row, Col } from "react-bootstrap";
import { useRegisterMutation } from "../../../features/auth/authApiSlice";
import { Report } from "notiflix/build/notiflix-report-aio";
import { Loading } from "notiflix/build/notiflix-loading-aio";

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

  //fn Api
  const [register] = useRegisterMutation();

  const handleRegistration = async (values: any) => {
    Loading.dots();

    try {
      const response = await register(values);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      if (response.error) {
        Report.failure(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          `Помилка реєстрації ${response.error.status.toString()}`,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          response.error.data.message,
          "OK"
        );
      } else {
        Report.success("Користувача успішно додано", "", "");
      }
    } catch (error) {
      console.error("Помилка реєстрації:", error);
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
