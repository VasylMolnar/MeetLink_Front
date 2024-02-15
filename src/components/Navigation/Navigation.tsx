import { useState } from "react";
import "./Navigation.scss";
import { NavLink, Outlet } from "react-router-dom";
import { useLogOutUserMutation } from "../../features/auth/authApiSlice";
import { Loading } from "notiflix";
import { useDispatch } from "react-redux";
import { logOut } from "../../features/auth/authSlice";

const Navigation = ({ isMenuOpen, setIsMenuOpen }: any) => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const dispatch = useDispatch();

  //fn Api
  const [logOutUser] = useLogOutUserMutation();

  const toggleMenu = () => {
    const isMobile = window.innerWidth;

    if (isMobile < 577) return;

    setIsMenuOpen(!isMenuOpen);

    const privateRoute = document.querySelector(".privateRoute");

    if (privateRoute && isMenuOpen) {
      // @ts-expect-error: Unreachable code error
      Object.assign(privateRoute.style, {
        paddingInlineStart: "10rem",
        transition: "all 250ms linear",
      });
    } else {
      // @ts-expect-error: Unreachable code error
      Object.assign(privateRoute.style, {
        paddingInlineStart: "17rem",
        transition: "all 250ms linear",
      });
    }
  };

  const handleLogOut = async () => {
    Loading.dots("Вихід з облікового запису");

    try {
      await logOutUser({});
      dispatch(logOut());
    } catch (err) {
      console.log(err);
    } finally {
      Loading.remove();
    }
  };

  return (
    <div className="meet-link-nav-container">
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        version="1.1"
        viewBox="0 0 22 16"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        className={mobileMenu ? "mobile-menu-btn open" : "mobile-menu-btn"}
        onClick={() => setMobileMenu(!mobileMenu)}
      >
        <path d="M0 3h14v3h-14v-3zM0 7h14v3h-14v-3zM0 11h14v3h-14v-3z"></path>
        <path d="M15.5 10l3-3 3 3z"></path>
      </svg>

      <nav className={mobileMenu ? "meet-link-nav open" : "meet-link-nav"}>
        <div className="nav-list">
          <div className="li logo-navbar-toggler" onClick={toggleMenu}>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 440 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              className="img"
            >
              <path d="M382.7 292.5l2.7 2.7-170-167.3c-3.5-3.5-9.7-3.7-13.8-.5L144.3 171c-4.2 3.2-4.6 8.7-1.1 12.2l68.1 64.3c3.6 3.5 9.9 3.7 14 .5l.1-.1c4.1-3.2 10.4-3 14 .5l84 81.3c3.6 3.5 3.2 9-.9 12.2l-93.2 74c-4.2 3.3-10.5 3.1-14.2-.4L63.2 268c-3.5-3.5-9.7-3.7-13.9-.5L3.5 302.4c-4.2 3.2-4.7 8.7-1.2 12.2L211 510.7s7.4 6.8 17.3-.8l198-163.9c4-3.2 4.4-8.7.7-12.2zm54.5-83.4L226.7 2.5c-1.5-1.2-8-5.5-16.3 1.1L3.6 165.7c-4.2 3.2-4.8 8.7-1.2 12.2l42.3 41.7 171.7 165.1c3.7 3.5 10.1 3.7 14.3.4l50.2-38.8-.3-.3 7.7-6c4.2-3.2 4.6-8.7.9-12.2l-57.1-54.4c-3.6-3.5-10-3.7-14.2-.5l-.1.1c-4.2 3.2-10.5 3.1-14.2-.4L109 180.8c-3.6-3.5-3.1-8.9 1.1-12.2l92.2-71.5c4.1-3.2 10.3-3 13.9.5l160.4 159c3.7 3.5 10 3.7 14.1.5l45.8-35.8c4.1-3.2 4.4-8.7.7-12.2z"></path>
            </svg>

            <span className={isMenuOpen ? "text-visible" : "text-hidden"}>
              Meet Link
            </span>
          </div>

          <NavLink
            to="/"
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "li active" : "li"
            }
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M16.67 13.13C18.04 14.06 19 15.32 19 17v3h4v-3c0-2.18-3.57-3.47-6.33-3.87zM15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4c-.47 0-.91.1-1.33.24a5.98 5.98 0 010 7.52c.42.14.86.24 1.33.24zM9 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM9 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H3v-.99C3.2 16.29 6.3 15 9 15s5.8 1.29 6 2v1z"></path>
            </svg>
            <span className={isMenuOpen ? "text-visible" : "text-hidden"}>
              Зустрічі
            </span>
          </NavLink>

          <NavLink
            to="/chats"
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "li active" : "li"
            }
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16 2H8C4.691 2 2 4.691 2 8v13a1 1 0 0 0 1 1h13c3.309 0 6-2.691 6-6V8c0-3.309-2.691-6-6-6zm4 14c0 2.206-1.794 4-4 4H4V8c0-2.206 1.794-4 4-4h8c2.206 0 4 1.794 4 4v8z"></path>
              <path d="M7 9h10v2H7zm0 4h7v2H7z"></path>
            </svg>

            <span className={isMenuOpen ? "text-visible" : "text-hidden"}>
              Повідомлення
            </span>
          </NavLink>

          <NavLink
            to="/calls"
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "li active" : "li"
            }
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="256"
                height="480"
                x="128"
                y="16"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                rx="48"
                ry="48"
              ></rect>
              <path
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M176 16h24a8 8 0 018 8h0a16 16 0 0016 16h64a16 16 0 0016-16h0a8 8 0 018-8h24"
              ></path>
            </svg>

            <span className={isMenuOpen ? "text-visible" : "text-hidden"}>
              Виклики
            </span>
          </NavLink>

          <NavLink
            to="/myAccount"
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "li active" : "li"
            }
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M344 144c-3.92 52.87-44 96-88 96s-84.15-43.12-88-96c-4-55 35-96 88-96s92 42 88 96z"
              ></path>
              <path
                fill="none"
                strokeMiterlimit="10"
                strokeWidth="32"
                d="M256 304c-87 0-175.3 48-191.64 138.6C62.39 453.52 68.57 464 80 464h352c11.44 0 17.62-10.48 15.65-21.4C431.3 352 343 304 256 304z"
              ></path>
            </svg>

            <span className={isMenuOpen ? "text-visible" : "text-hidden"}>
              Профіль
            </span>
          </NavLink>
        </div>

        <button
          className={
            isMenuOpen ? "li logout-btn-visible" : "li logout-btn-hidden"
          }
          onClick={handleLogOut}
        >
          Вихід
        </button>
      </nav>
      <Outlet />
    </div>
  );
};

export default Navigation;
