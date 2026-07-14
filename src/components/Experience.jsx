import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Experience.css";

const experiences = [
    {
        position: "Consultant",
        company: "Netcompany",
        dates: "03.2025 – present",
        tasks: [
            "Developing and maintaining backend applications using Java 17 and Spring Boot.",
            "Delivering bug fixes and implementing changes based on business requirements and Jira tasks.",
            "Investigating and troubleshooting production issues using Splunk and Kibana.",
            "Monitoring and maintaining the stability of data flow across distributed systems.",
            "Collaborating with clients and development teams to analyze and resolve application issues.",
            "Supporting system maintenance and ensuring the availability of backend services and integrations.",
            "Participating in daily stand-ups and contributing to the continuous improvement of application reliability and performance."
        ],
    },
    {
        position: "Junior System Administrator",
        company: "T-Mobile",
        dates: "05.2024 – 02.2025",
        tasks: [
            "Developing internal tools and applications to automate business processes in the financial sector.",
            "Working with relational databases, including PostgreSQL, Microsoft SQL Server, and Oracle Database.",
            "Designing SQL queries and database procedures to support internal applications.",
            "Automating reporting and data-processing tasks using VBA and Microsoft Access.",
            "Preparing technical documentation and validating data consistency across multiple systems.",
            "Collaborating with business stakeholders to deliver reliable and efficient solutions."
        ],
    },
    {
        position: "Junior Java Developer",
        company: "Bytamic",
        dates: "09.2023 – 03.2024",
        tasks: [
            "Developing and maintaining backend components using Java 11 and Spring Boot.",
            "Improving and extending automated tests using Mockito.",
            "Implementing changes and updates based on project requirements.",
            "Using Jenkins to monitor and maintain project builds.",
            "Working with Google Cloud Platform (GCP) to build, test, and deploy solutions.",
            "Collaborating with the development team in an Agile environment and participating in daily stand-ups and technical discussions.",
            "Contributing to code quality and application reliability."
        ],
    },
    {
        position: "Junior Java Developer",
        company: "Primaris Services",
        dates: "01.2022 – 03.2023",
        tasks: [
            "Developing data integration solutions using DataWeave and Java-based technologies.",
            "Writing SQL queries and working with MySQL databases.",
            "Designing and implementing data mappings between different systems.",
            "Monitoring applications and configuring alerts to ensure system reliability.",
            "Collaborating with developers and business teams to validate integration results.",
            "Working according to DevOps and Agile methodologies."
        ],
    },
    {
        position: "IT Intern",
        company: "Domanski Zakrzewski Palinka (DZP)",
        dates: "01.2020 – 12.2021",
        tasks: [
            "Providing technical support and troubleshooting IT infrastructure and system-related issues.",
            "Developing automation scripts in Python to retrieve and process data.",
            "Creating macros and automation tools in Microsoft Excel using VBA.",
            "Supporting employees in the use of advanced Excel functionalities and Office applications.",
            "Collaborating with IT teams to optimize internal processes and improve operational efficiency.",
            "Managing user accounts and organizational resources in Active Directory and Azure Active Directory.",
            "Installing and configuring software on employee workstations.",
            "Supporting mobile device management (MDM) solutions within the organization."
        ],
    }
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