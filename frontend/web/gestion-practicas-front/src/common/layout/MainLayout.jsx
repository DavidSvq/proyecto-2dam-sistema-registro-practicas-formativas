import { Outlet } from 'react-router-dom';
import CustomNavbar from './CustomNavbar';
import { Container } from 'react-bootstrap';

const MainLayout = ({ user, onLogout }) => {
  return (
    <div className="main-layout">
      {/* El Navbar siempre visible */}
      <CustomNavbar user={user} onLogout={onLogout} />
      
      {/* El contenido dinámico (Dashboards) */}
      <Container>
        <Outlet /> 
      </Container>
    </div>
  );
};

export default MainLayout;