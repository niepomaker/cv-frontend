import React from "react";
import "../styles/Technologies.css";
import "../styles/Glass.css";

import { FaJava, FaPython, FaGitAlt } from "react-icons/fa";
import {
    SiJavascript,
    SiSpring,
    SiReact,
    SiFlask,
    SiPostgresql,
    SiOracle,
    SiGooglecloud,
    SiJenkins,
    SiPycharm,
    SiIntellijidea,
    SiSwift,
} from "react-icons/si";

import { TbSql } from "react-icons/tb";
import { VscAzureDevops } from "react-icons/vsc";
import { motion } from "framer-motion";

const Technologies = () => {
    return (
        <div className="technologies-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="technologies-title">Technologies</h2>
            </motion.div>
            <div className="technologies-list">
                <div className="glass-card tech-card">
                    <h3 className="technologies-position">Languages & Frameworks</h3>
                    <div className="tech-item"><FaJava /> Java (Spring Boot)</div>
                    <div className="tech-item"><SiReact /> React.js</div>
                    <div className="tech-item"><FaPython /> Python (Flask)</div>
                    <div className="tech-item">
                        <SiPostgresql /> PostgreSQL, <SiOracle /> Oracle, <TbSql  /> MS SQL
                    </div>
                    <div className="tech-item">🧠 VBA (Excel, Access)</div>
                    <div className="tech-item"><SiSwift /> Swift (iOS App – AlkoSearch)</div>
                </div>

                <div className="glass-card tech-card">
                    <h3 className="technologies-position">Tools & Environments</h3>
                    <div className="tech-item"><SiIntellijidea /> IntelliJ IDEA</div>
                    <div className="tech-item"><SiPycharm /> PyCharm</div>
                    <div className="tech-item"><SiGooglecloud /> Google Cloud Platform (GCP)</div>
                    <div className="tech-item"><SiJenkins /> Jenkins</div>
                    <div className="tech-item"><FaGitAlt /> Git </div>
                    <div className="tech-item"><VscAzureDevops /> DevOps methodologies</div>
                </div>
            </div>
        </div>
    );
};

export default Technologies;
