import "./CallCard.scss";
import { Link } from "react-router-dom";
import defaultIMG from "../../assets/defaultIMG.png";
import { uint8ArrayToBase64 } from "../../utils/uint8ArrayToBase64";
import { selectCurrentUserId } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { Badge } from "primereact/badge";
import { useDeleteUserCallMutation } from "../../features/call/callApiSlice";
import { Loading } from "notiflix";
import { Report } from "notiflix/build/notiflix-report-aio";
import { IErrorResponse } from "../../types/authTypes";
import React from "react";

let CallCard = ({ callInfo }: any) => {
  const myId = useSelector(selectCurrentUserId);

  //fn API
  const [deleteCall] = useDeleteUserCallMutation();

  const handlerDeleteCall = async (callId: any) => {
    Loading.hourglass();

    try {
      const response = await deleteCall({
        callId,
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
      <Link to={callInfo.callRoomId}>
        <div className="header">
          {callInfo && (
            <div className="header">
              {callInfo.status && callInfo.status === "new-call" ? (
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
                  callInfo.userInfo[0].avatar === null ||
                  callInfo.userInfo[0].avatar === undefined
                    ? defaultIMG
                    : `data:image/png;base64,${uint8ArrayToBase64(
                        callInfo.userInfo[0].avatar.data.data
                      )}`
                }
                alt="user-avatar"
              />
              <div className="info">
                <span>
                  {callInfo.userInfo[0].username +
                    " " +
                    callInfo.userInfo[0].surname}
                </span>
                <span className="last-message">
                  {callInfo.userInfo[0].email}
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>

      <button
        className="trash-btn"
        onClick={() => handlerDeleteCall(callInfo._id)}
      >
        Видалити
      </button>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
CallCard = React.memo(CallCard);
export default CallCard;
