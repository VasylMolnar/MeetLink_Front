import "./UserList.scss";
import { Avatar } from "@mui/material";
import defaultIMG from "../../assets/defaultIMG.png";
import { IUser } from "../../types/authTypes";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../features/auth/authSlice";

const UserList = ({ userList, adminId, handlerDeleteUser }: any) => {
  const userId = useSelector(selectCurrentUserId);

  return (
    <div className="user-list">
      {userList.map((user: IUser) => (
        <div className="user-info" key={user._id as string}>
          <Avatar
            className="img"
            src={typeof user.avatar === "string" ? user.avatar : defaultIMG}
            sx={{ width: 200, height: 200 }}
          />

          <p
            style={{
              marginTop: "30px",
              marginBottom: "30px",
            }}
          >
            {user.username + " " + user.surname}
          </p>

          <p
            style={{
              marginTop: "30px",
              marginBottom: "30px",
            }}
          >
            {user.email}
          </p>

          <p
            style={{
              marginTop: "30px",
              marginBottom: "30px",
            }}
          >
            {user.phoneNumber}
          </p>

          {userId === adminId && userId !== user._id && (
            <Button
              className="btn btn-danger"
              onClick={() => handlerDeleteUser(userId)}
            >
              Видалити
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserList;
