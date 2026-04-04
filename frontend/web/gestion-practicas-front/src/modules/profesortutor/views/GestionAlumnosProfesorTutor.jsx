import { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert, Form, InputGroup, Container, Badge, Button } from "react-bootstrap";
import AppTable from "../../../common/components/AppTable";
import { asistenciaService } from "../../../services/asistenciaService";
import { alumnoService } from "../../../services/alumnoService";

const GestionAlumnosProfesor = ({ user }) => {
  const [alumnos, setAlumnos] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para Asistencias
  const [asistencias, setAsistencias] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [loadingAsis, setLoadingAsis] = useState(false);
  const [filtroFecha, setFiltroFecha] = useState(""); // Nuevo estado para fecha

  const columnasAlu = ['Código', 'Nombre Completo', 'Email', 'Horas Totales'];
  const llavesAlu = ['id', 'nombreCompleto', 'email', 'horasTotales'];

  useEffect(() => {
    const fetchAlumnos = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await alumnoService.getAlumnosByProfesor(user.id);
        const aplanados = data.map(al => ({
          ...al,
          nombreCompleto: `${al.nombre} ${al.apellidos}`,
          // Si el back no lo manda, ponemos 0 para que no salga vacío
          horasTotales: al.horasTotales || 0 
        }));
        setAlumnos(aplanados);
      } catch (err) {
        setError("Error al cargar la lista de alumnos.");
      } finally {
        setLoading(false);
      }
    };
    fetchAlumnos();
  }, [user?.id]);

  const handleVerAsistencia = async (alumno) => {
    try {
      setLoadingAsis(true);
      setAlumnoSeleccionado(alumno);
      setFiltroFecha(""); // Limpiamos filtro de fecha al cambiar de alumno
      const data = await asistenciaService.getHistorial(alumno.id);
      setAsistencias(data);
      
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 150);
    } catch (err) {
      console.error("Error al obtener historial:", err);
    } finally {
      setLoadingAsis(false);
    }
  };

  // Función para cerrar la tabla inferior
  const cerrarAsistencia = () => {
    setAlumnoSeleccionado(null);
    setAsistencias([]);
  };

  // Filtrado de la tabla superior (Alumnos)
  const alumnosFiltrados = alumnos.filter(al => 
    al.nombreCompleto.toLowerCase().includes(filtroTexto.toLowerCase()) ||
    al.id.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  // Filtrado de la tabla inferior (Asistencias por fecha)
  const asistenciasFiltradas = asistencias.filter(as => 
    filtroFecha === "" ? true : as.fecha.includes(filtroFecha)
  );

  if (loading) return <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;

  return (
    <Container fluid className="px-4 pb-5">
      <Row className="mb-4">
        <Col className="mt-3">
          <h2 className="fw-bold">Mis Alumnos en Prácticas</h2>
          <p className="text-muted">Supervisión de alumnos y control de horas de FCT.</p>
        </Col>
      </Row>

      {/* BUSCADOR ALUMNOS */}
      <Row className="mb-3 g-3 bg-light p-3 rounded border mx-0">
        <Col md={12}>
          <Form.Label className="small fw-bold text-secondary">Buscar alumno</Form.Label>
          <InputGroup>
            <InputGroup.Text className="bg-white"><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control 
              placeholder="Nombre o Código..." 
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* TABLA PRINCIPAL */}
      <Row className="mb-5">
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            <AppTable 
              headers={columnasAlu} 
              data={alumnosFiltrados} 
              accessorKeys={llavesAlu}
              onView={handleVerAsistencia} 
            />
          </div>
        </Col>
      </Row>

      {/* SECCIÓN DETALLE ASISTENCIA */}
      {alumnoSeleccionado && (
        <Row className="mt-4 animate__animated animate__fadeIn">
          <Col>
            <div className="bg-white p-4 rounded shadow-sm border border-primary">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold text-primary mb-0">
                    <i className="bi bi-calendar-check me-2"></i>
                    Asistencias: {alumnoSeleccionado.nombreCompleto}
                  </h4>
                  <small className="text-muted">Total acumulado: <strong>{alumnoSeleccionado.horasTotales}h</strong></small>
                </div>
                <Button variant="outline-danger" size="sm" onClick={cerrarAsistencia}>
                  <i className="bi bi-x-lg me-1"></i> Cerrar Detalle
                </Button>
              </div>

              {/* BUSCADOR POR FECHA (Encima de la tabla de asistencia) */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">Filtrar por fecha:</Form.Label>
                    <Form.Control 
                      type="date" 
                      value={filtroFecha}
                      onChange={(e) => setFiltroFecha(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {loadingAsis ? (
                <div className="text-center p-4"><Spinner animation="grow" variant="primary" /></div>
              ) : (
                <AppTable 
                  headers={['Fecha', 'Entrada', 'Salida', 'Horas', 'Observaciones']} 
                  data={asistenciasFiltradas} 
                  accessorKeys={['fecha', 'horaEntrada', 'horaSalida', 'horasDiarias', 'observaciones']} 
                />
              )}
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default GestionAlumnosProfesor;