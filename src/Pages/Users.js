import React, { useState } from 'react';
import { FaUserCircle, FaInfoCircle, FaWhatsapp } from 'react-icons/fa';
import { SideBar } from '../Components/Sidebar';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function Users() {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const users = [
    {
      name: "Jose Portillo",
      email: "jose@creative-tim.com",
      status: "Verificado",
      employed: "23/04/18"
    },
    {
      name: "Alexa Liras",
      email: "alexa@creative-tim.com",
      status: "Pendiente verificación",
      employed: "11/01/19"
    },
    {
      name: "Julio Pacheco",
      email: "julio@creative-tim.com",
      status: "No verificado",
      employed: "11/01/19"
    },
  ];

  return (
    <div className="dashboard-container">
      <SideBar />
      <div className="content">
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-center mb-3">
            <Button color="primary" onClick={toggle}>Abrir Modal</Button>
          </div>
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                <h6 className="text-white text-capitalize ps-3">Usuarios</h6>
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              <div className="table-responsive p-0">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Nombre</th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Email</th>
                      <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Estado</th>
                      <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Fecha de Empleo</th>
                      <th className="text-secondary opacity-7"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex px-2 py-1">
                            <div>
                              <FaUserCircle className="avatar avatar-sm me-3 border-radius-lg" />
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                              <h6 className="mb-0 text-sm">{user.name}</h6>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="text-xs font-weight-bold mb-0">{user.email}</p>
                        </td>
                        <td className="align-middle text-center text-sm">
                          <span className={`badge badge-sm ${user.status === 'Verificado' ? 'bg-gradient-success' :
                            user.status === 'Pendiente verificación' ? 'bg-gradient-verification' :
                              user.status === 'No verificado' ? 'bg-gradient-warning' : ''}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="align-middle text-center">
                          <span className="text-secondary text-xs font-weight-bold">{user.employed}</span>
                        </td>
                        <td className="align-middle">
                          <Button color="warning">
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={modal} toggle={toggle} centered>
          <ModalHeader toggle={toggle}>
            <FaInfoCircle /> Información
          </ModalHeader>
          <ModalBody className="text-center">
            Los cambios estarán próximamente habilitados. Mantente informado.
            <br />
            Puedes realizar los cambios por 
            <a href="https://wa.me/tu-numero-de-whatsapp" target="_blank" className="whatsapp-btn">
              <FaWhatsapp /> WhatsApp
            </a>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>Cerrar</Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}

export { Users };
