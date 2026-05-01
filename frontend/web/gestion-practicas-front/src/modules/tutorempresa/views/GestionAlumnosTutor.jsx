import { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert, Form, InputGroup, Container } from "react-bootstrap";
import AppTable from "../../../common/components/AppTable";
import { tutorEmpresaService } from "../../../services/tutorEmpresaService";

const GestionAlumnosTutor = ({ user }) => {
  const [alumnos, setAlumnos] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Columnas decididas: Código, Nombre Completo, Email, Profesor Tutor y Horas
  const columnas = ['Código', 'Nombre Completo', 'Email', 'Profesor Tutor', 'Horas'];
  const llaves = ['id', 'nombreCompleto', 'email', 'profesorNombre', 'horasTotales'];

  useEffect(() => {
    const fetchAlumnos = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        // Usamos TU nombre de servicio: getMisAlumnos
        const data = await tutorEmpresaService.getMisAlumnos(user.id);
        
        const alumnosAplanados = data.map(alumno => ({
          ...alumno,
          // La llave 'id' ya viene en el objeto alumno
          nombreCompleto: `${alumno.nombre} ${alumno.apellidos}`,
          profesorNombre: alumno.profesor 
            ? `${alumno.profesor.nombre} ${alumno.profesor.apellidos}` 
            : "Sin asignar",
          horasTotales: alumno.horasTotales || 0 
        }));

        setAlumnos(alumnosAplanados);
      } catch (err) {
        setError("Error al cargar la lista de alumnos.");
        console.error("Error en la petición:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumnos();
  }, [user?.id]);

  // 2. Lógica de filtrado para el buscador de texto
  const alumnosFiltrados = alumnos.filter(al => 
    al.nombreCompleto.toLowerCase().includes(filtroTexto.toLowerCase()) ||
    al.id.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  if (loading) return (
    <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>
  );

  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;

  return (
    <Container fluid className="px-3 px-md-4 pb-5">
      {/* CABECERA: Adaptable con alineación y tamaños consistentes */}
      <Row className="mb-4 align-items-center g-3 pt-2">
        <Col xs={12} md={8} className="text-center text-md-start">
          <h2 className="fw-bold text-primary mb-0 fs-3 fs-md-2">Mis Alumnos en Prácticas</h2>
          <p className="text-muted small mb-0">Listado informativo de alumnos bajo su supervisión.</p>
        </Col>
      </Row>

      {/* BLOQUE DE BÚSQUEDA: Estilo corregido y sombra suave */}
      <Row className="mb-4 g-3 bg-light p-3 rounded border mx-0 shadow-sm">
        <Col xs={12}>
          <Form.Label className="small fw-bold text-secondary">Buscar por nombre o ID</Form.Label>
          <InputGroup>
            <InputGroup.Text className="bg-white border-end-0">
              <i className="bi bi-search text-primary"></i>
            </InputGroup.Text>
            <Form.Control 
              className="border-start-0"
              placeholder="Buscar alumno..." 
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* TABLA: Contenedor con protección de desbordamiento */}
      <Row>
        <Col xs={12}>
          <div className="bg-white rounded shadow-sm border overflow-hidden">
            <AppTable 
              headers={columnas} 
              data={alumnosFiltrados} 
              accessorKeys={llaves} 
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default GestionAlumnosTutor;