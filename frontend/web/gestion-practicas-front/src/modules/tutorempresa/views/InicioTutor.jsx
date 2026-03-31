import { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import InfoCard from "../../../common/components/InfoCard";
import { tutorEmpresaService } from "../../../services/tutorEmpresaService";

const InicioTutor = ({ user }) => {
  const [datosTutor, setDatosTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      // 1. Verificamos que el ID existe antes de llamar
      if (!user?.id) {
        setError("No se encontró el ID del usuario.");
        setLoading(false);
        return;
      }

      try {
        const data = await tutorEmpresaService.getTutorPerfil(user.id);
        
        // 2. Aplicamos el Flattening asegurando que no haya undefined
        setDatosTutor({
          ...data,
          razonSocial: data.empresa?.razonSocial || "No disponible",
          localidad: data.empresa?.localidad || "No disponible",
          cif: data.empresa?.cif || "No disponible",
          nombreDisplay: data.nombre || "Usuario",
          numAlumnosDisplay: data.numAlumnos !== undefined ? data.numAlumnos : 0
        });
      } catch (err) {
        setError("Error de conexión con el servidor (8088)");
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
    <>
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Panel de Inicio</h2>
          {/* Aquí forzamos que si no hay dato, no pinte nada en blanco */}
          <p className="text-muted">
            Bienvenido, <strong>{datosTutor?.nombreDisplay}</strong>. 
            Gestionando FCT en <strong>{datosTutor?.razonSocial}</strong>.
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <InfoCard 
            titulo="Mis Alumnos" 
            contenido={datosTutor?.numAlumnosDisplay} 
            variante="primary" 
            icono="bi bi-person-badge"
          />
        </Col>
        <Col md={4} className="mb-3">
          <InfoCard 
            titulo="Ubicación" 
            contenido={datosTutor?.localidad} 
            variante="info" 
            icono="bi bi-geo-alt"
          />
        </Col>
        <Col md={4} className="mb-3">
          <InfoCard 
            titulo="Contacto" 
            contenido={datosTutor?.email} 
            variante="success" 
            icono="bi bi-envelope"
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            <h5>Detalles de la Empresa</h5>
            <p className="mb-1"><strong>CIF:</strong> {datosTutor?.cif}</p>
            <p className="text-muted small">ID de Tutor: {datosTutor?.id}</p>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default InicioTutor;