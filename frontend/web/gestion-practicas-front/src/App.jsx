import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Layouts/Dashboards
import Login from './modules/auth/views/Login';
import AlumnoDashboard from './modules/alumno/views/AlumnoDashboard';
import ProfesorGestorDashboard from './modules/profesorgestor/views/ProfesorGestorDashboard';
import ProfesorTutorDashboard from './modules/profesortutor/views/ProfesorTutorDashboard';
import TutorEmpresaDashboard from './modules/tutorempresa/views/TutorEmpresaDashboard';

// Vistas Gestor
import GestionAlumnos from './modules/profesorgestor/views/GestionAlumnos';
import GestionCentro from './modules/profesorgestor/views/GestionCentro';
import GestionEmpresas from './modules/profesorgestor/views/GestionEmpresas';
import GestionProfesores from './modules/profesorgestor/views/GestionProfesores';
import GestionTutorEmpresa from './modules/profesorgestor/views/GestionTutorEmpresa';
import Inicio from './modules/profesorgestor/views/Inicio';

// Vistas Tutor Empresa
import InicioTutor from './modules/tutorempresa/views/InicioTutor';
import GestionAlumnosTutor from './modules/tutorempresa/views/GestionAlumnosTutor';
import GestionTareasTutor from './modules/tutorempresa/views/GestionTareasTutor';

// Vistas Alumno
import InicioAlumno from './modules/alumno/views/InicioAlumno';
import FichaAlumno from './modules/alumno/views/FichaAlumno';
import AsistenciaAlumno from './modules/alumno/views/AsistenciaAlumno';
import TareasAlumno from './modules/alumno/views/TareasAlumno';

// Vistas Profesor Tutor
import InicioProfesorTutor from './modules/profesortutor/views/InicioProfesorTutor';
import GestionAlumnosProfesorTutor from './modules/profesortutor/views/GestionAlumnosProfesorTutor';
import SeguimientoTareasProfesorTutor from './modules/profesortutor/views/SeguimientoTareasProfesorTutor';

function App() {
  // Estado del usuario recuperado de localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={(u) => setUser(u)} />} />

        {/* GESTOR */}
        <Route path="/dashboard" element={<ProfesorGestorDashboard user={user} onLogout={handleLogout} />}>
          <Route index element={<Inicio user={user}/>} /> 
          <Route path="alumnos" element={<GestionAlumnos user={user}/>} />
          <Route path="profesores" element={<GestionProfesores user={user}/>} />
          <Route path="empresas" element={<GestionEmpresas user={user}/>} />
          <Route path="tutores-empresa" element={<GestionTutorEmpresa user={user}/>} />
          <Route path="centros" element={<GestionCentro user={user}/>} />
        </Route>

        {/* TUTOR EMPRESA */}
        <Route path="/tutor-dashboard" element={<TutorEmpresaDashboard user={user} onLogout={handleLogout} />}>
          <Route index element={<InicioTutor user={user} />} />
          <Route path="alumnos" element={<GestionAlumnosTutor user={user} />} />
          <Route path="tareas" element={<GestionTareasTutor user={user} />} />
        </Route>

        {/* ALUMNO */}
        <Route path="/alumno-dashboard" element={<AlumnoDashboard user={user} onLogout={handleLogout} />}>
          <Route index element={<InicioAlumno user={user} />} />
          <Route path="perfil" element={<FichaAlumno user={user} />} />
          <Route path="asistencia" element={<AsistenciaAlumno user={user}/>} />
          <Route path="tareas" element={<TareasAlumno user={user}/>} />
        </Route>

        {/* PROFESOR TUTOR */}
        <Route path="/profesor-tutor-dashboard" element={<ProfesorTutorDashboard user={user} onLogout={handleLogout} />}>
          <Route index element={<InicioProfesorTutor user={user} />} />
          <Route path="alumnos" element={<GestionAlumnosProfesorTutor user={user}/>} />
          <Route path="tareas" element={<SeguimientoTareasProfesorTutor user={user}/>} />
        </Route>

        {/* REPARTIDOR DE RAÍZ: Redirige según el rol si ya está logueado */}
        <Route path="/" element={
          !user ? <Navigate to="/login" /> : 
          user.rol === 'PROFESOR_GESTOR' ? <Navigate to="/dashboard" /> :
          user.rol === 'TUTOR_EMPRESA' ? <Navigate to="/tutor-dashboard" /> :
          user.rol === 'ALUMNO' ? <Navigate to="/alumno-dashboard" /> :
          user.rol === 'PROFESOR_TUTOR' ? <Navigate to="/profesor-tutor-dashboard" /> :
          <Navigate to="/login" />
        } />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
