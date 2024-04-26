import "./InfoMeet.scss";
import Avatar from "@mui/material/Avatar";
import { Formik, Field } from "formik";
import {
  useGetCurrentMeetQuery,
  useUpdateMeetInfoMutation,
  useDeleteMeetMutation,
  useLeaveMeetMutation,
  useUploadMeetImgMutation,
} from "../../features/meet/meetApiSlice";
import { IErrorResponse, IMeetInfo } from "../../types/authTypes";
import { Button, Container } from "react-bootstrap";
import { Loading } from "notiflix";
import { Report } from "notiflix/build/notiflix-report-aio";
import defaultIMG from "../../assets/defaultIMG.png";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../features/auth/authSlice";
import UserList from "../../components/UserList/UserList";
import Attendees from "../../components/Attendees/Attendees";

const InfoMeet = () => {
  const navigate = useNavigate();
  const userId = useSelector(selectCurrentUserId);
  const { id } = useParams();

  const { data, isSuccess, isLoading, error } = useGetCurrentMeetQuery(
    id === "auth-form" ? "" : id
  );
  const meetInfo = data as IMeetInfo;

  useEffect(() => {
    if (!isSuccess && isLoading) {
      Loading.hourglass();
    } else {
      Loading.remove();
    }

    if (error) {
      Report.failure(`${error}`, "", "OK");
    }
  }, [isLoading, isSuccess, error]);

  //fn Api
  const [leaveMeet] = useLeaveMeetMutation();
  const [deleteMeet] = useDeleteMeetMutation();
  const [updateMeet] = useUpdateMeetInfoMutation();
  const [imgUpload] = useUploadMeetImgMutation();

  const changeImage = async (e: any) => {
    Loading.hourglass("Додаємо нову аватарку");

    const file = e.target.files[0];
    const fileSize = file.size / 1024;

    if (fileSize > 300) {
      Report.failure("Помилка", "Фото повинно бути менше 300 КБ", "OK");
      Loading.remove();
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "Avatar");

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

  const handlerChangeMeet = async (values: IMeetInfo) => {
    Loading.dots("Оновлення");

    const confirm = window.confirm("Підтвердити оновлення.");

    if (confirm) {
      try {
        const response = await updateMeet({ id, ...values });

        if ("error" in response) {
          const errorResponse = response as IErrorResponse;

          Report.failure(
            `Помилка оновлення ${errorResponse.error.status.toString()}`,
            errorResponse.error.data.message,
            "OK"
          );
        } else {
          Report.success(`Успішне оновлення`, "", "OK");
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

  const handlerDeleteMeet = async () => {
    const confirm = window.confirm(
      "Ви дійсно бажаєте видалити дану зустріч ?\nВидалення призведе до повного видалення зустрічі у вас а також у користувачів які доданні до зустрічі"
    );

    if (confirm) {
      Loading.hourglass("Видаляємо зустріч");

      try {
        const response = await deleteMeet(id);

        if ("error" in response) {
          const errorResponse = response as IErrorResponse;

          Report.warning(
            `Помилка видалення`,
            errorResponse.error.data.message,
            "OK"
          );
        } else {
          Report.success(`Успішно видалено`, "", "OK");
          navigate("/");
        }
      } catch (err) {
        console.log(err);
      } finally {
        Loading.remove();
      }
    } else {
      Loading.remove();
      Report.info("Cкасовано", "", "OK");
    }
  };

  const handlerLeaveMeet = async (userId: any) => {
    const confirm = window.confirm("Ви дійсно бажаєте покинути дану зустріч ?");

    if (confirm) {
      Loading.hourglass("Виходимо із зустріч");

      try {
        const response = await leaveMeet({ meetId: id, userId });

        if ("error" in response) {
          const errorResponse = response as IErrorResponse;

          Report.warning(
            `Ви не можете залишити цю зустріч`,
            errorResponse.error.data.message,
            "OK"
          );
        } else {
          Report.success(`Зустріч успішно покинуто`, "", "OK");
          navigate("/");
        }
      } catch (err) {
        console.log(err);
      } finally {
        Loading.remove();
      }
    } else {
      Loading.remove();
      Report.info("Cкасовано", "", "OK");
    }
  };

  return (
    <main className="section infoMeet">
      <Container>
        {isSuccess && (
          <div className="container">
            <div className="infoMeet_content">
              <div className="infoMeet">
                <Avatar
                  className="img"
                  src={
                    typeof meetInfo.img === "string" ? meetInfo.img : defaultIMG
                  }
                  sx={{ width: 200, height: 200 }}
                />

                <p
                  style={{
                    marginTop: "30px",
                    marginBottom: "30px",
                  }}
                >
                  {meetInfo.meetName}
                </p>

                {userId === meetInfo.adminID && (
                  <input
                    className="custom-file-input"
                    type="file"
                    name="image"
                    style={{ marginBottom: "10px" }}
                    onChange={(e) => changeImage(e)}
                  />
                )}
              </div>

              <div className="infoMeetEdit">
                <Formik
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  initialValues={{
                    meetName: meetInfo.meetName,
                    description: meetInfo.description,
                    date: meetInfo.date,
                    time: meetInfo.time,
                  }}
                  onSubmit={handlerChangeMeet}
                >
                  {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="form">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h3 className="title">{meetInfo.meetName}</h3>

                        {userId === meetInfo.adminID ? (
                          <div>
                            <Button
                              className="btn btn-danger"
                              onClick={handlerDeleteMeet}
                            >
                              Видалити
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Button
                              className="btn btn-warning"
                              onClick={() => handlerLeaveMeet(userId)}
                            >
                              Покинути зустріч
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="form-label">
                        <p style={{ marginBottom: 0 }}>
                          Ідентифікатор зустрічі
                        </p>
                        <p
                          className="form-control"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          {meetInfo._id}
                        </p>
                      </div>

                      <label className="form-label">
                        Назва зустрічі
                        <Field
                          type="text"
                          name="meetName"
                          className="form-control"
                          required
                          maxLength="15"
                          disabled={userId === meetInfo.adminID ? false : true}
                        />
                      </label>

                      <label className="form-label">
                        Короткий опис
                        <Field
                          type="textarea"
                          name="description"
                          className="form-control textarea"
                          required
                          maxLength="30"
                          disabled={userId === meetInfo.adminID ? false : true}
                        />
                      </label>

                      <label className="form-label">
                        День проведення зустріч
                        <Field
                          type="date"
                          name="date"
                          className="form-control"
                          disabled={userId === meetInfo.adminID ? false : true}
                        />
                        <Field
                          as="select"
                          type="date"
                          name="date"
                          className="form-control"
                          disabled={userId === meetInfo.adminID ? false : true}
                        >
                          <option value="">
                            Оберіть день для щотижневої зустрічі
                          </option>
                          <option value="Щодня">Щодня</option>
                          <option value="Понеділок">Понеділок</option>
                          <option value="Вівторок">Вівторок</option>
                          <option value="Середа">Середа</option>
                          <option value="Четвер">Четвер</option>
                          <option value="П'ятниця">П'ятниця</option>
                          <option value="Субота">Субота</option>
                          <option value="Неділя">Неділя</option>
                        </Field>
                      </label>

                      <label className="form-label">
                        Час проведення зустріч
                        <Field
                          type="time"
                          name="time"
                          className="form-control"
                          required
                          disabled={userId === meetInfo.adminID ? false : true}
                        />
                      </label>

                      {userId === meetInfo.adminID && (
                        <button
                          className="btn btn-outline-primary"
                          type="submit"
                          style={{ width: "100%" }}
                        >
                          Змінити
                        </button>
                      )}
                    </form>
                  )}
                </Formik>
              </div>
            </div>

            <div className="infoMeet-userList">
              <h3 className="title">Список учасників</h3>

              <UserList
                userList={meetInfo.userList}
                adminId={meetInfo.adminID}
                handlerDeleteUser={handlerLeaveMeet}
              />
            </div>

            <div className="infoMeet-userList">
              <h3 className="title">Список активності</h3>

              <Attendees attendees={meetInfo.attendees} />
            </div>
          </div>
        )}
      </Container>
    </main>
  );
};

export default InfoMeet;
