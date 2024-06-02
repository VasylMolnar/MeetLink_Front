import "./ChatCard.scss";
import { Link } from "react-router-dom";
import defaultIMG from "../../assets/defaultIMG.png";
import { uint8ArrayToBase64 } from "../../utils/uint8ArrayToBase64";
import { selectCurrentUserId } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Badge } from "primereact/badge";
import { useDeleteUserMessageMutation } from "../../features/chat/chatApiSlice";
import { Loading } from "notiflix";
import { Report } from "notiflix/build/notiflix-report-aio";
import { IErrorResponse } from "../../types/authTypes";
import React from "react";

let ChatCard = ({ messageInfo }: any) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const myId = useSelector(selectCurrentUserId);

  //fn API
  const [deleteMessage] = useDeleteUserMessageMutation();

  useEffect(() => {
    const currentUserInfo = messageInfo.userInfo.find(
      (user: any) => user._id !== myId
    );

    setUserInfo(currentUserInfo);
  }, [myId, messageInfo]);

  const handlerDeleteMessage = async (messageId: any) => {
    Loading.hourglass();

    try {
      const response = await deleteMessage({
        messageId,
        userId: myId,
      });

      if ("error" in response) {
        const errorResponse = response as IErrorResponse;

        Report.warning(
          `Помилка видалення`,
          errorResponse.error.data.message,
          "OK"
        );
      } else {
        Report.success(`Успішно видалено `, "", "OK");
      }
    } catch (err) {
      // console.log(err);
    } finally {
      Loading.remove();
    }
  };

  return (
    <div className="chatCard">
      <Link to={messageInfo.messageInfo._id}>
        <div className="header">
          {userInfo && messageInfo && (
            <div className="header">
              {messageInfo.messageInfo.status &&
              messageInfo.messageInfo.status === myId ? (
                <i
                  className="pi pi-envelope p-overlay-badge"
                  style={{ fontSize: "2rem" }}
                >
                  <Badge severity="danger"></Badge>
                </i>
              ) : (
                <i
                  className="pi pi-envelope p-overlay-badge"
                  style={{ fontSize: "2rem" }}
                >
                  <Badge severity="success"></Badge>
                </i>
              )}

              <img
                className="logo"
                src={
                  userInfo.avatar === null || userInfo.avatar === undefined
                    ? defaultIMG
                    : `data:image/png;base64,${uint8ArrayToBase64(
                        userInfo.avatar.data.data
                      )}`
                }
                alt="user-avatar"
              />
              <div className="info">
                <span>{userInfo.username + " " + userInfo.surname}</span>

                {messageInfo.messageInfo.messages.length > 0 ? (
                  <span className="last-message">
                    {messageInfo.messageInfo.messages[
                      messageInfo.messageInfo.messages.length - 1
                    ].message
                      .split(" ")
                      .slice(0, 5)
                      .join(" ")}
                  </span>
                ) : (
                  <span className="last-message">Немає жодних повідомлень</span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>

      <button
        className="trash-btn"
        onClick={() => handlerDeleteMessage(messageInfo.messageInfo._id)}
      >
        Видалити
      </button>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
ChatCard = React.memo(ChatCard);
export default ChatCard;
