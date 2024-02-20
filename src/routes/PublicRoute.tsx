import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import RegistrationForm from "../pages/MyAccount/RegistrationForm/RegistrationForm";
import AuthForm from "../pages/MyAccount/AuthForm/AuthForm";
import { Loading } from "notiflix";

const PublicRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
    Loading.remove();
  }, []);

  return (
    <div className="publicRoute">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reg-form" element={<RegistrationForm />} />
        <Route path="/auth-form" element={<AuthForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default PublicRoute;
