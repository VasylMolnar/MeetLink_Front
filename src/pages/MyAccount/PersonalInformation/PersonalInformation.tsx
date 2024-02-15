import "./PersonalInformation.scss";
import Avatar from "@mui/material/Avatar";
import { Formik, Field } from "formik";
import {
  useDeleteUserMutation,
  useUpdateUserInfoMutation,
  useGetMyInfoQuery,
  useUploadImgMutation,
} from "../../../features/user/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUserId } from "../../../features/auth/authSlice";
import { IErrorResponse, IMyInfo, IUser } from "../../../types/authTypes";
import { Button, Container } from "react-bootstrap";
import { Loading } from "notiflix";
import { Report } from "notiflix/build/notiflix-report-aio";
import defaultIMG from "../../../assets/defaultIMG.png";
import locations from "./data/locations.json";

const PersonalInformation = () => {
  const dispatch = useDispatch();
  const id = useSelector(selectCurrentUserId);
  const { data, isSuccess } = useGetMyInfoQuery(id);
  const myInfo = data as IMyInfo;

  //fn Api
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserInfoMutation();
  const [imgUpload] = useUploadImgMutation();

  const changeImage = async (e: any) => {
    Loading.hourglass("Додаємо аватару");

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "Avatar");

    // for (const key of formData) {
    //   console.log(key);
    // }

    try {
      const response = await imgUpload({ formData, id });

      if ("error" in response) {
        const errorResponse = response as IErrorResponse;

        Report.failure(
          `Помилка оновлення ${errorResponse.error.status.toString()}`,
          errorResponse.error.data.message,
          "OK"
        );
      } else {
        Report.success(`Успішно оновлено`, "", "OK");
      }
    } catch (err) {
      console.log(err);
    } finally {
      Loading.remove();
    }
  };

  const handleChangeUser = async (values: IUser) => {
    Loading.dots("Оновлення  обл. запису");

    const confirm = window.confirm("Підтвердити оновлення.");

    if (confirm) {
      try {
        const response = await updateUser({ id, ...values });

        if ("error" in response) {
          const errorResponse = response as IErrorResponse;

          Report.failure(
            `Помилка оновлення ${errorResponse.error.status.toString()}`,
            errorResponse.error.data.message,
            "OK"
          );
        } else {
          Report.success(`Успішно оновлення`, "", "OK");
        }
      } catch (err) {
        console.log(err);
      } finally {
        Loading.remove();
      }
    } else {
      Loading.remove();
      Report.info("Оновлення скасовано", "", "OK");
    }
  };

  const handleDeleteUser = async () => {
    Loading.dots("Видалення обл. запису");

    const confirm = window.confirm("Підтвердити видалення.");

    if (confirm) {
      try {
        const response = await deleteUser(id);

        if ("error" in response) {
          const errorResponse = response as IErrorResponse;

          Report.failure(
            `Помилка видалення ${errorResponse.error.status.toString()}`,
            errorResponse.error.data.message,
            "OK"
          );
        } else {
          dispatch(logOut());
          Report.success(`Успішно видаленно`, "", "OK");
        }
      } catch (err) {
        console.log(err);
      } finally {
        Loading.remove();
      }
    } else {
      Loading.remove();
      Report.info("Видалення скасовано", "", "OK");
    }
  };

  return (
    <main className="section userPage">
      <Container>
        {isSuccess && (
          <div className="container">
            <div className="user_content">
              <div className="user">
                <Avatar
                  className="img"
                  // src={myInfo.avatar || require("../../../assets/404.jpg")}
                  // src={myInfo.avatar || defaultIMG}
                  src={
                    typeof myInfo.avatar === "string"
                      ? myInfo.avatar
                      : defaultIMG
                  }
                  sx={{ width: 200, height: 200 }}
                />

                <p
                  style={{
                    marginTop: "30px",
                    marginBottom: "30px",
                  }}
                >
                  {myInfo.username + " " + myInfo.surname}
                </p>

                <input
                  className="custom-file-input"
                  type="file"
                  name="image"
                  style={{ marginBottom: "10px" }}
                  onChange={(e) => changeImage(e)}
                />
              </div>

              <div className="userEdit">
                <Formik
                  initialValues={{
                    username: myInfo.username,
                    surname: myInfo.surname,
                    email: myInfo.email,
                    phoneNumber: myInfo.phoneNumber || "",
                    region: myInfo.region || "",
                    city: myInfo.city || "",
                    password: "",
                  }}
                  onSubmit={handleChangeUser}
                >
                  {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="form">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h3 className="title">Твій профіль</h3>

                        <div>
                          <Button
                            className="btn btn-danger"
                            onClick={handleDeleteUser}
                          >
                            Видалити
                          </Button>
                        </div>
                      </div>

                      <label className="form-label">
                        Ім'я
                        <Field
                          type="text"
                          name="username"
                          className="form-control"
                          required
                        />
                      </label>

                      <label className="form-label">
                        Прізвище
                        <Field
                          type="text"
                          name="surname"
                          className="form-control"
                          required
                        />
                      </label>

                      <label className="form-label">
                        Електрона пошта
                        <Field
                          type="email"
                          name="email"
                          className="form-control"
                          required
                        />
                      </label>

                      <label className="form-label">
                        Пароль
                        <Field
                          type="password"
                          name="password"
                          className="form-control"
                          placeholder="********************"
                          minLength="10"
                          maxLength="20"
                          pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$"
                          title="Додайте принаймні 1 символ у верхньому регістрі, 1 символ у нижньому регістрі та 1 цифру."
                        />
                      </label>

                      <label className="form-label">
                        Номер телефону
                        <Field
                          type="number"
                          name="phoneNumber"
                          className="form-control"
                        />
                      </label>

                      <label className="form-label">
                        Область
                        <Field
                          as="select"
                          name="region"
                          className="form-control"
                        >
                          <option value="">Виберіть область</option>

                          {locations.regions.map((region, index) => (
                            <option key={index} value={region.value}>
                              {region.label}
                            </option>
                          ))}
                        </Field>
                      </label>

                      <label className="form-label">
                        Місто
                        <Field as="select" name="city" className="form-control">
                          <option value="">Виберіть місто</option>

                          {locations.cities.map((city, index) => (
                            <option key={index} value={city.value}>
                              {city.label}
                            </option>
                          ))}
                        </Field>
                      </label>

                      <button
                        className="btn btn-outline-primary"
                        type="submit"
                        style={{ width: "100%" }}
                      >
                        Змінити
                      </button>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
};

export default PersonalInformation;
