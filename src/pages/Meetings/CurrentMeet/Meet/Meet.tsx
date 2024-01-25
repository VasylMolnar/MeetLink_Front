import "./Meet.scss";
import MeetBar from "../../../../components/MeetBar/MeetBar";
import { Container } from "react-bootstrap";
import Slider from "../../../../components/Slider/Slider";
import miting1 from "../../../../assets/meetings1.jpg";

const Meet = () => {
  return (
    <main className="meet-link-meet">
      <Container>
        <div className="video-meet">
          <h1 className="title">Test meet Name</h1>

          {/* Slider whit all user */}
          <Slider />

          <div className="video-screen">
            <img src={miting1} alt="meet" />
          </div>
        </div>

        <MeetBar />
      </Container>
    </main>
  );
};

export default Meet;
