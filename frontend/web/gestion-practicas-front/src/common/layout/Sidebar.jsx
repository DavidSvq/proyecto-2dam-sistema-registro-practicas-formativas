import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar = ({ links }) => {
  return (
    <div className="bg-light border-end vh-100 p-3" style={{ width: '240px', paddingTop: '20px' }}>
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