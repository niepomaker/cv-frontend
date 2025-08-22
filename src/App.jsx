import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./components/Home";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Technologies from "./components/Technologies";
import Hobbies from "./components/Hobbies";
import Contact from "./components/Contact";
import "./styles/Glass.css";
import TicTacToe from "./components/TicTacToe";
import Game2048 from "./components/Game2048";
import Projects from "./components/Projects";
import ChessAI from "./components/Chess";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/education" element={<Education />} />
          <Route path="/technologies" element={<Technologies />} />
          <Route path="/hobbies" element={<Hobbies />} />
          <Route path="/ticTacToe" element={<TicTacToe />} />
          <Route path="/game2048" element={<Game2048 />} />
          <Route path="/chess" element={<ChessAI />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;