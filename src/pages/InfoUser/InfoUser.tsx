import "./InfoUser.scss";
import Avatar from "@mui/material/Avatar";
import { useGetMyInfoQuery } from "../../features/user/userApiSlice";
import { IUser } from "../../types/authTypes";
import { Container } from "react-bootstrap";
import defaultIMG from "../../assets/defaultIMG.png";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Loading } from "notiflix";
import { Report } from "notiflix/build/notiflix-report-aio";
import locations from "./data/locations.json";

const InfoUser = () => {
  const { id } = useParams();
  const { data, isSuccess, isLoading, error } = useGetMyInfoQuery(id);
  const myInfo = data as IUser;

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

  return (
    <main className="section userPage">
      <Container>
        {isSuccess && (
          <div className="container">
            <div className="user_content">
              <div className="user">
                <Avatar
                  className="img"
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
                  </div>

                  <div className="form-label">
                    <p style={{ marginBottom: 0 }}> Ім'я</p>
                    <p
                      className="form-control"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {myInfo.username}
                    </p>
                  </div>

                  <div className="form-label">
                    <p style={{ marginBottom: 0 }}>Прізвище</p>
                    <p
                      className="form-control"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {myInfo.surname}
                    </p>
                  </div>

                  <div className="form-label">
                    <p style={{ marginBottom: 0 }}> Електрона пошта</p>
                    <p
                      className="form-control"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {myInfo.email}
                    </p>
                  </div>

                  <div className="form-label">
                    <p style={{ marginBottom: 0 }}> Номер телефону</p>
                    <p
                      className="form-control"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {myInfo.phoneNumber}
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
                          (item) => item.value === myInfo.region
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
                          (item) => item.value === myInfo.city
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
