import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faWhatsapp,faXTwitter } from '@fortawesome/free-brands-svg-icons';
import logo from '../Assets/Images/LogoB.png';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <div className="container">
        <img src={logo} alt="Logo" className="footer-logo" />

        <div className="footer-content1">
          <h3>Contactanos</h3>
          <p>servicio@europacambiosve.com</p>
          <p>+34624377261</p>
          <p>Madrid, España</p>
        </div>

        <div className="footer-content">
          <h3>Enlaces de interes</h3>
          <ul className="list">
            <li><Link to='/'>Inicio</Link></li>
            <li><Link to='/'>Faqs</Link></li>
            <li><Link to='/'>Registro</Link></li>
            <li><Link to='/'>Inicio de sesion</Link></li>
            <li><Link to='/'>Terminos y Condiciones</Link></li>
          </ul>
        </div>

        <div className="footer-content">
          <h3>Follow Us</h3>
          <ul className="social-icons">
            <li><FontAwesomeIcon icon={faInstagram} /></li>
            <li><FontAwesomeIcon icon={faFacebook} /></li>
            <li><FontAwesomeIcon icon={faWhatsapp} /></li>
            <li><FontAwesomeIcon icon={faXTwitter} /></li>
          </ul>
        </div>
      </div>

      <div className="bottom-bar">
        <p>&copy; 2024 EuropaCambiosVe. All rights reserved</p>
      </div>
    </footer>
  );
}

export { Footer };
