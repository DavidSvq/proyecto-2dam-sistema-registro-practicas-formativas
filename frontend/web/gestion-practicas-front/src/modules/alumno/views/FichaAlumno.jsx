import { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert, Container } from "react-bootstrap";
import InfoCard from "../../../common/components/InfoCard";
import { alumnoService } from "../../../services/alumnoService";

const FichaAlumno = ({ user }) => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPerfil = async () => {
      if (!user?.id) {
        setError("No se pudo identificar al usuario.");
        setLoading(false);
        return;
      }

      try {
        const data = await alumnoService.getAlumnoById(user.id);
        setPerfil(data);
      } catch (err) {
        setError("Error al obtener los datos del perfil.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [user?.id]);

  if (loading) return <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;

  return (
    <Container fluid className="px-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Ficha Personal del Alumno</h2>
          <p className="text-muted">Información detallada de registro y contacto oficial.</p>
        </Col>
      </Row>

      {/* FILA 1: NOMBRE COMPLETO (Sola para evitar cortes) */}
      <Row className="mb-4">
        <Col md={12}>
          <InfoCard 
            titulo="Nombre y Apellidos" 
            contenido={`${perfil?.nombre} ${perfil?.apellidos}`} 
            variante="primary" 
            icono="bi bi-person-badge-fill"
          />
        </Col>
      </Row>

      {/* FILA 2: DATOS DE CONTROL (Triple columna con altura igualada) */}
      <Row className="mb-4">
        <Col md={4} className="mb-3 mb-md-0">
          <InfoCard 
            titulo="ID / Matrícula" 
            contenido={perfil?.id} 
            variante="info" 
            icono="bi bi-fingerprint"
          />
        </Col>
        <Col md={4} className="mb-3 mb-md-0">
          <InfoCard 
            titulo="Rol en Sistema" 
            contenido={perfil?.rol} 
            variante="secondary" 
            icono="bi bi-shield-lock"
          />
        </Col>
        <Col md={4}>
          <InfoCard 
            titulo="Total Horas Registradas" 
            contenido={`${perfil?.horasTotales || 0} h`} 
            variante="dark" 
            icono="bi bi-stopwatch"
          />
        </Col>
      </Row>

      <hr className="my-4" />
      <h5 className="mb-3 fw-bold text-uppercase small text-muted">Canales de Contacto</h5>

      {/* FILA 3: EMAIL ALUMNO */}
      <Row className="mb-3">
        <Col md={12}>
          <InfoCard 
            titulo="Tu Correo Electrónico" 
            contenido={perfil?.email} 
            variante="success" 
            icono="bi bi-envelope-at"
          />
        </Col>
      </Row>
      {/* FILA: EMAIL INSTITUCIONAL (CENTRO) */}
      <Row className="mb-3">
        <Col md={12}>
          <InfoCard 
            titulo="Secretaría / Centro (Email Institucional)" 
            contenido={perfil?.centro?.correoInstitucional || "No disponible"} 
            variante="secondary" 
            icono="bi bi-building-check"
          />
        </Col>
      </Row>

      {/* FILA 4: EMAIL PROFESOR */}
      <Row className="mb-3">
        <Col md={12}>
          <InfoCard 
            titulo="Correo del Profesor Tutor" 
            contenido={perfil?.profesor?.email || "No disponible"} 
            variante="info" 
            icono="bi bi-person-workspace"
          />
        </Col>
      </Row>

      {/* FILA 5: EMAIL TUTOR EMPRESA */}
      <Row className="mb-5">
        <Col md={12}>
          <InfoCard 
            titulo="Correo del Tutor de Empresa" 
            contenido={perfil?.tutorEmpresa?.email || "No disponible"} 
            variante="warning" 
            icono="bi bi-briefcase"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default FichaAlumno;