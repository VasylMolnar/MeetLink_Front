import "./Home.scss";
import { IParallax, Parallax, ParallaxLayer } from "@react-spring/parallax";
import Footer from "../../components/Footer/Footer";
import About from "./About/About";
import AboutChat from "./AboutChat/AboutChat";
import AboutVideo from "./AboutVideo/AboutVideo";
import { useRef } from "react";

const Home = () => {
  const parallax = useRef<IParallax>(null!);

  return (
    <main className="home">
      <Parallax ref={parallax} pages={4}>
        {/* story about our project */}
        <ParallaxLayer offset={0} speed={0} factor={2}>
          <About />
        </ParallaxLayer>

        {/* story about video technologies */}
        <ParallaxLayer offset={1} speed={1.5}>
          <AboutVideo />
        </ParallaxLayer>

        {/* story about chat technologies */}
        <ParallaxLayer offset={2} speed={2.5}>
          <AboutChat />
        </ParallaxLayer>

        <ParallaxLayer offset={3} speed={1}>
          <Footer />
        </ParallaxLayer>
      </Parallax>
    </main>
  );
};

export default Home;
