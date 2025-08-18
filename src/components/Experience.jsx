import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Experience.css";

const experiences = [
    {
        position: "Consultant",
        company: "Netcompany",
        dates: "03.2025 – present",
        tasks: [
            "Developed and delivered bugfixes based on task specifications and Jira tickets.",
            "Investigated and analyzed application logs using Splunk and Kibana to identify and resolve issues.",
            "Maintained the stability of data flow across distributed systems in a production environment.",
            "Collaborated with the client to diagnose and resolve system behavior anomalies and application errors.",
            "Supported system maintenance and ensured availability of backend services by monitoring integrations.",
            "Participated in daily stand-ups and contributed to ongoing improvement of application reliability."
        ],
    },
    {
        position: "Junior System Administrator",
        company: "T-Mobile",
        dates: "05.2024 – 03.2025",
        tasks: [
            "Creating application for finance sector in Access using VBA",
            "Creating technical documentation for created applications",
            "Creating a macro in excel using VBA",
            "Creating queries to retrieve data from databases using PostgreSQL, Microsoft SQL Server and SQL Developer from Oracle",
            "Validation of data from various databases",
            "Writing procedures in the database to retrieve data for Access applications"
        ],
    },
    {
        position: "Junior Java Developer",
        company: "Bytamic Solutions",
        dates: "09.2023 – 03.2024",
        tasks: [
            "Improving tests by using Mockito framework",
            "Update classes using Spring framework",
            "Using Jenkins to monitor project builds",
            "Using GCP (Google Cloud Platform) to build and test new solutions",
            "Working on the basis of DevOps methodologies",
            "Taking part in daily gatherings and technical conversations related to the project in English.",
        ],
    },
    {
        position: "Junior Java Developer",
        company: "Primaris Services",
        dates: "01.2022 – 03.2023",
        tasks: [
            "Creating queries and querying data in SQL Server database",
            "Programming data mapping in DataWeave (Java Framework)",
            "Consulting integration results with the project team",
            "Creating alerts and ensuring proper monitoring of systems",
            "Working on the basis of DevOps methodologies",
            "Participating in daily meetings and discussions in English on the technical side of the project"
        ],
    },
    {
        position: "IT Intern",
        company: "Domański Zakrzewski Palinka",
        dates: "01.2020 – 12.2021",
        tasks: [
            "Creating small python scripts to fetch data from a page and send it to a database",
            "Creating small macro in Excel by using Visual Basic",
            "Creating macros for company employees in Office programs",
            "Troubleshooting IT systems issues",
            "Collaborate with staff performing tasks in the area of IT infrastructure and systems",
            "Proactively monitoring station systems using monitoring tools and resolving detected problems",
            "Assist users in the use of Excel along with the use of macros at an advanced level",
            "Installing software on workstations",
            "Supporting optimization processes and activities",
            "Assisting in the implementation of InTune, a cloud-based service for managing mobile devices",
            "Managing resources and user accounts from Active Directory and Azure AD in a hybrid structure",
            "Practical application of MDM Intune in the organization"
        ],
    },
    {
        position: "Constructor",
        company: "Planet of Robots",
        dates: "01.2019 – 01.2020",
        tasks: [
            "LEGO MindStorms robot builder",
            "Robot programming",
            "Conducting classes for children on the subject of programming (C++ and Python)\n",
            "Camp educator",
        ],
    },
];

const cardsPerPage = 3;
const Experience = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedCard, setSelectedCard] = useState(null);

    const visibleCards = experiences.slice(currentIndex, currentIndex + cardsPerPage);

    const nextCard = () => {
        if (currentIndex + cardsPerPage < experiences.length) {
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
            <h2 className="experience-title">Experience</h2>

            <div className="experience-list-wrapper">
                <div className="experience-list">
                    <AnimatePresence>
                        {visibleCards.map((exp, index) => (
                            <motion.div
                                key={index}
                                className="experience-card"
                                onClick={() => setSelectedCard(exp)}
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h1 className="experience-position">{exp.position}</h1>
                                <h3 className="experience-company">{exp.company}</h3>
                                <p className="experience-dates">{exp.dates}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="experience-controls">
                    <button onClick={prevCard} disabled={currentIndex === 0}>{"<"}</button>
                    <button onClick={nextCard} disabled={currentIndex + cardsPerPage >= experiences.length}>{">"}</button>
                </div>
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
                            layoutId="selectedCard"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3>{selectedCard.position} – {selectedCard.company}</h3>
                            <p className="experience-dates">{selectedCard.dates}</p>
                            <ul className="experience-tasks">
                                {selectedCard.tasks.map((task, idx) => (
                                    <li key={idx}>{task}</li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Experience;