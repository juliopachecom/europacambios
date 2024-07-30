import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, Redirect, useHistory } from "react-router-dom";
import {
  Form,
  FormGroup,
  Input,
  Button,
  Label,
  InputGroup,
  InputGroupText,
  FormFeedback
} from "reactstrap";
import {
  FaUser,
  FaLock,
  FaRegEnvelope,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import { Oval } from "react-loader-spinner";  
import LogoSimple from "../Assets/Images/Logo-Simple.png";
import { useDataContext } from "../Context/dataContext";
import { toast, ToastContainer } from "react-toastify";

function Register() {
  const history = useHistory();
  const { logged, url } = useDataContext();

  const [use_name, setUse_name] = useState("");
  const [use_lastName, setUse_lastName] = useState("");
  const [use_email, setUse_email] = useState("");
  const [use_password, setUse_password] = useState("");
  const [use_confirm, setUse_confirm] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // Estado para manejar la carga

  const [errors, setErrors] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
    terms: false,
  });

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!use_name) newErrors.name = "Este campo es obligatorio";
    if (!use_lastName) newErrors.lastName = "Este campo es obligatorio";
    if (!use_email) newErrors.email = "Este campo es obligatorio";
    if (use_password.length > 0 && use_password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }
    if (use_confirm && use_confirm !== use_password) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    if (!termsAccepted) newErrors.terms = "Debes aceptar los términos y condiciones";

    setErrors(newErrors);
  }, [use_name, use_lastName, use_email, use_password, use_confirm, termsAccepted]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleChange = (field, value) => {
    switch (field) {
      case 'name':
        setUse_name(value);
        break;
      case 'lastName':
        setUse_lastName(value);
        break;
      case 'email':
        setUse_email(value);
        break;
      case 'password':
        setUse_password(value);
        break;
      case 'confirmPassword':
        setUse_confirm(value);
        break;
      default:
        break;
    }

    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);  // Activar el estado de carga

    try {
      await axios.post(`${url}/Auth/register`, {
        use_name,
        use_lastName,
        use_dni: "",
        use_email,
        use_password,
        use_verif: "N",
        use_img: "",
      });

      await axios.post(`${url}/Mailer/EmailWelcome/${use_email}`);

      toast.success("¡Registro exitoso! Te hemos enviado un correo de bienvenida.");
      setTimeout(() => history.push("/Login"), 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ocurrió un error durante el registro. Por favor, intenta nuevamente.");
    } finally {
      setIsLoading(false);  // Desactivar el estado de carga
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return logged ? (
    <Redirect to="/Changes" />
  ) : (
    <div className="Register">
      <div className="card">
        <div className="register-content">
          <Form onSubmit={handleSubmit}>
            <img src={LogoSimple} alt="Europa Cambios" width={100} />
            {/* Campos del formulario */}

            <FormGroup>
              <InputGroup>
                <InputGroupText>
                  <FaUser />
                </InputGroupText>
                <Input
                  id="nombre"
                  type="text"
                  name="Nombre"
                  value={use_name}
                  placeholder="Nombre"
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                  invalid={touched.name && !!errors.name}
                />
                <FormFeedback>{touched.name && errors.name}</FormFeedback>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <InputGroup>
                <InputGroupText>
                  <FaUser />
                </InputGroupText>
                <Input
                  id="apellido"
                  type="text"
                  name="apellido"
                  value={use_lastName}
                  placeholder="Apellido"
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, lastName: true }))}
                  invalid={touched.lastName && !!errors.lastName}
                />
                <FormFeedback>{touched.lastName && errors.lastName}</FormFeedback>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <InputGroup>
                <InputGroupText>
                  <FaRegEnvelope />
                </InputGroupText>
                <Input
                  id="correo"
                  type="email"
                  name="Correo"
                  value={use_email}
                  placeholder="Correo"
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                  invalid={touched.email && !!errors.email}
                />
                <FormFeedback>{touched.email && errors.email}</FormFeedback>
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
                  value={use_password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                  invalid={touched.password && !!errors.password}
                />
                <InputGroupText onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroupText>
                <FormFeedback>{touched.password && errors.password}</FormFeedback>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <InputGroup>
                <InputGroupText>
                  <FaLock />
                </InputGroupText>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirmar Contraseña"
                  value={use_confirm}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
                  invalid={touched.confirmPassword && !!errors.confirmPassword}
                />
                <InputGroupText onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroupText>
                <FormFeedback>{touched.confirmPassword && errors.confirmPassword}</FormFeedback>
              </InputGroup>
            </FormGroup>

            <FormGroup className="terms-container">
              <Input
                type="checkbox"
                id="terms"
                name="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                onBlur={() => setTouched(prev => ({ ...prev, terms: true }))}
                invalid={touched.terms && !!errors.terms}
              />
              <Label for="terms" check>
                Acepto los{" "}
                <Link to="/TermsAndConditions">
                  términos y condiciones
                </Link>
              </Label>
              <FormFeedback>{touched.terms && errors.terms}</FormFeedback>
            </FormGroup>

            <div className="button-group mt-3">
              <Link className="btn btn-secondary-custom" to="/">
                Volver
              </Link>
              <Button
                type="submit"
                disabled={
                  isLoading ||  // Deshabilitar el botón si está cargando
                  Object.values(errors).some(error => error) ||
                  !use_name ||
                  !use_lastName ||
                  !use_email ||
                  !use_password ||
                  use_password.length < 8 ||
                  use_confirm !== use_password ||
                  !termsAccepted
                }
              >
                {isLoading ? <Oval height={20} width={20} /> : "REGISTRAR"} {/* Spinner o texto */}
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <ToastContainer autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export { Register };
