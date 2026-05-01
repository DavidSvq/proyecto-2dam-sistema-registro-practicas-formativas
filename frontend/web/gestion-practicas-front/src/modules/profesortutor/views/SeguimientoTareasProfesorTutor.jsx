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
    <Container fluid className="px-3 px-md-4 pb-5">
      {/* CABECERA: Adaptable */}
      <Row className="mb-4 align-items-center g-3 pt-2">
        <Col xs={12} md={8} className="text-center text-md-start">
          <h2 className="fw-bold text-primary mb-0 fs-3 fs-md-2">Seguimiento de Tareas</h2>
          <p className="text-muted small mb-0">Supervisión y validación de los diarios de trabajo.</p>
        </Col>
      </Row>

      {/* BUSCADOR ALUMNO: Estilo consistente */}
      <Row className="mb-4 g-3 bg-light p-3 rounded border mx-0 shadow-sm">
        <Col xs={12}>
          <Form.Label className="small fw-bold text-secondary">Buscar alumno</Form.Label>
          <InputGroup>
            <InputGroup.Text className="bg-white border-end-0">
              <i className="bi bi-person-search text-primary"></i>
            </InputGroup.Text>
            <Form.Control 
              className="border-start-0"
              placeholder="Nombre o código..." 
              value={filtroAlumno}
              onChange={(e) => setFiltroAlumno(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* TABLA PRINCIPAL: Con scroll horizontal preventivo */}
      <Row className="mb-5">
        <Col xs={12}>
          <div className="bg-white rounded shadow-sm border overflow-hidden">
            <AppTable 
              headers={columnasAlu} 
              data={alumnosFiltrados} 
              accessorKeys={llavesAlu}
              onView={handleVerTareas} 
            />
          </div>
        </Col>
      </Row>

      {/* SECCIÓN DETALLE TAREAS */}
      {alumnoSeleccionado && (
        <Row className="mt-4 animate__animated animate__fadeIn">
          <Col xs={12}>
            <div className="bg-white p-3 p-md-4 rounded shadow-sm border border-primary">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
                <h4 className="fw-bold text-primary mb-0 fs-5 fs-md-4 text-center text-md-start text-break">
                  Tareas de: {alumnoSeleccionado.nombreCompleto}
                </h4>
                <Button variant="outline-danger" size="sm" onClick={() => setAlumnoSeleccionado(null)} className="w-100 w-md-auto">
                  <i className="bi bi-x-lg me-1"></i>Cerrar Detalle
                </Button>
              </div>

              {/* FILTROS TAREAS: Optimizados para apilamiento */}
              <Row className="mb-3 g-3">
                <Col xs={12} md={5}>
                  <Form.Label className="small fw-bold text-secondary">Estado</Form.Label>
                  <Form.Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                    <option value="">Todos los estados</option>
                    <option value="ASIGNADA">ASIGNADA</option>
                    <option value="EN_PROGRESO">EN PROGRESO</option>
                    <option value="COMPLETADA">COMPLETADA</option>
                    <option value="VALIDADA">VALIDADA</option>
                    <option value="CANCELADA">CANCELADA</option>
                  </Form.Select>
                </Col>
                <Col xs={12} md={7}>
                  <Form.Label className="small fw-bold text-secondary">Título de la actividad</Form.Label>
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
                <div className="overflow-hidden border rounded mt-2">
                  <AppTable 
                    headers={columnasTareas} 
                    data={tareasFiltradas} 
                    accessorKeys={llavesTareas} 
                  />
                </div>
              )}
            </div>
          </Col>
        </Row>
      )}

      {/* PANEL LATERAL: Ajustado para lectura móvil */}
      <Offcanvas show={showDetalle} onHide={() => setShowDetalle(false)} placement="end" className="shadow-lg w-100-mobile">
        <Offcanvas.Header closeButton className="bg-light border-bottom">
          <Offcanvas.Title className="fw-bold text-primary fs-5">
            Detalle Tarea #{tareaSeleccionada?.idTarea}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-3 p-md-4">
          {tareaSeleccionada && (
            <div className="d-flex flex-column gap-4 text-break">
              <div>
                <label className="text-muted small fw-bold text-uppercase d-block mb-1">Título de la Actividad</label>
                <p className="fs-5 fw-semibold mb-0">{tareaSeleccionada.titulo}</p>
              </div>

              <div>
                <label className="text-muted small fw-bold text-uppercase d-block mb-1">Descripción</label>
                <div className="p-3 bg-light rounded border small">
                  {tareaSeleccionada.description || 'Sin descripción.'}
                </div>
              </div>

              <Row className="g-2">
                <Col xs={6}>
                  <label className="text-muted small fw-bold text-uppercase d-block mb-1">Previstas</label>
                  <p className="fw-bold text-secondary mb-0">{tareaSeleccionada.horasPrevistas || 0}h</p>
                </Col>
                <Col xs={6}>
                  <label className="text-muted small fw-bold text-uppercase d-block mb-1">Reales</label>
                  <p className="fw-bold text-primary mb-0">{tareaSeleccionada.horasReales || 0}h</p>
                </Col>
              </Row>

              <div>
                <label className="text-muted small fw-bold text-uppercase d-block mb-1">Observaciones</label>
                <p className="fst-italic text-dark small border-start ps-2 border-primary">
                  "{tareaSeleccionada.observaciones || 'Sin comentarios.'}"
                </p>
              </div>

              <div className="mt-auto pt-3">
                <Badge bg={tareaSeleccionada.estado === 'VALIDADA' ? 'success' : 'primary'} className="p-3 w-100 fs-6">
                  {tareaSeleccionada.estado}
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