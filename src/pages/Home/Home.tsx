import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import About from "./About/About";
import AboutChat from "./AboutChat/AboutChat";
import AboutVideo from "./AboutVideo/AboutVideo";

const Home = () => {
  return (
    <main className="home">
      <Header />

      {/* story about our project */}
      <About />

      {/* story about video technologies */}
      <AboutVideo />

      {/* story about chat technologies */}
      <AboutChat />

      <Footer />
    </main>
  );
};

export default Home;
