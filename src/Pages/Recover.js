import React, { useState } from "react";
import { Link, useHistory, Redirect } from "react-router-dom";
import axios from "axios";
import {
  Form,
  FormGroup,
  Input,
  Button,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { FaRegEnvelope } from "react-icons/fa";
import { Oval } from "react-loader-spinner";  
import LogoSimple from "../Assets/Images/Logo-Simple.png";
import { useDataContext } from "../Context/dataContext";
import { toast, ToastContainer } from "react-toastify";

function Recover() {
  const history = useHistory();
  const { logged, url } = useDataContext();
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);  // Activar el estado de carga
      await axios.post(`${url}/Mailer/emailRecovery/${correo}`);
      setCorreo("");
      toast.success("¡Correo de recuperación enviado con éxito! Revisa tu bandeja de entrada.");
      setTimeout(() => {
        history.push("/Login");
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al enviar el correo de recuperación. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);  // Desactivar el estado de carga
    }
  };

  return logged ? (
    <Redirect to="/Changes" />
  ) : (
    <div className="Recover">
      <div className="card">
        <div className="recover-content">
          <Form onSubmit={handleSubmit}>
            <img src={LogoSimple} alt="Europa Cambios" width={100} />

            <FormGroup>
              <InputGroup>
                <InputGroupText>
                  <FaRegEnvelope />
                </InputGroupText>
                <Input
                  id="correo"
                  type="email"
                  name="correo"
                  value={correo}
                  placeholder="Correo"
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </InputGroup>
            </FormGroup>

            <div className="button-group mt-3">
              <Link className="btn btn-secondary-custom" to="/Login">
                Volver
              </Link>
              <Button type="submit" color="primary" className="btn" disabled={loading}>
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

export { Recover };
