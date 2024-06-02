import "./Calls.scss";
import { Container } from "react-bootstrap";
import {
  logOut,
  selectCurrentToken,
  selectCurrentUserId,
  setCredentials,
} from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetMyInfoQuery } from "../../features/user/userApiSlice";
import { ISuccessLogInResponse, IUser } from "../../types/authTypes";
import { Loading } from "notiflix";
import { Report } from "notiflix/build/notiflix-report-aio";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { uint8ArrayToBase64 } from "../../utils/uint8ArrayToBase64";
import defaultIMG from "../../assets/defaultIMG.png";
import axios from "axios";
import CallCard from "../../components/CallCard/CallCard";

const Calls = () => {
  const dispatch = useDispatch();
  const currentToken = useSelector(selectCurrentToken);
  const [searchValue, setSearchValue] = useState("");
  const [userList, setUserList] = useState([]);

  const id = useSelector(selectCurrentUserId);
  const { data, isSuccess, isLoading, error } = useGetMyInfoQuery(id);
  const myInfo = data as IUser;

  useEffect(() => {
    if (!isSuccess && isLoading) {
      Loading.dots();
    } else {
      Loading.remove();
    }

    if (error) {
      Report.failure(`${error}`, "", "OK");
    }
  }, [error, isLoading, isSuccess]);

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
      // console.log(err);

      if (err.response.status === 403) {
        const refreshToken = await axios.get("http://localhost:3500/refresh", {
          withCredentials: true,
        });

        if (refreshToken?.data) {
          const successResponse = refreshToken as ISuccessLogInResponse;
          dispatch(setCredentials({ ...successResponse.data }));

          // setUserList(response.data);
        } else {
          dispatch(logOut());
        }
      }
    } finally {
      Loading.remove();
    }
  };

  return (
    <main className="meet-link-calls">
      <Container>
        <form onSubmit={(e) => finder(e)}>
          <input
            className="message-finder"
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
                      <div className="info">
                        <span>{user.username + " " + user.surname}</span>
                        <span className="email">{user.email}</span>
                      </div>{" "}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {isSuccess && myInfo.individualCall?.length ? (
          <div className="calls">
            <p className="list-empty">Ваші контакти</p>

            {myInfo.individualCall.map((call: any) => (
              <CallCard callInfo={call} key={call._id} />
            ))}
          </div>
        ) : (
          <div className="calls">
            <p className="list-empty">Список порожній</p>
          </div>
        )}
      </Container>
    </main>
  );
};

export default Calls;
