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
    <Container fluid className="px-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Mis Alumnos en Prácticas</h2>
          <p className="text-muted">Listado informativo de alumnos bajo su supervisión.</p>
        </Col>
      </Row>

      {/* BLOQUE DE BÚSQUEDA */}
      <Row className="mb-3 g-3 bg-light p-3 rounded border mx-0">
        <Col md={12}>
          <Form.Label className="small fw-bold text-secondary">Buscar por nombre o ID</Form.Label>
          <InputGroup>
            <InputGroup.Text className="bg-white"><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control 
              placeholder="Buscar alumno..." 
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            {/* 3. AppTable sin acciones (informativa) */}
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