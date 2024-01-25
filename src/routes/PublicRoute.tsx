import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import RegistrationForm from "../pages/MyAccount/RegistrationForm/RegistrationForm";
import AuthForm from "../pages/MyAccount/AuthForm/AuthForm";

const PublicRoute = () => {
  useEffect(() => {
    window.document.body.style.backgroundImage =
      "linear-gradient(#d3d8df,#bbc8dc,#a4b9d9,#8ea9d6,#7899d3,#698ac6,#597bb8,#4a6cab,#3e5b91,#324b78,#273b60,#1c2c49)";

    return () => {
      window.document.body.style.backgroundImage = "";
    };
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
