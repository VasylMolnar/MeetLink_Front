import Footer from "../../components/Footer/Footer";
import About from "./About/About";
import AboutChat from "./AboutChat/AboutChat";
import AboutVideo from "./AboutVideo/AboutVideo";
import JointWork from "./JointWork/JointWork";

const Home = () => {
  return (
    <main className="home">
      <About />

      <AboutVideo />

      <AboutChat />

      <JointWork />

      <Footer />
    </main>
  );
};

export default Home;
