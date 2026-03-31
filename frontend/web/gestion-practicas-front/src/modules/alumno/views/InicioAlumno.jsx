import { Row, Col } from "react-bootstrap";
import InfoCard from "../../../common/components/InfoCard";

const InicioAlumno = ({ user }) => {
  return (
    <>
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Mi Panel de Prácticas</h2>
          <p className="text-muted">Hola, {user.nombre}. Aquí tienes un resumen de tu estado actual.</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <InfoCard titulo="Horas Totales" contenido="120 / 370" variante="primary" />
        </Col>
        <Col md={4} className="mb-3">
          <InfoCard titulo="Tareas Entregadas" contenido="8" variante="success" />
        </Col>
        <Col md={4} className="mb-3">
          <InfoCard titulo="Faltas de Asistencia" contenido="0" variante="danger" />
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            <h5>Empresa Asignada</h5>
            <p className="mb-0"><strong>Entidad:</strong> {user.alumnoInfo?.empresaNombre || 'Pendiente de asignación'}</p>
            <p><strong>Tutor de Empresa:</strong> {user.alumnoInfo?.tutorEmpresaNombre || 'No asignado'}</p>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default InicioAlumno;