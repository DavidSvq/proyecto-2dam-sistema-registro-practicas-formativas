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
    <Container fluid className="px-3 px-md-4 pb-5">
      {/* CABECERA: Adaptable */}
      <Row className="mb-4 align-items-center g-3 pt-2">
        <Col xs={12} className="text-center text-md-start">
          <h2 className="fw-bold text-primary mb-0 fs-3 fs-md-2">Panel de Inicio</h2>
          <p className="text-muted small mb-0">
            Bienvenido, <strong>{datosProfesor?.nombreSolo}</strong>. 
            Consulta aquí la información de tu perfil y centro educativo.
          </p>
        </Col>
      </Row>

      {/* SECCIÓN: DATOS DEL CENTRO (Protección contra desbordamiento) */}
      <Row className="g-3 mb-3">
        <Col xs={12}>
          <div className="shadow-sm rounded overflow-hidden">
            <InfoCard 
              titulo="Centro Educativo / Entidad" 
              contenido={datosProfesor?.nombreCentro} 
              variante="dark" 
              icono="bi bi-building"
            />
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="shadow-sm rounded h-100 overflow-hidden">
            <InfoCard 
              titulo="Código del Centro" 
              contenido={datosProfesor?.codCentro} 
              variante="secondary" 
              icono="bi bi-card-text"
            />
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="shadow-sm rounded h-100 overflow-hidden">
            <InfoCard 
              titulo="Localidad" 
              contenido={datosProfesor?.localidadCentro} 
              variante="secondary" 
              icono="bi bi-geo-alt"
            />
          </div>
        </Col>
      </Row>

      <hr className="my-4 opacity-25" />

      {/* SECCIÓN: DATOS DEL PROFESOR */}
      <Row className="g-3 mb-5">
        <Col xs={12}>
          <div className="shadow-sm rounded overflow-hidden">
            <InfoCard 
              titulo="Profesor Tutor" 
              contenido={datosProfesor?.nombreCompleto} 
              variante="primary" 
              icono="bi bi-person-badge"
            />
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="shadow-sm rounded h-100 overflow-hidden">
            <InfoCard 
              titulo="Código de Profesor" 
              contenido={datosProfesor?.id} 
              variante="info" 
              icono="bi bi-hash"
            />
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="shadow-sm rounded h-100 overflow-hidden">
            <InfoCard 
              titulo="Alumnos Asignados" 
              contenido={datosProfesor?.numAlumnosDisplay} 
              variante="info" 
              icono="bi bi-people"
            />
          </div>
        </Col>
        <Col xs={12}>
          <div className="shadow-sm rounded overflow-hidden">
            <InfoCard 
              titulo="Correo Electrónico" 
              contenido={datosProfesor?.email} 
              variante="success" 
              icono="bi bi-envelope-at"
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default InicioProfesor;