import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import axios from "axios";
import {
  Form,
  FormGroup,
  Input,
  Button,
  InputGroup,
  InputGroupText,
  FormFeedback,
} from "reactstrap";
import { FaLock } from "react-icons/fa";
import { Oval } from "react-loader-spinner"; // Importar el componente de carga
import LogoSimple from "../Assets/Images/Logo-Simple.png";
import { useDataContext } from "../Context/dataContext";
import { toast, ToastContainer } from "react-toastify"; 

function RecoverUpdate() {
  const history = useHistory();
  const [userEmail, setUserEmail] = useState({});
  const [use_password, setUse_Password] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { url } = useDataContext();
  const { id, email } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (use_password.length < 8) {
      toast.error("La contraseña debe contener al menos 8 caracteres.");
      return;
    }
    if (confirmPassword !== use_password) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    if (email !== userEmail.use_email || parseInt(id) !== userEmail.use_id) {
      toast.error("Los datos no coinciden.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`${url}/Users/PasswordRecovery/${id}`, {
        use_password,
      });
      toast.success("Contraseña recuperada con éxito. Redirigiendo al login...");
      setTimeout(() => {
        history.push("/Login");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Error al recuperar la contraseña. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Users/email/${email}`);
      setUserEmail(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [email, url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="RecoverUpdate">
      <div className="card">
        <div className="recover-update-content">
          <Form onSubmit={handleSubmit}>
            <img src={LogoSimple} alt="Europa Cambios" width={100} />

            <FormGroup>
              <InputGroup>
                <InputGroupText>
                  <FaLock />
                </InputGroupText>
                <Input
                  type="password"
                  name="password"
                  value={use_password}
                  placeholder="Nueva Contraseña"
                  onChange={(e) => setUse_Password(e.target.value)}
                  invalid={use_password.length > 0 && use_password.length < 8}
                />
                {use_password.length < 8 && (
                  <FormFeedback>
                    Su contraseña debe contener mínimo 8 caracteres
                  </FormFeedback>
                )}
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <InputGroup>
                <InputGroupText>
                  <FaLock />
                </InputGroupText>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  placeholder="Confirmar Contraseña"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  invalid={confirmPassword !== use_password && confirmPassword.length > 0}
                />
                {confirmPassword !== use_password && (
                  <FormFeedback>
                    Las contraseñas deben ser iguales
                  </FormFeedback>
                )}
              </InputGroup>
            </FormGroup>

            <div className="button-group mt-3">
              <Link className="btn btn-secondary-custom" to="/Login">
                Volver
              </Link>
              <Button
                type="submit"
                color="primary"
                disabled={
                  loading ||  // Deshabilitar botón si está cargando
                  use_password !== confirmPassword ||
                  use_password.length < 8 ||
                  email !== userEmail.use_email ||
                  parseInt(id) !== userEmail.use_id
                }
              >
                {loading ? <Oval height={20} width={20} color="#fff" /> : "Recuperar"} {/* Spinner o texto */}
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <ToastContainer autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export { RecoverUpdate };
