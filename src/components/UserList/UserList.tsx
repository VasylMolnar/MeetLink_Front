import "./UserList.scss";
import defaultIMG from "../../assets/defaultIMG.png";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../features/auth/authSlice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import Image from "react-bootstrap/Image";

const UserList = ({ userList, adminId, handlerDeleteUser }: any) => {
  const userId = useSelector(selectCurrentUserId);

  const imageBodyTemplate = (img: any) => {
    return (
      <Image
        className="img"
        src={typeof img.avatar === "string" ? img.avatar : defaultIMG}
      />
    );
  };

  return (
    <div className="user-list">
      <DataTable
        value={userList}
        header={""}
        stripedRows
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          field="userId"
          header="Профіль"
          body={(rowData) => (
            <Link to={`/info-user/${rowData._id}`}>Профіль</Link>
          )}
        ></Column>
        <Column header="Аватарка" body={imageBodyTemplate}></Column>
        <Column field="username" header="Ім'я"></Column>
        <Column field="surname" header="Прізвище"></Column>
        <Column field="email" header="Електрона пошта"></Column>

        <Column
          body={(rowData) => (
            <div className="btn-control">
              {userId === adminId && userId !== rowData._id && (
                <Button
                  className="btn btn-danger"
                  onClick={() => handlerDeleteUser(rowData._id)}
                >
                  Видалити
                </Button>
              )}
            </div>
          )}
          headerClassName="w-10rem"
        />
      </DataTable>
    </div>
  );
};

export default UserList;
