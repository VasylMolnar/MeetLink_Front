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
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDeleteFollow(user._id)}
                  >
                    Не стежити
                  </Button>
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
