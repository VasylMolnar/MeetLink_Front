import "./NotFound.scss";
import { Link } from "react-router-dom";
import Image from "react-bootstrap/Image";
import img404 from "../../assets/404.jpg";
import { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    const privateRoute = document.querySelector(".privateRoute");

    // @ts-expect-error: Unreachable code error
    if (privateRoute) privateRoute.style.paddingInlineStart = "0";

    return () => {
      // @ts-expect-error: Unreachable code error
      if (privateRoute) privateRoute.style.paddingInlineStart = "20rem";
    };
  }, []);

  return (
    <div className="page-404 text-center">
      <div className="container">
        <div className="page-404-img">
          <Image src={img404} alt="Not found" />
        </div>
        <h3 className="page-404-title">Упс, такої сторінки не існує!</h3>
        <h4>Сторінку було видалено або адреса виявилася неправильною</h4>
        <Link to="/" className="page-404-link">
          Повернутися на головну сторінку
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
