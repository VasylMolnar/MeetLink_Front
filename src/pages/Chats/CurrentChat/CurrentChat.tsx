import { useSelector } from "react-redux";
import { useGetMyInfoQuery } from "../../../features/user/userApiSlice";
import "./CurrentChat.scss";
import { selectCurrentUserId } from "../../../features/auth/authSlice";
import { IMessage, IUser } from "../../../types/authTypes";
import { useEffect, useRef, useState } from "react";
import { Loading } from "notiflix";
import { Report } from "notiflix/build/notiflix-report-aio";
import { Link, useParams } from "react-router-dom";
import io, { Socket } from "socket.io-client";
import defaultIMG from "../../../assets/defaultIMG.png";
import { Button, Container } from "react-bootstrap";
import { uint8ArrayToBase64 } from "../../../utils/uint8ArrayToBase64";
import Cookies from "js-cookie";

const CurrentChat = () => {
  //message info
  const { id: messageId } = useParams();
  const [currentMessageInfo, setCurrentMessageInfo] = useState<any>(null);

  // my info
  const userId = useSelector(selectCurrentUserId);
  const { data, isSuccess, isLoading, error } = useGetMyInfoQuery(userId);
  const myInfo = data as IUser;

  const [socket, setSocket] = useState<Socket<any, any> | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (myInfo && myInfo.individualMessages?.length && isSuccess) {
      const messageInfo = myInfo.individualMessages.find(
        (message: any) => message.messageInfo._id === messageId
      );

      if (messageInfo) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const userInfo = messageInfo?.userInfo.find(
          (user: any) => user._id !== userId
        );

        setCurrentMessageInfo({ ...messageInfo, userInfo });
      }
    }
  }, [isSuccess, myInfo]);

  useEffect(() => {
    const newSocket = io("http://localhost:3500");
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!socket || currentMessageInfo === null || !messageId) return;

    if (!isRoomJoined) {
      socket.emit(
        "joinMessageRoom",
        messageId,
        currentMessageInfo.messageInfo.chatRoomId,
        userId
      );
      setIsRoomJoined(true);
    }

    socket.on("loadMessage", (messageHistory: any) => {
      const details = {
        messageId,
        newMessage: true,
      };

      Cookies.set("messageStatus", JSON.stringify(details));
      setMessages(messageHistory);
    });

    socket.on("error", (error: any) => {
      console.error("Socket error:", error.message);
    });

    return () => {
      socket.off("joinMessageRoom");
      socket.off("loadMessage");
      socket.off("error");
    };
  }, [socket, messageId, currentMessageInfo, userId]);

  const handlerMessageSubmit = (e: any) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const chatRoomId = currentMessageInfo.messageInfo.chatRoomId;
    const recipient = currentMessageInfo.userInfo._id;

    if (!chatRoomId || !recipient) return;

    if (socket) {
      socket.emit("sendMessage", {
        messageId,
        recipient,
        roomId: chatRoomId,
        message: newMessage,
        senderId: userId,
        username: myInfo.username,
        surname: myInfo.surname,
        avatar: myInfo.avatar || "",
      });
      setNewMessage("");
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isSuccess && isLoading) {
      Loading.dots();
    } else {
      Loading.remove();
    }

    if (error) {
      Report.failure(`${error}`, "", "OK");
    }
  }, [error, isLoading, isSuccess]);

  return (
    <main className="current-chat">
      <Container>
        {currentMessageInfo !== null && currentMessageInfo.userInfo && (
          <div className="meet-link-info-user">
            <div className="content">
              <img
                className="logo"
                src={
                  currentMessageInfo.userInfo.avatar === null ||
                  currentMessageInfo.userInfo.avatar === undefined
                    ? defaultIMG
                    : `data:image/png;base64,${uint8ArrayToBase64(
                        currentMessageInfo.userInfo.avatar.data.data
                      )}`
                }
                alt="user-avatar"
              />
              <div className="info">
                <span>
                  {currentMessageInfo.userInfo.username +
                    " " +
                    currentMessageInfo.userInfo.surname}
                </span>
              </div>
            </div>

            <Link to={`/info-user/${currentMessageInfo.userInfo._id}`}>
              <Button variant="outline-primary">Профіль</Button>
            </Link>
          </div>
        )}

        <div className="meet-link-chat">
          <div className="chats">
            {messages.map((message: IMessage, index: number) => {
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
                <div className="user-message" key={message.senderId + index}>
                  <img
                    className="user-avatar"
                    src={
                      message.avatar === "" || null || undefined
                        ? defaultIMG
                        : message.avatar
                    }
                    alt="user-avatar"
                  />

                  <div className="content">
                    <div className="about-user">
                      <span>{message.username + " " + message.surname}</span>
                      <time className="time">{timeOrDate}</time>
                    </div>
                    {message.message}
                  </div>
                </div>
              ) : (
                <div className="your-message" key={message.senderId + index}>
                  <div className="content you">
                    <div className="about-user">
                      <span>{message.username + " " + message.surname}</span>
                      <time className="time">{timeOrDate}</time>
                    </div>
                    {message.message}
                  </div>
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
        </div>
      </Container>
    </main>
  );
};

export default CurrentChat;
