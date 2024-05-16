import { useEffect, useRef, useState } from "react";
import "./ChatAndParticipants.scss";
import { IMessage } from "../../types/authTypes";

const ChatAndParticipants = ({
  setChatParticipants,
  userList,
  socket,
  myInfo,
  userId,
  meetId,
  conferenceId,
}: any) => {
  const [chatView, setChatView] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();

    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("getNewMeetMessage", (messageHistory: any) => {
      setMessages((prev) => {
        return [...prev, messageHistory];
      });
    });

    socket.on("error", () => {
      //console.error("Socket error:", error.message);
    });

    return () => {
      socket.off("getNewMeetMessage");
      socket.off("error");
    };
  }, [socket]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    scrollToBottom();
  }, [messages]);

  const toggleChatParticipants = () => {
    const chatParticipants = document.querySelector(".chat-participants");

    if (chatParticipants) {
      chatParticipants.classList.toggle("active");
      setChatParticipants(false);
    }
  };

  const handlerMessageSubmit = (e: any) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (socket) {
      socket.emit("sendNewMeetMessage", {
        meetId,
        conferenceId,
        message: newMessage,
        senderId: userId,
        username: myInfo.username,
        surname: myInfo.surname,
      });
      setNewMessage("");
    }
  };

  return (
    <div className="chat-participants">
      {isMobile ? (
        <button className="btn-exit" onClick={() => toggleChatParticipants()}>
          <span>Закрити</span>
        </button>
      ) : null}

      <div className="control">
        <button
          className={chatView ? "btn choose" : "btn"}
          onClick={() => setChatView(true)}
        >
          Чат
        </button>
        <button
          className={!chatView ? "btn choose" : "btn"}
          onClick={() => setChatView(false)}
        >
          Учасники
        </button>
      </div>

      {chatView ? (
        <>
          <div className="chat">
            {messages.map((message: IMessage, index: any) => {
              const messageDate = new Date(message.createdAt);
              const today = new Date();

              let timeOrDate;
              if (
                messageDate.getDate() === today.getDate() &&
                messageDate.getMonth() === today.getMonth() &&
                messageDate.getFullYear() === today.getFullYear()
              ) {
                timeOrDate = messageDate.toLocaleTimeString();
              } else {
                timeOrDate = messageDate.toLocaleDateString();
              }

              return message.senderId !== userId ? (
                <div className="message user" key={message.senderId + index}>
                  <div className="about-user">
                    <span>{message.username + " " + message.surname}</span>
                    <time className="time">{timeOrDate}</time>
                  </div>
                  {message.message}
                </div>
              ) : (
                <div className="message you" key={message.senderId + index}>
                  <div className="about-user">
                    <span>{message.username + " " + message.surname}</span>
                    <time className="time">{timeOrDate}</time>
                  </div>
                  {message.message}
                </div>
              );
            })}

            <div ref={messagesEndRef}></div>
          </div>

          <form onSubmit={handlerMessageSubmit} className="message-form">
            <div className="custom_input">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="svg_icon bi-chat-right-text"
                viewBox="0 0 16 16"
              >
                <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"></path>
                <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"></path>
              </svg>
              <input
                className="input"
                type="text"
                placeholder="Введіть повідомлення"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </div>
          </form>
        </>
      ) : (
        <div className="participants">
          <div className="number-user">
            <svg
              className="user-img"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 640 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path>
            </svg>

            <span>{userList.length}</span>
          </div>

          {userList.map((user: any) => (
            <div
              className="user"
              key={user.metadata.userId + "-" + user.metadata.username}
            >
              <div className="about-user">
                <img
                  className="user-img"
                  src={user.metadata.avatar}
                  alt="user name"
                />
                <span>
                  {user.metadata.username} {user.metadata.surname}
                </span>
              </div>

              <div className="user-control">
                {user.metadata.isCameraOn ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                  >
                    <path d="M29.0976 10.6185C28.5389 10.2666 27.8522 10.2354 27.2669 10.5332L25.2909 11.5309C24.5602 11.8991 24.1069 12.6436 24.1069 13.472V21.25C24.1069 22.0784 24.5602 22.8216 25.2909 23.1925L27.2656 24.1887C27.5336 24.3268 27.8202 24.3931 28.1069 24.3931C28.4509 24.3931 28.7922 24.2957 29.0976 24.1048C29.6562 23.7542 29.9896 23.1464 29.9896 22.4804V12.2442C29.9896 11.5782 29.6562 10.9705 29.0976 10.6185Z" />
                    <path d="M16.5297 27.3619H8.80693C5.57756 27.3619 3.32288 25.1352 3.32288 21.9474V12.7765C3.32288 9.58732 5.57756 7.36194 8.80693 7.36194H16.5297C19.759 7.36194 22.0137 9.58732 22.0137 12.7765V21.9474C22.0137 25.1352 19.759 27.3619 16.5297 27.3619Z" />
                  </svg>
                ) : (
                  <svg
                    stroke="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 640 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-86.4-67.7 13.8 9.2c9.8 6.5 22.4 7.2 32.9 1.6s16.9-16.4 16.9-28.2V128c0-11.8-6.5-22.6-16.9-28.2s-23-5-32.9 1.6l-96 64L448 174.9V192 320v5.8l-32-25.1V128c0-35.3-28.7-64-64-64H113.9L38.8 5.1zM407 416.7L32.3 121.5c-.2 2.1-.3 4.3-.3 6.5V384c0 35.3 28.7 64 64 64H352c23.4 0 43.9-12.6 55-31.3z"></path>
                  </svg>
                )}

                {user.metadata.isMicrophoneOn ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                  >
                    <path d="M26.0417 13.1012C25.3287 13.1012 24.75 13.6714 24.75 14.3767C24.75 19.1408 20.8248 23.0172 16.0006 23.0172C11.1751 23.0172 7.24987 19.1408 7.24987 14.3767C7.24987 13.6714 6.67122 13.1012 5.95825 13.1012C5.24527 13.1012 4.66663 13.6714 4.66663 14.3767C4.66663 20.1166 9.06589 24.8552 14.709 25.4917V28.0581C14.709 28.7622 15.2863 29.3336 16.0006 29.3336C16.7136 29.3336 17.2922 28.7622 17.2922 28.0581V25.4917C22.934 24.8552 27.3333 20.1166 27.3333 14.3767C27.3333 13.6714 26.7546 13.1012 26.0417 13.1012Z" />
                    <path d="M15.7663 20.2894H16.2339C19.4371 20.2894 22.0359 17.7243 22.0359 14.561V8.39632C22.0359 5.23045 19.4371 2.66663 16.2339 2.66663H15.7663C12.5631 2.66663 9.96438 5.23045 9.96438 8.39632V14.561C9.96438 17.7243 12.5631 20.2894 15.7663 20.2894Z" />
                  </svg>
                ) : (
                  <svg
                    stroke="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M367.951 354.654l-26.616-26.562-9.568-9.548-4.698-4.706L187 174.041v.346L76.112 63.531 51.921 87.572 187 222.47v28.816c0 37.79 31.121 68.714 68.91 68.714a68.6 68.6 0 0 0 24.565-4.545l32.389 32.274c-17.333 8.793-36.812 13.86-56.782 13.86-62.986 0-121.365-48.59-121.365-116.59H95.773C95.773 322 158 387.701 233 398.013V480h46v-81.987c22-3.352 43.066-11.222 61.627-22.622l95.278 95.078 24.033-24-33.847-33.785-58.216-57.959 58.224 57.959-58.148-58.03zM325 251.286V100.714C325 62.924 293.791 32 256 32s-69 30.924-69 68.714v25.244l137.109 136.968c.67-3.791.891-7.679.891-11.64zM416.439 245h-38.941c0 20.496-5.498 39.676-14.931 56.197l27.572 27.516c16.523-24.11 26.3-52.787 26.3-83.713zM459.999 446.427l-33.897-33.743 33.855 33.785z"></path>
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatAndParticipants;
