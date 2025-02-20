import React, { useState } from "react";
import Logo from "../../../assets/Applicant/logo-menu.png";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("Home");

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Guidelines", href: "/guidelines" },
    { name: "Application Process", href: "/application" },
    { name: "Contact Support", href: "/support" },
  ];

  return (
    <nav className="bg-gradient-to-r from-[#112951] via-[#112950] to-[#2f80ed] p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="h-13" />
        </div>

        {/* Navigation Links - Modern Style */}
        <div className="flex space-x-6 ml-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setActiveLink(link.name)}
              className={`relative px-4 py-2 rounded-lg transition-all duration-300 text-white/80 hover:text-white 
                ${activeLink === link.name ? "font-semibold" : ""}`}
            >
              {link.name}
              {/* Animated underline for hover and active state */}
              <div
                className={`absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 
                  ${
                    activeLink === link.name ? "w-full" : "group-hover:w-full"
                  } group-hover:left-0`}
              ></div>
            </a>
          ))}
        </div>

        {/* Login Button - Enhanced Look */}
        <div className="flex items-center">
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2.5 rounded-lg 
                           shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center"
          >
            <span>Login</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
