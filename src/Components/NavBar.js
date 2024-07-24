import React, { useState } from "react";
import Logo from "../Assets/Images/Logo.png";
import { IoReorderThree } from "react-icons/io5";
import { useDataContext } from '../Context/dataContext';
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { clearLocalStorage } from '../Hooks/useLocalStorage';

function NavBar() {
  const { logged } = useDataContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const clearLocal = () => {
    clearLocalStorage();
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };

  const renderMenuItems = () => {
    if (!logged) {
      return (
        <>
          <ul className="list">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="#about">Nosotros</Link></li>
            <li><a href="https://wa.me/624377261">Contacto</a></li>
            <li><Link to="/Login"><button className="SingIn">Iniciar Sesion</button></Link></li>
            <li><Link to="/Register"><button className="SingUp">Registro</button></Link></li>
          </ul>
        </>
      );
    }

    return (
      <>
        <ul className="list">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/Faqs">Faqs</Link></li>
            <li><Link to="/Movements">Movimientos</Link></li>
            <li><Link to="/Changes"><button className="log-btn">Cambios</button></Link></li>
            <FiLogOut style={{ fontSize: '2em', marginTop: '.2em', color: '#409192', cursor: 'pointer' }} onClick={clearLocal} />
        </ul>
      </>
    );
  };

  return (
    <div className="NavBar">
      <nav className="Nav">
        <Link to="/">
          <img
            src={Logo}
            alt="EuropaCambiosVe"
            width={window.innerWidth <= 760 ? 75 : 100}
            style={{ cursor: "pointer" }}
            title="EuropaCambiosVe"
          />
        </Link>
        {window.innerWidth > 760 ? (
          <ul className="menu-list">
            {renderMenuItems()}
          </ul>
        ) : (
          <button className="OrderBurger" onClick={toggleMenu}>
            <IoReorderThree size={30} />
          </button>
        )}
      </nav>
      {isMenuOpen && (
        <div className={`Collapse ${isMenuOpen ? "open" : ""}`}>
          <ul className="mobile-menu">
            {renderMenuItems()}
          </ul>
        </div>
      )}
    </div>
  );
}

export { NavBar };
