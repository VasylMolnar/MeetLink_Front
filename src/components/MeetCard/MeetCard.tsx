import "./MeetCard.scss";
import logo from "../../assets/picture.png";
import { Link } from "react-router-dom";

const MeetCard = ({ item }: any) => {
  return (
    <div className="meetCard">
      <Link to={item.id}>
        <div className="header">
          <img src={logo} alt="" className="logo" />

          <div className="info">
            <span className="title">{item.name}</span>
            <span className="total-user">Учасників: {item.totalUser}</span>
          </div>
        </div>

        <div className="content">
          <span>{item.description}</span>
        </div>
      </Link>

      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        className="trash-btn"
      >
        <path fill="none" d="M0 0h24v24H0V0z"></path>
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"></path>
      </svg>
    </div>
  );
};

export default MeetCard;
