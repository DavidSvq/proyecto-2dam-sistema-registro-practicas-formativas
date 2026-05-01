import { useState } from 'react';
import { Navbar, Container, Nav, Button, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppModal from '../../common/components/AppModal'; // Asegúrate de que la ruta sea correcta
import AppForm from '../../common/components/AppForm';   // Asegúrate de que la ruta sea correcta
import { recuperarPasswordService } from '../../services/authService'; // La función que creamos antes
import Swal from 'sweetalert2';
import Sidebar from './Sidebar';

const CustomNavbar = ({ user, onLogout, links }) => {
  const navigate = useNavigate();
  const [showModalPass, setShowModalPass] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

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
      <Navbar bg="dark" variant="dark" expand={false} className="mb-4 py-2 shadow">
        <Container fluid className="px-3">
          <div className="d-flex align-items-center">
            {/* 1. Botón Menú Lateral (SOLO MÓVIL) */}
            <Button 
              variant="outline-light" 
              className="d-md-none me-2" 
              onClick={() => setShowOffcanvas(true)}
            >
              <i className="bi bi-list"></i>
            </Button>
            
            <Navbar.Brand href="#" className="fw-bold">FCT Gestión</Navbar.Brand>
          </div>

          {/* 2. Botón de Acciones de Usuario (PC y MÓVIL) */}
          {/* Usamos Navbar.Toggle manual para que funcione siempre como un desplegable */}
          <Navbar.Toggle 
            aria-controls="acciones-usuario" 
            className="border-0"
          >
            <i className="bi bi-person-circle fs-4"></i>
          </Navbar.Toggle>

          <Navbar.Collapse id="acciones-usuario" className="justify-content-end">
            <Nav className="mt-3 mt-md-0 align-items-md-center bg-dark p-3 p-md-0 rounded">
              <Navbar.Text className="me-md-3 mb-2 mb-md-0">
                Conectado como: <span className="text-white fw-bold">{user?.nombre}</span> 
                <small className="ms-1 text-info">({user?.rol})</small>
              </Navbar.Text>
              
              <div className="d-flex flex-column flex-md-row gap-2">
                <Button 
                  variant="outline-warning" 
                  size="sm" 
                  onClick={() => setShowModalPass(true)}
                >
                  Cambiar Contraseña
                </Button>

                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 2. Menú Lateral Desplegable (Móvil) */}
      <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} className="d-md-none">
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="fw-bold">Navegación</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          {/* Reutilizamos tu Sidebar aquí. Asegúrate de pasarle los links */}
          {/* Le quitamos el vh-100 y el ancho fijo para que se adapte al Offcanvas */}
          <div onClick={() => setShowOffcanvas(false)}>
             <Sidebar links={links} isMobile={true} /> 
          </div>
        </Offcanvas.Body>
      </Offcanvas>

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