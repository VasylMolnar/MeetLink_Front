import "./MeetCard.scss";
import logo from "../../assets/ charity.png";
import { Link } from "react-router-dom";
import { IErrorResponse, IMeetInfo } from "../../types/authTypes";
import {
  useDeleteMeetMutation,
  useLeaveMeetMutation,
} from "../../features/meet/meetApiSlice";
import { selectCurrentUserId } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { Loading } from "notiflix";
import { Report } from "notiflix/build/notiflix-report-aio";

interface MeetCardProps {
  meet: IMeetInfo;
  isMenuOpen: boolean;
}

const MeetCard = ({ meet, isMenuOpen }: MeetCardProps) => {
  const userId = useSelector(selectCurrentUserId);

  //fn API
  const [leaveMeet] = useLeaveMeetMutation();
  const [deleteMeet] = useDeleteMeetMutation();

  const handlerLeaveMeet = async () => {
    const meetId = meet["_id"];
    const confirm = window.confirm("Ви дійсно бажаєте покинути дану зустріч ?");

    if (confirm) {
      Loading.hourglass("Виходимо із зустріч");

      try {
        const response = await leaveMeet({ meetId, userId });

        if ("error" in response) {
          const errorResponse = response as IErrorResponse;

          Report.warning(
            `Ви не можете залишити цю зустріч`,
            errorResponse.error.data.message,
            "OK"
          );
        } else {
          Report.success(`Зустріч успішно покинуто`, "", "OK");
        }
      } catch (err) {
        //console.log(err);
      } finally {
        Loading.remove();
      }
    } else {
      Loading.remove();
      Report.info("Cкасовано", "", "OK");
    }
  };

  const handlerDeleteMeet = async () => {
    const meetId = meet["_id"];
    const confirm = window.confirm(
      "Ви дійсно бажаєте видалити дану зустріч ?\nВидалення призведе до повного видалення зустрічі у вас а також у користувачів які доданні до зустрічі"
    );

    if (confirm) {
      Loading.hourglass("Видаляємо зустріч");

      try {
        const response = await deleteMeet(meetId);

        if ("error" in response) {
          const errorResponse = response as IErrorResponse;

          Report.warning(
            `Помилка видалення`,
            errorResponse.error.data.message,
            "OK"
          );
        } else {
          Report.success(`Успішно видалено`, "", "OK");
        }
      } catch (err) {
        //console.log(err);
      } finally {
        Loading.remove();
      }
    } else {
      Loading.remove();
      Report.info("Cкасовано", "", "OK");
    }
  };

  return (
    <div className={isMenuOpen ? `meetCard` : `meetCard menu-close`}>
      <Link to={meet["_id"] as string}>
        <div className="header">
          <img src={meet.img || logo} alt="" className="logo" />

          <div className="info">
            <span className="title">{meet.meetName}</span>
            <span className="total-user">Час: {meet.time}</span>
            <span className="total-user">Дата: {meet.date}</span>
          </div>
        </div>

        <div className="line"></div>

        <div className="content">
          <span>{meet.description}</span>
        </div>
      </Link>

      {userId === meet.adminID ? (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
          className="trash-btn"
          onClick={handlerDeleteMeet}
        >
          <path fill="none" d="M0 0h24v24H0V0z"></path>
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"></path>
        </svg>
      ) : (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 512 512"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
          className="trash-btn"
          onClick={handlerLeaveMeet}
        >
          <path d="M215.469 332.802l29.863 29.864L352 256 245.332 149.333l-29.863 29.865 55.469 55.469H64v42.666h205.864l-54.395 55.469zM405.334 64H106.666C83.198 64 64 83.198 64 106.666V192h42.666v-85.333h298.668v298.668H106.666V320H64v85.334C64 428.802 83.198 448 106.666 448h298.668C428.802 448 448 428.802 448 405.334V106.666C448 83.198 428.802 64 405.334 64z"></path>
        </svg>
      )}
    </div>
  );
};

export default MeetCard;
