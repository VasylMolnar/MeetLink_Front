import "./AccessMessage.scss";
import { Container } from "react-bootstrap";
import { IErrorResponse, IMyInfo } from "../../types/authTypes";
import { useGetMyInfoQuery } from "../../features/user/userApiSlice";
import { selectCurrentUserId } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import defaultIMG from "../../assets/defaultIMG.png";
import Image from "react-bootstrap/Image";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import {
  useDeleteAccessMessageMutation,
  useResAccessMutation,
} from "../../features/meetAccess/meetAccessApiSlice";
import { Loading } from "notiflix";
import { Report } from "notiflix/build/notiflix-report-aio";
import { useResAccessFollowMutation } from "../../features/followAccess/followAccessApiSlice";

const AccessMessage = () => {
  const id = useSelector(selectCurrentUserId);
  const { data, isSuccess } = useGetMyInfoQuery(id);
  const myInfo = data as IMyInfo;

  //fn Api
  const [resAccess] = useResAccessMutation();
  const [deleteAccessMessage] = useDeleteAccessMessageMutation();
  const [resAccessFollow] = useResAccessFollowMutation();

  // meet
  const handlerResAccess = async (
    meetId: string,
    userId: string,
    messageId: string,
    access: boolean
  ) => {
    Loading.hourglass("Працюємо над цим");

    try {
      const response = await resAccess({ meetId, userId, messageId, access });
      if ("error" in response) {
        const errorResponse = response as IErrorResponse;
        Report.warning(`Помилка`, errorResponse.error.data.message, "OK");
      } else {
        Report.success(
          `${
            access
              ? "Користувачеві надано доступ"
              : "Користувачеві відмовлено у доступі"
          }`,
          "",
          "OK"
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      Loading.remove();
    }
  };

  const handlerDeleteAccessMessage = async (messageId: string) => {
    Loading.hourglass("Працюємо над цим");

    try {
      const response = await deleteAccessMessage({
        userId: id,
        messageId,
      });

      if ("error" in response) {
        const errorResponse = response as IErrorResponse;
        Report.warning(`Помилка`, errorResponse.error.data.message, "OK");
      } else {
        Report.success(`Успішно видалено`, "", "OK");
      }
    } catch (err) {
      console.log(err);
    } finally {
      Loading.remove();
    }
  };

  //follow
  const handlerResAccessFollow = async (
    userId: string,
    messageId: string,
    access: boolean
  ) => {
    Loading.hourglass("Працюємо над цим");

    try {
      const response = await resAccessFollow({
        userId: id,
        followUserId: userId,
        messageId,
        access,
      });
      if ("error" in response) {
        const errorResponse = response as IErrorResponse;
        Report.warning(`Помилка`, errorResponse.error.data.message, "OK");
      } else {
        Report.success(
          `${
            access
              ? "Запит на стеження підтверджено"
              : "Користувачеві відмовлено"
          }`,
          "",
          "OK"
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      Loading.remove();
    }
  };

  return (
    <main className="meet-link-access-message">
      <Container>
        {isSuccess && myInfo.messages.length ? (
          <div className="access-message-user-list">
            <div className="user-info">
              <DataTable
                value={myInfo.messages}
                header={"Доступи"}
                stripedRows
                tableStyle={{ minWidth: "50rem", border: "1px solid #f3e8ff" }}
              >
                <Column
                  field="type"
                  header={
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      role="img"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title></title>
                      <path d="M18.971 13.486a7.56 7.56 0 00-.54-1.043V6.415a6.375 6.375 0 00-1.88-4.535A6.374 6.374 0 0012.017 0h-.002a6.374 6.374 0 00-4.536 1.878 6.375 6.375 0 00-1.88 4.537v.877h2.57v-.877c0-1.026.4-1.992 1.127-2.72a3.822 3.822 0 012.72-1.125 3.852 3.852 0 013.847 3.845v3.508A7.52 7.52 0 0012 8.865a7.54 7.54 0 00-5.35 2.216 7.54 7.54 0 00-2.216 5.35 7.54 7.54 0 002.215 5.35A7.54 7.54 0 0012 24a7.54 7.54 0 005.35-2.216 7.54 7.54 0 002.216-5.35c0-1.021-.2-2.012-.595-2.946zM12 21.428a5.003 5.003 0 01-4.997-4.996A5.003 5.003 0 0112 11.435a5.002 5.002 0 014.997 4.997A5.002 5.002 0 0112 21.428zm2.145-4.973a2.12 2.12 0 11-4.24 0 2.12 2.12 0 014.24 0z"></path>
                    </svg>
                  }
                  body={(rowData) =>
                    !rowData.meetId
                      ? rowData.type === "Request"
                        ? "Запит стеження"
                        : "Доступ надано"
                      : rowData.type === "Request"
                      ? "Запит доступу"
                      : "Доступ надано"
                  }
                  style={{ border: "1px solid #f3e8ff" }}
                />

                <Column
                  field="meetId"
                  header="Зустріч"
                  body={(rowData) =>
                    !rowData.meetId ? (
                      ""
                    ) : (
                      <Link to={`/${rowData.meetId}`}>Посилання</Link>
                    )
                  }
                  style={{ border: "1px solid #f3e8ff" }}
                />
                <Column
                  field="userId"
                  header="Профіль"
                  body={(rowData) => (
                    <Link to={`/info-user/${rowData.userId}`}>Посилання</Link>
                  )}
                  style={{ border: "1px solid #f3e8ff" }}
                ></Column>
                <Column
                  field="username"
                  header="Ім'я"
                  style={{ border: "1px solid #f3e8ff" }}
                ></Column>
                <Column
                  field="surname"
                  header="Прізвище"
                  style={{ border: "1px solid #f3e8ff" }}
                ></Column>
                <Column
                  field="email"
                  header="Електрона пошта"
                  style={{ border: "1px solid #f3e8ff" }}
                ></Column>

                <Column
                  body={(rowData) =>
                    !rowData.meetId ? (
                      rowData.type === "Request" ? (
                        <div className="btn-control">
                          <button
                            className="btn btn-success"
                            onClick={() =>
                              handlerResAccessFollow(
                                rowData.userId,
                                rowData._id,
                                true
                              )
                            }
                          >
                            Дозволити
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              handlerResAccessFollow(
                                rowData.userId,
                                rowData._id,
                                false
                              )
                            }
                          >
                            Відхилити
                          </button>
                        </div>
                      ) : (
                        <div className="btn-control">
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              handlerDeleteAccessMessage(rowData._id)
                            }
                          >
                            Зрозуміло
                          </button>
                        </div>
                      )
                    ) : rowData.type === "Request" ? (
                      <div className="btn-control">
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            handlerResAccess(
                              rowData.meetId,
                              rowData.userId,
                              rowData._id,
                              true
                            )
                          }
                        >
                          Дозволити
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handlerResAccess(
                              rowData.meetId,
                              rowData.userId,
                              rowData._id,
                              false
                            )
                          }
                        >
                          Відхилити
                        </button>
                      </div>
                    ) : (
                      <div className="btn-control">
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handlerDeleteAccessMessage(rowData._id)
                          }
                        >
                          Зрозуміло
                        </button>
                      </div>
                    )
                  }
                  headerClassName="w-10rem"
                  style={{ border: "1px solid #f3e8ff" }}
                />
              </DataTable>
            </div>
          </div>
        ) : (
          <div className=" text-center">
            <div className="container">
              <div className="page-404-img">
                <Image src={defaultIMG} alt="Not found" />
              </div>
              <p className="page-404-title">Немає жодних повідомлень</p>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
};

export default AccessMessage;
