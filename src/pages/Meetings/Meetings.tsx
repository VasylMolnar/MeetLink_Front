import MeetCard from "../../components/MeetCard/MeetCard";
import "./Meetings.scss";
import { Container } from "react-bootstrap";

const Meetings = () => {
  const data = [
    {
      id: "1",
      name: "meet name",
      totalUser: 50,
      logo: "",
      description: "test description",
    },
    {
      id: "2",
      name: "meet name",
      totalUser: 50,
      logo: "",
      description: "test description",
    },
    {
      id: "3",
      name: "meet name",
      totalUser: 50,
      logo: "",
      description: "test description",
    },
    {
      id: "4",
      name: "meet name",
      totalUser: 50,
      logo: "",
      description: "test description",
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
        {data.map((item) => (
          <MeetCard item={item} key={item.id} />
        ))}
      </Container>
    </main>
  );
};

export default Meetings;
