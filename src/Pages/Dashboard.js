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
  Table,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  Form,
} from "reactstrap";
import axios from "axios";
import {
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import {
  IoMdExit,
  // IoIosList
} from "react-icons/io";
import {
  FaUsers,
  FaUserCircle,
  FaUserCheck,
  FaUserTimes,
  FaMoneyBillAlt,
  FaEuroSign,
  FaDollarSign,
  FaCoins,
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaYenSign,
  FaMoneyCheckAlt,
  FaMoneyBillWave,
  FaPoundSign,
} from "react-icons/fa";
// import { IoGridOutline } from "react-icons/io5";
import { FaBars, FaArrowDown, FaArrowUp, FaClock } from "react-icons/fa";
import { clearLocalStorage } from "../Hooks/useLocalStorage";
import { toast, ToastContainer } from "react-toastify";

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
  const [currencyPrices, setCurrencyPrices] = useState({
    cur_EurToBs: 0,
    cur_EurToUsd: 0,
    cur_UsdToBs: 0,
    cur_EurToUsd_Pa: 0,
    cur_EurToUsd_Ecu: 0,
    cur_EurToSol_Pe: 0,
    cur_EurToPes_Ch: 0,
  });
  const [curId, setCurId] = useState(null);
  const [banks, setBanks] = useState([]);
  const [showBankModal, setShowBankModal] = useState(false);

  const [formData, setFormData] = useState({
    acceur_Bank: "",
    acceur_owner: "",
    acceur_number: "",
    acceur_nie: "",
    acceur_phone: "",
    acceur_type: "Normal",
    acceur_status: "Activo",
    acceur_balance: 0,
  });

  // Función para manejar el cierre del modal
  const handleClose = () => {
    setShowBankModal(false);
    setFormData({
      acceur_Bank: "",
      acceur_owner: "",
      acceur_number: "",
      acceur_nie: "",
      acceur_phone: "",
      acceur_type: "Normal",
      acceur_status: "Activo",
      acceur_balance: 0,
    });
  };
  const [modalBank, setModalBank] = useState(false);
  const toggleBank = () => {
    setModalBank(!modalBank);
  };
  const [typeAcc, setTypeAcc] = useState("");

  const [acceur_Bank, setAcceur_Bank] = useState("");
  const [acceur_owner, setAcceur_owner] = useState("");
  const [acceur_number, setAcceur_number] = useState("");
  const [acceur_nie, setAcceur_nie] = useState("");
  const [acceur_phone, setAcceur_phone] = useState("");

  const [accusd_Bank, setAccusd_Bank] = useState("");
  const [accusd_owner, setAccusd_owner] = useState("");
  const [accusd_email, setAccusd_email] = useState("");
  const [accusd_number, setAccusd_number] = useState("");
  const [accusd_Ident, setAccusd_Ident] = useState("");
  const [accusd_phone, setAccusd_phone] = useState("");
  const [editBankModal, setEditBankModal] = useState(false);
const [editingBank, setEditingBank] = useState(null);

const toggleEditBankModal = () => setEditBankModal(!editBankModal);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleDisable = (number) => {
    setBanks(
      banks.map((bank) =>
        bank.acceur_number === number
          ? {
              ...bank,
              acceur_status:
                bank.acceur_status === "Activo" ? "Inactivo" : "Activo",
            }
          : bank
      )
    );
  };

  const [banksEur, setBanksEUR] = useState([]);
  const [banksUsd, setBanksUSD] = useState([]);
  const [selectedBank, setSelectBank] = useState([]);

  const [modal1, setModal1] = useState(false);
  const toggleBankViewer = () => {
    setModal1(!modal1);
  };

  const filteredBanks = [...banksEur, ...banksUsd].filter((Bank) => {
    const fullName = `${Bank.acceur_Bank} ${Bank.accusd_Bank}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const fetchDataEUR = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Acceur`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setBanksEUR(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setBanksEUR, url]);

  const fetchDataUSD = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Accusd`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setBanksUSD(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setBanksUSD, url]);

  const fetchCurrencyData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/currencyPrice`);
      if (response.data && response.data.length > 0) {
        setCurId(response.data[0].cur_id);
        setCurrencyPrices({
          cur_EurToBs: response.data[0].cur_EurToBs,
          cur_EurToUsd: response.data[0].cur_EurToUsd,
          cur_UsdToBs: response.data[0].cur_UsdToBs,
          cur_EurToUsd_Pa: response.data[0].cur_EurToUsd_Pa,
          cur_EurToUsd_Ecu: response.data[0].cur_EurToUsd_Ecu,
          cur_EurToSol_Pe: response.data[0].cur_EurToSol_Pe,
          cur_EurToPes_Ch: response.data[0].cur_EurToPes_Ch,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [url]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrencyPrices((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (curId === null) {
      alert("No se pudo encontrar el ID de la moneda.");
      return;
    }

    try {
      await axios.put(`${url}/currencyPrice/${curId}`, currencyPrices);
      alert("Cambios guardados con éxito");
    } catch (error) {
      console.error(error);
      alert("Error al guardar los cambios");
    }
  };

  const [totalEur, setTotalEur] = useState([]);
  const [totalUsd, setTotalUsd] = useState([]);

  // const [table, setTable] = useState("tableView");

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
  // const toggle3 = () => {
  //   setterModal(!secondmodal);
  // };
  const [modalImageMov, setModalImageMov] = useState(false);
  const toggleImageMov = () => setModalImageMov(!modalImageMov);

  const [modalViewer, setModalViewer] = useState(false);
  const toggleViewer = () => setModalViewer(!modalViewer);

  const [activeItem, setActiveItem] = useState("Home");
  // const [selected, setSelected] = useState(null);
  const [sidebar, setSidebar] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const usersPerPage = 9; // Número máximo de usuarios por página

  const filteredUsuarios = dataUsers.filter((user) => {
    const fullName =
      `${user.use_name} ${user.use_lastName} ${user.use_dni}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleCardClick = (section) => {
    setActiveItem(section);
  };
  // const indexOfLastUser = currentPage * usersPerPage;
  // const indexOfFirstUser = indexOfLastUser - usersPerPage;
  // const currentUsers = filteredUsuarios.slice(
  //   indexOfFirstUser,
  //   indexOfLastUser
  // );

  // const paginate = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

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
    fetchDataEUR();
    fetchDataUSD();
    fetchCurrencyData();
  }, [
    fetchData,
    fetchUser,
    fetchDataUsers,
    fetchDataTotalUsd,
    fetchDataTotalEur,
    fetchDataEUR,
    fetchDataUSD,
    fetchCurrencyData,
  ]);

  // const toggleTable = () => {
  //   table === "tableView" ? setTable("gridView") : setTable("tableView");
  // };

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

  const handleEditBank = async (event) => {
    event.preventDefault();
  
    try {
      await axios.put(
        `${url}/Acceur/${editingBank.acceur_id}`,
        {
          acceur_Bank: editingBank.acceur_Bank,
          acceur_owner: editingBank.acceur_owner,
          acceur_number: editingBank.acceur_number,
          acceur_phone: editingBank.acceur_phone,
          acceur_type: editingBank.acceur_type,
          currency: editingBank.currency,
          acceur_status: editingBank.acceur_status,
          acceur_balance: editingBank.acceur_balance,
        },
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
  
      fetchDataEUR();
      fetchDataUSD();
  
      console.log("Formulario enviado:", editingBank); 

      toast.success("¡Datos cambiados con éxito!", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  
      toggleEditBankModal(); // Cerrar el modal
      toggleBankViewer(); // Cerrar el modal
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      toast.error("¡Error al guardar los cambios!", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  

  const handleSubmitBank = async (event) => {
    event.preventDefault();

    if (typeAcc === "EUR") {
      try {
        await axios.post(
          `${url}/Acceur/create`,
          {
            acceur_Bank,
            acceur_owner,
            acceur_number,
            acceur_nie,
            acceur_phone,
            acceur_type: "Normal",
            acceur_status: "Activo",
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
              "Content-Type": "application/json",
            },
          }
        );

        fetchDataEUR();
        fetchDataUSD();

        toast.success("¡Cuenta creada con éxito!", {
          position: "bottom-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        toggleBank();
      } catch (error) {
        console.log(error);
      }
    }

    if (typeAcc === "USD") {
      try {
        await axios.post(
          `${url}/Accusd/create`,
          {
            accusd_Bank,
            accusd_owner,
            accusd_email,
            accusd_number,
            accusd_Ident,
            accusd_phone,
            accusd_type: "Normal",
            accusd_status: "Activo",
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
              "Content-Type": "application/json",
            },
          }
        );

        fetchDataEUR();
        fetchDataUSD();

        toast.success("¡Cuenta creada con éxito!", {
          position: "bottom-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        toggleBank();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleConfirmVerif = async (user) => {
    try {
      await axios.put(
        `${url}/Users/${user.use_id}`,
        {
          use_verif: "S",
        },
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );

      axios.post(`${url}/Mailer/EmailVVerif/${user.use_email}`);

      toggleImageUser();
      fetchDataUsers();
      toast.success("Acción realizada con éxito!");
    } catch (error) {
      toast.error("Error al intentar realizar la acción.");
    }
  };

  const handleCancelVerif = async (user) => {
    try {
      await axios.put(
        `${url}/Users/${user.use_id}`,
        {
          use_verif: "N",
        },
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );

      axios.post(`${url}/Mailer/EmailRVerif/${user.use_email}`);

      toggleImageUser();
      fetchDataUsers();
      toast.success("Acción realizada con éxito!");
    } catch (error) {
      toast.error("Error al intentar realizar la acción.");
    }
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
        toggleViewer();
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
            use_img: "",
            use_imgDni: "",
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
      toast.success("Acción realizada con éxito!");
    } catch (error) {
      toast.error("Error al intentar realizar la acción.");
    }
  };

  const clearLocal = () => {
    clearLocalStorage();
    clearLocalStorage();
    window.location.href = "/";
  };

  return (
    <div>
      {admin.adm_role === "A" ? (
        <div className="app-container">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-h">
              <div className="account-info">
                <div className="account-info-picture">
                  <img src={Logo} alt="Account" />
                </div>
                <div className="account-info-name">
                  {admin && admin.adm_user}
                </div>
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
              <li
                className={
                  activeItem === "Tasas"
                    ? "sidebar-list-item active"
                    : "sidebar-list-item"
                }
                onClick={() => handleClick("Tasas")}
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
                  <span>Tasas</span>
                </div>
              </li>
              <li
                className={
                  activeItem === "Bancos"
                    ? "sidebar-list-item active"
                    : "sidebar-list-item"
                }
                onClick={() => handleClick("Bancos")}
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
                  <span>Bancos</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Modal Agregar Usuario */}
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>
              {selectedUser ? "Editar" : "Agregar"} Usuario
            </ModalHeader>
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
              <Button color="primary" outline onClick={handleSubmit}>
                {selectedUser ? "Guardar cambios" : "Guardar usuario"}
              </Button>
              <Button
                color="secondary"
                onClick={() => {
                  toggle();
                  setSelectedUser(null);
                }}
              >
                Cancelar
              </Button>
            </ModalFooter>
          </Modal>

          {/* Modal Ver Usuario */}
          <Modal
            className="mt-5"
            isOpen={modalViewer}
            size="lg"
            centered
            toggle={toggleViewer}
          >
            <ModalHeader>
              {select.use_name} {select.use_lastName}
              {select.use_verif === "s" || select.use_verif === "S" ? (
                <AiOutlineCheckCircle
                  style={{ color: "green", fontSize: "1em" }}
                />
              ) : (
                <AiOutlineCloseCircle
                  style={{ color: "red", fontSize: "1em" }}
                />
              )}
            </ModalHeader>
            <ModalBody>
              <Table bordered hover responsive striped>
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
                    <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Detalles
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={select.use_id}>
                    <td>
                      <div className="d-flex px-2 py-1">
                        <div>
                          <FaUserCircle className="avatar avatar-sm me-3 border-radius-lg" />
                        </div>
                        <div className="d-flex flex-column justify-content-center">
                          <h6 className="mb-0 text-sm">
                            {select.use_name} {select.use_lastName}
                          </h6>
                          <p className="text-xs text-secondary mb-0">
                            {select.use_email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle text-start">
                      <span className="text-secondary text-xs  font-weight-bold">
                        {select.use_dni ? (
                          select.use_dni
                        ) : (
                          <p>No hay resultados</p>
                        )}
                      </span>
                    </td>
                    <td className="align-middle text-center text-sm">
                      <span className={`badge badge-sm`}>
                        {select.use_verif === "s" ||
                          select.use_verif === "S" ? (
                          <AiOutlineCheckCircle
                            style={{
                              color: "green",
                              fontSize: "2em",
                            }}
                          />
                        ) : select.use_verif === "e" ||
                          select.use_verif === "E" ? (
                          <AiOutlineClockCircle
                            style={{
                              color: "blue",
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
                        {select.use_amountUsd ? select.use_amountUsd : 0}
                      </span>
                    </td>
                    <td className="align-middle text-center">
                      <span className="text-secondary text-xs  font-weight-bold">
                        {select.use_amountEur ? select.use_amountEur : 0}
                      </span>
                    </td>
                    <td className="align-middle">
                      {select.use_verif === "s" || select.use_verif === "S" ? (
                        <Button
                          color="primary"
                          outline
                          onClick={() => {
                            setSelect(select);
                            toggleImageUser();
                          }}
                        >
                          Ver Imagen
                        </Button>
                      ) : (
                        <p>No se encontraron resultados</p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </ModalBody>
            <ModalFooter>
              {select.use_verif === "S" || select.use_verif === "s" ? (
                <Button color="success" id="PopoverLegacy1" type="button">
                  Movimientos
                </Button>
              ) : null}

              <Button
                color="warning"
                onClick={() => {
                  handleEdit(select);
                }}
              >
                Editar
              </Button>
              <Button
                color="secondary"
                onClick={() => {
                  toggleViewer();
                  setSelectedUser(null);
                }}
              >
                Cancelar
              </Button>
            </ModalFooter>
          </Modal>

{/* Modal Editar Cuenta banco */}
<Modal isOpen={editBankModal} toggle={toggleEditBankModal} size="lg" centered>
  <ModalHeader toggle={toggleEditBankModal}>Editar Banco</ModalHeader>
  <ModalBody>
    <Form onSubmit={handleEditBank}>
      <FormGroup>
        <Label for="bankName">Nombre del Banco</Label>
        <Input
          type="text"
          id="bankName"
          name="bankName"
          value={editingBank?.acceur_Bank || ""}
          onChange={(e) => setEditingBank(prevState => ({
            ...prevState,
            acceur_Bank: e.target.value
          }))}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="owner">Propietario</Label>
        <Input
          type="text"
          id="owner"
          name="owner"
          value={editingBank?.acceur_owner || ""}
          onChange={(e) => setEditingBank(prevState => ({
            ...prevState,
            acceur_owner: e.target.value
          }))}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="accountNumber">Número de Cuenta</Label>
        <Input
          type="text"
          id="accountNumber"
          name="accountNumber"
          value={editingBank?.acceur_number || ""}
          onChange={(e) => setEditingBank(prevState => ({
            ...prevState,
            acceur_number: e.target.value
          }))}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="phone">Teléfono</Label>
        <Input
          type="text"
          id="phone"
          name="phone"
          value={editingBank?.acceur_phone || ""}
          onChange={(e) => setEditingBank(prevState => ({
            ...prevState,
            acceur_phone: e.target.value
          }))}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="type">Tipo</Label>
        <Input
          type="text"
          id="type"
          name="type"
          value={editingBank?.acceur_type || ""}
          onChange={(e) => setEditingBank(prevState => ({
            ...prevState,
            acceur_type: e.target.value
          }))}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="currency">Moneda</Label>
        <Input
          type="select"
          id="currency"
          name="currency"
          value={editingBank?.currency || ""}
          onChange={(e) => setEditingBank(prevState => ({
            ...prevState,
            currency: e.target.value
          }))}
          required
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </Input>
      </FormGroup>
      <FormGroup>
        <Label for="status">Estado</Label>
        <Input
          type="select"
          id="status"
          name="status"
          value={editingBank?.acceur_status || ""}
          onChange={(e) => setEditingBank(prevState => ({
            ...prevState,
            acceur_status: e.target.value
          }))}
          required
        >
          <option value="Activo">Activo</option>
          <option value="Desactivo">Desactivo</option>
        </Input>
      </FormGroup>
      <FormGroup>
        <Label for="balance">Saldo</Label>
        <Input
          type="number"
          id="balance"
          name="balance"
          value={editingBank?.acceur_balance || ""}
          onChange={(e) => setEditingBank(prevState => ({
            ...prevState,
            acceur_balance: e.target.value
          }))}
          
        />
      </FormGroup>
      <ModalFooter>
        <Button color="primary" type="submit">Guardar Cambios</Button>
        <Button color="secondary" onClick={toggleEditBankModal}>Cancelar</Button>
      </ModalFooter>
    </Form>
  </ModalBody>
</Modal>


          <Modal
            className="mt-5"
            isOpen={modal1}
            size="l"
            centered
            toggle={toggleBankViewer}
          >
            <ModalHeader style={{ width: "100%" }}>
              {/* {banksImages.map((img) =>
                    img.name === selectModal.acceur_Bank ?
                      <img style={{ float: 'right', marginLeft: '17em' }} src={img.Component} width={80} alt={selectModal.acceur_Bank} className="float-right" />
                      : null
                  )}
                  {banksImages.map((img) =>
                    img.name === selectModal.accusd_Bank ?
                      <img style={{ float: 'right', marginLeft: '17em' }} src={img.Component} width={80} alt={selectModal.accusd_Bank} className="float-right" />
                      : null
                  )} */}
              {selectedBank.acceur_Bank && (
                <FormGroup row>
                  <h5 style={{ margin: ".5em", fontWeight: "700" }}>
                    {" "}
                    {selectedBank.acceur_Bank}{" "}
                  </h5>
                </FormGroup>
              )}
              {selectedBank.accusd_Bank && (
                <FormGroup row>
                  <h5 style={{ margin: ".5em", fontWeight: "700" }}>
                    {" "}
                    {selectedBank.accusd_Bank}{" "}
                  </h5>
                </FormGroup>
              )}
            </ModalHeader>
            <ModalBody>
              {selectedBank.acceur_Bank && (
                <div>
                  <h5>Detalles de la cuenta:</h5>
                  <ul>
                    <li>
                      <strong>Banco:</strong> {selectedBank.acceur_Bank}
                    </li>
                    <li>
                      <strong>Propietario:</strong> {selectedBank.acceur_owner}
                    </li>
                    <li>
                      <strong>Número de cuenta:</strong>{" "}
                      {selectedBank.acceur_number}
                    </li>
                    <li>
                      <strong>NIE:</strong> {selectedBank.acceur_nie}
                    </li>
                    <li>
                      <strong>Teléfono:</strong> {selectedBank.acceur_phone}
                    </li>
                    <li>
                      <strong>Tipo:</strong> {selectedBank.acceur_type}
                    </li>
                    <li>
                      <strong>Estado:</strong> {selectedBank.acceur_status}
                    </li>
                    <li>
                      <strong>Saldo:</strong> {selectedBank.acceur_balance}
                    </li>
                  </ul>
                </div>
              )}
              {selectedBank.accusd_Bank && (
                <div>
                  <h5>Detalles de la cuenta:</h5>
                  <ul>
                    <li>
                      <strong>Banco:</strong> {selectedBank.accusd_Bank}
                    </li>
                    <li>
                      <strong>Propietario:</strong> {selectedBank.accusd_owner}
                    </li>
                    <li>
                      <strong>Número de cuenta:</strong>{" "}
                      {selectedBank.accusd_number}
                    </li>
                    <li>
                      <strong>DNI:</strong> {selectedBank.accusd_Ident}
                    </li>
                    <li>
                      <strong>Teléfono:</strong> {selectedBank.accusd_phone}
                    </li>
                    <li>
                      <strong>Tipo:</strong> {selectedBank.accusd_type}
                    </li>
                    <li>
                      <strong>Estado:</strong> {selectedBank.accusd_status}
                    </li>
                    <li>
                      <strong>Saldo:</strong> {selectedBank.accusd_balance}
                    </li>
                  </ul>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              {selectedBank.accusd_Bank ? (
                selectedBank.accusd_status === "Desactivo" ? (
                  <Button onClick={handleEditBank} color="success">
                    Habilitar
                  </Button>
                ) : (
                  <Button onClick={handleEditBank} color="danger">
                    Deshabilitar
                  </Button>
                )
              ) : null}
              {selectedBank.acceur_Bank ? (
                selectedBank.acceur_status === "Desactivo" ? (
                  <Button onClick={handleEditBank} color="success">
                    Habilitar
                  </Button>
                ) : (
                  <Button onClick={handleEditBank} color="danger">
                    Deshabilitar
                  </Button>
                )
              ) : null}
              <Button
                color="warning"
                onClick={() => {
                  setEditingBank(selectedBank); 
                  toggleEditBankModal();
                }}
              >
                Editar
              </Button>
              <Button
                color="secondary"
                onClick={() => {
                  toggleBankViewer();
                }}
              >
                Cancelar
              </Button>
            </ModalFooter>
          </Modal>

          {/* Modal De Agregar Cuenta */}
          <Modal centered isOpen={modalBank} toggle={toggleBank}>
            <ModalHeader toggle={toggleBank}>Crear Cuenta bancaria</ModalHeader>
            <ModalBody>
              <div className="row g-3">
                <div className="col-md-12">
                  <label htmlFor="nombre" className="form-label">
                    Seleccione la moneda de la cuenta bancaria:
                  </label>
                  <Input
                    type="select"
                    id="typeAcc"
                    defaultValue={typeAcc}
                    onChange={(e) => setTypeAcc(e.target.value)}
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="EUR">Euro</option>
                    <option value="USD">Dolar</option>
                  </Input>
                </div>
                {typeAcc === "EUR" ? (
                  <div className="col-md-6">
                    <label htmlFor="nombre" className="form-label">
                      Nombre del Banco:
                    </label>
                    <Input
                      type="select"
                      id="acceur_Bank"
                      defaultValue={acceur_Bank}
                      onChange={(e) => setAcceur_Bank(e.target.value)}
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="BBVA">BBVA</option>
                      <option value="Santander">Santander</option>
                      <option value="Revolut">Revolut</option>
                      <option value="Wise">Wise</option>
                      <option value="Cajamar">Cajamar</option>
                      <option value="Unicaja">Unicaja</option>
                      <option value="Caixa">Caixa</option>
                      <option value="Bizum">Bizum</option>
                      <option value="Bankinter">Bankinter</option>
                      <option value="Revolut">Revolut</option>
                      <option value="RURAL">Caja Rural</option>
                      <option value="PIBANK">Pibank</option>
                    </Input>
                  </div>
                ) : null}
                {typeAcc === "EUR" ? (
                  <div className="col-md-6">
                    <label htmlFor="acceur_owner" className="form-label">
                      Nombre del Titular:
                    </label>
                    <Input
                      type="text"
                      id="acceur_owner"
                      defaultValue={acceur_owner}
                      onChange={(e) => setAcceur_owner(e.target.value)}
                    />
                  </div>
                ) : null}
                {typeAcc === "EUR" ? (
                  <div className="col-md-6">
                    <label htmlFor="acceur_number" className="form-label">
                      Numero de Cuenta:
                    </label>
                    <Input
                      type="text"
                      id="acceur_number"
                      defaultValue={acceur_number}
                      onChange={(e) => setAcceur_number(e.target.value)}
                    />
                  </div>
                ) : null}
                {typeAcc === "EUR" ? (
                  <div className="col-md-6">
                    <label htmlFor="acceur_phone" className="form-label">
                      Telefono:
                    </label>
                    <Input
                      type="text"
                      id="acceur_phone"
                      defaultValue={acceur_phone}
                      onChange={(e) => setAcceur_phone(e.target.value)}
                    />
                  </div>
                ) : null}
                {typeAcc === "EUR" ? (
                  <div className="col-md-6">
                    <label htmlFor="acceur_nie" className="form-label">
                      NIE:
                    </label>
                    <Input
                      type="text"
                      id="acceur_nie"
                      defaultValue={acceur_nie}
                      onChange={(e) => setAcceur_nie(e.target.value)}
                    />
                  </div>
                ) : null}

                {typeAcc === "USD" ? (
                  <div className="col-md-6">
                    <label htmlFor="accusd_Bank" className="form-label">
                      Nombre del Banco:
                    </label>
                    <Input
                      type="select"
                      id="accusd_Bank"
                      defaultValue={accusd_Bank}
                      onChange={(e) => setAccusd_Bank(e.target.value)}
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="Bank of America">Bank of America</option>
                      <option value="Wells Fargo">Wells Fargo</option>
                      <option value="Zelle">Zelle</option>
                    </Input>
                  </div>
                ) : null}
                {typeAcc === "USD" ? (
                  <div className="col-md-6">
                    <label htmlFor="accusd_owner" className="form-label">
                      Nombre del Titular:
                    </label>
                    <Input
                      type="text"
                      id="accusd_owner"
                      defaultValue={accusd_owner}
                      onChange={(e) => setAccusd_owner(e.target.value)}
                    />
                  </div>
                ) : null}
                {typeAcc === "USD" ? (
                  <div className="col-md-6">
                    <label htmlFor="accusd_email" className="form-label">
                      Correo:
                    </label>
                    <Input
                      type="email"
                      id="accusd_email"
                      defaultValue={accusd_email}
                      onChange={(e) => setAccusd_email(e.target.value)}
                    />
                  </div>
                ) : null}
                {typeAcc === "USD" ? (
                  <div className="col-md-6">
                    <label htmlFor="accusd_number" className="form-label">
                      Numero de Cuenta:
                    </label>
                    <Input
                      type="text"
                      id="accusd_number"
                      defaultValue={accusd_number}
                      onChange={(e) => setAccusd_number(e.target.value)}
                    />
                  </div>
                ) : null}
                {typeAcc === "USD" ? (
                  <div className="col-md-6">
                    <label htmlFor="accusd_Ident" className="form-label">
                      Identificación:
                    </label>
                    <Input
                      type="text"
                      id="accusd_Ident"
                      defaultValue={accusd_Ident}
                      onChange={(e) => setAccusd_Ident(e.target.value)}
                    />
                  </div>
                ) : null}
                {typeAcc === "USD" ? (
                  <div className="col-md-6">
                    <label htmlFor="accusd_phone" className="form-label">
                      Telefono:
                    </label>
                    <Input
                      type="text"
                      id="accusd_phone"
                      defaultValue={accusd_phone}
                      onChange={(e) => setAccusd_phone(e.target.value)}
                    />
                  </div>
                ) : null}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleSubmitBank}>
                Agregar
              </Button>
              <Button color="secondary" onClick={toggle}>
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
                className="btn"
                color="secondary"
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
                  <li
                    className={
                      activeItem === "Tasas"
                        ? "sidebar-list-item active"
                        : "sidebar-list-item"
                    }
                    onClick={() => handleClick("Tasas")}
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
                      <span>Tasas</span>
                    </div>
                  </li>
                  <li
                    className={
                      activeItem === "Bancos"
                        ? "sidebar-list-item active"
                        : "sidebar-list-item"
                    }
                    onClick={() => handleClick("Bancos")}
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
                      <span>Bancos</span>
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
                <Button
                  color="success"
                  onClick={() => {
                    handleConfirmVerif(select);
                  }}
                >
                  Aprobar
                </Button>
                <Button
                  color="danger"
                  onClick={() => {
                    handleCancelVerif(select);
                  }}
                >
                  Rechazar
                </Button>
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
              {/* <div className="app-content-actions-wrapper">
                <button
                  className="action-button list active"
                  title="List View"
                  onClick={toggleTable}
                >
                  {table === "tableView" ? (
                    <IoIosList style={{ color: "#212121", fontSize: "20px" }} />
                  ) : (
                    <IoGridOutline
                      style={{ color: "#212121", fontSize: "20px" }}
                    />
                  )}
                </button>
              </div> */}
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
                          <button
                              className="btn btn-light"
                              onClick={() => handleCardClick('Usuarios')}
                            >
                              Ver usuarios
                            </button>
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
                                  dataUsers.filter(user => user.use_verif === "S").length
                                ) : (
                                  <b>No hay usuarios</b>
                                )}
                              </h4>
                            </div>
                          </div>
                          <hr className="modern-horizontal my-0" />
                          <div className="card-footer p-3">
                            <button
                              className="btn btn-light"
                              onClick={() => handleCardClick('Usuarios')}
                            >
                              Ver usuarios
                            </button>
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
                                  dataUsers.filter(
                                    (user) => user.use_verif === "E"
                                  ).length
                                ) : (
                                  <b>No hay usuarios</b>
                                )}
                              </h4>
                            </div>
                          </div>
                          <hr className="modern-horizontal my-0" />
                          <div className="card-footer p-3">
                          <button
                              className="btn btn-light"
                              onClick={() => handleCardClick('Usuarios no verificados')}
                            >
                              Ver usuarios
                            </button>
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

                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="card my-4"
                      style={{
                        width: window.innerWidth < 450 ? "100%" : "100%",
                      }}
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
                                        className={`badge badge-sm ${move.mov_status === "E" && (
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
                      style={{
                        width: window.innerWidth < 450 ? "100%" : "100%",
                      }}
                    >
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
                              {filteredUsuarios.map((user) => (
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
                                          style={{
                                            color: "blue",
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
                                      outline
                                      color={
                                        user.use_verif === "E"
                                          ? "success"
                                          : "info"
                                      }
                                      onClick={() => {
                                        if (user.use_verif === "E") {
                                          setSelect(user);
                                          toggleImageUser();
                                        } else {
                                          setSelect(user);
                                          toggleViewer();
                                        }
                                      }}
                                    >
                                      {user.use_verif === "E"
                                        ? "Verificar"
                                        : "Detalles"}
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

            {/* Tasas */}
            {activeItem === "Tasas" && (
              <div className="dashboard-container" style={{ width: "100%" }}>
                <div className="content">
                  <div className="container-fluid py-4">
                    <div className="card my-4" style={{ width: "100%" }}>
                      <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                        <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                          <h6 className="text-white text-capitalize ps-3">Tasas de Cambio</h6>
                        </div>
                      </div>
                      <div className="card-body px-3 pb-2">
                        <div className="row mb-3">
                          {/* EUR a Bs */}
                          <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="d-flex align-items-center">
                              <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                                <FaCoins size={24} />
                              </div>
                              <div className="ms-3">
                                <h6 className="mb-0">EUR a Bs</h6>
                                <p className="text-sm text-muted mb-0">Tasa de Cambio</p>
                              </div>
                            </div>
                            <div className="input-group mt-2">
                              <span className="input-group-text"><FaEuroSign /></span>
                              <input
                                type="number"
                                name="cur_EurToBs"
                                value={currencyPrices.cur_EurToBs}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Ingrese tasa EUR a Bs"
                              />
                            </div>
                          </div>
                          {/* EUR a USD */}
                          <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="d-flex align-items-center">
                              <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                                <FaChartBar size={24} />
                              </div>
                              <div className="ms-3">
                                <h6 className="mb-0">EUR a USD</h6>
                                <p className="text-sm text-muted mb-0">Tasa de Cambio</p>
                              </div>
                            </div>
                            <div className="input-group mt-2">
                              <span className="input-group-text"><FaDollarSign /></span>
                              <input
                                type="number"
                                name="cur_EurToUsd"
                                value={currencyPrices.cur_EurToUsd}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Ingrese tasa EUR a USD"
                              />
                            </div>
                          </div>
                          {/* USD a Bs */}
                          <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="d-flex align-items-center">
                              <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                                <FaChartPie size={24} />
                              </div>
                              <div className="ms-3">
                                <h6 className="mb-0">USD a Bs</h6>
                                <p className="text-sm text-muted mb-0">Tasa de Cambio</p>
                              </div>
                            </div>
                            <div className="input-group mt-2">
                              <span className="input-group-text"><FaDollarSign /></span>
                              <input
                                type="number"
                                name="cur_UsdToBs"
                                value={currencyPrices.cur_UsdToBs}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Ingrese tasa USD a Bs"
                              />
                            </div>
                          </div>
                          {/* EUR a USD Panameño */}
                          <div className="col-lg-4 col-md-6 col-sm-12 mt-3">
                            <div className="d-flex align-items-center">
                              <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                                <FaMoneyBillWave size={24} />
                              </div>
                              <div className="ms-3">
                                <h6 className="mb-0">Eur a USD Panameño</h6>
                                <p className="text-sm text-muted mb-0">Tasa de Cambio</p>
                              </div>
                            </div>
                            <div className="input-group mt-2">
                              <span className="input-group-text"><FaPoundSign /></span>
                              <input
                                type="number"
                                name="cur_EurToUsd_Pa"
                                value={currencyPrices.cur_EurToUsd_Pa}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Ingrese tasa EUR a USD Panameño"
                              />
                            </div>
                          </div>
                          {/* EUR a USD Ecuatoriano */}
                          <div className="col-lg-4 col-md-6 col-sm-12 mt-3">
                            <div className="d-flex align-items-center">
                              <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                                <FaChartLine size={24} />
                              </div>
                              <div className="ms-3">
                                <h6 className="mb-0">EUR a USD Ecuatoriano</h6>
                                <p className="text-sm text-muted mb-0">Tasa de Cambio</p>
                              </div>
                            </div>
                            <div className="input-group mt-2">
                              <span className="input-group-text"><FaDollarSign /></span>
                              <input
                                type="number"
                                name="cur_EurToUsd_Ecu"
                                value={currencyPrices.cur_EurToUsd_Ecu}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Ingrese tasa EUR a USD Ecuatoriano"
                              />
                            </div>
                          </div>
                          {/* EUR a Soles */}
                          <div className="col-lg-4 col-md-6 col-sm-12 mt-3">
                            <div className="d-flex align-items-center">
                              <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                                <FaCoins size={24} />
                              </div>
                              <div className="ms-3">
                                <h6 className="mb-0">EUR a Soles</h6>
                                <p className="text-sm text-muted mb-0">Tasa de Cambio</p>
                              </div>
                            </div>
                            <div className="input-group mt-2">
                              <span className="input-group-text"><FaYenSign /></span>
                              <input
                                type="number"
                                name="cur_EurToSol_Pe"
                                value={currencyPrices.cur_EurToSol_Pe}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Ingrese tasa EUR a Soles"
                              />
                            </div>
                          </div>
                          {/* USD a Pesos Chilenos */}
                          <div className="col-lg-4 col-md-6 col-sm-12 mt-3">
                            <div className="d-flex align-items-center">
                              <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                                <FaMoneyCheckAlt size={24} />
                              </div>
                              <div className="ms-3">
                                <h6 className="mb-0">EUR a Pesos Chilenos</h6>
                                <p className="text-sm text-muted mb-0">Tasa de Cambio</p>
                              </div>
                            </div>
                            <div className="input-group mt-2">
                              <span className="input-group-text"><FaYenSign /></span>
                              <input
                                type="number"
                                name="cur_EurToPes_Ch"
                                value={currencyPrices.cur_EurToPes_Ch}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Ingrese tasa USD a Pesos Chilenos"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <button onClick={handleSaveChanges} className="btn btn-success mt-4">Guardar Cambios</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Verificated */}
            {activeItem === "Usuarios verificados" && (
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
                      Verificación
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
                  {filteredUsuarios
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
                          <span className="text-secondary text-xs font-weight-bold">
                            {user.use_dni || "No hay resultados"}
                          </span>
                        </td>
                        <td className="align-middle text-center text-sm">
                          <span className={`badge badge-sm`}>
                            {user.use_verif === "S" ? (
                              <AiOutlineCheckCircle
                                style={{ color: "green", fontSize: "2em" }}
                              />
                            ) : (
                              <AiOutlineCloseCircle
                                style={{ color: "red", fontSize: "2em" }}
                              />
                            )}
                          </span>
                        </td>
                        <td className="align-middle text-center">
                          <span className="text-secondary text-xs font-weight-bold">
                            {user.use_amountUsd || 0}
                          </span>
                        </td>
                        <td className="align-middle text-center">
                          <span className="text-secondary text-xs font-weight-bold">
                            {user.use_amountEur || 0}
                          </span>
                        </td>
                        <td className="align-middle">
                          <Button
                            outline
                            color="info"
                            onClick={toggleViewer}
                          >
                            Detalles
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
                Usuarios No Verificados
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
                      Verificación
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
                  {filteredUsuarios
                    .filter((user) => user.use_verif === "E" || user.use_verif === "e")
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
                          <span className="text-secondary text-xs font-weight-bold">
                            {user.use_dni || "No hay resultados"}
                          </span>
                        </td>
                        <td className="align-middle text-center text-sm">
                          <span className="badge badge-sm">
                            <AiOutlineClockCircle
                              style={{ color: "blue", fontSize: "2em" }}
                            />
                          </span>
                        </td>
                        <td className="align-middle text-center">
                          <span className="text-secondary text-xs font-weight-bold">
                            {user.use_amountUsd || 0}
                          </span>
                        </td>
                        <td className="align-middle text-center">
                          <span className="text-secondary text-xs font-weight-bold">
                            {user.use_amountEur || 0}
                          </span>
                        </td>
                        <td className="align-middle">
                          <Button
                            outline
                            color="success"
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

{activeItem === "Bancos" && (
  <div className="dashboard-container" style={{ width: "100%" }}>
    <Button className='btn' color="primary" onClick={toggleBank}>
      Agregar Banco
    </Button>

    <div className="content">
      <div className="container-fluid py-4">
        <div className="card my-4" style={{ width: "100%" }}>
          <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
              <h6 className="text-white text-capitalize ps-3">Bancos</h6>
            </div>
          </div>
          <div className="card-body px-0 pb-2">
            <div className="table-responsive p-0">
              <Table className="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Banco
                    </th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                      Propietario
                    </th>
                    <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Número
                    </th>
                    <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      NIE
                    </th>
                    <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Teléfono
                    </th>
                    <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Tipo
                    </th>
                    <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Balance
                    </th>
                    <th className="text-secondary opacity-7"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBanks
                    .filter(
                      (bank) =>
                        bank.acceur_Bank !== "Ghost" &&
                        bank.accusd_Bank !== "Ghost"
                    )
                    .map((bank) => (
                      <tr
                        key={bank.acceur_number}
                        onClick={() => {
                          setSelectBank(bank);
                          toggleBankViewer();
                        }}
                      >
                        <td>{bank.acceur_Bank}</td>
                        <td>{bank.acceur_owner}</td>
                        <td className="text-center">{bank.acceur_number}</td>
                        <td className="text-center">{bank.acceur_nie}</td>
                        <td className="text-center">{bank.acceur_phone}</td>
                        <td className="text-center">{bank.acceur_type}</td>
                        <td className="text-center">{bank.acceur_balance}</td>
                        <td className="align-middle">
                         
                          <Button
                            color="warning"
                            
                            onClick={() => handleDisable(bank.acceur_number)}
                          >
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Modal para agregar un banco */}
    <Modal isOpen={showBankModal} toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Agregar Banco</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="acceur_Bank">Banco</Label>
            <Input
              type="select"
              name="acceur_Bank"
              id="acceur_Bank"
              value={formData.acceur_Bank}
              onChange={handleChange}
            >
              <option value="">Selecciona una opción</option>
              <option value="BBVA">BBVA</option>
              <option value="Santander">Santander</option>
              <option value="Revolut">Revolut</option>
              <option value="Wise">Wise</option>
              <option value="Cajamar">Cajamar</option>
              <option value="Unicaja">Unicaja</option>
              <option value="Caixa">Caixa</option>
              <option value="Bizum">Bizum</option>
              <option value="Bankinter">Bankinter</option>
              <option value="RURAL">Caja Rural</option>
              <option value="PIBANK">Pibank</option>
              <option value="Money Go">Money Go</option>
              <option value="EvoBank">EvoBank</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="acceur_owner">Propietario</Label>
            <Input
              type="text"
              name="acceur_owner"
              id="acceur_owner"
              value={formData.acceur_owner}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="acceur_number">Número de Cuenta</Label>
            <Input
              type="text"
              name="acceur_number"
              id="acceur_number"
              value={formData.acceur_number}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="acceur_nie">NIE</Label>
            <Input
              type="text"
              name="acceur_nie"
              id="acceur_nie"
              value={formData.acceur_nie}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="acceur_phone">Teléfono</Label>
            <Input
              type="text"
              name="acceur_phone"
              id="acceur_phone"
              value={formData.acceur_phone}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="acceur_type">Tipo</Label>
            <Input
              type="text"
              name="acceur_type"
              id="acceur_type"
              value={formData.acceur_type}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="acceur_balance">Balance</Label>
            <Input
              type="number"
              name="acceur_balance"
              id="acceur_balance"
              value={formData.acceur_balance}
              onChange={handleChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button color="primary" onClick={handleSubmitBank}>
          Agregar
        </Button>
      </ModalFooter>
    </Modal>
  </div>
)}


    

          </div>
        </div>
      ) : admin.adm_role === "B" ? (
        <div className="app-container">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-h">
              <div className="account-info">
                <div className="account-info-picture">
                  <img src={Logo} alt="Account" />
                </div>
                <div className="account-info-name">
                  {admin && admin.adm_user}
                </div>
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

          <div
            className="app-content"
            style={{ width: window.innerWidth < 450 ? "50%" : "100%" }}
            
          >
            <div className="app-content-header">
              <div className="bars" onClick={showSidebar}>
                <FaBars />
              </div>
              <h1 className="app-content-headerText">{activeItem}</h1>
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
                    {admin && admin.adm_user}
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
                    onClick={() => {handleClick("Home"); setSidebar(false)}}
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
                      activeItem === "Usuarios no verificados"
                        ? "sidebar-list-item active"
                        : "sidebar-list-item"
                    }
                    onClick={() => {handleClick("Usuarios no verificados"); setSidebar(false)}}
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
                <Button
                  color="success"
                  onClick={() => {
                    handleConfirmVerif(select);
                  }}
                >
                  Aprobar
                </Button>
                <Button
                  color="danger"
                  onClick={() => {
                    handleCancelVerif(select);
                  }}
                >
                  Rechazar
                </Button>
                <Button color="secondary" onClick={toggleImageUser}>
                  Volver
                </Button>
              </ModalFooter>
            </Modal>

            {/* Main - Home */}
            {activeItem === "Home" && (
              <div
                className="dashboard-container"
                style={{ width: window.innerWidth < 450 ? "100%" : "100%" }}
              >
                <div className="content">
                  <div className="container-fluid py-4">
                 
                    <div
                      className="card my-4"
                      style={{
                        width: window.innerWidth < 450 ? "100%" : "100%",
                      }}
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
                                        className={`badge badge-sm ${move.mov_status === "E" && (
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

            {/* Users per Verificate */}
            {activeItem === "Usuarios no verificados" && (
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
                Usuarios No Verificados
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
                      Verificación
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
                  {filteredUsuarios
                    .filter((user) => user.use_verif === "E" || user.use_verif === "e")
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
                          <span className="text-secondary text-xs font-weight-bold">
                            {user.use_dni || "No hay resultados"}
                          </span>
                        </td>
                        <td className="align-middle text-center text-sm">
                          <span className="badge badge-sm">
                            <AiOutlineClockCircle
                              style={{ color: "blue", fontSize: "2em" }}
                            />
                          </span>
                        </td>
                        <td className="align-middle text-center">
                          <span className="text-secondary text-xs font-weight-bold">
                            {user.use_amountUsd || 0}
                          </span>
                        </td>
                        <td className="align-middle text-center">
                          <span className="text-secondary text-xs font-weight-bold">
                            {user.use_amountEur || 0}
                          </span>
                        </td>
                        <td className="align-middle">
                          <Button
                            outline
                            color="success"
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
      ) : admin.adm_role === "C" ? (
        <div className="app-container">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-h">
              <div className="account-info">
                <div className="account-info-picture">
                  <img src={Logo} alt="Account" />
                </div>
                <div className="account-info-name">
                  {admin && admin.adm_user}
                </div>
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
            </ul>
          </div>

          <div
            className="app-content"
            style={{ width: window.innerWidth < 450 ? "50%" : "100%" }}
          >
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
                    {admin && admin.adm_user}
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
                </ul>
              </OffcanvasBody>
            </Offcanvas>
            <div className="app-content-header">
              <div className="bars" onClick={showSidebar}>
                <FaBars />
              </div>
              <h1 className="app-content-headerText">{activeItem}</h1>
            </div>

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

            {/* Main - Home */}
            {activeItem === "Home" && (
              <div
                className="dashboard-container"
                style={{ width: window.innerWidth < 450 ? "100%" : "100%" }}
              >
                <div className="content">
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                      
                      </div>
                  <div className="container-fluid py-4">
                    <div
                      className="card my-4"
                      style={{
                        width: window.innerWidth < 450 ? "100%" : "100%",
                      }}
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
                                        className={`badge badge-sm ${move.mov_status === "E" && (
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
          </div>
        </div>
      ) : (
        <h1>Te perdiste...</h1>
      )}
      <ToastContainer
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export { Dashboard };
