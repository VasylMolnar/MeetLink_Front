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
import { useResAccessMutation } from "../../features/meetAccess/meetAccessApiSlice";
import { Loading } from "notiflix";
import { Report } from "notiflix/build/notiflix-report-aio";

const AccessMessage = () => {
  const id = useSelector(selectCurrentUserId);
  const { data, isSuccess } = useGetMyInfoQuery(id);
  const myInfo = data as IMyInfo;

  //fn Api
  const [resAccess] = useResAccessMutation();

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

  return (
    <main className="meet-link-access-message">
      <Container>
        {isSuccess && myInfo.messages.length ? (
          <div className="access-message-user-list">
            <div className="user-info">
              <DataTable
                value={myInfo.messages}
                header={"Запити доступу до зустрічей"}
                stripedRows
                tableStyle={{ minWidth: "50rem", border: "1px solid #f3e8ff" }}
              >
                <Column
                  field="meetId"
                  header="Зустріч"
                  body={(rowData) => (
                    <Link to={`/${rowData.meetId}`}>Посилання</Link>
                  )}
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
                  body={(rowData) => (
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
                  )}
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

//add btn delete message if admin add user. user get message (what he has access to meet and can delete message)
