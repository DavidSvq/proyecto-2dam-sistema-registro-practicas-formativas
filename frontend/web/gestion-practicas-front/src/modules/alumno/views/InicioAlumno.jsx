import { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert, Container } from "react-bootstrap";
import InfoCard from "../../../common/components/InfoCard";
import { alumnoService } from "../../../services/alumnoService";

const InicioAlumno = ({ user }) => {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const HORAS_TOTALES_FCT = 370;

  useEffect(() => {
    const cargarDashboard = async () => {
      if (!user?.id) {
        setError("No se ha detectado el ID del alumno.");
        setLoading(false);
        return;
      }

      try {
        const data = await alumnoService.getAlumnoById(user.id);
        
        // Aplanado de datos para InfoCards
        const horasAcumuladas = data.horasTotales || 0;
        const porcentaje = ((horasAcumuladas / HORAS_TOTALES_FCT) * 100).toFixed(1);

        setDatos({
          nombre: data.nombre,
          horasAcumuladas,
          porcentaje: `${porcentaje}%`,
          // Datos del Centro y Profesor
          centro: data.centro?.nombre || "No asignado",
          profesor: data.profesor ? `${data.profesor.nombre} ${data.profesor.apellidos}` : "No asignado",
          emailProfesor: data.profesor?.email || "Sin email",
          // Datos de la Empresa
          empresa: data.empresa?.razonSocial || "Sin empresa asignada",
          tutorEmpresa: data.tutorEmpresa ? `${data.tutorEmpresa.nombre} ${data.tutorEmpresa.apellidos}` : "No asignado",
          emailTutor: data.tutorEmpresa?.email || "Sin email"
        });
      } catch (err) {
        setError("Error al cargar los datos del dashboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarDashboard();
  }, [user?.id]);

  if (loading) return <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;

  return (
    <Container fluid className="px-2 px-md-4 pb-5"> 
      {/* 1. CABECERA DE BIENVENIDA */}
      <Row className="mb-4 pt-3">
        <Col className="text-center text-md-start"> 
          <h2 className="fw-bold text-primary fs-3 fs-md-2">Panel de Inicio</h2>
          <p className="text-muted small">
            ¡Bienvenido, <strong>{datos?.nombre}</strong>! Resumen de tu estado en la FCT.
          </p>
        </Col>
      </Row>

      {/* 2. FILA DE MÉTRICAS (PROGRESO) */}
      <Row className="mb-4 g-3">
        <Col xs={12} sm={6} md={4}>
          <InfoCard 
            titulo="Horas Acumuladas" 
            contenido={`${datos?.horasAcumuladas} h`} 
            variante="primary" 
            icono="bi bi-clock-history"
          />
        </Col>
        <Col xs={12} sm={6} md={4}>
          <InfoCard 
            titulo="Objetivo FCT" 
            contenido={`${HORAS_TOTALES_FCT} h`} 
            variante="dark" 
            icono="bi bi-flag"
          />
        </Col>
        <Col xs={12} md={4}>
          <InfoCard 
            titulo="Progreso Total" 
            contenido={datos?.porcentaje} 
            variante="success" 
            icono="bi bi-graph-up-arrow"
          />
        </Col>
      </Row>

      <hr className="my-4" />
      <h5 className="mb-4 fw-bold text-uppercase small text-muted text-center text-md-start">
        Información de Referencia
      </h5>

      {/* BLOQUES DE INFORMACIÓN CON ESPACIADO TÁCTIL */}
      <Row className="g-3 mb-5">
        <Col xs={12}>
          <InfoCard 
            titulo="Centro Educativo" 
            contenido={datos?.centro} 
            variante="secondary" 
            icono="bi bi-geo-alt"
          />
        </Col>
        <Col xs={12}>
          <InfoCard 
            titulo="Profesor Tutor (Centro)" 
            contenido={datos?.profesor} 
            variante="info" 
            icono="bi bi-person-workspace"
          />
        </Col>
        <Col xs={12}>
          <InfoCard 
            titulo="Empresa de Prácticas" 
            contenido={datos?.empresa} 
            variante="warning" 
            icono="bi bi-building"
          />
        </Col>
        <Col xs={12}>
          <InfoCard 
            titulo="Tutor de Empresa" 
            contenido={datos?.tutorEmpresa} 
            variante="info" 
            icono="bi bi-person-badge"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default InicioAlumno;