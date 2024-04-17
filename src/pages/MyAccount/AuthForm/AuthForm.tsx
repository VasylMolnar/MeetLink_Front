import "./AuthForm.scss";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import charity from "../../../assets/ charity.png";
import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useLogInUserMutation } from "../../../features/auth/authApiSlice";
import {
  IErrorResponse,
  IUserLogin,
  ISuccessLogInResponse,
  ITokenResponse,
} from "../../../types/authTypes";
import { Report } from "notiflix/build/notiflix-report-aio";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../features/auth/authSlice";
import Cookies from "js-cookie";

const AuthForm = () => {
  const dispatch = useDispatch();
  const [saveLogInData, setSaveLogInData] = useState(false);
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
  const [logInUser] = useLogInUserMutation();

  const handleLogIn = async (values: IUserLogin) => {
    Loading.dots("Вхід у обліковий запис");

    if (saveLogInData) {
      Cookies.set("email", values.email, { expires: 7 });
      Cookies.set("password", values.password, { expires: 7 });
    }

    try {
      const response = await logInUser(values);

      if ("error" in response) {
        const errorResponse = response as IErrorResponse;

        Report.failure(
          `Помилка авторизації ${errorResponse.error.status.toString()}`,
          errorResponse.error.data.message,
          "OK"
        );
      } else {
        const successResponse = response as ISuccessLogInResponse;
        const decoded = jwtDecode(
          successResponse.data.accessToken
        ) as ITokenResponse;

        dispatch(
          setCredentials({
            ...decoded.UserInfo,
            ...successResponse.data,
          })
        );

        Report.success(`Вітаємо ${decoded.UserInfo.username}`, "", "OK");
      }
    } catch (err) {
      console.log(err);
    } finally {
      Loading.remove();
    }
  };

  return (
    <main className="meet-link-auth">
      <Row>
        {isDesktop && (
          <Col className="meet-link-auth-wrapper">
            <div className="return-home">
              <Link to="/">
                <i className="icon-arrow-left"></i>
                <span>Повернутися на головну сторінку</span>
              </Link>
            </div>

            <div className="content">
              <p className="title">Приєднайся до нас</p>
              <span>Втілимо вашу мрію в реальність</span>
              <img src={charity} alt="charity" className="charity-img" />
            </div>
          </Col>
        )}

        <Col className="meet-link-auth-form">
          {!isDesktop && (
            <div className="return-home">
              <Link to="/">
                <i className="icon-arrow-left"></i>
                <span>Повернутися на головну сторінку</span>
              </Link>
            </div>
          )}
          <div className="content">
            <h1 className="title">Приєднуйтеся сьогодні</h1>
            <Formik
              initialValues={{
                email: Cookies.get("email") || "",
                password: Cookies.get("password") || "",
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
                handleLogIn(values);
                setSubmitting(false);
              }}
            >
              {({ values }) => (
                <Form className="form">
                  <label className="form-label">
                    Електрона пошта
                    <Field
                      type="email"
                      name="email"
                      className="form-control"
                      value={values.email}
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
                      value={values.password}
                      required
                      minLength="10"
                      maxLength="20"
                    />
                    <ErrorMessage name="password" component="div" />
                  </label>

                  <label className="form-label-checkbox">
                    <input
                      className="remember-me-btn"
                      type="checkbox"
                      onClick={() => setSaveLogInData((prev) => !prev)}
                    />
                    Зберегти дані для наступного входу
                  </label>

                  <button type="submit" className="login-btn">
                    Увійти
                  </button>

                  <Link to="/reg-form">
                    <span className="register-page">
                      Немає облікового запису?
                      <span>Створити акаунт</span>
                    </span>
                  </Link>
                </Form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </main>
  );
};

export default AuthForm;
