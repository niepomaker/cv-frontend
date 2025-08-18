import "../styles/Hobbies.css";
import { FaStar, FaFlask, FaPlane, FaDumbbell, FaGamepad } from "react-icons/fa";

export default function Hobbies() {
    const hobbies = [
        { icon: <FaStar />, label: "Astronomy" },
        { icon: <FaFlask />, label: "Mathematics & Physics" },
        { icon: <FaPlane />, label: "Traveling" },
        { icon: <FaDumbbell />, label: "Gym" },
        { icon: <FaGamepad />, label: "Computer games" },
    ];

    return (
        <div className="hobbies-container">
            <h2 className="hobbies-title">Hobbies & Interests</h2>
            <div className="hobbies-list">
                {hobbies.map((hobby, index) => (
                    <div key={index} className="hobby-card glass-card">
                        <div className="hobby-icon">{hobby.icon}</div>
                        <div className="hobby-label">{hobby.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
