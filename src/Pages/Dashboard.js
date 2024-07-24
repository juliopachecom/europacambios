import React, { useCallback, useEffect, useState } from "react";
import Logo from "../Assets/Images/Logo.png";
import { useDataContext } from "../Context/dataContext";
import {
  Button,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Label,
  Input,
  FormGroup,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
} from "reactstrap";
import axios from "axios";
import {
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { IoMdExit, IoIosList } from "react-icons/io";
import {
  FaUsers,
  FaUserCircle,
  FaUserCheck,
  FaUserTimes,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { IoGridOutline } from "react-icons/io5";
import { FaBars, FaArrowDown, FaArrowUp, FaClock } from "react-icons/fa";
import { clearLocalStorage } from "../Hooks/useLocalStorage";

function Dashboard() {
  const { url, infoTkn, search } = useDataContext();
  const [searchQuery, setSearchQuery] = useState("");

  const [admin, setUser] = useState([]);
  const [dataUsers, setDataUsers] = useState([]);
  const [use_name, setNombre] = useState("");
  const [use_lastName, setLastName] = useState("");
  const [use_email, setEmail] = useState("");
  const [use_password, setPassword] = useState("");
  const [use_dni, setDNI] = useState("");
  const [use_phone, setPhone] = useState("");
  const [use_verif, setVerif] = useState("");
  const [use_amountEur, setAmountEur] = useState("");
  const [use_amountUsd, setAmountUsd] = useState("");

  const [movements, setMovements] = useState([]);

  const [totalEur, setTotalEur] = useState([]);
  const [totalUsd, setTotalUsd] = useState([]);

  const [table, setTable] = useState("tableView");

  const [select, setSelect] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [modalImageUser, setModalImageUser] = useState(false);
  const toggleImageUser = () => setModalImageUser(!modalImageUser);

  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
    if (modal === false) {
      setNombre("");
      setLastName("");
      setEmail("");
      setPassword("");
      setDNI("");
      setVerif("");
      setAmountEur("");
      setAmountUsd("");
    }
  };
  const [secondmodal, setsecondModal] = useState(false);
  const toggle2 = () => {
    setsecondModal(!secondmodal);
  };
  const [termodal, setterModal] = useState(false);
  const toggle3 = () => {
    setterModal(!secondmodal);
  };
  const [modalImageMov, setModalImageMov] = useState(false);
  const toggleImageMov = () => setModalImageMov(!modalImageMov);

  const toggleMov = (move) => {
    // if (move.mov_type === 'Deposito') {
    //   toggleModalIngreso();
    //   setAmount(move.mov_amount)
    // } else if (move.mov_type === 'Retiro') {
    //   toggleModalEgreso();
    //   setAmount(move.mov_amount)
    // }
    // setSelect(move);
    // setModal(!modal);3
    console.log(move);
  };

  const [activeItem, setActiveItem] = useState("Home");
  // const [selected, setSelected] = useState(null);
  const [sidebar, setSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 9; // Número máximo de usuarios por página

  const filteredUsuarios = dataUsers.filter((user) => {
    const fullName =
      `${user.use_name} ${user.use_lastName} ${user.use_dni}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsuarios.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const showSidebar = () => setSidebar(!sidebar);

  const handleClick = (item) => {
    setActiveItem(item);
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/movements`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setMovements(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setMovements, url]);

  const fetchDataTotalUsd = useCallback(async () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

    try {
      const response = await axios.get(
        `${url}/Movements/totalusd/${formattedDate}/`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setTotalUsd(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setTotalUsd, url]);

  const fetchDataTotalEur = useCallback(async () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

    try {
      const response = await axios.get(
        `${url}/Movements/totaleur/${formattedDate}/`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setTotalEur(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setTotalEur, url]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(
        `${url}/Auth/findByTokenAdmin/${infoTkn}`
      );
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [url, infoTkn]);

  const fetchDataUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Users`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setDataUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setDataUsers, url]);

  useEffect(() => {
    fetchData();
    fetchUser();
    fetchDataUsers();
    fetchDataTotalUsd();
    fetchDataTotalEur();
  }, [
    fetchData,
    fetchUser,
    fetchDataUsers,
    fetchDataTotalUsd,
    fetchDataTotalEur,
  ]);

  const toggleTable = () => {
    table === "tableView" ? setTable("gridView") : setTable("tableView");
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    toggle();

    setNombre(user.use_name);
    setLastName(user.use_lastName);
    setEmail(user.use_email);
    setPassword(user.use_password);
    setDNI(user.use_dni);
    setPhone(user.use_phone);
    setVerif(user.use_verif);
    setAmountEur(user.use_amountEur);
    setAmountUsd(user.use_amountUsd);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (selectedUser) {
        await axios.put(
          `${url}/Users/${selectedUser.use_id}`,
          {
            use_name,
            use_lastName,
            use_dni,
            use_phone,
            use_email,
            use_verif,
            use_amountUsd,
            use_amountEur,
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
        setSelectedUser(null);

        fetchDataUsers();
        toggle();
        // toggleViewer();
      } else {
        await axios.post(
          `${url}/Auth/register`,
          {
            use_name,
            use_lastName,
            use_dni,
            use_phone,
            use_email,
            use_password,
            use_img: '',
            use_imgDni: '',
            use_verif,
            use_amountUsd,
            use_amountEur,
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      }
      fetchDataUsers();
      toggle();
    } catch (error) {
      console.log(error);
    }
  };

  const clearLocal = () => {
    clearLocalStorage();
    clearLocalStorage();
    window.location.reload();
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-h">
          <div className="account-info">
            <div className="account-info-picture">
              <img src={Logo} alt="Account" />
            </div>
            <div className="account-info-name">{admin && admin.adm_user}</div>
            <button className="account-info-more" onClick={clearLocal}>
              <IoMdExit style={{ color: "#212121", fontSize: "20px" }} />
            </button>
          </div>
        </div>
        <ul className="sidebar-list">
          <li
            className={
              activeItem === "Home"
                ? "sidebar-list-item active"
                : "sidebar-list-item"
            }
            onClick={() => handleClick("Home")}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-home"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Panel de control</span>
            </div>
          </li>
          <li
            className={
              activeItem === "Usuarios"
                ? "sidebar-list-item active"
                : "sidebar-list-item"
            }
            onClick={() => handleClick("Usuarios")}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-shopping-bag"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Usuarios</span>
            </div>
          </li>
          <li
            className={
              activeItem === "Usuarios verificados"
                ? "sidebar-list-item active"
                : "sidebar-list-item"
            }
            onClick={() => handleClick("Usuarios verificados")}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-pie-chart"
              >
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <path d="M22 12A10 10 0 0 0 12 2v10z" />
              </svg>
              <span>Usuarios verificados</span>
            </div>
          </li>
          <li
            className={
              activeItem === "Usuarios no verificados"
                ? "sidebar-list-item active"
                : "sidebar-list-item"
            }
            onClick={() => handleClick("Usuarios no verificados")}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-inbox"
              >
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </svg>
              <span>Usuarios por verificar</span>
            </div>
          </li>
        </ul>
      </div>

      {/* Modal Agregar Usuario */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{selectedUser? "Editar" : "Agregar"} Usuario</ModalHeader>
        <ModalBody>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="nombre" className="form-label">
                Nombre:
              </label>
              <Input
                type="text"
                defaultValue={use_name}
                onChange={(e) => setNombre(e.target.value)}
                className="form-control"
                id="nombre"
                placeholder="Nombre"
                maxLength="45"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="apellido" className="form-label">
                Apellido:
              </label>
              <Input
                type="text"
                defaultValue={use_lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="form-control"
                id="apellido"
                placeholder="Apellido"
                maxLength="45"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <Input
                type="email"
                defaultValue={use_email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                id="email"
                placeholder="Email"
                maxLength="45"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="password" className="form-label">
                Contraseña:
              </label>
              <Input
                type="password"
                defaultValue={use_password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                id="password"
                placeholder="Password"
                maxLength="45"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="dni" className="form-label">
                DNI:
              </label>
              <Input
                type="number"
                defaultValue={use_dni}
                onChange={(e) => setDNI(e.target.value)}
                className="form-control"
                id="dni"
                placeholder="DNI"
              />
              <div className="col-md-12">
                <label htmlFor="dni" className="form-label">
                  Telefono
                </label>
                <Input
                  type="text"
                  defaultValue={use_phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control"
                  id="phone"
                  placeholder="Telefono"
                />
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Verificación:</label>
              <div>
                <Input
                  type="radio"
                  id="noVerificated"
                  value="N"
                  checked={use_verif === "N"}
                  onChange={(event) => setVerif(event.target.value)}
                  name="N"
                />
                <label htmlFor="noVerificated" className="form-label">
                  No Verificado
                </label>
              </div>
              <div>
                <Input
                  type="radio"
                  id="Verificated"
                  name="Verificated"
                  value="S"
                  checked={use_verif === "S"}
                  onChange={(event) => setVerif(event.target.value)}
                ></Input>
                <label htmlFor="Verificated" className="form-label">
                  Verificado
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <label htmlFor="Eur" className="form-label">
                Euros:
              </label>
              <Input
                type="number"
                defaultValue={use_amountEur}
                onChange={(e) => setAmountEur(e.target.value)}
                className="form-control"
                id="Eur"
                placeholder="Eur"
                pattern="^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="Usd" className="form-label">
                Dolares:
              </label>
              <Input
                type="number"
                defaultValue={use_amountUsd}
                onChange={(e) => setAmountUsd(e.target.value)}
                className="form-control"
                id="Usd"
                placeholder="Usd"
                pattern="^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
          {selectedUser? "Editar" : "Agregar"}
          </Button>
          <Button color="secondary" onClick={()=> {
            toggle();
            setSelectedUser(null);
          }}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <div
        className="app-content"
        style={{ width: window.innerWidth < 450 ? "50%" : "100%" }}
      >
        {/* Header */}
        <div className="app-content-header">
          <div className="bars" onClick={showSidebar}>
            <FaBars />
          </div>
          <h1 className="app-content-headerText">{activeItem}</h1>
          <Button
            className="app-content-headerButton"
            hidden={activeItem === "Home" ? true : false}
            onClick={toggle}
          >
            Agregar Usuario
          </Button>
        </div>

        {/* SideBar -> 1024px */}
        <Offcanvas isOpen={sidebar} toggle={() => setSidebar(showSidebar)}>
          <OffcanvasHeader toggle={() => showSidebar()}>
            <div className="account-info">
              <div
                style={{ width: "50px", height: "50px" }}
                className="account-info-picture"
              >
                <img src={Logo} alt="Account" />
              </div>
              <div className="account-info-name">
                {admin && admin.adm_username}
              </div>
              <button className="account-info-more" onClick={clearLocal}>
                <IoMdExit style={{ color: "#212121", fontSize: "20px" }} />
              </button>
            </div>
          </OffcanvasHeader>
          <OffcanvasBody>
            <ul className="sidebar-list">
              <li
                className={
                  activeItem === "Home"
                    ? "sidebar-list-item active"
                    : "sidebar-list-item"
                }
                onClick={() => {
                  handleClick("Home");
                  setSidebar(!sidebar);
                }}
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-home"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>Panel de Control</span>
                </div>
              </li>

              <li
                className={
                  activeItem === "Categorías"
                    ? "sidebar-list-item active"
                    : "sidebar-list-item"
                }
                onClick={() => {
                  handleClick("Categorías");
                  setSidebar(!sidebar);
                }}
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-pie-chart"
                  >
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                    <path d="M22 12A10 10 0 0 0 12 2v10z" />
                  </svg>
                  <span>Usuarios Verificados</span>
                </div>
              </li>
              <li
                className={
                  activeItem === "Marcas"
                    ? "sidebar-list-item active"
                    : "sidebar-list-item"
                }
                onClick={() => {
                  handleClick("Marcas");
                  setSidebar(!sidebar);
                }}
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-inbox"
                  >
                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                  </svg>
                  <span>Marcas</span>
                </div>
              </li>
            </ul>
          </OffcanvasBody>
        </Offcanvas>

        {/*  Ingreso */}
        <Modal centered size="lg">
          <ModalHeader>Verificar Ingreso</ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                <h5>Usuario</h5>

                <>
                  <p>Julio Pacheco</p>
                  <p>puto@hotmail.com</p>
                  <p>26560269</p>
                </>
              </Col>
              <Col>
                <h5>Transacción</h5>

                <>
                  <p>10/24</p>
                  <p>300</p>
                  <p>€</p>
                </>

                <Button color="primary">Ver Imagen</Button>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success">Aprobar</Button>

            <Button color="danger">Rechazar</Button>
            <Button color="secondary">Volver</Button>
          </ModalFooter>
        </Modal>

        {/*  Egreso */}
        <Modal centered isOpen={termodal} toggle={() => setterModal(false)}>
          <ModalHeader toggle={() => setterModal(false)}>
            Generar retiro
          </ModalHeader>
          <ModalBody>
            <Alert color="success">
              <h4 className="alert-heading">Datos bancarios:</h4>
              <p></p>
            </Alert>

            <FormGroup>
              <Label for="amount">
                'Monto a transferir' : 'Monto a Entregar'
              </Label>
              <Input type="text" name="amount" id="amount" />
            </FormGroup>

            <FormGroup>
              <Label for="currency">Elige la Moneda</Label>
              <Input type="select" id="payment">
                <option value="">Selecciona una opción</option>
                <option value="BS">Bolívar</option>
                <option value="USD">Dólar</option>
              </Input>
            </FormGroup>
            {
              <FormGroup>
                <Label>Selecciona el Banco a transferir</Label>
                <Input type="select" id="bankOptionPaySelect">
                  <option value="">Selecciona una opción</option>
                  <option value="Banesco">Bofa</option>
                </Input>
              </FormGroup>
            }
            {
              <FormGroup>
                <Label htmlFor="imageInput">Seleccionar Imagen:</Label>
                <Input
                  type="file"
                  className="form-control-file"
                  id="imageInput"
                  accept=".jpg,.jpeg,.png,.gif"
                />
              </FormGroup>
            }

            <FormGroup>
              <Label for="comment">Comentario</Label>
              <Input type="textarea" name="comment" id="comment" />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <>
              <Button color="danger">Rechazar</Button>
              <Button color="success">Enviar</Button>
              <Button color="primary">Cancelar</Button>
            </>

            <>
              <Button color="warning">Enviar (Rechazado)</Button>
              <Button color="secondary">Volver</Button>
              <Button color="primary">Cancelar</Button>
            </>
          </ModalFooter>
        </Modal>

        {/* Modal De Imagen Movimientos */}
        <Modal
          isOpen={modalImageMov}
          size="lg"
          centered
          toggle={toggleImageMov}
        >
          <ModalHeader toggle={toggleImageMov}>
            Verificación de imagen
          </ModalHeader>
          <ModalBody>
            <a
              href={`${url}/Movements/image/`}
              target="_blank"
              without
              rel="noreferrer"
              download
            >
              Descargar PDF
            </a>

            <img
              style={{ width: "100%" }}
              alt="ImageMovement"
              src={`${url}/Movements/image/`}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary">Volver</Button>
          </ModalFooter>
        </Modal>

        {/* Modal De Imagen Usuario */}
        <Modal centered isOpen={modalImageUser} toggle={toggleImageUser}>
          <ModalHeader toggle={toggleImageUser}>
            {select.use_name} {select.use_lastName}
          </ModalHeader>
          <ModalBody>
            <img
              style={{ width: "100%" }}
              alt="ImageUser"
              src={`${url}/Users/image/${select.use_img}`}
            />
            <img
              style={{ width: "100%" }}
              alt="ImageUser2"
              src={`${url}/Users/imageDni/${select.use_imgDni}`}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleImageUser}>
              Volver
            </Button>
          </ModalFooter>
        </Modal>

        {/* Nav */}
        <div className="app-content-actions">
          <input
            className="search-bar"
            placeholder={`Buscar ${activeItem}...`}
            type="text"
            value={search}
            onChange={(e) => {
              handleSearch(e);
            }}
          />
          <div className="app-content-actions-wrapper">
            <div className="filter-button-wrapper">
              <button className="action-button filter jsFilter">
                <span>Filter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-filter"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </button>
              <div className="filter-menu">
                <label>Category</label>
                <select>
                  <option>All Categories</option>
                  <option>Furniture</option>
                  <option>Decoration</option>
                  <option>Kitchen</option>
                  <option>Bathroom</option>
                </select>
                <label>Status</label>
                <select>
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Disabled</option>
                </select>
                <div className="filter-menu-buttons">
                  <button className="filter-button reset">Reset</button>
                  <button className="filter-button apply">Apply</button>
                </div>
              </div>
            </div>
            <button
              className="action-button list active"
              title="List View"
              onClick={toggleTable}
            >
              {table === "tableView" ? (
                <IoIosList style={{ color: "#212121", fontSize: "20px" }} />
              ) : (
                <IoGridOutline style={{ color: "#212121", fontSize: "20px" }} />
              )}
            </button>
          </div>
        </div>

        {/* Main - Home */}
        {activeItem === "Home" && (
          <div
            className="dashboard-container"
            style={{ width: window.innerWidth < 450 ? "100%" : "100%" }}
          >
            <div className="content">
              <div className="container-fluid py-4">
                <div className="row">
                  <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                    <div className="card modern-card bg-gradient-dark">
                      <div className="card-header p-3 pt-2">
                        <div className="icon-container bg-gradient-dark text-white">
                          <FaUsers className="icon" />
                        </div>
                        <div className="text-end pt-1">
                          <p className="text-sm mb-0 text-capitalize">
                            Total de usuarios
                          </p>
                          <h4 className="mb-0">
                            {dataUsers ? (
                              dataUsers.length
                            ) : (
                              <b>No hay usuarios</b>
                            )}
                          </h4>
                        </div>
                      </div>
                      <hr className="modern-horizontal my-0" />
                      <div className="card-footer p-3">
                        <p className="mb-0">
                          <span className="text-success text-sm font-weight-bolder">
                            +55%{" "}
                          </span>
                          más que la semana pasada
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                    <div className="card modern-card bg-gradient-primary">
                      <div className="card-header p-3 pt-2">
                        <div className="icon-container bg-gradient-primary text-white">
                          <FaUserCheck className="icon" />
                        </div>
                        <div className="text-end pt-1">
                          <p className="text-sm mb-0 text-capitalize">
                            Usuarios verificados
                          </p>
                          <h4 className="mb-0">
                            {dataUsers ? (
                              dataUsers.filter((user) => user.use_verif === "S")
                                .length
                            ) : (
                              <b>No hay usuarios</b>
                            )}
                          </h4>
                        </div>
                      </div>
                      <hr className="modern-horizontal my-0" />
                      <div className="card-footer p-3">
                        <p className="mb-0">
                          <span className="text-success text-sm font-weight-bolder">
                            +3%{" "}
                          </span>
                          más que el mes pasado
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                    <div className="card modern-card bg-gradient-info">
                      <div className="card-header p-3 pt-2">
                        <div className="icon-container bg-gradient-info text-white">
                          <FaUserTimes className="icon" />
                        </div>
                        <div className="text-end pt-1">
                          <p className="text-sm mb-0 text-capitalize">
                            Usuarios por verificación
                          </p>
                          <h4 className="mb-0">
                            {dataUsers ? (
                              dataUsers.filter((user) => user.use_verif === "E")
                                .length
                            ) : (
                              <b>No hay usuarios</b>
                            )}
                          </h4>
                        </div>
                      </div>
                      <hr className="modern-horizontal my-0" />
                      <div className="card-footer p-3">
                        <p className="mb-0">
                          <span className="text-danger text-sm font-weight-bolder">
                            -2%
                          </span>{" "}
                          menos que ayer
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-sm-6">
                    <div className="card modern-card bg-gradient-success">
                      <div className="card-header p-3 pt-2">
                        <div className="icon-container bg-gradient-success text-white">
                          <FaMoneyBillAlt className="icon" />
                        </div>
                        <div className="d-flex">
                          <div className="text-start pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Total de Euros
                            </p>
                            <h4 className="mb-0">€{totalEur.totalIn}</h4>
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Total de Dolares
                            </p>
                            <h4 className="mb-0">
                              ${totalUsd.totalIn - totalUsd.totalOut}
                            </h4>
                          </div>
                        </div>
                      </div>
                      <hr className="modern-horizontal my-0" />
                      <div className="card-footer p-3">
                        <p className="mb-0">
                          <span className="text-success text-sm font-weight-bolder">
                            +5%{" "}
                          </span>
                          más que ayer
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="card my-4"
                  style={{ width: window.innerWidth < 450 ? "100%" : "100%" }}
                >
                  <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                      <h6 className="text-white text-capitalize ps-3">
                        Movimientos
                      </h6>
                    </div>
                  </div>
                  <div className="card-body px-0 pb-2">
                    <div className="table-responsive p-0">
                      <table className="table align-items-center mb-0">
                        <thead>
                          <tr>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Usuario
                            </th>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                              Moneda
                            </th>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                              Monto
                            </th>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                              Fecha
                            </th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Estado
                            </th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Tipo
                            </th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Detalles
                            </th>
                            <th className="text-secondary opacity-7"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {movements
                            .filter((mov) => mov.mov_status === "E")
                            .map((move) => (
                              <tr key={move.mov_id}>
                                <td>
                                  <div className="d-flex px-2 py-1">
                                    <div>
                                      <FaUserCircle className="avatar avatar-sm me-3 border-radius-lg" />
                                    </div>
                                    <div className="d-flex flex-column justify-content-center">
                                      <h6 className="mb-0 text-sm">
                                        {move.User.use_name}{" "}
                                        {move.User.use_lastName}
                                      </h6>
                                      <p className="text-xs text-secondary mb-0">
                                        {move.User.use_email}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <p className="text-xs font-weight-bold mb-0">
                                    {move.mov_type === "Deposito" ? (
                                      <FaArrowDown color="green" />
                                    ) : null}
                                    {move.mov_type === "Retiro" ? (
                                      <FaArrowUp color="red" />
                                    ) : null}
                                  </p>
                                  <p className="text-xs text-secondary mb-0">
                                    {move.mov_amount}
                                  </p>
                                </td>
                                <td className="align-middle text-center text-sm">
                                  <span
                                    className={`badge badge-sm ${
                                      move.mov_status === "E" && (
                                        <FaClock className="pending-icon" />
                                      )
                                    }`}
                                  ></span>
                                </td>

                                <td className="align-middle text-center">
                                  <span className="text-secondary text-xs  font-weight-bold">
                                    {move.mov_date}
                                  </span>
                                </td>
                                <td className="align-middle">
                                  <button
                                    className="details-button"
                                    onClick={() => toggle2(move)}
                                  >
                                    Ver detalles
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {activeItem === "Usuarios" && (
          <div
            className="dashboard-container"
            style={{ width: window.innerWidth < 450 ? "100%" : "100%" }}
          >
            <div className="content">
              <div className="container-fluid py-4">
                <div
                  className="card my-4"
                  style={{ width: window.innerWidth < 450 ? "100%" : "100%" }}
                >
                  <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                      <h6 className="text-white text-capitalize ps-3">
                        Usarios
                      </h6>
                    </div>
                  </div>
                  <div className="card-body px-0 pb-2">
                    <div className="table-responsive p-0">
                      <table className="table align-items-center mb-0">
                        <thead>
                          <tr>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Usuario
                            </th>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                              DNI
                            </th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Verificacion
                            </th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              USD
                            </th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              EUR
                            </th>
                            <th className="text-secondary opacity-7"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentUsers.map((user) => (
                            <tr key={user.use_id}>
                              <td>
                                <div className="d-flex px-2 py-1">
                                  <div>
                                    <FaUserCircle className="avatar avatar-sm me-3 border-radius-lg" />
                                  </div>
                                  <div className="d-flex flex-column justify-content-center">
                                    <h6 className="mb-0 text-sm">
                                      {user.use_name} {user.use_lastName}
                                    </h6>
                                    <p className="text-xs text-secondary mb-0">
                                      {user.use_email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="align-middle text-start">
                                <span className="text-secondary text-xs  font-weight-bold">
                                  {user.use_dni ? (
                                    user.use_dni
                                  ) : (
                                    <p>No hay resultados</p>
                                  )}
                                </span>
                              </td>
                              <td className="align-middle text-center text-sm">
                                <span className={`badge badge-sm`}>
                                  {user.use_verif === "s" ||
                                  user.use_verif === "S" ? (
                                    <AiOutlineCheckCircle
                                      style={{
                                        color: "green",
                                        fontSize: "2em",
                                      }}
                                    />
                                  ) : user.use_verif === "e" ||
                                    user.use_verif === "E" ? (
                                    <AiOutlineClockCircle
                                      style={{ color: "blue", fontSize: "2em" }}
                                    />
                                  ) : (
                                    <AiOutlineCloseCircle
                                      style={{ color: "red", fontSize: "2em" }}
                                    />
                                  )}
                                </span>
                              </td>

                              <td className="align-middle text-center">
                                <span className="text-secondary text-xs  font-weight-bold">
                                  {user.use_amountUsd ? user.use_amountUsd : 0}
                                </span>
                              </td>
                              <td className="align-middle text-center">
                                <span className="text-secondary text-xs  font-weight-bold">
                                  {user.use_amountEur ? user.use_amountEur : 0}
                                </span>
                              </td>
                              <td className="align-middle">
                                <Button
                                  color={user.use_verif === "E" ? "success" : "warning"}
                                  onClick={() => {
                                    if (user.use_verif === "E") {
                                      setSelect(user)
                                      toggleImageUser()
                                    } else {
                                      handleEdit(user);
                                    }
                                  }}
                                >
                                  {user.use_verif === "E" ? "Verificar" : "Editar"}
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
            </div>
          </div>
        )}

        {/* User Verificated */}
        {activeItem === "Usuarios verificados" && (
          <div className="UsersVerificated">
            <div className="content">
              <div className="container-fluid py-4">
                <div className="card my-4">
                  <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                      <h6 className="text-white text-capitalize ps-3">
                        Usuarios Verificados
                      </h6>
                    </div>
                  </div>
                  <div className="card-body px-0 pb-2">
                    <div className="table-responsive p-0">
                      <table className="table align-items-center mb-0">
                        <thead>
                          <tr>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Usuario
                            </th>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                              DNI
                            </th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Verificacion
                            </th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              USD
                            </th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              EUR
                            </th>
                            <th className="text-secondary opacity-7"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentUsers
                            .filter((user) => user.use_verif === "S")
                            .map((user) => (
                              <tr key={user.use_id}>
                                <td>
                                  <div className="d-flex px-2 py-1">
                                    <div>
                                      <FaUserCircle className="avatar avatar-sm me-3 border-radius-lg" />
                                    </div>
                                    <div className="d-flex flex-column justify-content-center">
                                      <h6 className="mb-0 text-sm">
                                        {user.use_name} {user.use_lastName}
                                      </h6>
                                      <p className="text-xs text-secondary mb-0">
                                        {user.use_email}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle text-start">
                                  <span className="text-secondary text-xs  font-weight-bold">
                                    {user.use_dni ? (
                                      user.use_dni
                                    ) : (
                                      <p>No hay resultados</p>
                                    )}
                                  </span>
                                </td>
                                <td className="align-middle text-center text-sm">
                                  <span className={`badge badge-sm`}>
                                    {user.use_verif === "s" ||
                                    user.use_verif === "S" ? (
                                      <AiOutlineCheckCircle
                                        style={{
                                          color: "green",
                                          fontSize: "2em",
                                        }}
                                      />
                                    ) : (
                                      <AiOutlineCloseCircle
                                        style={{
                                          color: "red",
                                          fontSize: "2em",
                                        }}
                                      />
                                    )}
                                  </span>
                                </td>

                                <td className="align-middle text-center">
                                  <span className="text-secondary text-xs  font-weight-bold">
                                    {user.use_amountUsd
                                      ? user.use_amountUsd
                                      : 0}
                                  </span>
                                </td>
                                <td className="align-middle text-center">
                                  <span className="text-secondary text-xs  font-weight-bold">
                                    {user.use_amountEur
                                      ? user.use_amountEur
                                      : 0}
                                  </span>
                                </td>
                                <td className="align-middle">
                                  <Button
                                    className="btn-warning"
                                    onClick={toggle}
                                  >
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
            </div>
          </div>
        )}

        {/* Users per Verificate */}
        {activeItem === "Usuarios no verificados" && (
          <div className="UsersVerificated">
            <div className="content">
              <div className="container-fluid py-4">
                <div className="card my-4">
                  <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                      <h6 className="text-white text-capitalize ps-3">
                        Usuarios
                      </h6>
                    </div>
                  </div>
                  <div className="card-body px-0 pb-2">
                    <div className="table-responsive p-0">
                      <table className="table align-items-center mb-0">
                        <thead>
                          <tr>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Usuario
                            </th>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                              DNI
                            </th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Verificacion
                            </th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              USD
                            </th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              EUR
                            </th>
                            <th className="text-secondary opacity-7"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentUsers
                            .filter((user) => user.use_verif === "E")
                            .map((user) => (
                              <tr key={user.use_id}>
                                <td>
                                  <div className="d-flex px-2 py-1">
                                    <div>
                                      <FaUserCircle className="avatar avatar-sm me-3 border-radius-lg" />
                                    </div>
                                    <div className="d-flex flex-column justify-content-center">
                                      <h6 className="mb-0 text-sm">
                                        {user.use_name} {user.use_lastName}
                                      </h6>
                                      <p className="text-xs text-secondary mb-0">
                                        {user.use_email}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle text-start">
                                  <span className="text-secondary text-xs  font-weight-bold">
                                    {user.use_dni ? (
                                      user.use_dni
                                    ) : (
                                      <p>No hay resultados</p>
                                    )}
                                  </span>
                                </td>
                                <td className="align-middle text-center text-sm">
                                  <span className={`badge badge-sm`}>
                                    <AiOutlineClockCircle
                                      style={{ color: "blue", fontSize: "2em" }}
                                    />
                                  </span>
                                </td>

                                <td className="align-middle text-center">
                                  <span className="text-secondary text-xs  font-weight-bold">
                                    {user.use_amountUsd
                                      ? user.use_amountUsd
                                      : 0}
                                  </span>
                                </td>
                                <td className="align-middle text-center">
                                  <span className="text-secondary text-xs  font-weight-bold">
                                    {user.use_amountEur
                                      ? user.use_amountEur
                                      : 0}
                                  </span>
                                </td>
                                <td className="align-middle">
                                  <Button
                                    className="btn-warning"
                                    onClick={() => {
                                      setSelect(user);
                                      toggleImageUser();
                                    }}
                                  >
                                    Verificar
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
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export { Dashboard };
