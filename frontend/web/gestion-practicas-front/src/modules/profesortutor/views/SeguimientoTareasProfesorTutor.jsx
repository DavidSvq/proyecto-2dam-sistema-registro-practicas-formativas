import { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert, Form, InputGroup, Container, Badge, Button, Offcanvas } from "react-bootstrap";
import AppTable from "../../../common/components/AppTable";
import { alumnoService } from "../../../services/alumnoService";
import { tareaService } from "../../../services/tareaService";
import Swal from 'sweetalert2';

const SeguimientoTareasProfesor = ({ user }) => {
  const [alumnos, setAlumnos] = useState([]);
  const [filtroAlumno, setFiltroAlumno] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tareas, setTareas] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [loadingTareas, setLoadingTareas] = useState(false);
  
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroTextoTarea, setFiltroTextoTarea] = useState("");

  const [showDetalle, setShowDetalle] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  const columnasAlu = ['Código', 'Nombre Completo', 'Total Tareas'];
  const llavesAlu = ['id', 'nombreCompleto', 'totalTareas'];

  const columnasTareas = ['ID', 'Título', 'Horas', 'Estado', 'Acciones'];
  const llavesTareas = ['idTarea', 'titulo', 'horasReales', 'estadoBadge', 'acciones'];

  useEffect(() => {
    const fetchAlumnos = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await alumnoService.getAlumnosByProfesor(user.id);
        
        // CÁLCULO DEL TOTAL: Recorremos alumnos y pedimos sus tareas
        const alumnosConContador = await Promise.all(data.map(async (al) => {
          try {
            const tareasAlu = await tareaService.getTareasPorAlumno(al.id);
            return {
              ...al,
              nombreCompleto: `${al.nombre} ${al.apellidos}`,
              totalTareas: tareasAlu ? tareasAlu.length : 0
            };
          } catch {
            return { ...al, nombreCompleto: `${al.nombre} ${al.apellidos}`, totalTareas: 0 };
          }
        }));
        
        setAlumnos(alumnosConContador);
      } catch (err) {
        setError("Error al cargar la lista de alumnos.");
      } finally {
        setLoading(false);
      }
    };
    fetchAlumnos();
  }, [user?.id]);

  const handleVerTareas = async (alumno) => {
    try {
      setLoadingTareas(true);
      setAlumnoSeleccionado(alumno);
      setFiltroEstado("");
      setFiltroTextoTarea("");
      
      const data = await tareaService.getTareasPorAlumno(alumno.id);
      setTareas(data || []);

      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 150);
    } catch (err) {
      console.error("Error al obtener tareas:", err);
    } finally {
      setLoadingTareas(false);
    }
  };

  const handleRevisar = async (idTarea) => {
    try {
      await tareaService.revisarTareaProfesor(idTarea);
      handleVerTareas(alumnoSeleccionado);
    } catch (err) {
      Swal.fire({
        title: "Error al validar",
        text: "Ocurrió un error al validar la tarea.",
        icon: "error",
        confirmButtonColor: "#dc3545"
      });
    }
  };

  const alumnosFiltrados = alumnos.filter(al => 
    al.nombreCompleto.toLowerCase().includes(filtroAlumno.toLowerCase()) ||
    al.id.toLowerCase().includes(filtroAlumno.toLowerCase())
  );

  const tareasFiltradas = tareas.map(t => ({
    ...t,
    // 1. Badge de estado (Mantenemos tu lógica de colores)
    estadoBadge: (
      <Badge bg={
        t.estado === 'VALIDADA' ? 'success' : 
        t.estado === 'COMPLETADA' ? 'primary' : 
        t.estado === 'EN_PROGRESO' ? 'info' : 
        t.estado === 'CANCELADA' ? 'danger' : 'warning text-dark'
      }>
        {t.estado}
      </Badge>
    ),
    
    // 2. Lógica del botón de acción (Aquí está el cambio clave)
    acciones: (
      <div className="d-flex align-items-center gap-2">
        
        {/* BOTÓN PARA ABRIR EL CANVAS (Este es el que te faltaba) */}
        <Button 
          variant="outline-info" 
          size="sm" 
          onClick={() => abrirDetalle(t)}
          title="Ver detalles"
        >
          <i className="bi bi-info-circle"></i>
        </Button>

        {/* El botón de Validar SOLO sale si el estado es exactamente COMPLETADA */}
        {t.estado === 'COMPLETADA' && (
          <Button 
            variant="outline-success" 
            size="sm" 
            onClick={() => handleRevisar(t.idTarea)}
          >
            <i className="bi bi-check-circle"></i> Validar
          </Button>
        )}

        {/* Si ya está VALIDADA */}
        {t.estado === 'VALIDADA' && (
          <small className="text-success fw-bold">
            <i className="bi bi-patch-check-fill"></i>
          </small>
        )}
      </div>
    )
  })).filter(t => {
    // Filtros de búsqueda (Sin fecha, como dijimos antes)
    const coincideEstado = filtroEstado === "" ? true : t.estado === filtroEstado;
    const coincideTexto = filtroTextoTarea === "" ? true : 
      t.titulo.toLowerCase().includes(filtroTextoTarea.toLowerCase());
    
    return coincideEstado && coincideTexto;
  });

  const abrirDetalle = (tarea) => {
    setTareaSeleccionada(tarea);
    setShowDetalle(true);
  };

  if (loading) return <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>;

  return (
    <Container fluid className="px-4 pb-5">
      <Row className="mb-4">
        <Col className="mt-3">
          <h2 className="fw-bold">Seguimiento de Tareas</h2>
          <p className="text-muted">Supervisión y validación de los diarios de trabajo de los alumnos.</p>
        </Col>
      </Row>

      <Row className="mb-3 g-3 bg-light p-3 rounded border mx-0">
        <Col md={12}>
          <Form.Label className="small fw-bold text-secondary">Buscar alumno</Form.Label>
          <InputGroup>
            <InputGroup.Text className="bg-white"><i className="bi bi-person-search"></i></InputGroup.Text>
            <Form.Control 
              placeholder="Nombre o código..." 
              value={filtroAlumno}
              onChange={(e) => setFiltroAlumno(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            <AppTable 
              headers={columnasAlu} 
              data={alumnosFiltrados} 
              accessorKeys={llavesAlu}
              onView={handleVerTareas} 
            />
          </div>
        </Col>
      </Row>

      {alumnoSeleccionado && (
        <Row className="mt-4 animate__animated animate__fadeIn">
          <Col>
            <div className="bg-white p-4 rounded shadow-sm border border-primary">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold text-primary mb-0">Tareas de: {alumnoSeleccionado.nombreCompleto}</h4>
                <Button variant="outline-danger" size="sm" onClick={() => setAlumnoSeleccionado(null)}>Cerrar</Button>
              </div>

              {/* FILTROS TAREAS: TAMAÑOS OPTIMIZADOS */}
              <Row className="mb-3 g-2">
                <Col md={5}> {/* Estado intermedio y texto corto */}
                  <Form.Label className="small fw-bold">Estado</Form.Label>
                  <Form.Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                    <option value="">Todos los estados</option>
                    <option value="ASIGNADA">ASIGNADA</option>
                    <option value="EN_PROGRESO">EN PROGRESO</option>
                    <option value="COMPLETADA">COMPLETADA</option>
                    <option value="VALIDADA">VALIDADA</option>
                    <option value="CANCELADA">CANCELADA</option>
                  </Form.Select>
                </Col>
                <Col md={7}> {/* Buscador grande para títulos largos */}
                  <Form.Label className="small fw-bold">Título de la actividad</Form.Label>
                  <Form.Control 
                    placeholder="Buscar tarea..." 
                    value={filtroTextoTarea} 
                    onChange={(e) => setFiltroTextoTarea(e.target.value)} 
                  />
                </Col>
              </Row>

              {loadingTareas ? (
                <div className="text-center p-4"><Spinner animation="grow" variant="primary" /></div>
              ) : (
                <AppTable 
                  headers={columnasTareas} 
                  data={tareasFiltradas} 
                  accessorKeys={llavesTareas} 
                />
              )}
            </div>
          </Col>
        </Row>
      )}
      {/* PANEL LATERAL DE DETALLES */}
      <Offcanvas show={showDetalle} onHide={() => setShowDetalle(false)} placement="end" className="shadow-lg">
        <Offcanvas.Header closeButton className="bg-light border-bottom">
          <Offcanvas.Title className="fw-bold text-primary">
            Detalle de la Tarea #{tareaSeleccionada?.idTarea}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {tareaSeleccionada && (
            <div className="d-flex flex-column gap-4">
              <div>
                <label className="text-muted small fw-bold text-uppercase">Título de la Actividad</label>
                <p className="fs-5 fw-semibold">{tareaSeleccionada.titulo}</p>
              </div>

              <div>
                <label className="text-muted small fw-bold text-uppercase">Descripción (Tutor)</label>
                <div className="p-3 bg-light rounded border">
                  {tareaSeleccionada.descripcion || 'Sin descripción detallada.'}
                </div>
              </div>

              <Row>
                <Col>
                  <label className="text-muted small fw-bold text-uppercase">Horas Previstas</label>
                  <p className="fw-bold text-secondary">{tareaSeleccionada.horasPrevistas || 0}h</p>
                </Col>
                <Col>
                  <label className="text-muted small fw-bold text-uppercase">Horas Reales</label>
                  <p className="fw-bold text-primary">{tareaSeleccionada.horasReales || 0}h</p>
                </Col>
              </Row>

              <div>
                <label className="text-muted small fw-bold text-uppercase">Observaciones del Alumno</label>
                <p className="fst-italic text-dark">
                  {tareaSeleccionada.observaciones || 'El alumno no ha dejado comentarios.'}
                </p>
              </div>

              <div className="mt-auto border-top pt-3">
                <Badge bg={tareaSeleccionada.estado === 'VALIDADA' ? 'success' : 'primary'} className="p-2 w-100">
                  Estado Actual: {tareaSeleccionada.estado}
                </Badge>
              </div>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default SeguimientoTareasProfesor;