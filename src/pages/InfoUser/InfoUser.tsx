import "./InfoUser.scss";
import Avatar from "@mui/material/Avatar";
import { useGetUserInfoQuery } from "../../features/user/userApiSlice";
import { IErrorResponse, IUser } from "../../types/authTypes";
import { Button, Container } from "react-bootstrap";
import defaultIMG from "../../assets/defaultIMG.png";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Loading } from "notiflix";
import { Report } from "notiflix/build/notiflix-report-aio";
import locations from "./data/locations.json";
import {
  useDeleteFollowMutation,
  useReqAccessFollowMutation,
} from "../../features/followAccess/followAccessApiSlice";
import { selectCurrentUserId } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";

const InfoUser = () => {
  //current user info
  const { id } = useParams();
  const { data, isSuccess, isLoading, error } = useGetUserInfoQuery(id);
  const userInfo = data as IUser;

  // my Info
  const myId = useSelector(selectCurrentUserId);

  //fn Api
  const [sendReqAccessFollow] = useReqAccessFollowMutation();
  const [deleteFollow] = useDeleteFollowMutation();

  useEffect(() => {
    if (!isSuccess && isLoading) {
      Loading.hourglass();
    } else {
      Loading.remove();
    }

    if (error) {
      Report.failure(`${error}`, "", "OK");
    }
  }, [error, isLoading, isSuccess]);

  const handleFollowUser = async (followUserId: any) => {
    Loading.hourglass("Надсилаємо запит");

    try {
      const response = await sendReqAccessFollow({
        followUserId,
        userId: myId,
      });

      if ("error" in response) {
        const errorResponse = response as IErrorResponse;

        Report.warning(
          `Помилка надсилання запиту`,
          errorResponse.error.data.message,
          "OK"
        );
      } else {
        Report.success(
          `Запит успішно надіслано `,
          "Користувач з'явиться після того як він підтвердить запит!",
          "OK"
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      Loading.remove();
    }
  };

  const handleDeleteFollow = async (followUserId: any) => {
    Loading.hourglass("Працюємо над цим");

    try {
      const response = await deleteFollow({
        followUserId,
        userId: myId,
      });

      if ("error" in response) {
        const errorResponse = response as IErrorResponse;

        Report.warning(
          `Помилка видалення`,
          errorResponse.error.data.message,
          "OK"
        );
      } else {
        Report.success(`Успішно видалено `, "", "OK");
      }
    } catch (err) {
      console.log(err);
    } finally {
      Loading.remove();
    }
  };

  return (
    <main className="section userPage">
      <Container>
        {isSuccess && userInfo && (
          <div className="container">
            <div className="user_content">
              <div className="user">
                <Avatar
                  className="img"
                  src={
                    typeof userInfo.avatar === "string"
                      ? userInfo.avatar
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
                  {userInfo.username + " " + userInfo.surname}
                </p>
              </div>
              <div className="userEdit">
                <div className="form">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <h3 className="title">Профіль</h3>

                    {myId !== id && (
                      <div>
                        {userInfo.friendsList?.some((friend) => {
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          //@ts-ignore
                          return friend.userId === myId;
                        }) ? (
                          <Button
                            variant="outline-danger"
                            onClick={() => handleDeleteFollow(userInfo._id)}
                          >
                            Не стежити
                          </Button>
                        ) : (
                          <Button
                            variant="outline-success"
                            onClick={() => handleFollowUser(userInfo._id)}
                          >
                            Стежити
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="form-label">
                    <p style={{ marginBottom: 0 }}> Ім'я</p>
                    <p
                      className="form-control"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {userInfo.username}
                    </p>
                  </div>

                  <div className="form-label">
                    <p style={{ marginBottom: 0 }}>Прізвище</p>
                    <p
                      className="form-control"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {userInfo.surname}
                    </p>
                  </div>

                  <div className="form-label">
                    <p style={{ marginBottom: 0 }}> Електрона пошта</p>
                    <p
                      className="form-control"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {userInfo.email}
                    </p>
                  </div>

                  <div className="form-label">
                    <p style={{ marginBottom: 0 }}> Номер телефону</p>
                    <p
                      className="form-control"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {userInfo.phoneNumber}
                    </p>
                  </div>

                  <div className="form-label">
                    <p style={{ marginBottom: 0 }}> Область</p>
                    <p
                      className="form-control"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {
                        locations.regions.find(
                          (item) => item.value === userInfo.region
                        )?.label
                      }
                    </p>
                  </div>

                  <div className="form-label">
                    <p style={{ marginBottom: 0 }}>Місто</p>
                    <p
                      className="form-control"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {
                        locations.cities.find(
                          (item) => item.value === userInfo.city
                        )?.label
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
};

export default InfoUser;
