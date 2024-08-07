import "./VideoMeet.scss";
import VideoList from "./VideoList";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Col, Row, Form } from "react-bootstrap";
import { Dialog } from "primereact/dialog";
import { Formik, Field } from "formik";
import { SwatchesPicker } from "react-color";
import { Loading } from "notiflix";
import { Report } from "notiflix/build/notiflix-report-aio";
import { IErrorResponse } from "../../types/authTypes";
import {
  useUpdateUserInfoMutation,
  useUploadImgMutation,
} from "../../features/user/userApiSlice";
import { uint8ArrayToBase64 } from "../../utils/uint8ArrayToBase64";

const VideoMeet = ({
  setMyStream,
  myStream,
  remoteStream,
  isMicrophoneOn,
  toggleMicrophone,
  isCameraOn,
  toggleCamera,
  socket,
  userId,
  meetId,
  conferenceId,
  myInfo,
  chatParticipants,
  setChatParticipants,
}: any) => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [background, setBackground] = useState("#202124");
  const [control, setControl] = useState({
    sound: true,
    screen: false,
    setting: false,
  });

  //fn Api
  const [updateUser] = useUpdateUserInfoMutation();
  const [imgUpload] = useUploadImgMutation();

  const toggleControl = (id: string) => {
    // @ts-expect-error: Unreachable code error
    setControl((prevControl) => ({ ...prevControl, [id]: !prevControl[id] }));

    if (id === "sound") {
      const audioElements = document.querySelectorAll("audio");
      const videoElements = document.querySelectorAll("video");

      audioElements.forEach(function (audio) {
        audio.muted = control[id];
      });

      videoElements.forEach(function (video) {
        video.muted = control[id];
      });
    }

    if (id === "setting") {
      setVisible(true);
    }
  };

  const toggleChatParticipants = () => {
    const chatParticipants = document.querySelector(".chat-participants");

    if (chatParticipants) {
      chatParticipants.classList.toggle("active");
      setChatParticipants((prev: any) => !prev);
    }
  };

  const changeImage = async (e: any) => {
    Loading.dots("Оновлення  обл. запису");

    const file = e.target.files[0];
    const fileSize = file.size / 1024;

    if (fileSize > 300) {
      Report.failure("Помилка", "Фото повинно бути менше 300 КБ", "OK");
      Loading.remove();
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "Avatar");

    try {
      const response: any = await imgUpload({ formData, id: userId });

      if ("error" in response) {
        const errorResponse = response as IErrorResponse;

        Report.failure(
          `Помилка оновлення ${errorResponse.error.status.toString()}`,
          errorResponse.error.data.message,
          "OK"
        );
      } else {
        Report.success(`Успішно оновлено`, "", "OK");

        if (response.data.avatar.data) {
          const base64String = uint8ArrayToBase64(
            response.data.avatar.data.data
          );

          socket.emit("userChangeMetaData", meetId, conferenceId, userId, {
            avatar: `data:image/png;base64,${base64String}` || null,
          });

          setMyStream((prev: any) => {
            return {
              [userId]: {
                stream: prev[userId].stream,
                metadata: {
                  ...prev[userId].metadata,
                  avatar: `data:image/png;base64,${base64String}` || null,
                },
              },
            };
          });
        }
      }
    } catch (err) {
      //console.log(err);
    } finally {
      Loading.remove();
    }
  };

  const handleChangeUser = async (values: any) => {
    Loading.dots("Оновлення  обл. запису");

    const confirm = window.confirm("Підтвердити оновлення.");

    if (confirm) {
      try {
        const response = await updateUser({ id: userId, ...values });

        if ("error" in response) {
          const errorResponse = response as IErrorResponse;

          Report.failure(
            `Помилка оновлення ${errorResponse.error.status.toString()}`,
            errorResponse.error.data.message,
            "OK"
          );
        } else {
          Report.success(`Успішно оновлено`, "", "OK");

          const newMetaData = {
            userId: userId,
            username: values.username,
            surname: values.surname,
            avatar: myInfo.avatar || null,
            isCameraOn,
            isMicrophoneOn,
          };

          socket.emit(
            "userChangeMetaData",
            meetId,
            conferenceId,
            userId,
            newMetaData
          );

          setMyStream((prev: any) => {
            return {
              [userId]: {
                stream: prev[userId].stream,
                metadata: newMetaData,
              },
            };
          });
        }
      } catch (err) {
        //console.log(err);
      } finally {
        Loading.remove();
      }
    } else {
      Loading.remove();
      Report.info("Оновлення скасовано", "", "OK");
    }
  };

  const handleChangeComplete = (color: any) => {
    const background = document.querySelector("#root .video-meet");

    if (background && color.hex) {
      setBackground(color.hex);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      background.style.background = color.hex;
    } else {
      const file = color.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const imageUrl = e.target.result.toString();

          if (background) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            background.style.backgroundImage = `url(${imageUrl})`;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            background.style.backgroundSize = "cover";
          }
        }
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="video-meet">
      <Container>
        <VideoList
          streams={
            myStream && remoteStream
              ? [...Object.values(myStream), ...Object.values(remoteStream)]
              : [...Object.values(myStream)]
          }
        />

        <div className="video-control">
          <ul className="list">
            <li
              className={isCameraOn ? "item video active" : "item video"}
              onClick={() => toggleCamera()}
            >
              {isCameraOn ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="33"
                  height="33"
                  viewBox="0 0 33 33"
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
            </li>

            <li
              className={isMicrophoneOn ? "item voice active" : "item voice "}
              onClick={() => toggleMicrophone()}
            >
              {isMicrophoneOn ? (
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
            </li>

            {pathname.split("/")[1] !== "calls" && (
              <li
                className={control.sound ? "item sound active" : "item sound "}
                onClick={() => toggleControl("sound")}
              >
                {control.sound ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="27"
                    height="20"
                    viewBox="0 0 27 20"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.335847 10.0001C0.332127 11.6397 0.258966 13.876 1.27329 14.7119C2.21942 15.4916 2.8853 15.2907 4.61264 15.4174C6.34121 15.5454 9.98931 20.6266 12.8017 19.0194C14.2525 17.8785 14.3603 15.4868 14.3603 10.0001C14.3603 4.5135 14.2525 2.12176 12.8017 0.980903C9.98931 -0.62754 6.34121 4.4549 4.61264 4.58286C2.8853 4.70962 2.21942 4.50871 1.27329 5.28842C0.258966 6.12433 0.332127 8.36061 0.335847 10.0001Z"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M22.5421 1.05045C22.9957 0.735363 23.6189 0.847641 23.9339 1.30123C27.5717 6.53805 27.5842 13.4498 23.9336 18.6982C23.6182 19.1516 22.995 19.2635 22.5416 18.9481C22.0882 18.6327 21.9764 18.0095 22.2917 17.5562C25.4636 12.996 25.4538 6.9948 22.2914 2.44225C21.9763 1.98866 22.0886 1.36553 22.5421 1.05045Z"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19.2784 4.21795C19.7577 3.94357 20.3687 4.1097 20.6431 4.589C22.5674 7.95054 22.5682 12.0591 20.6424 15.4126C20.3674 15.8916 19.7562 16.0569 19.2773 15.7818C18.7983 15.5068 18.633 14.8956 18.9081 14.4167C20.4791 11.6808 20.4799 8.32958 18.9074 5.58262C18.633 5.10331 18.7991 4.49233 19.2784 4.21795Z"
                    />
                  </svg>
                ) : (
                  <svg
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    data-testid="VolumeMuteIcon"
                  >
                    <path d="M7 9v6h4l5 5V4l-5 5z"></path>
                  </svg>
                )}
              </li>
            )}

            <a href="/">
              <li className="item closed">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.9948 19.0476C11.9254 19.0488 15.677 24.6312 10.5403 24.633C5.58709 24.6337 3.66734 25.5612 3.66821 19.2855C3.7454 18.5765 2.44228 12.2782 19.9946 12.2758C37.5492 12.2733 36.2508 18.572 36.3278 19.281C36.328 25.5729 34.4085 24.6286 29.4553 24.6293C24.3175 24.63 28.0641 19.0465 19.9948 19.0476Z"
                    fill="white"
                  />
                </svg>
              </li>
            </a>

            <li
              className={control.screen ? "item screen active" : "item screen"}
              onClick={() => toggleControl("screen")}
            >
              {control.screen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3 9C3 6.79086 4.79086 5 7 5H25C27.2091 5 29 6.79086 29 9V23C29 25.2091 27.2091 27 25 27H7C4.79086 27 3 25.2091 3 23V9ZM16.1332 9.0088C16.3132 9.0328 16.488 9.10589 16.6364 9.22807L22.303 13.8947C22.7293 14.2458 22.7903 14.876 22.4392 15.3024C22.0882 15.7287 21.4579 15.7897 21.0316 15.4386L17 12.1184V21.3333C17 21.8856 16.5523 22.3333 16 22.3333C15.4477 22.3333 15 21.8856 15 21.3333V12.1195L10.9697 15.4386C10.5434 15.7897 9.91315 15.7287 9.56205 15.3024C9.21096 14.876 9.27195 14.2458 9.69828 13.8947L15.342 9.24697C15.5178 9.09318 15.748 9 16 9C15.9998 9 16.0002 9 16 9C16.0443 8.99999 16.0892 9.00293 16.1332 9.0088Z"
                  />
                </svg>
              ) : (
                <svg
                  stroke="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M21.79 18l2 2H24v-2h-2.21zM1.11 2.98l1.55 1.56c-.41.37-.66.89-.66 1.48V16c0 1.1.9 2 2.01 2H0v2h18.13l2.71 2.71 1.41-1.41L2.52 1.57 1.11 2.98zM4 6.02h.13l4.95 4.93C7.94 12.07 7.31 13.52 7 15c.96-1.29 2.13-2.08 3.67-2.46l3.46 3.48H4v-10zm16 0v10.19l1.3 1.3c.42-.37.7-.89.7-1.49v-10a2 2 0 00-2-2H7.8l2 2H20zm-7.07 3.13l2.79 2.78 1.28-1.2L13 7v2.13l-.07.02z"></path>
                </svg>
              )}
            </li>

            <li
              className={
                control.setting ? "item setting active" : "item setting"
              }
              onClick={() => toggleControl("setting")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M26.912 8.72437L27.7419 10.1645V10.1767C28.4349 11.391 28.0212 12.9369 26.8143 13.6428C26.4282 13.8639 26.108 14.1841 25.8868 14.5703C25.5467 15.1541 25.4533 15.8494 25.6274 16.5023C25.8015 17.1551 26.2287 17.7116 26.8143 18.0486C27.4 18.3855 27.8272 18.942 28.0013 19.5948C28.1754 20.2477 28.082 20.943 27.7419 21.5268L26.8632 22.9913C26.1569 24.2055 24.6019 24.6201 23.3849 23.9189C23.0125 23.706 22.5932 23.5886 22.1645 23.5772C21.487 23.5739 20.8363 23.8416 20.3572 24.3206C19.8782 24.7997 19.6105 25.4504 19.6137 26.1279C19.607 27.5318 18.467 28.6664 17.063 28.6664H15.391C13.9823 28.6664 12.8403 27.5244 12.8403 26.1157C12.8358 25.6859 12.7179 25.2649 12.4986 24.8952C12.164 24.3104 11.6097 23.8834 10.9588 23.7093C10.3079 23.5351 9.61445 23.6281 9.0325 23.9677C8.44053 24.2995 7.74072 24.3818 7.08793 24.1963C6.43515 24.0107 5.8832 23.5727 5.55424 22.9791L4.71214 21.5268C4.01198 20.3134 4.42708 18.7623 5.63967 18.0608C6.42888 17.6051 6.91505 16.763 6.91505 15.8518C6.91505 14.9405 6.42888 14.0984 5.63967 13.6428C4.42554 12.9365 4.01089 11.3815 4.71214 10.1645L5.60306 8.69996C6.30516 7.4814 7.86109 7.06103 9.08132 7.76022C9.45095 7.9796 9.87196 8.09748 10.3018 8.10195C11.6963 8.10209 12.8325 6.98224 12.8525 5.58783C12.8492 4.91247 13.1153 4.26364 13.5917 3.78493C14.0681 3.30623 14.7156 3.03711 15.391 3.03711H17.063C17.7524 3.03683 18.4125 3.31559 18.893 3.8099C19.3736 4.30421 19.6335 4.97197 19.6137 5.66106C19.6182 6.09087 19.7361 6.51187 19.9555 6.8815C20.2965 7.46303 20.8548 7.88504 21.5073 8.05446C22.1598 8.22388 22.8529 8.1268 23.4337 7.78463C24.654 7.08543 26.2099 7.50581 26.912 8.72437ZM20 16C20 18.2091 18.2091 20 16 20C13.7909 20 12 18.2091 12 16C12 13.7909 13.7909 12 16 12C18.2091 12 20 13.7909 20 16Z"
                />
              </svg>
            </li>

            {pathname.split("/")[1] !== "calls" && (
              <li
                className={
                  chatParticipants
                    ? "item toggle-menu active"
                    : "item toggle-menu"
                }
                onClick={() => toggleChatParticipants()}
              >
                <svg
                  stroke="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeMiterlimit="10"
                    strokeWidth="32"
                    d="M431 320.6c-1-3.6 1.2-8.6 3.3-12.2a33.68 33.68 0 012.1-3.1A162 162 0 00464 215c.3-92.2-77.5-167-173.7-167-83.9 0-153.9 57.1-170.3 132.9a160.7 160.7 0 00-3.7 34.2c0 92.3 74.8 169.1 171 169.1 15.3 0 35.9-4.6 47.2-7.7s22.5-7.2 25.4-8.3a26.44 26.44 0 019.3-1.7 26 26 0 0110.1 2l56.7 20.1a13.52 13.52 0 003.9 1 8 8 0 008-8 12.85 12.85 0 00-.5-2.7z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeMiterlimit="10"
                    strokeWidth="32"
                    d="M66.46 232a146.23 146.23 0 006.39 152.67c2.31 3.49 3.61 6.19 3.21 8s-11.93 61.87-11.93 61.87a8 8 0 002.71 7.68A8.17 8.17 0 0072 464a7.26 7.26 0 002.91-.6l56.21-22a15.7 15.7 0 0112 .2c18.94 7.38 39.88 12 60.83 12A159.21 159.21 0 00284 432.11"
                  ></path>
                </svg>
              </li>
            )}
          </ul>
        </div>
      </Container>

      <Dialog
        header="Налаштування"
        visible={visible}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
        onHide={() => {
          setVisible(false);
          setControl((prev) => {
            return { ...prev, setting: false };
          });
        }}
      >
        <Row>
          <Col style={{ marginTop: "10px" }}>
            <p>Змінити тему</p>
            <SwatchesPicker
              color={background}
              onChangeComplete={(color) => handleChangeComplete(color)}
            />

            <br />

            <Form.Control
              type="file"
              name="image"
              onChange={(color) => handleChangeComplete(color)}
            />
          </Col>
          <Col style={{ marginTop: "10px" }}>
            <Formik
              initialValues={{
                username: myInfo.username,
                surname: myInfo.surname,
                email: myInfo.email,
                phoneNumber: myInfo.phoneNumber || "",
                region: myInfo.region || "",
                city: myInfo.city || "",
                password: "",
              }}
              onSubmit={handleChangeUser}
            >
              {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <p>Твій профіль</p>

                  <label style={{ width: "100%" }}>
                    Ім'я
                    <Field
                      type="text"
                      name="username"
                      className="form-control"
                      required
                    />
                  </label>

                  <label style={{ width: "100%", marginTop: "20px" }}>
                    Прізвище
                    <Field
                      type="text"
                      name="surname"
                      className="form-control"
                      required
                    />
                  </label>

                  <label style={{ width: "100%", marginTop: "20px" }}>
                    Зображення
                    <Form.Control
                      type="file"
                      name="image"
                      onChange={(e) => changeImage(e)}
                    />
                  </label>
                  <button
                    className="btn btn-outline-primary"
                    type="submit"
                    style={{ width: "100%", marginTop: "37px" }}
                  >
                    Змінити
                  </button>
                </form>
              )}
            </Formik>
          </Col>
        </Row>
      </Dialog>
    </div>
  );
};

export default VideoMeet;

//add sharing screen
