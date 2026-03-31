import { Row, Col } from "react-bootstrap";
import InfoCard from "../../../common/components/InfoCard";

const InicioTutor = ({ user }) => {
  return (
    <>
      {/* CABECERA */}
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Panel de Inicio</h2>
          <p className="text-muted">Bienvenido, {user?.nombre}. Resumen de actividad en la empresa.</p>
        </Col>
      </Row>

      {/* RESUMEN RÁPIDO */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <InfoCard 
            titulo="Mis Alumnos" 
            contenido="3" // Dato de ejemplo
            variante="primary" 
          />
        </Col>
        <Col md={4} className="mb-3">
          <InfoCard 
            titulo="Tareas Pendientes" 
            contenido="12" // Dato de ejemplo
            variante="warning" 
          />
        </Col>
        <Col md={4} className="mb-3">
          <InfoCard 
            titulo="Días de Prácticas" 
            contenido="45/90" // Dato de ejemplo
            variante="info" 
          />
        </Col>
      </Row>

      {/* Aquí en el futuro podrías añadir un aviso de "Última tarea entregada" */}
      <Row>
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            <h5>Próximos pasos</h5>
            <p>Desde el menú lateral puedes gestionar las fichas de los alumnos asignados y supervisar el estado de sus tareas semanales.</p>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default InicioTutor;