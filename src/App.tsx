import "./App.scss";
import { BrowserRouter as Router } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./features/auth/authSlice";

function App() {
  const isAuth = useSelector(selectCurrentToken);

  return <Router>{isAuth ? <PrivateRoute /> : <PublicRoute />}</Router>;
}

export default App;
