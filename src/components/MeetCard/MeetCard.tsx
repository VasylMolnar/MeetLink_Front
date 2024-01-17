import "./MeetCard.scss";
import logo from "../../assets/logo.svg";

const MeetCard = ({ item }: any) => {
  return (
    <div className="meetCard" key={item.id}>
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
    </div>
  );
};

export default MeetCard;
