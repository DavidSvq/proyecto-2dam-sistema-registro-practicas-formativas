import CustomNavbar from "../../../common/layout/Navbar";
import Sidebar from "../../../common/layout/Sidebar";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";

const AlumnoDashboard = ({ user, onLogout }) => {
  
  if (!user) return <div className="p-5 text-center">Cargando...</div>;

  // Definimos sus opciones específicas
  const linksAlumno = [
    { label: 'Inicio', path: '/alumno-dashboard' },
    { label: 'Ficha Personal', path: '/alumno-dashboard/perfil' },
    { label: 'Asistencia', path: '/alumno-dashboard/asistencia' },
    { label: 'Tareas', path: '/alumno-dashboard/tareas' }
  ];

  return (
    <div className="d-flex flex-column vh-100">
      {/* 1. Navbar siempre arriba */}
      <CustomNavbar user={user} onLogout={onLogout} />

      <div className="d-flex flex-grow-1">
        {/* 2. Sidebar fijo a la izquierda */}
        <Sidebar links={linksAlumno} />

        {/* 3. Área de contenido dinámico */}
        <main className="flex-grow-1 p-4 bg-light" style={{ overflowY: 'auto' }}>
          <Container fluid>
            <Outlet />
          </Container>
        </main>
      </div>
    </div>
  );
};

export default AlumnoDashboard;