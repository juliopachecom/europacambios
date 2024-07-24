import React, { useState } from "react";
import axios from 'axios';
import { useHistory, Link } from "react-router-dom";
import {
  Form,
  FormGroup,
  Input,
  Button,
  InputGroup,
  InputGroupText,
  FormFeedback
} from "reactstrap";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import LogoSimple from "../Assets/Images/Logo-Simple.png";
import { useDataContext } from '../Context/dataContext';

function Login() {
  const history = useHistory();
  const { setLogged, setInfoTkn, url } = useDataContext();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [attemps, setAttemps] = useState(3);
  const [tkn, setTkn] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [touched, setTouched] = useState({
    user: false,
    password: false
  });

  const fetchData = async (email, password) => {
    try {
      const response = await axios.get(`${url}/Auth/login/${email}/${password}`);
      // console.log(response)
      setInfoTkn(response.data.data.access_token);
      const response2 = await axios.get(`${url}/Auth/findByToken/${response.data.data.access_token}`);
      setTkn(response2.data);
      setLogged(true);
      history.push({
        pathname: "/Changes",
        state: {
          user: tkn,
        }
      });
      return true; 
    } catch (error) {
      console.log(error);
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
        setAttemps(0);
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

  const handleChange = (field, value) => {
    switch (field) {
      case 'user':
        setUser(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div className="Login">
      <div className="card">
        <div className="login-content">
          <Form onSubmit={handleSubmit}>
            <img src={LogoSimple} alt="Europa Cambios" width={100} />

            <FormGroup>
              <InputGroup>
                <InputGroupText>
                  <FaUser />
                </InputGroupText>
                <Input
                  type="text"
                  id="user"
                  name="user"
                  value={user}
                  placeholder="Correo"
                  onChange={(e) => handleChange('user', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, user: true }))}
                  invalid={touched.user && !user}
                />
                <FormFeedback>{touched.user && !user ? "Este campo es obligatorio" : ""}</FormFeedback>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <InputGroup>
                <InputGroupText>
                  <FaLock />
                </InputGroupText>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                  invalid={touched.password && password.length < 8}
                />
                <InputGroupText onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroupText>
                <FormFeedback>{touched.password && password.length < 8 ? "La contraseña debe tener al menos 8 caracteres" : ""}</FormFeedback>
              </InputGroup>
            </FormGroup>

            {alertVisible && <div className="alert">{error}</div>}

            <div className="text-center">
              <Link className="font-italic isai5" to="/Recover">
                Olvidé mi contraseña
              </Link>
              <Button
                type="submit"
                color="primary"
                className="btn"
              >
                INICIAR SESIÓN
              </Button>
              <Link className="font-italic isai5" to="/Register">
                ¿Aún no tienes cuenta? Regístrate
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export { Login };
