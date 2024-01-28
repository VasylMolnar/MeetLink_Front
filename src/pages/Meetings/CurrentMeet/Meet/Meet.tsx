import "./Meet.scss";
import ChatAndParticipants from "../../../../components/ChatAndParticipants/ChatAndParticipants";
import VideoMeet from "../../../../components/VideoMeet/VideoMeet";
import { useEffect } from "react";

const Meet = () => {
  useEffect(() => {
    const navigation = document.querySelector(".meet-link-nav");
    const privateRoute = document.querySelector(".privateRoute");

    if (navigation && privateRoute) {
      // @ts-expect-error: Unreachable code error
      navigation.style.display = "none";

      // @ts-expect-error: Unreachable code error
      privateRoute.style.paddingInlineStart = "0px";
    }

    return () => {
      // @ts-expect-error: Unreachable code error
      navigation.style.display = "flex";

      // @ts-expect-error: Unreachable code error
      privateRoute.style.paddingInlineStart = "17rem";
    };
  }, []);

  return (
    <main className="meet-link-meet">
      {/* Component with Video */}
      <VideoMeet />

      {/*Bar with All users and Chat */}
      <ChatAndParticipants />
    </main>
  );
};

export default Meet;
