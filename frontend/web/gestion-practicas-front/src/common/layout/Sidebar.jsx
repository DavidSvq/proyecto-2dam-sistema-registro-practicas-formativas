import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar = ({ links = [], isMobile = false }) => {
  return (
    <div 
      className={`bg-light p-3 ${
        isMobile 
          ? 'h-100 w-100' // Si es móvil (dentro de Offcanvas), ocupa todo el espacio disponible
          : 'border-end vh-100 d-none d-md-block' // Si es escritorio, se fija a la izquierda y se oculta en móvil
      }`} 
      style={!isMobile ? { width: '240px', minWidth: '240px', paddingTop: '20px' } : { paddingTop: '10px' }}
    >
      <Nav className="flex-column">
        <small className="text-muted fw-bold mb-3 ps-2">MENÚ</small>
        {links.map((link, index) => (
          <Nav.Link 
            key={index} 
            as={Link} 
            to={link.path} 
            className="text-dark py-2 mb-1 rounded hover-light"
          >
            {link.label}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;