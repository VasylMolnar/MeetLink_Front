import "./Slider.scss";
import miting1 from "../../assets/meetings1.jpg";

const Slider = () => {
  return (
    <div className="slider">
      <div className="slider-card">
        <img src={miting1} alt="name-user" />
      </div>

      <div className="slider-card">
        <img src={miting1} alt="name-user" />
      </div>

      <div className="slider-card">
        <img src={miting1} alt="name-user" />
      </div>
    </div>
  );
};

export default Slider;
