import "./App.css";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import Questions from "./components/Questions";
import Stats from "./components/Stats";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
            </>
          }
        />
        <Route path="/questions" element={<Questions />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
