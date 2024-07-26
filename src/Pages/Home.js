import React, { useState, useEffect, useRef } from "react";
import ScrollReveal from 'scrollreveal';
import LogoSimple from "../Assets/Images/Logo-Simple.png";
import Card0 from "../Assets/Images/banner1.jpeg";
import Card1 from "../Assets/Images/Banner2.jpeg";
import About from "../Assets/Images/about.png";
import EEUU from "../Assets/Images/EEUU.png";
import Peru from "../Assets/Images/Peru.png";
import Venezuela from "../Assets/Images/Venezuela.png";
import Panama from "../Assets/Images/Panama.png";
import Ecuador from "../Assets/Images/Ecuador.png";
import Colombia from "../Assets/Images/Colombia.png";
import Chile from "../Assets/Images/Chile.png";
import { CurrencyCalculator } from "../Components/CurrencyCalculator";
import { FaSmile, FaMoneyBillWave, FaExchangeAlt, FaRocket, FaDollarSign, FaRegSmile, FaCheckCircle, FaRegClock } from "react-icons/fa";
import { Link } from 'react-router-dom';

function Home() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [infoPosition, setInfoPosition] = useState({ top: 0, left: 0 });
  const cardRefs = useRef({});

  const bankData = {
    Venezuela: ['Todos los bancos', 'Pago movil'],
    Colombia: ['Bancolombia', 'Nequi', 'Davivienda', 'Daviplata'],
    EEUU: ['Bank of America', 'Zelle'],
    Ecuador: ['Banco Pichincha', 'Banco del pacifico', 'Produbanco'],
    Peru: ['Credit bank of perú', 'Banco de crédito', 'Interbank', 'Yape', 'BBVA'],
    Panama: ['Banesco', 'Banco general Panamá', 'Banistmo'],
    Chile: ['Banco de falabella', 'Banco de Chile', 'Banco de falabella'],
  };

  const handleCardClick = (country, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setInfoPosition({ top: rect.top + window.scrollY, left: rect.left });
    setSelectedCountry(country);
  };

  const handleClose = () => {
    setSelectedCountry(null);
  };

  useEffect(() => {
    // Inicializa ScrollReveal
    const sr = ScrollReveal({
      origin: 'bottom',
      distance: '50px',
      duration: 1000,
      delay: 200,
      opacity: 0,
      scale: 0.9,
      easing: 'ease-in-out',
    });

    sr.reveal('.reveal', {
      interval: 200
    });

    const counters = document.querySelectorAll('.number');
    const updateCount = (counter) => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const increment = target / 200;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(() => updateCount(counter), 1);
      } else {
        counter.innerText = `+${target}`;
      }
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          updateCount(counter);
          observer.unobserve(counter);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.1
    });

    counters.forEach(counter => {
      observer.observe(counter);
    });

    return () => {
      counters.forEach(counter => {
        observer.unobserve(counter);
      });
    };
  }, []);

  return (
    <div className="Home">
      <h1 className="reveal">
        <span style={{ fontWeight: "600", color: "#70A83B" }}>EUROPA</span>
        <span style={{ fontWeight: "600", color: "#727176" }}>CAMBIOS</span>
        <span style={{ fontWeight: "600", color: "#4972B0" }}>VE</span>
      </h1>
      <h4 className="reveal" style={{ fontWeight: "600", color: "#727176" }}>
        cambios rápidos y seguros
      </h4>
      <img src={LogoSimple} alt="Europa Cambios" width={170} className="reveal" />
      <div className="Buttons">
        <Link to='/Login'>
          <button className="SingIn reveal">Iniciar Sesión</button>
        </Link>
        <Link to='/Login'>
          <button className="SingUp reveal">Registrarse</button>
        </Link>
      </div>

      <div className="Cards">
        <div className="Card reveal">
          <img src={Card0} alt="Card 0" />
        </div>
        <div className="Card reveal">
          <img src={Card1} alt="Card 1" />
        </div>
      </div>
      <CurrencyCalculator />

      <div className="product-section reveal">
        <div className="image-container">
          <img src={About} alt="" className="imagen-about-us" />
        </div>
        <div className="text-container" id="About">
          <h2>Nuestro Producto</h2>
          <div className="feature">
            <div className="feature-icon"><FaCheckCircle color="#70A83B" /></div>
            <div className="feature-text">
              <strong>Envios Seguros</strong>
              <p className="feature-description">Pagos 100 % seguros a todos los bancos en Venezuela.</p>
            </div>
          </div>
          <div className="feature">
            <div className="feature-icon"><FaCheckCircle color="#70A83B" /></div>
            <div className="feature-text">
              <strong>Eficacia y Confianza</strong>
              <p className="feature-description">Nuestro objetivo es que puedas enviar dinero a Venezuela de la manera más sencilla, ya que nosotros nos encargamos de que todos los procesos se ejecuten correctamente, creando para ti una plataforma segura y profesional.</p>
            </div>
          </div>
          <div className="feature">
            <div className="feature-icon"><FaCheckCircle color="#70A83B" /></div>
            <div className="feature-text">
              <strong>Envio Minimo</strong>
              <p className="feature-description">20€</p>
            </div>
          </div>
        </div>
      </div>

      <div className="video-section reveal">
        <div className="video-container">
          <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/zGV6ZL4KDDw" 
            title="Video de YouTube" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
          </iframe>
        </div>
      </div>

      <div className="portafolio reveal">
        <div className="contenedor">
          <h2 className="titulo">Envios a America</h2>
          <div className="galeria-port">
            <div className="imagen-port" ref={(el) => cardRefs.current['Venezuela'] = el} onClick={(e) => handleCardClick('Venezuela', e)}>
              <img src={Venezuela} alt="Venezuela" />
              <div className="hover-galeria">
                <p>Venezuela</p>
              </div>
            </div>
            <div className="imagen-port" ref={(el) => cardRefs.current['Colombia'] = el} onClick={(e) => handleCardClick('Colombia', e)}>
              <img src={Colombia} alt="Colombia" />
              <div className="hover-galeria">
                <p>Colombia</p>
              </div>
            </div>
            <div className="imagen-port" ref={(el) => cardRefs.current['EEUU'] = el} onClick={(e) => handleCardClick('EEUU', e)}>
              <img src={EEUU} alt="EEUU" />
              <div className="hover-galeria">
                <p>Estados Unidos</p>
              </div>
            </div>
            <div className="imagen-port" ref={(el) => cardRefs.current['Ecuador'] = el} onClick={(e) => handleCardClick('Ecuador', e)}>
              <img src={Ecuador} alt="Ecuador" />
              <div className="hover-galeria">
                <p>Ecuador</p>
              </div>
            </div>
            <div className="imagen-port" ref={(el) => cardRefs.current['Peru'] = el} onClick={(e) => handleCardClick('Peru', e)}>
              <img src={Peru} alt="Peru" />
              <div className="hover-galeria">
                <p>Peru</p>
              </div>
            </div>
            <div className="imagen-port" ref={(el) => cardRefs.current['Panama'] = el} onClick={(e) => handleCardClick('Panama', e)}>
              <img src={Panama} alt="Panama" />
              <div className="hover-galeria">
                <p>Panama</p>
              </div>
            </div>
            <div className="imagen-port" ref={(el) => cardRefs.current['Chile'] = el} onClick={(e) => handleCardClick('Chile', e)}>
              <img src={Chile} alt="Chile" />
              <div className="hover-galeria">
                <p>Chile</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedCountry && (
        <div className="bank-info reveal" style={{ top: infoPosition.top, left: infoPosition.left }}>
          <h3>Bancos disponibles en {selectedCountry}</h3>
          <ul>
            {bankData[selectedCountry].map((bank, index) => (
              <li key={index}>{bank}</li>
            ))}
          </ul>
          <button onClick={handleClose}>Cerrar</button>
        </div>
      )}

      <div className="statistics-section reveal">
        <div className="stat">
          <FaSmile size={50} />
          <div className="number" data-target="5000">0</div>
          <p>Clientes Felices</p>
        </div>
        <div className="stat">
          <FaMoneyBillWave size={50} />
          <div className="number" data-target="150000">0</div>
          <p>Transferencias</p>
        </div>
        <div className="stat">
          <FaExchangeAlt size={50} />
          <div className="number" data-target="150">0</div>
          <p>Transacciones diarias</p>
        </div>
      </div>

      <div className="cards-section reveal">
        <div className="card">
          <FaRocket className="card-icon" />
          <h3>Más rápido</h3>
          <p>Tu remesa llega en menos de 2 horas</p>
        </div>
        <div className="card">
          <FaDollarSign className="card-icon" />
          <h3>Mejor tasa</h3>
          <p>Más dinero para tu beneficiario.</p>
        </div>
        <div className="card">
          <FaRegSmile className="card-icon" />
          <h3>Más fácil</h3>
          <p>Envía tu remesa en tres simples pasos.</p>
        </div>
        <div className="card">
          <FaRegClock className="card-icon" />
          <h3>Horario Español</h3>
          <p>Lunes a Sabado: 12:00-22:00</p>
          <p>Domingos cerrados</p>
        </div>
      </div>
    </div>
  );
}

export { Home };
