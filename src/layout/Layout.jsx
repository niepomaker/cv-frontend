import { Outlet, NavLink } from "react-router-dom";
import "../styles/Glass.css";

const Layout = () => {
  return (
    <div className="app-container">
      <nav className="sidebar">
        <h2 className="logo">Łukasz Paprot</h2>
        <ul>
        <NavLink to="/home" className="nav-button">Home</NavLink>
        <NavLink to="/experience" className="nav-button">Experience</NavLink>
        <NavLink to="/education" className="nav-button">Education</NavLink>
        <NavLink to="/technologies" className="nav-button">Technologies</NavLink>
        <NavLink to="/hobbies" className="nav-button">Hobbies</NavLink>
        <NavLink to="/contact" className="nav-button">About Me</NavLink>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;