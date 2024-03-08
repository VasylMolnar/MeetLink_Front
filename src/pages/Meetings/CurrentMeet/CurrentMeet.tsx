import "./CurrentMeet.scss";
import Chat from "../../../components/Chat/Chat";
import { Container } from "react-bootstrap";
import CallActionsBar from "../../../components/CallActionsBar/CallActionsBar";
import { useParams } from "react-router-dom";
import { useGetCurrentMeetQuery } from "../../../features/meet/meetApiSlice";
import { IMeetInfo } from "../../../types/authTypes";
import { useEffect } from "react";
import { Loading } from "notiflix";

const CurrentMeet = () => {
  const { id } = useParams();

  const { data, isSuccess, isLoading } = useGetCurrentMeetQuery(
    id === "auth-form" ? "" : id
  );
  const meetInfo = data as IMeetInfo;

  useEffect(() => {
    if (!isSuccess && isLoading) {
      Loading.hourglass();
    } else {
      Loading.remove();
    }
  }, [isLoading, isSuccess]);

  return (
    <main className="meet-link-current-meet">
      <Container>
        {isSuccess && (
          <>
            <CallActionsBar
              meetName={meetInfo.meetName}
              meetId={meetInfo._id as string}
              date={meetInfo.date}
              time={meetInfo.time}
            />
            <Chat
              roomId={meetInfo.roomId as string}
              meetId={meetInfo._id as string}
            />
          </>
        )}
      </Container>
    </main>
  );
};

export default CurrentMeet;
