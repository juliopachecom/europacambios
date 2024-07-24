import React, { useState } from 'react';
import { FaTachometerAlt, FaUser, FaUserCheck, FaUserTimes, FaBars, FaOutdent } from 'react-icons/fa';

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`SideBar ${collapsed ? 'collapsed' : ''}`}>
      <button className="collapse-toggle" onClick={toggleCollapse}>
        <FaBars />
      </button>
      <div className="SideBar-Items">
        <div className="SideBar-Categories">
          <div className="Categories">
            <section>
              <div className="list">
                <div className="item">
                  <div className="content">
                    <FaTachometerAlt className="icon" />
                    <span>Panel de control</span>
                  </div>
                </div>
                <div className="item">
                  <div className="content">
                    <FaUser className="icon" />
                    <span>Lista de usuarios</span>
                  </div>
                </div>
                <div className="item">
                  <div className="content">
                    <FaUserCheck className="icon" />
                    <span>Usuarios verificados</span>
                  </div>
                </div>
                <div className="item">
                  <div className="content">
                    <FaUserTimes className="icon" />
                    <span>Usuarios no verificados</span>
                  </div>
                </div>
                <div className="item">
                  <div className="content">
                    <FaUser className="icon" />
                    <span>Relación</span>
                  </div>
                </div>
                <div className="item">
                  <div className="content">
                    <FaOutdent className="icon" />
                    <span>Salir</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export { SideBar };
