import { Row, Col } from "react-bootstrap";
import InfoCard from "../../../common/components/InfoCard";

const Inicio = () => {
  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold">Panel de Control: Gestor</h2>
        <p className="text-muted">Resumen general del estado de las FCT.</p>
      </div>

      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <InfoCard titulo="Alumnos Activos" contenido="45" variante="primary" />
        </Col>
        <Col md={3} className="mb-3">
          <InfoCard titulo="Empresas Colaboradoras" contenido="12" variante="success" />
        </Col>
        <Col md={3} className="mb-3">
          <InfoCard titulo="Tutores Empresa" contenido="15" variante="info" />
        </Col>
        <Col md={3} className="mb-3">
          <InfoCard titulo="Alertas Pendientes" contenido="3" variante="danger" />
        </Col>
      </Row>

      <div className="bg-white p-5 rounded shadow-sm border text-center">
        <h4>Bienvenido al Sistema de Gestión de FCT</h4>
        <p className="text-muted">Selecciona una opción del menú lateral para comenzar a trabajar.</p>
      </div>
    </>
  );
};

export default Inicio;