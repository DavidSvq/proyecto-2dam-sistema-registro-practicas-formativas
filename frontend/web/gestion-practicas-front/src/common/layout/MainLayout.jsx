import { Outlet } from 'react-router-dom';
import CustomNavbar from './CustomNavbar';
import { Container } from 'react-bootstrap';

const MainLayout = ({ user, onLogout }) => {
  return (
    <div className="main-layout d-flex flex-column vh-100">
      {/* El Navbar siempre visible */}
      <CustomNavbar user={user} onLogout={onLogout} />
      
      <div className="d-flex flex-grow-1 overflow-hidden">
        <div className="d-none d-lg-block">
          <Container fluid className="p-2 p-md-4 overflow-auto flex-grow-1">
            <Outlet /> 
          </Container>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;