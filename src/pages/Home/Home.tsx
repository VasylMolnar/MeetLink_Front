import "./Home.scss";
import { useRef } from "react";
import { IParallax, Parallax, ParallaxLayer } from "@react-spring/parallax";
import Footer from "../../components/Footer/Footer";
import About from "./About/About";
import AboutChat from "./AboutChat/AboutChat";
import AboutVideo from "./AboutVideo/AboutVideo";
import ChooseUs from "./ChooseUs/ChooseUs";
import sun from "../../assets/sun1.png";
import earth from "../../assets/earth1.png";

const Home = () => {
  const parallax = useRef<IParallax>(null!);
  const url = (name: string, wrap = false) =>
    `${
      wrap ? "url(" : ""
    }https://awv3node-homepage.surge.sh/build/assets/${name}.svg${
      wrap ? ")" : ""
    }`;

  return (
    <main className="home">
      <Parallax ref={parallax} pages={4}>
        <ParallaxLayer offset={0} speed={0} style={{ zIndex: 1 }}>
          <About />
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={0.3} style={{ zIndex: 1 }}>
          <AboutVideo />
        </ParallaxLayer>

        <ParallaxLayer offset={2} speed={0.3} style={{ zIndex: 1 }}>
          <AboutChat />
        </ParallaxLayer>

        <ParallaxLayer offset={3} speed={0.3} style={{ zIndex: 1 }}>
          <ChooseUs />
        </ParallaxLayer>

        <ParallaxLayer
          offset={3.5}
          speed={-0.4}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <img
            src={earth}
            style={{ width: "40%", marginBottom: "350px" }}
            className="earth"
          />
        </ParallaxLayer>

        <ParallaxLayer offset={4} speed={-0.06} style={{ zIndex: 1 }}>
          <Footer />
        </ParallaxLayer>

        {/* stars */}
        <ParallaxLayer
          offset={0}
          speed={0}
          factor={4}
          style={{
            zIndex: 0,
            backgroundImage: url("stars", true),
            backgroundSize: "cover",
          }}
        />

        {/* cloud */}
        <ParallaxLayer offset={1.6} speed={-0.1} style={{ opacity: 0.4 }}>
          <img
            src={url("cloud")}
            style={{ display: "block", width: "10%", marginLeft: "80%" }}
          />
          <img
            src={url("cloud")}
            style={{ display: "block", width: "15%", marginLeft: "15%" }}
          />
          <img
            src={url("cloud")}
            style={{ display: "block", width: "7%", marginLeft: "1%" }}
          />
        </ParallaxLayer>

        {/* cloud */}
        <ParallaxLayer offset={3} speed={0.8} style={{ opacity: 0.2 }}>
          <img
            src={url("cloud")}
            style={{ display: "block", width: "20%", marginLeft: "55%" }}
          />
          <img
            src={url("cloud")}
            style={{ display: "block", width: "10%", marginLeft: "15%" }}
          />
        </ParallaxLayer>
        <ParallaxLayer offset={3.6} speed={-0.1} style={{ opacity: 0.4 }}>
          <img
            src={url("cloud")}
            style={{ display: "block", width: "20%", marginLeft: "60%" }}
          />
          <img
            src={url("cloud")}
            style={{ display: "block", width: "25%", marginLeft: "30%" }}
          />
          <img
            src={url("cloud")}
            style={{ display: "block", width: "10%", marginLeft: "80%" }}
          />
        </ParallaxLayer>

        {/* sun */}
        <ParallaxLayer offset={3.4} speed={-0.3} style={{ opacity: 0.7 }}>
          <img
            src={sun}
            style={{ display: "block", width: "10%", marginLeft: "73%" }}
            className="sun"
          />
        </ParallaxLayer>
      </Parallax>
    </main>
  );
};

export default Home;
