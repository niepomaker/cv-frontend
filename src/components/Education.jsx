import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Experience.css"; // używamy tego samego CSS dla spójności

const educationData = [
    {
        school: "Polish-Japanese Academy of Information Technology",
        field: "Computer Science",
        degree: "Master",
        years: "2023 – 2025",
        grade: 5.0,
        details: [
            "Specialization: Engineering of software, business processes and databases",
            "Thesis: Automate code creation in IntelliJ environments – plugin generating controller structures based on data model",
        ],
    },
    {
        school: "Codecool Polska",
        field: "Weekend Full-Stack Developer Program",
        degree: "Course",
        years: "2020 – 2021",
        grade: "n/a",
        details: [
            "ProgBasics – Python",
            "Web – Python, Flask, HTML, CSS, JavaScript",
            "OOP – Java",
            "Advanced – Java, Spring, React.js",
            "13 projects, over 900h total",
        ],
    },
    {
        school: "Warsaw University of Technology",
        field: "Automation and Robotization of Production Processes",
        degree: "Bachelor",
        years: "2016 – 2022",
        grade: 4.5,
        details: [
            "Faculty: Mechanical and Industrial Engineering",
            "Mid-thesis: Automation of the extrusion process",
            "Final thesis: Identification of industrial product markings using vision technology",
        ],
    }
];
const cardsPerPage = 3;

const Education = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedCard, setSelectedCard] = useState(null);

    const visibleCards = educationData.slice(currentIndex, currentIndex + cardsPerPage);

    const nextCard = () => {
        if (currentIndex + cardsPerPage < educationData.length) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="experience-container">
            <h2 className="experience-title">Education</h2>

            <div className="experience-list-wrapper">
                <div className="experience-list">
                    <AnimatePresence>
                        {visibleCards.map((edu, index) => (
                            <motion.div
                                key={index}
                                className="experience-card"
                                onClick={() => setSelectedCard(edu)}
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h1 className="experience-position">{edu.field}</h1>
                                <h3 className="experience-company">{edu.school}</h3>
                                <p className="experience-dates">{edu.years}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {educationData.length > cardsPerPage && (
                    <div className="experience-controls">
                        <button onClick={prevCard} disabled={currentIndex === 0}>{"<"}</button>
                        <button onClick={nextCard} disabled={currentIndex + cardsPerPage >= educationData.length}>{">"}</button>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedCard && (
                    <motion.div
                        className="expanded-card-overlay"
                        onClick={() => setSelectedCard(null)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="expanded-card"
                            layoutId="selectedEduCard"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3>{selectedCard.field} – {selectedCard.school}</h3>
                            <p className="education-grade"><strong>Degree:</strong> {selectedCard.degree}</p>
                            <p className="education-grade"><strong>Final grade:</strong> {selectedCard.grade}</p>
                            <p className="experience-dates">{selectedCard.years}</p>
                            <ul className="experience-tasks">
                                {selectedCard.details.map((detail, idx) => (
                                    <li key={idx}>{detail}</li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Education;