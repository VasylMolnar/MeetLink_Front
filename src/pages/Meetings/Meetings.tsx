import "./Meetings.scss";
import MeetCard from "../../components/MeetCard/MeetCard";
import ActionsBar from "../../components/ActionsBar/ActionsBar";
import { Container } from "react-bootstrap";

type MeetingsProps = {
  isMenuOpen: boolean;
};

const Meetings = ({ isMenuOpen }: MeetingsProps) => {
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

  return (
    <main className="meet-link-meetings">
      <Container>
        <ActionsBar />

        <div className="meetings">
          {data.map((item) => (
            <MeetCard item={item} key={item.id} isMenuOpen={isMenuOpen} />
          ))}
        </div>
      </Container>
    </main>
  );
};

export default Meetings;
