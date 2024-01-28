import "./CurrentCall.scss";
import VideoMeet from "../../../components/VideoMeet/VideoMeet";
import { useEffect } from "react";

const CurrentCall = () => {
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
    <main className="meet-link-current-call">
      {/* Component with Video */}
      <VideoMeet />
    </main>
  );
};

export default CurrentCall;

//<div>Individual Calls 2 perso</div>;
