import React from "react";
import "../styles/Experience.css";
import {NavLink} from "react-router-dom";

const Home = () => {
    return (
        <div className="experience-container">
            <h2 className="experience-title">Welcome to my page!</h2>
            <div className="experience-list">
                <div className="glass-card">
                    <p>
                        I'm <strong>Łukasz Paprot</strong>, a passionate Java Developer with experience in
                        creating <strong>robust backend systems</strong>, modern web applications
                    </p>

                    <p>
                        As a graduate of the <strong>Master’s program in Computer Science at PJATK</strong>,
                        I bring a solid academic foundation and a strong drive for innovation.
                        I also hold an Engineering degree in <strong>Automation and Robotization of Production Processes</strong>.
                    </p>

                    <p>
                        To enhance my skills, I completed the{" "}
                        <strong>“Weekend Full-Stack Developer”</strong> course at CodeCool, where I developed both
                        technical and soft skills through hands-on projects.
                    </p>

                    <p>
                        Driven by <strong>curiosity</strong> and <strong>ambition</strong>, I taught myself Swift
                        and independently developed an iOS application – <strong>AlkoSearch</strong>.
                        This project showcases my ability to quickly adapt and deliver functional solutions from scratch.
                    </p>

                    <p>
                        Beyond technical proficiency, I am a <strong>supportive and collaborative team player </strong>
                        who values open communication and shared goals. My enthusiasm for learning and self-improvement
                        helps me embrace new challenges and grow both personally and professionally.
                    </p>

                    <p>
                        This is my interactive online CV where you can explore my{" "}
                        <strong>experience</strong>, <strong>education</strong>, <strong>skills</strong> and more.
                    </p>

                    <div className="button-group">
                        <NavLink to="/experience" style={{ textDecoration: "none" }}><button className="nav-button">Experience</button></NavLink>
                        <NavLink to="/education" style={{ textDecoration: "none" }}><button className="nav-button">Education</button></NavLink>
                        <NavLink to="/technologies" style={{ textDecoration: "none" }}><button className="nav-button">Skills & Tools</button></NavLink>
                        <a href="/Łukasz-Paprot_CV.pdf" download style={{ textDecoration: "none" }}>
                            <button className="nav-button">Download CV</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
