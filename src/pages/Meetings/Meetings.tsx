import "./Meetings.scss";
import MeetCard from "../../components/MeetCard/MeetCard";
import ActionsBar from "../../components/ActionsBar/ActionsBar";
import { Container } from "react-bootstrap";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { useSelector } from "react-redux";
import { useGetMyInfoQuery } from "../../features/user/userApiSlice";
import { selectCurrentUserId } from "../../features/auth/authSlice";
import { IErrorResponse, IMeetInfo, IMyInfo } from "../../types/authTypes";
import { Loading } from "notiflix";
import { Report } from "notiflix/build/notiflix-report-aio";
import { useReqAccessMutation } from "../../features/meetAccess/meetAccessApiSlice";

type MeetingsProps = {
  isMenuOpen: boolean;
};

const Meetings = ({ isMenuOpen }: MeetingsProps) => {
  const [visible, setVisible] = useState(false);

  const id = useSelector(selectCurrentUserId);
  const { data, isSuccess, isLoading } = useGetMyInfoQuery(id);

  //fn Api
  const [sendReqAccess] = useReqAccessMutation();

  // send Admin access to meet
  const handleAccessMeet = async (e: any) => {
    e.preventDefault();
    const meetId = e.currentTarget.elements.access.value;
    Loading.hourglass("Надсилаємо запит");

    try {
      const response = await sendReqAccess({ meetId, userId: id });

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
          "Зустріч з'явиться після того як адміністратор додасть вас до зустрічі",
          "OK"
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      Loading.remove();
    }
  };

  useEffect(() => {
    if (!isSuccess && isLoading) {
      Loading.dots("Завантаження");
    } else {
      Loading.remove();
    }
  }, [isLoading, isSuccess]);

  return (
    <main className="meet-link-meetings">
      <Container>
        <ActionsBar setVisible={setVisible} />

        {isSuccess && (data as IMyInfo).meetList?.length ? (
          <div className="meetings">
            {(data as IMyInfo).meetList?.map((meet: IMeetInfo) => (
              <MeetCard meet={meet} key={meet["_id"]} isMenuOpen={isMenuOpen} />
            ))}
          </div>
        ) : (
          <div className="meetings">
            <p className="list-empty">Список порожній</p>
          </div>
        )}
      </Container>

      {/*Modal for connect to meet  */}
      <Dialog
        header="Приєднатися до зустрічі"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        <p className="m-0">
          Введіть ідентифікатор зустрічі і адміністратор додасть вас до зустрічі
        </p>

        <form action="submit" onSubmit={(e) => handleAccessMeet(e)}>
          <InputText
            name="access"
            required
            style={{ marginTop: "30px", width: "100%" }}
          />
        </form>
      </Dialog>
    </main>
  );
};

export default Meetings;
