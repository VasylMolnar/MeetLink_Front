import "./ActionsBar.scss";
import { Link } from "react-router-dom";

const ActionsBar = ({ setVisible, searchValue, setSearchValue }: any) => {
  return (
    <div className="meet-link-action-bar">
      <input
        className="search"
        type="text"
        placeholder="Пошук :"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <div className="btn-list">
        <button className="add-new-meet" onClick={() => setVisible(true)}>
          Приєднатись
        </button>

        <Link to="create-meet">
          <button className="add-new-meet">Створити</button>
        </Link>
      </div>
    </div>
  );
};

export default ActionsBar;
