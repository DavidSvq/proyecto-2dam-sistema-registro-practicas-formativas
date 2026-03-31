import { Row, Col } from "react-bootstrap";
import InfoCard from "../../../common/components/InfoCard";

const InicioProfesorTutor = ({ user }) => {
  return (
    <>
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Panel de Tutorización</h2>
          <p className="text-muted">Bienvenido, Prof. {user.nombre}. Resumen de tus alumnos asignados.</p>
        </Col>
      </Row>
      <Row>
        <Col md={4} className="mb-3">
          <InfoCard titulo="Alumnos Tutelados" contenido="15" variante="primary" />
        </Col>
        <Col md={4} className="mb-3">
          <InfoCard titulo="Empresas Colaboradoras" contenido="8" variante="info" />
        </Col>
        <Col md={4} className="mb-3">
          <InfoCard titulo="Visitas Pendientes" contenido="3" variante="warning" />
        </Col>
      </Row>
    </>
  );
};

export default InicioProfesorTutor;