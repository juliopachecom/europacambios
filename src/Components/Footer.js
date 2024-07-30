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
            <li><Link to='/Faqs'>Preguntas Frecuentes</Link></li>
            <li><Link to='/Register'>Registro</Link></li>
            <li><Link to='/Login'>Inicio de sesion</Link></li>
            <li><Link to='/TermsAndConditions'>Terminos y Condiciones</Link></li>
          </ul>
        </div>

        <div className="footer-content">
          <h3>Redes Sociales</h3>
          <ul className="social-icons">
          <a href="https://wa.me/+34624377261">  <li><FontAwesomeIcon icon={faWhatsapp} /></li></a> 
            <a href="https://facebook.com/p/europacambiosve-100088844974530/"> <li><FontAwesomeIcon icon={faFacebook} /></li></a>
            <a href="https://www.instagram.com/europacambiosve/"><li><FontAwesomeIcon icon={faInstagram} /></li></a>
            <a href="https://x.com/europacambiosve"><li><FontAwesomeIcon icon={faXTwitter}/></li></a>
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
