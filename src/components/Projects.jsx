import "../styles/Hobbies.css";
import { FaGamepad, FaChess } from "react-icons/fa";
import { TbTicTac } from "react-icons/tb";
import {Link, NavLink} from "react-router-dom";

export default function Projects() {
    const hobbies = [
        { icon: <TbTicTac />, label: "TicTacToe", path: "/ticTacToe" },
        { icon: <FaGamepad />, label: "Game 2048", path: "/Game2048" },
        { icon: <FaChess />, label: "Chess", path: "/Chess" },
    ];

    return (
        <div className="hobbies-container">
            <h2 className="hobbies-title">Projects</h2>
            <div className="hobbies-list">
                {hobbies.map((hobby, index) => (
                    <NavLink
                        key={index}
                        to={hobby.path}
                        className="hobby-card glass-card"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="hobby-icon">{hobby.icon}</div>
                        <div className="hobby-label">{hobby.label}</div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
