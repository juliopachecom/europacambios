import React, { useState } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import LogoSimple from "../Assets/Images/Logo-Simple.png";
import { useDataContext } from '../Context/dataContext';
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Asegúrate de importar los estilos de react-toastify

function AdmEc() {
  const history = useHistory();
  const { setLogged, setInfoTkn, url } = useDataContext();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tkn, setTkn] = useState('');
  const [error, setError] = useState("");
  const [attemps, setAttemps] = useState(3);
  const [alertVisible, setAlertVisible] = useState(false);

  const fetchData = async (email, password) => {
    try {
      const response = await axios.get(`${url}/Auth/loginAdmin/${email}/${password}`);
      setInfoTkn(response.data.data.access_token);
      const response2 = await axios.get(`${url}/Auth/findByTokenAdmin/${response.data.data.access_token}`);
      setTkn(response2.data);
      setLogged(true);
      history.push({
        pathname: "/Dashboard",
        state: {
          user: tkn,
        }
      });
      return true; 
    } catch (error) {
      toast.error("Ocurrió un error durante el inicio de sesión. Por favor, verifica los datos e intenta nuevamente.");
      return false; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const success = await fetchData(user, password);
      if (!success) {
        throw new Error("Login failed");
      }
    } catch (error) {
      if (attemps <= 1) {
        setError("Has superado el número de intentos. Intenta más tarde.");
        setAlertVisible(true);
        setAttemps(0); // Actualiza los intentos a 0 para evitar más acciones
      } else {
        setAttemps(attemps - 1);
        const errorMessage = `Correo o contraseña incorrectos. Inténtalo de nuevo. Intentos restantes: ${attemps - 1}`;
        setError(errorMessage);
        setAlertVisible(true);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="Login">
      <div className="card">
        <div className="login-content">
          <form onSubmit={handleSubmit}>
            <img src={LogoSimple} alt="Europa Cambios" width={100} />

            <div className="input-div one">
              <div className="i">
                <FaUser />
              </div>
              <div className="div">
                <input
                  id="usuario"
                  type="text"
                  className="input"
                  name="usuario"
                  value={user}
                  placeholder="Usuario"
                  onChange={(e) => setUser(e.target.value)}
                />
              </div>
            </div>
            <div className="input-div pass">
              <div className="i">
                <FaLock />
              </div>
              <div className="div">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="input"
                  name="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="view">
              <div
                className={`fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } verPassword`}
                onClick={togglePasswordVisibility}
                id="verPassword"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            {alertVisible && <div className="alert">{error}</div>}
            <div className="text-center">
              <button
                name="btningresar"
                className="btn"
                type="submit"
                disabled={attemps === 0}
              >
                INICIAR SESIÓN
              </button>
            </div>
          </form>
        </div>
      </div>
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

export { AdmEc };
