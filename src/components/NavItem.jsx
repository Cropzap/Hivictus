import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Navbar.module.css"; // ✅ Import CSS module

const NavItem = ({ to, icon, label, activeTab, setActiveTab, onClick }) => {
  const isActive = to === activeTab;

  const handleClick = () => {
    if (onClick) return onClick();
    setActiveTab(to);
  };

  // Determine whether we're in desktop or mobile layout by checking parent class via CSS
  const isMobile = window.innerWidth < 768; // Rough check for conditional styling

  return (
    <Link
      to={to || "#"}
      onClick={handleClick}
      className={`${isMobile ? styles["mobile-nav-item"] : styles["navbar-link"]} ${
        isActive ? "active" : ""
      }`}
    >
      <motion.div
        animate={isActive ? { scale: 1.3 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {icon}
      </motion.div>
      <span>{label}</span>
    </Link>
  );
};

export default NavItem;
