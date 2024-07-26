import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDataContext } from "../Context/dataContext";
import {
  Row,
  Col,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
} from "reactstrap";
// import arrowup from "../Assets/Images/arrowup.png";
// import arrowdown from "../Assets/Images/arrowdown.png";
// import clock from "../Assets/Images/clock.png";
import bolivares from "../Assets/Images/bolivar.png";
import VerificationImage from "../Assets/Images/warning.png";
import dniverify from "../Assets/Images/dniverify.jpeg";
import dni from "../Assets/Images/dni.png";
import { Link } from "react-router-dom";
// import { clearLocalStorage } from "../Hooks/useLocalStorage";
import { FixeedAlert } from "../Components/FixeedAlert";
import { clearLocalStorage } from "../Hooks/useLocalStorage";
import { FaExclamationCircle, FaInfoCircle, FaWhatsapp } from 'react-icons/fa';


function Changes() {
  const { logged, infoTkn, url } = useDataContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [fifthModalOpen, setFifthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const [user, setUser] = useState({});

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const [use_dni, setUseDNI] = useState("");
  const [use_phone, setUsePhone] = useState("");
  const [use_img, setUseImg] = useState("");
  const [use_imgDni, setUseImgDni] = useState("");
  const [termsCheckbox, setTermsCheckbox] = useState(false);
  const [modal, setModal] = useState(false);
  const [currencyPrice, setCurrencyPrice] = useState([]);

  const toggle = () => setModal(!modal);



  const fetchCurrencyData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/currencyPrice`);
      setCurrencyPrice(response.data); // Asegúrate de que esto se está estableciendo correctamente
    } catch (error) {
      console.log(error);
    }
  }, [setCurrencyPrice, url]);



  const clearLocal = () => {
    clearLocalStorage();
    setTimeout(() => {
      window.location.href = "/Login";
    }, 500);
  };

  const toggleModal = useCallback(() => {
    setModalOpen(!modalOpen);
  }, [modalOpen]);

  const toggleSecondModal = () => {
    setModalOpen(false);
    setSecondModalOpen(!secondModalOpen);
    document.body.style.paddingRight = "0";
  };

  const toggleFifthModal = () => {
    setSecondModalOpen(false);
    setFifthModalOpen(!fifthModalOpen);
    document.body.style.paddingRight = "0";
  };

  const fetchDataUser = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Auth/findByToken/${infoTkn}`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setUser(response.data);

      if (response.data.use_verif === "N") {
        setAlertMessage(
          <span style={{ cursor: "pointer" }} onClick={toggleModal}>
            Usuario no verificado
          </span>
        );
        setAlertType("error");
      } else if (response.data.use_verif === "E") {
        setAlertMessage("Usuario en proceso de verificación");
        setAlertType("info");
      } else if (response.data.use_verif === "S") {
        setAlertMessage("Usuario verificado");
        setAlertType("success");
      }
      setShowAlert(true);
    } catch (error) {
      console.log(error);
    }
  }, [setUser, infoTkn, url, toggleModal]);

  const handleSubmitVerifyDni = () => {
    const formData = new FormData();
    formData.append("use_imgDni", use_imgDni);

    try {
      axios.put(`${url}/Users/dni/${user.use_id}`, formData, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Request edit successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmitVerify = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("use_dni", use_dni);
    formData.append("use_img", use_img);
    formData.append("use_phone", use_phone);
    formData.append("use_verif", "E");

    setLoading(true);

    try {
      await axios.put(`${url}/Users/${user.use_id}`, formData, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
          "Content-Type": "multipart/form-data",
        },
      });

      handleSubmitVerifyDni();
      toggleSecondModal();

      console.log("Request edit successfully");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencyData();
    fetchDataUser();
  }, [fetchCurrencyData, fetchDataUser]);

  return (
    <div className="Changes container px-5 py-4 my-5">
      <Row>{/* Placeholder for potential content */}</Row>
      {logged ? (
        user.use_verif === "S" ? (
          <Row>
            <Col md="12">
              <Row>
                <Col md="6" className="d-flex flex-column h-110">
                  <div className="p-4 d-flex flex-column purple-bg-color round-corner h-100 justify-content-between text-center">

                    <div>
                      <span className="text-uppercase font-25 weight-600 white-color-2">
                        <strong>Hola {user.use_name}</strong>
                      </span>
                      <br />
                      <span className="text-uppercase font-10 weight-600 white-color-2">
                        Balance Disponible
                      </span>
                    </div>
                    <div className="py-4 d-flex flex-row justify-content-center align-items-center">
                      <span className="font-30 weight-600 white-color me-3">
                        €{user.use_amountEur ? user.use_amountEur : 0.0}
                      </span>
                      <span className="font-25 weight-600 purple-color-2">
                        |
                      </span>
                      <span className="font-30 weight-600 white-color ms-3">
                        ${user.use_amountUsd ? user.use_amountUsd : 0}
                      </span>
                    </div>
                    <div className="d-flex flex-row mt-4">
                      <Button
                        className="flex-grow-1 me-1 py-2 text-uppercase font-12 weight-700 purple-color-2 grey-bg-color"
                        onClick={
                          toggle
                        }
                      >
                        Recargar
                      </Button>
                      <Button
                        className="flex-grow-1 ms-1 py-2 text-uppercase font-12 weight-700 white-color orange-bg-color"
                        onClick={
                          toggle
                        }
                      >
                        Enviar Remesa
                      </Button>
                    </div>
                  </div>
                </Col>

                <Col
                  md="3"
                  sm="12"
                  className="d-flex flex-column justify-content-between"
                >
                  <div className="py-4">
                    <span className="text-uppercase font-10 weight-600 grey-color-2">
                      Fees
                    </span>
                    <div className="d-flex flex-column round-corner grey-bg-color ps-4 py-3 mt-3 mb-4">
                      <span className="text-uppercase font-14 purple-color-2">
                        Movimientos
                      </span>
                      <span className="font-30 purple-color-2">0</span>
                    </div>
                    <div className="d-flex flex-column round-corner grey-bg-color ps-4 py-3">
                      <span className="text-uppercase font-14 purple-color-2">
                        Directorio
                      </span>
                      <span className="font-30 purple-color-2">0</span>
                    </div>
                  </div>
                </Col>
                <Col md="3" sm="12">
                  <div className="pt-3">
                    <Table borderless>
                      <thead>
                        <tr>
                          <th className="text-uppercase font-10 weight-600 grey-color-2">
                            Divisas
                          </th>
                          <th className="text-end text-uppercase font-10 weight-600 purple-color-2">
                            Tasas
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="align-middle">
                            <div className="d-flex flex-row">
                              <div className="d-flex flex-row justify-content-center align-items-center square round-corner-small font-20 light-orange-bg-color orange-color">
                                <img src={bolivares} alt="" />
                              </div>
                              <div className="d-flex flex-column ps-2">
                                <span className="font-14 weight-700 purple-color-2">Euros</span>
                                <span className="font-10 weight-500 purple-color-2">Bolivares</span>
                              </div>
                            </div>
                          </td>
                          <td className="align-middle text-end">
                            <div className="d-flex flex-column align-items-end">
                              <span className="font-14 weight-700 purple-color-2">
                                {currencyPrice.length > 0 ? currencyPrice[0].cur_EurToBs : 'N/A'}
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="align-middle">
                            <div className="d-flex flex-row">
                              <div className="d-flex flex-row justify-content-center align-items-center square round-corner-small light-yellow-bg-color yellow-color font-20">
                                <img src={bolivares} alt="" />
                              </div>
                              <div className="d-flex flex-column ps-2">
                                <span className="font-14 weight-700 purple-color-2">Euros</span>
                                <span className="font-10 weight-500 purple-color-2">Dolares</span>
                              </div>
                            </div>
                          </td>
                          <td className="align-middle text-end">
                            <div className="d-flex flex-column align-items-end">
                              <span className="font-14 weight-700 purple-color-2">
                                {currencyPrice.length > 0 ? currencyPrice[0].cur_EurToUsd : 'N/A'}
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="align-middle">
                            <div className="d-flex flex-row">
                              <div className="d-flex flex-row justify-content-center align-items-center square round-corner-small light-yellow-bg-color yellow-color font-20">
                                <img src={bolivares} alt="" />
                              </div>
                              <div className="d-flex flex-column ps-2">
                                <span className="font-14 weight-700 purple-color-2">Dolares</span>
                                <span className="font-10 weight-500 purple-color-2">Bolivares</span>
                              </div>
                            </div>
                          </td>
                          <td className="align-middle text-end">
                            <div className="d-flex flex-column align-items-end">
                              <span className="font-14 weight-700 purple-color-2">
                                {currencyPrice.length > 0 ? currencyPrice[0].cur_UsdToBs : 'N/A'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tbody>

                    </Table>
                  </div>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col md="12">
                  <Table borderless>
                    <thead>
                      <tr>
                        <th className="text-uppercase font-10 weight-600 grey-color-2">
                          Ultimos Movimientos
                        </th>
                        <th className="text-uppercase font-10 weight-600 purple-color-2 text-end" style={{ cursor: 'pointer' }}>
                          Ver todos
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* <tr>
                        <td>
                          <div className="d-flex flex-row">
                            <div className="d-flex flex-row justify-content-center align-items-center orange-color square round-corner-small font-14">
                              <img
                                src={arrowup}
                                alt="Logo"
                                className="footer-logo"
                              />
                            </div>
                            <div className="d-flex flex-column ps-2">
                              <span className="font-14 weight-700 purple-color-2">
                                Retiro
                              </span>
                              <span className="font-10 weight-400 purple-color-2">
                                12 Nov, 2020
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column align-items-end">
                            <span className="font-16 weight-700 orange-color">
                              -€12
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex flex-row">
                            <div className="d-flex flex-row justify-content-center align-items-center square round-corner-small purple-color-2 font-14">
                              <img
                                src={arrowdown}
                                alt="Logo"
                                className="footer-logo"
                              />
                            </div>
                            <div className="d-flex flex-column ps-2">
                              <span className="font-14 weight-700 purple-color-2">
                                Recarga Euros
                              </span>
                              <span className="font-10 weight-400 purple-color-2">
                                12 Nov, 2020
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column align-items-end">
                            <span className="font-16 weight-700 purple-color-2">
                              +€1,289.00
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex flex-row">
                            <div className="d-flex flex-row justify-content-center align-items-center square font-14">
                              <img src={clock} alt="" />
                            </div>
                            <div className="d-flex flex-column ps-2">
                              <span className="font-14 weight-700 purple-color-2">
                                Recarga Euros
                              </span>
                              <span className="font-10 weight-400 purple-color-2">
                                12 Nov, 2020
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column align-items-end">
                            <span className="font-16 weight-700 purple-color-2">
                              +€1,289.00
                            </span>
                          </div>
                        </td>
                      </tr> */}
                      <tr>
                        <td>
                          <div className="d-flex flex-row">
                            <div className="d-flex flex-column ps-2">
                              <span className="font-14 weight-700 purple-color-2">
                                Aun no tienes movimientos
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Col>
          </Row>) : (
          <Row>
            <Col md="12">
              <Row>
                <Col md="6" className="d-flex flex-column h-110">
                  <div className="p-4 d-flex flex-column purple-bg-color round-corner h-100 justify-content-between text-center">
                    {showAlert && (
                      <FixeedAlert message={alertMessage} type={alertType} />
                    )}
                    <div>
                      <span className="text-uppercase font-25 weight-600 white-color-2">
                        <strong>Hola {user.use_name}</strong>
                      </span>
                      <br />
                      <span className="text-uppercase font-10 weight-600 white-color-2">
                        Balance Disponible
                      </span>
                    </div>
                    <div className="py-4 d-flex flex-row justify-content-center align-items-center">
                      <span className="font-30 weight-600 white-color me-3">
                        €{user.use_amountEur ? user.use_amountEur : 0.0}
                      </span>
                      <span className="font-25 weight-600 purple-color-2">
                        |
                      </span>
                      <span className="font-30 weight-600 white-color ms-3">
                        ${user.use_amountUsd ? user.use_amountUsd : 0}
                      </span>
                    </div>
                    <div className="d-flex flex-row mt-4">
                      <Button
                        className="flex-grow-1 me-1 py-2 text-uppercase font-12 weight-700 purple-color-2 grey-bg-color"
                        onClick={
                          user.use_verif === "N"
                            ? toggleModal
                            : user.use_verif === "E"
                              ? toggleFifthModal
                              : clearLocal
                        }
                      >
                        Recargar
                      </Button>
                      <Button
                        className="flex-grow-1 ms-1 py-2 text-uppercase font-12 weight-700 white-color orange-bg-color"
                        onClick={
                          user.use_verif === "N"
                            ? toggleModal
                            : user.use_verif === "E"
                              ? toggleFifthModal
                              : clearLocal
                        }
                      >
                        Enviar Remesa
                      </Button>
                    </div>
                  </div>
                </Col>

                <Col
                  md="3"
                  sm="12"
                  className="d-flex flex-column justify-content-between"
                >
                  <div className="py-4">
                    <span className="text-uppercase font-10 weight-600 grey-color-2">
                      Fees
                    </span>
                    <div className="d-flex flex-column round-corner grey-bg-color ps-4 py-3 mt-3 mb-4">
                      <span className="text-uppercase font-14 purple-color-2">
                        Movimientos
                      </span>
                      <span className="font-30 purple-color-2">0</span>
                    </div>
                    <div className="d-flex flex-column round-corner grey-bg-color ps-4 py-3">
                      <span className="text-uppercase font-14 purple-color-2">
                        Directorio
                      </span>
                      <span className="font-30 purple-color-2">0</span>
                    </div>
                  </div>
                </Col>
                <Col md="3" sm="12">
                  <div className="pt-3">
                    <Table borderless>
                      <thead>
                        <tr>
                          <th className="text-uppercase font-10 weight-600 grey-color-2">
                            Divisas
                          </th>
                          <th className="text-end text-uppercase font-10 weight-600 purple-color-2">
                            Tasas
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="align-middle">
                            <div className="d-flex flex-row">
                              <div className="d-flex flex-row justify-content-center align-items-center square round-corner-small font-20 light-orange-bg-color orange-color">
                                <img src={bolivares} alt="" />
                              </div>
                              <div className="d-flex flex-column ps-2">
                                <span className="font-14 weight-700 purple-color-2">
                                  Euros
                                </span>
                                <span className="font-10 weight-400 purple-color-2">
                                  Bolivares
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="align-middle text-end">
                            <div className="d-flex flex-column align-items-end">
                              <span className="font-14 weight-700 purple-color-2">
                                39.8
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="align-middle">
                            <div className="d-flex flex-row">
                              <div className="d-flex flex-row justify-content-center align-items-center square round-corner-small light-yellow-bg-color yellow-color font-20">
                                <img src={bolivares} alt="" />
                              </div>
                              <div className="d-flex flex-column ps-2">
                                <span className="font-14 weight-700 purple-color-2">
                                  Euros
                                </span>
                                <span className="font-10 weight-400 purple-color-2">
                                  Dolares
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="align-middle text-end">
                            <div className="d-flex flex-column align-items-end">
                              <span className="font-14 weight-700 purple-color-2">
                                0.92
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col md="12">
                  <Table borderless>
                    <thead>
                      <tr>
                        <th className="text-uppercase font-10 weight-600 grey-color-2">
                          Ultimos Movimientos
                        </th>
                        <th className="text-uppercase font-10 weight-600 purple-color-2 text-end" style={{ cursor: 'pointer' }}>
                          Ver todos
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* <tr>
                        <td>
                          <div className="d-flex flex-row">
                            <div className="d-flex flex-row justify-content-center align-items-center orange-color square round-corner-small font-14">
                              <img
                                src={arrowup}
                                alt="Logo"
                                className="footer-logo"
                              />
                            </div>
                            <div className="d-flex flex-column ps-2">
                              <span className="font-14 weight-700 purple-color-2">
                                Retiro
                              </span>
                              <span className="font-10 weight-400 purple-color-2">
                                12 Nov, 2020
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column align-items-end">
                            <span className="font-16 weight-700 orange-color">
                              -€12
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex flex-row">
                            <div className="d-flex flex-row justify-content-center align-items-center square round-corner-small purple-color-2 font-14">
                              <img
                                src={arrowdown}
                                alt="Logo"
                                className="footer-logo"
                              />
                            </div>
                            <div className="d-flex flex-column ps-2">
                              <span className="font-14 weight-700 purple-color-2">
                                Recarga Euros
                              </span>
                              <span className="font-10 weight-400 purple-color-2">
                                12 Nov, 2020
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column align-items-end">
                            <span className="font-16 weight-700 purple-color-2">
                              +€1,289.00
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex flex-row">
                            <div className="d-flex flex-row justify-content-center align-items-center square font-14">
                              <img src={clock} alt="" />
                            </div>
                            <div className="d-flex flex-column ps-2">
                              <span className="font-14 weight-700 purple-color-2">
                                Recarga Euros
                              </span>
                              <span className="font-10 weight-400 purple-color-2">
                                12 Nov, 2020
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column align-items-end">
                            <span className="font-16 weight-700 purple-color-2">
                              +€1,289.00
                            </span>
                          </div>
                        </td>
                      </tr> */}
                      <tr>
                        <td>
                          <div className="d-flex flex-row">
                            <div className="d-flex flex-column ps-2">
                              <span className="font-14 weight-700 purple-color-2">
                                Aun no tienes movimientos
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Col>
          </Row>
        )
      ) : (
        <h1>Debes iniciar sesión para ver esta página</h1>
      )}
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>
          <FaInfoCircle /> Información
        </ModalHeader>
        <ModalBody className="text-center">
          Los cambios estarán próximamente habilitados. Mantente informado.
          <br />
          Puedes realizar los cambios por
          <Link to="https://wa.me/624377261" target="_blank" className="whatsapp-btn">
            <FaWhatsapp /> WhatsApp
          </Link>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cerrar</Button>
        </ModalFooter>
      </Modal>

      {/* Modal para verificación */}
      <Modal
        isOpen={modalOpen}
        centered
        toggle={toggleModal}
        className="responsive-modal"
      >
        <ModalHeader toggle={toggleModal}>
          <b style={{ fontFamily: "Roboto", fontWeight: "900" }}>
            ¡Necesitas verificación!
          </b>
        </ModalHeader>
        <ModalBody className="custom-modal-content">
          <img
            src={VerificationImage}
            style={{ float: "right" }}
            alt="Exclamation Triangle"
            width={120}
            className="modal-image"
          />

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div className="modal-text" style={{ marginRight: "10px" }}>
              <p
                style={{
                  color: "rgba(33, 33, 33, 0.6)",
                  marginTop: ".5em",
                }}
              >
                Para realizar el cambio de divisas necesitamos verificar que
                eres el propietario de la cuenta.
              </p>
              <p>Verifica tu identidad para empezar a cambiar.</p>
              <Button
                style={{
                  background: "#7aa551",
                  border: "none",
                  borderRadius: "15px",
                  marginLeft: "15px",
                }}
                onClick={toggleSecondModal}
              >
                VALIDA TU IDENTIDAD AQUI
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={secondModalOpen}
        size="lg"
        centered
        toggle={toggleSecondModal}
        className="responsive-modal"
      >
        <ModalHeader toggle={toggleSecondModal}>
          Verificación de Identidad
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmitVerify}>
            <div className="form-group">
              <Label htmlFor="dniInput">
                Número de Documento de Identidad (Debe contar con foto tipo
                carnet):
              </Label>
              <Input
                type="text"
                className="form-control"
                id="dniInput"
                placeholder="Ingresa tu DNI, NIE o Pasaporte"
                value={use_dni}
                onChange={(e) => setUseDNI(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <Label htmlFor="dniInput">Número de Telefono:</Label>
              <Input
                type="text"
                className="form-control"
                id="dniInput"
                placeholder="Ingresa tu telefono"
                value={use_phone}
                onChange={(e) => setUsePhone(e.target.value)}
                required
              />
            </div>
            <p
              style={{
                color: "rgba(33, 33, 33, 0.6)",
                marginTop: ".5em",
              }}
            >
              Ingresa el número de documento de identidad. Lo utilizaremos para
              comprobar que eres realmente tú quien utilizará la plataforma.
            </p>
            <p style={{ color: "#a91111", padding: "10px" }}>
              <strong>IMPORTANTE:</strong> Debes subir la imágen de tu DNI, NIE
              con foto o PASAPORTE y otra imágen junto a tu rostro como en el
              ejemplo que se muestra. Los datos deben ser legibles y no debes
              cubrirlos de ninguna manera. El uso de esta información será
              únicamente para comprobar que realmente eres tú quien realizará el
              cambio.
            </p>
            <div className="form-group">
              <Label htmlFor="imageInput">
                Seleccionar Imagen del DNI, NIE con foto o PASAPORTE:
              </Label>
              <Input
                type="file"
                className="form-control-file"
                id="imageInput"
                accept=".jpg,.jpeg,.png,.gif,.pdf"
                onChange={(e) => setUseImg(e.target.files[0])}
                required
              />
            </div>
            <img
              style={{
                marginLeft: "100px",
                marginTop: "1em",
                width: "100px",
              }}
              src={dni}
              alt="Dni"
              className="modal-image1"
            />
            <div className="form-group">
              <Label htmlFor="imageInput">
                Seleccionar Imagen Tipo Selfie:
              </Label>
              <Input
                type="file"
                className="form-control-file"
                id="imageInputDNI"
                accept=".jpg,.jpeg,.png,.gif,.pdf"
                onChange={(e) => setUseImgDni(e.target.files[0])}
                required
              />
            </div>
            <img
              style={{ marginLeft: "90px", width: "200px" }}
              src={dniverify}
              alt="ImageVerification"
              className="modal-image1"
            />
            <div
              style={{ marginTop: "1em", marginLeft: ".5em" }}
              className="form-check"
            >
              <Input
                type="checkbox"
                className="form-check-input"
                id="termsCheckbox"
                checked={termsCheckbox}
                onChange={(e) => setTermsCheckbox(e.target.checked)}
              />
              <Label className="form-check-label" htmlFor="termsCheckbox">
                {" "}
                Acepto los
                <Link to="/TermsAndConditions" style={{ paddingLeft: "5px" }}>
                  términos y condiciones
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={
                !termsCheckbox ||
                use_dni === "" ||
                use_phone === "" ||
                use_img === "" ||
                use_imgDni === ""
              }
              className="btn col-md-12"
              color="success"
            >
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </ModalBody>
      </Modal>

      <Modal isOpen={fifthModalOpen} centered toggle={toggleFifthModal}>
        <ModalHeader toggle={toggleFifthModal}>
          Verificación en proceso
        </ModalHeader>
        <ModalBody>
          <div style={{ textAlign: "center" }}>
            <FaExclamationCircle
              style={{
                fontSize: "48px",
                marginBottom: "20px",
                color: "red",
              }}
            />
            <p>Tu usuario está en proceso de verificación.</p>
            <p>Espera a que un administrador apruebe tu identidad.</p>
            <p>
              El tiempo estimado de verificación dentro de nuestro horario
              laboral es de aproximadamente 20 minutos.
            </p>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export { Changes };
