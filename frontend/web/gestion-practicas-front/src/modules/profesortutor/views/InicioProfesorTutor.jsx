import { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert, Container } from "react-bootstrap";
import InfoCard from "../../../common/components/InfoCard";
import { profesorService } from "../../../services/profesorService"; // Asumo este nombre de service
import { alumnoService } from "../../../services/alumnoService";

const InicioProfesor = ({ user }) => {
  const [datosProfesor, setDatosProfesor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        
        // 1. Traemos los datos del Profesor (Nombre, Centro, etc.)
        const dataProfesor = await profesorService.getProfesorById(user.id);
        
        // 2. Traemos SUS alumnos (Usando la ruta api/alumnos/tutor/{id})
        const listaAlumnos = await alumnoService.getAlumnosByProfesor(user.id);

        setDatosProfesor({
          ...dataProfesor,
          nombreSolo: dataProfesor.nombre || "Profesor",
          nombreCompleto: `${dataProfesor.nombre} ${dataProfesor.apellidos}`,
          nombreCentro: dataProfesor.centro?.nombre || "No asignado",
          localidadCentro: dataProfesor.centro?.localidad || "No disponible",
          codCentro: dataProfesor.centro?.codCentro || "No disponible",
          // Aquí es donde se hace la suma (length del Array de AlumnoDTO)
          numAlumnosDisplay: listaAlumnos ? listaAlumnos.length : 0
        });

        setError(null);
      } catch (err) {
        console.error("Error cargando InicioProfesor:", err);
        setError("Error al obtener el perfil del profesor.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user?.id]);

  if (loading) return (
    <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>
  );

  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;

  return (
    <Container fluid className="px-4">
      <Row className="mb-4">
        <Col className="text-center mt-3">
          <h2 className="fw-bold">Panel de Inicio</h2>
          <p className="text-muted">
            Bienvenido, <strong>{datosProfesor?.nombreSolo}</strong>. 
            Consulta aquí la información de tu perfil y centro educativo.
          </p>
        </Col>
      </Row>

      {/* FILA 1: CENTRO EDUCATIVO */}
      <Row className="mb-3">
        <Col md={12}>
          <InfoCard 
            titulo="Centro Educativo / Entidad" 
            contenido={datosProfesor?.nombreCentro} 
            variante="dark" 
            icono="bi bi-building"
          />
        </Col>
      </Row>

      {/* FILA 2: CÓDIGO CENTRO Y LOCALIDAD */}
      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <InfoCard 
            titulo="Código del Centro" 
            contenido={datosProfesor?.codCentro} 
            variante="secondary" 
            icono="bi bi-card-text"
          />
        </Col>
        <Col md={6}>
          <InfoCard 
            titulo="Localidad" 
            contenido={datosProfesor?.localidadCentro} 
            variante="secondary" 
            icono="bi bi-geo-alt"
          />
        </Col>
      </Row>

      <hr className="my-4" />

      {/* FILA 3: NOMBRE DEL PROFESOR */}
      <Row className="mb-3">
        <Col md={12}>
          <InfoCard 
            titulo="Profesor Tutor" 
            contenido={datosProfesor?.nombreCompleto} 
            variante="primary" 
            icono="bi bi-person-badge"
          />
        </Col>
      </Row>

      {/* FILA 4: CÓDIGO DOCENTE Y Nº ALUMNOS */}
      <Row className="mb-3">
        <Col md={6} className="mb-3 mb-md-0">
          <InfoCard 
            titulo="Código de Profesor" 
            contenido={datosProfesor?.id} 
            variante="info" 
            icono="bi bi-hash"
          />
        </Col>
        <Col md={6}>
          <InfoCard 
            titulo="Alumnos Asignados" 
            contenido={datosProfesor?.numAlumnosDisplay} 
            variante="info" 
            icono="bi bi-people"
          />
        </Col>
      </Row>

      {/* FILA 5: EMAIL */}
      <Row className="mb-5">
        <Col md={12}>
          <InfoCard 
            titulo="Correo Electrónico" 
            contenido={datosProfesor?.email} 
            variante="success" 
            icono="bi bi-envelope-at"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default InicioProfesor;