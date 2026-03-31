import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Limpia el estado en App.jsx
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="#">FCT Gestión</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Aquí podrías condicionar links por rol si quisieras */}
            <Nav.Link href="#home">Inicio</Nav.Link>
          </Nav>
          
          <Navbar.Text className="me-3">
            Conectado como: <span className="text-white fw-bold">{user?.nombre}</span> 
            <small className="ms-1 text-info">({user?.rol})</small>
          </Navbar.Text>
          
          <Button variant="outline-danger" size="sm" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;