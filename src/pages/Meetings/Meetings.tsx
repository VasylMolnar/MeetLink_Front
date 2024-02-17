import "./Meetings.scss";
import MeetCard from "../../components/MeetCard/MeetCard";
import ActionsBar from "../../components/ActionsBar/ActionsBar";
import { Container } from "react-bootstrap";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { useSelector } from "react-redux";
import { useGetMyInfoQuery } from "../../features/user/userApiSlice";
import { selectCurrentUserId } from "../../features/auth/authSlice";
import { IMeetInfo, IMyInfo } from "../../types/authTypes";

type MeetingsProps = {
  isMenuOpen: boolean;
};

const Meetings = ({ isMenuOpen }: MeetingsProps) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");

  const id = useSelector(selectCurrentUserId);
  const { data, isSuccess } = useGetMyInfoQuery(id);

  // send Admin access to meet
  const handleAccessMeet = (e: any) => {
    //create api to sent request to admin
    e.preventDefault();
    console.log(e);
  };

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
            value={value}
            required
            onChange={(e) => setValue(e.target.value)}
            style={{ marginTop: "30px", width: "100%" }}
          />
        </form>
      </Dialog>
    </main>
  );
};

export default Meetings;
