import React from "react";
import "../styles/Experience.css";
import { NavLink } from "react-router-dom";

const Home = () => {
    return (
        <div className="experience-container">
            <h2 className="experience-title">Welcome to my portfolio</h2>

            <div className="experience-list">
                <div className="glass-card">
                    <p>
                        Java Developer with nearly four years of commercial experience in software
                        development, specializing in backend applications built with <strong>Java</strong> and <strong>Spring</strong>
                        technologies. Throughout my career, I have worked on enterprise systems,
                        distributed architectures, and data integrations, collaborating with
                        international teams in <strong>Agile</strong> environments.
                    </p>

                    <p>
                        My professional experience includes developing and maintaining applications,
                        investigating production issues using tools such as <strong>Splunk</strong> and <strong>Kibana</strong>,
                        working with relational databases, and supporting cloud-based solutions.
                        I have also gained hands-on experience with technologies including
                        <strong> PostgreSQL</strong>, <strong>Oracle</strong>, <strong>GCP</strong>, <strong>Jenkins</strong>, <strong>Mockito</strong> and <strong>Git</strong>.
                    </p>

                    <p>
                        In addition to my professional work, I hold a Master’s degree in Computer
                        Science and an Engineering degree in Automation and Robotics. I am passionate
                        about software engineering and continuously expand my knowledge by exploring
                        new technologies and building personal projects, such as my iOS application,
                        <strong> AlkoSearch</strong>.
                    </p>

                    <p>
                        I enjoy solving complex problems, learning new concepts, and working
                        collaboratively to deliver reliable and high-quality solutions.
                    </p>

                    <div className="button-group">
                        <NavLink
                            to="/experience"
                            style={{ textDecoration: "none" }}
                        >
                            <button className="nav-button">Experience</button>
                        </NavLink>

                        <NavLink
                            to="/education"
                            style={{ textDecoration: "none" }}
                        >
                            <button className="nav-button">Education</button>
                        </NavLink>

                        <NavLink
                            to="/technologies"
                            style={{ textDecoration: "none" }}
                        >
                            <button className="nav-button">Skills & Tools</button>
                        </NavLink>

                        <a
                            href="/Łukasz-Paprot_CV.pdf"
                            download
                            style={{ textDecoration: "none" }}
                        >
                            <button className="nav-button">Download CV</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;