import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom"; // EL HUECO MÁGICO
import CustomNavbar from "../../../common/layout/Navbar";
import Sidebar from "../../../common/layout/Sidebar";

const ProfesorGestorDashboard = ({ user, onLogout }) => {
  
  if (!user) return <div className="p-5 text-center">Cargando...</div>;

  const menuLinks = [
    { label: 'Inicio', path: '/dashboard' }, // Coincide con "index"
    { label: 'Gestión de Alumnos', path: '/dashboard/alumnos' },
    { label: 'Gestión de Profesores', path: '/dashboard/profesores' },
    { label: 'Gestión de Empresas', path: '/dashboard/empresas' },
    { label: 'Tutores de Empresa', path: '/dashboard/tutores-empresa' },
    { label: 'Gestión de Centros', path: '/dashboard/centros' }
];

  return (
    <div className="d-flex flex-column vh-100">
      <CustomNavbar user={user} onLogout={onLogout} />

      <div className="d-flex flex-grow-1 overflow-hidden">
        <Sidebar links={menuLinks} />

        <main className="flex-grow-1 p-4 bg-light" style={{ overflowY: 'auto' }}>
          <Container fluid>
            {/* AQUÍ SE RENDERIZARÁN LAS VISTAS SEGÚN LA RUTA */}
            <Outlet /> 
          </Container>
        </main>
      </div>
    </div>
  );
};

export default ProfesorGestorDashboard;