import CustomNavbar from "../../../common/layout/Navbar";
import Sidebar from "../../../common/layout/Sidebar";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";

const ProfesorTutorDashboard = ({ user, onLogout }) => {
  
  if (!user) return <div className="p-5 text-center">Cargando...</div>;

  // Opciones específicas para el Tutor Docente
  const linksTutorDocente = [
    { label: 'Inicio', path: '/profesor-tutor-dashboard' },
    { label: 'Mis Alumnos', path: '/profesor-tutor-dashboard/alumnos' },
    { label: 'Seguimiento Tareas', path: '/profesor-tutor-dashboard/tareas' }
  ];

  return (
    <div className="d-flex flex-column vh-100">
      {/* 1. Barra superior */}
      <CustomNavbar user={user} onLogout={onLogout} />

      <div className="d-flex flex-grow-1">
        {/* 2. Menú lateral de supervisión */}
        <Sidebar links={linksTutorDocente} />

        {/* 3. Zona de trabajo principal */}
        <main className="flex-grow-1 p-4 bg-light" style={{ overflowY: 'auto' }}>
          <Container fluid>
            <Outlet />
          </Container>
        </main>
      </div>
    </div>
  );
};

export default ProfesorTutorDashboard;