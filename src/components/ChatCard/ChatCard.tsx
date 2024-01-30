import "./ChatCard.scss";
import { Link } from "react-router-dom";
import logo from "../../assets/meetings1.jpg";

type ChatCardProps = {
  item: any;
};

const ChatCard = ({ item }: ChatCardProps) => {
  return (
    <div className="chatCard">
      <Link to={item.id}>
        <div className="header">
          <img src={logo} alt="" className="logo" />
          <div className="info">
            <span className="user-name">{item.name}</span>
            <span className="last-message">{item.lastMessage}</span>
          </div>
        </div>
      </Link>

      <button className="trash-btn">Видалити</button>
    </div>
  );
};

export default ChatCard;
