import "./Meetings.scss";
import MeetCard from "../../components/MeetCard/MeetCard";
import ActionsBar from "../../components/ActionsBar/ActionsBar";
import { Container } from "react-bootstrap";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { InputText } from "primereact/inputtext";

type MeetingsProps = {
  isMenuOpen: boolean;
};

const Meetings = ({ isMenuOpen }: MeetingsProps) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");

  const data = [
    {
      id: "1",
      name: "Sniff",
      totalUser: 50,
      logo: "",
      description: "Test Description Hello World",
    },
    {
      id: "2",
      name: "Фізика",
      totalUser: 50,
      logo: "",
      description: "Урок Фізики",
    },
    {
      id: "3",
      name: "Математика",
      totalUser: 50,
      logo: "",
      description: "Урок Математики",
    },
    {
      id: "4",
      name: "meet name",
      totalUser: 50,
      logo: "",
      description: "Minim dolor in amet nulla laboris",
    },
    {
      id: "5",
      name: "meet name",
      totalUser: 50,
      logo: "",
      description: "test description",
    },
    {
      id: "6",
      name: "meet name",
      totalUser: 50,
      logo: "",
      description: "test description",
    },
    {
      id: "7",
      name: "meet name",
      totalUser: 50,
      logo: "",
      description: "test description",
    },
    {
      id: "8",
      name: "meet name",
      totalUser: 50,
      logo: "",
      description: "test description",
    },
    {
      id: "9",
      name: "meet name",
      totalUser: 50,
      logo: "",
      description: "test description",
    },
    {
      id: "10",
      name: "meet name",
      totalUser: 50,
      logo: "",
      description: "test description",
    },
  ];

  const handleSendRequest = (e: any) => {
    //create api to sent request to admin
    e.preventDefault();
    console.log(e);
  };

  return (
    <main className="meet-link-meetings">
      <Container>
        <ActionsBar setVisible={setVisible} />

        <div className="meetings">
          {data.map((item) => (
            <MeetCard item={item} key={item.id} isMenuOpen={isMenuOpen} />
          ))}
        </div>
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

        <form action="submit" onSubmit={(e) => handleSendRequest(e)}>
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
