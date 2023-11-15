import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import RegistrationForm from "../pages/MyAccount/RegistrationForm/RegistrationForm";
import AuthForm from "../pages/MyAccount/AuthForm/AuthForm";

const PublicRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reg-form" element={<RegistrationForm />} />
      <Route path="/auth-form" element={<AuthForm />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoute;
