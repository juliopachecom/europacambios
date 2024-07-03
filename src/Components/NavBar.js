import React, { useState } from "react";
import Logo from "../Assets/Images/Logo.png";
import { IoReorderThree } from "react-icons/io5";

function NavBar({ log }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="NavBar">
      <nav className="Nav">
        <img
          src={Logo}
          alt="EuropaCambiosVe"
          width={window.innerWidth <= 760 ? 75 : 100}
          style={{ cursor: "pointer" }}
          title="EuropaCambiosVe"
        />
        {window.innerWidth > 760 ? (
          <ul>
            <ul className="list">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            </ul>
            <li>
              <button className="SingIn">Sing In</button>
            </li>
            <li>
              <button className="SingUp">Register</button>
            </li>
          </ul>
        ) : (
          <button className="OrderBurger" onClick={toggleMenu}>
            <IoReorderThree size={30} />
          </button>
        )}
      </nav>
      <div className={`Collapse ${isMenuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
          <li>
            <button className="SingIn">Sing In</button>
          </li>
          <li>
            <button className="SingUp">Register</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export { NavBar };
