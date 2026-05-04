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
    <Container fluid className="px-3 px-md-4 pb-5">
      {/* CABECERA: Centrada en móvil, alineada en escritorio */}
      <Row className="mb-4 align-items-center g-3 pt-2">
        <Col xs={12} md={8} className="text-center text-md-start">
          <h2 className="fw-bold text-primary mb-0 fs-3 fs-md-2">Panel de Inicio</h2>
          <p className="text-muted small mb-0">
            Bienvenido, <strong>{datosTutor?.nombreSolo}</strong>. 
            Consulta aquí tu perfil y empresa.
          </p>
        </Col>
      </Row>

      {/* SECCIÓN EMPRESA */}
      <div className="mb-4">
        <Row className="g-3">
          <Col xs={12}>
            <InfoCard 
              titulo="Empresa / Entidad" 
              contenido={datosTutor?.razonSocial} 
              variante="dark" 
              icono="bi bi-building"
            />
          </Col>
          <Col xs={12} md={6}>
            <InfoCard 
              titulo="CIF" 
              contenido={datosTutor?.cif} 
              variante="secondary" 
              icono="bi bi-card-text"
            />
          </Col>
          <Col xs={12} md={6}>
            <InfoCard 
              titulo="Localidad" 
              contenido={datosTutor?.localidad} 
              variante="secondary" 
              icono="bi bi-geo-alt"
            />
          </Col>
        </Row>
      </div>

      <hr className="my-4 opacity-25" />

      {/* SECCIÓN TUTOR */}
      <div className="mb-5">
        <Row className="g-3">
          <Col xs={12}>
            <InfoCard 
              titulo="Tutor de Empresa" 
              contenido={datosTutor?.nombreCompleto} 
              variante="primary" 
              icono="bi bi-person-badge"
            />
          </Col>
          <Col xs={12} md={6}>
            <InfoCard 
              titulo="Código de Tutor" 
              contenido={datosTutor?.id} 
              variante="info" 
              icono="bi bi-hash"
            />
          </Col>
          <Col xs={12} md={6}>
            <InfoCard 
              titulo="Alumnos Asignados" 
              contenido={datosTutor?.numAlumnosDisplay} 
              variante="info" 
              icono="bi bi-people"
            />
          </Col>
          <Col xs={12}>
            <InfoCard 
              titulo="Correo Electrónico" 
              contenido={datosTutor?.email} 
              variante="success" 
              icono="bi bi-envelope-at"
            />
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default InicioTutor;