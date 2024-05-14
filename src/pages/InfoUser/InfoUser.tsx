import "./InfoUser.scss";
import Avatar from "@mui/material/Avatar";
import {
  useGetMyInfoQuery,
  useGetUserInfoQuery,
} from "../../features/user/userApiSlice";
import { IErrorResponse, IMyInfo, IUser } from "../../types/authTypes";
import { Button, Container } from "react-bootstrap";
import defaultIMG from "../../assets/defaultIMG.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loading } from "notiflix";
import { Report } from "notiflix/build/notiflix-report-aio";
import locations from "./data/locations.json";
import {
  useDeleteFollowMutation,
  useReqAccessFollowMutation,
} from "../../features/followAccess/followAccessApiSlice";
import { selectCurrentUserId } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { useCreateMessageMutation } from "../../features/chat/chatApiSlice";

const InfoUser = () => {
  const navigate = useNavigate();
  const [messageId, setMessageId] = useState(null);
  //current user info
  const { id } = useParams();
  const { data, isSuccess, isLoading, error } = useGetUserInfoQuery(id);
  const userInfo = data as IUser;

  // my Info
  const myId = useSelector(selectCurrentUserId);
  const { data: myData } = useGetMyInfoQuery(myId);
  const myInfo = myData as IMyInfo;

  //fn Api
  const [sendReqAccessFollow] = useReqAccessFollowMutation();
  const [deleteFollow] = useDeleteFollowMutation();
  const [createMessage] = useCreateMessageMutation();

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

  useEffect(() => {
    if (
      myInfo &&
      myInfo.individualMessages?.length !== 0 &&
      myInfo.individualMessages !== undefined
    ) {
      for (const message of myInfo.individualMessages) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (message.messageInfo.userList.includes(id)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          setMessageId(message.messageInfo._id);
        }
      }
    }
  }, [id, myInfo]);

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
      //console.log(err);
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
      //console.log(err);
    } finally {
      Loading.remove();
    }
  };

  const handlerCreateMessage = async (userId: any) => {
    Loading.dots();

    try {
      const response = await createMessage({
        myId,
        userId: userId,
      });

      if ("error" in response) {
        const errorResponse = response as IErrorResponse;
        Report.warning(`Error`, errorResponse.error.data.message, "OK");
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        navigate(`/chats/${response.data.id}`);
      }
    } catch (err) {
      //console.log(err);
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

                {myId !== id &&
                  userInfo.friendsList?.includes(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    myId
                  ) && (
                    <div>
                      <Link to={`/calls/${userInfo._id}`}>
                        <Button
                          variant="outline-primary"
                          style={{
                            marginRight: "10px",
                            maxWidth: "70px",
                            width: "70px",
                          }}
                        >
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 24 24"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M16.57 22a2 2 0 0 0 1.43-.59l2.71-2.71a1 1 0 0 0 0-1.41l-4-4a1 1 0 0 0-1.41 0l-1.6 1.59a7.55 7.55 0 0 1-3-1.59 7.62 7.62 0 0 1-1.59-3l1.59-1.6a1 1 0 0 0 0-1.41l-4-4a1 1 0 0 0-1.41 0L2.59 6A2 2 0 0 0 2 7.43 15.28 15.28 0 0 0 6.3 17.7 15.28 15.28 0 0 0 16.57 22zM6 5.41 8.59 8 7.3 9.29a1 1 0 0 0-.3.91 10.12 10.12 0 0 0 2.3 4.5 10.08 10.08 0 0 0 4.5 2.3 1 1 0 0 0 .91-.27L16 15.41 18.59 18l-2 2a13.28 13.28 0 0 1-8.87-3.71A13.28 13.28 0 0 1 4 7.41zM20 11h2a8.81 8.81 0 0 0-9-9v2a6.77 6.77 0 0 1 7 7z"></path>
                            <path d="M13 8c2.1 0 3 .9 3 3h2c0-3.22-1.78-5-5-5z"></path>
                          </svg>
                        </Button>
                      </Link>

                      {messageId !== null ? (
                        <Link to={`/chats/${messageId}`}>
                          <Button
                            variant="outline-primary"
                            style={{
                              marginRight: "10px",
                              maxWidth: "70px",
                              width: "70px",
                            }}
                          >
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 24 24"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M16 2H8C4.691 2 2 4.691 2 8v13a1 1 0 0 0 1 1h13c3.309 0 6-2.691 6-6V8c0-3.309-2.691-6-6-6zm4 14c0 2.206-1.794 4-4 4H4V8c0-2.206 1.794-4 4-4h8c2.206 0 4 1.794 4 4v8z"></path>
                              <path d="M7 9h10v2H7zm0 4h7v2H7z"></path>
                            </svg>
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          variant="outline-primary"
                          style={{
                            marginRight: "10px",
                            maxWidth: "70px",
                            width: "70px",
                          }}
                          onClick={() => handlerCreateMessage(id)}
                        >
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 24 24"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M16 2H8C4.691 2 2 4.691 2 8v13a1 1 0 0 0 1 1h13c3.309 0 6-2.691 6-6V8c0-3.309-2.691-6-6-6zm4 14c0 2.206-1.794 4-4 4H4V8c0-2.206 1.794-4 4-4h8c2.206 0 4 1.794 4 4v8z"></path>
                            <path d="M7 9h10v2H7zm0 4h7v2H7z"></path>
                          </svg>
                        </Button>
                      )}
                    </div>
                  )}
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
                        {
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          //@ts-ignore
                          userInfo.friendsList?.includes(myId) ? (
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
                          )
                        }
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
