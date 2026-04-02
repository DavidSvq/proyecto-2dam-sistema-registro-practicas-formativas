import { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert, Container } from "react-bootstrap";
import InfoCard from "../../../common/components/InfoCard";
import { tutorEmpresaService } from "../../../services/tutorEmpresaService";

const InicioTutor = ({ user }) => {
  const [datosTutor, setDatosTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!user?.id) {
        setError("No se encontró el ID del usuario.");
        setLoading(false);
        return;
      }

      try {
        const data = await tutorEmpresaService.getTutorPerfil(user.id);
        
        const listaAlumnos = await tutorEmpresaService.getMisAlumnos(user.id);
        
        setDatosTutor({
          ...data,
          // Forzamos la extracción de nombre y apellidos
          nombreSolo: data.nombre || "Usuario", 
          nombreCompleto: (data.nombre && data.apellidos) 
            ? `${data.nombre} ${data.apellidos}` 
            : "Nombre no disponible",
          
          // Datos de empresa
          razonSocial: data.empresa?.razonSocial || "No asignada",
          localidad: data.empresa?.localidad || "No disponible",
          cif: data.empresa?.cif || "No disponible",
          
          // Alumnos
          numAlumnosDisplay: listaAlumnos ? listaAlumnos.length : 0
        });
      } catch (err) {
        setError("Error al conectar con el servidor para obtener el perfil.");
        console.error(err);
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
        <Col>
          <h2 className="fw-bold">Panel de Inicio</h2>
          <p className="text-muted">
            Bienvenido, <strong>{datosTutor?.nombreSolo}</strong>. 
            Consulta aquí la información de tu perfil y empresa.
          </p>
        </Col>
      </Row>

      {/* FILA 1: RAZÓN SOCIAL */}
      <Row className="mb-3">
        <Col md={12}>
          <InfoCard 
            titulo="Empresa / Entidad" 
            contenido={datosTutor?.razonSocial} 
            variante="dark" 
            icono="bi bi-building"
          />
        </Col>
      </Row>

      {/* FILA 2: CIF Y LOCALIDAD */}
      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <InfoCard 
            titulo="CIF" 
            contenido={datosTutor?.cif} 
            variante="secondary" 
            icono="bi bi-card-text"
          />
        </Col>
        <Col md={6}>
          <InfoCard 
            titulo="Localidad" 
            contenido={datosTutor?.localidad} 
            variante="secondary" 
            icono="bi bi-geo-alt"
          />
        </Col>
      </Row>

      <hr className="my-4" />

      {/* FILA 3: NOMBRE DEL TUTOR */}
      <Row className="mb-3">
        <Col md={12}>
          <InfoCard 
            titulo="Tutor de Empresa" 
            contenido={datosTutor?.nombreCompleto} 
            variante="primary" 
            icono="bi bi-person-badge"
          />
        </Col>
      </Row>

      {/* FILA 4: CÓDIGO Y Nº ALUMNOS */}
      <Row className="mb-3">
        <Col md={6} className="mb-3 mb-md-0">
          <InfoCard 
            titulo="Código de Tutor" 
            contenido={datosTutor?.id} 
            variante="info" 
            icono="bi bi-hash"
          />
        </Col>
        <Col md={6}>
          <InfoCard 
            titulo="Alumnos Asignados" 
            contenido={datosTutor?.numAlumnosDisplay} 
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
            contenido={datosTutor?.email} 
            variante="success" 
            icono="bi bi-envelope-at"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default InicioTutor;