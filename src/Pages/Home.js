import React from "react";
import LogoSimple from "../Assets/Images/Logo-Simple.png";
import Card0 from "../Assets/Images/card0.jpg";
import Card1 from "../Assets/Images/card1.jpg";
import Card2 from "../Assets/Images/card2.jpg";
import Card3 from "../Assets/Images/card3.jpg";
import Card4 from "../Assets/Images/card4.jpg";
import Card5 from "../Assets/Images/card5.jpg";
import About from "../Assets/Images/about.png";
import EEUU from "../Assets/Images/EEUU.png";
import Peru from "../Assets/Images/Peru.png";
import Venezuela from "../Assets/Images/Venezuela.png";
import Panama from "../Assets/Images/Panama.png";
import Ecuador from "../Assets/Images/Ecuador.png";
import Colombia from "../Assets/Images/Colombia.png";
import Chile from "../Assets/Images/Chile.png";

function Home() {
  return (
    <div className="Home">
      <h1>
        <span style={{ fontWeight: "600", color: "#70A83B" }}>EUROPA</span>
        <span style={{ fontWeight: "600", color: "#727176" }}>CAMBIOS</span>
        <span style={{ fontWeight: "600", color: "#4972B0" }}>VE</span>
      </h1>
      <h4 style={{ fontWeight: "600", color: "#727176" }}>
        cambios rápidos y seguros
      </h4>
      <img src={LogoSimple} alt="Europa Cambios" width={170} />
      <div className="Buttons">
        <button className="SingIn">Sing In</button>
        <button className="SingUp">Register</button>
      </div>

      <div className="Cards">
        <div className="Card">
          <img src={Card0} alt="Card 0" />
        </div>
        <div className="Card">
          <img src={Card1} alt="Card 1" />
        </div>
        <div className="Card">
          <img src={Card5} alt="Card 5" />
        </div>
        <div className="Card">
          <img src={Card2} alt="Card 2" />
        </div>
        <div className="Card">
          <img src={Card3} alt="Card 3" />
        </div>
        <div className="Card">
          <img src={Card4} alt="Card 4" />
        </div>
      </div>

      <div className="sobre-nosotros">
        <h2 className="titulo">Nuestro producto</h2>
        <div className="contenedor-sobre-nosotros">
          <img src={About} alt="" className="imagen-about-us" />
          <div className="contenido-textos">
            <h3><span></span>ENVIOS SEGUROS</h3>
            <p>PAGOS 100 % SEGUROS A TODOS LOS BANCOS EN VENEZUELA.</p>
            <h3><span></span>EFICACIA Y CONFIANZA</h3>
            <p>NUESTRO OBJETIVO ES QUE PUEDAS ENVIAR DINERO A VENEZUELA DE LA MANERA MAS SENCILLA, YA QUE NOSOTROS NOS ENCARGAMOS DE QUE TODOS LOS PROCESOS SE EJECUTEN CORRECTAMENTE, CREANDO PARA TI UNA PLATAFORMA SEGURA Y PROFESIONAL. </p>
          </div>
        </div>
      </div>

      <div className="portafolio">
            <div className="contenedor">
                <h2 className="titulo">Envios a America</h2>
                <div className="galeria-port">
                    <div className="imagen-port">
                        <img src={Venezuela} alt=""/>
                        <div className="hover-galeria">
                            <p>Venezuela</p>
                        </div>
                    </div>
                    <div className="imagen-port">
                        <img src={Colombia} alt=""/>
                        <div className="hover-galeria">
                            <p>Colombia</p>
                        </div>
                    </div>
                    <div className="imagen-port">
                    <img src={EEUU} alt=""/>
                        <div className="hover-galeria">
                            <p>Estados Unidos</p>
                        </div>
                    </div>
                    <div className="imagen-port">
                    <img src={Ecuador} alt=""/>
                        <div className="hover-galeria">
                            <p>Ecuador</p>
                        </div>
                    </div>
                    <div className="imagen-port">
                    <img src={Peru} alt=""/>
                        <div className="hover-galeria">
                            <p>Peru</p>
                        </div>
                    </div>
                    <div className="imagen-port">
                    <img src={Panama} alt=""/>
                        <div className="hover-galeria">
                            <p>Panama</p>
                        </div>
                    </div>
                    <div className="imagen-port">
                    <img src={Chile} alt=""/>
                        <div className="hover-galeria">
                            <p>Chile</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

  );

}

export { Home };
