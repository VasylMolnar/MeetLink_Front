import "./MyFriends.scss";
import { useEffect, useState } from "react";
import { useGetMyInfoQuery } from "../../features/user/userApiSlice";
import {
  logOut,
  selectCurrentToken,
  selectCurrentUserId,
  setCredentials,
} from "../../features/auth/authSlice";
import {
  IErrorResponse,
  IMyInfo,
  ISuccessLogInResponse,
  IUser,
} from "../../types/authTypes";
import { Loading } from "notiflix";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container } from "react-bootstrap";
import defaultIMG from "../../assets/defaultIMG.png";
import { uint8ArrayToBase64 } from "../../utils/uint8ArrayToBase64";
import { Link } from "react-router-dom";
import { useDeleteFollowMutation } from "../../features/followAccess/followAccessApiSlice";
import { Report } from "notiflix/build/notiflix-report-aio";
import axios from "axios";

const MyFriends = () => {
  const dispatch = useDispatch();
  const currentToken = useSelector(selectCurrentToken);
  const [searchValue, setSearchValue] = useState("");
  const [userList, setUserList] = useState([]);

  const id = useSelector(selectCurrentUserId);
  const { data, isSuccess, isLoading } = useGetMyInfoQuery(id);
  const myInfo = data as IMyInfo;

  //fn Api
  const [deleteFollow] = useDeleteFollowMutation();

  useEffect(() => {
    if (!isSuccess && isLoading) {
      Loading.dots("Завантаження");
    } else {
      Loading.remove();
    }
  }, [isLoading, isSuccess]);

  const finder = async (e: any) => {
    e.preventDefault();
    Loading.dots();

    try {
      const response = await axios.get(
        `http://localhost:3500/user/list/${searchValue ? searchValue : "NULL"}`,
        {
          headers: {
            authorization: `Bearer ${currentToken}`,
          },
          withCredentials: true,
        }
      );

      setUserList(response.data);
    } catch (err: any) {
      console.log(err);

      if (err.response.status === 403) {
        const refreshToken = await axios.get("http://localhost:3500/refresh", {
          withCredentials: true,
        });

        if (refreshToken?.data) {
          const successResponse = refreshToken as ISuccessLogInResponse;
          dispatch(setCredentials({ ...successResponse.data }));

          // const response = await axios.get(
          //   `http://localhost:3500/user/list/${
          //     searchValue ? searchValue : "NULL"
          //   }`,
          //   {
          //     headers: {
          //       authorization: `Bearer ${currentToken}`,
          //     },
          //     withCredentials: true,
          //   }
          // );

          // setUserList(response.data);
        } else {
          dispatch(logOut());
        }
      }
    } finally {
      Loading.remove();
    }
  };

  const handleDeleteFollow = async (followUserId: any) => {
    Loading.hourglass("Працюємо над цим");

    try {
      const response = await deleteFollow({
        followUserId,
        userId: id,
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
    <main className="meet-link-friends">
      <Container>
        <form onSubmit={(e) => finder(e)}>
          <input
            className="search"
            type="text"
            placeholder="Пошук :"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>

        {userList.length > 0 && (
          <div className="friends">
            <p className="list-empty">Результат пошуку</p>

            {userList.map((user: IUser) => {
              let avatar = "";

              if (user.avatar) {
                avatar = uint8ArrayToBase64(user.avatar.data.data);
              }

              return (
                <div className="friend" key={user._id}>
                  <Link to={`/info-user/${user._id}`}>
                    <div className="content">
                      <img
                        className="user-avatar"
                        src={
                          avatar === "" || null || undefined
                            ? defaultIMG
                            : `data:image/png;base64,${avatar}`
                        }
                        alt="user-avatar"
                      />

                      <span>{user.username + " " + user.surname}</span>
                    </div>
                  </Link>
                </div>
              );
            })}

            <div className="line"></div>
          </div>
        )}

        {isSuccess && myInfo.friendsList?.length ? (
          <div className="friends">
            <p className="list-empty">Список друзів</p>

            {myInfo.friendsList.map((user: IUser) => {
              let avatar = "";

              if (user.avatar) {
                avatar = uint8ArrayToBase64(user.avatar.data.data);
              }

              return (
                <div className="friend" key={user._id}>
                  <Link to={`/info-user/${user._id}`}>
                    <div className="content">
                      <img
                        className="user-avatar"
                        src={
                          avatar === "" || null || undefined
                            ? defaultIMG
                            : `data:image/png;base64,${avatar}`
                        }
                        alt="user-avatar"
                      />

                      <span>{user.username + " " + user.surname}</span>
                    </div>
                  </Link>

                  <div>
                    <Link to={`/calls/${user._id}`}>
                      <Button
                        variant="outline-primary"
                        style={{ marginRight: "10px" }}
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

                    <Link to={`/chats/${user._id}`}>
                      <Button
                        variant="outline-success"
                        style={{ marginRight: "10px" }}
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

                    <Button
                      variant="outline-danger"
                      onClick={() => handleDeleteFollow(user._id)}
                    >
                      Не стежити
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="friends">
            <p className="list-empty">Список порожній</p>
          </div>
        )}
      </Container>
    </main>
  );
};

export default MyFriends;
