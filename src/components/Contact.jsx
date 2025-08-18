import "../styles/Contact.css";
import {FaEnvelope, FaPhone, FaLinkedin, FaGlobe, FaComments, FaGithub} from "react-icons/fa";

const Contact = () => {
    return (
        <div className="contact-container">
            <h2 className="contact-title">About Me</h2>
            <div className="contact-grid">
                <div className="contact-card glass-card">
                    <h3 className="contact-heading">
                        <FaEnvelope className="icon-inline" /> Contact Info
                    </h3>
                    <ul className="contact-items">
                        <li><strong>Email:</strong> paprotlukasz@gmail.com</li>
                        <li><strong>Phone:</strong> +48 721-053-294</li>
                        <li>
                            <a
                                href="https://www.linkedin.com/in/łukasz-paprot/"
                                target="_blank"
                                rel="noreferrer"
                                className="linkedin-button"
                            >
                                <FaLinkedin className="icon-inline" />
                                LinkedIn Profile
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/niepomaker/"
                                target="_blank"
                                rel="noreferrer"
                                className="linkedin-button"
                            >
                                <FaGithub className="icon-inline" />
                                GitHub Profile
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="contact-card glass-card">
                    <h3 className="contact-heading">
                        <FaGlobe className="icon-inline" /> Languages
                    </h3>
                    <ul className="contact-items bullet-style">
                        <li>English – B2+</li>
                        <li>Polish – native</li>
                    </ul>
                </div>

                <div className="contact-card glass-card">
                    <h3 className="contact-heading">
                        <FaComments className="icon-inline" /> Soft Skills
                    </h3>
                    <ul className="contact-items bullet-style">
                        <li>Teamwork, reliability, responsibility</li>
                        <li>Punctuality and high motivation</li>
                        <li>Willingness to learn</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Contact;
