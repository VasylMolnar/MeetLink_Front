import "./App.scss";
import { BrowserRouter as Router } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken, setCredentials } from "./features/auth/authSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  IErrorResponse,
  ISuccessLogInResponse,
  ITokenResponse,
} from "./types/authTypes";
import { Loading } from "notiflix";
import { jwtDecode } from "jwt-decode";

function App() {
  const isAuth = useSelector(selectCurrentToken);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshJWT = async () => {
      await axios
        .get("http://localhost:3500/refresh", {
          withCredentials: true,
        })
        .then((response: ISuccessLogInResponse) => {
          const decoded = jwtDecode(
            response.data.accessToken
          ) as ITokenResponse;

          dispatch(
            setCredentials({
              ...decoded.UserInfo,
              ...response.data,
            })
          );
        })
        .catch((error: IErrorResponse) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
          Loading.remove();
        });
    };

    if (!isAuth && isLoading) {
      refreshJWT();
    }
  }, [dispatch, isAuth, isLoading]);

  return (
    <>
      {isAuth ? (
        <Router>
          <PrivateRoute />
        </Router>
      ) : isLoading ? (
        Loading.dots("Завантаження")
      ) : (
        <Router>
          <PublicRoute />
        </Router>
      )}
    </>
  );
}

export default App;
