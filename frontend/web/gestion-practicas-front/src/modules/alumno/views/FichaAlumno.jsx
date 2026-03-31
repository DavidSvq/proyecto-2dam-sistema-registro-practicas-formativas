import { Row, Col, Card, ListGroup } from "react-bootstrap";

const FichaAlumno = ({ user }) => {
  // Datos extendidos (en el futuro vendrán del backend)
  const infoExtra = {
    telefono: "600 000 000",
    direccion: "Calle Falsa 123, Sevilla",
    seguridadSocial: "12/34567890/12",
    centroEstudios: "I.E.S. Tecnológico",
    ciclo: "2º Desarrollo de Aplicaciones Web (DAW)"
  };

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Mi Ficha Personal</h2>
          <p className="text-muted">Consulta y verifica tus datos de matriculación y contacto.</p>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white fw-bold">Datos Académicos</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item><strong>Nombre:</strong> {user.nombre} {user.apellidos}</ListGroup.Item>
              <ListGroup.Item><strong>Email:</strong> {user.email}</ListGroup.Item>
              <ListGroup.Item><strong>Centro:</strong> {infoExtra.centroEstudios}</ListGroup.Item>
              <ListGroup.Item><strong>Ciclo:</strong> {infoExtra.ciclo}</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-dark text-white fw-bold">Información de Contacto</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item><strong>Teléfono:</strong> {infoExtra.telefono}</ListGroup.Item>
              <ListGroup.Item><strong>Dirección:</strong> {infoExtra.direccion}</ListGroup.Item>
              <ListGroup.Item><strong>Nº Seguridad Social:</strong> {infoExtra.seguridadSocial}</ListGroup.Item>
              <ListGroup.Item><strong>ID Usuario:</strong> {user.id}</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default FichaAlumno;