import { useState } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppModal from '../../common/components/AppModal'; // Asegúrate de que la ruta sea correcta
import AppForm from '../../common/components/AppForm';   // Asegúrate de que la ruta sea correcta
import { recuperarPasswordService } from '../../services/authService'; // La función que creamos antes
import Swal from 'sweetalert2';

const CustomNavbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [showModalPass, setShowModalPass] = useState(false);

  // 1. Definimos los campos para el formulario de clave
  const camposPassword = [
    { name: 'password', label: 'Nueva Contraseña', type: 'password', md: 12, required: true },
    { name: 'confirmPassword', label: 'Confirmar Nueva Contraseña', type: 'password', md: 12, required: true }
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // 2. Lógica para procesar el cambio
  const manejarCambioPass = async (datos) => {
    if (datos.password !== datos.confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#dc3545"
      });
      return;
    }

    try {
      // Llamamos al servicio usando el email y rol del usuario actual
      await recuperarPasswordService(user.email, datos.password, user.rol);
      
      Swal.fire({
        title: "¡Contraseña Actualizada!",
        text: "Por seguridad, debes iniciar sesión de nuevo con tu nueva clave.",
        icon: "success",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#0d6efd",
        allowOutsideClick: false
      })
      setShowModalPass(false);
      handleLogout(); // Forzamos el re-login
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo actualizar la contraseña. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Cerrar"
      });
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 py-12">
        <Container>
          <Navbar.Brand href="#">FCT Gestión</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">

            <Navbar.Text className="me-3">
              Conectado como: <span className="text-white fw-bold">{user?.nombre}</span> 
              <small className="ms-1 text-info">({user?.rol})</small>
            </Navbar.Text>
            
            {/* Botón Amarillo de Cambiar Contraseña */}
            <Button 
              variant="outline-warning" 
              size="sm" 
              className="me-2" 
              onClick={() => setShowModalPass(true)}
            >
              Cambiar Contraseña
            </Button>

            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal para el formulario de cambio de clave */}
      <AppModal 
        show={showModalPass} 
        handleClose={() => setShowModalPass(false)} 
        title="Cambiar mi Contraseña"
      >
        <AppForm 
          fields={camposPassword} 
          onSubmit={manejarCambioPass} 
          buttonLabel="Actualizar y Salir" 
        />
      </AppModal>
    </>
  );
};

export default CustomNavbar;