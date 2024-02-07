import "./App.scss";
import { BrowserRouter as Router } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

function App() {
  const isAuth = false;

  return <Router>{isAuth ? <PrivateRoute /> : <PublicRoute />}</Router>;
}

export default App;
