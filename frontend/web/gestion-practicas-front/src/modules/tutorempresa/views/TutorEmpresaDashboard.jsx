import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import CustomNavbar from "../../../common/layout/Navbar";
import Sidebar from "../../../common/layout/Sidebar";

const TutorEmpresaDashboard = ({ user, onLogout }) => {
  
  // Si no hay usuario (por ejemplo, al refrescar), mostramos un estado de carga
  if (!user) return <div className="p-5 text-center">Cargando sesión...</div>;

  /**
   * CONFIGURACIÓN DEL SIDEBAR:
   * Solo las 3 opciones pactadas para el Tutor de Empresa.
   * Los paths deben colgar de '/empresa-dashboard' para coincidir con App.jsx
   */
  const linksTutor = [
    { label: 'Inicio', path: '/tutor-dashboard' },
    { label: 'Alumnos', path: '/tutor-dashboard/alumnos' },
    { label: 'Gestión de Tareas', path: '/tutor-dashboard/tareas' }
  ];

  return (
    <div className="d-flex flex-column vh-100">
      {/* Barra de navegación superior con identidad del usuario */}
      <CustomNavbar user={user} onLogout={onLogout} links={linksTutor} />

      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Menú lateral con los accesos directos a las entidades */}
        <Sidebar links={linksTutor} />

        {/* ÁREA DE CONTENIDO DINÁMICO */}
        <main className="flex-grow-1 p-4 bg-light" style={{ overflowY: 'auto' }}>
          <Container fluid>
            {/* CRÍTICO: El Outlet es el "agujero" donde React Router 
               renderizará Inicio, Alumnos o Tareas según el clic en el Sidebar.
            */}
            <Outlet /> 
          </Container>
        </main>
      </div>
    </div>
  );
};

export default TutorEmpresaDashboard;