import "./ActionsBar.scss";

const ActionsBar = () => {
  return (
    <div className="meet-link-action-bar">
      <input className="search" type="text" placeholder="Пошук :" />

      <button className="add-new-meet">Створити зустріч</button>
    </div>
  );
};

export default ActionsBar;
